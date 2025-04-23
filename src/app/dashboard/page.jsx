'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useWeb3 } from '../../components/Web3Provider';
import { 
  getSubscriptionManagerContract, 
  getCreatorRegistryContract,
  getContentNFTContract,
  formatEther 
} from '../../../utils/web3';

export default function DashboardPage() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [creatorId, setCreatorId] = useState(null);
  const [tiers, setTiers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { account, provider, signer, isConnected } = useWeb3();

  // Enum mapping
  const statusMapping = ["Active", "Expired", "Cancelled"];
  const paymentTypeMapping = ["Native (ETH)", "ERC20 Token"];

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!isConnected || !provider || !account) return;
      
      try {
        // Check if user is a creator
        const creatorRegistry = getCreatorRegistryContract(provider);
        const creatorIdBN = await creatorRegistry.getCreatorIdByWallet(account);
        const userCreatorId = creatorIdBN.toString();
        
        if (userCreatorId !== "0") {
          setCreatorId(userCreatorId);
          
          // Fetch creator's tiers
          const contentNFT = getContentNFTContract(provider);
          
          // Similar to creator profile, this is a simplified approach
          const tierList = [];
          for (let i = 1; i <= 10; i++) {
            try {
              const tier = await contentNFT.getTier(i);
              if (tier.creatorId.toString() === userCreatorId) {
                tierList.push({
                  id: tier.id.toString(),
                  name: tier.name,
                  metadataURI: tier.metadataURI,
                  price: tier.price,
                  createdAt: tier.createdAt.toString()
                });
              }
            } catch (err) {
              // Tier doesn't exist, stop checking
              break;
            }
          }
          
          setTiers(tierList);
        }
        
        // Fetch user's active subscriptions
        // Note: For a full app, you'd need a better way to fetch all user subscriptions
        // This is a simplified approach just for demonstration
        const subscriptionManager = getSubscriptionManagerContract(provider);
        
        const userSubscriptions = [];
        let subId = 1;
        
        // Try fetching the first 20 subscriptions to see if any belong to the user
        // In a production app, you'd use events or a better indexing mechanism
        while (subId <= 20) {
          try {
            const sub = await subscriptionManager.getSubscription(subId);
            if (sub.subscriber.toLowerCase() === account.toLowerCase()) {
              // Get creator info
              const creator = await creatorRegistry.getCreator(sub.creatorId);
              
              // Get tier info
              const contentNFT = getContentNFTContract(provider);
              const tier = await contentNFT.getTier(sub.tierId);
              
              userSubscriptions.push({
                id: sub.id.toString(),
                creatorId: sub.creatorId.toString(),
                creatorName: `Creator ${sub.creatorId}`, // In a real app, fetch from metadata
                tierId: sub.tierId.toString(),
                tierName: tier.name,
                amount: sub.amount.toString(),
                startTime: new Date(sub.startTime.toNumber() * 1000).toLocaleDateString(),
                endTime: new Date(sub.endTime.toNumber() * 1000).toLocaleDateString(),
                status: statusMapping[sub.status],
                paymentType: paymentTypeMapping[sub.paymentType],
                tokenAddress: sub.tokenAddress
              });
            }
            subId++;
          } catch (err) {
            break;
          }
        }
        
        setSubscriptions(userSubscriptions);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [account, provider, isConnected]);

  const handleCancelSubscription = async (subscriptionId) => {
    if (!isConnected || !signer) return;
    
    try {
      const subscriptionManager = getSubscriptionManagerContract(signer);
      const tx = await subscriptionManager.cancelSubscription(subscriptionId);
      await tx.wait();
      
      // Update UI
      setSubscriptions(prev => 
        prev.map(sub => 
          sub.id === subscriptionId ? { ...sub, status: "Cancelled" } : sub
        )
      );
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      alert('Failed to cancel subscription');
    }
  };

  const handleCreateTier = async (e) => {
    e.preventDefault();
    if (!isConnected || !signer) return;
    
    const name = e.target.tierName.value;
    const price = e.target.tierPrice.value;
    
    if (!name || !price) {
      alert('Please fill all fields');
      return;
    }
    
    try {
      // Create metadata (in a real app, you'd upload to IPFS)
      const metadata = {
        description: "Subscription tier for exclusive content",
        perks: ["Access to exclusive content", "Members-only community"]
      };
      
      // Simulate IPFS upload
      const metadataURI = `ipfs://QmTierMetadata${Math.floor(Math.random() * 1000000)}`;
      
      // Create tier on-chain
      const contentNFT = getContentNFTContract(signer);
      const tx = await contentNFT.createTier(
        name,
        metadataURI,
        ethers.utils.parseEther(price)
      );
      await tx.wait();
      
      // Refresh tiers
      const newTier = {
        id: (tiers.length + 1).toString(),
        name,
        metadataURI,
        price: ethers.utils.parseEther(price),
        createdAt: Math.floor(Date.now() / 1000).toString()
      };
      
      setTiers(prev => [...prev, newTier]);
      
      // Reset form
      e.target.reset();
    } catch (error) {
      console.error('Error creating tier:', error);
      alert('Failed to create tier');
    }
  };

  if (!isConnected) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        <p className="mb-6">Please connect your wallet to view your dashboard.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        <p>Loading your dashboard data...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Your Dashboard</h1>
      
      {/* Active Subscriptions */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Your Subscriptions</h2>
        
        {subscriptions.length > 0 ? (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Creator
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tier
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    End Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {subscriptions.map(sub => (
                  <tr key={sub.id}>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <Link href={`/creator/${sub.creatorId}`} className="text-blue-600 hover:underline">
                        {sub.creatorName}
                      </Link>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      {sub.tierName}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      {sub.endTime}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                        sub.status === 'Active' ? 'bg-green-100 text-green-800' :
                        sub.status === 'Expired' ? 'bg-red-100 text-red-800' : 
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {sub.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      {sub.status === 'Active' && (
                        <button
                          onClick={() => handleCancelSubscription(sub.id)}
                          className="text-red-600 hover:text-red-900 text-sm"
                        >
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <p className="mb-4">You haven't subscribed to any creators yet.</p>
            <Link 
              href="/creator" 
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
            >
              Explore Creators
            </Link>
          </div>
        )}
      </div>
      
      {/* Creator Section (if user is a creator) */}
      {creatorId ? (
        <div>
          <h2 className="text-2xl font-bold mb-6">Creator Dashboard</h2>
          
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h3 className="text-xl font-bold mb-4">Your Creator ID: {creatorId}</h3>
            <p className="mb-4">
              You are registered as a creator. You can create subscription tiers for your fans.
            </p>
            <Link 
              href={`/creator/${creatorId}`}
              className="text-blue-600 hover:underline"
            >
              View your creator profile
            </Link>
          </div>
          
          {/* Creator's Subscription Tiers */}
          <div className="mb-8">
            <h3 className="text-xl font-bold mb-4">Your Subscription Tiers</h3>
            
            {tiers.length > 0 ? (
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <table className="min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price (ETH)
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Created At
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {tiers.map(tier => (
                      <tr key={tier.id}>
                        <td className="px-4 py-4 whitespace-nowrap">
                          {tier.name}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          {formatEther(tier.price)}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          {new Date(parseInt(tier.createdAt) * 1000).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="mb-4">You haven't created any subscription tiers yet.</p>
            )}
          </div>
          
          {/* Create New Tier Form */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-4">Create New Subscription Tier</h3>
            
            <form onSubmit={handleCreateTier}>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">
                  Tier Name
                </label>
                <input
                  type="text"
                  name="tierName"
                  required
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. Bronze, Silver, Gold"
                />
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2">
                  Price (ETH per month)
                </label>
                <input
                  type="number"
                  name="tierPrice"
                  required
                  step="0.01"
                  min="0.01"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0.1"
                />
              </div>
              
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium"
              >
                Create Tier
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h2 className="text-xl font-bold mb-4">Want to become a creator?</h2>
          <p className="mb-6">
            Register as a creator to start earning subscriptions from your fans.
          </p>
          <Link 
            href="/creator/register" 
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium"
          >
            Become a Creator
          </Link>
        </div>
      )}
    </div>
  );
}