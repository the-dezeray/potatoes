'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { InfiniteSlider } from '@/components/motion-primitives/infinite-slider';

export const PartnersSlider = () => (
  <motion.section
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 1 }}
    className="px-6 md:px-10 max-w-7xl mx-auto py-16"
  >
    <div className="text-center mb-8">
      <span className="text-xs font-bold uppercase tracking-widest text-[#6b6b6b]">Our Partners</span>
      <h3 className="text-xl md:text-2xl font-medium mt-2 text-[#555555]">
        Trusted by industry leaders
      </h3>
    </div>
    <InfiniteSlider gap={48} speed={80} reverse className="py-8">
      <img src="/nvidia.png" alt="NVIDIA logo" className="h-[80px] w-auto opacity-60 hover:opacity-100 transition-opacity" />
      <img src="/fortinet.webp" alt="Fortinet logo" className="h-[80px] w-auto opacity-60 hover:opacity-100 transition-opacity" />
      <img src="/github.webp" alt="GitHub logo" className="h-[80px] w-auto opacity-60 hover:opacity-100 transition-opacity" />
      <img src="/spectrum.png" alt="Spectrum logo" className="h-[80px] w-auto opacity-60 hover:opacity-100 transition-opacity" />
      <img src="/debswana.png" alt="Debswana logo" className="h-[80px] w-auto opacity-60 hover:opacity-100 transition-opacity" />
      <img src="/bip.webp" alt="BIP logo" className="h-[80px] w-auto opacity-60 hover:opacity-100 transition-opacity" />
    </InfiniteSlider>
  </motion.section>
);
