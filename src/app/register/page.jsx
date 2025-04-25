import { useWeb3 } from '@/hooks/useWeb3'
import { useState } from 'react'

export default function Register() {
  const { contracts, address } = useWeb3()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!contracts.creatorRegistry) return

    setIsLoading(true)
    try {
      // In a real implementation, you would upload the metadata to IPFS
      const metadataURI = 'ipfs://metadata-uri'
      const tx = await contracts.creatorRegistry.registerCreator(metadataURI)
      await tx.wait()
      // Redirect to dashboard or show success message
    } catch (error) {
      console.error('Failed to register:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-md space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Register as a Creator</h1>
        <p className="text-muted-foreground">
          Start monetizing your content with Web3 subscriptions
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium">
            Display Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border bg-background px-3 py-2"
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="description" className="text-sm font-medium">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-lg border bg-background px-3 py-2"
            rows={4}
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-lg bg-primary px-4 py-2 text-white hover:bg-primary/90 disabled:opacity-50"
        >
          {isLoading ? 'Registering...' : 'Register as Creator'}
        </button>
      </form>
    </div>
  )
} 