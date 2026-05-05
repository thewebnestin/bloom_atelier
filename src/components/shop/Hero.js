"use client";
import React, { useEffect, useRef } from 'react';
import { ArrowRight, MoveRight } from 'lucide-react';
import gsap from 'gsap';

export default function Hero() {
  const textRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline();
    
    tl.fromTo(textRef.current.children,
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.15, duration: 1.2, ease: 'power4.out' }
    );
  }, []);

  return (
    <section className="relative min-h-[85vh] w-full flex items-center bg-background pt-20">
      {/* Decorative background elements - Subtle & Classy */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -right-20 w-[500px] h-[500px] rounded-full bg-secondary/50 blur-[120px]" />
        <div className="absolute -bottom-20 -left-20 w-[600px] h-[600px] rounded-full bg-accent/5 blur-[150px]" />
      </div>

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div ref={textRef} className="max-w-5xl">
          {/* Studio Label */}
          <div className="mb-12 overflow-hidden">
            <span className="inline-block text-accent text-[11px] font-bold uppercase tracking-[0.6em]">
              Handcrafted in the Atelier · 2026
            </span>
          </div>

          {/* Main Headline */}
          <div className="space-y-4 mb-16">
            <h1 className="text-[12vw] lg:text-[10vw] font-extrabold tracking-tighter uppercase leading-[0.8] text-foreground">
              Eternal <br /> 
              <span className="italic opacity-20">Botanics.</span>
            </h1>
          </div>

          {/* Subtext & Actions */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-end">
            <div className="md:col-span-6">
              <p className="text-xl md:text-2xl text-muted font-medium leading-relaxed">
                Elevating the ordinary through structural artistry. Our permanent floral sculptures bring a new dimension of permanence to your space.
              </p>
            </div>
            
            <div className="md:col-span-6 flex flex-col sm:flex-row gap-6 md:justify-end">
              <button 
                onClick={() => document.getElementById('catalog').scrollIntoView({ behavior: 'smooth' })}
                className="group flex items-center gap-6 text-[11px] font-extrabold uppercase tracking-[0.5em] text-foreground hover:text-accent transition-all duration-500"
              >
                View Collection <MoveRight size={24} className="group-hover:translate-x-4 transition-transform duration-500" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Detail Line */}
        <div className="mt-32 pt-12 border-t border-border flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="flex gap-12">
            <div className="space-y-1">
              <p className="text-[9px] uppercase font-bold tracking-widest text-muted/40">Philosophy</p>
              <p className="text-sm font-bold uppercase tracking-tighter">Permanence Over Ephemerality</p>
            </div>
            <div className="space-y-1">
              <p className="text-[9px] uppercase font-bold tracking-widest text-muted/40">Craft</p>
              <p className="text-sm font-bold uppercase tracking-tighter">Artisanal Hand-Wiring</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 group cursor-pointer">
            <div className="w-12 h-12 rounded-full border border-border flex items-center justify-center group-hover:bg-foreground group-hover:text-background transition-all duration-500">
              <ArrowRight size={18} className="-rotate-45" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Request Custom Archive</span>
          </div>
        </div>
      </div>
    </section>
  );
}
