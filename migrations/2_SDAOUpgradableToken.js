let SDAORewardToken = artifacts.require("./SDAOUpgradableToken.sol");

const name = ""
const symbol = ""

module.exports = function (deployer) {
    deployer.deploy(SDAORewardToken, name, symbol);
  };
