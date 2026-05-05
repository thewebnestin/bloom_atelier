"use client";
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import CartDrawer from '@/components/cart/CartDrawer';
import { products } from '@/core/constants/ProductData';
import { useShop } from '@/core/shop/ShopContext';
import { ArrowLeft, Plus, Minus, ShieldCheck, Truck, RefreshCw } from 'lucide-react';
import gsap from 'gsap';

export default function ProductDetails() {
  const { id } = useParams();
  const router = useRouter();
  const { addToCart, setIsCartOpen } = useShop();
  const product = products.find(p => p.id === parseInt(id));
  
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (product) {
      setSelectedColor(product.variants.colors[0]);
      setSelectedSize(product.variants.sizes[0]);
      
      gsap.from(".product-reveal", {
        y: 30,
        opacity: 0,
        duration: 1,
        stagger: 0.1,
        ease: 'power3.out'
      });
    }
  }, [product]);

  if (!product) return <div className="h-screen flex items-center justify-center">Product not found</div>;

  return (
    <main className="bg-background min-h-screen">
      <Navbar />
      <CartDrawer />

      <div className="container mx-auto px-8 pt-40 pb-20">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted hover:text-accent transition-colors mb-12"
        >
          <ArrowLeft size={14} /> Back to Catalog
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          {/* Image Section */}
          <div className="product-reveal space-y-8">
            <div className="aspect-square rounded-[3rem] overflow-hidden border border-border bg-secondary group">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105" 
              />
            </div>
            <div className="grid grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="aspect-square rounded-2xl border border-border bg-secondary overflow-hidden opacity-40 hover:opacity-100 transition-opacity cursor-pointer">
                  <img src={product.image} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>

          {/* Details Section */}
          <div className="product-reveal flex flex-col justify-center space-y-12">
            <div className="space-y-4">
              <span className="text-[10px] uppercase tracking-[0.4em] text-accent font-bold">{product.category}</span>
              <h1 className="text-6xl font-extrabold tracking-tighter uppercase leading-none">{product.name}</h1>
              <p className="text-2xl font-bold text-foreground/70">${product.price}</p>
            </div>

            <p className="text-muted text-lg leading-relaxed font-medium max-w-lg">
              {product.description}
            </p>

            <div className="space-y-10">
              {/* Color Selection */}
              <div className="space-y-4">
                <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted">Select Color Palette</label>
                <div className="flex gap-4">
                  {product.variants.colors.map(color => (
                    <button 
                      key={color.name}
                      onClick={() => setSelectedColor(color)}
                      className={`w-12 h-12 rounded-full border-2 transition-all duration-500 hover:scale-110 ${selectedColor?.name === color.name ? 'border-accent scale-110' : 'border-transparent'}`}
                      style={{ backgroundColor: color.hex }}
                    />
                  ))}
                </div>
              </div>

              {/* Size Selection */}
              <div className="space-y-4">
                <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted">Scale</label>
                <div className="flex gap-3">
                  {product.variants.sizes.map(size => (
                    <button 
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-8 py-3 rounded-full border text-[11px] font-bold uppercase tracking-widest transition-all duration-500 ${selectedSize === size ? 'bg-foreground text-background border-foreground shadow-xl' : 'border-border text-foreground hover:border-muted'}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity and Add to Cart */}
              <div className="flex items-center gap-6 pt-4">
                <div className="flex items-center border border-border rounded-full p-2 bg-secondary">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 hover:text-accent transition-colors"
                  ><Minus size={16} /></button>
                  <span className="w-12 text-center font-bold">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 hover:text-accent transition-colors"
                  ><Plus size={16} /></button>
                </div>

                <button 
                  onClick={() => { addToCart(product, { color: selectedColor.name, size: selectedSize }, quantity); setIsCartOpen(true); }}
                  className="flex-1 py-5 rounded-full bg-accent text-white font-bold text-sm tracking-widest uppercase transition-all duration-500 hover:opacity-90 shadow-2xl shadow-accent/20"
                >
                  Secure Commission
                </button>
              </div>
            </div>

            {/* Studio Guarantees */}
            <div className="grid grid-cols-3 gap-8 pt-10 border-t border-border">
               <div className="flex flex-col items-center text-center gap-3">
                  <ShieldCheck size={20} className="text-accent" />
                  <span className="text-[9px] uppercase font-bold tracking-widest text-muted">Authenticity Guaranteed</span>
               </div>
               <div className="flex flex-col items-center text-center gap-3">
                  <Truck size={20} className="text-accent" />
                  <span className="text-[9px] uppercase font-bold tracking-widest text-muted">Global Express</span>
               </div>
               <div className="flex flex-col items-center text-center gap-3">
                  <RefreshCw size={20} className="text-accent" />
                  <span className="text-[9px] uppercase font-bold tracking-widest text-muted">Lifetime Support</span>
               </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="py-20 border-t border-border mt-20">
         <div className="container mx-auto px-8 text-center">
            <p className="text-[10px] uppercase font-bold tracking-[0.4em] text-muted/30">© 2026 Bloom Atelier Studio Reserve</p>
         </div>
      </footer>
    </main>
  );
}
