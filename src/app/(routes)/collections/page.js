"use client";
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { ProductGrid } from '@/components/shop/ProductGrid';
import CartDrawer from '@/components/cart/CartDrawer';
import WishlistDrawer from '@/components/cart/WishlistDrawer';

export default function CollectionsPage() {
  return (
    <main className="relative bg-background min-h-screen">
      <Navbar />
      
      {/* Header Section */}
      <section className="pt-40 pb-20 bg-background border-b border-border">
        <div className="container mx-auto px-6 md:px-8">
          <div className="max-w-3xl space-y-6">
            <span className="text-accent text-[10px] font-bold uppercase tracking-[0.6em]">Studio Reserve</span>
            <h1 className="text-6xl md:text-8xl font-extrabold tracking-tighter uppercase leading-[0.85]">
              Artifact <br />
              <span className="opacity-30">Collections.</span>
            </h1>
            <p className="text-muted text-lg md:text-xl font-medium leading-relaxed max-w-xl pt-4">
              Explore our permanent catalog of handcrafted floral sculptures. Each piece is an artifact of deliberate design, built to transcend seasons and last a lifetime.
            </p>
          </div>
        </div>
      </section>

      {/* Grid Section */}
      <div className="relative z-10">
        <ProductGrid />
      </div>

      <Footer />
      
      <CartDrawer />
      <WishlistDrawer />
    </main>
  );
}
