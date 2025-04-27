'use client';

import { useEffect, useState } from 'react';
import { useWeb3 } from '../../hooks/useWeb3';
import { ethers } from 'ethers';
import Link from 'next/link';

export default function DashboardPage() {
  const { contracts, isConnected, address } = useWeb3();
  const [subscriptions, setSubscriptions] = useState([]);
  const [creatorData, setCreatorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setLoading(true);
        setError(null);

        if (!isConnected || !contracts.subscriptionManager || !contracts.creatorRegistry) {
          throw new Error("Web3 not properly initialized");
        }

        // Enhanced contract call with error handling
        const fetchWithRetry = async (call, retries = 3) => {
          try {
            return await call();
          } catch (err) {
            if (retries > 0) {
              await new Promise(resolve => setTimeout(resolve, 1000));
              return fetchWithRetry(call, retries - 1);
            }
            throw err;
          }
        };

        // 1. Fetch subscriptions with proper error handling
        const subscriptionIds = await fetchWithRetry(() => 
          contracts.subscriptionManager.getSubscriptionsBySubscriber(address)
        ).catch(() => []);

        const subscriptionsList = await Promise.all(
          subscriptionIds.map(async (id) => {
            try {
              const subscription = await fetchWithRetry(() => 
                contracts.subscriptionManager.getSubscription(id)
              );
              
              const creator = await fetchWithRetry(() => 
                contracts.creatorRegistry.getCreator(subscription.creatorId)
              );

              // Handle IPFS metadata with fallback
              let metadata;
              try {
                const metadataURI = creator.metadataURI.includes('ipfs://') 
                  ? creator.metadataURI.replace('ipfs://', 'https://ipfs.io/ipfs/')
                  : creator.metadataURI;
                
                const response = await fetch(metadataURI);
                metadata = await response.json();
              } catch (metadataError) {
                console.warn('Failed to fetch metadata:', metadataError);
                metadata = {
                  name: `Creator ${subscription.creatorId}`,
                  imageUrl: '/default-avatar.png'
                };
              }

              return {
                id: id,
                creatorId: subscription.creatorId,
                creatorName: metadata.name,
                creatorImage: metadata.imageUrl,
                tierId: subscription.tierId,
                startTime: new Date(subscription.startTime * 1000).toLocaleDateString(),
                endTime: new Date(subscription.endTime * 1000).toLocaleDateString(),
                amountPaid: ethers.formatEther(subscription.amount),
                isActive: subscription.status === 0 && // Assuming status 0 is Active
                          Math.floor(Date.now() / 1000) < subscription.endTime
              };
            } catch (err) {
              console.error(`Error processing subscription ${id}:`, err);
              return null;
            }
          })
        );

        setSubscriptions(subscriptionsList.filter(Boolean));

        // 2. Check creator status with proper error handling
        try {
          const creatorId = await fetchWithRetry(() => 
            contracts.creatorRegistry.getCreatorIdByWallet(address)
          );

          if (creatorId && creatorId.toString() !== '0') {
            const creator = await fetchWithRetry(() => 
              contracts.creatorRegistry.getCreator(creatorId)
            );

            let metadata;
            try {
              const metadataURI = creator.metadataURI.includes('ipfs://') 
                ? creator.metadataURI.replace('ipfs://', 'https://ipfs.io/ipfs/')
                : creator.metadataURI;
              
              const response = await fetch(metadataURI);
              metadata = await response.json();
            } catch (metadataError) {
              console.warn('Failed to fetch creator metadata:', metadataError);
              metadata = {
                name: `Creator ${creatorId}`,
                imageUrl: '/default-avatar.png'
              };
            }

            setCreatorData({
              id: creatorId,
              name: metadata.name,
              imageUrl: metadata.imageUrl,
              subscribers: Number(creator.totalSubscribers),
              earnings: ethers.formatEther(creator.totalEarnings),
              isVerified: creator.isVerified
            });
          }
        } catch (err) {
          console.log('User is not a creator or error checking creator status:', err);
        }

      } catch (err) {
        console.error('Dashboard data fetch error:', err);
        setError(err.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    }

    if (address) {
      fetchDashboardData();
    }
  }, [contracts, isConnected, address]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-xl">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <div className="text-xl text-red-500">{error}</div>
        <button 
          onClick={() => window.location.reload()}
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      {creatorData && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Creator Profile</h2>
          <div className="rounded-lg border bg-card p-6">
            <div className="flex items-center gap-4">
              <img 
                src={creatorData.imageUrl} 
                alt={creatorData.name}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div>
                <h3 className="text-xl font-semibold">{creatorData.name}</h3>
                <p className="text-muted-foreground">
                  {creatorData.subscribers.toLocaleString()} subscribers
                </p>
                <p className="text-muted-foreground">
                  {creatorData.earnings} ETH earned
                </p>
                {creatorData.isVerified && (
                  <span className="inline-block mt-1 px-2 py-1 text-xs bg-green-100 text-green-800 rounded">
                    Verified
                  </span>
                )}
              </div>
            </div>
            <Link
              href={`/creators/${creatorData.id}`}
              className="mt-4 inline-block text-primary hover:underline"
            >
              View Profile
            </Link>
          </div>
        </div>
      )}

      <div>
        <h2 className="text-2xl font-semibold mb-4">Your Subscriptions</h2>
        {subscriptions.length === 0 ? (
          <p className="text-muted-foreground">You don't have any active subscriptions.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {subscriptions.map(subscription => (
              <div key={subscription.id} className="rounded-lg border bg-card p-6">
                <div className="flex items-center gap-3 mb-3">
                  <img 
                    src={subscription.creatorImage} 
                    alt={subscription.creatorName}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <h3 className="text-lg font-semibold">{subscription.creatorName}</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <p className="text-muted-foreground">
                    <span className="font-medium">Started:</span> {subscription.startTime}
                  </p>
                  <p className="text-muted-foreground">
                    <span className="font-medium">Ends:</span> {subscription.endTime}
                  </p>
                  <p className="text-muted-foreground">
                    <span className="font-medium">Amount:</span> {subscription.amountPaid} ETH
                  </p>
                  <p className="flex items-center">
                    <span className="font-medium">Status:</span> 
                    <span className={`ml-2 px-2 py-1 text-xs rounded ${
                      subscription.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {subscription.isActive ? 'Active' : 'Expired'}
                    </span>
                  </p>
                </div>
                <Link
                  href={`/creators/${subscription.creatorId}`}
                  className="mt-4 inline-block text-sm text-primary hover:underline"
                >
                  View Creator Page →
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}