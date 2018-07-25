## Avoiding Common Attacks

### Stop/Start
The contract has a stop and start function that allows the contract to stop and start processes in an emergency.

### isOwnable
The contract uses the isOwnable from openzeppelin. Uses a modifier from the library in some of the functions in the contract to verify proper ownership.

### Visibility
The contract uses various visibility of public vs. private functions to secure the contract.

## Avoding Ether Storage
While some contracts store currency, our contract instead immediately transfers to the owners address. This provides security as currency is less likely to get stuck in the contract.
