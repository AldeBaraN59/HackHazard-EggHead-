'use client'
import { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { getEthereumProvider } from '../../utils/web3';
import { SUPPORTED_CHAINS } from '../../utils/constants';

const Web3Context = createContext();

export function useWeb3() {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
}

export default function Web3Provider({ children }) {
  const [account, setAccount] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [provider, setProvider] = useState(() => {
    // Initialize with a fallback provider if available
    if (typeof window !== 'undefined') {
      return getEthereumProvider() || new ethers.JsonRpcProvider(); // Changed from JsonRpcProvider
    }
    return null;
  });
  const [signer, setSigner] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const initializeProvider = async () => {
      try {
        const ethereumProvider = getEthereumProvider();
        if (ethereumProvider) {
          setProvider(ethereumProvider);
          
          // Check if already connected
          const accounts = await ethereumProvider.send("eth_accounts", []);
          if (accounts.length > 0) {
            setAccount(accounts[0]);
            setSigner(await ethereumProvider.getSigner());
            setIsConnected(true);
          }
          
          // Get chain ID
          const network = await ethereumProvider.getNetwork();
          setChainId(Number(network.chainId)); // Ensure chainId is a number
          
          // Setup event listeners
          window.ethereum.on('accountsChanged', async (accounts) => {
            if (accounts.length > 0) {
              setAccount(accounts[0]);
              setSigner(await ethereumProvider.getSigner());
              setIsConnected(true);
            } else {
              setAccount(null);
              setSigner(null);
              setIsConnected(false);
            }
          });
          
          window.ethereum.on('chainChanged', () => {
            window.location.reload();
          });
        }
      } catch (err) {
        console.error("Error initializing provider:", err);
      }
    };

    initializeProvider();

    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners('accountsChanged');
        window.ethereum.removeAllListeners('chainChanged');
      }
    };
  }, []);

  const connectWallet = async () => {
    if (!provider) {
      setError("MetaMask is not installed!");
      return;
    }
    
    try {
      setIsConnecting(true);
      setError(null);
      
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });
      
      if (accounts.length > 0) {
        setAccount(accounts[0]);
        setSigner(await provider.getSigner());
        setIsConnected(true);
        
        // Check if on supported chain
        const network = await provider.getNetwork();
        setChainId(Number(network.chainId));
        
        if (!SUPPORTED_CHAINS.includes(Number(network.chainId))) {
          setError("Please connect to a supported network");
        }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setSigner(null);
    setIsConnected(false);
  };

  const value = {
    account,
    chainId,
    provider,
    signer,
    isConnecting,
    isConnected,
    error,
    connectWallet,
    disconnectWallet
  };

  return (
    <Web3Context.Provider value={value}>
      {children}
    </Web3Context.Provider>
  );
}