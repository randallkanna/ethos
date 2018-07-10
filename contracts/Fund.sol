pragma solidity ^0.4.18;

contract Fund {
  address public owner;
  uint fundID;

  mapping(uint => Fund) public funds;
  mapping (address => uint) private balances;

	event Deposit(address sender, uint amount);
  // TODO - Add withdraw event

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

  function createFund(string _title, string _description) public {
    // set requires    // require a fund cannot be changed or modified unless by owner
    funds[fundID] = Fund({fundTitle: _title, description: _description, id: fundID, fundCreator: msg.sender});
  }

  function donateToFund() public payable {
    // find what fund they want to donate to here
    // uint fundID
    /* var fund = funds[fundID]; */
    Deposit(msg.sender, msg.value);
  }

  function withdrawFunds(uint withdrawAmount) public {
    require(msg.sender == owner);

    /* balances[msg.sender] -= withdrawAmount; */

    msg.sender.transfer(withdrawAmount);
  }

  function balance() public constant returns (uint) {
    return balances[msg.sender];
  }
}
