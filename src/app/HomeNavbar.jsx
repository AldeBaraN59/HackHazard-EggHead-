'use client'
import Link from 'next/link'
import React from 'react'

const HomeNavbar = () => {
    return (
            <nav className="sticky w-[70vw] top-0 z-10 bg-slate-400  backdrop-filter backdrop-blur-lg  bg-opacity-30 rounded-lg">
                <div className="max-w-5xl mx-auto px-4">
                    <div className="flex items-center justify-between h-16">
                        <img className="text-2xl text-gray-900 font-semibold" src='/Yellow_Black_Brush_Streetwear_Brand_Logo_20250424_123341_0000-removebg-preview.png' width='200px'/>
                        {/*dd konnekt vutton below*/}
                    </div>
                </div>
            </nav >


    )
}

export default HomeNavbar
