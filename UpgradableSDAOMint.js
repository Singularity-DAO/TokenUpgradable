require("dotenv").config()
Web3 = require("web3");


//const userRewards =require('./eligible_claim2/001-addAddresses_add.json');
//const usersAirdrop = require('./airdropStakes/024-airdropStakes.json');
//const rewards ='./rewards.json';

const SingDaoUpgradabledABI = require('./build/contracts/SDAORewardToken.json')

const PORT = process.env.PORT || 5001



console.log(`Running on mainnet ........`);
networkId = "1"; //"42";  //"97"; //
ETH_NODE_URL= 'https://mainnet.infura.io/v3/'+process.env.InfuraKey;
     

var web3 = new Web3(ETH_NODE_URL);




 async function  MintUpgradableSDAO(){


   const account = web3.eth.accounts.privateKeyToAccount("0x"+process.env.PRIVATE_KEY); //process.env.PRIVATE_KEY_KOVAN
    web3.eth.accounts.wallet.add(account);
    web3.eth.defaultAccount = account.address;
    console.log(account.address)

   var SingDaoupgradableToken = new web3.eth.Contract(SingDaoUpgradabledABI.abi, process.env.REWARD_SDAO);

   //var tokens  = web3.utils.toWei("");

    try {



    //  console.log(tokens);

        var MintTokens = await SingDaoupgradableToken.methods.Mint(account.address,tokens).send({
           'from': account.address,
           'gas': 9800000, // 9568471
           'gasPrice': 55000000000,
        }, function(error, data){
          console.log(error);
          //console.log(data)
          console.log("Transaction ID init : " .cyan + data)
          console.log("check transaction at https://etherscan.io/tx/"+data)
        });


    } catch(error){

     console.log(error);

   }
}

 MintUpgradableSDAO();