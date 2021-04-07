console.log("bbpki application started and running...")

// application modules
const express = require('express')
const fs = require('fs')
//const db = require('./dbconfig/db')
//const domainOwner = require('./models/domainOwner')
//const ra = require('./models/ra')
const Web3 = require('web3')
const { generateKeyPair } = require('crypto');
const ethProof = ("eth-proof")
var cas = JSON.parse(fs.readFileSync("cas.json"))
var casArray = cas.cas;
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
//import {init, SecretKey, secretKeyToPublicKey, sign, verify} from "@chainsafe/bls";
const bls = require('noble-bls12-381');

// You can use Uint8Array, or hex string for readability
const privateKey = '67d53f170b908cabb9eb326c3c337762d59289a8fec79f7bc9254b584b73265c';
/*const privateKeys = [
  '18f020b98eb798752a50ed0563b079c125b0db5dd0b1060d1c1b47d4a193e1e4',
  'ed69a8c50cf8c9836be3b67c7eeff416612d45ba39a5c099d48fa668bf558c9c',
  '16ae669f3be7a2121e17d0c68c05a8f3d6bef21ec0f2315f1d7aec12484e4cf5'
]; */
//const message = '64726e3das';
//const messages = ['d2', '0d98', '05caf3'];

async function certBLSmultisignature () {
  const publicKey = bls.getPublicKey(privateKey);
  const publicKeys = privateKeys.map(bls.getPublicKey);

  const signature = await bls.sign(message, privateKey);
  const isCorrect = await bls.verify(signature, message, publicKey);
  console.log('key', publicKey);
  console.log('signature', signature);
  console.log('is correct:', isCorrect);

  // Sign 1 msg with 3 keys
  const signatures2 = await Promise.all(privateKeys.map(p => bls.sign(message, p)));
  const aggPubKey2 = bls.aggregatePublicKeys(publicKeys);
  const aggSignature2 = bls.aggregateSignatures(signatures2);
  const isCorrect2 = await bls.verify(aggSignature2, message, aggPubKey2);
  console.log();
  console.log('signatures are', signatures2);
  console.log('merged to one signature', aggSignature2);
  console.log('is correct:', isCorrect2);

  // Sign 3 msgs with 3 keys
  const signatures3 = await Promise.all(privateKeys.map((p, i) => bls.sign(messages[i], p)));
  const aggSignature3 = bls.aggregateSignatures(signatures3);
  const isCorrect3 = await bls.verifyBatch(aggSignature3, messages, publicKeys);
  console.log();
  console.log('keys', publicKeys);
  console.log('signatures', signatures3);
  console.log('merged to one signature', aggSignature3);
  console.log('is correct:', isCorrect3);
}


// routes 
server.get('/register-CA', async (req,res)=>{
// server-side register CA function call
registerCA();
})

/*server.get('/sign-certificate', async (req,res)=>{
  signCertificate();
}) */

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
// bls multi-signature system, You can use Uint8Array, or hex string for readability
const privateKey = '67d53f170b908cabb9eb326c3c337762d59289a8fec79f7bc9254b584b73265c';
const domainName = "example.com"
const domainHex = toHexString(domainName)
const numCas = Math.random() * (11 - 3) + 3;
const privateKeys = [];
 
    for (var i=0; i< numCas; i++){
      const ca = casArray[i];
      const caPrivateKey = ca.privateKey;
      privateKeys.push(caPrivateKey);
    }
const message = domainHex;

(async () => {
  const publicKey = bls.getPublicKey(privateKey);
  const publicKeys = privateKeys.map(bls.getPublicKey);

  const signature = await bls.sign(message, privateKey);
  const isCorrect = await bls.verify(signature, message, publicKey);


  // Sign certifictae with private keys of CA's
  const signatures2 = await Promise.all(privateKeys.map(p => bls.sign(message, p)));
  const aggPubKey2 = bls.aggregatePublicKeys(publicKeys);
  const aggSignature2 = bls.aggregateSignatures(signatures2);
  const isCorrect2 = await bls.verify(aggSignature2, message, aggPubKey2);
  console.log();
  console.log('multi/ partial signatures of selected CAs:', signatures2);
  console.log('merged/combined signature:', aggSignature2);
  console.log('signature verified ?:', isCorrect2);

  // Sign 3 msgs with 3 keys
})();
  
  const pvtkey = "fab65123befae2ad210633b072c7862bf7b68e0c65900b86c85c736e4393bd13";
  web3.eth.accounts.wallet.add("0x"+pvtkey);
  const setCertificate = await BlockSSLcontract.methods.signCertificate("testDomain").send({

    'from': '0xf0f6D0d5D540F5E639C594bBc6c6f57d903A02bC',
    'gas':1000000,
      value:0,
  
  
  }, function(error, data){
    console.log(error);
    console.log(data)
  });
  console.log('sssssssssssss', setCertificate)
}

signCertificate();

function toHexString(byteArray) {
  return Array.from(byteArray, function(byte) {
    return ('0' + (byte & 0xFF).toString(16)).slice(-2);
  }).join('')
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


