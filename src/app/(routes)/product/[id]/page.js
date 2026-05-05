"use client";
import React, { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import CartDrawer from '@/components/cart/CartDrawer';
import WishlistDrawer from '@/components/cart/WishlistDrawer';
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/shop/ProductCard';
import { products } from '@/core/constants/ProductData';
import { useShop } from '@/core/shop/ShopContext';
import { ArrowLeft, Plus, Minus, ShieldCheck, Heart, Sparkles, Fingerprint, History } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function ProductDetails() {
  const { id } = useParams();
  const router = useRouter();
  const { addToCart, setIsCartOpen, toggleWishlist, wishlist } = useShop();
  const product = products.find(p => p.id === parseInt(id));
  
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const containerRef = useRef(null);
  const imageRef = useRef(null);

  const relatedProducts = products
    .filter(p => p.category === product?.category && p.id !== product?.id)
    .slice(0, 4);

  useEffect(() => {
    if (product) {
      setSelectedColor(product.variants.colors[0]);
      setSelectedSize(product.variants.sizes[0]);
      
      // Page Entrance
      const tl = gsap.timeline();
      tl.from(".reveal-title", { y: 100, opacity: 0, duration: 1.2, ease: 'power4.out' })
        .from(".reveal-image", { scale: 1.2, opacity: 0, duration: 1.5, ease: 'power3.out' }, "-=0.8")
        .from(".reveal-info", { x: 30, opacity: 0, duration: 1, stagger: 0.1 }, "-=1");

      // Parallax effect for the main image
      gsap.to(imageRef.current, {
        yPercent: 20,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: true
        }
      });
    }
    
    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [product]);

  if (!product) return <div className="h-screen flex items-center justify-center">Product not found</div>;
  if (!selectedColor || !selectedSize) return <div className="h-screen flex items-center justify-center bg-background" />;

  const isWishlisted = wishlist.some(item => item.id === product.id);

  return (
    <main ref={containerRef} className="bg-background min-h-screen selection:bg-accent/30">
      <Navbar />
      <CartDrawer />
      <WishlistDrawer />

      {/* Split Screen Hero */}
      <div className="flex flex-col lg:flex-row min-h-screen">
        
        {/* Left: Fixed/Parallax Image Space */}
        <div className="w-full lg:w-1/2 h-[70vh] lg:h-screen lg:sticky lg:top-0 overflow-hidden bg-secondary">
          <div ref={imageRef} className="reveal-image w-full h-[120%] absolute -top-[10%]">
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Back Button Overlay */}
          <button 
            onClick={() => router.back()}
            className="absolute top-32 left-8 md:left-12 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.4em] text-foreground mix-blend-difference hover:text-accent transition-colors z-30"
          >
            <ArrowLeft size={16} /> Studio Catalog
          </button>

          {/* Wishlist Overlay */}
          <button 
            onClick={() => toggleWishlist(product)}
            className="absolute bottom-12 right-12 p-6 rounded-full bg-background/10 backdrop-blur-3xl border border-white/10 text-white hover:bg-accent transition-all duration-500 z-30"
          >
            <Heart size={24} fill={isWishlisted ? "currentColor" : "none"} />
          </button>
        </div>

        {/* Right: Scrollable Content */}
        <div className="w-full lg:w-1/2 px-8 md:px-20 pt-12 lg:pt-40 pb-20 space-y-24">
          
          {/* Main Title & Price */}
          <div className="space-y-8">
            <div className="reveal-info flex items-center gap-4">
              <span className="px-4 py-1.5 rounded-full border border-border text-accent text-[9px] font-extrabold uppercase tracking-[0.5em]">
                {product.category}
              </span>
              <span className="text-muted/30 text-[9px] font-bold uppercase tracking-widest">Reserve No. {product.id}04</span>
            </div>
            
            <h1 className="reveal-title text-6xl md:text-[7vw] font-extrabold tracking-tighter uppercase leading-[0.8] text-foreground">
              {product.name.split(' ').map((word, i) => (
                <span key={i} className="block">{word}</span>
              ))}
            </h1>
            
            <div className="reveal-info flex justify-between items-end border-b border-border pb-12">
              <p className="text-4xl font-medium text-muted">${product.price}</p>
              <p className="text-[10px] uppercase font-bold tracking-widest text-muted/40">Includes Lifetime Restoration</p>
            </div>
          </div>

          {/* Description & Narrative */}
          <div className="reveal-info space-y-12">
            <div className="space-y-6">
              <h3 className="text-[11px] uppercase tracking-[0.4em] font-bold text-accent">The Narrative</h3>
              <p className="text-xl md:text-2xl text-muted leading-relaxed font-medium max-w-xl">
                {product.description} This piece represents our commitment to permanent beauty, handcrafted in our studio using signature structural techniques.
              </p>
            </div>

            {/* Artisanal Features */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-accent">
                  <Fingerprint size={18} />
                  <span className="text-[10px] uppercase font-extrabold tracking-widest">Hand-Wired</span>
                </div>
                <p className="text-[13px] text-muted leading-relaxed">Each petal is individually formed and tension-tested for permanent structural integrity.</p>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-accent">
                  <History size={18} />
                  <span className="text-[10px] uppercase font-extrabold tracking-widest">Permanent Flora</span>
                </div>
                <p className="text-[13px] text-muted leading-relaxed">A one-time investment in beauty that defies the ephemeral nature of standard botanicals.</p>
              </div>
            </div>
          </div>

          {/* Configuration Space */}
          <div className="reveal-info space-y-16 pt-12 border-t border-border">
            {/* Palette */}
            <div className="space-y-6">
              <label className="text-[10px] uppercase tracking-[0.4em] font-bold text-muted">Palette Selection</label>
              <div className="flex gap-6">
                {product.variants.colors.map(color => (
                  <button 
                    key={color.name}
                    onClick={() => setSelectedColor(color)}
                    className="group relative"
                  >
                    <div className={`w-16 h-16 rounded-full transition-all duration-700 ${selectedColor?.name === color.name ? 'scale-110 shadow-2xl' : 'scale-100 opacity-40 hover:opacity-100'}`} style={{ backgroundColor: color.hex }} />
                    <span className={`absolute -bottom-6 left-1/2 -translate-x-1/2 text-[8px] uppercase font-bold tracking-widest whitespace-nowrap transition-all ${selectedColor?.name === color.name ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
                      {color.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Scale */}
            <div className="space-y-6">
              <label className="text-[10px] uppercase tracking-[0.4em] font-bold text-muted">Scale & Proportion</label>
              <div className="flex flex-wrap gap-4">
                {product.variants.sizes.map(size => (
                  <button 
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-10 py-5 rounded-full border text-[10px] font-bold uppercase tracking-widest transition-all duration-500 ${selectedSize === size ? 'bg-foreground text-background border-foreground shadow-xl' : 'border-border text-muted hover:border-accent'}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Purchase Action */}
          <div className="reveal-info flex flex-col sm:flex-row gap-6 pt-12">
            <div className="flex items-center bg-secondary rounded-full border border-border px-4">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-4 text-muted hover:text-accent"><Minus size={18} /></button>
              <span className="w-12 text-center font-bold">{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} className="p-4 text-muted hover:text-accent"><Plus size={18} /></button>
            </div>
            <button 
              onClick={() => { addToCart(product, { color: selectedColor.name, size: selectedSize }, quantity); setIsCartOpen(true); }}
              className="flex-1 py-6 rounded-full bg-accent text-white font-extrabold text-[11px] tracking-[0.5em] uppercase transition-all duration-700 hover:scale-[1.02] active:scale-[0.98] shadow-2xl shadow-accent/40 flex items-center justify-center gap-4"
            >
              <Sparkles size={16} /> Secure Artifact
            </button>
          </div>
        </div>
      </div>

      {/* Related Products: Vertical Scoped View */}
      {relatedProducts.length > 0 && (
        <section className="py-40 border-t border-border bg-background">
          <div className="container mx-auto px-8">
            <div className="flex flex-col items-center text-center space-y-6 mb-24">
              <span className="text-accent text-[11px] font-bold uppercase tracking-[0.6em]">Studio Curation</span>
              <h2 className="text-5xl md:text-8xl font-extrabold tracking-tighter uppercase leading-[0.85]">
                Complementary <br /> Pieces.
              </h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
              {relatedProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </main>
  );
}
