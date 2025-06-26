// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract SkillChain is ERC721 {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    struct Project {
        string name;
        string githubLink;
        address owner;
        uint256 timestamp;
        string[] tags;
    }

    mapping(uint256 => Project) public projects;
    mapping(uint256 => uint256) public votes;
    mapping(uint256 => mapping(address => bool)) public hasVoted;
    mapping(uint256 => bytes32) public projectFileHashes;

    constructor() ERC721("SkillChainProject", "SCP") {}

    function submitProject(string memory _name, string memory _githubLink, string[] memory _tags) public returns (uint256) {
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();
        _mint(msg.sender, newTokenId);
        projects[newTokenId] = Project({
            name: _name,
            githubLink: _githubLink,
            owner: msg.sender,
            timestamp: block.timestamp,
            tags: _tags
        });
        return newTokenId;
    }

    function getTotalProjects() public view returns (uint256) {
        return _tokenIds.current();
    }

    function getProject(uint256 tokenId) public view returns (string memory, string memory, address, uint256, string[] memory) {
        require(_exists(tokenId), "Project does not exist");
        Project memory p = projects[tokenId];
        return (p.name, p.githubLink, p.owner, p.timestamp, p.tags);
    }

    function getProjectsOf(address user) public view returns (uint256[] memory) {
        uint256 total = _tokenIds.current();
        uint256 count = balanceOf(user);
        uint256[] memory result = new uint256[](count);
        uint256 idx = 0;
        for (uint256 i = 1; i <= total; i++) {
            if (ownerOf(i) == user) {
                result[idx] = i;
                idx++;
            }
        }
        return result;
    }

    function upvoteProject(uint256 tokenId) public {
        require(_exists(tokenId), "Project does not exist");
        require(!hasVoted[tokenId][msg.sender], "Already voted for this project");
        votes[tokenId] += 1;
        hasVoted[tokenId][msg.sender] = true;
    }

    function getVoteCount(uint256 tokenId) public view returns (uint256) {
        require(_exists(tokenId), "Project does not exist");
        return votes[tokenId];
    }

    function getProjectsByTag(string memory tag) public view returns (uint256[] memory) {
        uint256 total = _tokenIds.current();
        uint256[] memory temp = new uint256[](total);
        uint256 count = 0;
        for (uint256 i = 1; i <= total; i++) {
            Project memory p = projects[i];
            for (uint256 j = 0; j < p.tags.length; j++) {
                if (keccak256(bytes(p.tags[j])) == keccak256(bytes(tag))) {
                    temp[count] = i;
                    count++;
                    break;
                }
            }
        }
        uint256[] memory result = new uint256[](count);
        for (uint256 k = 0; k < count; k++) {
            result[k] = temp[k];
        }
        return result;
    }

    function storeFileHash(uint256 tokenId, bytes32 fileHash) public {
        require(_exists(tokenId), "Project does not exist");
        require(ownerOf(tokenId) == msg.sender, "Only project owner can store hash");
        projectFileHashes[tokenId] = fileHash;
    }

    function getFileHash(uint256 tokenId) public view returns (bytes32) {
        require(_exists(tokenId), "Project does not exist");
        return projectFileHashes[tokenId];
    }
}
