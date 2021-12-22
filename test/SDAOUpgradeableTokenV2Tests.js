"use strict";
let BigNumber = require("bignumber.js");
var  SDAOUpgradeableToken = artifacts.require("SDAOUpgradeableToken.sol");
var  SDAOUpgradeableTokenV2 = artifacts.require("SDAOUpgradeableTokenV2.sol");
const { deployProxy, upgradeProxy } = require('@openzeppelin/truffle-upgrades');

let Contract = require("@truffle/contract");
const { assert } = require("chai");

var ethereumjsabi  = require('ethereumjs-abi');
var ethereumjsutil = require('ethereumjs-util');

async function testErrorRevert(prom)
{
    let rezE = -1
    try { await prom }
    catch(e) {
        rezE = e.message.indexOf('revert');
        //console.log("Catch Block: " + e.message);
    }
    assert(rezE >= 0, "Must generate error and error message must contain revert");
}
  
contract('SDAOUpgradeableTokenV2', function(accounts) {

    var sdaoUpgradeableToken;
    const decimals = 18;
    const tokenFactor = (new BigNumber(10)).pow(decimals);
    let initialSupply = (new BigNumber(1000000)).times(tokenFactor).toFixed();
    let burnAmount = (new BigNumber(6000)).times(tokenFactor).toFixed();
    
    before(async () => 
        {
            const name="SDAO Token";
            const symbol="SDAO";

            //sdaoUpgradeableToken = await SDAOUpgradeableToken.deployed();
            const sdaoUpgradeableToken_Old = await deployProxy(SDAOUpgradeableToken,[name, symbol, initialSupply] , { initializer: 'initialize'});

            // upgrade the Proxy

            sdaoUpgradeableToken = await upgradeProxy(sdaoUpgradeableToken_Old, SDAOUpgradeableTokenV2);

        });

        const getInitialSupplyAndVerify = async (_totalSupply) => {
            
            const totalSupply = await sdaoUpgradeableToken.totalSupply.call()

            assert.equal((new BigNumber(totalSupply)).toFixed(), _totalSupply);
        }

        const getDecimalsAndVerify = async (_decimals) => {

            const decimals = await sdaoUpgradeableToken.decimals.call()

            assert.equal(decimals.toNumber(), _decimals);

        }

        const transferAndVerify = async (_accountFrom, _accountTo, _amount) => {

            const _amountBN = new BigNumber(_amount);

            const sender_bal_b = (await sdaoUpgradeableToken.balanceOf(_accountFrom));
            const receiver_bal_b = (await sdaoUpgradeableToken.balanceOf(_accountTo));

            await sdaoUpgradeableToken.transfer(_accountTo, _amountBN.toString(), {from:_accountFrom})

            const sender_bal_a = (await sdaoUpgradeableToken.balanceOf(_accountFrom));
            const receiver_bal_a = (await sdaoUpgradeableToken.balanceOf(_accountTo));

            assert.equal(_amountBN.plus(receiver_bal_b).isEqualTo(receiver_bal_a), true);
            assert.equal(_amountBN.plus(sender_bal_a).isEqualTo(sender_bal_b), true);

        }

        const getRandomNumber = (max) => {
            const min = 10; // To avoid zero rand number
            return Math.floor(Math.random() * (max - min) + min);
        }

        const sleep = async (sec) => {
            console.log("Waiting for cycle to complete...Secs - " + sec);
            return new Promise((resolve) => {
                setTimeout(resolve, sec * 1000);
              });
        }

    // ************************ Test Scenarios Starts From Here ********************************************

    it("0. Initial Deployment Configuration - Burn function", async function() 
    {
        // accounts[0] -> Contract Owner

        // Try to call Burn with non owner - should fail
        await testErrorRevert(sdaoUpgradeableToken.burn(burnAmount, { from: accounts[1] }));

        // Call Upgraded contract to mint the additional tokens
        await sdaoUpgradeableToken.burn(burnAmount, { from: accounts[0] });

        // Check for the total Supply
        const updatedTotalSupply = (new BigNumber(initialSupply)).minus(burnAmount).toFixed();
        await getInitialSupplyAndVerify(updatedTotalSupply);

        // Check for the Configured Decimals - Should be 18
        await getDecimalsAndVerify(18);

    });

    it("2. Transfer Token - Transfer to Different Account and Validation", async function() 
    {
        // accounts[0] -> Contract Owner

        // Transfer 1M tokens
        const transferAmountBN = new BigNumber("100000000000000");
        await transferAndVerify(accounts[0], accounts[1], transferAmountBN.toString());

    });

    it("3. Contract Owner Validation", async function() 
    {
        // accounts[0] -> Contract Owner

        const owner = await sdaoUpgradeableToken.owner.call()
        assert.equal(owner, accounts[0]);

    });


});
