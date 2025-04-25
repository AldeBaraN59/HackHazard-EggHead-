'use client';
import { useState, useEffect } from 'react';
import { useWeb3 } from '../../components/Web3Provider';
import { getCreatorRegistryContract } from '../../../utils/web3';
import CreatorCard from '../../components/CreatorCard';
import { ethers } from 'ethers'; // Import ethers for address validation
import { useRouter } from 'next/navigation';;


export default function CreatorsPage() {
  const [creators, setCreators] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { provider, isConnected } = useWeb3();
  const router = useRouter(); 

  useEffect(() => {
    const fetchCreators = async () => {
      if (!provider || !isConnected) {
        setIsLoading(false);
        return;
      }
      
      try {
        const creatorRegistry = getCreatorRegistryContract(provider);
        const totalCreators = await creatorRegistry.getTotalCreators();
        
        const creatorList = [];
        for (let i = 1; i <= totalCreators; i++) {
          const creator = await creatorRegistry.getCreator(i);
        
          // Check if creator is undefined or missing expected fields
          if (!creator || !creator.wallet || !ethers.isAddress(creator.wallet)) {
            console.warn(`Skipping invalid creator at index ${i}:`, creator);
            continue;
          }
        
          creatorList.push({
            id: creator.id?.toString() ?? i.toString(), // fallback
            wallet: creator.wallet,
            metadataURI: creator.metadataURI,
            totalSubscribers: creator.totalSubscribers?.toString() ?? '0',
            totalEarnings: creator.totalEarnings?.toString() ?? '0',
            isVerified: creator.isVerified ?? false,
            createdAt: creator.createdAt?.toString() ?? '',
            updatedAt: creator.updatedAt?.toString() ?? '',
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
  }, [provider, isConnected]);

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">Explore Creators</h1>
      
      {!isConnected ? (
        <div className="text-center py-8">
          Please connect your wallet to view creators
        </div>
      ) : isLoading ? (
        <div className="text-center py-8">Loading creators...</div>
      ) : creators.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {creators.map(creator => (
            <CreatorCard key={creator.id} creator={creator} />
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
        
       No creators found. Be the first one to register!
        </div>
        
      )}
     <div className="absolute top-4 right-4">
        <button
          onClick={() => router.push('/creator/register')}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Become a Creator
        </button>
      </div>
    </div>
  );
}
