import { useWeb3 } from '@/hooks/useWeb3'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function ContentPage({ params }) {
  const { contracts, address } = useWeb3()
  const [content, setContent] = useState(null)
  const [hasAccess, setHasAccess] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    if (contracts.contentNFT && address) {
      checkAccess()
    }
  }, [contracts.contentNFT, address])

  const checkAccess = async () => {
    try {
      // In a real implementation, you would check if the user has access
      // to the content through their subscription
      const tokenId = params.id
      const tierId = await contracts.contentNFT.getTokenTier(tokenId)
      const access = await contracts.contentNFT.hasAccess(tokenId, tierId)
      setHasAccess(access)

      if (access) {
        const contentURI = await contracts.contentNFT.getContentURI(tokenId)
        // Fetch content from IPFS
        setContent({
          title: 'Content Title',
          description: 'Content description',
          uri: contentURI,
        })
      }
    } catch (error) {
      console.error('Failed to check access:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return <div className="text-center">Loading content...</div>
  }

  if (!hasAccess) {
    return (
      <div className="text-center">
        <h2 className="mb-4 text-2xl font-semibold">Access Denied</h2>
        <p className="mb-6 text-muted-foreground">
          You need to subscribe to access this content
        </p>
        <button
          onClick={() => router.push('/creators')}
          className="rounded-lg bg-primary px-4 py-2 text-white hover:bg-primary/90"
        >
          Browse Creators
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{content.title}</h1>
        <p className="mt-2 text-muted-foreground">{content.description}</p>
      </div>

      <div className="rounded-lg border bg-card p-6">
        {/* Display content based on type (image, video, text, etc.) */}
        <div className="aspect-video w-full bg-muted">
          {/* Content will be displayed here */}
        </div>
      </div>
    </div>
  )
} 