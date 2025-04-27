'use client'

import { Inter } from 'next/font/google'
import { Toaster } from 'sonner'
import { Web3Provider } from '../components/web3-provider'
import './global.css'
import Providers from './Provider';


const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({ children }) {
  return (
    <html lang="en" >
      <body className={inter.className}>
        
        <Web3Provider>
      
          {children}
          <Toaster position="top-right" />
   
        </Web3Provider>
      </body>
    </html>
  )
} 