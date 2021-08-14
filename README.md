# BB-PKI: Blockchain-Based Public KeyInfrastructure Certificate Management

## A Proof-of-Concept Implementation for the BB-PKI protocol

BB-PKI is a certificate  management  system  that  addresses  the  security vulnerabilities as a result of impersonation attacks, causing CA misbehaviour due to weakest-link security problem at RAs in the  current  PKI.  The  main  aim  of  BB-PKI  is  not  to  detect impersonation  attacks  against  RAs;  rather,  it  prevents such attacks from happening by imposing manifold RAs as well as CAs to vouch and sign the certificates. Certificate Issuance Request (CIR) should be vouched by manifold RAs. Multiple CAs shall sign and issue the certificate  using  an  out-of-band  secure  communication  channel. Any  RA  that  contributes  to  the  verification  process  of  a  user’s request can publish the certificate in the blockchain by creating a  smart  contract  certificate  transaction.  BB-PKI  offers  strong security  guarantees,  compromising n−1of  the  RAs  or  CAs is  not  enough  to  launch  impersonation  attacks,  meaning  that attackers  cannot  compromise  more  than  the  threshold  of  the latter  signatures  to  launch  an  attack.

## Getting Started

In this repository we implement a prototype of BB-PKI. The general architecture of BB-PKI is depicted in the below Figure.

![General Framework of BB-PKI](Figs/BBPKI.jpg)

### Prerequisites

In order to deploy the BB-PKI, to add and revoke the certificate in the blockchain require to setup testnet Ethereum Virtual private network. 

### Installing

A step by step series of examples that tell you how to deploy the BB-PKI and run succesifully by performing all the functionalities. 

Also this the nodejs codes is used to generate state Merkle proof for TLS certificates and verify it. We apply zmitton/eth-proof as the underlying library.

## STEPS AND PROCEDURES INVOLVED IN THE WHOLE PROCESS
A domain owner creates a certificate signing request (CIR) generating a public- private key pair using the JavaScript crypto module through a number of trusted RAs (RAs≥ 3 and RAs ≤ 10) , after an automatic verification and vouching of a domain owner CIR by the RAs, Using an out of bound secure communication channel the certificate gets signed by a number of CAs (CAs≥ 3 and CAs ≤ 10) utilizing the concept of BLS-Multisignature system. After a verification of a CIR request by RAs a function named signCertificate from the file bbpki.js gets called via a get request API, on successful request, the certificate gets singed by using a JavaScript bls multisignature library node-bls12-81.

After a certificate has been signed, it is then forwarded into our deployed Ethereum smart contract with the following certificate parameters version, subject name, serial number, multisignatures, certificate signature, certificate public key, signature verified, certificate status, issuer, expiry via web3.js. A function issueCertificate on our smart contracts accepts the certificate parameters and saves a copy of the certificate in a mapping certificates. A transaction is being created on the process, upon a successful execution of the transaction, the following occurs sequentially;
 The certificates get included into the Ethereum blockchain returning a transaction receipt.



 #### Singing the certificate 
 
 #### Revoking the certificate 
 
#### getting/Updating the certificate the certificate 

#### Client verify Certificate
 
