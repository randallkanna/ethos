import React, { Component } from 'react'
import FundContract from '../../../build/contracts/Fund.json'
import getWeb3 from '../../utils/getWeb3'
import ipfs from '../../ipfs';
import firebase from '../../firebase.js'

import Nav from '../../Navbar.js';
import { Button, Row, Grid, Col, Media, Modal, } from 'react-bootstrap'

import '../../css/oswald.css'
import '../../css/open-sans.css'
import '../../css/pure-min.css'
import './style.css'

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      web3: null,
      contract: null,
      account: null,
      fundName: '',
      fundDescription: '',
      fundDonation: 0,
      ipfsHash: '',
      fundCount: '',
      funds: {},
      completeFundList: [],
      ipfsBuffer: null,
      ipfsDocumentHash: '',
      activeDonateModal: null,
    }

    this.fundsRef = firebase.database().ref('funds');

    this.setStateValues = this.setStateValues.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.sendFunds = this.sendFunds.bind(this);
    this.captureFile = this.captureFile.bind(this);
    this.clickHandler = this.clickHandler.bind(this);
    this.hideDonateModal = this.hideDonateModal.bind(this);
    this.addHash = this.addHash.bind(this);
  }

  componentDidMount() {
    const fundsRef = firebase.database().ref('funds');
     fundsRef.on('value', (snapshot) => {
       let funds = snapshot.val();
       let newState = [];
       for (let fund in funds) {
         newState.push({
           hash: funds[fund].hash
         });
       }

       this.setState({
         funds: newState
       });

       this.showFundsCount();
       this.showAllFunds();
     });
  }

  componentWillMount() {
    getWeb3
    .then(results => {
      this.setState({
        web3: results.web3
      })

      this.instantiateContract();
    })
    .catch(() => {
      console.log('Error finding web3.')
    })
  }

  componentWillUnmount(){
    firebase.removeBinding(this.fundsRef)
  }

  instantiateContract() {
    /*
     * Normally these functions would be called in the context of a
     * state management library, but for convenience I've placed them here.
     */
    const contract = require('truffle-contract')
    const fund = contract(FundContract)
    fund.setProvider(this.state.web3.currentProvider)

    this.state.web3.eth.getAccounts((error, accounts) => {
      fund.deployed().then((instance) => {
        this.fundInstance = instance
        this.setState({ account: accounts[0] });
      }).then((result) => {
        return this.fundInstance.get.call(accounts[0])
      })
    })
  }

  clickHandler(e, index) {
    this.setState({ activeDonateModal: index })
  }

  hideDonateModal() {
    this.setState({ activeDonateModal: null })
  }

  setStateValues(event) {
     this.setState({[event.target.name]: event.target.value})
  }

  addHash(hash) {
    this.fundsRef.push({
      hash,
    })
  }

  captureFile(event) {
    event.preventDefault()
    const file = event.target.files[0]
    const reader = new window.FileReader()
    reader.readAsArrayBuffer(file)
    reader.onloadend = () => {
      this.setState({ ipfsBuffer: Buffer(reader.result) })
    }
  }

  showAllFunds() {
    const ipfsHashList = this.state.funds;
    const ipfsFundData = [];

    if (ipfsHashList.length > 0) {
      var results = new Promise((resolve, reject) => {
        ipfsHashList.map(function(ipfsHash) {
          ipfs.files.cat(ipfsHash.hash, function (err, files) {
            if (err) {
              console.error(err);
              return;
            }

            const fund = JSON.parse(files);

            ipfsFundData.push(fund)

            resolve();
          })
        })
      });

      results.then(() => {
        this.setState({ completeFundList: ipfsFundData });
      });
    }
  }

  showFundsCount() {
    // saving gas costs by storying the ipfs hashes in firebase.
    return this.setState({fundCount: this.state.funds.length})
  }

  sendFunds(event, address) {
    event.preventDefault();
    var inWei = this.state.web3.toWei(this.state.fundDonation, 'ether');

    this.fundInstance.donateToFund(address,  {from: this.state.account, value: inWei});
  }

  showFundsRaised(addr) {
    const fundsRaised = this.fundInstance.getFundsRaised(addr);

    if (fundsRaised < 0) {
      return 0;
    } else {
      return fundsRaised;
    }
  }

  onSubmit(event) {
    event.preventDefault();

    var results = new Promise((resolve, reject) => {
      ipfs.files.add(this.state.ipfsBuffer, (error, result) => {
        if(error) {
          console.error(error)
          return
        }

        this.setState({ ipfsDocumentHash: result[0].hash });
        resolve();
      })
    })

    results.then(() => {
      const hashData = JSON.stringify({
        name: this.state.fundName,
        description: this.state.fundDescription,
        address: this.state.account,
        fileUpload: this.state.ipfsDocumentHash,
      })

      ipfs.add(Buffer.from(hashData), (err, result) => {
        if (err) {
          console.error(err);
          return;
        }

        this.fundInstance.createFund(result[0].hash, {from: this.state.account})
        this.setState({ funds: [...this.state.funds, result[0].hash] })
        this.addHash(result[0].hash);
        this.showAllFunds();
        this.showFundsCount();
        return this.setState({ipfsHash: result[0].hash});
      });
    });
  }

  render() {
      const fundItems = this.state.completeFundList.map((fund, index) =>
        <div key={index}>
          <Media>
            <Media.Left>
              <Button bsStyle="primary" bsSize="small" onClick={e => this.clickHandler(e, index)}>
                Donate
              </Button>

              <Modal id={index} show={this.state.activeDonateModal === index} onHide={this.hideDonateModal}>
                <Modal.Header closeButton>
                  <Modal.Title>Donate</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <div> Want to donate to {fund.name}?
                    <form onSubmit={(e) => {this.sendFunds(e, fund.address)}}>
                    <input type="number" name="fundDonation" value={this.state.fundDonation} onChange={(e) => this.setStateValues(e)} />
                    <input type="submit" / >
                    </form>
                  </div>
                 </Modal.Body>
                <Modal.Footer>
                </Modal.Footer>
              </Modal>
            </Media.Left>
            <Media.Body>
              <Media.Heading>{fund.name}</Media.Heading>
              <p>
                {fund.description}
              </p>
              <h3>This fund has raised {this.showFundsRaised(fund.address)} to date.</h3>
              <a href={`https://ipfs.io/ipfs/${fund.fileUpload}`}>Additional File from Fund</a>
            </Media.Body>
          </Media>
        </div>
      );

      // TODO: move fundCount into Nav? 'We're funding ___ projects!

    return (
      <div className="nav-bar-custom">
        <Nav/>
        <div>
          <Grid>
            <Row className="show-grid">
              <Col md={8}>
                <h3>{this.state.fundCount || 0} funds to contribute to currently.</h3>

                <h3>Funds</h3>
                  {fundItems}
              </Col>
              <Col md={4}>
                  <h4>Submit a new Fund Proposal</h4>
                  <form onSubmit={this.onSubmit}>
                    Fund Name: <input type="text" name="fundName" value={this.state.fundName} onChange={(e) => this.setStateValues(e)} />
                    Fund Description: <input type="text" name="fundDescription" value={this.state.fundDescription} onChange={(e) => this.setStateValues(e)} />
                    Document/Whitepaper/Image Upload: <input type="file" onChange={this.captureFile} />
                    <input type="submit" />
                  </form>
              </Col>
            </Row>
          </Grid>
        </div>
      </div>
    );
  }
}

export default App
