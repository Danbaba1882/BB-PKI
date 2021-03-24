pragma solidity >=0.4.22 <0.9.0;

contract Bbpki {

// state variables

address owner;
mapping (uint => certificateInfo) public certificates;
mapping (uint => infoCA) public cAuthorities;
bytes32[] public caHashes;
uint256 public noOfcertificates = 0;
uint256 public noOfCA = 0;
uint256 public serialNumber = 0;

// constructor
function Bbpki () {
owner = msg.sender
}

// access restrictions
modifier onlyOwner (){
require (owner == msg.sender);
    _;
}

// structures

    struct certificate {
        uint serialNumber;
        string subjectNamme;
        string commonName;
        string organisation;
        string issuer;
        uint expiry;
        uint noOfSignatures;
        string status;
        uint[] signatures;
    }

    struct certificateAuthority {
    uint id;
    string nameCA;
    bytes32 hash;
    }

    // enumerations (predetermined values)
    enum certificateStatus = {active, revoked, expired}
     certificateStatus constant defaultStatus = certificateStatus.active;

    // events
    // certificate authority registeration event
    event caRegistered = (uint noOfCA, string memory _name );

    // certificate signing event
    event certificateSigned(uint256 serialNumber,
    string memory subjectName, 
     string memory commonName,
     string memory organisation,
     string memory issuer,
     uint256 expiry,
     unit256 noOfSignatures,
     string signatures[]
     Status );

    // functions 
    function registerCA (string memory _name) public onlyOwner{
        require ((bytes(_name).length > 0))
        require(noOfCA < 10)
        noOfRA++;
        rAuthorities[noOfCA] = infoCA(noOfCA, _name);
        emit caRegistered (noOfCA, _name)
    }


    function signCertificate(string memory subjectName, string memory commonName, string memory organisation) public returns (
     uint256 serialNumber,
     string memory subjectName, 
     string memory commonName,
     string memory organisation,
     string memory issuer,
     uint256 expiry,
     unit256 noOfSignatures,
     string signatures[]
     string caReferences[];
     certificateStatus defaultStatus; 

     ) {

    // generate a random number between 3 and 10 inclusive to determine the number of CA to sign the certificate automatically

    uint256 caRequired = 
    for (uint i = 0; i < caRequired.length; i++) 
    {
        signature = cAuthorities[i].hash; 
        string memory signedBy = caAuthorities[i].hash  + "by" + caAuthorities[i].name 
        signatures.push(signedBy);
        caReferences.push(signature);
    }
    noOfcertificates++
    // generate a random number between 1 and "caRequired" to select the issuer of the certificate
    uint cIssuer = 
    issuer = cAuthorities[cIssuer].name;
    noOfSignatures = caRequired;
    int256 serialNumber = 


    certificates[noOfcertificates] = certificateInfo(serialNumber, subjectName, commonName, organisation, issuer, expiry, noOfSignatures,signatures[], caReferences[], defaultStatus);

     emit certificateSigned(serialNumber, subjectName, commonName, organisation, issuer, expiry, noOfSignatures,signatures[], caReferences[], defaultStatus );
     return (serialNumber, subjectName, commonName, organisation, issuer, expiry, noOfSignatures,signatures[], caReferences[], defaultStatus );
    }

    function revokeCertificate (uint256 serialNumber) public onlyOwner returns (){
        certificateStatus status = certificates[i].status;
    }

    function getCertificate(uint256 serialNumber) view public returns (address[] memory) { //Get all the info that has been added
        return certAdd;
    }

    function countCertificates() view public returns (uint){ //Count how many users create certificates
      return noOfcertificates;
    }

    function getCA (uint _id) public return (uint){
        return 
    }

     function getRA (uint _id) public return (uint){
        
    }
}
