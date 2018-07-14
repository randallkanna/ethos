pragma solidity ^0.4.18;

contract Fund {
  address public owner;
  uint fundID;
  string ipfsHash;

  mapping(uint => Fund) public funds;
  mapping (address => uint) private balances;

	event Deposit(address sender, uint amount);
  // TODO - Add withdraw event

  /* event DonatedToFund(
    address donater;
    uint256 value;
  ) */

  constructor() {
    owner = msg.sender;
    fundID = 1;
  }

  struct Fund {
    address fundCreator;
    uint id;
    string fundTitle;
    string description;
  }

  function set(string x) public {
    ipfsHash = x;
  }

  function get() public view returns (string) {
    return ipfsHash;
  }

  function createFund(ipfsHash) public {
    // push into the storage of hashes

    /* funds[fundID] = Fund({fundTitle: _title, description: _description, id: fundID, fundCreator: msg.sender}); */
  }

  function getAllFunds() public return (string) {
    // TODO return an object here?

    // return all hashes here
  }

  function donateToFund() public payable {
    // find what fund they want to donate to here
    // uint fundID
    /* var fund = funds[fundID]; */
    Deposit(msg.sender, msg.value);
  }

  function withdrawFunds(uint withdrawAmount) public payable {
    require(msg.sender == owner);

    msg.sender.transfer(withdrawAmount);
  }

  function balance() public constant returns (uint) {
    return balances[msg.sender];
  }
}
