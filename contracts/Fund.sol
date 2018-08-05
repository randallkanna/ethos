pragma solidity ^0.4.24;

import 'openzeppelin-solidity/contracts/lifecycle/Pausable.sol';

/** @title Fund */
contract Fund is Pausable { // Library integration
  /* event Deposit(address sender, uint amount); */
  /* event DonatedToFund(
  address donater;
  uint256 value;
  ) */

  address public owner;
  uint fundID;
  string ipfsHash;
  /* bool public stopped = false; // paused */ // removed because I'm using pausable

  mapping(string => FundStorage) private funds;
  mapping (address => uint) private balances;

  // commenting this out because I mvoed to pausable
  /**
   * @dev Only allows a function to be called when the contract is not stopped
   */
  /* modifier whenNotStopped() {
    require(!stopped);
    _;
  } */

  /**
   * @dev Only allows a function to be called when the contract is paused
   */
  /* modifier whenStopped() {
    require(stopped);
    _;
  } */

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

  /** @dev returns the total funds raised by a user fund
  @param ipfs string of the ipfs hash
  **/
  function getFundsRaised(string ipfs) public constant whenNotPaused returns (uint) {
    return funds[ipfs].fundsRaised;
  }

  /** @dev Stores a ipfsHash of the users fund in a struct
  * @param ipfs string of the IPFS hash.
  */
  function createFund(string ipfs) public whenNotPaused {
    funds[ipfs] = FundStorage({ipfsHash: ipfs, fundCreator: msg.sender, fundsRaised: 0});
  }

  /** @dev Stores a ipfsHash of the users fund in a struct
  * @param addr address of the fund the user wants to send funds to
  */
  function donateToFund(address addr, string ipfsStorageHash) public whenNotPaused payable {
    addr.transfer(msg.value);
    funds[ipfsStorageHash].fundsRaised += msg.value;
  }

  // commenting this out for now - not needed for now
  /** @dev lets the user withdraw funds from contract
  * @param withdrawAmount is the sum the user wants to withdraw
  */
  /* function withdrawFunds(uint withdrawAmount) public payable {
    require(msg.sender == owner);

    msg.sender.transfer(withdrawAmount);
  } */

  /** @dev returns the fund associated with a ipfs hash
  * @param ipfs string of the ipfs hash
  */
  function getFundForHash(string ipfs) public view whenNotPaused returns (string) {
     return funds[ipfs].ipfsHash;
  }

  /** @dev Returns the users funds
  */
  function balance() public constant whenNotPaused returns (uint) {
    return balances[msg.sender];
  }

  // Example of implement pause contract. Removing this in favor of using openzeppelin
  /**
  * @dev stops the contract
  */
  /* function stop() onlyOwner whenNotStopped public {
    stopped = true;
    emit Stop();
  } */

  /**
   * @dev starts the contract again and returns to normal state
   */
  /* function start() onlyOwner whenStopped public {
    stopped = false;
    emit Start();
  } */
}
