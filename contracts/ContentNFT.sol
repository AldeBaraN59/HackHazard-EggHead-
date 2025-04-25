// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract ContentNFT is ERC721, Ownable {
    using Counters for Counters.Counter;

    struct Tier {
        uint256 id;
        uint256 creatorId;
        string name;
        string metadataURI;
        uint256 price;
        uint256 createdAt;
    }

    Counters.Counter private _tokenIds;
    Counters.Counter private _tierIds;

    mapping(uint256 => Tier) public tiers;
    mapping(uint256 => mapping(uint256 => bool)) public tierAccess; // tokenId => tierId => hasAccess
    mapping(uint256 => uint256) public tokenTier; // tokenId => tierId
    mapping(uint256 => string) public tokenContentURI; // tokenId => contentURI

    event TierCreated(
        uint256 indexed tierId,
        uint256 indexed creatorId,
        string name,
        uint256 price
    );

    event ContentMinted(
        uint256 indexed tokenId,
        uint256 indexed tierId,
        address indexed owner,
        string contentURI
    );

    constructor() ERC721("ContentNFT", "CNFT") Ownable(msg.sender) {}

    function createTier(
        uint256 creatorId,
        string memory name,
        string memory metadataURI,
        uint256 price
    ) external onlyOwner returns (uint256) {
        _tierIds.increment();
        uint256 newTierId = _tierIds.current();

        tiers[newTierId] = Tier({
            id: newTierId,
            creatorId: creatorId,
            name: name,
            metadataURI: metadataURI,
            price: price,
            createdAt: block.timestamp
        });

        emit TierCreated(newTierId, creatorId, name, price);
        return newTierId;
    }

    function mintContent(
        uint256 tierId,
        string memory contentURI
    ) external onlyOwner returns (uint256) {
        require(tiers[tierId].id != 0, "Tier does not exist");

        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();

        _mint(msg.sender, newTokenId);
        tokenTier[newTokenId] = tierId;
        tokenContentURI[newTokenId] = contentURI;
        tierAccess[newTokenId][tierId] = true;

        emit ContentMinted(newTokenId, tierId, msg.sender, contentURI);
        return newTokenId;
    }

    function grantAccess(uint256 tokenId, uint256 tierId) external onlyOwner {
        require(_exists(tokenId), "Token does not exist");
        require(tiers[tierId].id != 0, "Tier does not exist");
        tierAccess[tokenId][tierId] = true;
    }

    function revokeAccess(uint256 tokenId, uint256 tierId) external onlyOwner {
        require(_exists(tokenId), "Token does not exist");
        require(tiers[tierId].id != 0, "Tier does not exist");
        tierAccess[tokenId][tierId] = false;
    }

    function hasAccess(uint256 tokenId, uint256 tierId) external view returns (bool) {
        return tierAccess[tokenId][tierId];
    }

    function getTier(uint256 tierId) external view returns (Tier memory) {
        return tiers[tierId];
    }

    function getTokenTier(uint256 tokenId) external view returns (uint256) {
        return tokenTier[tokenId];
    }

    function getContentURI(uint256 tokenId) external view returns (string memory) {
        return tokenContentURI[tokenId];
    }

    function _baseURI() internal pure override returns (string memory) {
        return "ipfs://";
    }
} 