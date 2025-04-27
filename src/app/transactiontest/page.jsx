'use client';

import React, { useState, useEffect } from 'react';
import { ConnectWallet, Wallet, WalletDropdown, WalletDropdownDisconnect } from '@coinbase/onchainkit/wallet';
import { Address, Avatar, Name, Identity } from '@coinbase/onchainkit/identity';
import { NFTCard } from '@coinbase/onchainkit/nft';
import { NFTMedia, NFTTitle, NFTOwner, NFTLastSoldPrice, NFTNetwork } from '@coinbase/onchainkit/nft/view';
import { color } from '@coinbase/onchainkit/theme';
import { ethers } from 'ethers';

// Custom hook for NFT data
const useNFTData = () => {
  return {
    title: 'My Exclusive NFT',
    imageUrl: 'https://example.com/image.png', // Replace with your NFT image URL
    owner: '0x1234567890abcdef1234567890abcdef12345678',
    price: '0.1 ETH',
    network: 'Ethereum'
  };
};

const MyNFTCard = () => {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [showTransactionScreen, setShowTransactionScreen] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [provider, setProvider] = useState(null);

  const nftData = useNFTData();

  // Connect wallet function
  const connectWallet = async () => {
    try {
      const wallet = new CoinbaseWalletSDK({
        appName: 'NFTApp',
        appLogoUrl: '',  // Optional: specify a logo for your app here
        darkMode: false,
      });

      const provider = wallet.makeWeb3Provider('https://mainnet.infura.io/v3/YOUR_INFURA_KEY', 1);
      setProvider(provider);

      // Request account
      const accounts = await provider.request({ method: 'eth_requestAccounts' });
      setWalletAddress(accounts[0]);
      setIsWalletConnected(true);
    } catch (error) {
      console.error('Wallet connection error', error);
      alert('Failed to connect wallet. Please try again!');
    }
  };

  // Handle Buy NFT click
  const handleBuyClick = async () => {
    if (!isWalletConnected) {
      alert('Please connect your wallet first!');
      return;
    }

    setShowTransactionScreen(true);

    // Simulate transaction (you can replace this with real logic)
    try {
      const signer = provider.getSigner();
      const transaction = await signer.sendTransaction({
        to: '0xRecipientAddress',  // Replace with the actual NFT seller's address
        value: ethers.utils.parseEther('0.1'), // Replace with your NFT's price
      });

      console.log('Transaction Sent:', transaction);
      alert('Transaction Sent! Awaiting confirmation...');
    } catch (error) {
      console.error('Transaction error', error);
      alert('Transaction failed!');
    }
  };

  return (
    <div className="flex justify-end">
      {/* Coinbase Wallet Connection */}
      <Wallet>
        <ConnectWallet onConnect={connectWallet}>
          <Avatar className="h-6 w-6" />
          <Name />
        </ConnectWallet>

        <WalletDropdown>
          <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
            <Avatar />
            <Name />
            <Address className={color.foregroundMuted} />
          </Identity>
          <WalletDropdownDisconnect />
        </WalletDropdown>
      </Wallet>

      {/* NFT Card */}
      {isWalletConnected && (
        <div className="mt-4">
          <NFTCard contractAddress="0xb4703a3a73aec16e764cbd210b0fde9efdab8941" tokenId="1">
            <NFTMedia />
            <NFTTitle />
            <NFTOwner />
            <NFTLastSoldPrice />
            <NFTNetwork />
          </NFTCard>
          
          {/* Buy Button */}
          <button
            onClick={handleBuyClick}
            style={{ marginTop: '20px', padding: '10px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px' }}
          >
            Buy NFT for {nftData.price}
          </button>
        </div>
      )}

      {/* Display Transaction Screen */}
      {showTransactionScreen && (
        <div style={{ marginTop: '20px', padding: '20px', border: '1px solid #ccc' }}>
          <h3>Transaction Screen</h3>
          <p>Proceeding with the purchase of the NFT...</p>
          <p>Please confirm the transaction in your wallet.</p>
        </div>
      )}
    </div>
  );
};

export default MyNFTCard;
