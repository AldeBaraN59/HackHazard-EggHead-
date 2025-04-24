'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import HomeNavbar from './HomeNavbar';
import Card from '../components/card.jsx';
import { motion } from 'framer-motion';

export default function Home() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <div className="bg-slate-900 text-white w-screen flex flex-col justify-center items-center">
      {/* Navbar */}
      <header className="sticky top-0 z-50">
        <HomeNavbar />
      </header>

      {/* Hero Section */}
      <section className="relative flex flex-col lg:flex-row items-center justify-between h-screen px-8 lg:px-20 overflow-hidden gap-10">
  {/* Hero Text */}
  <motion.div
    initial={{ y: 50, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ duration: 1 }}
    className="z-10 text-center lg:text-left max-w-2xl space-y-6"
  >
    <h1 className="text-5xl md:text-7xl font-bold leading-tight">
      Welcome to <span className="text-teal-400">Subscribe</span>
    </h1>
    <p className="text-xl md:text-2xl text-gray-300">
      Your one-stop platform to support your favorite creators.
    </p>
  </motion.div>

  {/* Headphone Image in row */}
  <motion.div
    initial={{ x: 100, opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    transition={{ duration: 1 }}
    className="hidden lg:block"
  >
    <Image
      src="/headphones-removebg-preview.png"
      alt="Headphones"
      width={300}
      height={300}
    />
  </motion.div>
</section>


      {/* Card Section */}
      <section className="py-16 px-6 lg:px-20 bg-slate-900">
        <h2 className="text-3xl font-semibold mb-10">Top Creators</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {[...Array(8)].map((_, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <Card />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer / Spline Viewer Section */}
      <footer className="relative w-full h-screen bg-slate-800">
        <script type="module" src="https://unpkg.com/@splinetool/viewer@1.9.82/build/spline-viewer.js"></script>
        <spline-viewer
          url="https://prod.spline.design/A1VkaKD7TMyunAGY/scene.splinecode"
          className="absolute inset-0 w-full h-full"
        ></spline-viewer>
        <div className="absolute bottom-0 w-full text-center pb-4 text-gray-400 text-sm">
          © {new Date().getFullYear()} Subscribe. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
