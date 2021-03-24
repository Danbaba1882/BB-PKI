console.log("bbpki application started and running...")

// application modules
const express = require('express')
const fs = require('fs')
const db = require('./dbconfig/db')
const domainOwner = require('./models/domainOwner')
const ra = require('./models/ra')
const Web3 = require('web3')
const { generateKeyPair } = require('crypto');
const server = express()

// developement/production enviroment variables
const RPC_URL = "http://127.0.0.1:7545"
const contract = JSON.parse(fs.readFileSync("build/contracts/BlockSSL.json"));
const web3 = new Web3(RPC_URL)
const abi = contract.abi;
var pbkey;
var prkey;
const address = "0x909E12782D907E7D897Fea37b8c86c3A3DE8Bc50"
const hh = "usmandanbaba.com"
const BlockSSLcontract = new web3.eth.Contract(abi, address)

const setCertificate =  BlockSSLcontract.methods.setCertificate(hh, "pbkey", 05032021,"www.domain.com").call();

console.log('sssssssssssss', setCertificate)

// public/private key pair generation function
generateKeyPair('rsa', {
  modulusLength: 4096,
  publicKeyEncoding: {
    type: 'spki',
    format: 'pem'
  },
  privateKeyEncoding: {
    type: 'pkcs8',
    format: 'pem',
    cipher: 'aes-256-cbc',
    passphrase: 'top secret'
  }
}, (err, publicKey, privateKey) => {
  // Handle errors and use the generated key pair.
  
  pbkey = publicKey
  prkey = privateKey
}); 

// application routes

/* RA verify the domain owner, saves the domain owner in its database
 creates a transaction and forwards CIR to CA's on the blockchain for 
 cerificate signing and inclusion of the transaction on the ethereum blockchain */
server.post('/verify-domain-owner', async (req, res)=>{

})


// starting developement/production server
server.listen(process.env.PORT || 3000, (err)=>{
  if (err){
    console.log(error)
  }
  else {
    console.log("bbpki server is listening at port 3000...")
  }
})


