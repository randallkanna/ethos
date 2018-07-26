var Fund = artifacts.require("./Fund.sol");

contract('Fund', function(accounts) {
  const fundOwner = accounts[0];
  const donater = accounts[1];
  const secondDonater = accounts[2];

  beforeEach(function() {
    return Fund.new()
    .then(function(instance) {
      fund = instance;
    });
  });

  /**
    getFundHashByAddress
    Verifies that a users ipfsHash is properly stored with their address. Tests that the struct is created properly.
  **/
  it("a user can store a ipfsHash of their fund information when creating a fund", async () => {
    const ipfsHash = "testABC123";

    await fund.createFund(ipfsHash, {from: fundOwner});

    const storedFundHash = await fund.getFundHashByAddress(fundOwner);

    assert.strictEqual(storedFundHash, ipfsHash, 'fund was stored properly');
  });

  /**
    donateToFund
    Verifies that the contract withdraws from a user when they donate to a fund.
  **/
  it("should withdraw the amount deposited by a user when they donate to a fund", async () => {
    const fundDeposit = web3.toBigNumber(2);
    const ipfsHash = "testABC123";

    var senderOriginalBalance = web3.eth.getBalance(donater).toNumber();

    let transaction = await fund.donateToFund(fundOwner, {from: donater, value: fundDeposit});

    // var senderNewBalance = web3.eth.getBalance(donater).toNumber();
    // var tx = await web3.eth.getTransaction(transaction.tx);
    // var gasUsed = tx.gasPrice.mul(transaction.receipt.gasUsed).toNumber();

    // console.log(senderOriginalBalance)
    // console.log(senderNewBalance)

    // assert.strictEqual(senderOriginalBalance - fundDeposit - gasUsed, senderNewBalance, 'should withdraw from donaters account');
  });

  /**
    donateToFund
    Verifies that the contract deposits the right amount into the selected fund
  **/
  // // TODO: Implement this test
  it("should deposit correct amount into the selected fund", async () => {
    const fundDeposit = web3.toBigNumber(2);
    const ipfsHash = "testABC123";

    await fund.createFund(ipfsHash, {from: fundOwner});
    await fund.donateToFund(fundOwner, {from: donater, value: fundDeposit});

    // verify the fund balance?
    // const balance = await

    // assert.equal(deposit.plus(1000).toString(), balance, 'deposit amount incorrect, check deposit method');
  });

  /**
  TODO: Insert comments
  **/
  // it("should withdraw the entire balance from the fund to the fund owners account", async () => {
  //   const fundDeposit = 2;
  //   const title = "Wildlife Fund ABC";
  //   const description = "Save a crypto kitty!";
  //
  //   await fund.createFund(title, description, {from: fundOwner});
  //   await fund.donateToFund({from: donater, value: fundDeposit});
  //
  //   let fundOwnerOriginalBalance = web3.eth.getBalance(fundOwner).toNumber();
  //
  //   let transaction = await fund.withdrawFunds(fundDeposit, {from: fundOwner, value: fundDeposit});
  //
  //   let fundOwnerNewBalance = web3.eth.getBalance(fundOwner).toNumber();
  //   var tx = await web3.eth.getTransaction(transaction.tx);
  //   var gasUsed = tx.gasPrice.mul(transaction.receipt.gasUsed).toNumber();
  //
  //   assert.strictEqual(fundOwnerOriginalBalance + fundDeposit - gasUsed, fundOwnerNewBalance, 'transfers proper amount');
  // });

  /**
    This test verifies that a user that created a fund cannot donate to their own fund
  **/
  it("should not allow owners to contribute to their own fund", async() => {
    const fundDeposit = web3.toBigNumber(2);
    const ipfsHash = "testABC";

    await fund.createFund(ipfsHash, {from: fundOwner});

    try {
      await fund.donateToFund(fundOwner, {from: fundOwner, value: fundDeposit});
      assert.ok(false, 'should throw an error when the fund owner tries to donate to their own fund')
    } catch(error) {
      assert.ok(true, 'expected throw')
    }
  });

  /**
    stop()
    Verifies that the contract does not allow users to call certain functions when the contract is stopped
  **/
  it("should not allow a user to call certain functions while stopped", async () => {
    await fund.stop();
    await fund.set("ipfsHash");
    let getipfshHash = await fund.get();
    assert.equal(getipfshHash, "ipfsHash");
  });

  /**
    start()
    Verifies that the contract returns to normal state after the contract is restarted
  **/
  it('should return to normal contract state after stop contract is over', async () => {
    await fund.stop();
    await fund.start();
    await fund.set("ipfsHash")
    let getipfshHash = await fund.get();

    assert.equal(getipfshHash, "ipfsHash");
  });
});
