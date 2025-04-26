'use client'

import ExpandableCardDemo from '@/components/expandable-card-demo-standard'
import { Bell } from 'lucide-react'
import React from 'react'

const page = () => {
  return (
    <div className='flex flex-col justify-center items-center bg-slate-800 text-white w-[80vw] h-screen'>
      <Bell/>
      <h1>No notifications yet</h1>
      <h4>
      You’ll get updates when people join your community, 
      interact with your posts and more.
      </h4>
      <ExpandableCardDemo/>
    </div>
  )
}

export default page
