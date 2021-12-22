let SDAOUpgradeableToken = artifacts.require("./SDAOUpgradeableToken.sol");
let web3 = require("web3");

const { deployProxy } = require('@openzeppelin/truffle-upgrades');

const name = "Singularity Dao";
const symbol = "SDAO";
const supply = "1000000";

module.exports = async function (deployer) {
	 
      const instance = await deployProxy(SDAOUpgradeableToken,[name, symbol,web3.utils.toWei(supply)] , { deployer, initializer: 'initialize'});
      console.log('Deployed', instance.address);
      
};
