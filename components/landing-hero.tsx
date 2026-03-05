'use client';

import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { TextScramble } from '@/components/motion-primitives/text-scramble';
import { MemberGrid } from '@/components/member-grid';

export const LandingHero = () => {
  return (
    <section className="relative isolate min-h-svh pb-16 bg-[#FAF6EF] overflow-hidden">

      {/* Soft background gradient */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#FAF6EF] via-white to-[#F3EFE7]" />

      {/* subtle background texture image */}
      <motion.img
        src="/haa.jpeg"
        alt=""
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.12 }}
        transition={{ duration: 1.5 }}
        className="absolute inset-0 w-full h-full object-cover blur-xl -z-10"
      />

      <div className="px-6 md:px-10 max-w-7xl mx-auto pt-24">

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          {/* LEFT COLUMN */}
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
              className="text-5xl md:text-6xl lg:text-[6.5rem] leading-[0.85] font-pixel-circle tracking-tight"
            >
              Biust <br />
              <span className="text-[#8ecfc8]">Innovation</span> <br />
              Club
            </motion.h1>

            {/* Buttons */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex items-center gap-4 mt-10"
            >
              <button className="group flex items-center gap-2 bg-[#fbd35a] text-[#1c1c1c] border-2 border-[#1c1c1c] px-6 py-3 text-sm font-bold hover:bg-[#F2C744] transition-all shadow-[3px_3px_0_#1c1c1c]">
                Join <ArrowUpRight size={16} />
              </button>

              <button className="group border-2 border-[#1c1c1c] bg-transparent text-[#1c1c1c] px-6 py-3 text-sm font-bold hover:bg-[#1c1c1c] hover:text-white transition-all shadow-[3px_3px_0_#1c1c1c]">
                Work with us
              </button>
            </motion.div>

            {/* Member Grid */}
            <div className="mt-12">
              <MemberGrid />
            </div>

          </div>

          {/* RIGHT COLUMN — IMAGE SHOWCASE */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">

            <motion.div
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9 }}
              className="relative w-full max-w-[420px] group"
            >

              {/* Main Image */}
              <div className="relative aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="/other.png"
                  alt="Club Activity"
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700"
                />
              </div>

              {/* Floating Glass Card */}
              <div className="absolute -bottom-8 -left-8 backdrop-blur-xl bg-white/30 border border-white/40 rounded-2xl p-6 shadow-xl max-w-[220px]">

                <p className="text-sm font-semibold leading-snug">
                  Based in Botswana. <br />
                  Driving the future through collaboration and rapid prototyping.
                </p>

              </div>

            </motion.div>

          </div>

        </div>

      </div>
    </section>
  );
};