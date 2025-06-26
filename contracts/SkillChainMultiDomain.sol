// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SkillChainMultiDomain is ERC721, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    enum Domain {
        UNIVERSITY,
        LEGAL,
        ARTIST,
        RESEARCH,
        GAMING,
        DEVELOPER
    }

    struct Project {
        string name;
        string githubLink;
        address owner;
        uint256 timestamp;
        string[] tags;
        Domain domain;
        bytes32 documentHash;
        string metadataURI;
        bool isVerified;
    }

    struct Certificate {
        uint256 projectId;
        address recipient;
        address issuer;
        string title;
        string description;
        Domain domain;
        uint256 timestamp;
        bool isActive;
    }

    mapping(uint256 => Project) public projects;
    mapping(uint256 => uint256) public votes;
    mapping(uint256 => mapping(address => bool)) public hasVoted;
    mapping(uint256 => Certificate) public certificates;
    mapping(address => bool) public verifiedIssuers;
    mapping(Domain => uint256) public domainProjectCounts;

    event ProjectSubmitted(uint256 indexed tokenId, address indexed owner, Domain domain, string name);
    event ProjectVoted(uint256 indexed tokenId, address indexed voter);
    event CertificateIssued(uint256 indexed certificateId, address indexed recipient, Domain domain);
    event IssuerVerified(address indexed issuer, bool verified);
    event DocumentHashStored(uint256 indexed tokenId, bytes32 documentHash);

    constructor() ERC721("SkillChainMultiDomain", "SCMD") {}

    modifier onlyVerifiedIssuer() {
        require(verifiedIssuers[msg.sender] || msg.sender == owner(), "Not a verified issuer");
        _;
    }

    function submitProject(
        string memory _name,
        string memory _githubLink,
        string[] memory _tags,
        Domain _domain,
        string memory _metadataURI
    ) public returns (uint256) {
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();
        
        _mint(msg.sender, newTokenId);
        
        projects[newTokenId] = Project({
            name: _name,
            githubLink: _githubLink,
            owner: msg.sender,
            timestamp: block.timestamp,
            tags: _tags,
            domain: _domain,
            documentHash: bytes32(0),
            metadataURI: _metadataURI,
            isVerified: false
        });

        domainProjectCounts[_domain]++;
        
        emit ProjectSubmitted(newTokenId, msg.sender, _domain, _name);
        return newTokenId;
    }

    function storeDocumentHash(uint256 tokenId, bytes32 documentHash) public {
        require(_exists(tokenId), "Project does not exist");
        require(ownerOf(tokenId) == msg.sender, "Only project owner can store hash");
        
        projects[tokenId].documentHash = documentHash;
        emit DocumentHashStored(tokenId, documentHash);
    }

    function issueCertificate(
        uint256 projectId,
        address recipient,
        string memory title,
        string memory description
    ) public onlyVerifiedIssuer returns (uint256) {
        require(_exists(projectId), "Project does not exist");
        
        _tokenIds.increment();
        uint256 certificateId = _tokenIds.current();
        
        certificates[certificateId] = Certificate({
            projectId: projectId,
            recipient: recipient,
            issuer: msg.sender,
            title: title,
            description: description,
            domain: projects[projectId].domain,
            timestamp: block.timestamp,
            isActive: true
        });

        _mint(recipient, certificateId);
        
        emit CertificateIssued(certificateId, recipient, projects[projectId].domain);
        return certificateId;
    }

    function verifyProject(uint256 tokenId) public onlyVerifiedIssuer {
        require(_exists(tokenId), "Project does not exist");
        projects[tokenId].isVerified = true;
    }

    function setVerifiedIssuer(address issuer, bool verified) public onlyOwner {
        verifiedIssuers[issuer] = verified;
        emit IssuerVerified(issuer, verified);
    }

    function upvoteProject(uint256 tokenId) public {
        require(_exists(tokenId), "Project does not exist");
        require(!hasVoted[tokenId][msg.sender], "Already voted for this project");
        
        votes[tokenId] += 1;
        hasVoted[tokenId][msg.sender] = true;
        
        emit ProjectVoted(tokenId, msg.sender);
    }

    function getProject(uint256 tokenId) public view returns (
        string memory name,
        string memory githubLink,
        address owner,
        uint256 timestamp,
        string[] memory tags,
        Domain domain,
        bytes32 documentHash,
        bool isVerified
    ) {
        require(_exists(tokenId), "Project does not exist");
        Project memory p = projects[tokenId];
        return (p.name, p.githubLink, p.owner, p.timestamp, p.tags, p.domain, p.documentHash, p.isVerified);
    }

    function getCertificate(uint256 certificateId) public view returns (
        uint256 projectId,
        address recipient,
        address issuer,
        string memory title,
        string memory description,
        Domain domain,
        uint256 timestamp,
        bool isActive
    ) {
        require(_exists(certificateId), "Certificate does not exist");
        Certificate memory c = certificates[certificateId];
        return (c.projectId, c.recipient, c.issuer, c.title, c.description, c.domain, c.timestamp, c.isActive);
    }

    function getProjectsByDomain(Domain domain) public view returns (uint256[] memory) {
        uint256 total = _tokenIds.current();
        uint256[] memory temp = new uint256[](total);
        uint256 count = 0;
        
        for (uint256 i = 1; i <= total; i++) {
            if (_exists(i) && projects[i].domain == domain) {
                temp[count] = i;
                count++;
            }
        }
        
        uint256[] memory result = new uint256[](count);
        for (uint256 j = 0; j < count; j++) {
            result[j] = temp[j];
        }
        return result;
    }

    function getProjectsOf(address user) public view returns (uint256[] memory) {
        uint256 total = _tokenIds.current();
        uint256 count = balanceOf(user);
        uint256[] memory result = new uint256[](count);
        uint256 idx = 0;
        
        for (uint256 i = 1; i <= total; i++) {
            if (_exists(i) && ownerOf(i) == user) {
                result[idx] = i;
                idx++;
            }
        }
        return result;
    }

    function getTotalProjects() public view returns (uint256) {
        return _tokenIds.current();
    }

    function getVoteCount(uint256 tokenId) public view returns (uint256) {
        require(_exists(tokenId), "Project does not exist");
        return votes[tokenId];
    }

    function getDomainStats() public view returns (uint256[6] memory) {
        return [
            domainProjectCounts[Domain.UNIVERSITY],
            domainProjectCounts[Domain.LEGAL],
            domainProjectCounts[Domain.ARTIST],
            domainProjectCounts[Domain.RESEARCH],
            domainProjectCounts[Domain.GAMING],
            domainProjectCounts[Domain.DEVELOPER]
        ];
    }
}