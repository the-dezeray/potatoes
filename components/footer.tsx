'use client'
import Link from 'next/link';
import { Github, Twitter, Linkedin, Instagram, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: Github, href: 'https://github.com', label: 'GitHub' },
    { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
    { icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
    { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
  ];

  const footLinks = [
    { name: 'Projects', href: '/projects' },
    { name: 'About', href: '#about' },
    { name: 'Apply', href: '/apply' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <footer className="w-full py-12 px-10  md:px-24 mt-auto pt-50 bg-[#363636] text-white rounded-2xl ">
      
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="mb-16"
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
      </motion.div>

      <div className="flex flex-col md:flex-row justify-between items-center gap-8 border-t border-white/10 pt-12">
        <div className="flex flex-col gap-2">
          <h3 className="text-2xl font-extrabold tracking-tighter font-pixel-triangle">BIUST Innovation Club</h3>
          <p className="text-sm text-muted-foreground">Building the future of tech in Botswana.</p>
        </div>

        <nav className="flex flex-wrap justify-center gap-6">
          {footLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="px-5 py-2.5 rounded-2xl hover:bg-neutral-800 transition-colors duration-300 text-sm font-medium"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="flex gap-4">
          {socialLinks.map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3.5 rounded-2xl hover:bg-neutral-800 transition-all duration-300 group"
              aria-label={social.label}
            >
              <social.icon className="w-5 h-5 opacity-70 group-hover:opacity-100 transition-opacity" />
            </a>
          ))}
        </div>
      </div>
      <div className="mt-12 text-center text-xs text-muted-foreground font-pixel-triangle">
        © {currentYear} BIUST Innovation Club. All rights reserved.
      </div>
    </footer>
  );
}
