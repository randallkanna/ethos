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

      this.instantiateContract()
    })
    .catch(() => {
      console.log('Error finding web3.')
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
  }

  createFund(event) {
     this.setState({[event.target.name]: event.target.value})
  }

  onSubmit(event) {
    event.preventDefault();

    const hashData = JSON.stringify({
      name: this.state.fundName,
      fundDescription: this.state.fundDescription,
    })

    ipfs.add(Buffer.from(hashData), (err, result) => {
      if (err) {
        console.error(err);
        return;
      } else {
        this.setState({ ipfsHash: result[0].hash });
        console.log('ipfs: ', this.state.ipfsHash)
      }
    });

    // console.log(JSON.parse(ipfs.cat(returnedHash)))
  }

  // showFunds() {

  //   const hash = this.state.ipfsHash;
  //
  //   const content = ipfs.files.get(hash, function (err, files) {
  //     files.forEach((file) => {
  //       debugger;
  //       const test = file.content.toString('utf8');
  //
  //       return test;
  //     })
  //   })
  // }

    // {this.state.funds.map((fund) => <li>{fund}</li>)}
  // 'https://ipfs.io/ipfs/${this.state.ipfsHash}'

  render() {
    return (
      <div>
        <h1>Ethos Crowdfunding</h1>

        <h3>Funds</h3>
        {this.state.ipfsHash}

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
