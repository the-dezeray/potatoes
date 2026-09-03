'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { GitBranch, Search, FileCode2, Sparkles } from 'lucide-react';

/*
  Easter egg page. The leaderboard/applications are public, but this one
  hides in plain sight.
*/

export default function HuntPage() {
  const steps = [
    {
      icon: GitBranch,
      title: 'Start with the surface',
      body: 'Every repository has a face. Read it before you dig. Sometimes a normal page holds the first nudge.',
    },
    {
      icon: Search,
      title: 'History never forgets',
      body: 'Commits, branches, reflogs — the older the trail, the easier it is to miss. Look at everything, not just the obvious.',
    },
    {
      icon: FileCode2,
      title: 'It is all just text',
      body: 'Encoding, metadata and media hide more than you think. Ask the files what they are really made of.',
    },
    {
      icon: Sparkles,
      title: 'Unlock with our name',
      body: 'When everything else points one way, remember which club runs this. Our very name is the key to the final gate.',
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <Navbar />

      <main className="px-6 md:px-10 pt-16 pb-16 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <span className="text-xs font-bold uppercase tracking-[0.3em] text-[#844B3E] mb-4 inline-block bg-[#fbd35a] border-2 border-[#1c1c1c] shadow-[4px_4px_0_#1c1c1c] px-4 py-2 rounded-2xl">
            Innovation Club · Members
          </span>
          <h1 className="text-5xl md:text-6xl font-medium tracking-tight leading-[1.05] mb-6 font-pixel-triangle">
            How our little experiments get built.
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
            Before anything ships, a small group of us assemble a throwaway project
            to test an idea. It usually looks unfinished and a little messy — but
            the pieces inside are always intentional. A good scavenger knows the
            mess is the map.
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="bg-[#FAF6EF] border-2 border-[#1c1c1c] shadow-[6px_6px_0_#1c1c1c] rounded-[2rem] p-7"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#8ecfc8] border-2 border-[#1c1c1c] mb-5">
                <step.icon className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-semibold mb-2">{step.title}</h2>
              <p className="text-muted-foreground leading-relaxed">{step.body}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mt-12 p-6 border-2 border-dashed border-[#1c1c1c]/40 rounded-2xl text-sm text-muted-foreground italic"
        >
          Everything you need is already here. Check the repository.
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
