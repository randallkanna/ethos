pragma solidity ^0.4.24;

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

  function set(string x) public {
    ipfsHash = x;
  }

  function get() public view returns (string) {
    return ipfsHash;
  }

  function createFund(string ipfs) public {
    funds[msg.sender] = FundStorage({ipfsHash: ipfs, fundCreator: msg.sender});
  }

  function donateToFund(address addr, uint eth) public payable {
    // TO DO - Refactor
    // find what fund they want to donate to here
    // uint fundID
    /* var fund = funds[fundID]; */
    addr.transfer(eth);
  }

  function withdrawFunds(uint withdrawAmount) public payable {
    require(msg.sender == owner);

    msg.sender.transfer(withdrawAmount);
  }

  function balance() public constant returns (uint) {
    return balances[msg.sender];
  }
}
