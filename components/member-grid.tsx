'use client';

import React, { useState, useEffect } from 'react';

export const MemberGrid = () => {
  const [visibleMembers, setVisibleMembers] = useState<Set<number>>(new Set());
  const totalGridSlots = 17;
  const uniqueImageCount = 8;

  useEffect(() => {
    if (visibleMembers.size >= totalGridSlots) return;

    const interval = setInterval(() => {
      setVisibleMembers((prev) => {
        if (prev.size >= totalGridSlots) {
          clearInterval(interval);
          return prev;
        }

        const emptySlots = Array.from({ length: totalGridSlots }, (_, i) => i)
          .filter(id => !prev.has(id));

        const randomIndex = Math.floor(Math.random() * emptySlots.length);
        const nextSlot = emptySlots[randomIndex];

        const newSet = new Set(prev);
        newSet.add(nextSlot);
        return newSet;
      });
    }, 300);

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

      <div className="grid grid-cols-8 grid-rows-3 w-80 h-30 gap-1">
        {Array.from({ length: totalGridSlots }).map((_, index) => {
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
