"use client";
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function Hero() {
  const containerRef = useRef(null);
  const titleRef = useRef(null);

  useEffect(() => {
    gsap.from(titleRef.current, {
      y: 20,
      opacity: 0,
      duration: 1.5,
      ease: 'power4.out',
      delay: 0.5
    });
  }, []);

  return (
    <section className="relative min-h-screen pt-48 pb-24 flex flex-col items-center justify-center border-b border-border">
      <div className="container mx-auto px-8 text-center relative z-10">
        <div className="mb-10 inline-flex items-center gap-3 px-4 py-1 border border-border rounded-full">
          <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted">
            The Studio Reserve 2026
          </span>
        </div>
        
        <div className="mb-10 flex justify-center">
          <div className="h-28 w-28 md:h-36 md:w-36 rounded-full overflow-hidden border-2 border-border/40 shadow-2xl bg-secondary flex items-center justify-center group/logo hover:border-accent/40 transition-all duration-500">
            <img 
              src="/BloomAtelier-Logo.jpeg" 
              alt="Bloom Atelier Logo" 
              className="w-full h-full object-cover grayscale transition-all duration-700 group-hover/logo:grayscale-0 group-hover/logo:scale-105"
            />
          </div>
        </div>
        
        <h1 
          ref={titleRef}
          className="text-[9vw] md:text-[7rem] leading-[0.9] font-extrabold tracking-[-0.05em] mb-16 text-foreground uppercase"
        >
          Handmade <br />
          <span className="text-accent">Softness</span>
        </h1>
        
        <div className="relative w-full max-w-6xl mx-auto rounded-[1.5rem] overflow-hidden border border-border bg-secondary">
          <img 
            src="/hero.png" 
            alt="Hero Visual" 
            className="w-full h-auto object-cover grayscale hover:grayscale-0 transition-all duration-[2s]"
          />
        </div>

        <div className="mt-20 flex flex-col md:flex-row items-center justify-between border-t border-border pt-10 gap-10">
           <div className="text-left max-w-sm">
              <p className="text-xs uppercase tracking-widest font-bold text-muted mb-2">Our Mission</p>
              <p className="text-sm leading-relaxed text-foreground/70">
                 Preserving the essence of artisanal florals through tactile sculpture and sustainable materiality.
              </p>
           </div>
           <button className="btn-modern">Start Selection</button>
           <div className="text-right max-w-sm hidden md:block">
              <p className="text-xs uppercase tracking-widest font-bold text-muted mb-2">Availability</p>
              <p className="text-sm leading-relaxed text-foreground/70">
                 Each arrangement is bespoke and limited by artisanal capacity. Ships globally from our studio.
              </p>
           </div>
        </div>
      </div>
    </section>
  );
}
