'use client'

import { useState, useEffect } from 'react'
import { useWeb3 } from '../../hooks/useWeb3'
import { ethers } from 'ethers'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { toast } from 'sonner'

export default function ContentFeed() {
  const { contracts, isConnected, address } = useWeb3()
  const [content, setContent] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('recommended')

  useEffect(() => {
    async function fetchContent() {
      try {
        if (!isConnected || !contracts.creatorRegistry || !contracts.contentNFT) {
          setLoading(false)
          return
        }

        const creatorCount = await contracts.creatorRegistry.getCreatorCount()
        const contentList = []

        // Fetch content from all creators
        for (let i = 1; i <= creatorCount; i++) {
          const creator = await contracts.creatorRegistry.getCreator(i)
          const contentCount = await contracts.contentNFT.getContentCount(i)

          for (let j = 1; j <= contentCount; j++) {
            const contentItem = await contracts.contentNFT.getContent(i, j)
            const metadata = await fetch(contentItem.metadataURI).then(res => res.json())
            
            contentList.push({
              id: contentItem.id,
              creatorId: i,
              creatorName: metadata.name,
              title: metadata.title,
              description: metadata.description,
              contentURI: contentItem.contentURI,
              tierId: contentItem.tierId,
              timestamp: new Date(contentItem.timestamp * 1000),
              likes: 0, // TODO: Implement likes
              views: 0 // TODO: Implement views
            })
          }
        }

        // Sort content by timestamp (newest first)
        contentList.sort((a, b) => b.timestamp - a.timestamp)

        setContent(contentList)
      } catch (err) {
        setError('Failed to fetch content')
        console.error('Content fetch error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchContent()
  }, [contracts, isConnected])

  const getRecommendedContent = () => {
    // Simple recommendation algorithm based on:
    // 1. Content age (newer content gets higher priority)
    // 2. Creator's subscriber count
    // 3. Content engagement (likes and views)
    return [...content].sort((a, b) => {
      const ageScore = (b.timestamp - a.timestamp) / (1000 * 60 * 60 * 24) // Days
      const engagementScore = (b.likes + b.views) - (a.likes + a.views)
      return ageScore + engagementScore
    })
  }

  const getSubscribedContent = () => {
    // Filter content from creators the user is subscribed to
    return content.filter(item => {
      // TODO: Check if user has access to the content's tier
      return true
    })
  }

  const handleLike = async (contentId) => {
    // TODO: Implement like functionality
    toast.success('Liked content!')
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

  const displayedContent = activeTab === 'recommended' 
    ? getRecommendedContent() 
    : getSubscribedContent()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-4"
    >
      <div className="flex space-x-4">
        <Button
          variant={activeTab === 'recommended' ? 'default' : 'outline'}
          onClick={() => setActiveTab('recommended')}
        >
          Recommended
        </Button>
        <Button
          variant={activeTab === 'subscribed' ? 'default' : 'outline'}
          onClick={() => setActiveTab('subscribed')}
        >
          Subscribed
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence>
          {displayedContent.map(item => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">
                    {item.title}
                  </CardTitle>
                  <p className="text-xs text-muted-foreground">
                    by {item.creatorName}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      {item.description}
                    </p>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>
                        {item.timestamp.toLocaleDateString()}
                      </span>
                      <div className="flex items-center space-x-4">
                        <button
                          onClick={() => handleLike(item.id)}
                          className="hover:text-primary"
                        >
                          ♥ {item.likes}
                        </button>
                        <span>👁 {item.views}</span>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => window.open(item.contentURI, '_blank')}
                    >
                      View Content
                    </Button>
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