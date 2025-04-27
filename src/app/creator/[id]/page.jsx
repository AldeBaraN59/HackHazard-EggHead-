'use client';

import { useState, useEffect } from 'react';
import { useWeb3 } from '../../../components/Web3Provider';
import { 
  getCreatorRegistryContract,
  getContentNFTContract,
  shortenAddress 
} from '../../../utils/web3';
import SubscriptionTier from '../../../components/SubscriptionTier';

export default function CreatorProfilePage({ params }) {
  const creatorId = params.id;
  const [creator, setCreator] = useState(null);
  const [tiers, setTiers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { provider } = useWeb3();

  useEffect(() => {
    const fetchCreatorData = async () => {
      if (!provider) return;
      
      try {
        // Fetch creator info
        const creatorRegistry = getCreatorRegistryContract(provider);
        const creatorData = await creatorRegistry.getCreator(creatorId);
        
        setCreator({
          id: creatorData.id.toString(),
          wallet: creatorData.wallet,
          metadataURI: creatorData.metadataURI,
          totalSubscribers: creatorData.totalSubscribers.toString(),
          totalEarnings: creatorData.totalEarnings.toString(),
          isVerified: creatorData.isVerified,
          createdAt: creatorData.createdAt.toString(),
          updatedAt: creatorData.updatedAt.toString()
        });
        
        // In a real app, you would fetch creator metadata from IPFS here
        
        // Fetch subscription tiers
        // Note: This is a simplified approach. In a real app, you'd need a way to query
        // all tiers for a creator, which might require an additional mapping or event filtering
        const contentNFT = getContentNFTContract(provider);
        
        // For this example, we'll just check the first 10 tier IDs to see if they belong to this creator
        // In a production app, you'd have a better indexing mechanism
        const tierList = [];
        for (let i = 1; i <= 10; i++) {
          try {
            const tier = await contentNFT.getTier(i);
            if (tier.creatorId.toString() === creatorId) {
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
      } catch (error) {
        console.error('Error fetching creator data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCreatorData();
  }, [creatorId, provider]);

  // In a real app, you would fetch and parse the metadata from IPFS
  const metadata = creator ? {
    name: `Creator ${creator.id}`,
    description: 'This is a placeholder description. In a real app, this would be fetched from IPFS.',
    image: '/vercel.svg',
  } : null;

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        Loading creator profile...
      </div>
    );
  }

  if (!creator) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        Creator not found
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Creator Profile Header */}
        <div className="bg-white p-8 rounded-lg shadow-md mb-8">
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
            <div className="w-32 h-32 bg-gray-200 rounded-full flex-shrink-0">
              {/* In a real app, this would be the creator's profile image */}
            </div>
            
            <div className="flex-grow text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                <h1 className="text-3xl font-bold">{metadata.name}</h1>
                {creator.isVerified && (
                  <span className="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                    Verified Creator
                  </span>
                )}
              </div>
              
              <p className="text-gray-500 mb-4">{shortenAddress(creator.wallet)}</p>
              
              <p className="text-gray-700 mb-6">{metadata.description}</p>
              
              <div className="flex flex-col md:flex-row gap-6">
                <div>
                  <p className="text-gray-500 text-sm">Total Subscribers</p>
                  <p className="text-xl font-bold">{creator.totalSubscribers}</p>
                </div>
                
                <div>
                  <p className="text-gray-500 text-sm">Since</p>
                  <p className="text-xl font-bold">
                    {new Date(parseInt(creator.createdAt) * 1000).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Subscription Tiers */}
        <h2 className="text-2xl font-bold mb-6">Subscription Tiers</h2>
        
        {tiers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tiers.map(tier => (
              <SubscriptionTier 
                key={tier.id} 
                tier={tier} 
                creatorId={creatorId} 
              />
            ))}
          </div>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            This creator hasn't set up any subscription tiers yet.
          </div>
        )}
      </div>
    </div>
  );
}