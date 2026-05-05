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
        className="relative w-full max-w-[1200px] bg-background rounded-[3.5rem] overflow-hidden border border-border shadow-2xl flex flex-col md:flex-row h-[90vh] md:h-auto animate-slide-up"
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
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover transition-transform duration-[2s] hover:scale-105"
          />
        </div>

        <div className="w-full md:w-[45%] p-10 md:p-16 flex flex-col justify-center overflow-y-auto">
          <div className="space-y-8">
            <div className="space-y-3">
              <span className="text-[10px] uppercase tracking-[0.3em] text-muted">{product.category}</span>
              <h2 className="text-5xl font-semibold tracking-tighter leading-none">{product.name}</h2>
              <p className="text-2xl font-medium text-foreground/70">${product.price}</p>
            </div>

            <div className="h-[1px] bg-border w-full" />

            <div className="space-y-6">
              <div className="space-y-4">
                <label className="text-[10px] uppercase tracking-widest text-muted font-bold">Palette</label>
                <div className="flex gap-4">
                  {product.variants.colors.map(color => (
                    <button 
                      key={color.name}
                      className={`w-10 h-10 rounded-full border-2 transition-all duration-500 hover:scale-110 ${selectedColor.name === color.name ? 'border-foreground scale-110' : 'border-transparent'}`}
                      style={{ backgroundColor: color.hex }}
                      onClick={() => setSelectedColor(color)}
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] uppercase tracking-widest text-muted font-bold">Scale</label>
                <div className="flex gap-3">
                  {product.variants.sizes.map(size => (
                    <button 
                      key={size}
                      className={`px-6 py-2.5 rounded-full border text-[13px] font-medium transition-all duration-500 ${selectedSize === size ? 'bg-foreground text-background border-foreground' : 'border-border text-foreground hover:border-muted'}`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button 
              className="w-full py-5 rounded-full bg-foreground text-background font-bold text-sm tracking-widest uppercase transition-all duration-500 hover:opacity-90 hover:scale-[1.01] active:scale-[0.99] shadow-xl"
              onClick={() => { addToCart(product, { color: selectedColor.name, size: selectedSize }); onClose(); }}
            >
              Secure Arrangement
            </button>

            <p className="text-sm leading-relaxed text-muted font-medium">
              {product.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
