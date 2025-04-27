// src/hooks/useWeb3.js

import { useContext } from 'react';
import { Web3Context } from '../components/web3-provider'; // Ensure correct path

export const useWeb3 = () => {
  const context = useContext(Web3Context); // Access the Web3Context
  if (!context) {
    throw new Error("useWeb3 must be used within a Web3Provider");
  }
  return context; // Return context (i.e., Web3 state and functions)
};
