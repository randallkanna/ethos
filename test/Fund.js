var Fund = artifacts.require("./Fund.sol");

contract('Fund', function(accounts) {
  const owner = accounts[0]

  beforeEach(function() {
    return Fund.new()
    .then(function(instance) {
      fund = instance;
    });
  });

  it("", async () => {
    
    // await bank.enroll({from: alice});
    // await bank.enroll({from: bob});
    //
    // const aliceBalance = await bank.balance({from: alice});
    // assert.equal(aliceBalance, 1000, 'enroll balance is incorrect, check balance method or constructor');
    //
    // const bobBalance = await bank.balance({from: bob});
    // assert.equal(bobBalance, 1000, 'enroll balance is incorrect, check balance method or constructor');
    //
    // const ownerBalance = await bank.balance({from: owner});
    // assert.equal(ownerBalance, 0, 'only enrolled users should have balance, check balance method or constructor')
  });
});
