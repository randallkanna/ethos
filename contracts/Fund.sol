pragma solidity ^0.4.24;

import 'openzeppelin-solidity/contracts/ownership/Ownable.sol';

/** @title Fund */
contract Fund is Ownable { // Library integration
  /* event Deposit(address sender, uint amount); */
  /* event DonatedToFund(
  address donater;
  uint256 value;
  ) */
  event Stop();
  event Start();

  address public owner;
  uint fundID;
  string ipfsHash;
  bool public stopped = false; // paused

  mapping(address => FundStorage) public funds;
  mapping (address => uint) private balances;

  /**
   * @dev Only allows a function to be called when the contract is not stopped
   */
  modifier whenNotStopped() {
    require(!stopped);
    _;
  }

  /**
   * @dev Only allows a function to be called when the contract is paused
   */
  modifier whenStopped() {
    require(stopped);
    _;
  }

  constructor() {
    owner = msg.sender;
    fundID = 1;
  }

  struct FundStorage {
    address fundCreator;
    string ipfsHash;
    uint fundsRaised;
  }

  /** @dev sets the ipfs hash for contract
  * @param x ipfs hash
  */
  function set(string x) public {
    ipfsHash = x;
  }

  /** @dev returns the ipfshash associated
  */
  function get() public view returns (string) {
    return ipfsHash;
  }

  // randall TODO document this
  function getFundsRaised(address addr) public view whenNotStopped returns (uint) {
    return funds[addr].fundsRaised;
  }

  /** @dev returns the fund associated with a users address
  * @param addr users address
  */
  function getFundHashByAddress(address addr) public view whenNotStopped returns (string) {
     return funds[addr].ipfsHash;
  }

  /** @dev Stores a ipfsHash of the users fund in a struct
  * @param ipfs string of the IPFS hash.
  */
  function createFund(string ipfs) public whenNotStopped {
    funds[msg.sender] = FundStorage({ipfsHash: ipfs, fundCreator: msg.sender, fundsRaised: 0});
  }

  /** @dev Stores a ipfsHash of the users fund in a struct
  * @param addr address of the fund the user wants to send funds to
  */
  function donateToFund(address addr) public whenNotStopped payable {
    require(owner != msg.sender);
    /* funds[addr].fundsRaised += msg.value; */

    addr.transfer(msg.value);
  }

  // commenting this out for now - not needed for now
  /** @dev lets the user withdraw funds from contract
  * @param withdrawAmount is the sum the user wants to withdraw
  */
  /* function withdrawFunds(uint withdrawAmount) public payable {
    require(msg.sender == owner);

    msg.sender.transfer(withdrawAmount);
  } */

  /** @dev Returns the users funds
  */
  function balance() public constant whenNotStopped returns (uint) {
    return balances[msg.sender];
  }

  /**
  * @dev stops the contract
  */
  function stop() onlyOwner whenNotStopped public {
    stopped = true;
    emit Stop();
  }

  /**
   * @dev starts the contract again and returns to normal state
   */
  function start() onlyOwner whenStopped public {
    stopped = false;
    emit Start();
  }
}
