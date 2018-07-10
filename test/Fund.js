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

  it("a user can create a fund", async () => {
    const title = "Wildlife Fund ABC";
    const description = "Save a crypto kitty!";

    await fund.createFund(title, description, {from: fundOwner});

    // assert that the fund was created
    // assert that the user is the ownwer of the fund
    // assert.equal()
  });

  it("should withdraw the amount deposited by a user", async () => {
    const fundDeposit = web3.toBigNumber(2);
    const title = "Wildlife Fund ABC";
    const description = "Save a crypto kitty!";

    var senderOriginalBalance = web3.eth.getBalance(donater).toNumber();

    await fund.createFund(title, description, {from: fundOwner});

    let transaction = await fund.donateToFund({from: donater, value: fundDeposit});

    var senderNewBalance = web3.eth.getBalance(donater).toNumber();
    var tx = await web3.eth.getTransaction(transaction.tx);
    var gasUsed = tx.gasPrice.mul(transaction.receipt.gasUsed).toNumber();

    assert.strictEqual(senderOriginalBalance - fundDeposit - gasUsed, senderNewBalance, 'should withdraw from donaters account');
  });

  it("should deposit correct amount into the selected fund", async () => {
    const fundDeposit = web3.toBigNumber(2);
    const title = "Wildlife Fund ABC";
    const description = "Save a crypto kitty!";

    await fund.createFund(title, description, {from: fundOwner});
    await fund.donateToFund({from: donater, value: fundDeposit});

    // verify the fund balance?
    // const balance = await

    // assert.equal(deposit.plus(1000).toString(), balance, 'deposit amount incorrect, check deposit method');
  });

  it("should withdraw the entire balance from the fund to the fund owners account", async () => {
    const fundDeposit = web3.toBigNumber(2);
    const title = "Wildlife Fund ABC";
    const description = "Save a crypto kitty!";

    await fund.createFund(title, description, {from: fundOwner});
    await fund.donateToFund({from: donater, value: fundDeposit});

    let fundOwnerOriginalBalance = web3.eth.getBalance(fundOwner).toNumber();

    await fund.withdrawFunds({from: fundOwner, value: fundDeposit});

    let fundOwnerNewBalance = web3.eth.getBalance(fundOwner).toNumber();

    assert.strictEqual(fundOwnerNewBalance, fundOwnerOriginalBalance + fundDeposit, 'transfers proper amount')
  });

  it("should not let a random user withdraw from a fund they do not own", async() => {

  });
});
