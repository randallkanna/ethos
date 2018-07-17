pragma solidity ^0.4.24;

/** @title Fund */
contract Fund {
  address public owner;
  uint fundID;
  string ipfsHash;

  mapping(address => FundStorage) public funds;
  mapping (address => uint) private balances;

	/* event Deposit(address sender, uint amount); */
  // TODO - Add withdraw event

  /* event DonatedToFund(
    address donater;
    uint256 value;
  ) */

  constructor() {
    owner = msg.sender;
    fundID = 1;
  }

  struct FundStorage {
    address fundCreator;
    string ipfsHash;
  }

  /*
  Commenting this out for now as it's not needed
   function set(string x) public {
    ipfsHash = x;
  } */

  function get() public view returns (string) {
    return ipfsHash;
  }

  /** @dev Stores a ipfsHash of the users fund in a struct
  * @param ipfs string of the IPFS hash.
  */
  function createFund(string ipfs) public {
    funds[msg.sender] = FundStorage({ipfsHash: ipfs, fundCreator: msg.sender});
  }

  /** @dev Stores a ipfsHash of the users fund in a struct
  * @param addr address of the fund the user wants to send funds to
  * @param eth amount the user is attempting to send to the fund
  */
  function donateToFund(address addr, uint eth) public payable {
    // TO DO - Refactor
    // find what fund they want to donate to here
    // uint fundID
    /* var fund = funds[fundID]; */
    addr.transfer(eth);
  }

  /** @dev lets the user withdraw funds from contract
  * @param withdrawAmount is the sum the user wants to withdraw
  */
  function withdrawFunds(uint withdrawAmount) public payable {
    require(msg.sender == owner);

    msg.sender.transfer(withdrawAmount);
  }

  /** @dev Returns the users funds
  */
  function balance() public constant returns (uint) {
    return balances[msg.sender];
  }
}
