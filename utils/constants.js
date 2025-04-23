export const CREATOR_REGISTRY_ABI = [
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "metadataURI",
        "type": "string"
      }
    ],
    "name": "registerCreator",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
    "function registerCreator(string memory metadataURI) external nonReentrant",
    "function updateCreator(string memory metadataURI) external onlyCreator",
    "function getCreator(uint256 creatorId) external view returns (tuple(uint256 id,address payable wallet,string metadataURI,uint256 totalSubscribers,uint256 totalEarnings,bool isVerified,uint256 createdAt,uint256 updatedAt))",
    "function getCreatorIdByWallet(address wallet) external view returns (uint256)",
    "function isVerifiedCreator(address wallet) external view returns (bool)",
    "function getTotalCreators() external view returns (uint256)"
  ];
  
  export const CONTENT_NFT_ABI = [
    "function createTier(string memory name, string memory metadataURI, uint256 price) external onlyCreator returns (uint256)",
    "function getTier(uint256 tierId) external view returns (tuple(uint256 id, uint256 creatorId, string name, string metadataURI, uint256 price, uint256 createdAt))",
    "function hasAccess(address account, uint256 tierId) external view returns (bool)",
    "function uri(uint256 id) public view override returns (string memory)"
  ];
  
  export const SUBSCRIPTION_MANAGER_ABI = [
    "function subscribe(uint256 creatorId, uint256 tierId, uint256 months) external payable nonReentrant returns (uint256)",
    "function subscribeWithERC20(uint256 creatorId, uint256 tierId, uint256 months, address tokenAddress) external nonReentrant returns (uint256)",
    "function renewSubscription(uint256 subscriptionId, uint256 months) external payable nonReentrant",
    "function cancelSubscription(uint256 subscriptionId) external nonReentrant",
    "function isSubscriptionActive(uint256 subscriptionId) external view returns (bool)",
    "function getSubscriberSubscriptions(address subscriber, uint256 creatorId) external view returns (uint256[] memory)",
    "function getSubscription(uint256 subscriptionId) external view returns (tuple(uint256 id, address subscriber, uint256 creatorId, uint256 tierId, uint256 amount, uint256 startTime, uint256 endTime, uint8 status, uint8 paymentType, address tokenAddress))"
  ];
  
  // Replace these with your deployed contract addresses
  export const CONTRACT_ADDRESSES = {
    creatorRegistry: "0x...",
    contentNFT: "0x...",
    subscriptionManager: "0x..."
  };
  
  export const SUPPORTED_CHAINS = [1, 5, 11155111]; // Ethereum Mainnet, Goerli, Sepolia