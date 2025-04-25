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

export default function CreatorsPage() {
  const { contracts, isConnected, address } = useWeb3()
  const [creators, setCreators] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    async function fetchCreators() {
      try {
        if (!isConnected || !contracts.creatorRegistry) {
          setLoading(false)
          return
        }

        const creatorCount = await contracts.creatorRegistry.getCreatorCount()
        const creatorList = []

        for (let i = 1; i <= creatorCount; i++) {
          const creator = await contracts.creatorRegistry.getCreator(i)
          const metadata = await fetch(creator.metadataURI).then(res => res.json())
          
          creatorList.push({
            id: i,
            name: metadata.name,
            description: metadata.description,
            imageUrl: metadata.imageUrl,
            totalSubscribers: Number(creator.totalSubscribers),
            totalEarnings: ethers.formatEther(creator.totalEarnings),
            tierCount: await contracts.contentNFT.getTierCount(i)
          })
        }

        // Sort creators by subscriber count
        creatorList.sort((a, b) => b.totalSubscribers - a.totalSubscribers)
        setCreators(creatorList)
      } catch (err) {
        setError('Failed to fetch creators')
        console.error('Creator fetch error:', err)
      } finally {
        setLoading(false)
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
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-4"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Discover Creators</h2>
        <Input
          type="text"
          placeholder="Search creators..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-64"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence>
          {filteredCreators.map(creator => (
            <motion.div
              key={creator.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">
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
                    <p className="text-sm text-muted-foreground">
                      {creator.description}
                    </p>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>{creator.totalSubscribers.toLocaleString()} subscribers</span>
                      <span>{creator.totalEarnings} ETH earned</span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>{creator.tierCount} subscription tiers</span>
                      <Link href={`/creators/${creator.id}`}>
                        <Button variant="outline">View Profile</Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  )
} 