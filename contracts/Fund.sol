pragma solidity ^0.4.18;

contract Fund {
  address public owner;
  address[] public customers;

  mapping (address => uint) private balances;

  constructor() {
    owner = msg.sender;
  }

  struct Fund {
    address fundCreator;
    string fundTitle;
    string description;
  }

  function createFund(string title, string description) public {

    // store the fund information here

    // store the user in the Fund struct too
  }

  function deposit() public payable returns (uint) {
    // find what fund they want to donate to here

    // subtract the balance
    /* balances[msg.sender] += msg.value; */

    return balances[msg.sender];
  }

  function withdrawFunds(uint withdrawAmount) public returns (uint remainingBal) {
    require(withdrawAmount <= balances[msg.sender]);

    balances[msg.sender] -= withdrawAmount;

    msg.sender.transfer(withdrawAmount);

    return balances[msg.sender];
  }

  function balance() public constant returns (uint) {
    return balances[msg.sender];
  }
}
