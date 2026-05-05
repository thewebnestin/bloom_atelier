"use client";
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useShop } from '@/core/shop/ShopContext';
import { ShoppingBag, Moon, Sun, Menu, X, Heart } from 'lucide-react';
import gsap from 'gsap';
import Link from 'next/link';

const NAV_LINKS = [
  { label: 'Collections', href: '#catalog' },
  { label: 'Archive', href: '#atelier' },
  { label: 'Studio', href: '#studio' },
  { label: 'Custom', href: '#custom' },
];

export default function Navbar() {
  const { theme, toggleTheme, cart, wishlist, setIsCartOpen } = useShop();
  const navRef = useRef(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const mobileMenuRef = useRef(null);
  const mobileLinksRef = useRef([]);

  useEffect(() => {
    gsap.to(navRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power3.out'
    });

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Open animation
  const openMobile = useCallback(() => {
    setIsMobileOpen(true);
    setIsAnimating(true);
    document.body.style.overflow = 'hidden';

    requestAnimationFrame(() => {
      gsap.fromTo(mobileMenuRef.current, 
        { clipPath: 'circle(0% at calc(100% - 40px) 40px)' },
        { 
          clipPath: 'circle(150% at calc(100% - 40px) 40px)', 
          duration: 0.8, 
          ease: 'power4.inOut',
          onComplete: () => setIsAnimating(false)
        }
      );
      gsap.fromTo(mobileLinksRef.current.filter(Boolean),
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.08, delay: 0.3, duration: 0.8, ease: 'power3.out' }
      );
    });
  }, []);

  // Close animation (reverse)
  const closeMobile = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);

    // Animate links out first
    gsap.to(mobileLinksRef.current.filter(Boolean), {
      y: -30,
      opacity: 0,
      stagger: 0.04,
      duration: 0.4,
      ease: 'power3.in',
    });

    // Then collapse the circle
    gsap.to(mobileMenuRef.current, {
      clipPath: 'circle(0% at calc(100% - 40px) 40px)',
      duration: 0.6,
      delay: 0.2,
      ease: 'power4.inOut',
      onComplete: () => {
        setIsMobileOpen(false);
        setIsAnimating(false);
        document.body.style.overflow = '';
      }
    });
  }, [isAnimating]);

  const handleLinkClick = (e) => {
    closeMobile();
  };

  return (
    <>
      <nav 
        ref={navRef}
        style={{ opacity: 0, transform: 'translateY(-10px)' }}
        className={`fixed top-0 left-0 right-0 h-20 z-[9999] flex items-center transition-all duration-300 ${isScrolled ? 'bg-background/95 backdrop-blur-md border-b border-border' : 'bg-transparent'}`}
      >
        <div className="container mx-auto px-6 md:px-8 flex justify-between items-center w-full">
          <Link href="/" className="flex items-center gap-4 group">
            <div className="h-10 w-10 rounded-lg overflow-hidden border border-border">
              <img 
                src="/BloomAtelier-Logo.jpeg" 
                alt="Logo" 
                className="w-full h-full object-cover grayscale transition-all group-hover:grayscale-0"
              />
            </div>
            <span className="text-sm font-extrabold tracking-tighter uppercase text-foreground">
              Bloom Atelier
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-12">
            {NAV_LINKS.map((item) => (
              <a 
                key={item.label}
                href={item.href}
                className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/40 hover:text-accent transition-colors"
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle - Desktop only */}
            <div className="hidden sm:flex items-center gap-1 bg-secondary/50 p-1 rounded-full border border-border">
              <button 
                onClick={toggleTheme}
                className={`p-2.5 rounded-full transition-all ${theme === 'dark' ? 'bg-background text-accent' : 'text-foreground/30 hover:text-accent'}`}
              >
                <Moon size={14} />
              </button>
              <button 
                onClick={toggleTheme}
                className={`p-2.5 rounded-full transition-all ${theme === 'light' ? 'bg-background text-accent' : 'text-foreground/30 hover:text-accent'}`}
              >
                <Sun size={14} />
              </button>
            </div>

            {/* Wishlist */}
            <button className="relative p-3 text-foreground/40 hover:text-accent transition-all">
              <Heart size={20} />
              {wishlist.length > 0 && (
                <span className="absolute top-1.5 right-1.5 min-w-[14px] h-[14px] bg-accent text-accent-foreground rounded-full text-[8px] font-bold flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart */}
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative p-3 text-foreground/40 hover:text-accent transition-all"
            >
              <ShoppingBag size={20} />
              {cart.length > 0 && (
                <span className="absolute top-1.5 right-1.5 min-w-[14px] h-[14px] bg-accent text-accent-foreground rounded-full text-[8px] font-bold flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </button>

            {/* Mobile Hamburger */}
            <button 
              onClick={() => isMobileOpen ? closeMobile() : openMobile()}
              className="lg:hidden p-2 text-foreground z-[10000] relative"
            >
              {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Fullscreen Menu */}
      {isMobileOpen && (
        <div 
          ref={mobileMenuRef}
          className="fixed inset-0 z-[9998] bg-background flex flex-col justify-between px-8 pt-28 pb-12"
          style={{ clipPath: 'circle(0% at calc(100% - 40px) 40px)' }}
        >
          {/* Big Typography Nav Links */}
          <nav className="flex flex-col gap-0">
            {NAV_LINKS.map((item, i) => (
              <a 
                key={item.label}
                ref={el => mobileLinksRef.current[i] = el}
                href={item.href}
                onClick={handleLinkClick}
                className="group flex items-center justify-between py-6 border-b border-border"
                style={{ opacity: 0 }}
              >
                <span className="text-[11vw] sm:text-6xl font-extrabold uppercase tracking-tighter text-foreground group-hover:text-accent transition-colors duration-300">
                  {item.label}
                </span>
                <span className="text-[10px] uppercase tracking-widest text-muted font-bold opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                  Explore →
                </span>
              </a>
            ))}
          </nav>

          {/* Bottom Bar */}
          <div 
            ref={el => mobileLinksRef.current[NAV_LINKS.length] = el}
            className="flex items-center justify-between pt-8 border-t border-border"
            style={{ opacity: 0 }}
          >
            <div className="flex items-center gap-6">
              <button 
                onClick={toggleTheme}
                className="p-3 border border-border rounded-full text-foreground/40 hover:text-accent transition-all"
              >
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              <span className="text-[9px] uppercase tracking-widest text-muted font-bold">
                {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
              </span>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-muted">
                <Heart size={14} />
                <span className="text-[9px] uppercase tracking-widest font-bold">{wishlist.length}</span>
              </div>
              <div className="flex items-center gap-2 text-muted">
                <ShoppingBag size={14} />
                <span className="text-[9px] uppercase tracking-widest font-bold">{cart.length}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
