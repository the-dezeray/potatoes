import React from 'react';
import Image from 'next/image'; // <-- import this

export function OffersSection() {
  return (
    <div className="mb-12 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto w-full">
      {/* Official Merch Section */}
      <div className="bg-[#8ecfc8] text-[#1c1c1c] border-2 border-[#1c1c1c] shadow-[4px_4px_0_#1c1c1c] rounded-[1.5rem] p-6 flex flex-col">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-2xl font-bold mb-1">Official Merch</h3>
            <p className="text-sm font-medium max-w-sm">
              Rep the BIUST Innovation Club. Limited edition drops.
            </p>
          </div>
          <button className="hidden md:block bg-white border-2 border-[#1c1c1c] shadow-[3px_3px_0_#1c1c1c] px-4 py-1.5 text-sm font-bold uppercase tracking-wider hover:bg-neutral-100 transition-all hover:-translate-y-1">
            Shop All
          </button>
        </div>
        
        <div className="grid grid-cols-2 gap-2 mt-auto">
          <div className="bg-white rounded-xl p-2 border-2 border-[#1c1c1c] shadow-[2px_2px_0_#1c1c1c] group cursor-pointer hover:-translate-y-1 transition-transform">
            <div className="aspect-square bg-[#EDF9F7] rounded-lg mb-2 flex items-center justify-center border-2 border-[#1c1c1c]">
              <Image src="/merch/hoodie.png" alt="Classic Club Tee" className="w-full h-full object-cover" width={200} height={200} />
            </div>
            <h4 className="font-bold text-sm">Classic Club Tee</h4>
            <p className="text-[10px] font-medium text-neutral-600 mb-2">100% Cotton, Black</p>
            <div className="flex justify-between items-center mt-1">
              <span className="font-bold text-xs">P 150.00</span>
              <span className="bg-[#1c1c1c] text-white text-[8px] px-1.5 py-0.5 rounded-md font-bold group-hover:bg-[#8ecfc8] group-hover:text-[#1c1c1c] transition-colors">BUY</span>
            </div>
          </div>

          <div className="bg-white rounded-xl p-2 border-2 border-[#1c1c1c] shadow-[2px_2px_0_#1c1c1c] group cursor-pointer hover:-translate-y-1 transition-transform">
            <div className="aspect-square bg-[#EDF9F7] rounded-lg mb-2 flex items-center justify-center border-2 border-[#1c1c1c]">
              <Image src="/merch/jacket.webp" alt="Dev Hoodie" className="w-full h-full object-cover" width={200} height={200} />
            </div>
            <h4 className="font-bold text-sm">Dev Hoodie</h4>
            <p className="text-[10px] font-medium text-neutral-600 mb-2">Premium Fleece, Navy</p>
            <div className="flex justify-between items-center mt-1">
              <span className="font-bold text-xs">P 300.00</span>
              <span className="bg-[#1c1c1c] text-white text-[8px] px-1.5 py-0.5 rounded-md font-bold group-hover:bg-[#8ecfc8] group-hover:text-[#1c1c1c] transition-colors">BUY</span>
            </div>
          </div>
        </div>
        <button className="md:hidden mt-5 bg-white border-2 border-[#1c1c1c] shadow-[3px_3px_0_#1c1c1c] px-4 py-2 text-sm font-bold uppercase tracking-wider hover:bg-neutral-100 transition-all">
          Shop All
        </button>
      </div>

      {/* Skill Courses Section */}
      <div className="bg-[#fbd35a] text-[#1c1c1c] border-2 border-[#1c1c1c] shadow-[4px_4px_0_#1c1c1c] rounded-[1.5rem] p-6 flex flex-col">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-2xl font-bold mb-1">Skill Courses</h3>
            <p className="text-sm font-medium max-w-sm">Level up your tech stack. Curated bootcamps.</p>
          </div>
          <button className="hidden md:block bg-white border-2 border-[#1c1c1c] shadow-[3px_3px_0_#1c1c1c] px-4 py-1.5 text-sm font-bold uppercase tracking-wider hover:bg-neutral-100 transition-all hover:-translate-y-1">
            Browse
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2 mt-auto">
          <div className="bg-white rounded-xl p-2 border-2 border-[#1c1c1c] shadow-[2px_2px_0_#1c1c1c] group cursor-pointer hover:-translate-y-1 transition-transform flex flex-col justify-between">
            <div>
              <span className="inline-block bg-[#f4c3b3] border-2 border-[#1c1c1c] text-[8px] font-bold px-1 py-0.5 rounded mb-1.5">WEB DEV</span>
              <h4 className="font-bold text-sm leading-tight mb-1">Full-Stack Next.js</h4>
              <p className="text-[10px] font-medium text-neutral-600 mb-1">Master React, Next.js, & backend.</p>
            </div>
            <div className="flex justify-between items-center mt-2 border-t-2 border-dashed border-gray-200 pt-1.5">
              <span className="font-bold text-[#844B3E] text-xs">FREE</span>
              <span className="bg-[#1c1c1c] text-white text-[8px] px-1.5 py-0.5 rounded-md font-bold group-hover:bg-[#fbd35a] group-hover:text-[#1c1c1c] transition-colors">ENROLL</span>
            </div>
          </div>

          <div className="bg-white rounded-xl p-2 border-2 border-[#1c1c1c] shadow-[2px_2px_0_#1c1c1c] group cursor-pointer hover:-translate-y-1 transition-transform flex flex-col justify-between">
            <div>
              <span className="inline-block bg-[#8ecfc8] border-2 border-[#1c1c1c] text-[8px] font-bold px-1 py-0.5 rounded mb-1.5">DESIGN</span>
              <h4 className="font-bold text-sm leading-tight mb-1">UI/UX in Figma</h4>
              <p className="text-[10px] font-medium text-neutral-600 mb-1">Learn wireframing & design.</p>
            </div>
            <div className="flex justify-between items-center mt-2 border-t-2 border-dashed border-gray-200 pt-1.5">
              <span className="font-bold text-[#844B3E] text-xs">FREE</span>
              <span className="bg-[#1c1c1c] text-white text-[8px] px-1.5 py-0.5 rounded-md font-bold group-hover:bg-[#fbd35a] group-hover:text-[#1c1c1c] transition-colors">ENROLL</span>
            </div>
          </div>
        </div>
        <button className="md:hidden mt-5 bg-white border-2 border-[#1c1c1c] shadow-[3px_3px_0_#1c1c1c] px-4 py-2 text-sm font-bold uppercase tracking-wider hover:bg-neutral-100 transition-all">
          Browse
        </button>
      </div>
    </div>
  );
}