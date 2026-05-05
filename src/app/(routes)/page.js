"use client";
import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Hero from '@/components/shop/Hero';
import { ProductGrid } from '@/components/shop/ProductGrid';
import ProductModal from '@/components/shop/ProductModal';
import CartDrawer from '@/components/cart/CartDrawer';
import WishlistDrawer from '@/components/cart/WishlistDrawer';
import Footer from '@/components/layout/Footer';
import { Palette, Feather, ShieldCheck, ArrowUpRight, Flower2 } from 'lucide-react';

export default function Home() {


  return (
    <main className="relative bg-background min-h-screen">
      <Navbar />
      
      {/* 2026 Interactive Hero Sequence */}
      <Hero />
      
      <div className="bg-background relative z-20">
        <ProductGrid />
      </div>

      <section id="atelier" className="py-40 border-t border-border bg-secondary/30 relative z-20">
        <div className="container mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-px bg-border overflow-hidden border border-border rounded-[2.5rem]">
            <div className="md:col-span-8 bg-background p-12 md:p-20 flex flex-col justify-center space-y-10 group">
              <div className="space-y-4">
                 <span className="text-[10px] uppercase tracking-[0.4em] text-accent font-bold">Studio Ethos</span>
                 <h2 className="text-5xl md:text-7xl font-extrabold tracking-tighter leading-[0.9] text-foreground uppercase">
                    Tactile <br /> 
                    <span className="opacity-30">Sculpture.</span>
                 </h2>
              </div>
              <p className="text-muted text-lg leading-relaxed max-w-lg font-medium">
                Our artisanal process transforms humble materials into permanent art. Every petal, every stem, is a deliberate act of design meant to last a lifetime.
              </p>
              <div className="flex items-center gap-6">
                 <button className="px-10 py-4 bg-foreground text-background text-xs font-bold uppercase tracking-widest rounded-full hover:bg-accent transition-all">
                    Discover More
                 </button>
              </div>
            </div>
            
            <div className="md:col-span-4 bg-background p-12 md:p-20 flex flex-col items-start justify-between group">
              <ShieldCheck size={48} className="text-accent" strokeWidth={1.5} />
              <div className="space-y-4">
                 <h3 className="text-3xl font-bold tracking-tight">Verified Archive</h3>
                 <p className="text-muted text-sm leading-relaxed">Each arrangement is numbered and cataloged within our studio archive to ensure artisanal authenticity.</p>
              </div>
              <div className="w-12 h-[1px] bg-border group-hover:w-full transition-all duration-700" />
            </div>

            <div className="md:col-span-4 bg-background p-12 md:p-16 space-y-8 group hover:bg-secondary transition-all duration-500">
               <div className="flex justify-between items-start">
                  <div className="w-12 h-12 rounded-full border border-border flex items-center justify-center text-accent">
                     <Palette size={20} />
                  </div>
                  <ArrowUpRight className="text-muted group-hover:text-accent transition-all" size={20} />
               </div>
               <div className="space-y-4">
                  <h4 className="text-2xl font-bold tracking-tight">Materiality</h4>
                  <p className="text-muted text-sm leading-relaxed">Using high-density silk fibers and industrial-grade core wires for unmatched structural integrity.</p>
               </div>
            </div>

            <div className="md:col-span-8 bg-background p-12 md:p-16 flex items-center gap-12 group transition-all duration-500">
               <div className="hidden md:block w-32 h-32 rounded-3xl border border-border flex-shrink-0 grayscale group-hover:grayscale-0 transition-all duration-700 overflow-hidden">
                  <img src="/luxury_pipe_cleaner_bouquet_1777975715581.png" className="w-full h-full object-cover" />
               </div>
               <div className="flex-1 space-y-4">
                  <h4 className="text-2xl font-bold tracking-tight">Sustainable Future</h4>
                  <p className="text-muted text-sm leading-relaxed max-w-md">
                    By choosing permanence, you reduce the carbon footprint of weekly floral replacements. A one-time investment in everlasting beauty.
                  </p>
               </div>
            </div>
          </div>
        </div>
      </section>
      
      <section id="studio" className="py-60 bg-background relative z-20 overflow-hidden">
        {/* Floating Background Text */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 select-none pointer-events-none opacity-[0.03] whitespace-nowrap">
          <span className="text-[30vw] font-black uppercase tracking-tighter">Handcrafted</span>
        </div>

        <div className="container mx-auto px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-24 items-center">
            {/* Left: Dynamic Image Composition */}
            <div className="lg:col-span-7 grid grid-cols-12 gap-6 items-start">
               <div className="col-span-8 rounded-[3rem] overflow-hidden aspect-[3/4] border border-border group relative">
                  <img 
                    src="/forest_zoom_1.png" 
                    className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110 grayscale group-hover:grayscale-0" 
                    alt="Process"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent" />
               </div>
               <div className="col-span-4 space-y-6 pt-24">
                  <div className="rounded-[2rem] overflow-hidden aspect-square border border-border group">
                    <img 
                      src="/forest_zoom_2.png" 
                      className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0" 
                      alt="Detail"
                    />
                  </div>
                  <div className="p-8 rounded-[2rem] bg-secondary/50 border border-border backdrop-blur-sm">
                    <Palette size={24} className="text-accent mb-4" />
                    <p className="text-[10px] font-black uppercase tracking-widest leading-tight">Pigment <br/> Selection</p>
                  </div>
               </div>
            </div>

            {/* Right: Editorial Content */}
            <div className="lg:col-span-5 space-y-12">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="h-[1px] w-12 bg-accent" />
                  <span className="text-[10px] uppercase tracking-[0.6em] text-accent font-black">Studio Philosophy</span>
                </div>
                <h2 className="text-7xl md:text-8xl font-extrabold uppercase tracking-tighter leading-[0.8] text-foreground">
                  The Art of <br />
                  <span className="italic opacity-20">Permanence.</span>
                </h2>
              </div>
              
              <div className="space-y-8">
                <p className="text-xl text-muted font-medium leading-relaxed italic">
                  "We don't just assemble; we sculpt, wire, and refine until the artificial becomes art."
                </p>
                <p className="text-sm text-muted/80 leading-relaxed max-w-sm">
                  Every creation at Bloom Atelier begins with raw fiber and a vision. Our multi-layer hand-wiring technique provides structural flexibility and a life-like form that lasts a lifetime.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-12 pt-12 border-t border-border">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Technique</span>
                  </div>
                  <p className="text-xs text-muted leading-relaxed font-medium">Bespoke hand-wiring & layering</p>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Timeline</span>
                  </div>
                  <p className="text-xs text-muted leading-relaxed font-medium">12-16 hours per sculpture</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="custom" className="py-20 pb-40 bg-background relative z-20">
        <div className="container mx-auto px-8">
          <div className="relative rounded-[4rem] overflow-hidden bg-foreground group">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 opacity-40 grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000">
               <img src="/footer-demo image.jpeg" className="w-full h-full object-cover" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-foreground via-foreground/80 to-transparent" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-20 p-12 md:p-24 items-center">
              <div className="space-y-10">
                <div className="space-y-6">
                  <div className="w-16 h-16 rounded-2xl bg-accent/20 border border-accent/30 flex items-center justify-center text-accent">
                    <Flower2 size={32} />
                  </div>
                  <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-background leading-none">
                    Commission <br /> Your Archive.
                  </h2>
                  <p className="text-lg text-background/60 max-w-md font-medium leading-relaxed">
                    Elevate your space with a one-of-a-kind permanent sculpture designed specifically for your aesthetic vision.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-6">
                  <button className="px-10 py-5 bg-accent text-accent-foreground text-xs font-black uppercase tracking-[0.4em] rounded-full hover:bg-background hover:text-foreground transition-all duration-500 shadow-2xl">
                    Start Commission
                  </button>
                  <button className="px-10 py-5 border border-background/20 text-background text-xs font-black uppercase tracking-[0.4em] rounded-full hover:bg-background/10 transition-all duration-500">
                    View Process
                  </button>
                </div>
              </div>

              <div className="hidden lg:grid grid-cols-2 gap-px bg-background/10 rounded-3xl overflow-hidden border border-background/10 backdrop-blur-md">
                 {[
                   { label: 'Authenticity', val: '100%', sub: 'Handmade' },
                   { label: 'Longevity', val: '∞', sub: 'Year Life' },
                   { label: 'Curation', val: '2026', sub: 'Collection' },
                   { label: 'Global', val: 'Ship', sub: 'Worldwide' }
                 ].map((stat, i) => (
                   <div key={i} className="bg-foreground/40 p-10 space-y-2 hover:bg-foreground/60 transition-colors">
                      <p className="text-[9px] font-black uppercase tracking-widest text-accent">{stat.label}</p>
                      <p className="text-4xl font-bold text-background">{stat.val}</p>
                      <p className="text-[9px] font-medium uppercase tracking-widest text-background/40">{stat.sub}</p>
                   </div>
                 ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      <CartDrawer />
      <WishlistDrawer />
    </main>
  );
}
