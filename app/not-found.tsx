"use client"

import React from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Home, ArrowLeft } from "lucide-react"
import { TextScramble } from "@/components/motion-primitives/text-scramble"
import { TextEffect } from "@/components/motion-primitives/text-effect"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen w-full items-center justify-center p-6 md:p-10 overflow-hidden font-pixel-circle text-gray-900">
      {/* Background with blur effect similar to contact page */}
      <div className="absolute inset-0 z-[-1]">
        <Image
          src="/gg.webp"
          alt="Background"
          fill
          priority
          className="object-cover blur-[15px] opacity-100 scale-110"
        />
        <div className="absolute inset-0 bg-white/40 backdrop-blur-md" />
      </div>

      <div className="relative w-full max-w-2xl z-10">
        <div className="bg-white/80 backdrop-blur-xl border border-black shadow-[0_32px_64px_rgba(0,0,0,0.1)] p-8 md:p-16 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-8 flex justify-center">
              <div className="relative w-32 h-10 overflow-hidden">
                <Image
                  src="/aw.webp"
                  alt="Club Logo"
                  width={128}
                  height={40}
                  priority
                  className="object-contain"
                />
              </div>
            </div>

            <h1 className="text-8xl md:text-9xl font-black tracking-tighter text-black mb-4">
              404
            </h1>

            <div className="mb-8 min-h-[1.5em]">
              <TextScramble
                className="text-xl md:text-2xl font-bold uppercase tracking-tight text-black"
                duration={1.2}
              >
                RESOURCE NOT FOUND
              </TextScramble>
            </div>

            <div className="max-w-md mx-auto mb-12">
              <TextEffect
                per="word"
                preset="fade-in-blur"
                className="text-sm md:text-base text-gray-600 font-light leading-relaxed"
              >
                The coordinates you provided do not point to any known sector in our database. It might have been moved, deleted, or never existed in this timeline.
              </TextEffect>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                asChild
                className="w-full sm:w-auto bg-black hover:bg-gray-900 text-white px-8 py-6 rounded-none group transition-all"
              >
                <Link href="/" className="flex items-center gap-2">
                  <Home className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-widest">Return Home</span>
                </Link>
              </Button>
              
              <Button
                variant="outline"
                onClick={() => window.history.back()}
                className="w-full sm:w-auto border-black hover:bg-black hover:text-white px-8 py-6 rounded-none group transition-all"
              >
                <div className="flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                  <span className="text-xs font-bold uppercase tracking-widest">Go Back</span>
                </div>
              </Button>
            </div>
          </motion.div>
        </div>

        <div className="mt-8 flex justify-between items-center text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 px-4">
          <span>Error Code: 0x404</span>
          <span>System: Potato OS v2.0</span>
        </div>
      </div>
    </div>
  )
}
