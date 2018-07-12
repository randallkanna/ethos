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
      storageValue: 0,
      web3: null,
      contract: null,
      account: null
    }
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

  createFund() {
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
  }

  onChange() {
    debugger;
  }

  onSubmit() {

  }

  render() {
    return (
      <div>
        <h3>Ethos Crowdfunding</h3>
        <form onSubmit={this.onSubmit}>
          <input type="text" onChange={this.submitForm} />
          <input type="submit" />
        </form>
      </div>
    );
  }
}

export default App
