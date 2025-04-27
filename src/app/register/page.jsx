'use client';

import {
  Transaction,
  TransactionButton,
  TransactionSponsor,
  TransactionStatus,
  TransactionStatusLabel,
  TransactionStatusAction,
} from '@coinbase/onchainkit/transaction';
import { Wallet, ConnectWallet } from '@coinbase/onchainkit/wallet';
import { Avatar, Name } from '@coinbase/onchainkit/identity';
import { useAccount } from 'wagmi';
import { useState, useMemo, useCallback } from 'react';
import { toast } from 'sonner';

const CREATOR_REGISTRY_ADDRESS = '0x2224047942Ab260A5FF3908f1eCB9D9122B474dF';
const BASE_SEPOLIA_CHAIN_ID = 84532;

const CREATOR_REGISTRY_ABI = [
  {
    type: 'function',
    name: 'registerCreator',
    inputs: [
      { name: 'metadataURI', type: 'string' },
      { name: 'walletAddress', type: 'address' }
    ],
    outputs: [{ type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
];

export default function Register() {
  const { address } = useAccount();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [metadataURI, setMetadataURI] = useState('');
  const [ready, setReady] = useState(false);

  const calls = useMemo(() => {
    if (!metadataURI || !address) return [];
    return [
      {
        address: CREATOR_REGISTRY_ADDRESS,
        abi: CREATOR_REGISTRY_ABI,
        functionName: 'registerCreator',
        args: [metadataURI, address],
      },
    ];
  }, [metadataURI, address]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const mockURI = `ipfs://mock-uri-${Date.now()}`;
    setMetadataURI(mockURI);
    setReady(true);
    toast.success('Registration prepared!');
  };

  const handleOnStatus = useCallback((status) => {
    console.log('Transaction Status:', status);
    if (status.statusName === 'success') {
      toast.success('Creator registered successfully!');
    } else if (status.statusName === 'error') {
      toast.error('Registration failed');
    }
  }, []);

  return (
    <div className="mx-auto max-w-md space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Register as a Creator</h1>
        <p className="text-muted-foreground">
          Start monetizing your content with Web3 subscriptions
        </p>
      </div>

      {!address ? (
        <Wallet>
          <ConnectWallet>
            <Avatar className="h-6 w-6" />
            <Name />
          </ConnectWallet>
        </Wallet>
      ) : (
        <>
          <div className="flex items-center gap-3 p-4 border rounded-lg">
            <Avatar address={address} className="h-10 w-10" />
            <div>
              <Name address={address} className="font-medium" />
              <span className="text-sm text-muted-foreground block">
                {address.substring(0, 6)}...{address.substring(38)}
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Display Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border bg-background px-3 py-2"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded-lg border bg-background px-3 py-2"
                rows={4}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-primary px-4 py-2 text-white hover:bg-primary/90"
            >
              Prepare Registration
            </button>
          </form>

          {ready && metadataURI && (
            <Transaction
              chainId={BASE_SEPOLIA_CHAIN_ID}
              calls={calls}
              onStatus={handleOnStatus}
            >
              <TransactionButton className="w-full rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700 mt-4">
                Confirm Registration
              </TransactionButton>
              <TransactionStatus>
                <TransactionStatusLabel />
              </TransactionStatus>
            </Transaction>
          )}
        </>
      )}
    </div>
  );
}