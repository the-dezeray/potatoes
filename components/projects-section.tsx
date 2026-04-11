'use client';

import React from 'react';
import { ArrowUpRight, Github, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const projects = [
  {
    title: 'Smart Study',
    category: 'Full-Stack Platform',
    image: '/study.webp',
    tech: ['Next.js', 'Firebase', 'Tailwind'],
    problem:
      'Many students struggle to effectively plan and manage their study schedules. Smart Study helps students organize their study sessions, track progress, and maintain consistent learning habits.',
    links: { github: '#', demo: 'https://smartstudy-26356.web.app/' },
  },
  {
    title: 'BIUST Insight',
    category: 'Mobile App',
    image: '/insight.webp',
    tech: ['React Native', 'Node.js', 'PostgreSQL'],
    problem:
      'The current BIUST library management system does not include access to past tests and laboratory materials. BIUST Insight provides a centralized repository where students can easily access, share, and contribute academic resources in one place.',
    links: { github: '#', demo: '#' },
  },
  {
    title: 'Club Portals',
    category: 'Internal Tool',
    image: '/club.webp',
    tech: ['Next.js', 'TypeScript', 'Firestore'],
    problem:
      'Many student clubs manage operations across scattered spreadsheets and chat groups, making it difficult to track tasks, meetings, deadlines, and resources. Club Portals centralizes these operations into a single platform tailored for each club.',
    links: { github: '#', demo: '#' },
  },
  {
    title: 'Botsat-1 Tracker',
    category: 'Public Tool',
    image: '/bot.webp',
    tech: ['Next.js', 'TypeScript', 'Firestore'],
    problem:
      'There was no accessible public interface for tracking the launch and status of Botsat-1. This tool provides a simple platform for the public to follow mission updates and satellite information.',
    links: { github: 'https://github.com/the-dezeray/mophi', demo: 'https://the-dezeray.github.io/mophi/' },
  },
  {
    title: "Pioneering Ventures Society",
    category: "Club Website",
    image: "/pvs.webp",
    tech: ["Next.js", "Tailwind CSS", "Vercel"],
    problem: "The Pioneering Ventures Society needed a modern, engaging website to showcase their mission, projects, and events. The new site provides a dynamic platform for the club to connect with members and the broader community.",
    links: { github: "#", demo: "https://pioneer-ventures-society.org/" }
  }
];

export const ProjectsSection = () => (
  <section className="px-6 md:px-10 max-w-7xl mx-auto py-24 border-t border-black/5">
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.8 }}
      className="flex flex-col mb-16"
    >
      <span className="text-xs font-bold uppercase tracking-[0.3em] text-[#6b6b6b] mb-4">
        04. Selected Works
      </span>
      <h2 className="text-4xl md:text-5xl font-medium tracking-tight">
        Recent solutions <br />
        <span className="text-gray-400 font-pixel uppercase text-3xl">shipped to production.</span>
      </h2>
    </motion.div>

    <div className="space-y-32">
      {projects.map((project, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="grid lg:grid-cols-2 gap-12 items-center group"
        >
          <div className={`relative overflow-hidden rounded-[2rem] bg-gray-100 aspect-video ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
            <img src={project.image} alt={project.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute top-6 right-6 flex gap-2">
              <a href={project.links.github} className="p-3 bg-white/90 backdrop-blur-sm rounded-full hover:bg-black hover:text-white transition-all shadow-sm">
                <Github size={20} />
              </a>
              <a href={project.links.demo} className="p-3 bg-white/90 backdrop-blur-sm rounded-full hover:bg-black hover:text-white transition-all shadow-sm">
                <ArrowUpRight size={20} />
              </a>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-[#6b6b6b] mb-2 block">{project.category}</span>
              <h3 className="text-3xl md:text-4xl font-bold tracking-tighter">{project.title}</h3>
            </div>
            <div className="space-y-4">
              <div>
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#6b6b6b] mb-2">The Problem</h4>
                <p className="text-[#555555] leading-relaxed max-w-sm">{project.problem}</p>
              </div>
              <div>
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#6b6b6b] mb-2">Tech Stack</h4>
                <div className="flex flex-wrap gap-2">
                  {project.tech.map((t, i) => (
                    <span key={i} className="px-3 py-1 bg-[#8ecfc8]/30 border border-[#1c1c1c]/20 text-[#1c1c1c] rounded-full text-[10px] font-bold uppercase tracking-wider">{t}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>

    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: 0.3 }}
      className="mt-32 flex justify-center"
    >
      <Link
        href="/demo"
        className="group relative px-10 py-5 bg-black text-white rounded-full flex items-center gap-4 transition-all hover:pr-12"
      >
        <span className="text-sm font-bold uppercase tracking-[0.2em]">View All Projects</span>
        <div className="absolute right-5 group-hover:right-7 transition-all">
          <Plus size={20} />
        </div>
      </Link>
    </motion.div>
  </section>
);
