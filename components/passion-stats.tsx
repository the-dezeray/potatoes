'use client';

import React from 'react';
import { Play, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export const PassionStats = () => (
  <section className="px-6 md:px-10 max-w-7xl mx-auto py-24 grid md:grid-cols-2 gap-16 md:gap-24 items-center">
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <span className="text-xs font-bold uppercase tracking-widest text-[#6b6b6b]">Passion</span>
      <h2 className="text-3xl md:text-4xl font-medium mt-4 mb-8">
        We love solving problems that make a real impact on our campus and beyond.
      </h2>
      <div className="relative rounded-3xl overflow-hidden aspect-video bg-gray-100 shadow-sm">
        <img src="/api/placeholder/800/450" alt="Video cover" className="object-cover w-full h-full" />
        <button className="absolute inset-0 flex items-center justify-center group">
          <div className="w-16 h-16 bg-[#fbd35a] border-2 border-[#1c1c1c] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-xl">
            <Play fill="#1c1c1c" size={24} className="ml-1" />
          </div>
        </button>
      </div>
    </motion.div>

    <div className="flex flex-col justify-center gap-12 md:pl-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <span className="text-5xl md:text-6xl font-medium font-pixel-grid   ">+7</span>
        <p className="text-[#555555] mt-3 text-lg">Projects completed for global clients across various industries.</p>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <span className="text-5xl md:text-6xl font-medium">+102</span>
        <p className="text-[#555555] mt-3 text-lg">Happy clients who have seen significant growth in their digital presence.</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <Link href="/leaderboard">
          <button className="group flex items-center gap-2 border-2 border-[#1c1c1c] bg-transparent text-[#1c1c1c] px-6 py-3 text-sm font-bold hover:bg-[#fbd35a] transition-all shadow-[3px_3px_0_#1c1c1c] hover:shadow-[5px_5px_0_#1c1c1c] hover:-translate-x-0.5 hover:-translate-y-0.5">
            View Leaderboard <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </Link>
      </motion.div>
    </div>
  </section>
);
