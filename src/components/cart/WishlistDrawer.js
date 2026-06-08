"use client";
import React from 'react';
import { useShop } from '@/core/shop/ShopContext';
import { X, Heart, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

export default function WishlistDrawer() {
  const { wishlist, isWishlistOpen, setIsWishlistOpen, removeFromWishlist, addToCart } = useShop();

  if (!isWishlistOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[10001] flex justify-end"
      onClick={() => setIsWishlistOpen(false)}
    >
      <div className="absolute inset-0 bg-black/10 backdrop-blur-md" />
      
      <div 
        className="relative w-full max-w-[480px] h-full bg-background border-l border-border flex flex-col animate-slide-in-right"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-8 flex justify-between items-center border-b border-border">
          <div className="flex items-center gap-4">
            <Heart size={20} className="text-accent" />
            <h3 className="text-xl font-semibold tracking-tight">Your Wishlist</h3>
          </div>
          <button 
            className="p-2 text-foreground/50 hover:text-foreground transition-colors"
            onClick={() => setIsWishlistOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-8 py-4">
          {wishlist.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
              <Heart size={48} className="text-border" />
              <p className="text-muted font-medium">Your wishlist is empty.</p>
              <Link 
                href="/shop"
                className="px-10 py-3 rounded-full border border-border text-xs font-bold uppercase tracking-widest hover:bg-foreground hover:text-background transition-all duration-500"
                onClick={() => setIsWishlistOpen(false)}
              >
                Discover Pieces
              </Link>
            </div>
          ) : (
            <div className="space-y-8">
              {wishlist.map(item => (
                <div key={item.id} className="flex gap-6 group">
                  <Link 
                    href={`/product/${item.id}`}
                    onClick={() => setIsWishlistOpen(false)}
                    className="w-24 h-32 rounded-lg overflow-hidden bg-secondary border border-border flex-shrink-0"
                  >
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  </Link>
                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div className="space-y-1">
                      <div className="flex justify-between items-start">
                        <h4 className="text-sm font-semibold text-foreground tracking-tight">{item.name}</h4>
                        <span className="text-sm font-medium text-muted">₹{item.price}</span>
                      </div>
                      <p className="text-[10px] uppercase tracking-widest text-accent font-bold">{item.category}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <button 
                        className="text-[10px] uppercase font-bold tracking-[0.2em] text-foreground/40 hover:text-accent transition-colors"
                        onClick={() => removeFromWishlist(item.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .animate-slide-in-right {
          animation: slideInRight 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
}
