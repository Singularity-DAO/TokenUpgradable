let SDAOUpgradeableTokenV2 = artifacts.require("./SDAOUpgradeableTokenV2.sol");
let SDAOUpgradeableTokenV3 = artifacts.require("./SDAOUpgradeableTokenV3.sol");
let web3 = require("web3");

const { deployProxy, upgradeProxy } = require('@openzeppelin/truffle-upgrades');

const name = "Test2";
const symbol = "TST2";
const supply = "2000000";

module.exports = async function (deployer) {

	  const existing = await SDAOUpgradeableTokenV2.deployed();
	  console.log("existing adress", existing.address);

      const instance = await upgradeProxy(existing.address, SDAOUpgradeableTokenV3,{deployer});
      
      console.log("Upgraded", instance.address);
};
