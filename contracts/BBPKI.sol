pragma solidity >=0.4.22 <0.9.0;

contract BlockSSL {
mapping (uint => certificateInfo) certificates;
    address[] public certAdd;
    uint serialNumber = 0;
    struct certificateInfo {
        address creator;
        string domain;
        string certificateHash;
        uint serialNumber;
        uint expiry;
        string certDownloadLink;
    }

    event certificateInfoAdded(address creator, string domain, string certificateHash, uint serialNumber, uint expiry, string certDownloadLink);

    function setCertificate(string memory _domain, string memory _certificateHash, uint _expiry, string memory _certDownloadLink) public returns (string memory) {
       emit certificateInfoAdded(msg.sender, _domain, _certificateHash, serialNumber, _expiry, _certDownloadLink);
       return "usmandanbaba";
    }

    function getCertificatesInfo() view public returns (address[] memory) { //Get all the info that has been added
        return certAdd;
    }

    function countCertificates() view public returns (uint){ //Count how many users create certificates
      return certAdd.length;
    }
}
