// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";


/**
 * @title CreatorRegistry
 * @dev Manages creator profiles and their metadata
 */
contract CreatorRegistry is Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;
    using EnumerableSet for EnumerableSet.AddressSet;

    Counters.Counter private _creatorIds;
    EnumerableSet.AddressSet private _verifiedCreators;

    struct Creator {
        uint256 id;
        address payable wallet;
        string metadataURI;
        uint256 totalSubscribers;
        uint256 totalEarnings;
        bool isVerified;
        uint256 createdAt;
        uint256 updatedAt;
    }

    mapping(uint256 => Creator) public creators;
    mapping(address => uint256) public walletToCreatorId;
    
    event CreatorRegistered(uint256 indexed creatorId, address indexed wallet, string metadataURI);
    event CreatorUpdated(uint256 indexed creatorId, string metadataURI);
    event CreatorVerified(uint256 indexed creatorId);
    event CreatorStatsUpdated(uint256 indexed creatorId, uint256 totalSubscribers, uint256 totalEarnings);

    modifier onlyCreator() {
        require(walletToCreatorId[msg.sender] != 0, "Not a registered creator");
        _;
    }

    constructor() {}

    /**
     * @dev Register a new creator
     * @param metadataURI IPFS URI containing creator profile metadata
     */
    function registerCreator(string memory metadataURI) external nonReentrant {
        require(walletToCreatorId[msg.sender] == 0, "Already registered as creator");
        require(bytes(metadataURI).length > 0, "Metadata URI is required");
        
        _creatorIds.increment();
        uint256 newCreatorId = _creatorIds.current();
        
        creators[newCreatorId] = Creator({
            id: newCreatorId,
            wallet: payable(msg.sender),
            metadataURI: metadataURI,
            totalSubscribers: 0,
            totalEarnings: 0,
            isVerified: false,
            createdAt: block.timestamp,
            updatedAt: block.timestamp
        });
        
        walletToCreatorId[msg.sender] = newCreatorId;
        
        emit CreatorRegistered(newCreatorId, msg.sender, metadataURI);
    }

    /**
     * @dev Update creator profile metadata
     * @param metadataURI New IPFS URI containing updated creator profile metadata
     */
    function updateCreator(string memory metadataURI) external onlyCreator {
        require(bytes(metadataURI).length > 0, "Metadata URI is required");
        
        uint256 creatorId = walletToCreatorId[msg.sender];
        creators[creatorId].metadataURI = metadataURI;
        creators[creatorId].updatedAt = block.timestamp;
        
        emit CreatorUpdated(creatorId, metadataURI);
    }

    /**
     * @dev Verify a creator (admin only)
     * @param creatorId ID of the creator to verify
     */
    function verifyCreator(uint256 creatorId) external onlyOwner {
        require(creatorId != 0 && creatorId <= _creatorIds.current(), "Invalid creator ID");
        require(!creators[creatorId].isVerified, "Creator already verified");
        
        creators[creatorId].isVerified = true;
        _verifiedCreators.add(creators[creatorId].wallet);
        
        emit CreatorVerified(creatorId);
    }

    /**
     * @dev Update creator stats (called from subscription contract)
     * @param creatorId ID of the creator
     * @param subscriberChange Change in subscriber count (+ or -)
     * @param earningsChange Change in earnings
     */
    function updateStats(uint256 creatorId, int256 subscriberChange, uint256 earningsChange) 
        external 
        nonReentrant 
    {
        require(creatorId != 0 && creatorId <= _creatorIds.current(), "Invalid creator ID");
        
        Creator storage creator = creators[creatorId];
        
        if (subscriberChange > 0) {
            creator.totalSubscribers += uint256(subscriberChange);
        } else if (subscriberChange < 0) {
            // Ensure we don't underflow
            uint256 absChange = uint256(-subscriberChange);
            if (creator.totalSubscribers >= absChange) {
                creator.totalSubscribers -= absChange;
            } else {
                creator.totalSubscribers = 0;
            }
        }
        
        creator.totalEarnings += earningsChange;
        creator.updatedAt = block.timestamp;
        
        emit CreatorStatsUpdated(creatorId, creator.totalSubscribers, creator.totalEarnings);
    }

    /**
     * @dev Get creator info
     * @param creatorId ID of the creator
     */
    function getCreator(uint256 creatorId) external view returns (Creator memory) {
        require(creatorId != 0 && creatorId <= _creatorIds.current(), "Invalid creator ID");
        return creators[creatorId];
    }

    /**
     * @dev Get creator ID by wallet address
     * @param wallet Wallet address of the creator
     */
    function getCreatorIdByWallet(address wallet) external view returns (uint256) {
        return walletToCreatorId[wallet];
    }

    /**
     * @dev Check if a creator is verified
     * @param wallet Wallet address of the creator
     */
    function isVerifiedCreator(address wallet) external view returns (bool) {
        return _verifiedCreators.contains(wallet);
    }

    /**
     * @dev Get total number of registered creators
     */
    function getTotalCreators() external view returns (uint256) {
        return _creatorIds.current();
    }
}

/**
 * @title ContentNFT
 * @dev Manages NFTs for accessing exclusive content
 */
contract ContentNFT is ERC1155, Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;

    CreatorRegistry public creatorRegistry;
    Counters.Counter private _tokenIds;

    struct ContentTier {
        uint256 id;
        uint256 creatorId;
        string name;
        string metadataURI;
        uint256 price;
        uint256 createdAt;
    }

    mapping(uint256 => ContentTier) public contentTiers;
    mapping(uint256 => mapping(uint256 => bool)) public creatorTiers; // creatorId => tierId => exists

    event TierCreated(uint256 indexed tierId, uint256 indexed creatorId, string name, uint256 price);
    event TokenMinted(address indexed to, uint256 indexed tierId, uint256 amount);

    modifier onlyCreator() {
        require(creatorRegistry.getCreatorIdByWallet(msg.sender) != 0, "Not a registered creator");
        _;
    }

    constructor(address _creatorRegistry) ERC1155("") {
        creatorRegistry = CreatorRegistry(_creatorRegistry);
    }

    /**
     * @dev Set the URI for all tokens
     * @param newuri New URI for all tokens
     */
    function setURI(string memory newuri) external onlyOwner {
        _setURI(newuri);
    }

    /**
     * @dev Create a new subscription tier
     * @param name Name of the tier
     * @param metadataURI IPFS URI containing tier metadata
     * @param price Price of the tier in wei
     */
    function createTier(string memory name, string memory metadataURI, uint256 price) 
        external 
        onlyCreator 
        returns (uint256) 
    {
        require(bytes(name).length > 0, "Name is required");
        require(bytes(metadataURI).length > 0, "Metadata URI is required");
        require(price > 0, "Price must be greater than zero");
        
        uint256 creatorId = creatorRegistry.getCreatorIdByWallet(msg.sender);
        
        _tokenIds.increment();
        uint256 newTierId = _tokenIds.current();
        
        contentTiers[newTierId] = ContentTier({
            id: newTierId,
            creatorId: creatorId,
            name: name,
            metadataURI: metadataURI,
            price: price,
            createdAt: block.timestamp
        });
        
        creatorTiers[creatorId][newTierId] = true;
        
        emit TierCreated(newTierId, creatorId, name, price);
        
        return newTierId;
    }

    /**
     * @dev Mint a token for a subscriber (called from subscription contract)
     * @param to Address to mint the token to
     * @param tierId ID of the content tier
     * @param amount Amount of tokens to mint
     */
    function mintToken(address to, uint256 tierId, uint256 amount) 
        external 
        nonReentrant 
        returns (bool) 
    {
        require(tierId != 0 && tierId <= _tokenIds.current(), "Invalid tier ID");
        require(amount > 0, "Amount must be greater than zero");
        
        _mint(to, tierId, amount, "");
        
        emit TokenMinted(to, tierId, amount);
        
        return true;
    }

    /**
     * @dev Check if an address owns a specific content tier
     * @param account Address to check
     * @param tierId ID of the content tier
     */
    function hasAccess(address account, uint256 tierId) external view returns (bool) {
        return balanceOf(account, tierId) > 0;
    }

    /**
     * @dev Get tier details
     * @param tierId ID of the content tier
     */
    function getTier(uint256 tierId) external view returns (ContentTier memory) {
        require(tierId != 0 && tierId <= _tokenIds.current(), "Invalid tier ID");
        return contentTiers[tierId];
    }

    /**
     * @dev URI override to return tier-specific metadata
     * @param id ID of the content tier
     */
    function uri(uint256 id) public view override returns (string memory) {
        require(id != 0 && id <= _tokenIds.current(), "Invalid tier ID");
        return contentTiers[id].metadataURI;
    }
}

/**
 * @title SubscriptionManager
 * @dev Manages subscriptions and payments
 */
contract SubscriptionManager is Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;

    CreatorRegistry public creatorRegistry;
    ContentNFT public contentNFT;
    address public treasuryWallet;
    uint256 public platformFeePercent = 5; // 5% platform fee

    Counters.Counter private _subscriptionIds;

    enum SubscriptionStatus { Active, Expired, Cancelled }
    enum PaymentType { Native, ERC20 }

    struct Subscription {
        uint256 id;
        address subscriber;
        uint256 creatorId;
        uint256 tierId;
        uint256 amount;
        uint256 startTime;
        uint256 endTime;
        SubscriptionStatus status;
        PaymentType paymentType;
        address tokenAddress; // For ERC20 payments
    }

    mapping(uint256 => Subscription) public subscriptions;
    mapping(address => mapping(uint256 => uint256[])) public subscriberSubscriptions; // subscriber => creatorId => subscriptionIds

    event SubscriptionCreated(
        uint256 indexed subscriptionId, 
        address indexed subscriber, 
        uint256 indexed creatorId, 
        uint256 tierId, 
        uint256 amount, 
        uint256 startTime, 
        uint256 endTime
    );
    event SubscriptionRenewed(uint256 indexed subscriptionId, uint256 newEndTime);
    event SubscriptionCancelled(uint256 indexed subscriptionId);
    event PaymentProcessed(uint256 indexed subscriptionId, uint256 amount, address tokenAddress);

    constructor(address _creatorRegistry, address _contentNFT, address _treasuryWallet) {
        require(_treasuryWallet != address(0), "Treasury wallet cannot be zero address");
        creatorRegistry = CreatorRegistry(_creatorRegistry);
        contentNFT = ContentNFT(_contentNFT);
        treasuryWallet = _treasuryWallet;
    }

    /**
     * @dev Set platform fee percentage
     * @param newFeePercent New platform fee percentage (0-100)
     */
    function setPlatformFee(uint256 newFeePercent) external onlyOwner {
        require(newFeePercent <= 100, "Fee percentage must be between 0 and 100");
        platformFeePercent = newFeePercent;
    }

    /**
     * @dev Set treasury wallet address
     * @param newTreasuryWallet New treasury wallet address
     */
    function setTreasuryWallet(address newTreasuryWallet) external onlyOwner {
        require(newTreasuryWallet != address(0), "Treasury wallet cannot be zero address");
        treasuryWallet = newTreasuryWallet;
    }

    /**
     * @dev Subscribe to a creator's tier using native currency
     * @param creatorId ID of the creator
     * @param tierId ID of the tier
     * @param months Number of months to subscribe
     */
    function subscribe(uint256 creatorId, uint256 tierId, uint256 months) 
        external 
        payable 
        nonReentrant 
        returns (uint256) 
    {
        require(months > 0, "Must subscribe for at least one month");
        require(creatorId != 0, "Invalid creator ID");
        
        ContentNFT.ContentTier memory tier = contentNFT.getTier(tierId);
        require(tier.creatorId == creatorId, "Tier does not belong to creator");
        
        uint256 totalAmount = tier.price * months;
        require(msg.value >= totalAmount, "Insufficient payment");
        
        // Process payment
        uint256 platformFee = (totalAmount * platformFeePercent) / 100;
        uint256 creatorAmount = totalAmount - platformFee;
        
        CreatorRegistry.Creator memory creator = creatorRegistry.getCreator(creatorId);
        
        // Send payment to creator and platform
        (bool sentCreator, ) = creator.wallet.call{value: creatorAmount}("");
        require(sentCreator, "Failed to send payment to creator");
        
        (bool sentPlatform, ) = payable(treasuryWallet).call{value: platformFee}("");
        require(sentPlatform, "Failed to send platform fee");
        
        // Refund excess payment if any
        if (msg.value > totalAmount) {
            (bool refunded, ) = msg.sender.call{value: msg.value - totalAmount}("");
            require(refunded, "Failed to refund excess payment");
        }
        
        // Create subscription
        _subscriptionIds.increment();
        uint256 newSubscriptionId = _subscriptionIds.current();
        
        uint256 startTime = block.timestamp;
        uint256 endTime = startTime + (months * 30 days);
        
        subscriptions[newSubscriptionId] = Subscription({
            id: newSubscriptionId,
            subscriber: msg.sender,
            creatorId: creatorId,
            tierId: tierId,
            amount: totalAmount,
            startTime: startTime,
            endTime: endTime,
            status: SubscriptionStatus.Active,
            paymentType: PaymentType.Native,
            tokenAddress: address(0)
        });
        
        subscriberSubscriptions[msg.sender][creatorId].push(newSubscriptionId);
        
        // Mint access token
        contentNFT.mintToken(msg.sender, tierId, 1);
        
        // Update creator stats
        creatorRegistry.updateStats(creatorId, 1, creatorAmount);
        
        emit SubscriptionCreated(
            newSubscriptionId, 
            msg.sender, 
            creatorId, 
            tierId, 
            totalAmount, 
            startTime, 
            endTime
        );
        emit PaymentProcessed(newSubscriptionId, totalAmount, address(0));
        
        return newSubscriptionId;
    }

    /**
     * @dev Subscribe using ERC20 tokens
     * @param creatorId ID of the creator
     * @param tierId ID of the tier
     * @param months Number of months to subscribe
     * @param tokenAddress Address of the ERC20 token
     */
    function subscribeWithERC20(uint256 creatorId, uint256 tierId, uint256 months, address tokenAddress) 
        external 
        nonReentrant 
        returns (uint256) 
    {
        require(months > 0, "Must subscribe for at least one month");
        require(creatorId != 0, "Invalid creator ID");
        require(tokenAddress != address(0), "Invalid token address");
        
        ContentNFT.ContentTier memory tier = contentNFT.getTier(tierId);
        require(tier.creatorId == creatorId, "Tier does not belong to creator");
        
        uint256 totalAmount = tier.price * months;
        IERC20 token = IERC20(tokenAddress);
        
        // Check allowance
        require(token.allowance(msg.sender, address(this)) >= totalAmount, "Insufficient token allowance");
        
        // Process payment
        uint256 platformFee = (totalAmount * platformFeePercent) / 100;
        uint256 creatorAmount = totalAmount - platformFee;
        
        CreatorRegistry.Creator memory creator = creatorRegistry.getCreator(creatorId);
        
        // Transfer tokens to creator and platform
        require(token.transferFrom(msg.sender, creator.wallet, creatorAmount), "Failed to transfer tokens to creator");
        require(token.transferFrom(msg.sender, treasuryWallet, platformFee), "Failed to transfer platform fee");
        
        // Create subscription
        _subscriptionIds.increment();
        uint256 newSubscriptionId = _subscriptionIds.current();
        
        uint256 startTime = block.timestamp;
        uint256 endTime = startTime + (months * 30 days);
        
        subscriptions[newSubscriptionId] = Subscription({
            id: newSubscriptionId,
            subscriber: msg.sender,
            creatorId: creatorId,
            tierId: tierId,
            amount: totalAmount,
            startTime: startTime,
            endTime: endTime,
            status: SubscriptionStatus.Active,
            paymentType: PaymentType.ERC20,
            tokenAddress: tokenAddress
        });
        
        subscriberSubscriptions[msg.sender][creatorId].push(newSubscriptionId);
        
        // Mint access token
        contentNFT.mintToken(msg.sender, tierId, 1);
        
        // Update creator stats
        creatorRegistry.updateStats(creatorId, 1, creatorAmount);
        
        emit SubscriptionCreated(
            newSubscriptionId, 
            msg.sender, 
            creatorId, 
            tierId, 
            totalAmount, 
            startTime, 
            endTime
        );
        emit PaymentProcessed(newSubscriptionId, totalAmount, tokenAddress);
        
        return newSubscriptionId;
    }

    /**
     * @dev Renew an existing subscription
     * @param subscriptionId ID of the subscription to renew
     * @param months Number of additional months
     */
    function renewSubscription(uint256 subscriptionId, uint256 months) 
        external 
        payable 
        nonReentrant 
    {
        require(subscriptionId != 0 && subscriptionId <= _subscriptionIds.current(), "Invalid subscription ID");
        require(months > 0, "Must renew for at least one month");
        
        Subscription storage subscription = subscriptions[subscriptionId];
        require(subscription.subscriber == msg.sender, "Not subscription owner");
        
        ContentNFT.ContentTier memory tier = contentNFT.getTier(subscription.tierId);
        uint256 totalAmount = tier.price * months;
        
        if (subscription.paymentType == PaymentType.Native) {
            require(msg.value >= totalAmount, "Insufficient payment");
            
            // Process payment
            uint256 platformFee = (totalAmount * platformFeePercent) / 100;
            uint256 creatorAmount = totalAmount - platformFee;
            
            CreatorRegistry.Creator memory creator = creatorRegistry.getCreator(subscription.creatorId);
            
            // Send payment to creator and platform
            (bool sentCreator, ) = creator.wallet.call{value: creatorAmount}("");
            require(sentCreator, "Failed to send payment to creator");
            
            (bool sentPlatform, ) = payable(treasuryWallet).call{value: platformFee}("");
            require(sentPlatform, "Failed to send platform fee");
            
            // Refund excess payment if any
            if (msg.value > totalAmount) {
                (bool refunded, ) = msg.sender.call{value: msg.value - totalAmount}("");
                require(refunded, "Failed to refund excess payment");
            }
            
            // Update creator stats
            creatorRegistry.updateStats(subscription.creatorId, 0, creatorAmount);
            
            // Update subscription
            uint256 newEndTime;
            if (subscription.status == SubscriptionStatus.Expired || block.timestamp > subscription.endTime) {
                // If expired, start a new period from now
                newEndTime = block.timestamp + (months * 30 days);
                subscription.status = SubscriptionStatus.Active;
            } else {
                // If active, extend the current period
                newEndTime = subscription.endTime + (months * 30 days);
            }
            
            subscription.endTime = newEndTime;
            
            emit SubscriptionRenewed(subscriptionId, newEndTime);
            emit PaymentProcessed(subscriptionId, totalAmount, address(0));
        } else {
            // ERC20 renewal logic
            IERC20 token = IERC20(subscription.tokenAddress);
            
            // Check allowance
            require(token.allowance(msg.sender, address(this)) >= totalAmount, "Insufficient token allowance");
            
            // Process payment
            uint256 platformFee = (totalAmount * platformFeePercent) / 100;
            uint256 creatorAmount = totalAmount - platformFee;
            
            CreatorRegistry.Creator memory creator = creatorRegistry.getCreator(subscription.creatorId);
            
            // Transfer tokens to creator and platform
            require(token.transferFrom(msg.sender, creator.wallet, creatorAmount), "Failed to transfer tokens to creator");
            require(token.transferFrom(msg.sender, treasuryWallet, platformFee), "Failed to transfer platform fee");
            
            // Update creator stats
            creatorRegistry.updateStats(subscription.creatorId, 0, creatorAmount);
            
            // Update subscription
            uint256 newEndTime;
            if (subscription.status == SubscriptionStatus.Expired || block.timestamp > subscription.endTime) {
                // If expired, start a new period from now
                newEndTime = block.timestamp + (months * 30 days);
                subscription.status = SubscriptionStatus.Active;
            } else {
                // If active, extend the current period
                newEndTime = subscription.endTime + (months * 30 days);
            }
            
            subscription.endTime = newEndTime;
            
            emit SubscriptionRenewed(subscriptionId, newEndTime);
            emit PaymentProcessed(subscriptionId, totalAmount, subscription.tokenAddress);
        }
    }

    /**
     * @dev Cancel an active subscription
     * @param subscriptionId ID of the subscription to cancel
     */
    function cancelSubscription(uint256 subscriptionId) external nonReentrant {
        require(subscriptionId != 0 && subscriptionId <= _subscriptionIds.current(), "Invalid subscription ID");
        
        Subscription storage subscription = subscriptions[subscriptionId];
        require(subscription.subscriber == msg.sender, "Not subscription owner");
        require(subscription.status == SubscriptionStatus.Active, "Subscription not active");
        
        subscription.status = SubscriptionStatus.Cancelled;
        
        // Update creator stats (decrement subscriber count)
        creatorRegistry.updateStats(subscription.creatorId, -1, 0);
        
        emit SubscriptionCancelled(subscriptionId);
    }

    /**
     * @dev Check if a subscription is active
     * @param subscriptionId ID of the subscription
     */
    function isSubscriptionActive(uint256 subscriptionId) external view returns (bool) {
        require(subscriptionId != 0 && subscriptionId <= _subscriptionIds.current(), "Invalid subscription ID");
        
        Subscription memory subscription = subscriptions[subscriptionId];
        return (subscription.status == SubscriptionStatus.Active && block.timestamp <= subscription.endTime);
    }

    /**
     * @dev Get all subscriptions for a subscriber to a creator
     * @param subscriber Address of the subscriber
     * @param creatorId ID of the creator
     */
    function getSubscriberSubscriptions(address subscriber, uint256 creatorId) 
        external 
        view 
        returns (uint256[] memory) 
    {
        return subscriberSubscriptions[subscriber][creatorId];
    }

    /**
     * @dev Get subscription details
     * @param subscriptionId ID of the subscription
     */
    function getSubscription(uint256 subscriptionId) 
        external 
        view 
        returns (Subscription memory) 
    {
        require(subscriptionId != 0 && subscriptionId <= _subscriptionIds.current(), "Invalid subscription ID");
        return subscriptions[subscriptionId];
    }
}

/**
 * @title DeployerContract
 * @dev Factory contract to deploy the Web3 Patreon ecosystem
 */
contract DeployerContract {
    address public creatorRegistry;
    address public contentNFT;
    address public subscriptionManager;
    address public owner;

    event ContractsDeployed(
        address indexed creatorRegistry,
        address indexed contentNFT,
        address indexed subscriptionManager
    );

    constructor(address treasuryWallet) {
        require(treasuryWallet != address(0), "Treasury wallet cannot be zero address");
        
        owner = msg.sender;
        
        // Deploy creator registry
        CreatorRegistry registry = new CreatorRegistry();
        creatorRegistry = address(registry);
        registry.transferOwnership(owner);
        
        // Deploy content NFT
        ContentNFT nft = new ContentNFT(creatorRegistry);
        contentNFT = address(nft);
        nft.transferOwnership(owner);
        
        // Deploy subscription manager
        SubscriptionManager manager = new SubscriptionManager(creatorRegistry, contentNFT, treasuryWallet);
        subscriptionManager = address(manager);
        manager.transferOwnership(owner);
        
        emit ContractsDeployed(creatorRegistry, contentNFT, subscriptionManager);
    }
}