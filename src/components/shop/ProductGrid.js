"use client";
import React, { useEffect, useRef } from 'react';
import { useShop } from '@/core/shop/ShopContext';
import { products } from '@/core/constants/ProductData';
import gsap from 'gsap';
import Link from 'next/link';

export function ProductCard({ product, index }) {
  const cardRef = useRef(null);

  useEffect(() => {
    gsap.from(cardRef.current, {
      y: 20,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
      delay: index * 0.05,
      scrollTrigger: {
        trigger: cardRef.current,
        start: "top 95%",
      }
    });
  }, [index]);

  return (
    <Link 
      href={`/product/${product.id}`}
      ref={cardRef}
      className="group block space-y-4"
    >
      <div className="relative aspect-[4/5] rounded-[0.75rem] overflow-hidden bg-secondary border border-border transition-all duration-500 group-hover:border-accent">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover grayscale transition-transform duration-1000 group-hover:scale-105 group-hover:grayscale-0"
        />
        <div className="absolute inset-0 bg-accent/0 group-hover:bg-accent/5 transition-colors duration-500" />
      </div>

      <div className="flex justify-between items-start px-1">
        <div className="space-y-1">
          <h3 className="text-sm font-extrabold tracking-tight text-foreground uppercase">{product.name}</h3>
          <p className="text-[9px] uppercase tracking-widest text-accent font-bold">{product.category}</p>
        </div>
        <span className="text-[11px] font-bold text-foreground/40">${product.price}</span>
      </div>
    </Link>
  );
}

export function ProductGrid() {
  return (
    <section id="catalog" className="py-24">
      <div className="container mx-auto px-8">
        <div className="mb-16 flex justify-between items-end border-b border-border pb-8">
          <div className="space-y-3">
             <span className="text-[9px] uppercase tracking-[0.4em] text-accent font-bold">Studio Stock</span>
             <h2 className="text-4xl font-extrabold tracking-tighter uppercase">The Collections</h2>
          </div>
          <p className="text-muted text-[9px] uppercase tracking-widest font-bold">Artifacts: {products.length}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
          {products.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
