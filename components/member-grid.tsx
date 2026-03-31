'use client';

import React, { useState, useEffect, useRef } from 'react';
import { executives, members } from '@/lib/members-data';

export const MemberGrid = () => {
  const [visibleMembers, setVisibleMembers] = useState<Set<number>>(new Set());
  const [spotlightIndex, setSpotlightIndex] = useState<number | null>(null);
  const isSpotlighting = useRef(false);
  const queue = useRef<number[]>([]);

  const allMembers = [...executives, ...members];
  const totalGridSlots = allMembers.length;

  // Build the queue once on mount — shuffled order
  useEffect(() => {
    const shuffled = Array.from({ length: totalGridSlots }, (_, i) => i)
      .sort(() => Math.random() - 0.5);
    queue.current = shuffled;
  }, [totalGridSlots]);

  // Drain queue: reveal + spotlight each card one by one
  useEffect(() => {
    const drain = () => {
      if (isSpotlighting.current || queue.current.length === 0) return;

      isSpotlighting.current = true;
      const next = queue.current.shift()!;

      // Reveal the card and spotlight it simultaneously
      setVisibleMembers(prev => new Set(prev).add(next));
      setSpotlightIndex(next);

      setTimeout(() => {
        setSpotlightIndex(null);
        isSpotlighting.current = false;
        drain();
      }, 1400);
    };

    const interval = setInterval(drain, 150);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col gap-3">
      {/* Header UI */}
      <div className="flex justify-between items-end px-1">
        <span className="text-[10px] font-mono text-white/90 tracking-widest uppercase">
        THE NERDS
        </span>
        <span className="text-[10px] font-mono text-white/70 font-bold">
          {visibleMembers.size} / {totalGridSlots}
        </span>
      </div>

      {/* Grid Container */}
      <div className="grid grid-cols-6 sm:grid-cols-7 md:grid-cols-10 lg:grid-cols-6 w-fit gap-0.1">
        {allMembers.map((member, index) => {
          const isVisible = visibleMembers.has(index);
          const isSpotlit = spotlightIndex === index;

          // LOGIC: High brightness and full color while spotlighted
          // Fades to grayscale and normal brightness once "settled"
          const imageClasses = isSpotlit 
            ? 'grayscale-0 brightness-125 contrast-110 scale-105' 
            : 'grayscale brightness-100 contrast-100 scale-100';

          return (
            <div
              key={index}
              className="relative overflow-visible border border-black/5 flex flex-col items-center group"
              style={{
                width: '36px',
                height: '32px',
                transition: 'transform 650ms cubic-bezier(0.34, 1.56, 0.64, 1)',
                transform: isSpotlit ? 'scale(1.45)' : 'scale(1)',
                zIndex: isSpotlit ? 50 : 1,
              }}
            >
              <div className="w-8 h-8 overflow-hidden relative bg-black/[0.02]">
                {isVisible ? (
                  <>
                    <img
                      src={member.image}
                      alt={member.name}
                      className={`w-full h-full object-cover transition-all duration-700 ease-in-out ${imageClasses}`}
                    />
                    
                    {/* Visual Pro-Tip: Scanline/Glitch Overlay during spotlight */}
                    {isSpotlit && (
                      <div className="absolute inset-0 pointer-events-none overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/20 to-transparent animate-scanline" />
                        <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />
                      </div>
                    )}
                  </>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-1 h-1 bg-white/80 rounded-full" />
                  </div>
                )}

                {/* Spotlight Border Effect */}
                {isSpotlit && (
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      boxShadow: '0 0 0 2px rgba(0,0,0,0.8), 0 4px 20px rgba(0,0,0,0.4)',
                    }}
                  />
                )}
              </div>

              {/* Name Tag */}
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  marginTop: '4px',
                  whiteSpace: 'nowrap',
                  opacity: isSpotlit ? 1 : 0,
                  transition: 'opacity 300ms ease',
                  pointerEvents: 'none',
                  zIndex: 100,
                }}
              >
                <span
                  className="bg-black text-white px-1.5 py-0.5"
                  style={{
                    fontSize: '7px',
                    fontFamily: 'monospace',
                    fontWeight: 700,
                    letterSpacing: '0.05em',
                    display: 'block',
                    textTransform: 'uppercase',
                  }}
                >
                  {member.name}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add this to your global CSS or a style tag for the scanline effect */}
      <style jsx global>{`
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        .animate-scanline {
          animation: scanline 1.5s linear infinite;
        }
      `}</style>
    </div>
  );
};