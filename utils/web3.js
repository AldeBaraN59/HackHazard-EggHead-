import { ethers } from 'ethers';
import { CONTRACT_ADDRESSES, CREATOR_REGISTRY_ABI, CONTENT_NFT_ABI, SUBSCRIPTION_MANAGER_ABI } from './constants';

export const getEthereumProvider = () => {
  if (typeof window !== 'undefined' && window.ethereum) {
    return new ethers.BrowserProvider(window.ethereum); // Changed from Web3Provider to BrowserProvider
  }
  return null;
};

// utils/web3.js
export const getCreatorRegistryContract = (signer) => {
  if (!signer) {
    throw new Error('Signer is required');
  }

  if (!CONTRACT_ADDRESSES.creatorRegistry) {
    throw new Error('Creator Registry contract address not configured');
  }

  if (!ethers.isAddress(CONTRACT_ADDRESSES.creatorRegistry)) {
    throw new Error('Invalid contract address');
  }

  try {
    const contract = new ethers.Contract(
      CONTRACT_ADDRESSES.creatorRegistry,
      CREATOR_REGISTRY_ABI,
      signer
    );
    
    // Verify contract is connected
    if (!contract.registerCreator) {
      throw new Error('Contract ABI mismatch - registerCreator not found');
    }
    
    return contract;
  } catch (err) {
    throw new Error(`Contract initialization failed: ${err.message}`);
  }
};

export const getContentNFTContract = (providerOrSigner) => {
  return new ethers.Contract(
    CONTRACT_ADDRESSES.contentNFT,
    CONTENT_NFT_ABI,
    providerOrSigner
  );
};
export const validateContractAddress = (address) => {
  return ethers.isAddress(address);
};
export const validateMetadataURI = (uri) => {
  try {
    const parsed = JSON.parse(uri);
    return typeof parsed === 'object' && parsed !== null;
  } catch {
    return false;
  }
};

export const getSubscriptionManagerContract = (providerOrSigner) => {
  return new ethers.Contract(
    CONTRACT_ADDRESSES.subscriptionManager,
    SUBSCRIPTION_MANAGER_ABI,
    providerOrSigner
  );
};

export const formatEther = (wei) => {
  return ethers.formatEther(wei); // Updated to ethers v6 format
};

export const parseEther = (ether) => {
  return ethers.parseEther(ether); // Updated to ethers v6 format
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