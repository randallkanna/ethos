# Design Pattern Decisions

## Contract
## Stop Contract
The contract has several modifiers to verify when the contract is stopped or running. This means that when the contract is stopped, the user cannot call certain functions.

### Gas costs
#### Avoiding Storage of Ether
While some contracts store currency, our contract instead immediately transfers to the owners address. This provides security as currency is less likely to get stuck in the contract.

#### Getting fund balance when Modal is opened
To save on gas costs, the contract only queries for a funds balance when the modal is open.

## Libraries
The app uses Open Zeppelin for simple libraries such as Ownable. This allows the main contract Fund to import Ownable and use tested functions from an outside library for reliability instead of rebuilding the wheel.

## Database (Firebase)
While this app allows a user to retrieve individual ipfs hashes from the contract, the amount of gas cost for a contract would be astronomical to return all the hashes. So, instead I'm adding a database to store the hashes and integrating it with React.

To focus on the priorities of the app and for simplicity, I'm using firebase.

In src/App/Index.js, on line 160, the app also does not query the contract for the fund count. The app saves gas costs by not querying the contract for either the hashes or things like the fund count.

## IPFS
While I chose to use firebase to store the IPFS hashes, I chose to use IPFS to store a users fund information for decentralization. The app only stores the hashes internally. To save on gas costs, the contract is never queried for the entire list of hashes.

The contract interfaces with IPFS on the Front-end and stores the hashes in firebase, but also sets a struct in the contract to correlate a user with their address and IPFS hash. That way, the contract can still verify certain things.

## React
The app is built using React and uses a component structure. It also integrates with React-bootstrap for some minor components such as Navbar or list items.
