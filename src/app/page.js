'use client';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Wallet, ConnectWallet } from '@coinbase/onchainkit/wallet';
import HomeNavbar from './HomeNavbar';
import Card from '../components/card.jsx';

// Lazy load Spline Viewer component (commented out)
/*
function LazySpline({ url }) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/@splinetool/viewer@1.9.82/build/spline-viewer.js';
    script.type = 'module';
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="w-full h-full flex justify-center items-center">
      {isVisible ? (
        <spline-viewer url={url}></spline-viewer>
      ) : (
        <p className="text-white text-xl">Loading 3D experience...</p>
      )}
    </div>
  );
}
*/

export default function Home() {
  return (
    <div className='bg-slate-800'>
      {/* Navbar + Wallet Connect */}
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
      <div className='w-screen h-screen bg-slate-800 flex justify-center items-start relative'>
        <Image
          src="/headphones-removebg-preview.png"
          alt="Responsive image"
          width={300}
          height={300}
          className='absolute left-0 bottom-52'
        />
        <div className='h-screen flex flex-col justify-center items-start'>
          <h1 className='text-white text-7xl'>Welcome to Subscribe</h1>
          <p className='text-white text-3xl'>Your one stop platform for supporting your beloved creators</p>
        </div>
      </div>

      {/* Card Grid Section */}
      <div className='w-screen min-h-screen bg-slate-800 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 px-10 py-20'>
        {[...Array(8)].map((_, idx) => (
          <div key={idx}>
            <Card />
          </div>
        ))}
      </div>

      {/* Lazy Loaded Spline Viewer Sections (commented out) */}
      {/*
      <div className='w-screen h-screen bg-slate-800'>
        <LazySpline url="https://prod.spline.design/kY86B9CMWLu99gkE/scene.splinecode" />
      </div>

      <div className='w-screen h-screen bg-slate-800'>
        <LazySpline url="https://prod.spline.design/A1VkaKD7TMyunAGY/scene.splinecode" />
      </div>
      */}
    </div>
  );
}
