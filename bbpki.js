console.log("bbpki application started and running...")

// application modules
const express = require('express')
const fs = require('fs')
//const db = require('./dbconfig/db')
//const domainOwner = require('./models/domainOwner')
//const ra = require('./models/ra')
const Web3 = require('web3')
const { generateKeyPair } = require('crypto');
const server = express()

// developement/production enviroment variables
const RPC_URL = "https://ropsten.infura.io/v3/eb33af9e6ec64536b4a5f12b2df87cb6"
const contract = JSON.parse(fs.readFileSync("build/contracts/BBPKI.json"));
const web3 = new Web3(RPC_URL)
const abi = contract.abi;
var pbkey;
var prkey;
const address = "0x792D2DBa14b0cEFb07FE9214dE413139027FB8A4"
const BlockSSLcontract = new web3.eth.Contract(abi, address)

// routes 
server.get('/register-CA', async (req,res)=>{
// server-side register CA function call
registerCA();
})

server.get('/sign-certificate', async (req,res)=>{
  signCertificate();
})

server.get('/revoke-certificate', async (req,res)=>{
  revokeCertificate();
})

server.get('/get-certificate', async (req,res)=>{
  getCertificate();
})

server.get('/client-verify-cert', async (req,res)=>{
  clientVerifyCert();
})

// contract functions
// sign certificate
async function signCertificate(){
  const testDomain = "example.com"
  const pvtkey = "fab65123befae2ad210633b072c7862xxxxxxxxxxxxxxxxxxxxx";
  web3.eth.accounts.wallet.add("0x"+pvtkey);
  const setCertificate = await BlockSSLcontract.methods.signCertificate(testDomain).send({

    'from': '0xf0f6D0d5D540F5E639C594bBc6c6f57d903A02bC',
    'gas':1000000,
      value:0,
  
  
  }, function(error, data){
    console.log(error);
    console.log(data)
  });
  console.log('sssssssssssss', setCertificate)
}



// register CA
async function registerCA(){
  const testCA = "Digicert" // to be change on each function call up to the maximum numbr of CA required
  const pvtkey = "fab65123befae2ad210633b072c7862bf7b68e0c65900xxxxxxxxxxxxxx" // wallet address private key
  web3.eth.accounts.wallet.add("0x"+pvtkey);
  const setCertificate = await BlockSSLcontract.methods.registerCA(_CAname).send({

    'from': '0xf0f6D0d5D540F5E639C594bBc6c6f57d903A02bC',
    'gas':1000000,
      value:0,
  
  
  }, function(err, data){
    if (err){
      res.send({errror: err})
    }

    else {
      res.send({data: data})
    }
    
  });
  console.log('sssssssssssss', setCertificate)
}



// revoke certificate
async function revokeCertificate(){
  const pvtkey = "fab65123befae2ad210633b072c7862bf7b68e0c659xxxxxxxxxxxxxxxxxxxx"
  web3.eth.accounts.wallet.add("0x"+pvtkey);
  const setCertificate = await BlockSSLcontract.methods.revokeCertificate(_serialNumber).send({

    'from': '0xf0f6D0d5D540F5E639C594bBc6c6f57d903A02bC',
    'gas':1000000,
      value:0,
  
  
  }, function(error, data){
    console.log(error);
    console.log(data)
  });
  console.log('sssssssssssss', setCertificate)
}

//get certificate
async function  getCertificate() {
  const certificate = await BlockSSLcontract.methods.certificates(_serialNumber).call()
  console.log(certificate)
}



// client verify certificate
async function clientVerifyCert() {
const certificate = await BlockSSLcontract.methods.certificates(_serialNumber).call( async (err, result)=>{
console.log(result)
const blockNumber = result.blockNumber;
const transaction = await web3.eth.getBlock(blockNumber);
if (transaction) {
  return true;
}
else {
  return false;
}
  })
}

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



// starting developement/production server
server.listen(process.env.PORT || 3000, (err)=>{
  if (err){
    console.log(error)
  }
  else {
    console.log("bbpki server is listening at port 3000...")
  }
})


