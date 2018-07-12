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

  // var fundInstance;

  // App.contracts.Fund.deployed().then(function(instance) {
  //   fundInstance = instance;
  //
  //   return fundInstance.createFund.call();
  // })
  //     return fundInstance.getFunders.call();
  //   }).then(function(funders) {
  //     for (i = 0; i < funders.length; i++) {
  //       if (funders[i] !== '0x0000000000000000000000000000000000000000') {
  //         $('.panel').eq(i).find('button').text('Pending...').attr('disabled', true);
  //       }
  //     }
  //   }).catch(function(err) {
  //     console.log(err.message);
  //   });
  //   }

  createFund(event) {
     this.setState({[event.target.name]: event.target.value})
  }

  onSubmit(event) {
    event.preventDefault();

    ipfs.files.add(Buffer.from(this.state.fundName), (err, result) => {
      if (err) {
        console.error(err);
        return;
      } else {
        this.setState({ ipfsHash: result[0].hash })
        console.log('ipfs', this.state.ipfsHash)
      }
    })
  }

  // 'https://ipfs.io/ipfs/${this.state.ipfsHash}'

  render() {
    return (
      <div>
        <h1>Ethos Crowdfunding</h1>

        <h3>Funds</h3>
          <div></div>

        <h4>Submit a new Fund Proposal</h4>
        <form onSubmit={this.onSubmit}>
          <input type="text" name="fundName" value={this.state.fundName} onChange={(e) => this.createFund(e)} />
          <input type="submit" />
        </form>
      </div>
    );
  }
}

export default App
