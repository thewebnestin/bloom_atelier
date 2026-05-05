"use client";
import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="relative w-full overflow-hidden mt-10">
      {/* 
          Ultra-Smooth Fade Transition:
          Multi-stop gradient for a seamless transition from the page background.
          We use absolute positioning to overlap the video slightly more for a deep blend.
      */}
      <div className="absolute top-0 left-0 right-0 h-70 bg-gradient-to-b from-background via-background/60 to-transparent z-20 pointer-events-none" />

      {/* Video Container - Height reduced for a more compact, cinematic look */}
      <div className="relative min-h-[65vh] w-full flex items-center justify-center">
        {/* Background Video */}
        <div className="absolute inset-0 overflow-hidden">
          <video 
            autoPlay 
            loop 
            muted 
            playsInline
            className="absolute inset-0 w-full h-full object-cover scale-[1.02]"
          >
            <source src="/footer-bg.mp4" type="video/mp4" />
          </video>
        </div>

        {/* Subtle Tint Overlay for Readability */}
        <div className="absolute inset-0 bg-[#051f20]/15 pointer-events-none z-10" />

        {/* Footer Content */}
        <div className="relative z-30 flex flex-col items-center justify-center min-h-[65vh] w-full px-8 text-center pt-20">
          
          {/* Brand Mark */}
          <div className="mb-14">
            <h2 className="text-5xl md:text-8xl font-extrabold tracking-tighter uppercase text-[#DAF1DE] leading-[0.8] drop-shadow-lg">
              Bloom <br /> Atelier
            </h2>
            <p className="text-[#DAF1DE]/60 text-[9px] uppercase tracking-[0.5em] mt-6 font-bold">
              Studio Reserve · Permanent Collection
            </p>
          </div>

          {/* Nav Links */}
          <div className="flex flex-wrap justify-center gap-x-12 gap-y-4 mb-16">
            {['Collections', 'Archive', 'Studio', 'Private'].map(item => (
              <a 
                key={item} 
                href={`#${item.toLowerCase()}`}
                className="text-[10px] uppercase font-extrabold tracking-[0.3em] text-[#DAF1DE]/50 hover:text-[#DAF1DE] transition-all duration-500"
              >
                {item}
              </a>
            ))}
          </div>

          {/* Social Links */}
          <div className="flex gap-10 mb-16">
            {['Instagram', 'Pinterest', 'Atelier Journal'].map(item => (
              <a 
                key={item} 
                href="#"
                className="text-[8px] uppercase font-bold tracking-[0.4em] text-[#DAF1DE]/40 hover:text-[#DAF1DE] transition-colors"
              >
                {item}
              </a>
            ))}
          </div>

          {/* Bottom Line */}
          <div className="w-full max-w-6xl flex justify-between items-center py-10 border-t border-white/5">
            <p className="text-[8px] uppercase font-bold tracking-[0.4em] text-[#DAF1DE]/20">
              © 2026 Bloom Atelier
            </p>
            <p className="text-[8px] uppercase font-bold tracking-[0.4em] text-[#DAF1DE]/20">
              Designed for Permanence
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
