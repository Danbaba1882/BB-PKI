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
var cas = JSON.parse(fs.readFileSync("cas.json"))
var casArray = cas.cas;
server.set('view engine', 'ejs');
server.use(bodyparser.json());
server.use(express.static(path.resolve(__dirname+'/')));
server.use(bodyparser.urlencoded({extended: true}));


// developement/production enviroment variables
const rpcurl_ganache = "http://127.0.0.1:7545"
const RPC_URL = "https://ropsten.infura.io/v3/eb33af9e6ec64536b4a5f12b2df87cb6"
const contract = JSON.parse(fs.readFileSync("build/contracts/BBPKI.json"));
const web3 = new Web3(rpcurl_ganache)
const abi = contract.abi;
var pbkey;
var prkey;
const contractAddress = "0xAF350A8Fa31Ab3d1eDbfD0d9C44c98D55333EAa5"
const BlockSSLcontract = new web3.eth.Contract(abi, contractAddress)
const bls = require('noble-bls12-381');
const { version } = require('moment')
const log = require('./models/display.js')
var certificate = {}
var certArray = [];

// global variables
var _serialNumber;
var signatures2;
var aggPubKey2;
var aggSignature2;
var isCorrect2;
// sign certificate function
// utilizing the bls multi-signature system, You can use Uint8Array, or hex string for readability
async function signCertificate(domain, nocas       ){
const privateKey = '67d53f170b908cabb9eb326c3c337762d59289a8fec79f7bc9254b584b73265c';
const domainName = domain;
// domain conversion to hex string
const domainHex = toHexString(domainName)
const numCas = nocas;
if (numCas < 3 || numCas>10){
  console.log('CAs must be greater than or equals to 3 and CAs must be less than or equals to 10')
}

else {
  const privateKeys = [];

  // getting and setting the private keys of all selected cas
    for (var i=0; i< numCas; i++){
        const ca = casArray[i];
        const caPrivateKey = ca.privateKey;
        privateKeys.push(caPrivateKey);
      }
  const message = domainHex;
  
  // function that handles the bls signature process
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
   
    console.log('multi/ partial signatures of selected CAs:', signatures2);
    console.log('merged/combined signature:', aggSignature2);
    console.log('signature verified ?:', isCorrect2);
  
  
  return [signatures2, aggPubKey2, aggSignature2, isCorrect2];
  })();
   
  // getting certificate parameters
  console.log(await as, signatures2)
  log.log(certificate, numCas);
  const currentTime = Date.now();
  _serialNumber = currentTime;
  const expiryTime = parseInt(currentTime) + (365*24*60*60);
  const extString=  moment(expiryTime).format('MM/DD/YYYY');
  const issuer = parseInt(Math.random() * (numCas - 0) + 1);
  const certIssuer = casArray[issuer].caName;
  
  // setting certificate parameters
  const version = "X.509V3";
  const certStatus = true;
  const subjectname = domainName;
  const multisigs = signatures2;
  const certSignature = aggSignature2;
  const expiry = expiryTime;
  const certIssuerr = certIssuer;
  const publicKey = aggPubKey2;
  //issuing certificate on the ethereum blockchain and transaction inclusion (for proof of existence and cert status)
  const pvtkey = "b387cd6eac80cdb2c1568814bc2c6179537ced267364acf122c66157317e0661";
  web3.eth.accounts.wallet.add(pvtkey);
  const setCertificate = await BlockSSLcontract.methods.issueCertificate(version, currentTime, subjectname, "JJJJ",expiry,certIssuerr,multisigs, certSignature, certStatus).send({
    'from': "0x9450A01B6C716DE3182F5D21dCf5c1c71E8A9bFb",
    'gas':6721975,
    value: 0
    }, function(error, data){
      if (error){
        console.log("this is error", error);
      }
      console.log('this is data', data)
    });
    console.log('certInfo', setCertificate)
    const blockNumber = setCertificate.events.certificateSigned.returnValues.blockNumber;
    certificate.version = version
    certificate.SerialNumber = _serialNumber
    certificate.SubjectName = subjectname
    certificate.SubjectPublicKey = publicKey
    certificate.Validity = expiry
    certificate.certIssuer = certIssuer
    certificate.MultiSignatures = signatures2
    certificate.certificateSignature = aggSignature2
    certificate.sigVerify = isCorrect2
    certificate.certStatus = certStatus
    certificate.certBlockNUm = blockNumber
    certificate.txHash = setCertificate.transactionHash;
    certificate.blockHash = setCertificate.blockHash
    certArray.push(certificate);
}

  
  
}

// string to hex conversion function
function toHexString(byteArray) {
  return Array.from(byteArray, function(byte) {
    return ('0' + (byte & 0xFF).toString(16)).slice(-2);
  }).join('')
}

// revoke certificate
async function revokeCertificate(_serialNumber){
  const pvtkey = "b387cd6eac80cdb2c1568814bc2c6179537ced267364acf122c66157317e0661"
  web3.eth.accounts.wallet.add(pvtkey);
  const revokeCert = await BlockSSLcontract.methods.revokeCertificate(_serialNumber).send({
    'from': "0x9450A01B6C716DE3182F5D21dCf5c1c71E8A9bFb",
    'gas':6721975,
    value: 0
    }, function(error, data){
      if (error){
        console.log(error);
      }
      console.log(data)
      certificate.certStatus = false;
      console.log(certificate)
    });
  console.log('certStatus', revokeCert)
  // setting certificate object
}

//get certificate
async function  getCertificate(_serialNumber) {
  const certificatee = await BlockSSLcontract.methods.certificates(_serialNumber).call()
  console.log(certificatee)
}

// client verify certificate using the eth-proof
async function clientVerifyCert(_serialNumber) {
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

 // home route
 server.get('/', (req, res)=>{
  res.send({message: "Welcome Dr Abba Garba, use the url bbpki.herokuapp.com/signCertificate/<domainName> to sign the sertificate using the bls multisignature system, the signatures are responded back in a json format in your browser interface"})
  })
  
  // certificate issuance and signing route
  server.get('/sign-certificate/:domainName/:cas', async (req,res)=>{
    signCertificate(req.params.domainName, req.params.cas);
    res.send(certificate)
  })
  
// cert revokation route
  server.get('/revoke-certificate/:serialnumber', async (req,res)=>{
    revokeCertificate(req.params.serialnumber);
    res.send(certificate)
  })
  
 // blockchain cert info route 
  server.get('/get-certificate/:serialnumber', async (req,res)=>{
    getCertificate(req.params.serialnumber);
  })
  
  // client verify cert using eth-proof route
  server.get('/client-verify-cert/:serialNumber', async (req,res)=>{
    clientVerifyCert(req.params.serialnumber);
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


