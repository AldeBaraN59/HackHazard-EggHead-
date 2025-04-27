'use client'

import { useState, useCallback } from 'react'
import { useWeb3 } from '../../hooks/useWeb3'
import { ethers } from 'ethers'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { useDropzone } from 'react-dropzone'
import { toast } from 'sonner'

export default function ContentManager() {
  const { contracts, isConnected, address } = useWeb3()
  const [content, setContent] = useState({
    title: '',
    description: '',
    file: null,
    tierId: '',
    isEncrypted: false
  })
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(null)

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setContent(prev => ({ ...prev, file: acceptedFiles[0] }))
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
      'video/*': ['.mp4', '.webm'],
      'audio/*': ['.mp3', '.wav'],
      'application/pdf': ['.pdf']
    },
    maxSize: 100 * 1024 * 1024 // 100MB
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!isConnected || !contracts.contentNFT) {
      toast.error('Please connect your wallet')
      return
    }

    try {
      setUploading(true)
      setError(null)

      // Upload to IPFS
      const formData = new FormData()
      formData.append('file', content.file)
      formData.append('title', content.title)
      formData.append('description', content.description)
      formData.append('isEncrypted', content.isEncrypted)

      const response = await fetch('/api/ipfs/upload', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error('Failed to upload to IPFS')
      }

      const { cid } = await response.json()

      // Mint NFT
      const tx = await contracts.contentNFT.mintContent(
        content.tierId,
        `ipfs://${cid}`
      )

      await tx.wait()
      toast.success('Content uploaded successfully!')
      
      // Reset form
      setContent({
        title: '',
        description: '',
        file: null,
        tierId: '',
        isEncrypted: false
      })
    } catch (err) {
      setError('Failed to upload content')
      toast.error('Failed to upload content')
      console.error('Upload error:', err)
    } finally {
      setUploading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-4"
    >
      <h2 className="text-2xl font-bold">Content Manager</h2>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Upload New Content</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <Input
                value={content.title}
                onChange={(e) => setContent(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter content title"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={content.description}
                onChange={(e) => setContent(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter content description"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Subscription Tier</label>
              <Input
                type="number"
                value={content.tierId}
                onChange={(e) => setContent(prev => ({ ...prev, tierId: e.target.value }))}
                placeholder="Enter tier ID"
                required
              />
            </div>

            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
                ${isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'}`}
            >
              <input {...getInputProps()} />
              {content.file ? (
                <div className="space-y-2">
                  <p className="text-sm font-medium">{content.file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(content.file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-sm font-medium">
                    {isDragActive ? 'Drop the file here' : 'Drag and drop your file here'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    or click to select a file
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="encrypt"
                checked={content.isEncrypted}
                onChange={(e) => setContent(prev => ({ ...prev, isEncrypted: e.target.checked }))}
                className="rounded border-gray-300"
              />
              <label htmlFor="encrypt" className="text-sm">
                Encrypt content for premium tiers
              </label>
            </div>

            {error && (
              <div className="text-sm text-red-500">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={uploading}
              className="w-full"
            >
              {uploading ? 'Uploading...' : 'Upload Content'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  )
} 