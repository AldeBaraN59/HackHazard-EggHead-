'use client'

import { useState, useEffect } from 'react'
import { useWeb3 } from '../../hooks/useWeb3'
import { ethers } from 'ethers'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { toast } from 'sonner'
import Link from 'next/link'
import TierCards from '@/components/tierCards'

const IPFS_GATEWAY = process.env.NEXT_PUBLIC_IPFS_GATEWAY || 'https://ipfs.io/ipfs/';

async function fetchWithRetry(url, retries = 3) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    if (retries > 0) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return fetchWithRetry(url, retries - 1);
    }
    throw error;
  }
}

export default function CreatorProfilePage() {
  const { contracts, isConnected, address } = useWeb3()
  const [creator, setCreator] = useState(null)
  const [creators, setCreators] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const metadataCache = {};

    async function fetchCreators() {
      try {
        if (!isConnected || !contracts.creatorRegistry) {
          setLoading(false);
          return;
        }
    
        if (!contracts.creatorRegistry.getTotalCreators) {
          throw new Error("CreatorRegistry contract missing required function");
        }
    
        const creatorCount = await contracts.creatorRegistry.getTotalCreators()
          .catch(err => {
            console.error("getTotalCreators error:", err);
            throw new Error("Failed to get creator count");
          });
    
        if (creatorCount === 0) {
          setCreators([]);
          setLoading(false);
          return;
        }
    
        const creatorList = [];
    
        for (let i = 1; i <= creatorCount; i++) {
          try {
            const creator = await contracts.creatorRegistry.getCreator(i)
              .catch(err => {
                console.error(`Failed to fetch creator ${i}:`, err);
                return null;
              });
    
            if (!creator) continue;
    
            const metadata = await Promise.race([
              fetch(creator.metadataURI.replace('ipfs://', IPFS_GATEWAY))
                .then(res => res.json()),
              new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Metadata fetch timeout')), 5000)
              )
            ]).catch(err => ({
              name: creator.creatorAddress || 'Unknown Creator',
              description: 'Description not available',
              imageUrl: '/default-avatar.png'
            }));
            
    
            const tierCount = await contracts.contentNFT.getTierCount(i)
              .catch(() => 0);
    
            creatorList.push({
              id: i,
              name: metadata.name,
              description: metadata.description,
              imageUrl: metadata.imageUrl,
              totalSubscribers: Number(creator.totalSubscribers),
              totalEarnings: ethers.formatEther(creator.totalEarnings),
              tierCount: tierCount
            });
          } catch (err) {
            console.error(`Error processing creator ${i}:`, err);
            continue;
          }
        }
    
        creatorList.sort((a, b) => b.totalSubscribers - a.totalSubscribers);
        setCreators(creatorList);
      } catch (err) {
        setError(err.message || 'Failed to fetch creators');
        console.error('Creator fetch error:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchCreators()
  }, [contracts, isConnected])

  const filteredCreators = creators.filter(creator =>
    creator.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    creator.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 animate-pulse bg-muted rounded" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-64 animate-pulse bg-muted rounded" />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-red-500">
        {error}
        <Button variant="outline" onClick={() => window.location.reload()} className="ml-4">
          Retry
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col justify-center items-center min-h-screen">
      {/* Hero Banner */}
      <div className="w-full h-[40vh] bg-gradient-to-r from-yellow-100 to-yellow-200 text-black flex items-center justify-center">
        <h1 className="text-4xl font-bold">Discover Amazing Creators</h1>
      </div>

      {/* Creator Profile Header */}
      <div className="w-full relative bg-gray-800 text-white h-[20vh] flex flex-col justify-end items-center pb-8">
        <div className="absolute left-1/2 transform -translate-x-1/2 -top-16 w-40 h-40 bg-yellow-400 rounded-full flex flex-col justify-center items-center shadow-xl border-4 border-white">
          <img 
            src="/headphones-removebg-preview.png" 
            alt="Creator Logo" 
            className="w-24 h-24 object-contain"
          />
        </div>
        <h1 className="text-2xl font-bold mt-4">GP Grey</h1>
        <p className="text-gray-300">Creating YouTube Videos</p>
      </div>

      {/* Main Content */}
      <div className="w-full max-w-7xl px-4 py-8 space-y-12">
        {/* Creators Grid Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Featured Creators</h2>
            <Input
              type="text"
              placeholder="Search creators..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64"
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence>
              {filteredCreators.map(creator => (
                <motion.div
                  key={creator.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold">
                        {creator.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="aspect-square w-full overflow-hidden rounded-lg">
                          <img
                            src={creator.imageUrl || '/default-avatar.png'}
                            alt={creator.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-3">
                          {creator.description}
                        </p>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">
                            {creator.totalSubscribers.toLocaleString()} subscribers
                          </span>
                          <span className="font-medium">
                            {creator.totalEarnings} ETH
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">
                            {creator.tierCount} tiers
                          </span>
                          <Link href={`/creators/${creator.id}`}>
                            <Button variant="outline" size="sm">
                              View Profile
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </section>

        {/* Content Showcase Sections */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold">Most Loved Content</h2>
          <div className="w-full h-[50vh] bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl shadow-inner flex items-center justify-center">
            <p className="text-gray-500">Featured content showcase</p>
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl font-bold">More Content</h2>
          <div className="w-full h-[50vh] bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl shadow-inner flex items-center justify-center">
            <p className="text-gray-500">Additional content showcase</p>
          </div>
        </section>

        {/* Subscription Tiers */}
        <section className="py-12">
          <h2 className="text-2xl font-bold mb-8">Subscription Tiers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <TierCards />
            <TierCards />
            <TierCards />
            <TierCards />
            <TierCards />
          </div>
        </section>
      </div>
    </div>
  )
}