const web3 = require('@solana/web3.js');
const { response } = require('express');
const express = require('express');
const web3Utils = require('./lib');



const router = express.Router();
const utils = new web3Utils.Web3();

router.get('/connect', async (request, response) => {
    const resData = await utils.connect();

    response.json(resData);
});


router.get('/keypair', async(request, response) => {
    const resData = await utils.returnKeypair();

    response.json(resData);
});


router.get('/fund_account/:address', async (request,response)=>{
    const resData = await utils.fundAction(request.params.address);

    response.json(resData);
});


router.get('/get_balance/:address', async(request,response)=>{
   const  resData = await utils.getBalance(request.params.address);
   
   response.json(resData);
});


router.get('/transfer',async (request,response)=>{
    
    const recipientKeyPair = new web3.Keypair();

    const resData = await utils.transfer(recipientKeyPair,0.9);

    console.log(resData)

    response.json(resData);
})

module.exports = router;
