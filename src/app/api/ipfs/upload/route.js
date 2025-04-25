import { NextResponse } from 'next/server'
import { create } from 'ipfs-http-client'

// Initialize IPFS client
const ipfs = create({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
  headers: {
    authorization: `Basic ${Buffer.from(
      `${process.env.INFURA_PROJECT_ID}:${process.env.INFURA_PROJECT_SECRET}`
    ).toString('base64')}`
  }
})

export async function POST(request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file')
    const title = formData.get('title')
    const description = formData.get('description')
    const isEncrypted = formData.get('isEncrypted') === 'true'

    if (!file && !title) {
      return NextResponse.json(
        { error: 'No file or metadata provided' },
        { status: 400 }
      )
    }

    let cid

    if (file) {
      // Handle file upload
      const buffer = Buffer.from(await file.arrayBuffer())
      
      if (isEncrypted) {
        // TODO: Implement encryption for premium content
        // For now, we'll just upload as is
      }

      const result = await ipfs.add(buffer)
      cid = result.path
    } else {
      // Handle metadata upload
      const metadata = {
        title,
        description,
        timestamp: new Date().toISOString()
      }

      const result = await ipfs.add(JSON.stringify(metadata))
      cid = result.path
    }

    return NextResponse.json({ cid })
  } catch (error) {
    console.error('IPFS upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload to IPFS' },
      { status: 500 }
    )
  }
} 