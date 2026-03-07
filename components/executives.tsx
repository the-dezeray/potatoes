'use client';

import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';

const leaders = [
  { role: 'President', name: 'Phemelo Mokgosi', image: '/club-members/p.webp', quote: 'Pioneering the next wave of tech in BW.' },
  { role: 'Vice President', name: 'Desiree Chingwaru', image: '/club-members/2.webp' },
  { role: 'HR Manager', name: 'Lumbiel A', image: '/club-members/3.webp' },
  { role: 'Treasurer', name: 'Thandiswa okuntle', image: '/club-members/l.webp' },
  { role: 'Secretary', name: 'Simoen Uden', image: '/club-members/s.webp' },
];

export const Executives = () => (
  <section className="px-6 md:px-10 max-w-6xl mx-auto py-12 border-t border-black/5">
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.8 }}
      className="flex flex-col mb-10"
    >
      <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#6b6b6b] mb-2">
        03. Our Leadership
      </span>
      <h2 className="text-2xl md:text-3xl font-medium tracking-tight leading-tight">
        The minds behind <br />
        <span className="text-gray-400 font-pixel uppercase text-xl">the innovation.</span>
      </h2>
    </motion.div>

    <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
      {/* President */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="lg:col-span-4 group relative overflow-hidden rounded-[1.5rem] bg-gray-100 aspect-square lg:aspect-auto lg:h-full"
      >
        <img src={leaders[0].image} alt={leaders[0].name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-6 text-white">
          <span className="text-[9px] font-mono uppercase tracking-widest opacity-70 mb-1">{leaders[0].role}</span>
          <h3 className="text-2xl font-bold tracking-tighter">{leaders[0].name}</h3>
          <p className="text-white/60 text-[10px] mt-2 max-w-50 italic leading-relaxed">"{leaders[0].quote}"</p>
        </div>
      </motion.div>

      {/* Right side grid */}
      <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-3">
        {/* Vice President */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="col-span-2 group relative overflow-hidden rounded-[1.2rem] bg-gray-100 aspect-[16/9] md:aspect-auto"
        >
          <img src={leaders[1].image} alt={leaders[1].name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex flex-col justify-end p-5 text-white">
            <span className="text-[9px] font-mono uppercase tracking-widest opacity-70 mb-1">{leaders[1].role}</span>
            <h4 className="text-lg font-bold">{leaders[1].name}</h4>
          </div>
        </motion.div>

        {/* HR, Treasurer, Secretary */}
        {[leaders[2], leaders[3], leaders[4]].map((leader, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
            className="group relative overflow-hidden rounded-[1.2rem] bg-gray-100 aspect-square"
          >
            <img src={leader.image} alt={leader.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex flex-col justify-end p-4 text-white">
              <span className="text-[8px] font-mono uppercase tracking-widest opacity-70 mb-1">{leader.role}</span>
              <h4 className="text-sm font-bold leading-tight">{leader.name}</h4>
            </div>
          </motion.div>
        ))}

        {/* Full Squad link */}
        <motion.a
          href="/members-view"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ type: 'spring', damping: 15, delay: 0.6 }}
          className="group relative overflow-hidden rounded-[1.2rem] bg-[#1c1c1c] aspect-square flex flex-col items-center justify-center text-center p-4 hover:bg-[#363636] transition-all duration-300 border-2 border-[#1c1c1c] shadow-[3px_3px_0_#555]"
        >
          <div className="mb-2 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white group-hover:bg-white group-hover:text-black transition-colors">
            <ArrowUpRight size={16} />
          </div>
          <span className="text-white font-bold text-xs tracking-tight leading-tight">Meet the<br />Full Squad</span>
          <span className="text-white/40 text-[7px] mt-1 font-mono uppercase">Directory</span>
        </motion.a>
      </div>
    </div>
  </section>
);
