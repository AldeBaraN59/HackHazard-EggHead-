'use client'
import TierCards from '@/components/tierCards'
import React from 'react'

const page = () => {
    return (
        <div  className='flex flex-col justify-center items-center'>
            <div className='w-screen h-[40vh] bg-yellow-50 text-black'>
                Back image
            </div>
            <div className='main_content w-screen h-[20vh] bg-gray-800 text-black relative flex flex-col justify-center items-center'>

                <div className='main_content flex flex-col justify-center items-center absolute left-[45vw] -top-10 w-[10em] h-[10em] bg-yellow-400 text-black'>
                    <img src='/headphones-removebg-preview.png' />
                    <center>
                    <h1>gp grey</h1>
                    </center>
                    <center>
                        <h4>Creating Youtube videos</h4>
                    </center>
                </div>

            </div>
            <h1>Most loved content</h1>
            <div className='hero showcase w-[50vw] h-[50vh] bg-slate-800'>
            </div>
            <br />
            <h1>More content</h1>
            <div className='hero showcase w-[50vw] h-[50vh] bg-slate-800'>
            </div>
            <div className='h-screen w-screen grid grid-cols-5'>
                <TierCards />
                <TierCards />
                <TierCards />
                <TierCards />
                <TierCards />
            </div>
        </div>
    )
}

export default page
