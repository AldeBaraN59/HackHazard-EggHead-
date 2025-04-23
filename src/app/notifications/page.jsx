'use client'

import { Bell } from 'lucide-react'
import React from 'react'

const page = () => {
  return (
    <div className='flex flex-col justify-center items-center bg-slate-800 text-white w-screen h-screen'>
      <Bell/>
      <h1>No notifications yet</h1>
      <h4>
      You’ll get updates when people join your community, 
      interact with your posts and more.
      </h4>
    </div>
  )
}

export default page
