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
        if (!isConnected || !contracts?.subscriptionManager || !contracts?.creatorRegistry) {
          setLoading(false);
          return;
        }

        // 1. First verify the contract has the method
        if (!contracts.subscriptionManager.getSubscriptionsBySubscriber) {
          throw new Error('Contract method not found');
        }

        // 2. Add try-catch for the subscriptions call
        let subscriptionIds = [];
        try {
          subscriptionIds = await contracts.subscriptionManager.getSubscriptionsBySubscriber(address);
          console.log('Subscription IDs:', subscriptionIds);
          
          // Handle case where method returns 0x (empty response)
          if (!subscriptionIds || subscriptionIds.length === 0) {
            console.log('No subscriptions found');
            setSubscriptions([]);
          }
        } catch (err) {
          console.error('Error fetching subscriptions:', err);
          setSubscriptions([]);
        }

        // Process subscriptions if they exist
        const subscriptionsList = [];
        for (const id of subscriptionIds) {
          try {
            const subscription = await contracts.subscriptionManager.getSubscription(id);
            const creator = await contracts.creatorRegistry.getCreator(subscription.creatorId);
            const metadata = await fetch(creator.metadataURI).then(res => res.json());
            
            subscriptionsList.push({
              id: id,
              creatorId: subscription.creatorId,
              creatorName: metadata.name,
              tierId: subscription.tierId,
              startTime: new Date(subscription.startTime * 1000).toLocaleDateString(),
              endTime: new Date(subscription.endTime * 1000).toLocaleDateString(),
              amountPaid: ethers.formatEther(subscription.amountPaid),
              isActive: subscription.isActive
            });
          } catch (err) {
            console.error(`Error processing subscription ${id}:`, err);
          }
        }

        setSubscriptions(subscriptionsList);

        // Check if user is a creator
        try {
          const creatorId = await contracts.creatorRegistry.getCreatorIdByWallet(address);
          if (creatorId !== null) {
            const creator = await contracts.creatorRegistry.getCreator(creatorId);
            const metadata = await fetch(creator.metadataURI).then(res => res.json());
            
            setCreatorData({
              id: creatorId,
              name: metadata.name,
              subscribers: Number(creator.totalSubscribers),
              earnings: ethers.formatEther(creator.totalEarnings),
              isVerified: creator.isVerified
            });
          }
        } catch (err) {
          console.log('User is not a creator or error fetching creator data:', err);
        }
      } catch (err) {
        setError('Failed to fetch dashboard data');
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
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
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-xl text-red-500">{error}</div>
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
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold">{creatorData.name}</h3>
                <p className="text-muted-foreground">
                  {creatorData.subscribers.toLocaleString()} subscribers
                </p>
                <p className="text-muted-foreground">
                  {creatorData.earnings} ETH earned
                </p>
              </div>
              <Link
                href={`/creators/${creatorData.id}`}
                className="text-primary hover:underline"
              >
                View Profile
              </Link>
            </div>
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
                <h3 className="text-xl font-semibold mb-2">{subscription.creatorName}</h3>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Started: {subscription.startTime}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Ends: {subscription.endTime}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Amount Paid: {subscription.amountPaid} ETH
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Status: {subscription.isActive ? 'Active' : 'Expired'}
                  </p>
                </div>
                <Link
                  href={`/creators/${subscription.creatorId}`}
                  className="mt-4 block text-primary hover:underline"
                >
                  View Creator
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}