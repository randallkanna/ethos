## Design Pattern Decisions

### Database
While this app allows a user to retrieve individual ipfs hashes from the contract, the amount of gas cost for a contract would be astronomical to return all the hashes. So, instead I'm adding a database to store the hashes and integrating it with React.

To focus on the priorities of the app, I'm using firebase. 

### ipfs
I chose to use IPFS to store users information.
