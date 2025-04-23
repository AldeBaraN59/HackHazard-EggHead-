'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Wallet, ConnectWallet } from '@coinbase/onchainkit/wallet';
import HomeNavbar from './HomeNavbar';
import { motion } from 'framer-motion';

export default function Home() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <div className="bg-slate-800">
      {/* Navbar with Wallet Connect */}
      <div className="sticky top-0 pt-9 z-50 flex justify-center items-center">
        <HomeNavbar />
        <div className="absolute right-10">
          <Wallet>
       
            <ConnectWallet  className="rounded-lg bg-white px-6 py-3 text-lg font-medium text-black shadow-md hover:bg-gray-100 transition-colors"
  type="button">
              {/* Connect Wallet button with light gray background */}
              <div>


  Connect Wallet

              </div>
            </ConnectWallet>
          </Wallet>
        </div>
      </div>

      {/* Hero Section */}
      <div className="w-screen h-screen bg-slate-800 flex justify-center items-start relative overflow-hidden">
        <Image
          src="/headphones-removebg-preview.png"
          alt="Headphones"
          width={300}
          height={300}
          className="absolute left-0 bottom-52"
          priority
        />

        <div className="h-screen flex flex-col justify-center items-start px-10">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-white text-5xl md:text-7xl"
          >
            Welcome to Subscribe
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-white text-xl md:text-3xl mt-4"
          >
            Your one stop platform for supporting your beloved creators
          </motion.p>
        </div>
      </div>

      {/* Additional sections */}
      <div className="w-screen h-screen bg-slate-800 flex items-center justify-center">
        <h2 className="text-white text-4xl">Your Content Here</h2>
      </div>
    </div>
  );
}
