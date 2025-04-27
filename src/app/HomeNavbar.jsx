'use client';
import React, { useEffect, useState } from 'react';
import { Wallet, ConnectWallet } from '@coinbase/onchainkit/wallet';

const HomeNavbar = ({ onWalletConnect }) => {
  const [isWalletConnected, setIsWalletConnected] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.ethereum) {
      window.ethereum.request({ method: 'eth_accounts' })
        .then(accounts => {
          if (accounts.length > 0) {
            setIsWalletConnected(true);
            if (onWalletConnect) onWalletConnect(true);
          }
        })
        .catch(console.error);
    }
  }, []);

  const handleConnect = (wallet) => {
    if (wallet && wallet.connected) {
      setIsWalletConnected(true);
      if (onWalletConnect) onWalletConnect(true);
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-[70vw] mx-auto bg-slate-400 backdrop-filter backdrop-blur-lg bg-opacity-30 rounded-lg">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <img
            src="/Yellow_Black_Brush_Streetwear_Brand_Logo_20250424_123341_0000-removebg-preview.png"
            width="200px"
            alt="FundTron Logo"
          />
          <Wallet onConnect={handleConnect}>
            <ConnectWallet
              className="rounded-lg bg-white px-6 py-2 text-sm font-medium text-black shadow-md hover:bg-gray-100 transition-colors"
              type="button"
            >
              {isWalletConnected ? 'Wallet Connected' : 'Connect Wallet'}
            </ConnectWallet>
          </Wallet>
        </div>
      </div>
    </nav>
  );
};

export default HomeNavbar;