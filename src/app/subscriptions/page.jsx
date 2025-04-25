import { useWeb3 } from '@/hooks/useWeb3'
import { useState, useEffect } from 'react'

export default function Subscriptions() {
  const { address, contracts } = useWeb3()
  const [subscriptions, setSubscriptions] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (contracts.subscriptionManager && address) {
      loadSubscriptions()
    }
  }, [contracts.subscriptionManager, address])

  const loadSubscriptions = async () => {
    try {
      // In a real implementation, you would fetch the user's subscriptions
      // from the SubscriptionManager contract
      setSubscriptions([])
    } catch (error) {
      console.error('Failed to load subscriptions:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const cancelSubscription = async (subscriptionId) => {
    try {
      const tx = await contracts.subscriptionManager.cancelSubscription(subscriptionId)
      await tx.wait()
      loadSubscriptions()
    } catch (error) {
      console.error('Failed to cancel subscription:', error)
    }
  }

  if (isLoading) {
    return <div className="text-center">Loading subscriptions...</div>
  }

  if (subscriptions.length === 0) {
    return (
      <div className="text-center">
        <h2 className="mb-4 text-2xl font-semibold">No Active Subscriptions</h2>
        <p className="text-muted-foreground">
          Browse creators and subscribe to access exclusive content
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">My Subscriptions</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {subscriptions.map((subscription) => (
          <div
            key={subscription.id}
            className="rounded-lg border bg-card p-6 shadow-sm"
          >
            <h3 className="mb-2 text-xl font-semibold">
              {subscription.creatorName}
            </h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Tier: {subscription.tierName}
            </p>
            <div className="mb-4 space-y-2">
              <p className="text-sm">
                Start Date: {new Date(subscription.startTime * 1000).toLocaleDateString()}
              </p>
              <p className="text-sm">
                End Date: {new Date(subscription.endTime * 1000).toLocaleDateString()}
              </p>
              <p className="text-sm">
                Amount Paid: {ethers.formatEther(subscription.amountPaid)} ETH
              </p>
            </div>
            <button
              onClick={() => cancelSubscription(subscription.id)}
              className="w-full rounded-lg bg-destructive px-4 py-2 text-white hover:bg-destructive/90"
            >
              Cancel Subscription
            </button>
          </div>
        ))}
      </div>
    </div>
  )
} 