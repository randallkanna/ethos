pragma solidity ^0.4.18;

contract Fund {
  address public owner;
  uint fundID;

  mapping(uint => Fund) public funds;
  mapping (address => uint) private balances;

  constructor() {
    owner = msg.sender;
    fundID = 1;
  }

  struct Fund {
    address fundCreator;
    string fundTitle;
    string description;
    uint id;
  }

  function createFund(string _title, string _description) public {
    // set requires
    // require a fund cannot be changed or modified unless by owner
    funds[fundID] = Fund({fundTitle: _title, description: _description, id: fundID, fundCreator: msg.sender});
  }

  function donateToFund(uint fundID) public payable {
    // find what fund they want to donate to here
    var fund = funds[fundID];

    // subtract the balance
    /* balances[msg.sender] += msg.value; */

  }

  function withdrawFunds(uint withdrawAmount) public returns (uint remainingBal) {
    require(withdrawAmount <= balances[msg.sender]);
    require(msg.sender == owner);

    balances[msg.sender] -= withdrawAmount;

    msg.sender.transfer(withdrawAmount);

    return balances[msg.sender];
  }

  function balance() public constant returns (uint) {
    return balances[msg.sender];
  }
}
