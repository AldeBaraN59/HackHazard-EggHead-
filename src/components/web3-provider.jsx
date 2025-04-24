'use client'

import { createContext, useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { getCreatorRegistryContract, getSubscriptionManagerContract, getContentNFTContract } from '../utils/web3'

export const Web3Context = createContext()

export function Web3Provider({ children }) {
  const [isConnected, setIsConnected] = useState(false)
  const [address, setAddress] = useState('')
  const [contracts, setContracts] = useState({
    creatorRegistry: null,
    subscriptionManager: null,
    contentNFT: null
  })

  useEffect(() => {
    async function initWeb3() {
      if (typeof window.ethereum !== 'undefined') {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum)
          const signer = await provider.getSigner()
          const userAddress = await signer.getAddress()

          setAddress(userAddress)
          setIsConnected(true)

          // Initialize contracts
          setContracts({
            creatorRegistry: getCreatorRegistryContract(signer),
            subscriptionManager: getSubscriptionManagerContract(signer),
            contentNFT: getContentNFTContract(signer)
          })

          // Listen for account changes
          window.ethereum.on('accountsChanged', async (accounts) => {
            if (accounts.length === 0) {
              setIsConnected(false)
              setAddress('')
              setContracts({
                creatorRegistry: null,
                subscriptionManager: null,
                contentNFT: null
              })
            } else {
              const newSigner = await provider.getSigner()
              setAddress(accounts[0])
              setContracts({
                creatorRegistry: getCreatorRegistryContract(newSigner),
                subscriptionManager: getSubscriptionManagerContract(newSigner),
                contentNFT: getContentNFTContract(newSigner)
              })
            }
          })

          // Listen for chain changes
          window.ethereum.on('chainChanged', () => {
            window.location.reload()
          })
        } catch (error) {
          console.error('Error initializing Web3:', error)
        }
      }
    }

    initWeb3()
  }, [])

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' })
        const provider = new ethers.BrowserProvider(window.ethereum)
        const signer = await provider.getSigner()
        const userAddress = await signer.getAddress()

        setAddress(userAddress)
        setIsConnected(true)

        setContracts({
          creatorRegistry: getCreatorRegistryContract(signer),
          subscriptionManager: getSubscriptionManagerContract(signer),
          contentNFT: getContentNFTContract(signer)
        })
      } catch (error) {
        console.error('Error connecting wallet:', error)
      }
    } else {
      console.error('MetaMask is not installed')
    }
  }

  return (
    <Web3Context.Provider value={{ isConnected, address, contracts, connectWallet }}>
      {children}
    </Web3Context.Provider>
  )
} 