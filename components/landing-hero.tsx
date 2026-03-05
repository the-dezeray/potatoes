'use client';
import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { TextScramble } from '@/components/motion-primitives/text-scramble';
import { MemberGrid } from '@/components/member-grid';

export const LandingHero = () => {
  return (
    <section
      className="relative isolate min-h-svh pb-16 overflow-hidden"
      style={{
        backgroundImage: "url('/image10.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 -z-10 bg-black/70" />

      <div className="px-6 md:px-10 max-w-7xl mx-auto pt-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

          {/* LEFT COLUMN — Heading + tagline + member grid */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            {/* Tagline */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <TextScramble
                className="text-xs font-pixel-grid tracking-[0.25em] bg-black text-white px-3 py-1 mb-6 inline-block"
                duration={1.2}
              >
                We build and craft digital solutions
              </TextScramble>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-5xl md:text-6xl lg:text-[6.5rem] leading-[0.85] font-pixel-circle tracking-tight text-white"
            >
              Biust <br />
              <span className="text-[#fbd35a]">Innovation</span> <br />
              Club
            </motion.h1>

            {/* Member Grid */}
            <div className="mt-30">
              <MemberGrid />
            </div>
          </div>

          {/* RIGHT COLUMN — Stat card + buttons */}
          <div className="lg:col-span-5 flex flex-col items-start lg:items-end justify-between gap-8 lg:pt-70">

            {/* Botswana card — brutalist style matching the theme */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="w-full max-w-[320px]"
            >
              {/* Brutalist label bar */}
              <div className="bg-[#fbd35a] border-2 border-[#fbd35a] px-3 py-1 inline-block mb-0">
                <span className="text-[10px] font-pixel-grid tracking-[0.2em] text-[#1c1c1c] font-bold uppercase">
                  Est. Botswana
                </span>
              </div>

              {/* Main card body */}
              <div
                className="border-2 border-white/40 bg-black/60 px-5 py-5 shadow-[4px_4px_0_#fbd35a]"
              >
                <p className="text-white text-sm font-pixel-grid leading-relaxed tracking-wide">
                  Driving the future through<br />
                  <span className="text-[#fbd35a] font-bold">collaboration</span> and<br />
                  rapid <span className="text-[#fbd35a] font-bold">prototyping.</span>
                </p>

                {/* Decorative divider */}
                <div className="mt-4 flex items-center gap-2">
                  <div className="h-px flex-1 bg-white/20" />
                  <div className="w-1.5 h-1.5 bg-[#fbd35a]" />
                  <div className="h-px flex-1 bg-white/20" />
                </div>

                <p className="mt-3 text-[10px] tracking-[0.2em] text-white/40 font-pixel-grid uppercase">
                  BIUST — Innovation Hub
                </p>
              </div>
            </motion.div>

            {/* Buttons — stacked right-aligned */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row lg:flex-col xl:flex-row items-start lg:items-end gap-3"
            >
              <button className="group flex items-center gap-2 bg-[#fbd35a] text-[#1c1c1c] border-2 border-[#1c1c1c] px-6 py-3 text-sm font-bold hover:bg-[#F2C744] transition-all shadow-[3px_3px_0_#fbd35a] hover:shadow-[5px_5px_0_#fbd35a] hover:-translate-x-0.5 hover:-translate-y-0.5">
                Join <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
              <button className="group border-2 border-white bg-transparent text-white px-6 py-3 text-sm font-bold hover:bg-white hover:text-[#1c1c1c] transition-all shadow-[3px_3px_0_rgba(255,255,255,0.4)] hover:shadow-[5px_5px_0_rgba(255,255,255,0.4)] hover:-translate-x-0.5 hover:-translate-y-0.5">
                Work with us
              </button>
            </motion.div>

          </div>
        </div>
      </div>
    </section>
  );
};