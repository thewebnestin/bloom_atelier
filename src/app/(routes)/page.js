"use client";
import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import HeroScrollSequence from '@/components/shop/HeroScrollSequence';
import { ProductGrid } from '@/components/shop/ProductGrid';
import ProductModal from '@/components/shop/ProductModal';
import CartDrawer from '@/components/cart/CartDrawer';
import { Palette, Feather, ShieldCheck, ArrowUpRight, Flower2 } from 'lucide-react';

export default function Home() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleQuickView = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  return (
    <main className="relative bg-background min-h-screen">
      <Navbar />
      
      {/* 2026 Interactive Hero Sequence */}
      <HeroScrollSequence />
      
      <div className="bg-background relative z-20">
        <ProductGrid onQuickView={handleQuickView} />
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

      <footer className="py-32 border-t border-border bg-background relative z-20">
        <div className="container mx-auto px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-16">
            <div className="space-y-8">
               <div className="flex items-center gap-4">
                  <img src="/BloomAtelier-Logo.jpeg" alt="Logo" className="h-10 w-auto grayscale" />
                  <h2 className="text-xl font-extrabold tracking-tighter uppercase">Bloom Atelier</h2>
               </div>
               <div className="flex flex-wrap gap-x-12 gap-y-4">
                  {['Instagram', 'Pinterest', 'Atelier Journal', 'Private Commission'].map(item => (
                    <a key={item} href="#" className="text-[10px] uppercase font-bold tracking-[0.2em] text-muted hover:text-accent transition-all">{item}</a>
                  ))}
               </div>
            </div>
            <div className="space-y-4 text-right">
               <p className="text-[10px] uppercase font-bold tracking-[0.3em] text-muted/50">© 2026 Studio Reserve</p>
               <p className="text-[10px] uppercase font-bold tracking-[0.3em] text-muted/50">Designed for Permanence</p>
            </div>
          </div>
        </div>
      </footer>

      <ProductModal 
        product={selectedProduct} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
      <CartDrawer />
    </main>
  );
}
