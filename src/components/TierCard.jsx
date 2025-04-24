'use client'

import { useState } from 'react'
import { useWeb3 } from '../hooks/useWeb3'
import { ethers } from 'ethers'
import Link from 'next/link'

export default function TierCard({ 
  name = '', 
  price = '0', 
  description = '', 
  features = [], 
  creatorName = '',
  subscribers = 0,
  creatorId = '',
  tierId = '' 
}) {
  const { contracts, isConnected, address } = useWeb3()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubscribe = async () => {
    try {
      if (!isConnected) {
        setError('Please connect your wallet first')
        return
      }

      setLoading(true)
      setError(null)

      const tx = await contracts.subscriptionManager.subscribe(
        creatorId,
        tierId,
        1, // 1 month subscription
        { value: ethers.parseEther(price) }
      )

      await tx.wait()
      // Handle successful subscription
    } catch (err) {
      setError('Failed to subscribe')
      console.error('Subscription error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-lg border bg-card p-6 shadow-sm">
      <div className="mb-4">
        <h3 className="text-xl font-semibold">{name}</h3>
        <p className="text-sm text-muted-foreground">
          by {creatorName}
        </p>
      </div>
      
      <div className="mb-4">
        <span className="text-2xl font-bold">{price} ETH</span>
        <span className="text-sm text-muted-foreground">/month</span>
      </div>

      <p className="mb-4 text-sm text-muted-foreground">{description}</p>

      <ul className="mb-6 space-y-2">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center">
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

      <div className="mb-4 text-sm text-muted-foreground">
        {typeof subscribers === 'number' ? subscribers.toLocaleString() : '0'} subscribers
      </div>

      {error && (
        <div className="mb-4 text-sm text-red-500">
          {error}
        </div>
      )}

      <button
        onClick={handleSubscribe}
        disabled={loading}
        className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 disabled:opacity-50"
      >
        {loading ? 'Subscribing...' : 'Subscribe'}
      </button>

      <Link
        href={`/creators/${creatorId}`}
        className="mt-4 block text-center text-sm text-primary hover:underline"
      >
        View Creator Profile
      </Link>
    </div>
  )
} 