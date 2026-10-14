'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { executives } from '@/lib/members-data';

export const Executives = () => {
  const [president, vicePresident, secretary] = executives;

  return (
    <section aria-labelledby="leadership-heading" className="px-6 md:px-10 max-w-6xl mx-auto py-12 border-t border-black/5">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.8 }}
        className="flex flex-col mb-6"
      >
        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#6b6b6b] mb-2">
          03. Our Leadership
        </span>
        <h2 id="leadership-heading" className="text-2xl md:text-3xl font-medium tracking-tight leading-tight">
          The minds behind <br />
          <span className="text-gray-400 font-pixel uppercase text-xl">the innovation.</span>
        </h2>
        <p className="mt-3 text-sm text-[#6b6b6b] max-w-xl leading-relaxed">
          Led by President {president?.name}, Vice President {vicePresident?.name}, and Secretary {secretary?.name}.{' '}
          <Link href="/about" className="underline font-semibold text-[#1c1c1c]">
            Read more about the BIUST Innovation Club and past executives
          </Link>
          .
        </p>
      </motion.div>

      <ul className="grid grid-cols-1 lg:grid-cols-12 gap-3 list-none">
        {/* President */}
        {president && (
          <motion.li
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="lg:col-span-4 group relative overflow-hidden rounded-[1.5rem] bg-gray-100 aspect-square lg:aspect-auto lg:h-full min-h-[280px]"
          >
            <article className="w-full h-full">
              <img
                src={president.image}
                alt={`${president.name}, ${president.role} of the BIUST Innovation Club`}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-6 text-white">
                <span className="text-[9px] font-mono uppercase tracking-widest opacity-70 mb-1">{president.role}</span>
                <h3 className="text-2xl font-bold tracking-tighter">{president.name}</h3>
                {president.quote && (
                  <p className="text-white/60 text-[10px] mt-2 max-w-50 italic leading-relaxed">"{president.quote}"</p>
                )}
              </div>
            </article>
          </motion.li>
        )}

        {/* Right side grid */}
        <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-3">
          {/* Vice President */}
          {vicePresident && (
            <motion.li
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="col-span-2 group relative overflow-hidden rounded-[1.2rem] bg-gray-100 h-[220px] md:h-[240px]"
            >
              <article className="w-full h-full">
                <img
                  src={vicePresident.image}
                  alt={`${vicePresident.name}, ${vicePresident.role} of the BIUST Innovation Club`}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex flex-col justify-end p-5 text-white">
                  <span className="text-[9px] font-mono uppercase tracking-widest opacity-70 mb-1">{vicePresident.role}</span>
                  <h3 className="text-lg font-bold">{vicePresident.name}</h3>
                </div>
              </article>
            </motion.li>
          )}

          {/* Secretary */}
          {secretary && (
            <motion.li
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="group relative overflow-hidden rounded-[1.2rem] bg-gray-100 aspect-square md:aspect-auto md:h-[240px]"
            >
              <article className="w-full h-full">
                <img
                  src={secretary.image}
                  alt={`${secretary.name}, ${secretary.role} of the BIUST Innovation Club`}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex flex-col justify-end p-4 text-white">
                  <span className="text-[8px] font-mono uppercase tracking-widest opacity-70 mb-1">{secretary.role}</span>
                  <h3 className="text-sm font-bold leading-tight">{secretary.name}</h3>
                </div>
              </article>
            </motion.li>
          )}

          {/* About link */}
          <motion.li
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', damping: 15, delay: 0.5 }}
            className="group relative overflow-hidden rounded-[1.2rem] bg-[#1c1c1c] aspect-square md:aspect-auto md:h-[240px] flex flex-col items-center justify-center text-center p-4 hover:bg-[#363636] transition-all duration-300 border-2 border-[#1c1c1c] shadow-[3px_3px_0_#555]"
          >
            <Link href="/about" className="flex flex-col items-center justify-center" aria-label="About the BIUST Innovation Club and former executives">
              <div className="mb-2 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white group-hover:bg-white group-hover:text-black transition-colors">
                <ArrowUpRight size={16} />
              </div>
              <span className="text-white font-bold text-xs tracking-tight leading-tight">About the<br />Club</span>
              <span className="text-white/40 text-[7px] mt-1 font-mono uppercase">History + execs</span>
            </Link>
          </motion.li>

          {/* Full Squad link */}
          <motion.li
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', damping: 15, delay: 0.6 }}
            className="group relative overflow-hidden rounded-[1.2rem] bg-[#fbd35a] aspect-square md:aspect-auto md:h-[240px] flex flex-col items-center justify-center text-center p-4 hover:bg-[#f2c744] transition-all duration-300 border-2 border-[#1c1c1c] shadow-[3px_3px_0_#1c1c1c]"
          >
            <Link href="/members-view" className="flex flex-col items-center justify-center" aria-label="Meet the full BIUST Innovation Club squad">
              <div className="mb-2 w-8 h-8 rounded-full bg-[#1c1c1c]/10 flex items-center justify-center text-[#1c1c1c] group-hover:bg-[#1c1c1c] group-hover:text-white transition-colors">
                <ArrowUpRight size={16} />
              </div>
              <span className="text-[#1c1c1c] font-bold text-xs tracking-tight leading-tight">Meet the<br />Full Squad</span>
              <span className="text-[#1c1c1c]/50 text-[7px] mt-1 font-mono uppercase">Directory</span>
            </Link>
          </motion.li>
        </div>
      </ul>
    </section>
  );
};
