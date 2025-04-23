'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Wallet, ConnectWallet } from '@coinbase/onchainkit/wallet';
import HomeNavbar from './HomeNavbar';
import Card from '../components/card.jsx';
import { motion } from 'framer-motion';

export default function Home() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <div className='bg-slate-800'>
      {/* Navbar with Wallet Connect */}
      <div className='sticky top-0 pt-9 z-50 flex justify-center items-center'>
        <HomeNavbar />
        <div className="absolute right-10">
          <Wallet>
            <ConnectWallet>
              <button className="rounded-lg bg-blue-600 px-6 py-3 text-lg font-medium text-white shadow-md hover:bg-blue-700 transition-colors">
                Connect Wallet
              </button>
            </ConnectWallet>
          </Wallet>
        </div>
      </div>

      {/* Hero Section */}
      <div className='w-screen h-screen bg-slate-800 flex justify-center items-start relative overflow-hidden'>
        <Image
          src="/headphones-removebg-preview.png"
          alt="Headphones"
          width={300}
          height={300}
          className='absolute left-0 bottom-52'
          priority
        />

        <div className='h-screen flex flex-col justify-center items-start px-10'>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className='text-white text-5xl md:text-7xl'
          >
            Welcome to Subscribe
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className='text-white text-xl md:text-3xl mt-4'
          >
            Your one stop platform for supporting your beloved creators
          </motion.p>
        </div>
      </div>

      {/* Card Grid Section */}
      <div className='w-screen min-h-screen bg-slate-800 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 px-10 py-20'>
        {[...Array(8)].map((_, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
          >
            <Card />
          </motion.div>
        ))}
      </div>

      {/* Optional: You can add another section here if needed */}
      <div className='w-screen h-screen bg-slate-800 flex items-center justify-center'>
        <h2 className='text-white text-4xl'>Your Content Here</h2>
      </div>
    </div>
  );
}