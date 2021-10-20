let SDAORewardToken = artifacts.require("./SDAOUpgradableToken.sol");
let web3 = require("web3");

const { deployProxy, upgradeProxy } = require('@openzeppelin/truffle-upgrades');

const name = "Test";
const symbol = "TST";
const supply = "1000000";

module.exports = async function (deployer) {
	 // const existing = await SDAORewardToken.deployed();
      const instance = await deployProxy(SDAORewardToken,[name, symbol,web3.utils.toWei(supply)] , { deployer, initializer: 'initialize'});
      console.log('Deployed', instance.address);
      
      // const instance = await upgradeProxy(existing.address, SDAORewardToken2,[name, symbol,web3.utils.toWei(supply)]);
      //  console.log("Upgraded", instance.address);
};
