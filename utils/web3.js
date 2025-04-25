import { ethers } from 'ethers';
import { CONTRACT_ADDRESSES, CREATOR_REGISTRY_ABI, CONTENT_NFT_ABI, SUBSCRIPTION_MANAGER_ABI } from './constants';

export const getEthereumProvider = () => {
  if (typeof window !== 'undefined' && window.ethereum) {
    return new ethers.providers.Web3Provider(window.ethereum);
  }
  return null;
};

export const getCreatorRegistryContract = (providerOrSigner) => {
  return new ethers.Contract(
    CONTRACT_ADDRESSES.creatorRegistry,
    CREATOR_REGISTRY_ABI,
    providerOrSigner
  );
};

export const getContentNFTContract = (providerOrSigner) => {
  return new ethers.Contract(
    CONTRACT_ADDRESSES.contentNFT,
    CONTENT_NFT_ABI,
    providerOrSigner
  );
};

export const getSubscriptionManagerContract = (providerOrSigner) => {
  return new ethers.Contract(
    CONTRACT_ADDRESSES.subscriptionManager,
    SUBSCRIPTION_MANAGER_ABI,
    providerOrSigner
  );
};

export const formatEther = (wei) => {
  return ethers.utils.formatEther(wei);
};

export const parseEther = (ether) => {
  return ethers.utils.parseEther(ether);
};

export const shortenAddress = (address) => {
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
};

export const uploadToIPFS = async (data) => {
  // In a real application, you would implement IPFS upload
  // This is a placeholder
  console.log('Uploading to IPFS:', data);
  return `ipfs://QmExample${Math.floor(Math.random() * 1000000)}`;
};