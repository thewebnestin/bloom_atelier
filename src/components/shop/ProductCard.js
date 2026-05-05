"use client";
import React from 'react';
import { Heart, ShoppingBag, ArrowUpRight } from 'lucide-react';
import { useShop } from '@/core/shop/ShopContext';
import Link from 'next/link';

export default function ProductCard({ product, onQuickView }) {
  const { toggleWishlist, wishlist, addToCart, setIsCartOpen } = useShop();
  const isWishlisted = wishlist.some(item => item.id === product.id);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Default to first variant if exists
    const variant = { 
      color: product.variants?.colors?.[0]?.name || 'Standard', 
      size: product.variants?.sizes?.[0] || 'OS' 
    };
    addToCart(product, variant);
    setIsCartOpen(true);
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <div className="group relative flex flex-col bg-background h-full">
      {/* Image Container */}
      <div className="relative aspect-[4/5] overflow-hidden bg-secondary rounded-[1rem] border border-border transition-all duration-700 group-hover:border-accent/30">
        <Link href={`/product/${product.id}`} className="block h-full w-full">
          <img 
            src={product.image} 
            alt={product.name} 
            className="h-full w-full object-cover transition-transform duration-[1.5s] cubic-bezier(0.16, 1, 0.3, 1) group-hover:scale-110" 
          />
        </Link>

        {/* Quick Actions Overlay */}
        <div className="absolute inset-0 flex flex-col justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="flex justify-end">
            <button 
              onClick={handleWishlist}
              className={`p-3 rounded-full backdrop-blur-md transition-all duration-300 ${isWishlisted ? 'bg-accent text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}
            >
              <Heart size={16} fill={isWishlisted ? "currentColor" : "none"} />
            </button>
          </div>

          <div className="flex gap-2">
            <button 
              onClick={handleAddToCart}
              className="flex-1 py-3 px-4 bg-white text-black rounded-full text-[9px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-accent hover:text-white transition-all duration-500 transform translate-y-4 group-hover:translate-y-0"
            >
              <ShoppingBag size={12} /> Add to Cart
            </button>
            <button 
              onClick={(e) => { e.preventDefault(); onQuickView(product); }}
              className="p-3 bg-white/20 backdrop-blur-md text-white rounded-full hover:bg-white/40 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0 delay-75"
            >
              <ArrowUpRight size={16} />
            </button>
          </div>
        </div>

        {/* Category Badge (Standard View) */}
        <div className="absolute top-4 left-4 pointer-events-none transition-opacity group-hover:opacity-0">
          <span className="px-3 py-1 bg-background/80 backdrop-blur-sm border border-border rounded-full text-[8px] font-extrabold uppercase tracking-widest text-foreground">
            {product.category}
          </span>
        </div>
      </div>

      {/* Info Section */}
      <div className="pt-6 space-y-2 flex-1">
        <div className="flex justify-between items-start gap-4">
          <Link href={`/product/${product.id}`} className="block group/title">
            <h3 className="text-sm font-bold tracking-tight text-foreground transition-colors group-hover/title:text-accent">
              {product.name}
            </h3>
          </Link>
          <span className="text-sm font-medium text-muted">${product.price}</span>
        </div>
        <p className="text-[10px] text-muted leading-relaxed line-clamp-2 opacity-60">
          {product.description || "Artisanally crafted floral arrangement with permanent studio preservation."}
        </p>
      </div>
    </div>
  );
}
