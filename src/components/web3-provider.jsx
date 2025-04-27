'use client';
import { createContext, useState, useEffect, useContext } from 'react';
import { ethers } from 'ethers';
import { 
  getCreatorRegistryContract, 
  getSubscriptionManagerContract, 
  getContentNFTContract 
} from '../utils/web3';

export const Web3Context = createContext();

export function Web3Provider({ children }) {
  const [state, setState] = useState({
    isConnected: false,
    address: '',
    contracts: {
      creatorRegistry: null,
      subscriptionManager: null,
      contentNFT: null
    },
    isLoading: true,
    error: null
  });

  const initializeContracts = async (signer) => {
    try {
      return {
        creatorRegistry: getCreatorRegistryContract(signer),
        subscriptionManager: getSubscriptionManagerContract(signer),
        contentNFT: getContentNFTContract(signer)
      };
    } catch (error) {
      console.error('Error initializing contracts:', error);
      throw error;
    }
  };

  const connectWallet = async () => {
    if (typeof window.ethereum === 'undefined') {
      setState(prev => ({ ...prev, error: 'MetaMask is not installed' }));
      return;
    }

    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const userAddress = await signer.getAddress();
      const contracts = await initializeContracts(signer);

      setState({
        isConnected: true,
        address: userAddress,
        contracts,
        isLoading: false,
        error: null
      });
    } catch (error) {
      console.error('Error connecting wallet:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Failed to connect wallet'
      }));
    }
  };

  useEffect(() => {
    if (typeof window.ethereum === 'undefined') {
      setState(prev => ({ ...prev, isLoading: false }));
      return;
    }

    const initWeb3 = async () => {
      try {
        setState(prev => ({ ...prev, isLoading: true }));
        
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });

        if (accounts.length > 0) {
          const signer = await provider.getSigner();
          const userAddress = accounts[0];
          const contracts = await initializeContracts(signer);

          setState({
            isConnected: true,
            address: userAddress,
            contracts,
            isLoading: false,
            error: null
          });
        } else {
          setState(prev => ({ ...prev, isLoading: false }));
        }

        // Event listeners
        const handleAccountsChanged = async (accounts) => {
          if (accounts.length === 0) {
            setState({
              isConnected: false,
              address: '',
              contracts: {
                creatorRegistry: null,
                subscriptionManager: null,
                contentNFT: null
              },
              isLoading: false,
              error: null
            });
          } else {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const contracts = await initializeContracts(signer);
            
            setState(prev => ({
              ...prev,
              isConnected: true,
              address: accounts[0],
              contracts,
              error: null
            }));
          }
        };

        const handleChainChanged = () => window.location.reload();

        window.ethereum.on('accountsChanged', handleAccountsChanged);
        window.ethereum.on('chainChanged', handleChainChanged);

        return () => {
          window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
          window.ethereum.removeListener('chainChanged', handleChainChanged);
        };
      } catch (error) {
        console.error('Error initializing Web3:', error);
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: error.message || 'Failed to initialize Web3'
        }));
      }
    };

    initWeb3();
  }, []);

  return (
    <Web3Context.Provider value={{ ...state, connectWallet }}>
      {children}
    </Web3Context.Provider>
  );
}

// Custom hook for consuming context
export function useWeb3() {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
}