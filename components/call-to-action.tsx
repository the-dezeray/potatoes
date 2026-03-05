'use client';

import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';

export const CallToAction = () => (
  <motion.section
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8 }}
    className="px-6 md:px-10 max-w-7xl mx-auto py-32"
  >
    <div className="bg-[#f4c3b3] border-2 border-[#1c1c1c] shadow-[6px_6px_0_#1c1c1c] rounded-[3rem] p-8 md:p-20 overflow-hidden relative group">
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-[#1c1c1c]/5 rounded-full blur-3xl group-hover:bg-[#1c1c1c]/10 transition-colors duration-700" />

      <div className="relative z-10 flex flex-col items-center text-center">
        <span className="text-xs font-bold uppercase tracking-[0.3em] text-[#844B3E] mb-6">
          Ready to start?
        </span>
        <h2 className="text-4xl md:text-7xl font-medium tracking-tight mb-10 max-w-3xl leading-[1.1] text-[#5A2E26]">
          Have a project in mind? <br />
          <span className="text-[#844B3E]">Let's build it together.</span>
        </h2>

        <a
          href="mailto:hello@biustinnovation.com"
          className="group/btn relative inline-flex items-center gap-4 bg-[#fbd35a] text-[#1c1c1c] border-2 border-[#1c1c1c] shadow-[4px_4px_0_#1c1c1c] px-10 py-5 overflow-hidden transition-all hover:pr-14 hover:bg-[#F2C744]"
        >
          <span className="font-semibold text-lg relative z-10">Get in touch</span>
          <ArrowUpRight
            className="relative z-10 transition-all duration-300 group-hover/btn:translate-x-2 group-hover/btn:-translate-y-1"
            size={24}
          />
        </a>
      </div>
    </div>
  </motion.section>
);
