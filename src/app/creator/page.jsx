'use client';

import { useState, useEffect } from 'react';
import { useWeb3 } from '../../hooks/useWeb3';
import { getCreatorRegistryContract } from '../../../utils/web3';
import CreatorCard from '../../components/CreatorCard';

export default function CreatorsPage() {
  const [creators, setCreators] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { provider } = useWeb3();

  useEffect(() => {
    const fetchCreators = async () => {
      if (!provider) return;
      
      try {
        const creatorRegistry = getCreatorRegistryContract(provider);
        const totalCreators = await creatorRegistry.getTotalCreators();
        
        const creatorList = [];
        for (let i = 1; i <= totalCreators; i++) {
          const creator = await creatorRegistry.getCreator(i);
          creatorList.push({
            id: creator.id.toString(),
            wallet: creator.wallet,
            metadataURI: creator.metadataURI,
            totalSubscribers: creator.totalSubscribers.toString(),
            totalEarnings: creator.totalEarnings.toString(),
            isVerified: creator.isVerified,
            createdAt: creator.createdAt.toString(),
            updatedAt: creator.updatedAt.toString()
          });
        }
        
        setCreators(creatorList);
      } catch (error) {
        console.error('Error fetching creators:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCreators();
  }, [provider]);

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">Explore Creators</h1>
      
      {isLoading ? (
        <div className="text-center py-8">Loading creators...</div>
      ) : creators.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {creators.map(creator => (
            <CreatorCard key={creator.id} creator={creator} />
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          No creators found. Be the first to register!
        </div>
      )}
    </div>
  );
}