import React, { Component } from 'react'
import FundContract from '../build/contracts/Fund.json'
import getWeb3 from './utils/getWeb3'

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

    // this.formSubmit = this.formSubmit.bind(this);
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

    // var fundInstance

    // Get accounts.
    // this.state.web3.eth.getAccounts((error, accounts) => {
    //   fund.deployed().then((instance) => {
    //     fundInstance = instance
      //   // Stores a given value, 5 by default.
      //   return fundInstance.set(5, {from: accounts[0]})
      // }).then((result) => {
      //   // Get the value from the contract to prove it worked.
      //   return fundInstance.get.call(accounts[0])
      // }).then((result) => {
      //   // Update state with the result.
      //   return this.setState({ storageValue: result.c[0], contract: fundInstance, account: accounts[0] })
      // })
    // })
  }

  // handleClick() {
  //   const contract = this.state.contract
  //   const account = this.state.account
  //
  //   var value = 3
  //   contract.set(value, {from: account})
  //     .then(result => {
  //       return contract.get.call()
  //         .then(result => {
  //           return this.setState({storageValue: result.contract[0]})
  //         })
  //   })
  // }

  createFund() {
    // var fundInstance;

    // App.contracts.Fund.deployed().then(function(instance) {
    //   fundInstance = instance;
    //
    //   return fundInstance.createFund.call();
    // })
    //
    //
    //     return adoptionInstance.getAdopters.call();
    //   }).then(function(adopters) {
    //     for (i = 0; i < adopters.length; i++) {
    //       if (adopters[i] !== '0x0000000000000000000000000000000000000000') {
    //         $('.panel-pet').eq(i).find('button').text('Pending...').attr('disabled', true);
    //       }
    //     }
    //   }).catch(function(err) {
    //     console.log(err.message);
    //   });
    //   }
  }

  // handleSubmit(event) {
  //   // debugger;
  //
  //   // const contract = this.state.contract
  //   // const account = this.state.account
  //
  //   debugger;
  //
  //   // contract.set
  //   event.preventDefault();
  // }

  render() {
    return (
        <div>
          <h1>Ethos Crowdfunding</h1>
            <div className="form-group">
              <form onSubmit={this.createFund.bind(this)}>
                <input type="text" name="Fund Name" className="form-control" placeholder="Enter Fund Name" />
                <input type="submit" value="Submit" className="btn btn-dark" />
              </form>
            </div>
        </div>
//         <p>The stored value is: {this.state.storageValue}</p>
//         <button onClick={this.handleClick.bind(this)}>Set storage</button>
    );
  }
}

export default App
