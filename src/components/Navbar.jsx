'use client'

import Link from 'next/link'
import { useWeb3 } from '../hooks/useWeb3'

export default function Navbar() {
  const { isConnected, address, connect, error } = useWeb3()

  return (
    <nav className="border-b">
      <div className="flex h-16 items-center px-4">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <span className="font-bold">HackHazard</span>
        </Link>
        <div className="flex items-center space-x-4">
          <Link href="/creators" className="text-sm font-medium">
            Creators
          </Link>
          <Link href="/tiers" className="text-sm font-medium">
            Subscription Tiers
          </Link>
        </div>
        <div className="ml-auto flex items-center space-x-4">
          {error && (
            <div className="text-red-500 text-sm">
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
            <div className="text-sm text-gray-600">
              {address.slice(0, 6)}...{address.slice(-4)}
            </div>
          )}
        </div>
      </div>
    </nav>
  )
} 