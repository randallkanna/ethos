import React, { Component } from 'react'
import FundContract from '../build/contracts/Fund.json'
import getWeb3 from './utils/getWeb3'
import ipfs from './ipfs';

import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      web3: null,
      contract: null,
      account: null,
      fundName: '',
      fundDescription: '',
      ipfsHash: '',
      fundCount: '',
      funds: [],
      completeFundList: [],
    }

    this.createFund = this.createFund.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
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
    }).then(() => {
      this.showFundsCount();
      this.showAllFunds();
    })
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

  createFund(event) {
     this.setState({[event.target.name]: event.target.value})
  }

  showAllFunds() {
    const ipfsHashList = this.state.funds;
    const ipfsFundData = [];

    if (ipfsHashList.length > 0) {
      const requests = ipfsHashList.map(function(ipfsHash) {
        ipfs.files.cat(ipfsHash, function (err, files) {
          if (err) {
            console.error(err);
            return;
          }

          const fund = JSON.parse(files);

          debugger;

          ipfsFundData.push(fund)
        })
      })

      Promise.all(requests).then(function(results){
   // do something after the loop finishes
       debugger;
         this.setState({ completeFundList: ipfsFundData });

      })

      // Promise.all(requests).then((function(results)) {
      //   debugger;
      // });
    }
  }

  showFundsCount() {
    // saving gas costs by storying the ipfs hashes in JS for now
    return this.setState({fundCount: this.state.funds.length})
  }

  onSubmit(event) {
    event.preventDefault();

    const hashData = JSON.stringify({
      name: this.state.fundName,
      fundDescription: this.state.fundDescription,
      address: this.state.account,
    })

    ipfs.add(Buffer.from(hashData), (err, result) => {
      if (err) {
        console.error(err);
        return;
      }

      this.fundInstance.createFund(result[0].hash, {from: this.state.account})
      this.setState({ funds: [...this.state.funds, result[0].hash] })
      this.showAllFunds();
      this.showFundsCount();
      return this.setState({ipfsHash: result[0].hash});
    });

    // console.log(JSON.parse(ipfs.cat(returnedHash)))
  }

  // 'https://ipfs.io/ipfs/${this.state.ipfsHash}'

  render() {
      const fundItems = this.state.completeFundList.map((fund, index) =>
        <li key={index}>{fund.address}{fund.name}{fund.description}</li>
      );

    return (
      <div className="wrapper">
        <h1>Ethos Crowdfunding</h1>

        <h3>{this.state.fundCount || 0} funds to contribute to currently.</h3>

        <h3>Funds</h3>
          <ul>
          {fundItems}
         </ul>

        <h4>Submit a new Fund Proposal</h4>
        <form onSubmit={this.onSubmit}>
          Fund Name: <input type="text" name="fundName" value={this.state.fundName} onChange={(e) => this.createFund(e)} />
          Fund Description: <input type="text" name="fundDescription" value={this.state.fundDescription} onChange={(e) => this.createFund(e)} />
          <input type="submit" />
        </form>
      </div>
    );
  }
}

export default App
