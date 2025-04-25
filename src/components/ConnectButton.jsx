import { useWeb3 } from '@/hooks/useWeb3'

export function ConnectButton() {
  const { isConnected, address, connect } = useWeb3()

  return (
    <button
      onClick={connect}
      className="rounded-lg bg-primary px-4 py-2 text-white hover:bg-primary/90"
    >
      {isConnected
        ? `${address.slice(0, 6)}...${address.slice(-4)}`
        : 'Connect Wallet'}
    </button>
  )
} 