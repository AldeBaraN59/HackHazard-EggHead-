'use client'

import { useState, useEffect } from 'react'
import { useWeb3 } from '../../hooks/useWeb3'
import { ethers } from 'ethers'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { toast } from 'sonner'

export default function TierManager() {
  const { contracts, isConnected, address } = useWeb3()
  const [tiers, setTiers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [newTier, setNewTier] = useState({
    name: '',
    price: '',
    description: '',
    features: [''],
    metadataURI: ''
  })

  useEffect(() => {
    async function fetchTiers() {
      try {
        if (!isConnected || !contracts.creatorRegistry || !contracts.contentNFT) {
          setLoading(false)
          return
        }

        const creatorId = await contracts.creatorRegistry.getCreatorIdByWallet(address)
        if (!creatorId) {
          setLoading(false)
          return
        }

        const tierCount = await contracts.contentNFT.getTierCount(creatorId)
        const tierList = []

        for (let i = 1; i <= tierCount; i++) {
          const tier = await contracts.contentNFT.getTier(creatorId, i)
          const tierMetadata = await fetch(tier.metadataURI).then(res => res.json())
          
          tierList.push({
            id: i,
            name: tier.name,
            price: ethers.formatEther(tier.price),
            description: tierMetadata.description,
            features: tierMetadata.features,
            subscriberCount: await contracts.contentNFT.getTierSubscriberCount(creatorId, i)
          })
        }

        setTiers(tierList)
      } catch (err) {
        setError('Failed to fetch tiers')
        console.error('Tier fetch error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchTiers()
  }, [contracts, isConnected, address])

  const handleCreateTier = async (e) => {
    e.preventDefault()
    if (!isConnected || !contracts.contentNFT) {
      toast.error('Please connect your wallet')
      return
    }

    try {
      setLoading(true)
      setError(null)

      // Create metadata
      const tierMetadata = {
        description: newTier.description,
        features: newTier.features.filter(f => f.trim() !== '')
      }

      // Upload metadata to IPFS
      const response = await fetch('/api/ipfs/upload', {
        method: 'POST',
        body: JSON.stringify(tierMetadata)
      })

      if (!response.ok) {
        throw new Error('Failed to upload metadata')
      }

      const { cid } = await response.json()

      // Create tier on-chain
      const tx = await contracts.contentNFT.createTier(
        newTier.name,
        `ipfs://${cid}`,
        ethers.parseEther(newTier.price)
      )

      await tx.wait()
      toast.success('Tier created successfully!')

      // Reset form
      setNewTier({
        name: '',
        price: '',
        description: '',
        features: [''],
        metadataURI: ''
      })

      // Refresh tiers
      const creatorId = await contracts.creatorRegistry.getCreatorIdByWallet(address)
      const tierCount = await contracts.contentNFT.getTierCount(creatorId)
      const tier = await contracts.contentNFT.getTier(creatorId, tierCount)
      const newTierMetadata = await fetch(tier.metadataURI).then(res => res.json())

      setTiers(prev => [...prev, {
        id: tierCount,
        name: tier.name,
        price: ethers.formatEther(tier.price),
        description: newTierMetadata.description,
        features: newTierMetadata.features,
        subscriberCount: 0
      }])
    } catch (err) {
      setError('Failed to create tier')
      toast.error('Failed to create tier')
      console.error('Tier creation error:', err)
    } finally {
      setLoading(false)
    }
  }

  const addFeature = () => {
    setNewTier(prev => ({
      ...prev,
      features: [...prev.features, '']
    }))
  }

  const removeFeature = (index) => {
    setNewTier(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }))
  }

  const updateFeature = (index, value) => {
    setNewTier(prev => ({
      ...prev,
      features: prev.features.map((f, i) => i === index ? value : f)
    }))
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 animate-pulse bg-muted rounded" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-64 animate-pulse bg-muted rounded" />
          ))}
        </div>
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
      <h2 className="text-2xl font-bold">Subscription Tiers</h2>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {tiers.map(tier => (
          <Card key={tier.id}>
            <CardHeader>
              <CardTitle className="text-sm font-medium">{tier.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-2xl font-bold">
                  {tier.price} ETH
                  <span className="text-sm text-muted-foreground">/month</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {tier.description}
                </p>
                <ul className="space-y-2">
                  {tier.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-sm">
                      <svg
                        className="mr-2 h-4 w-4 text-green-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <div className="text-sm text-muted-foreground">
                  {tier.subscriberCount} subscribers
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Create New Tier</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateTier} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Name</label>
                <Input
                  value={newTier.name}
                  onChange={(e) => setNewTier(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g. Premium, VIP"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Price (ETH)</label>
                <Input
                  type="number"
                  value={newTier.price}
                  onChange={(e) => setNewTier(prev => ({ ...prev, price: e.target.value }))}
                  placeholder="0.1"
                  step="0.01"
                  min="0.01"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  value={newTier.description}
                  onChange={(e) => setNewTier(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe what subscribers get"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Features</label>
                <AnimatePresence>
                  {newTier.features.map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-center space-x-2"
                    >
                      <Input
                        value={feature}
                        onChange={(e) => updateFeature(index, e.target.value)}
                        placeholder="Add a feature"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFeature(index)}
                        className="text-red-500"
                      >
                        ×
                      </Button>
                    </motion.div>
                  ))}
                </AnimatePresence>
                <Button
                  type="button"
                  variant="outline"
                  onClick={addFeature}
                  className="w-full"
                >
                  Add Feature
                </Button>
              </div>

              {error && (
                <div className="text-sm text-red-500">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full"
              >
                {loading ? 'Creating...' : 'Create Tier'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  )
} 