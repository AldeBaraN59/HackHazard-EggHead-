'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import HomeNavbar from './HomeNavbar';
import Card from '../components/card.jsx';
import { motion } from 'framer-motion';
import { AnimatedTestimonials } from '@/components/ui/animated-testimonials';

export default function Home() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  const testimonials = [
    {
      name: "Alice Johnson",
      designation: "Content Creator",
      quote: "Fundtron has completely changed how I connect with my audience. The support I receive helps me keep creating full-time.",
      src: "/WomanA.jpg"
    },
    {
      name: "Michael Chen",
      designation: "Tech Reviewer",
      quote: "I love how easy it is for my community to support me through this platform. The UI is sleek and efficient.",
      src: "/GuyA.jpg"
    },
    {
      name: "Sofia Martinez",
      designation: "Fitness Coach",
      quote: "This platform has streamlined my subscriber interactions. Highly recommended for creators looking to grow sustainably.",
      src: "/GuyB.jpg"
    }
  ];

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
            Welcome to <span className="text-teal-400">FundTron</span>
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

      <section className="py-20 px-6 lg:px-20 bg-slate-800 text-center">
        <h2 className="text-3xl font-bold mb-10">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-10 text-left">
          {[
            { title: "Create an Account", desc: "Sign up and set up your creator profile in minutes." },
            { title: "Share Your Work", desc: "Post content, grow your followers, and keep them engaged." },
            { title: "Get Support", desc: "Receive subscriptions, donations, and more from your fans." },
          ].map((item, i) => (
            <motion.div
              key={i}
              whileInView={{ y: [20, 0], opacity: [0, 1] }}
              transition={{ duration: 0.5, delay: 0.2 * i }}
              viewport={{ once: true }}
              className="bg-slate-700 p-6 rounded-xl"
            >
              <h3 className="text-xl font-semibold text-teal-400 mb-3">{item.title}</h3>
              <p className="text-gray-300">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
      <section className="bg-slate-900 py-16 px-6 lg:px-20 text-center">
        <h2 className="text-3xl font-bold mb-12">Join Our Growing Community</h2>
        <div className="flex flex-wrap justify-center gap-10">
          {[
            { label: "Creators", value: "2.4K+" },
            { label: "Monthly Visitors", value: "75K+" },
            { label: "Transactions", value: "$500K+" },
          ].map((stat, i) => (
            <motion.div
              key={i}
              whileInView={{ opacity: [0, 1], scale: [0.9, 1] }}
              transition={{ duration: 0.5 }}
              className="text-white text-center"
            >
              <p className="text-4xl font-bold text-teal-400">{stat.value}</p>
              <p className="text-gray-300">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>
     
      <section>
        <AnimatedTestimonials testimonials={testimonials} />
      </section>

      <section className="bg-teal-800 text-white py-12 px-6 lg:px-20 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to start your creator journey?</h2>
        <p className="text-lg mb-6">Sign up now and turn your passion into income.</p>
        <button className="px-8 py-3 bg-white text-teal-600 font-semibold rounded-full hover:bg-gray-200 transition">
          Join Now
        </button>
      </section>

      {/* Footer / Spline Viewer Section */}
      <footer className="relative w-full h-screen bg-slate-800">
        <script type="module" src="https://unpkg.com/@splinetool/viewer@1.9.82/build/spline-viewer.js"></script>
        <spline-viewer
          url="https://prod.spline.design/A1VkaKD7TMyunAGY/scene.splinecode"
          className="absolute inset-0 w-full h-full"
        ></spline-viewer>
        <div className="absolute bottom-0 w-full text-center pb-4 text-gray-400 text-sm">
          © {new Date().getFullYear()} FundTron. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
