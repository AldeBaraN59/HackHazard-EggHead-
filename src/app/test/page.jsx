'use client';

import { useEffect, useState } from 'react';
import { Identity, Avatar, Name, Badge, Address } from '@coinbase/onchainkit/identity';

export default function HomePage() {
  const [walletAddress, setWalletAddress] = useState(null);

  useEffect(() => {
    // Check if MetaMask is installed
    if (window.ethereum) {
      // Fetch the user's wallet address
      window.ethereum.request({ method: 'eth_accounts' })
        .then((accounts) => {
          if (accounts.length > 0) {
            setWalletAddress(accounts[0]);
          }
        })
        .catch((error) => {
          console.error("Error fetching wallet address:", error);
        });
    }
  }, []);

  if (!walletAddress) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <h1>Coinbase Identity Example</h1>

      <Identity
        address={walletAddress}  // Pass dynamically fetched wallet address
        schemaId="0xf8b05c79f090979bf4a80270aba232dff11a10d9ca55c4f88de95317970f0de9"
      >
        <Avatar />
        <Name>
          {/* Here, we just use the wallet address for the name */}
          <Badge />
        </Name>
        <Address />
      </Identity>
    </div>
  );
}
