console.log("bbpki application started and running...")

// application modules
const express = require('express')
const fs = require('fs')
const moment = require('moment')
const bodyparser = require('body-parser')
const path = require('path')
const server = express()
//const db = require('./dbconfig/db')
//const domainOwner = require('./models/domainOwner')
//const ra = require('./models/ra')
const Web3 = require('web3')
const { generateKeyPair } = require('crypto');
const { GetAndVerify, GetProof, VerifyProof } = require('eth-proof')
let getAndVerify = new GetAndVerify("https://mainnet.infura.io")
var cas = JSON.parse(fs.readFileSync("cas.json"))
var casArray = cas.cas;
server.set('view engine', 'ejs');
server.use(bodyparser.json());
server.use(express.static(path.resolve(__dirname+'/')));
server.use(bodyparser.urlencoded({extended: true}));


// developement/production enviroment variables
const RPC_URL = "https://ropsten.infura.io/v3/eb33af9e6ec64536b4a5f12b2df87cb6"
const contract = JSON.parse(fs.readFileSync("build/contracts/BBPKI.json"));
const web3 = new Web3(RPC_URL)
const abi = contract.abi;
var pbkey;
var prkey;
const address = "0x9085EaFA70ae65e6292aeFd7a1BFF27717734Cc3"
const BlockSSLcontract = new web3.eth.Contract(abi, address)
//import {init, SecretKey, secretKeyToPublicKey, sign, verify} from "@chainsafe/bls";
const bls = require('noble-bls12-381');
const { version } = require('moment')

// You can use Uint8Array, or hex string for readability
const privateKey = '67d53f170b908cabb9eb326c3c337762d59289a8fec79f7bc9254b584b73265c';


/*var certificate = {
  version: version,
  SerialNumber: serialNumber,
  SubjectName:  subjectName,
  SubjectPublicKey: PublicKey,
  Validity: pValidity,
  issuer: issuer,
  MultiSignatures: signatures2,
  certificateSignature: aggSignature2,
  sigVerify: isCorrect2,
  certStatus: certStatus,
  certBlockNUm: blockNumber
} */
var _serialNumber;
var signatures2;
var aggPubKey2;
var aggSignature2;
var isCorrect2;
// sign certificate
// bls multi-signature system, You can use Uint8Array, or hex string for readability
async function signCertificate(domain){

const privateKey = '67d53f170b908cabb9eb326c3c337762d59289a8fec79f7bc9254b584b73265c';
const domainName = domain;
const domainHex = toHexString(domainName)
const numCas = Math.random() * (11 - 3) + 3;
const privateKeys = [];
 
    for (var i=0; i< numCas; i++){
      const ca = casArray[i];
      const caPrivateKey = ca.privateKey;
      privateKeys.push(caPrivateKey);
    }
const message = domainHex;


var as = (async () => {
  const publicKey = bls.getPublicKey(privateKey);
  const publicKeys = privateKeys.map(bls.getPublicKey);

  const signature = await bls.sign(message, privateKey);
  const isCorrect = await bls.verify(signature, message, publicKey);


  // Sign certifictae with private keys of CA's
  signatures2 = await Promise.all(privateKeys.map(p => bls.sign(message, p)));
  aggPubKey2 = bls.aggregatePublicKeys(publicKeys);
  aggSignature2 = bls.aggregateSignatures(signatures2);
  isCorrect2 = await bls.verify(aggSignature2, message, aggPubKey2);
  console.log();
  console.log('multi/ partial signatures of selected CAs:', signatures2);
  console.log('merged/combined signature:', aggSignature2);
  console.log('signature verified ?:', isCorrect2);


return [signatures2, aggPubKey2, aggSignature2, isCorrect2];
  // Sign 3 msgs with 3 keys
})();
 
console.log(await as, signatures2)
const currentts = Date.now();
_serialNumber = currentts;
const expiryts = parseInt(currentts) + (365*24*60*60);
console.log(currentts,expiryts)
const ex=  moment(expiryts).format('MM/DD/YYYY');
console.log(ex)
const iss  = parseInt(Math.random() * (numCas - 0) + 1);
const issuer = casArray[iss].caName;

// parameters
const version = "X.509V3";
const certStatus = true;
const subjectname = "domainName";
var multisigs = signatures2;
const combsigs = aggSignature2;
const expiry = expiryts;
const issuerr = issuer;
const publicKey = aggPubKey2;



  const pvtkey = "fab65123befae2ad210633b072c7862bf7b68e0c65900b86c85c736e4393bd13";
  web3.eth.accounts.wallet.add("0x"+pvtkey);
  const setCertificate = await BlockSSLcontract.methods.issueCertificate(version, currentts, subjectname, "JJJJ",expiry,issuerr,signatures2, combsigs, certStatus).send({

    'from': '0xf0f6D0d5D540F5E639C594bBc6c6f57d903A02bC',
    'gas':1000000,
    value:0,
  
  
  }, function(error, data){
    console.log(error);
    console.log(data)
  });
  console.log('sssssssssssss', setCertificate)
}



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
const getnverify = new GetAndVerify(RPC_URL);
const proof = getnverify.txAgainstBlockHash(txHash, trustedBlockHash);
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

 server.get('/', (req, res)=>{
  res.send({message: "Welcome Dr Abba Garba, use the url bbpki.herokuapp.com/signCertificate/<domainName> to sign the sertificate using the bls multisignature system, the signatures are responded back in a json format in your browser interface"})
  })
  // routes 
  server.get('/register-CA', async (req,res)=>{
  // server-side register CA function call
  registerCA();
  })
  
  server.get('/sign-certificate/:domainName', async (req,res)=>{
    signCertificate(req.params.domainName);
    res.json({
      caMultisignature: signatures2,
      combinedSignatures: aggSignature2,
      signatureVerified: isCorrect2
    })
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
  



// starting developement/production server
server.listen(process.env.PORT || 3000, (err)=>{
  if (err){
    console.log(error)
  }
  else {
    console.log("bbpki server is listening at port 3000...")
  }
})


