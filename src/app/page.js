
'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Avatar, Identity, Name, Badge, Address } from '@coinbase/onchainkit/identity';
import HomeNavbar from './HomeNavbar';
import styled from 'styled-components';
import Card from '../components/card.jsx';
import { motion } from 'framer-motion';

// Define a function to fetch identity info or pass in static data
const address = "0x838aD0EAE54F99F1926dA7C3b6bFbF617389B4D9";
const schemaId = "0xf8b05c79f090979bf4a80270aba232dff11a10d9ca55c4f88de95317970f0de9";

export default function Home() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate some delay for loading
    setLoading(false);
  }, []);

  return (
    <div className='bg-slate-800'>
      <div className='sticky top-0 pt-9 z-50 flex justify-center items-center'>
        <HomeNavbar />
      </div>
      <div className='w-screen h-screen bg-slate-800 flex justify-center items-start relative'>
        <Image
          src="/headphones-removebg-preview.png"
          alt="Responsive image"
          width={300}
          height={300}
          className='absolute left-0 bottom-52'
        />



        <div className=' h-screen flex flex-col justify-center items-start'>
          <h1 className=' text-white  text-7xl '>Welcome to Subscribe</h1>
          <p className=' text-white  text-3xl '>Your one stop platform for supporting your beloved creators</p>
        </div>
        
        {/* <Image
          src="/controllerImage-removebg-preview.png"
          alt="Responsive image"
          width={300}
          height={300}
          className='absolute right-0 top-20'
        /> */}

      </div>
      <div className='w-screen h-screen bg-slate-800 grid grid-cols-4 gap-20'>
        <div className=''>
          <Card />
        </div>
        <div className='grid-span'>
          <Card />
        </div>
        <div className='grid-span'>
          <Card />
        </div>
        <div className='grid-span'>
          <Card />
        </div>
        <div className=''>
          <Card />
        </div>
        <div className='grid-span'>
          <Card />
        </div>
        <div className='grid-span'>
          <Card />
        </div>
        <div className='grid-span'>
          <Card />
        </div>

      </div >
      
      //footer
      <div className='w-screen h-screen bg-slate-800'>
        <script type="module" src="https://unpkg.com/@splinetool/viewer@1.9.82/build/spline-viewer.js"></script>
        <spline-viewer url="https://prod.spline.design/A1VkaKD7TMyunAGY/scene.splinecode"></spline-viewer>
      </div>
    </div>
  );
}

