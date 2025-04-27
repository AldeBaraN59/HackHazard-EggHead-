'use client'

import { useEffect, useState } from 'react'
import { useWeb3 } from '../../../hooks/useWeb3'
import CreatorProfile from '../../../components/CreatorProfile'
import { ethers } from 'ethers'

export default function CreatorProfilePage({ params }) {
  const { contracts, isConnected } = useWeb3()
  const [creator, setCreator] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchCreator() {
      try {
        if (!isConnected || !contracts.creatorRegistry || !contracts.contentNFT) {
          setLoading(false)
          return
        }

        const creatorId = params.id
        const creatorData = await contracts.creatorRegistry.getCreator(creatorId)
        const metadata = await fetch(creatorData.metadataURI).then(res => res.json())

        // Fetch creator's tiers
        const tierCount = await contracts.contentNFT.getTierCount(creatorId)
        const tiers = []

        for (let i = 0; i < tierCount; i++) {
          const tier = await contracts.contentNFT.getTier(creatorId, i)
          const tierMetadata = await fetch(tier.metadataURI).then(res => res.json())
          
          tiers.push({
            id: i,
            name: tierMetadata.name,
            price: ethers.formatEther(tier.price),
            description: tierMetadata.description,
            features: tierMetadata.features
          })
        }

        // Fetch recent content
        const contentCount = await contracts.contentNFT.getContentCount(creatorId)
        const recentContent = []

        for (let i = Math.max(0, contentCount - 5); i < contentCount; i++) {
          const content = await contracts.contentNFT.getContent(creatorId, i)
          const contentMetadata = await fetch(content.metadataURI).then(res => res.json())
          
          recentContent.push({
            id: i,
            title: contentMetadata.title,
            date: new Date(content.timestamp * 1000).toLocaleDateString(),
            contentURI: content.contentURI
          })
        }

        setCreator({
          id: creatorId,
          name: metadata.name,
          description: metadata.description,
          imageUrl: metadata.imageUrl,
          subscribers: Number(creatorData.totalSubscribers),
          earnings: ethers.formatEther(creatorData.totalEarnings),
          isVerified: creatorData.isVerified,
          tiers,
          recentContent
        })
      } catch (err) {
        setError('Failed to fetch creator data')
        console.error('Error fetching creator:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchCreator()
  }, [contracts, isConnected, params.id])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-xl">Loading creator profile...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-xl text-red-500">{error}</div>
      </div>
    )
  }

  if (!creator) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-xl">Creator not found</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <CreatorProfile creator={creator} />
    </div>
  )
} 