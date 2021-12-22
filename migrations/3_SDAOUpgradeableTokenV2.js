let SDAOUpgradeableToken = artifacts.require("./SDAOUpgradeableToken.sol");
let SDAOUpgradeableTokenV2 = artifacts.require("./SDAOUpgradeableTokenV2.sol");
let web3 = require("web3");

const { deployProxy, upgradeProxy } = require('@openzeppelin/truffle-upgrades');

module.exports = async function (deployer) {

	  const existing = await SDAOUpgradeableToken.deployed();
	  console.log("existing adress", existing.address);

      const instance = await upgradeProxy(existing.address, SDAOUpgradeableTokenV2,{deployer});
      
      console.log("Upgraded", instance.address);
};
