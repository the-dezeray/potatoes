'use client';

import React from 'react';
import { ArrowUpRight, Play, Github } from 'lucide-react';
import { motion } from 'framer-motion';

const services = [
  {
    title: 'Build Projects',
    description: 'We develop real-world apps and digital tools that move the needle.',
    icon: <Github className="w-6 h-6" />,
  },
  {
    title: 'Solve Campus Problems',
    description: 'Identifying local challenges and building rapid prototypes to fix them.',
    icon: <div className="font-bold text-xl">🧩</div>,
  },
  {
    title: 'Host Hack Nights',
    description: 'Weekly high-energy coding sessions and rapid idea validation.',
    icon: <Play className="w-6 h-6" />,
  },
  {
    title: 'Collaborate',
    description: 'Bridging the gap between students, startups, and industry leaders.',
    icon: <ArrowUpRight className="w-6 h-6" />,
  },
];

export const WhatWeDo = () => (
  <section className="px-6 md:px-10 max-w-7xl mx-auto py-24 border-t border-black/5">
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="flex flex-col mb-16"
    >
      <span className="text-xs font-bold uppercase tracking-[0.3em] text-[#6b6b6b] mb-4">
        02. What We Do
      </span>
      <h2 className="text-4xl md:text-5xl font-medium tracking-tight">
        Turning caffeine into <br />
        <span className="text-gray-400 font-pixel uppercase text-3xl">functional code.</span>
      </h2>
    </motion.div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {services.map((service, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: index * 0.1 }}
          className="group p-8 bg-[#FAF6EF] border-2 border-[#1c1c1c] shadow-[4px_4px_0_#1c1c1c] rounded-[2rem] hover:bg-[#1c1c1c] hover:text-white transition-all duration-500 flex flex-col justify-between min-h-70"
        >
          <div className="w-12 h-12 bg-[#fbd35a] rounded-2xl flex items-center justify-center text-[#1c1c1c] shadow-sm group-hover:scale-110 transition-transform duration-500">
            {service.icon}
          </div>
          <div>
            <h3 className="text-xl font-bold mb-3 tracking-tight">{service.title}</h3>
            <p className="text-[#555555] group-hover:text-gray-300 leading-relaxed text-sm">
              {service.description}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  </section>
);
