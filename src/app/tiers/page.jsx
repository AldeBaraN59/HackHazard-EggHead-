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

export default function TiersPage() {
  const { contracts, isConnected, address } = useWeb3()
  const [tiers, setTiers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('price') // 'price', 'subscribers', 'recent'

  useEffect(() => {
    async function fetchTiers() {
      try {
        if (!isConnected || !contracts.creatorRegistry || !contracts.contentNFT) {
          setLoading(false)
          return
        }

        const creatorCount = await contracts.creatorRegistry.getCreatorCount()
        const tierList = []

        for (let i = 1; i <= creatorCount; i++) {
          const creator = await contracts.creatorRegistry.getCreator(i)
          const metadata = await fetch(creator.metadataURI).then(res => res.json())
          const tierCount = await contracts.contentNFT.getTierCount(i)

          for (let j = 1; j <= tierCount; j++) {
            const tier = await contracts.contentNFT.getTier(i, j)
            const tierMetadata = await fetch(tier.metadataURI).then(res => res.json())
            
            tierList.push({
              id: j,
              creatorId: i,
              creatorName: metadata.name,
              name: tier.name,
              description: tierMetadata.description,
              price: ethers.formatEther(tier.price),
              subscriberCount: await contracts.contentNFT.getTierSubscriberCount(i, j),
              createdAt: new Date(tier.createdAt * 1000)
            })
          }
        }

        // Sort tiers based on selected criteria
        tierList.sort((a, b) => {
          switch (sortBy) {
            case 'price':
              return parseFloat(b.price) - parseFloat(a.price)
            case 'subscribers':
              return b.subscriberCount - a.subscriberCount
            case 'recent':
              return b.createdAt - a.createdAt
            default:
              return 0
          }
        })

        setTiers(tierList)
      } catch (err) {
        setError('Failed to fetch subscription tiers')
        console.error('Tier fetch error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchTiers()
  }, [contracts, isConnected, sortBy])

  const filteredTiers = tiers.filter(tier =>
    tier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tier.creatorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tier.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSubscribe = async (creatorId, tierId, price) => {
    if (!isConnected || !contracts.subscriptionManager) {
      toast.error('Please connect your wallet')
      return
    }

    try {
      const tx = await contracts.subscriptionManager.subscribe(
        creatorId,
        tierId,
        { value: ethers.parseEther(price) }
      )
      await tx.wait()
      toast.success('Successfully subscribed!')
    } catch (err) {
      toast.error('Failed to subscribe')
      console.error('Subscription error:', err)
    }
  }

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
        <h2 className="text-2xl font-bold">Subscription Tiers</h2>
        <div className="flex items-center space-x-4">
          <Input
            type="text"
            placeholder="Search tiers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-64"
          />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="price">Sort by Price</option>
            <option value="subscribers">Sort by Subscribers</option>
            <option value="recent">Sort by Recent</option>
          </select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence>
          {filteredTiers.map(tier => (
            <motion.div
              key={`${tier.creatorId}-${tier.id}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">
                    {tier.name}
                  </CardTitle>
                  <p className="text-xs text-muted-foreground">
                    by {tier.creatorName}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      {tier.description}
                    </p>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>{tier.subscriberCount.toLocaleString()} subscribers</span>
                      <span className="text-lg font-bold">{tier.price} ETH</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <Link href={`/creators/${tier.creatorId}`}>
                        <Button variant="outline">View Creator</Button>
                      </Link>
                      <Button
                        onClick={() => handleSubscribe(tier.creatorId, tier.id, tier.price)}
                      >
                        Subscribe
                      </Button>
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