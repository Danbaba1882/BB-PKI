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

 #### Singing the certificate 
 
 #### Revoking the certificate 
 
#### getting/Updating the certificate the certificate 

#### Client verify Certificate
 
