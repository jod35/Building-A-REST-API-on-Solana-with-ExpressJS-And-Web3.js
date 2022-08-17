const web3 = require('@solana/web3.js');
const { response } = require('express');
const express = require('express');
const web3routes = require('./router');



const app=express();
const PORT = 8000;

app.use(express.json())

app.use('/',web3routes);


app.listen(PORT, () => {
    console.log(`SERVER RUNNING AT http://localhost:${PORT}`);
});

