import { ethers } from 'ethers'

const CREATOR_REGISTRY_ABI = [
  'function registerCreator(string memory metadataURI) external returns (uint256)',
  'function getCreator(uint256 creatorId) external view returns (tuple(uint256 id, address wallet, string metadataURI, uint256 totalSubscribers, uint256 totalEarnings, bool isVerified, uint256 createdAt, uint256 updatedAt))',
  'function getCreatorIdByWallet(address wallet) external view returns (uint256)',
  'function getCreatorCount() external view returns (uint256)'
]

const SUBSCRIPTION_MANAGER_ABI = [
  'function subscribe(uint256 creatorId, uint256 tierId, uint256 months) external payable returns (uint256)',
  'function cancelSubscription(uint256 subscriptionId) external',
  'function getSubscription(uint256 subscriptionId) external view returns (tuple(uint256 id, uint256 creatorId, uint256 tierId, address subscriber, uint256 startTime, uint256 endTime, uint256 amountPaid, bool isActive, uint256 createdAt))',
  'function getSubscriptionsBySubscriber(address subscriber) external view returns (uint256[])',
  'function getSubscriptionsByCreator(uint256 creatorId) external view returns (uint256[])'
]

const CONTENT_NFT_ABI = [
  'function createTier(uint256 creatorId, string memory name, string memory metadataURI, uint256 price) external returns (uint256)',
  'function mintContent(uint256 tierId, string memory contentURI) external returns (uint256)',
  'function hasAccess(uint256 tokenId, uint256 tierId) external view returns (bool)',
  'function getTokenTier(uint256 tokenId) external view returns (uint256)',
  'function getContentURI(uint256 tokenId) external view returns (string memory)',
  'function getTierCount(uint256 creatorId) external view returns (uint256)',
  'function getTier(uint256 creatorId, uint256 tierId) external view returns (tuple(uint256 id, string name, string metadataURI, uint256 price, uint256 createdAt))',
  'function getContentCount(uint256 creatorId) external view returns (uint256)',
  'function getContent(uint256 creatorId, uint256 contentId) external view returns (tuple(uint256 id, string contentURI, string metadataURI, uint256 tierId, uint256 timestamp))',
  'function getTierSubscriberCount(uint256 creatorId, uint256 tierId) external view returns (uint256)'
]

export function getCreatorRegistryContract(signer) {
  if (!process.env.NEXT_PUBLIC_CREATOR_REGISTRY_ADDRESS) {
    throw new Error("Creator Registry address not configured")
  }
  return new ethers.Contract(
    process.env.NEXT_PUBLIC_CREATOR_REGISTRY_ADDRESS,
    CREATOR_REGISTRY_ABI,
    signer
  )
}

export function getSubscriptionManagerContract(signer) {
  return new ethers.Contract(
    process.env.NEXT_PUBLIC_SUBSCRIPTION_MANAGER_ADDRESS,
    SUBSCRIPTION_MANAGER_ABI,
    signer
  )
}

export function getContentNFTContract(signer) {
  return new ethers.Contract(
    process.env.NEXT_PUBLIC_CONTENT_NFT_ADDRESS,
    CONTENT_NFT_ABI,
    signer
  )
} 