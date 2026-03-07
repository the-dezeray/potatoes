'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Footer } from '@/components/footer';
import { LandingHero } from '@/components/landing-hero';
import { WhatWeDo } from '@/components/what-we-do';
import { Executives } from '@/components/executives';
import { ProjectsSection } from '@/components/projects-section';
import { CallToAction } from '@/components/call-to-action';
import { PartnersSlider } from '@/components/partners-slider';
import { PassionStats } from '@/components/passion-stats';
import { ClosingSection } from '@/components/closing-section';
import { OffersSection } from '@/components/offers-section';

export default function Portfolio() {
  const containerRef = useRef<HTMLDivElement>(null);
  const lastSectionRef = useRef<HTMLDivElement>(null);

  // Track overall scroll progress of the entire page container
  const { scrollYProgress } = useScroll({ container: containerRef });

  // Multi-stop background color journey aligned with the Neo-Brutalist Retro theme:
  // Hero (cream) → Partners/WhatWeDo (teal-tinted) → Projects (cream) → CTA (peach-tinted)
  const backgroundColor = useTransform(
    scrollYProgress,
    [0, 0.15, 0.35, 0.62, 1],
    ['#FAF6EF', '#EDF9F7', '#FAF6EF', '#FAF6EF', '#FDF0EC']
  );

  const textColor = useTransform(
    scrollYProgress,
    [0, 1],
    ['#1C1C1C', '#1C1C1C']
  );

  return (
    <motion.div
      ref={containerRef}
      className="h-screen overflow-y-auto overflow-x-hidden selection:bg-[#8ecfc8] selection:text-[#1c1c1c]"
      style={{ backgroundColor, color: textColor }}
    >
      <LandingHero scrollContainerRef={containerRef} />

      <PartnersSlider />

      <main>
        <WhatWeDo />
        <Executives />
        <ProjectsSection />
        <PassionStats />
        <div className="py-8 px-4 flex justify-center">
          <OffersSection />
        </div>
      </main>

      <Footer />
    </motion.div>
  );
}
