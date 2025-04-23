import { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { getEthereumProvider } from '../utils/web3';
import { SUPPORTED_CHAINS } from '../utils/constants';

const Web3Context = createContext();

export function useWeb3() {
  return useContext(Web3Context);
}

export default function Web3Provider({ children }) {
  const [account, setAccount] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const ethereumProvider = getEthereumProvider();
      if (ethereumProvider) {
        setProvider(ethereumProvider);
        
        // Check if already connected
        ethereumProvider.listAccounts().then(accounts => {
          if (accounts.length > 0) {
            setAccount(accounts[0]);
            setSigner(ethereumProvider.getSigner());
            setIsConnected(true);
          }
        });
        
        // Get chain ID
        ethereumProvider.getNetwork().then(network => {
          setChainId(network.chainId);
        });
        
        // Setup event listeners
        window.ethereum.on('accountsChanged', (accounts) => {
          if (accounts.length > 0) {
            setAccount(accounts[0]);
            setSigner(ethereumProvider.getSigner());
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
    }
    
    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners();
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
        setSigner(provider.getSigner());
        setIsConnected(true);
        
        // Check if on supported chain
        const network = await provider.getNetwork();
        setChainId(network.chainId);
        
        if (!SUPPORTED_CHAINS.includes(network.chainId)) {
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