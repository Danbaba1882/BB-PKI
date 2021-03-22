const express = require('express')
const Web3 = require('web3')

const RPC_URL = "http://127.0.0.1:7545"
const web3 = new Web3(RPC_URL)
const abi = [
  {
    "constant": true,
    "inputs": [],
    "name": "last_completed_migration",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "internalType": "uint256",
        "name": "completed",
        "type": "uint256"
      }
    ],
    "name": "setCompleted",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  }
]
var pbkey;
var prkey;
const address = "0x909E12782D907E7D897Fea37b8c86c3A3DE8Bc50"
const hh = "usmandanbaba.com"
const BlockSSLcontract = new web3.eth.Contract(abi, address)

const setCertificate =  BlockSSLcontract.methods.setCertificate(hh, "pbkey", 05032021,"www.domain.com").call();

console.log('sssssssssssss', setCertificate)

const { generateKeyPair } = require('crypto');
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