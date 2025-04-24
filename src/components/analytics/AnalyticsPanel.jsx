'use client'

import { useEffect, useState } from 'react'
import { useWeb3 } from '../../hooks/useWeb3'
import { ethers } from 'ethers'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function AnalyticsPanel() {
  const { contracts, isConnected, address } = useWeb3()
  const [analytics, setAnalytics] = useState({
    totalSubscribers: 0,
    totalRevenue: '0',
    monthlyGrowth: 0,
    engagementRate: 0,
    subscriberHistory: [],
    revenueHistory: []
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        if (!isConnected || !contracts.creatorRegistry || !contracts.subscriptionManager) {
          setLoading(false)
          return
        }

        const creatorId = await contracts.creatorRegistry.getCreatorIdByWallet(address)
        if (!creatorId) {
          setLoading(false)
          return
        }

        const creator = await contracts.creatorRegistry.getCreator(creatorId)
        
        // Fetch subscription history
        const subscriptionIds = await contracts.subscriptionManager.getSubscriptionsByCreator(creatorId)
        const history = []
        
        for (const id of subscriptionIds) {
          const subscription = await contracts.subscriptionManager.getSubscription(id)
          history.push({
            timestamp: new Date(subscription.startTime * 1000),
            subscribers: 1,
            revenue: ethers.formatEther(subscription.amountPaid)
          })
        }

        // Calculate metrics
        const totalSubscribers = Number(creator.totalSubscribers)
        const totalRevenue = ethers.formatEther(creator.totalEarnings)
        
        // Calculate monthly growth
        const monthlySubscriptions = history.filter(h => 
          h.timestamp > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        )
        const monthlyGrowth = monthlySubscriptions.length

        // Calculate engagement rate (simplified)
        const engagementRate = totalSubscribers > 0 
          ? (monthlyGrowth / totalSubscribers) * 100 
          : 0

        setAnalytics({
          totalSubscribers,
          totalRevenue,
          monthlyGrowth,
          engagementRate,
          subscriberHistory: history.map(h => ({
            date: h.timestamp.toLocaleDateString(),
            subscribers: h.subscribers
          })),
          revenueHistory: history.map(h => ({
            date: h.timestamp.toLocaleDateString(),
            revenue: parseFloat(h.revenue)
          }))
        })
      } catch (err) {
        setError('Failed to fetch analytics data')
        console.error('Analytics error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [contracts, isConnected, address])

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 animate-pulse bg-muted rounded" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 animate-pulse bg-muted rounded" />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-red-500">
        {error}
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-4"
    >
      <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Subscribers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics.totalSubscribers.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics.totalRevenue} ETH
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Monthly Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              +{analytics.monthlyGrowth}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Engagement Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics.engagementRate.toFixed(1)}%
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Subscriber Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analytics.subscriberHistory}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="subscribers" stroke="#8884d8" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analytics.revenueHistory}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="revenue" stroke="#82ca9d" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  )
} 