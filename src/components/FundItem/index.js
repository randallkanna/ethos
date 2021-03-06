import React, { Component } from 'react'
import getWeb3 from '../../utils/getWeb3'
import FundContract from '../../../build/contracts/Fund.json'
import firebase from '../../firebase.js'
import { Button, Row, Grid, Col, Media, Modal, } from 'react-bootstrap'

export class FundItem extends Component {
  constructor(props) {
    super(props)

    this.state = {
      activeDonateModal: null,
      fundDonation: 0,
      currentFundsRaised: 0,
      web3: null,
      isFundOwner: false,
    }

    this.fundsRef = firebase.database().ref('funds');

    this.clickHandler = this.clickHandler.bind(this);
    this.hideDonateModal = this.hideDonateModal.bind(this);
    this.sendFunds = this.sendFunds.bind(this);
    this.setStateValues = this.setStateValues.bind(this);
    this.updateFundsRaised = this.updateFundsRaised.bind(this);
    this.deleteFund = this.deleteFund.bind(this);
    this.findCurrentAccount = this.findCurrentAccount.bind(this);
    this.renderDeleteFundButton = this.renderDeleteFundButton.bind(this);
  }

  instantiateContract() {
    const contract = require('truffle-contract')
    const fund = contract(FundContract)
    fund.setProvider(this.state.web3.currentProvider)

    this.state.web3.eth.getAccounts((error, accounts) => {
      fund.deployed().then((instance) => {
        this.fundInstance = instance
        this.setState({ account: accounts[0] });
      }).then((result) => {
        return this.fundInstance.get.call(accounts[0])
      }).then(() => {
        this.fundInstance.getFundsRaised.call(this.props.fund.ipfsStorageHash).then((result) => {
          const ethRaised = this.state.web3.fromWei(result, 'ether')
          this.setState({currentFundsRaised: ethRaised.toString()});
        })
      }).then(() => {
        var account = this.state.web3.eth.accounts[0];

        if (account === this.props.fund.address) {
          this.setState({ isFundOwner: true })
        }
      })
    })
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

  setStateValues(event) {
     this.setState({[event.target.name]: event.target.value})
  }

  sendFunds(event, fund) {
    event.preventDefault();
    var inWei = this.state.web3.toWei(this.state.fundDonation, 'ether');

    console.log("this is the hash")
    console.log(fund.ipfsStorageHash)

    // var fundByHash = this.getFundByHash(fund.ipfsStorageHash); // exmample of how we would get the fund by hash here
    this.fundInstance.donateToFund(fund.address, fund.ipfsStorageHash, {from: this.state.account, value: inWei, gas: 470000, gasPrice: this.state.web3.toWei(1, 'gwei')}).then(() => {
      this.updateFundsRaised();
    })
  }

  updateFundsRaised() {
    this.fundInstance.getFundsRaised.call(this.props.fund.ipfsStorageHash).then((result) => {
      const ethRaised = this.state.web3.fromWei(result, 'ether')
      this.setState({currentFundsRaised: ethRaised.toString()});
    })
  }

  findCurrentAccount(fundAddress) {
    var account = this.state.web3.eth.accounts[0];

    if (account === fundAddress) {
      return true;
    }
  }

  deleteFund() {
    const fund = this.props.fund;
    const funds = this.fundsRef;

    var query = funds.orderByChild('hash').equalTo(fund.ipfsStorageHash);

    query.on('child_added', function(snapshot) {
      snapshot.ref.remove();
      alert("Your fund has been deleted! Refresh the page to see changes");
    })
  }

  clickHandler(e, index) {
    this.setState({ activeDonateModal: index })
  }

  hideDonateModal() {
    this.setState({ activeDonateModal: null })
  }

  renderDeleteFundButton() {
    if (this.state.isFundOwner) {
      return (
        <Button onClick={this.deleteFund}>Delete my Fund</Button>
      )
    }
  }

  render() {
    return (
      <div className="padding-top-sm padding-btm-sm" key={this.props.index}>
        <Media>
          <Media.Left>
            <Button bsStyle="primary" bsSize="small" onClick={e => this.clickHandler(e, this.props.index)}>
              Donate
            </Button>

            <Modal id={this.props.index} show={this.state.activeDonateModal === this.props.index} onHide={this.hideDonateModal}>
              <Modal.Header closeButton>
                <Modal.Title>Donate</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div> Want to donate to {this.props.fund.name}?
                  <form onSubmit={(e) => {this.sendFunds(e, this.props.fund)}}>
                  <input type="number" name="fundDonation" value={this.state.fundDonation} onChange={(e) => this.setStateValues(e)} />
                  <input type="submit" / >
                  </form>

                  Note: Refresh to see changes on the page.
                </div>
               </Modal.Body>
              <Modal.Footer>
              </Modal.Footer>
            </Modal>
          </Media.Left>
          <Media.Body>
            <Media.Heading>{this.props.fund.name}</Media.Heading>
              This fund has raised {this.state.currentFundsRaised} Ether to date.
            <p>
              {this.props.fund.description}
            </p>
            <a href={`https://ipfs.io/ipfs/${this.props.fund.fileUpload}`}>Additional File from Fund</a>

            <div>{this.renderDeleteFundButton()}</div>
          </Media.Body>
        </Media>
      </div>
    )
  }
}

export default FundItem
