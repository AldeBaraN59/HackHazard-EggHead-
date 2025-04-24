'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { ethers } from 'ethers';

export const Web3Context = createContext();

export function Web3Provider({ children }) {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [address, setAddress] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [contracts, setContracts] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        setProvider(provider);

        window.ethereum.on('accountsChanged', handleAccountsChanged);
        window.ethereum.on('chainChanged', handleChainChanged);

        return () => {
          window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
          window.ethereum.removeListener('chainChanged', handleChainChanged);
        };
      } catch (err) {
        setError('Failed to initialize Web3 provider');
        console.error('Web3 initialization error:', err);
      }
    } else {
      setError('Please install MetaMask or another Web3 wallet');
    }
  }, []);

  const handleAccountsChanged = async (accounts) => {
    try {
      if (accounts.length === 0) {
        setIsConnected(false);
        setAddress('');
        setSigner(null);
        setContracts({});
      } else {
        setAddress(accounts[0]);
        const signer = await provider.getSigner();
        setSigner(signer);
        setIsConnected(true);
        await initializeContracts(signer);
      }
    } catch (err) {
      setError('Failed to handle account change');
      console.error('Account change error:', err);
    }
  };

  const handleChainChanged = () => {
    window.location.reload();
  };

  const initializeContracts = async (signer) => {
    try {
      const creatorRegistry = new ethers.Contract(
        process.env.NEXT_PUBLIC_CREATOR_REGISTRY_ADDRESS,
        [
          'function registerCreator(string memory metadataURI) external returns (uint256)',
          'function getCreator(uint256 creatorId) external view returns (tuple(uint256 id, address wallet, string metadataURI, uint256 totalSubscribers, uint256 totalEarnings, bool isVerified, uint256 createdAt, uint256 updatedAt))',
          'function getCreatorIdByWallet(address wallet) external view returns (uint256)',
        ],
        signer
      );

      const subscriptionManager = new ethers.Contract(
        process.env.NEXT_PUBLIC_SUBSCRIPTION_MANAGER_ADDRESS,
        [
          'function subscribe(uint256 creatorId, uint256 tierId, uint256 months) external payable returns (uint256)',
          'function cancelSubscription(uint256 subscriptionId) external',
          'function getSubscription(uint256 subscriptionId) external view returns (tuple(uint256 id, uint256 creatorId, uint256 tierId, address subscriber, uint256 startTime, uint256 endTime, uint256 amountPaid, bool isActive, uint256 createdAt))',
        ],
        signer
      );

      const contentNFT = new ethers.Contract(
        process.env.NEXT_PUBLIC_CONTENT_NFT_ADDRESS,
        [
          'function createTier(uint256 creatorId, string memory name, string memory metadataURI, uint256 price) external returns (uint256)',
          'function mintContent(uint256 tierId, string memory contentURI) external returns (uint256)',
          'function hasAccess(uint256 tokenId, uint256 tierId) external view returns (bool)',
          'function getTokenTier(uint256 tokenId) external view returns (uint256)',
          'function getContentURI(uint256 tokenId) external view returns (string memory)',
        ],
        signer
      );

      setContracts({
        creatorRegistry,
        subscriptionManager,
        contentNFT
      });
    } catch (err) {
      setError('Failed to initialize contracts');
      console.error('Contract initialization error:', err);
    }
  };

  const connect = async () => {
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      await handleAccountsChanged(accounts);
    } catch (err) {
      setError('Failed to connect to wallet');
      console.error('Connection error:', err);
    }
  };

  return (
    <Web3Context.Provider value={{
      provider,
      signer,
      address,
      isConnected,
      contracts,
      error,
      connect
    }}>
      {children}
    </Web3Context.Provider>
  );
}

export default Web3Provider;