const BBPKI = artifacts.require("BBPKI");

module.exports = function (deployer) {
  deployer.deploy(BBPKI);
};