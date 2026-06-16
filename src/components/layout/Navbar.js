"use client";
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useShop } from '@/core/shop/ShopContext';
import AuthDrawer from '../cart/AuthDrawer';
import ProfileDrawer from '../profile/ProfileDrawer';
import { ShoppingBag, Moon, Sun, Menu, X, Heart, User, Phone, MessageCircle } from 'lucide-react';
import gsap from 'gsap';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import WhatsAppIcon from '../ui/WhatsAppIcon';

const NAV_LINKS = [
  { label: 'Shop', href: '/shop' },
  { label: 'Collections', href: '/#catalog' },
  { label: 'Archive', href: '/#atelier' },
  { label: 'Contact', href: '/#contact' },
];

export default function Navbar() {
  const { 
    theme, toggleTheme, cart, wishlist, 
    toggleCart, toggleWishlist, closeAllDrawers,
    user, setIsAuthOpen, isProfileOpen, setIsProfileOpen, showToast
  } = useShop();

  const handleProfileClick = () => {
    if (user) {
      setIsProfileOpen(true);
    } else {
      setIsAuthOpen(true);
    }
  };

  const getInitials = (userObj) => {
    if (!userObj) return "";
    if (userObj.displayName) {
      const parts = userObj.displayName.trim().split(/\s+/);
      if (parts.length > 1) {
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
      }
      return parts[0].slice(0, 2).toUpperCase();
    }
    if (userObj.email) {
      const prefix = userObj.email.split('@')[0];
      return prefix.slice(0, 2).toUpperCase();
    }
    return "US";
  };
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

  const openMobile = useCallback(() => {
    closeAllDrawers();
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
      // Filter for non-null refs and animate
      const validLinks = mobileLinksRef.current.filter(Boolean);
      gsap.fromTo(validLinks,
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.08, delay: 0.3, duration: 0.8, ease: 'power3.out' }
      );
    });
  }, [closeAllDrawers]);

  const closeMobile = useCallback((callback) => {
    if (isAnimating) return;
    setIsAnimating(true);

    const validLinks = mobileLinksRef.current.filter(Boolean);
    gsap.to(validLinks, {
      y: -6,
      opacity: 0,
      stagger: 0.08,
      duration: 0.50,
      ease: 'power3.in',
    });

    gsap.to(mobileMenuRef.current, {
      clipPath: 'circle(0% at calc(100% - 40px) 40px)',
      duration: 0.9,
      delay: 0.3,
      ease: 'power2.inOut',
      onComplete: () => {
        setIsMobileOpen(false);
        setIsAnimating(false);
        document.body.style.overflow = '';
        if (callback && typeof callback === 'function') callback();
      }
    });
  }, [isAnimating]);

  const handleLinkClick = () => {
    closeMobile(() => closeAllDrawers());
  };

  const handleMobileDrawerClick = (type) => {
    closeMobile(() => {
      if (type === 'cart') toggleCart();
      if (type === 'wishlist') toggleWishlist(null);
    });
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
            <div className="h-10 w-10 rounded-full overflow-hidden border border-border/40">
              <img 
                src="/icon.jpeg" 
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
            {NAV_LINKS.map((item) => {
              const isAnchor = item.href.startsWith('#');
              const Component = isAnchor ? 'a' : Link;
              return (
                <Component 
                  key={item.label}
                  href={item.href}
                  onClick={closeAllDrawers}
                  className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/40 hover:text-accent transition-colors"
                >
                  {item.label}
                </Component>
              );
            })}
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-1 sm:gap-3">
            {/* Theme Toggle */}
            <button 
              onClick={toggleTheme}
              className="flex p-2 sm:p-3 text-foreground/40 hover:text-accent transition-all duration-300"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Wishlist */}
            <button 
              onClick={() => toggleWishlist(null)}
              className="relative p-2 sm:p-3 text-foreground/40 hover:text-accent transition-all"
            >
              <Heart size={20} />
              {wishlist.length > 0 && (
                <span className="absolute top-1.5 right-1.5 min-w-[14px] h-[14px] bg-accent text-accent-foreground rounded-full text-[8px] font-bold flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart */}
            <button 
              onClick={toggleCart}
              className="relative p-2 sm:p-3 text-foreground/40 hover:text-accent transition-all"
            >
              <ShoppingBag size={20} />
              {cart.length > 0 && (
                <span className="absolute top-1.5 right-1.5 min-w-[14px] h-[14px] bg-accent text-accent-foreground rounded-full text-[8px] font-bold flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </button>

            {/* Profile */}
            <button 
              onClick={handleProfileClick}
              className={`transition-all duration-300 ${user ? 'p-1' : 'p-2 sm:p-3 text-foreground/40 hover:text-accent'}`}
              title={user ? `Signed in as ${user.displayName || user.email}` : "Sign In"}
            >
              {user ? (
                <div className="w-8 h-8 rounded-full border border-border bg-accent text-accent-foreground text-[10px] font-black uppercase tracking-wider flex items-center justify-center hover:opacity-85 transition-opacity shadow-sm">
                  {getInitials(user)}
                </div>
              ) : (
                <User size={20} />
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
          className="fixed inset-0 z-[9998] bg-background overflow-y-auto"
          style={{ clipPath: 'circle(0% at calc(100% - 40px) 40px)' }}
        >
          <div className="min-h-full flex flex-col justify-between px-8 pt-28 pb-12">
            <nav className="flex flex-col gap-0">
            {NAV_LINKS.map((item, i) => {
              const isAnchor = item.href.startsWith('#');
              const Component = isAnchor ? 'a' : Link;
              return (
                <Component 
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
                </Component>
              );
            })}



            {user && (
              <>
                <button 
                  ref={el => mobileLinksRef.current[NAV_LINKS.length + 5] = el}
                  onClick={() => {
                    closeMobile(() => setIsProfileOpen(true));
                  }}
                  className="group flex items-center justify-between py-6 border-b border-border text-left w-full"
                  style={{ opacity: 0 }}
                >
                  <span className="text-[11vw] sm:text-6xl font-extrabold uppercase tracking-tighter text-foreground group-hover:text-accent transition-colors duration-300">
                    My Account
                  </span>
                  <span className="text-[10px] uppercase tracking-widest text-muted font-bold opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                    Settings →
                  </span>
                </button>

                <button 
                  ref={el => mobileLinksRef.current[NAV_LINKS.length + 6] = el}
                  onClick={async () => {
                    closeMobile(async () => {
                      const { logout } = await import('@/services/authService');
                      await logout();
                      showToast("Logged out successfully.", "info");
                    });
                  }}
                  className="group flex items-center justify-between py-6 border-b border-border text-left w-full"
                  style={{ opacity: 0 }}
                >
                  <span className="text-[11vw] sm:text-6xl font-extrabold uppercase tracking-tighter text-red-500 hover:text-red-600 transition-colors duration-300">
                    Logout
                  </span>
                  <span className="text-[10px] uppercase tracking-widest text-muted font-bold opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                    Sign Out →
                  </span>
                </button>
              </>
            )}

            {/* Added Wishlist Tab in Menu */}
            <button 
              ref={el => mobileLinksRef.current[NAV_LINKS.length] = el}
              onClick={() => handleMobileDrawerClick('wishlist')}
              className="group flex items-center justify-between py-6 border-b border-border text-left"
              style={{ opacity: 0 }}
            >
              <div className="flex items-center gap-4">
                <span className="text-[11vw] sm:text-6xl font-extrabold uppercase tracking-tighter text-foreground group-hover:text-accent transition-colors duration-300">
                  Wishlist
                </span>
                <span className="text-sm font-bold text-accent mb-6">({wishlist.length})</span>
              </div>
              <Heart size={24} className="text-muted opacity-20 group-hover:opacity-100 group-hover:text-accent transition-all" />
            </button>

            {/* Added Cart Tab in Menu */}
            <button 
              ref={el => mobileLinksRef.current[NAV_LINKS.length + 1] = el}
              onClick={() => handleMobileDrawerClick('cart')}
              className="group flex items-center justify-between py-6 border-b border-border text-left"
              style={{ opacity: 0 }}
            >
              <div className="flex items-center gap-4">
                <span className="text-[11vw] sm:text-6xl font-extrabold uppercase tracking-tighter text-foreground group-hover:text-accent transition-colors duration-300">
                  Your Cart
                </span>
                <span className="text-sm font-bold text-accent mb-6">({cart.length})</span>
              </div>
              <ShoppingBag size={24} className="text-muted opacity-20 group-hover:opacity-100 group-hover:text-accent transition-all" />
            </button>
          </nav>

          {/* Mobile Contact / Socials */}
          <div 
            ref={el => mobileLinksRef.current[NAV_LINKS.length + 2] = el}
            className="flex justify-between items-center py-6 border-b border-border text-left"
            style={{ opacity: 0 }}
          >
            <a 
              href="https://www.instagram.com/bloomatelier.__"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 text-[10px] font-extrabold uppercase tracking-widest text-foreground/50 hover:text-accent transition-colors"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="text-accent"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
              Instagram
            </a>
            
            <a 
              href="https://wa.me/918714793136"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 text-[10px] font-extrabold uppercase tracking-widest text-foreground/50 hover:text-accent transition-colors"
            >
              <WhatsAppIcon size={16} className="text-accent flex-shrink-0" />
              WhatsApp
            </a>

            <a 
              href="tel:+918714793136"
              className="flex items-center gap-2.5 text-[10px] font-extrabold uppercase tracking-widest text-foreground/50 hover:text-accent transition-colors"
            >
              <Phone size={16} className="text-accent" />
              Call
            </a>
          </div>

          {/* Bottom Bar */}
          <div 
            ref={el => mobileLinksRef.current[NAV_LINKS.length + 3] = el}
            className="flex items-center justify-between pt-8 border-t border-border"
            style={{ opacity: 0 }}
          >
            <div className="flex items-center gap-6">
              <button 
                onClick={toggleTheme}
                className="flex items-center gap-4 p-3 border border-border rounded-full text-foreground/40 hover:text-accent hover:border-accent transition-all"
              >
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              <span className="text-[9px] uppercase tracking-widest text-muted font-bold">
                {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
              </span>
            </div>

            <div className="text-right">
              <p className="text-[9px] uppercase font-bold tracking-widest text-muted/30">© 2026</p>
              <p className="text-[9px] uppercase font-bold tracking-widest text-muted/30">Bloom Atelier Studio</p>
            </div>
          </div>
        </div>
      </div>
      )}
      <AuthDrawer />
      <ProfileDrawer />
    </>
  );
}
