"use client";
import React, { useState } from 'react';
import { useShop } from '@/core/shop/ShopContext';
import { X } from 'lucide-react';

export default function ProductModal({ product, isOpen, onClose }) {
  const { addToCart } = useShop();
  const [selectedColor, setSelectedColor] = useState(product?.variants.colors[0]);
  const [selectedSize, setSelectedSize] = useState(product?.variants.sizes[0]);

  if (!isOpen || !product) return null;

  return (
    <div 
      className="fixed inset-0 z-[2000] flex items-center justify-center p-6 md:p-12 animate-fade-in"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/30 backdrop-blur-3xl" />
      
      <div 
        className="relative w-full max-w-[1200px] bg-background rounded-2xl overflow-hidden border border-border shadow-2xl flex flex-col md:flex-row h-[90vh] md:h-auto animate-slide-up"
        onClick={e => e.stopPropagation()}
      >
        <button 
          className="absolute top-8 right-8 z-10 p-2 text-foreground/50 hover:text-foreground transition-colors"
          onClick={onClose}
        >
          <X size={24} />
        </button>

        <div className="w-full md:w-[55%] bg-secondary flex items-center justify-center overflow-hidden">
          <img 
            src={selectedColor?.image || product.image} 
            alt={product.name} 
            className="w-full h-full object-cover transition-transform duration-[2s] hover:scale-105"
          />
        </div>

        <div className="w-full md:w-[45%] p-10 md:p-16 flex flex-col justify-center overflow-y-auto">
          <div className="space-y-8">
            <div className="space-y-3">
              <span className="text-[10px] uppercase tracking-[0.3em] text-muted">{product.category}</span>
              <h2 className="text-5xl font-semibold tracking-tighter leading-none">{product.name}</h2>
              <p className="text-2xl font-medium text-foreground/70">₹{product.price}</p>
            </div>

            <div className="h-[1px] bg-border w-full" />

            <div className="space-y-6">
              <div className="space-y-4">
                <label className="text-[10px] uppercase tracking-widest text-muted font-bold">Choose Color</label>
                <div className="flex gap-4">
                  {product.variants.colors.map(color => (
                    <button 
                      key={color.name}
                      className={`w-9 h-9 rounded-full border-2 transition-all duration-500 hover:scale-110 ${selectedColor.name === color.name ? 'border-foreground scale-110' : 'border-transparent'}`}
                      style={{ backgroundColor: color.hex }}
                      onClick={() => setSelectedColor(color)}
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] uppercase tracking-widest text-muted font-bold">Choose Size</label>
                <div className="flex flex-wrap gap-3">
                  {product.variants.sizes.map(size => (
                    <button 
                      key={size}
                      className={`px-4 py-2 border text-[10px] font-bold uppercase tracking-widest transition-all duration-500 rounded-none ${selectedSize === size ? 'bg-foreground text-background border-foreground' : 'border-border text-foreground hover:border-muted'}`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button 
              className="w-full py-4 bg-foreground text-background font-bold text-xs tracking-[0.2em] uppercase transition-all duration-500 hover:opacity-90 hover:scale-[1.01] active:scale-[0.99] rounded-none"
              onClick={() => { addToCart(product, { color: selectedColor.name, size: selectedSize }); onClose(); }}
            >
              Add to Collection
            </button>

            <p className="text-[9px] uppercase tracking-[0.25em] font-extrabold text-accent text-center bg-accent/10 py-3 rounded-none">
              Free Shipping Across India • No COD • No Returns
            </p>

            <p className="text-sm leading-relaxed text-muted font-medium">
              {product.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
