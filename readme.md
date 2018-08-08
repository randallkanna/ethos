# Ethos

Ethos is crowdfunding in Ethereum. A user can create a fund and include more information that is store on IPFS. Other users can donate to to the fund.

## Project Setup

### Requirements
* You'll need to be online to use firebase and IPFS with this app.
* Have metamask, npm, truffle, and node installed.

### Getting Started

#### Truffle
1. If you have truffle installed, skip this step: ``npm install -g truffle``

2. Open the dev console in one terminal: ``truffle develop``

3. Compile and migrate the smart contracts once you have the dev console up in a terminal.
``compile``
And next: ``migrate``

** Sometimes you may need to run ``migrate --reset``. **

#### React

1. Open another terminal. Run
``npm start``

2. This will start the front-end at http://localhost:3000/.

3. Make sure you're using the proper metamask setup! It needs to match what is in the truffle js file. http://127.0.0.0.1:9545
