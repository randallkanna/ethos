var SimpleStorage = artifacts.require("./SimpleStorage.sol");
var Fund = artifacts.require("./Fund.sol")

module.exports = function(deployer) {
  deployer.deploy(Fund);
  deployer.deploy(SimpleStorage);
};
