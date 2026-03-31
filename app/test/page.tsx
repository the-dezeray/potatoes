'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ArrowUpRight, Play, Github, Twitter, Linkedin, Mail } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { InfiniteSlider } from '@/components/motion-primitives/infinite-slider';
import { TextScramble } from '@/components/motion-primitives/text-scramble';
import { Footer } from '@/components/footer';
import Link from 'next/link';


const Navbar = () => (
  <nav className="flex justify-between items-center py-6 px-6 md:px-10 max-w-7xl mx-auto w-full">

  
  </nav>
);
;

const WhatWeDo = () => {
  const services = [
    {
      title: "Build Projects",
      description: "We develop real-world apps and digital tools that move the needle.",
      icon: <Github className="w-6 h-6" />,
    },
    {
      title: "Solve Campus Problems",
      description: "Identifying local challenges and building rapid prototypes to fix them.",
      icon: <div className="font-bold text-xl">🧩</div>,
    },
    {
      title: "Host Hack Nights",
      description: "Weekly high-energy coding sessions and rapid idea validation.",
      icon: <Play className="w-6 h-6" />,
    },
    
      {
      title: "Collaborate",
      description: "Bridging the gap between students, startups, and industry leaders.",
      icon: <ArrowUpRight className="w-6 h-6" />,
    },
  ];

  return (
    <section className="px-6 md:px-10 max-w-7xl mx-auto py-24 border-t border-black/5">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex flex-col mb-16"
      >
        <span className="text-xs font-bold uppercase tracking-[0.3em] text-gray-400 mb-4">
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
            className="group p-8 bg-gray-50 rounded-[2rem] hover:bg-black hover:text-white transition-all duration-500 flex flex-col justify-between min-h-[280px]"
          >
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-black shadow-sm group-hover:scale-110 transition-transform duration-500">
              {service.icon}
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-3 tracking-tight">
                {service.title}
              </h3>
              <p className="text-gray-500 group-hover:text-gray-300 leading-relaxed text-sm">
                {service.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};


const Executives = () => {
  const leaders = [
    { role: "President", name: "Thabang Molefe", image: "/club-members/1.png", quote: "Pioneering the next wave of tech in BW." },
    { role: "Vice President", name: "Sarah Jenkins", image: "/club-members/2.png" },
    { role: "HR Manager", name: "Lame Botlhe", image: "/club-members/3.png" },
    { role: "Treasurer", name: "Kago Setilo", image: "/club-members/4.png" },
    { role: "Secretary", name: "Mpho Rama", image: "/club-members/5.png" },
  ];

  return (
    <section className="px-6 md:px-10 max-w-6xl mx-auto py-12 border-t border-black/5">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
        className="flex flex-col mb-10"
      >
        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400 mb-2">
          03. Our Leadership
        </span>
        <h2 className="text-2xl md:text-3xl font-medium tracking-tight leading-tight" >
          The minds behind <br />
          <span className="text-gray-400 font-pixel uppercase text-xl">the innovation.</span>
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
        {/* President - Slightly Narrower */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="lg:col-span-4 group relative overflow-hidden rounded-[1.5rem] bg-gray-100 aspect-square lg:aspect-auto lg:h-full"
        >
          <img src={leaders[0].image} alt={leaders[0].name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-6 text-white">
            <span className="text-[9px] font-mono uppercase tracking-widest opacity-70 mb-1">{leaders[0].role}</span>
            <h3 className="text-2xl font-bold tracking-tighter">{leaders[0].name}</h3>
            <p className="text-white/60 text-[10px] mt-2 max-w-[200px] italic leading-relaxed">"{leaders[0].quote}"</p>
          </div>
        </motion.div>

        {/* Right side Grid - More compact */}
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
              transition={{ duration: 0.5, delay: 0.3 + (i * 0.1) }}
              className="group relative overflow-hidden rounded-[1.2rem] bg-gray-100 aspect-square"
            >
              <img src={leader.image} alt={leader.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex flex-col justify-end p-4 text-white">
                 <span className="text-[8px] font-mono uppercase tracking-widest opacity-70 mb-1">{leader.role}</span>
                 <h4 className="text-sm font-bold leading-tight">{leader.name}</h4>
              </div>
            </motion.div>
          ))}
          
          {/* Club Members Link Card */}
          <motion.a 
            href="/members-view" 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", damping: 15, delay: 0.6 }}
            className="group relative overflow-hidden rounded-[1.2rem] bg-black aspect-square flex flex-col items-center justify-center text-center p-4 hover:bg-gray-900 transition-all duration-300 border border-white/5"
          >
             <div className="mb-2 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white group-hover:bg-white group-hover:text-black transition-colors">
               <ArrowUpRight size={16} />
             </div>
             <span className="text-white font-bold text-xs tracking-tight leading-tight">Meet the<br/>Full Squad</span>
             <span className="text-white/40 text-[7px] mt-1 font-mono uppercase">Directory</span>
          </motion.a>
        </div>
      </div>
    </section>
  );
};
const Projects = () => {
  const projects = [
    {
      title: "Smart Campus Hub",
      category: "Full-stack Platform",
      image: "/image.png",
      tech: ["Next.js", "Firebase", "Tailwind"],
      problem: "Students struggled to find real-time campus event updates and resource bookings in one place.",
      links: { github: "#", demo: "#" }
    },
    {
      title: "EcoTrack",
      category: "Mobile App",
      image: "/image11.png",
      tech: ["React Native", "Node.js", "PostgreSQL"],
      problem: "Inconsistent waste collection tracking led to overflowing bins and health hazards in local wards.",
      links: { github: "#", demo: "#" }
    },
    {
      title: "Club Portals",
      category: "Internal Tool",
      image: "/other.png",
      tech: ["Next.js", "TypeScript", "Firestore"],
      problem: "Club management was fragmented across spreadsheets and chat groups, making it hard to track tasks.",
      links: { github: "#", demo: "#" }
    }
    ,
    
        {
      title: "Botsat 1",
      category: "Internal Tool",
      image: "/other.png",
      tech: ["Next.js", "TypeScript", "Firestore"],
      problem: "Club management was fragmented across spreadsheets and chat groups, making it hard to track tasks.",
      links: { github: "#", demo: "#" }
    }
    ,
  ];

  return (
    <section className="px-6 md:px-10 max-w-7xl mx-auto py-24 border-t border-black/5">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
        className="flex flex-col mb-16"
      >
        <span className="text-xs font-bold uppercase tracking-[0.3em] text-gray-400 mb-4">
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
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
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
                <span className="text-xs font-mono uppercase tracking-widest text-black/40 mb-2 block">{project.category}</span>
                <h3 className="text-3xl md:text-4xl font-bold tracking-tighter">{project.title}</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-black/60 mb-2">The Problem</h4>
                  <p className="text-gray-500 leading-relaxed max-w-sm">{project.problem}</p>
                </div>

                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-black/60 mb-2">Tech Stack</h4>
                  <div className="flex flex-wrap gap-2">
                    {project.tech.map((t, i) => (
                      <span key={i} className="px-3 py-1 bg-gray-100 rounded-full text-[10px] font-bold uppercase tracking-wider">{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

const MemberGrid = () => {
  const [visibleMembers, setVisibleMembers] = useState<Set<number>>(new Set());
  const totalGridSlots = 24;
  const uniqueImageCount = 8; // Your available images (1.png through 8.png)
  
  useEffect(() => {
    if (visibleMembers.size >= totalGridSlots) return;

    const interval = setInterval(() => {
      setVisibleMembers((prev) => {
        if (prev.size >= totalGridSlots) {
          clearInterval(interval);
          return prev;
        }

        // Get list of slots still empty
        const emptySlots = Array.from({ length: totalGridSlots }, (_, i) => i)
          .filter(id => !prev.has(id));
        
        const randomIndex = Math.floor(Math.random() * emptySlots.length);
        const nextSlot = emptySlots[randomIndex];

        const newSet = new Set(prev);
        newSet.add(nextSlot);
        return newSet;
      });
    }, 300); // Quick fill for a high-energy feel
    
    return () => clearInterval(interval);
  }, [visibleMembers.size]);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-between items-end px-1">
        <span className="text-[10px] font-mono text-black/40 tracking-widest uppercase">
          Populating_Network
        </span>
        <span className="text-[10px] font-mono text-black/60 font-bold">
          {visibleMembers.size} / {totalGridSlots}
        </span>
      </div>

      <div className="grid grid-cols-6 grid-rows-4 w-80 h-48 gap-2">
        {Array.from({ length: totalGridSlots }).map((_, index) => {
          // This maps the 24 slots to images 1-8 repeatedly
          const imageNumber = (index % uniqueImageCount) + 1;
          const isVisible = visibleMembers.has(index);

          return (
            <div
              key={index}
              className="relative overflow-hidden border border-black/10 bg-gray-50/30 transition-all duration-500 aspect-square"
            >
              <img
                src={`/club-members/${imageNumber}.png`}
                alt={`Member slot ${index}`}
                className={`w-full h-full object-cover transition-all duration-700 ${
                  isVisible 
                    ? 'opacity-90 grayscale scale-100 blur-0' 
                    : 'opacity-0 scale-125 blur-sm'
                }`}
              />
              
              {/* Technical detail: A small dot in the corner of empty cells */}
              {!isVisible && (
                <div className="absolute inset-0 flex items-center justify-center">
                   <div className="w-1 h-1 bg-black/10 rounded-full" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
const CallToAction = () => (
  <motion.section 
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8 }}
    className="px-6 md:px-10 max-w-7xl mx-auto py-32"
  >
    <div className="bg-gray-50 rounded-[3rem] p-8 md:p-20 overflow-hidden relative group">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-black/5 rounded-full blur-3xl group-hover:bg-black/10 transition-colors duration-700" />
      
      <div className="relative z-10 flex flex-col items-center text-center">
        <span className="text-xs font-bold uppercase tracking-[0.3em] text-gray-400 mb-6">
          Ready to start?
        </span>
        <h2 className="text-4xl md:text-7xl font-medium tracking-tight mb-10 max-w-3xl leading-[1.1]">
          Have a project in mind? <br />
          <span className="text-gray-400">Let's build it together.</span>
        </h2>
        
        <a 
          href="mailto:hello@biustinnovation.com" 
          className="group/btn relative inline-flex items-center gap-4 bg-black text-white px-10 py-5 rounded-full overflow-hidden transition-all hover:pr-14"
        >
          <span className="font-semibold text-lg relative z-10">Get in touch</span>
          <ArrowUpRight 
            className="relative z-10 transition-all duration-300 group-hover/btn:translate-x-2 group-hover/btn:-translate-y-1" 
            size={24} 
          />
          {/* Hover effect background */}
          <div className="absolute inset-0 bg-gray-800 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
        </a>
      </div>
    </div>
  </motion.section>
);
const Hero = () => (
  // Updated max-width and padding for proper alignment with the rest of the site
  <section className="px-6 md:px-10 max-w-7xl mx-auto flex-1 flex flex-col justify-center pb-10 relative isolate">
    
    {/* Background Image/Blob - Scaled dimensions and blur */}
    <motion.div 
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 0.7, scale: 1 }}
      transition={{ duration: 1.5, ease: "easeOut" }}
      className="absolute -bottom-15 left-5 w-92 h-90 -translate-x-1/2 -translate-y-1/4 blur-[5px] pointer-events-none"
    >
      <img src="/image11.png" alt="" className="w-full h-full object-cover" />
    </motion.div>

    <div className="flex flex-col-reverse md:flex-row justify-between items-start gap-6 mt-6 relative z-10">
      <div className="relative flex flex-col items-start -ml-2 md:-ml-70">
        
        {/* Scaled TextScramble */}
        <motion.div
           initial={{ opacity: 0, x: -20 }}
           animate={{ opacity: 1, x: 0 }}
           transition={{ duration: 0.6, delay: 0.2 }}
        >
          <TextScramble
            className="text-sm font-extrabold font-pixel tracking-[0.2em] bg-black text-white mb-3 px-2 py-1 inline-block"
            duration={1.2}
            characterSet=". "
          >
            We build and craft digital solutions 
          </TextScramble>
        </motion.div>

        {/* Scaled Heading */}
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.1, delay: 0.1 }}
          className="text-2xl md:text-[5rem] lg:text-[6rem] font-bold leading-[0.85] font-pixel tracking-tighter md:mt-82"
        >
          Biust<br />Innovation Club
        </motion.h1>

        {/* DESKTOP GROUP */}
        <div className="hidden lg:flex absolute -bottom-20 left-[115%] flex-col gap-3 items-end">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className='flex justify-end scale-75 origin-right '
          > 
            <MemberGrid />
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.2 }}
            className="flex self-end justify-end origin-right flex-row gap-2 whitespace-nowrap"
          >
            <button className="group flex items-center gap-2 bg-black text-white px-5 py-3 rounded-xs text-sm font-bold hover:scale-105 transition-all shadow-xl">
              Join
              <ArrowUpRight size={14} strokeWidth={3} />
            </button>
            <Link  href="/contact" >
            <button className="group flex items-center gap-2 border-2 border-black bg-white/50 backdrop-blur-sm px-4 py-2.5 rounded-xs text-sm font-bold hover:bg-black hover:text-white transition-all">
              Work with us
            </button>
            </Link>
          </motion.div>
        </div>

        {/* MOBILE GROUP */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="flex lg:hidden flex-col gap-3 mt-6"
        >
           <div className="scale-75 origin-left"><MemberGrid /></div>
           <div className="flex gap-2">
             <button className="bg-black text-white px-3 py-2 rounded-lg font-bold text-sm">Join</button>
             <button className="border-2 border-black px-3 py-2 rounded-lg font-bold text-sm">Work</button>
           </div>
        </motion.div>
      </div>

      {/* Hero Image Card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, rotate: 2 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ duration: 0.1, delay: 0.1 }}
        className="max-w-[160px] pb-2 md:-mt-8 md:translate-x-6 lg:translate-x-10"
      >
        <div className="w-24 h-32 md:w-[340px] md:h-[240px] bg-gray-200 rounded-[0.25rem] mb-5 overflow-hidden shadow-xl ring-1 ring-black/5 transition-all duration-700 hover:scale-[1.02]">
          <img src="/other.png" alt="Profile" className="object-cover w-full h-full hover:scale-110 transition-transform duration-1000" />
        </div>

        <p className="w-24 md:w-[340px] text-[10px] md:text-xs text-gray-600 leading-relaxed font-medium">
          Based in Botswana. Driving the future through collaboration and rapid prototyping.
        </p>
      </motion.div>
    </div>
  </section>
);

export default function Portfolio() {
  const containerRef = useRef<HTMLDivElement>(null);
  const lastSectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress: lastSectionScroll } = useScroll({
    target: lastSectionRef,
    container: containerRef,
    offset: ["start end", "center center"]
  });

  const backgroundColor = useTransform(lastSectionScroll, [0, 0.1], ["#ffffff", "#000000"]);
  const textColor = useTransform(lastSectionScroll, [0, 0.1], ["#000000", "#ffffff"]);

  return (
    <motion.div 
      ref={containerRef}
      className="h-screen overflow-y-auto overflow-x-hidden selection:bg-black selection:text-white"
      style={{ backgroundColor, color: textColor }}
    >
      
      {/* WRAPPER FOR FULL PAGE START */}
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <Hero />
      </div>
      {/* WRAPPER FOR FULL PAGE END */}

      {/* Partner Companies Slider */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="px-6 md:px-10 max-w-7xl mx-auto py-16"
      >
        <div className="text-center mb-8">
          <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Our Partners</span>
          <h3 className="text-xl md:text-2xl font-medium mt-2 text-gray-600">
            Trusted by industry leaders
          </h3>
        </div>
        <InfiniteSlider gap={48} speed={80} reverse className="py-8">
          <img
            src="/nvidia.png"
            alt="NVIDIA logo"
            className="h-[80px] w-auto opacity-60 hover:opacity-100 transition-opacity"
          />
          <img
            src="/fortinet.png"
            alt="Fortinet logo"
            className="h-[80px] w-auto opacity-60 hover:opacity-100 transition-opacity"
          />
          <img
            src="/github.png"
            alt="GitHub logo"
            className="h-[80px] w-auto opacity-60 hover:opacity-100 transition-opacity"
          />
          <img
            src="/spectrum.png"
            alt="Spectrum logo"
            className="h-[80px] w-auto opacity-60 hover:opacity-100 transition-opacity"
          />
          <img
            src="/debswana.png"
            alt="Debswana logo"
            className="h-[80px] w-auto opacity-60 hover:opacity-100 transition-opacity"
          />
          <img
            src="/bip.png"
            alt="BIP logo"
            className="h-[80px] w-auto opacity-60 hover:opacity-100 transition-opacity"
          />
        </InfiniteSlider>
      </motion.section>

      <main>
        {/* Intro Video Section */}
        <WhatWeDo/>
        <Executives />
        <Projects />
        <section className="px-6 md:px-10 max-w-7xl mx-auto py-24 grid md:grid-cols-2 gap-16 md:gap-24 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Passion</span>
            <h2 className="text-3xl md:text-4xl font-medium mt-4 mb-8">
              Design has always been more than just a job — it's my passion.
            </h2>
            <div className="relative rounded-3xl overflow-hidden aspect-video bg-gray-100 shadow-sm">
              <img src="/api/placeholder/800/450" alt="Video cover" className="object-cover w-full h-full" />
              <button className="absolute inset-0 flex items-center justify-center group">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-xl">
                  <Play fill="black" size={24} className="ml-1" />
                </div>
              </button>
            </div>
          </motion.div>
          <div className="flex flex-col justify-center gap-12 md:pl-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <span className="text-5xl md:text-6xl font-medium font-pixel-grid">+3120</span>
              <p className="text-gray-500 mt-3 text-lg">Projects completed for global clients across various industries.</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <span className="text-5xl md:text-6xl font-medium">+280</span>
              <p className="text-gray-500 mt-3 text-lg">Happy clients who have seen significant growth in their digital presence.</p>
            </motion.div>
          </div>
        </section>

      </main>

      <CallToAction />

      <div ref={lastSectionRef} className="min-h-screen flex flex-col justify-center items-center text-center px-6">
        <motion.h2 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="text-5xl md:text-8xl font-medium tracking-tighter mb-8 bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400"
        >
          The next chapter <br /> starts here.
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="text-xl md:text-2xl opacity-60 max-w-2xl mb-12"
        >
          We're constantly pushing the boundaries of what's possible. 
          New projects, new collaborations, and new ways to innovate.
        </motion.p>
      </div>

      <Footer />
    </motion.div>
  );
}
