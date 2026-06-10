"use client";
import React, { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Link from 'next/link';
import CartDrawer from '@/components/cart/CartDrawer';
import WishlistDrawer from '@/components/cart/WishlistDrawer';
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/shop/ProductCard';
import { useShop } from '@/core/shop/ShopContext';
import { ArrowLeft, Plus, Minus, ShieldCheck, Heart, Truck, RotateCcw } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function ProductDetails() {
  const { id } = useParams();
  const router = useRouter();
  const { products, loadingProducts, addToCart, setIsCartOpen, toggleWishlist, wishlist } = useShop();
  const product = products.find(p => String(p.id) === String(id));
  
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('description');
  const containerRef = useRef(null);

  const relatedProducts = products
    .filter(p => p.category === product?.category && String(p.id) !== String(product?.id))
    .slice(0, 4);

  useEffect(() => {
    if (product) {
      requestAnimationFrame(() => {
        setSelectedColor(product.variants.colors[0]);
        setSelectedSize(product.variants.sizes[0]);
      });
      
      // Page Entrance
      const tl = gsap.timeline();
      tl.from(".reveal-title", { y: 100, opacity: 0, duration: 1.2, ease: 'power4.out' })
        .from(".reveal-image", { scale: 1.05, opacity: 0, duration: 1.5, ease: 'power3.out' }, "-=0.8")
        .from(".reveal-info", { x: 30, opacity: 0, duration: 1, stagger: 0.1 }, "-=1");
    }
    
    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [product]);

  if (loadingProducts) {
    return (
      <div className="h-screen flex items-center justify-center bg-background text-foreground text-xs uppercase tracking-[0.3em] font-extrabold animate-pulse">
        Loading Arrangement...
      </div>
    );
  }

  if (!product) return <div className="h-screen flex items-center justify-center text-foreground font-bold">Product not found</div>;
  if (!selectedColor || !selectedSize) return <div className="h-screen flex items-center justify-center bg-background" />;

  const isWishlisted = wishlist.some(item => item.id === product.id);

  return (
    <main ref={containerRef} className="bg-background min-h-screen selection:bg-accent/30">
      <Navbar />
      <CartDrawer />
      <WishlistDrawer />

      {/* Split Screen Hero */}
      <div className="flex flex-col lg:flex-row min-h-screen">
        
        {/* Left: Product Images Space (Not full bleed, with white card container and vertical thumbnails) */}
        <div className="w-full lg:w-1/2 lg:h-screen lg:sticky lg:top-0 bg-secondary flex flex-col p-6 sm:p-12 lg:p-16 relative pt-24">
          
          {/* Back Button with a clear gap below it */}
          <div className="mb-8 lg:mb-12">
            <button 
              onClick={() => router.back()}
              className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.4em] text-foreground hover:text-accent transition-colors z-30"
            >
              <ArrowLeft size={16} /> Back to Shop
            </button>
          </div>

          {/* Centered Images Container */}
          <div className="flex-1 flex flex-col justify-center items-center">
            <div className="flex flex-col-reverse sm:flex-row items-center sm:items-start gap-4 sm:gap-6 w-full max-w-xl reveal-image">
              
              {/* Column of Thumbnails (Left side) */}
              <div className="flex flex-row sm:flex-col gap-3 overflow-x-auto sm:overflow-y-auto scrollbar-none py-2 sm:py-0 w-full sm:w-auto justify-center sm:justify-start">
                {(product.images || [product.image]).map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImageIndex(index)}
                    className={`w-14 h-14 sm:w-16 sm:h-16 rounded-md overflow-hidden border flex-shrink-0 transition-all duration-300 ${
                      activeImageIndex === index 
                        ? 'border-accent bg-background p-0.5' 
                        : 'border-border/40 hover:border-foreground/40'
                    }`}
                  >
                    <img src={img} className="w-full h-full object-cover rounded animate-fadeIn" />
                  </button>
                ))}
              </div>

              {/* Main Image White Border Container (centered with borders like the screenshot) */}
              <div className="bg-white p-3 sm:p-5 border border-border shadow-sm rounded-lg relative aspect-[3/4] h-[38vh] sm:h-[45vh] lg:h-[50vh] max-w-full flex items-center justify-center overflow-hidden">
                <img 
                  src={product.images ? product.images[activeImageIndex] : product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover rounded"
                />
                
                {/* Wishlist Button Overlay */}
                <button 
                  onClick={() => toggleWishlist(product)}
                  className="absolute bottom-4 right-4 p-3 rounded-full bg-background/10 backdrop-blur-3xl border border-white/10 text-white hover:bg-accent hover:text-white transition-all duration-500 z-30"
                >
                  <Heart size={18} fill={isWishlisted ? "currentColor" : "none"} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Scrollable Content */}
        <div className="w-full lg:w-1/2 px-6 sm:px-12 md:px-20 pt-8 lg:pt-36 pb-16 lg:pb-20 space-y-6 sm:space-y-8">
          
          {/* Breadcrumbs */}
          <div className="reveal-info flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest text-foreground/40">
            <Link href="/" className="hover:text-accent transition-colors">Home</Link>
            <span>/</span>
            <Link href="/shop" className="hover:text-accent transition-colors">Shop</Link>
            <span>/</span>
            <span className="text-foreground/80 truncate max-w-[150px] sm:max-w-none">{product.name}</span>
          </div>

          {/* Main Title & Price */}
          <div className="space-y-4">
            <div className="reveal-info flex items-center gap-4">
              <span className="px-4 py-1.5 rounded-full border border-border text-accent text-[9px] font-extrabold uppercase tracking-[0.5em]">
                {product.category}
              </span>
              <span className="text-muted/30 text-[9px] font-bold uppercase tracking-widest">Item #{product.id}</span>
            </div>
            
            <h1 className="reveal-title text-3xl sm:text-5xl lg:text-[6.5vw] font-extrabold tracking-tighter uppercase leading-[0.9] text-foreground">
              <span className="lg:hidden">{product.name}</span>
              <span className="hidden lg:block">
                {product.name.split(' ').map((word, i) => (
                  <span key={i} className="block">{word}</span>
                ))}
              </span>
            </h1>
            
            <div className="reveal-info flex justify-between items-end border-b border-border pb-6">
              <p className="text-2xl sm:text-4xl font-medium text-muted">₹{product.price}</p>
              <p className="text-[10px] uppercase font-bold tracking-widest text-muted/40">Made to Last</p>
            </div>
          </div>

          {/* Configuration Space */}
          <div className="reveal-info space-y-6 pt-2">
            {/* Palette */}
            <div className="space-y-3">
              <label className="text-[10px] uppercase tracking-[0.4em] font-bold text-muted">
                Choose Color: <span className="text-foreground font-black ml-2">{selectedColor?.name}</span>
              </label>
              <div className="flex gap-3">
                {product.variants.colors.map(color => (
                  <button 
                    key={color.name}
                    onClick={() => setSelectedColor(color)}
                    className="group relative"
                  >
                    <div 
                      className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full transition-all duration-500 border ${
                        selectedColor?.name === color.name 
                          ? 'scale-110 border-accent' 
                          : 'scale-100 border-transparent opacity-50 hover:opacity-100'
                      }`} 
                      style={{ backgroundColor: color.hex }} 
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Scale */}
            <div className="space-y-3">
              <label className="text-[10px] uppercase tracking-[0.4em] font-bold text-muted">Choose Size</label>
              <div className="flex flex-wrap gap-2.5">
                {product.variants.sizes.map(size => (
                  <button 
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 border text-[9px] font-bold uppercase tracking-widest transition-all duration-300 rounded-full ${
                      selectedSize === size 
                        ? 'bg-foreground text-background border-foreground shadow-sm' 
                        : 'border-border text-muted hover:border-accent'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Cohesive Styled Container: Add to Collection, Badges & Tabs */}
          <div className="reveal-info bg-secondary/40 text-foreground p-5 sm:p-8 border border-border space-y-6 sm:space-y-8 shadow-sm rounded-2xl">
            
            {/* Purchase Row */}
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Quantity Selector */}
              <div className="flex items-center justify-between bg-background border border-border px-2.5 py-1 w-full sm:w-auto rounded-full">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))} 
                  className="p-3 text-foreground/40 hover:text-foreground transition-colors"
                >
                  <Minus size={14} />
                </button>
                <span className="w-8 text-center font-bold text-xs text-foreground">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)} 
                  className="p-3 text-foreground/40 hover:text-foreground transition-colors"
                >
                  <Plus size={14} />
                </button>
              </div>

              {/* Add to Collection Button */}
              <button 
                onClick={() => { 
                  addToCart(product, { color: selectedColor.name, size: selectedSize }, quantity); 
                  setIsCartOpen(true); 
                }}
                className="flex-1 bg-foreground text-background font-bold text-xs py-4 uppercase tracking-[0.3em] transition-all hover:opacity-90 active:scale-[0.98] flex items-center justify-center rounded-full"
              >
                Add to Collection
              </button>
            </div>

            {/* Badges Box Grid */}
            <div className="grid grid-cols-3 gap-3">
              <div className="border border-border/80 py-5 px-2 flex flex-col items-center justify-center text-center space-y-2 bg-background/50 rounded-xl">
                <Truck className="text-yellow-600" size={20} />
                <span className="text-[8px] font-extrabold uppercase tracking-widest text-foreground leading-tight">
                  Free<br />Shipping
                </span>
              </div>
              <div className="border border-border/80 py-5 px-2 flex flex-col items-center justify-center text-center space-y-2 bg-background/50 rounded-xl">
                <RotateCcw className="text-yellow-600" size={20} />
                <span className="text-[8px] font-extrabold uppercase tracking-widest text-foreground leading-tight">
                  30 Day<br />Returns
                </span>
              </div>
              <div className="border border-border/80 py-5 px-2 flex flex-col items-center justify-center text-center space-y-2 bg-background/50 rounded-xl">
                <ShieldCheck className="text-emerald-600" size={20} />
                <span className="text-[8px] font-extrabold uppercase tracking-widest text-foreground leading-tight">
                  100%<br />Authentic
                </span>
              </div>
            </div>

            {/* Switchable Tabs Details */}
            <div className="space-y-5 pt-2 border-t border-border">
              <div className="flex border-b border-border text-[9px] font-bold uppercase tracking-[0.25em]">
                {['description', 'details', 'shipping'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 pb-3 text-center transition-all border-b-2 ${
                      activeTab === tab 
                        ? 'border-accent text-foreground font-extrabold' 
                        : 'border-transparent text-foreground/40 hover:text-foreground'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="text-xs text-foreground/80 leading-relaxed min-h-[70px] font-medium pt-2">
                {activeTab === 'description' && (
                  <p className="animate-fadeIn">{product.description} Handcrafted to look beautiful and last forever.</p>
                )}
                {activeTab === 'details' && (
                  <ul className="space-y-2.5 animate-fadeIn">
                    <li><span className="text-foreground/40 uppercase text-[9px] tracking-wider block sm:inline mr-2">Category:</span> {product.category}</li>
                    <li><span className="text-foreground/40 uppercase text-[9px] tracking-wider block sm:inline mr-2">Materials:</span> Premium silk & flexible steel wire</li>
                    <li><span className="text-foreground/40 uppercase text-[9px] tracking-wider block sm:inline mr-2">Care:</span> Clean with dry cloth. No water needed.</li>
                  </ul>
                )}
                {activeTab === 'shipping' && (
                  <p className="animate-fadeIn">
                    Free shipping across India. Dispatched in 2-3 business days. Shipped in secure, protective packaging. Note: No Cash on Delivery (COD).
                  </p>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Related Products: Vertical Scoped View */}
      {relatedProducts.length > 0 && (
        <section className="py-20 sm:py-40 border-t border-border bg-background">
          <div className="container mx-auto px-6 sm:px-8">
            <div className="flex flex-col items-center text-center space-y-4 mb-12 sm:mb-24">
              <span className="text-accent text-[11px] font-bold uppercase tracking-[0.6em]">Related</span>
              <h2 className="text-4xl sm:text-5xl lg:text-8xl font-extrabold tracking-tighter uppercase leading-[0.85]">
                You May <br /> Also Like.
              </h2>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-12">
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
