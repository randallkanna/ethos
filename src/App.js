import React, { Component } from 'react'
import SimpleStorageContract from '../build/contracts/SimpleStorage.json'
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

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillMount() {
    // Get network provider and web3 instance.
    // See utils/getWeb3 for more info.

    getWeb3
    .then(results => {
      this.setState({
        web3: results.web3
      })

      // Instantiate contract once web3 provided.
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
    const simpleStorage = contract(SimpleStorageContract) // TODO: Fix this later
    simpleStorage.setProvider(this.state.web3.currentProvider)  // TODO: Fix this later

    // Declaring this for later so we can chain functions on SimpleStorage.
    var simpleStorageInstance

    // Get accounts.
    this.state.web3.eth.getAccounts((error, accounts) => {
      simpleStorage.deployed().then((instance) => {
        simpleStorageInstance = instance

        // Stores a given value, 5 by default.
        return simpleStorageInstance.set(5, {from: accounts[0]})
      }).then((result) => {
        // Get the value from the contract to prove it worked.
        return simpleStorageInstance.get.call(accounts[0])
      }).then((result) => {
        // Update state with the result.
        return this.setState({ storageValue: result.c[0], contract: simpleStorageInstance, account: accounts[0] })
      })
    })
  }

  // handleClick() {
  //   const contract = this.state.contract
  //   const account = this.state.account
  //
  //   var value = 3
  //
  //   contract.set(value, {from: account})
  //     .then(result => {
  //       return contract.get.call()
  //         .then(result => {
  //           return this.setState({storageValue: result.contract[0]})
  //         })
  //   })
  // }

  handleSubmit(event) {
    // debugger;

    const contract = this.state.contract
    const account = this.state.account

    // contract.set
    event.preventDefault();
  }

  render() {
    return (
      <div>
        <h1>Ethos Crowdfunding</h1>
          <form onSubmit={this.handleSubmit.bind(this)}>
            <input type="text" name="Fund Name"/>
            <input type="submit" value="Submit" />
          </form>
      </div>
//         <p>The stored value is: {this.state.storageValue}</p>
//         <button onClick={this.handleClick.bind(this)}>Set storage</button>
    );
  }
}

export default App
