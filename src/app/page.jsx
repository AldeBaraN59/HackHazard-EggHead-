'use client'

import { useWeb3 } from '../hooks/useWeb3'
import CreatorCard from '../components/CreatorCard'
import TierCard from '../components/TierCard'

export default function Home() {
  const { isConnected, address, connect, error } = useWeb3()

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold mb-8">Welcome to HackHazard</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {!isConnected ? (
          <button
            onClick={connect}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Connect Wallet
          </button>
        ) : (
          <div className="text-green-600">
            Connected: {address}
          </div>
        )}

        <section className="mt-12 space-y-12">
          <section className="text-center">
            <h2 className="mb-4 text-3xl font-bold">
              Discover and Support Your Favorite Creators
            </h2>
            <p className="text-xl text-muted-foreground">
              Subscribe to exclusive content and support creators directly on the blockchain
            </p>
          </section>

          <section>
            <h2 className="mb-6 text-2xl font-semibold">Featured Creators</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <CreatorCard
                name="Creator Name"
                description="Creator description"
                subscribers={1000}
                imageUrl="/creator-placeholder.jpg"
              />
            </div>
          </section>

          <section>
            <h2 className="mb-6 text-2xl font-semibold">Popular Subscription Tiers</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <TierCard
                name="Basic Tier"
                price="0.01 ETH"
                description="Access to basic content"
                features={['Feature 1', 'Feature 2']}
              />
            </div>
          </section>
        </section>
      </div>
    </main>
  )
} 