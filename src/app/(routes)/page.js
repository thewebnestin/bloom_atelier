"use client";
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Hero from '@/components/shop/Hero';
import { ProductGrid } from '@/components/shop/ProductGrid';
import ProductModal from '@/components/shop/ProductModal';
import CartDrawer from '@/components/cart/CartDrawer';
import WishlistDrawer from '@/components/cart/WishlistDrawer';
import Footer from '@/components/layout/Footer';
import { Palette, Feather, ShieldCheck, ArrowUpRight, Flower2 } from 'lucide-react';

export default function Home() {


  return (
    <main className="relative bg-background min-h-screen">
      <Navbar />
      
      {/* 2026 Interactive Hero Sequence */}
      <Hero />
      
      <div className="bg-background relative z-20">
        <ProductGrid featuredOnly={true} />
      </div>

      <section id="atelier" className="py-20 sm:py-36 border-t border-border bg-secondary/35 relative z-20">
        <div className="container mx-auto px-6 sm:px-8">
          
          {/* Section Header */}
          <div className="flex flex-col items-center text-center space-y-4 mb-16 sm:mb-24">
            <span className="text-accent text-[10px] font-bold uppercase tracking-[0.6em]">Our Work</span>
            <h2 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tighter uppercase leading-[0.9] text-foreground">
              The Archive <br />
              <span className="opacity-30">Collection.</span>
            </h2>
            <p className="text-muted text-sm font-medium max-w-sm">
              Discover the design and creation details of our permanent arrangements.
            </p>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8">
            
            {/* Bento Item 1: Made to Last */}
            <div className="md:col-span-8 bg-background p-8 sm:p-12 md:p-16 border border-border rounded-2xl flex flex-col justify-center space-y-6 sm:space-y-8 hover:-translate-y-1 hover:shadow-2xl hover:border-accent/40 transition-all duration-500 ease-butter group shadow-sm">
              <div className="space-y-3">
                 <span className="text-[10px] uppercase tracking-[0.4em] text-foreground/40 font-extrabold block">Atelier Standards</span>
                 <h3 className="text-3xl sm:text-5xl font-extrabold tracking-tighter leading-none text-foreground uppercase">
                    Made To Last.
                 </h3>
              </div>
              <p className="text-muted text-base sm:text-lg leading-relaxed max-w-md font-medium">
                Every single flower stem is created by hand in our studio. We make flowers that look beautiful and stay perfect forever.
              </p>
              <div className="flex items-center gap-6">
                 <button className="w-full sm:w-auto text-center px-10 py-4 bg-foreground text-background text-xs font-bold uppercase tracking-widest rounded-full hover:bg-accent hover:text-accent-foreground transition-all duration-500 shadow-md">
                    Discover More
                 </button>
              </div>
            </div>
            
            {/* Bento Item 2: Verified Archive */}
            <div className="md:col-span-4 bg-background p-8 sm:p-12 md:p-12 border border-border rounded-2xl flex flex-col items-start justify-between hover:-translate-y-1 hover:shadow-2xl hover:border-accent/40 transition-all duration-500 ease-butter group gap-8 sm:gap-12 shadow-sm">
              <div className="p-4 rounded-xl bg-secondary/50 border border-border text-accent group-hover:scale-110 group-hover:bg-accent/10 transition-all duration-500">
                <ShieldCheck size={32} strokeWidth={1.5} />
              </div>
              <div className="space-y-3">
                 <h3 className="text-2xl sm:text-3xl font-bold tracking-tight">Verified Archive</h3>
                 <p className="text-muted text-sm leading-relaxed">Each piece is numbered and registered to prove it is genuine.</p>
              </div>
              <div className="w-12 h-[1px] bg-border group-hover:w-full transition-all duration-700" />
            </div>

            {/* Bento Item 3: Materials */}
            <div className="md:col-span-4 bg-background p-8 sm:p-12 md:p-12 border border-border rounded-2xl flex flex-col justify-between hover:-translate-y-1 hover:shadow-2xl hover:border-accent/40 transition-all duration-500 ease-butter group gap-8 sm:gap-12 shadow-sm">
              <div className="flex justify-between items-start w-full">
                 <div className="w-12 h-12 rounded-full border border-border flex items-center justify-center text-accent group-hover:bg-accent/10 transition-colors">
                    <Palette size={20} />
                 </div>
                 <ArrowUpRight className="text-muted/60 group-hover:text-accent group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300" size={20} />
              </div>
              <div className="space-y-3">
                 <h4 className="text-2xl font-bold tracking-tight">Materials</h4>
                 <p className="text-muted text-sm leading-relaxed">We use strong wires and high-quality silk so they keep their shape.</p>
              </div>
            </div>

            {/* Bento Item 4: Long Lasting */}
            <div className="md:col-span-8 bg-background p-8 sm:p-12 md:p-12 border border-border rounded-2xl flex flex-col sm:flex-row items-center gap-6 sm:gap-10 hover:-translate-y-1 hover:shadow-2xl hover:border-accent/40 transition-all duration-500 ease-butter group shadow-sm">
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-xl border border-border flex-shrink-0 grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 overflow-hidden shadow-sm">
                 <img src="/luxury_pipe_cleaner_bouquet_1777975715581.png" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 space-y-3">
                 <h4 className="text-2xl font-bold tracking-tight">Long Lasting</h4>
                 <p className="text-muted text-sm leading-relaxed max-w-md">
                   No need to buy weekly flowers. A one-time choice that stays beautiful forever, bringing eternal nature inside.
                 </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      <section id="feedbacks" className="py-32 bg-secondary/20 border-t border-b border-border relative z-20">
        <div className="container mx-auto px-6 sm:px-8">
          <div className="flex flex-col items-center text-center space-y-6 mb-20">
            <span className="text-accent text-[10px] font-bold uppercase tracking-[0.6em]">Reviews</span>
            <h2 className="text-5xl md:text-7xl font-extrabold tracking-tighter uppercase leading-[0.9] text-foreground">
              What <br />
              <span className="opacity-30">They Say.</span>
            </h2>
            <p className="text-muted text-sm font-medium max-w-sm">
              Read reviews from customers who bought our handmade flowers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote: "I bought a custom bouquet for our dining table and it looks amazing. Everyone who visits asks where we got it from!",
                author: "Aarav Mehta",
                location: "Kochi, Kerala",
                verified: true,
                rating: 5,
              },
              {
                quote: "The quality is excellent and they look so real. I love that I don't have to water them or buy new flowers every week.",
                author: "Ananya Iyer",
                location: "Trivandrum, Kerala",
                verified: true,
                rating: 5,
              },
              {
                quote: "Very neat packing and fast delivery to Kozhikode. The design matches my room perfectly. Worth every rupee.",
                author: "Kabir Sen",
                location: "Kozhikode, Kerala",
                verified: true,
                rating: 5,
              }
            ].map((feed, i) => (
              <div 
                key={i} 
                className="bg-background p-8 sm:p-10 rounded-xl border border-border flex flex-col justify-between space-y-8 hover:scale-[1.02] transition-all duration-500 ease-butter group"
              >
                <div className="space-y-6">
                  {/* Rating Stars */}
                  <div className="flex gap-1 text-accent text-sm">
                    ★ ★ ★ ★ ★
                  </div>
                  <p className="text-muted text-base leading-relaxed font-medium italic group-hover:text-foreground transition-colors duration-300">
                    "{feed.quote}"
                  </p>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-border/60">
                  <div>
                    <h4 className="text-sm font-bold tracking-tight text-foreground">{feed.author}</h4>
                    <p className="text-[10px] uppercase tracking-widest text-muted font-semibold mt-1">{feed.location}</p>
                  </div>
                  {feed.verified && (
                    <span className="text-[8px] uppercase tracking-widest text-foreground/70 bg-foreground/5 border border-border px-3 py-1.5 rounded-full font-bold">
                      Verified Customer
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="custom" className="py-20 pb-40 bg-background relative z-20">
        <div className="container mx-auto px-4 sm:px-8">
          <div className="relative rounded-2xl overflow-hidden bg-foreground group">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 opacity-40 grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000">
               <img src="/footer-demo image.jpeg" className="w-full h-full object-cover" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-b lg:bg-gradient-to-r from-foreground via-foreground/90 to-foreground/60 lg:to-transparent" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 p-8 sm:p-12 md:p-24 items-center">
              <div className="space-y-10">
                <div className="space-y-6">
                  <div className="w-16 h-16 rounded-2xl bg-accent/20 border border-accent/30 flex items-center justify-center text-accent">
                    <Flower2 size={32} />
                  </div>
                  <h2 className="text-4xl sm:text-5xl md:text-7xl font-black uppercase tracking-tighter text-background leading-none">
                    Commission <br /> Your Archive.
                  </h2>
                  <p className="text-base sm:text-lg text-background/60 max-w-md font-medium leading-relaxed">
                    Elevate your space with a one-of-a-kind permanent sculpture designed specifically for your aesthetic vision.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 w-full">
                  <a 
                    href="https://wa.me/918714793136?text=Hello%20Bloom%20Atelier%2C%20I%20would%20like%20to%20inquire%20about%20commissioning%20a%20custom%20floral%20sculpture."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto inline-block px-10 py-5 bg-accent text-accent-foreground text-xs font-black uppercase tracking-[0.4em] rounded-full hover:bg-background hover:text-foreground transition-all duration-500 shadow-2xl text-center"
                  >
                    Start Commission
                  </a>
                  <button className="w-full sm:w-auto px-10 py-5 border border-background/20 text-background text-xs font-black uppercase tracking-[0.4em] rounded-full hover:bg-background/10 transition-all duration-500 text-center">
                    View Process
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-px bg-background/10 rounded-xl overflow-hidden border border-background/10 backdrop-blur-md mt-6 lg:mt-0">
                 {[
                   { label: 'Authenticity', val: '100%', sub: 'Handmade' },
                   { label: 'Longevity', val: '∞', sub: 'Year Life' },
                   { label: 'Curation', val: '2026', sub: 'Collection' },
                   { label: 'Shipping', val: 'India', sub: 'All India Delivery' }
                 ].map((stat, i) => (
                   <div key={i} className="bg-foreground/40 p-6 sm:p-10 space-y-2 hover:bg-foreground/60 transition-colors">
                      <p className="text-[9px] font-black uppercase tracking-widest text-accent">{stat.label}</p>
                      <p className="text-3xl sm:text-4xl font-bold text-background">{stat.val}</p>
                      <p className="text-[9px] font-medium uppercase tracking-widest text-background/40">{stat.sub}</p>
                   </div>
                 ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      <CartDrawer />
      <WishlistDrawer />
    </main>
  );
}
