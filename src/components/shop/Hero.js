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


      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div ref={textRef} className="max-w-5xl">
          {/* Studio Label */}
          <div className="mb-12 overflow-hidden">
            <span className="inline-block text-foreground/60 text-[11px] font-bold uppercase tracking-[0.6em]">
              Handcrafted in the Atelier · 2026
            </span>
          </div>

          {/* Main Headline */}
          <div className="space-y-4 mb-16">
            <h1 className="text-[15vw] sm:text-[12vw] lg:text-[10vw] font-extrabold tracking-tighter uppercase leading-[0.8] text-foreground">
              Bloom <br /> 
              <span className="italic opacity-30">Atelier.</span>
            </h1>
          </div>

          {/* Subtext & Actions */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-12 items-end">
            <div className="md:col-span-6">
              <p className="text-lg md:text-2xl text-muted font-medium leading-relaxed">
                Handcrafted art that transcends time. This is Bloom Atelier—where every petal is sculpted by hand to create eternal e-commerce masterpieces.
              </p>
            </div>
            
            <div className="md:col-span-6 flex flex-col sm:flex-row gap-6 md:justify-end">
              <button 
                onClick={() => document.getElementById('catalog').scrollIntoView({ behavior: 'smooth' })}
                className="group flex items-center gap-6 text-[11px] font-extrabold uppercase tracking-[0.5em] text-foreground hover:text-accent transition-all duration-500 text-left"
              >
                View Collection <MoveRight size={24} className="group-hover:translate-x-4 transition-transform duration-500" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Detail Line */}
        <div className="mt-16 md:mt-32 pt-12 border-t border-border flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="flex gap-6 sm:gap-12">
            <div className="space-y-1">
              <p className="text-[9px] uppercase font-bold tracking-widest text-muted/40">Our Goal</p>
              <p className="text-xs sm:text-sm font-bold uppercase tracking-tighter">Flowers That Last Forever</p>
            </div>
            <div className="space-y-1">
              <p className="text-[9px] uppercase font-bold tracking-widest text-muted/40">Our Craft</p>
              <p className="text-xs sm:text-sm font-bold uppercase tracking-tighter">Wired by Hand</p>
            </div>
          </div>
          
          <a 
            href="https://wa.me/918714793136?text=Hello%20Bloom%20Atelier%2C%20I%20would%20like%20to%20inquire%20about%20commissioning%20a%20custom%20floral%20sculpture."
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 group cursor-pointer text-foreground hover:text-accent transition-colors"
          >
            <div className="w-12 h-12 rounded-full border border-border flex items-center justify-center group-hover:bg-foreground group-hover:text-background transition-all duration-500">
              <ArrowRight size={18} className="-rotate-45" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Request Custom Archive</span>
          </a>
        </div>
      </div>
    </section>
  );
}
