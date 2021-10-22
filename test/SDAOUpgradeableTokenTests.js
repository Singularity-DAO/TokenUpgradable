"use strict";
let BigNumber = require("bignumber.js");
var  SDAOUpgradeableToken = artifacts.require("SDAOUpgradeableToken.sol");
const { deployProxy } = require('@openzeppelin/truffle-upgrades');

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
  
contract('SDAOUpgradeableToken', function(accounts) {

    var sdaoUpgradeableToken;
    const decimals = 18;
    const tokenFactor = (new BigNumber(10)).pow(decimals);
    const initialSupply = (new BigNumber(1000000)).times(tokenFactor).toFixed();
    
    before(async () => 
        {
            const name="SDAO Token";
            const symbol="SDAO";
            //sdaoUpgradeableToken = await SDAOUpgradeableToken.deployed();
            sdaoUpgradeableToken = await deployProxy(SDAOUpgradeableToken,[name, symbol, initialSupply] , { initializer: 'initialize'});
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

    it("0. Initial Deployment Configuration - Decimals, Initial Suppy and Owner", async function() 
    {
        // accounts[0] -> Contract Owner

        // Check for the Initial Supply
        await getInitialSupplyAndVerify(initialSupply);

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
