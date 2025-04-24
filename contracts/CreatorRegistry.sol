// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract CreatorRegistry is Ownable {
    using Counters for Counters.Counter;

    struct Creator {
        uint256 id;
        address wallet;
        string metadataURI;
        uint256 totalSubscribers;
        uint256 totalEarnings;
        bool isVerified;
        uint256 createdAt;
        uint256 updatedAt;
    }

    Counters.Counter private _creatorIds;
    mapping(uint256 => Creator) public creators;
    mapping(address => uint256) public creatorIdByWallet;
    mapping(address => bool) public isCreator;

    event CreatorRegistered(uint256 indexed creatorId, address indexed wallet, string metadataURI);
    event CreatorVerified(uint256 indexed creatorId, address indexed wallet);
    event CreatorUpdated(uint256 indexed creatorId, string newMetadataURI);

    constructor() Ownable(msg.sender) {}

    function registerCreator(string memory metadataURI) external returns (uint256) {
        require(!isCreator[msg.sender], "Already registered as creator");
        
        _creatorIds.increment();
        uint256 newCreatorId = _creatorIds.current();
        
        creators[newCreatorId] = Creator({
            id: newCreatorId,
            wallet: msg.sender,
            metadataURI: metadataURI,
            totalSubscribers: 0,
            totalEarnings: 0,
            isVerified: false,
            createdAt: block.timestamp,
            updatedAt: block.timestamp
        });
        
        creatorIdByWallet[msg.sender] = newCreatorId;
        isCreator[msg.sender] = true;
        
        emit CreatorRegistered(newCreatorId, msg.sender, metadataURI);
        return newCreatorId;
    }

    function updateCreatorMetadata(uint256 creatorId, string memory newMetadataURI) external {
        require(creators[creatorId].wallet == msg.sender, "Not the creator");
        creators[creatorId].metadataURI = newMetadataURI;
        creators[creatorId].updatedAt = block.timestamp;
        
        emit CreatorUpdated(creatorId, newMetadataURI);
    }

    function verifyCreator(uint256 creatorId) external onlyOwner {
        require(creators[creatorId].id != 0, "Creator does not exist");
        creators[creatorId].isVerified = true;
        
        emit CreatorVerified(creatorId, creators[creatorId].wallet);
    }

    function getCreator(uint256 creatorId) external view returns (Creator memory) {
        return creators[creatorId];
    }

    function getCreatorIdByWallet(address wallet) external view returns (uint256) {
        return creatorIdByWallet[wallet];
    }

    function getTotalCreators() external view returns (uint256) {
        return _creatorIds.current();
    }

    function updateSubscriberCount(uint256 creatorId, uint256 amount) external {
        require(msg.sender == owner(), "Only owner can update subscriber count");
        creators[creatorId].totalSubscribers += amount;
    }

    function updateEarnings(uint256 creatorId, uint256 amount) external {
        require(msg.sender == owner(), "Only owner can update earnings");
        creators[creatorId].totalEarnings += amount;
    }
} 