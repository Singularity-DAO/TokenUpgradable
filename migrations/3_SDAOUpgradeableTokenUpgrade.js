let SDAOUpgradeableToken = artifacts.require("./SDAOUpgradeableToken.sol");
let SDAOUpgradeableToken2 = artifacts.require("./SDAOUpgradeableToken2.sol");
let web3 = require("web3");

const { deployProxy, upgradeProxy } = require('@openzeppelin/truffle-upgrades');

const name = "Test2";
const symbol = "TST2";
const supply = "2000000";

module.exports = async function (deployer) {

	  const existing = await SDAOUpgradeableToken.deployed();
	  console.log("existing adress", existing.address);

      const instance = await upgradeProxy(existing.address, SDAOUpgradeableToken2,{deployer});
      
      console.log("Upgraded", instance.address);
};
