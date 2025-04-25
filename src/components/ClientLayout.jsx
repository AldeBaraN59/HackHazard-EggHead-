'use client'

import { Web3Provider } from './Web3Provider'
import Navbar from './Navbar'

export default function ClientLayout({ children }) {
  return (
    <Web3Provider>
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </Web3Provider>
  )
} 