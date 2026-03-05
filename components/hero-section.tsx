'use client'
import { motion, MotionValue } from "motion/react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Cpu, Rocket, Sparkles, Terminal } from "lucide-react"; // Adding icons for "life"

interface HeroSectionProps {
  heroRef: React.RefObject<HTMLDivElement>;
  imgWidth: MotionValue<string>;
  imgHeight: MotionValue<string>;
  imgRadius: MotionValue<string>;
  imgShadow: MotionValue<string>;
  imgScale: MotionValue<number>;
  headerOpacity: MotionValue<number>;
  variants: any;
  transition: any;
  setShowContactCard: (show: boolean) => void;
  handleNavigation: (path: string) => (e: React.MouseEvent) => void;
}

export default function HeroSection({
  heroRef,
  imgWidth,
  imgHeight,
  imgRadius,
  imgShadow,
  imgScale,
  headerOpacity,
  variants,
  transition,
  setShowContactCard,
  handleNavigation
}: HeroSectionProps) {
  
  // Floating animation for decorative items
  const floatingAnimation = {
    initial: { y: 0 },
    animate: {
      y: [0, -20, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <section ref={heroRef} className="relative h-[200vh] flex flex-col items-center snap-start snap-always bg-black">
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
        
        {/* --- DECORATIVE "LIFE" ELEMENTS --- */}
        <motion.div 
          style={{ opacity: headerOpacity }}
          className="absolute inset-0 pointer-events-none z-10"
        >
          {/* Top Left Item */}
          <motion.div {...floatingAnimation} className="absolute top-[15%] left-[10%] text-white/20 flex items-center gap-2">
            <Terminal size={40} />
            <span className="font-mono text-sm tracking-widest uppercase">Build.exe</span>
          </motion.div>

          {/* Top Right Item */}
          <motion.div {...floatingAnimation} transition={{ delay: 1 }} className="absolute top-[20%] right-[15%] text-white/20">
            <Cpu size={60} strokeWidth={1} />
          </motion.div>

          {/* Bottom Right Item */}
          <motion.div {...floatingAnimation} transition={{ delay: 0.5 }} className="absolute bottom-[20%] right-[10%] flex flex-col items-end opacity-40">
            <Sparkles className="text-yellow-400 mb-2" />
            <p className="text-white text-xs font-pixel uppercase tracking-widest">Future Ready</p>
          </motion.div>
        </motion.div>
        {/* ---------------------------------- */}

        <motion.div
          style={{
            width: imgWidth,
            height: imgHeight,
            borderRadius: imgRadius,
            boxShadow: imgShadow,
          }}
          className="relative overflow-hidden z-20"
        >
          <motion.div
            style={{ scale: imgScale }}
            className="relative w-full h-full"
          >
        
            
            {/* Overlay content within the image frame */}
            <div className="absolute inset-0 bg-black/40 flex flex-col items-end justify-end p-8">
              <motion.div
                style={{ opacity: headerOpacity }}
                className="flex flex-col items-end absolute"
              >
                {/* Small Tagline above main title */}
                <span className="text-emerald-400 font-mono text-sm md:text-base tracking-[0.3em] uppercase mb-4">
                  The Official Hub
                </span>
                
                {/* LARGER TEXT: Using responsive massive sizing */}
                <h1 className="text-white text-7xl md:text-[100rem] lg:text-[13rem] font-black font-pixel leading-[0.85] tracking-tighter text-right drop-shadow-2xl">
                  BIUST <br/> 
                  <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-white/20">INNOVATION</span> <br /> 
                  CLUB
                </h1>

                {/* Animated Rocket Icon */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="mt-8 text-white/60"
                >
                  <Rocket size={32} className="animate-pulse" />
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>

        {/* Floating elements outside the image frame */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          variants={variants.section}
          transition={transition}
          className="absolute bottom-12 left-6 md:left-24 z-30"
        >
           <Button 
            variant="outline" 
            className="rounded-full border-white/20 bg-white/10 text-white backdrop-blur-md hover:bg-white/20 h-16 px-10 text-lg transition-all hover:scale-105"
            onClick={() => setShowContactCard(true)}
          >
            Join the movement
          </Button>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div 
          style={{ opacity: headerOpacity }}
          className="absolute bottom-12 right-6 md:right-24 z-30 flex flex-col items-center gap-2"
        >
          <div className="w-[1px] h-12 bg-gradient-to-b from-white/0 to-white/50" />
          <span className="text-[10px] text-white/40 uppercase tracking-[0.5em] [writing-mode:vertical-lr]">Scroll</span>
        </motion.div>
      </div>
    </section>
  );
}