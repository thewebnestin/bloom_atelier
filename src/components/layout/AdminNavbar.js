"use client";
import React, { useEffect, useRef, useState } from 'react';
import { useShop } from '@/core/shop/ShopContext';
import { LogOut, Sun, Moon } from 'lucide-react';
import Link from 'next/link';
import gsap from 'gsap';
import { logout } from '@/services/authService';

export default function AdminNavbar() {
  const { theme, toggleTheme, user, showToast } = useShop();
  const navRef = useRef(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

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

  const handleSignOut = () => {
    setShowLogoutConfirm(true);
  };

  const handleConfirmLogout = async () => {
    setShowLogoutConfirm(false);
    try {
      await logout();
      showToast("Signed out from Admin Workspace.", "info");
    } catch (e) {
      showToast("Logout failed.", "error");
    }
  };

  return (
    <nav 
      ref={navRef}
      style={{ opacity: 0, transform: 'translateY(-10px)' }}
      className={`fixed top-0 left-0 right-0 h-20 z-[9999] flex items-center transition-all duration-300 ${isScrolled ? 'bg-background/95 backdrop-blur-md border-b border-border' : 'bg-transparent'}`}
    >
      <div className="container mx-auto px-6 md:px-8 flex justify-between items-center w-full">
        
        {/* Left Side: Brand and Manager Indicator */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4 group">
            <div className="h-10 w-10 rounded-full overflow-hidden border border-border/40">
              <img 
                src="/icon.jpeg" 
                alt="Logo" 
                className="w-full h-full object-cover grayscale transition-all"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-extrabold tracking-tighter uppercase text-foreground">
                Bloom Atelier
              </span>
              <span className="text-[8px] font-bold uppercase tracking-[0.25em] text-accent">
                Studio Manager Workspace
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: Theme, Info, Logout */}
        <div className="flex items-center gap-6">
          {user && (
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-xs font-bold text-foreground">{user.displayName || "Administrator"}</span>
              <span className="text-[9px] uppercase tracking-wider text-muted font-semibold">{user.email}</span>
            </div>
          )}

          <button 
            onClick={toggleTheme}
            className="p-3 border border-border rounded-full text-foreground/40 hover:text-accent hover:border-accent transition-all"
            title={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 px-5 py-2.5 bg-foreground text-background text-[9px] font-extrabold uppercase tracking-widest rounded-full hover:bg-accent hover:text-accent-foreground transition-all"
          >
            <LogOut size={12} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Bloom Atelier Custom Confirmation Box */}
      {showLogoutConfirm && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-md z-[100000] flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setShowLogoutConfirm(false)}
        >
          <div 
            className="bg-background border border-border w-full max-w-xs rounded-2xl p-6 text-center space-y-5 shadow-2xl animate-slide-up"
            onClick={e => e.stopPropagation()}
          >
            <div className="space-y-2">
              <span className="text-accent text-[9px] font-bold uppercase tracking-[0.5em] block">Confirm Action</span>
              <h4 className="text-base font-black uppercase tracking-tight text-foreground">Sign Out?</h4>
              <p className="text-muted text-[11px] font-semibold leading-relaxed">
                Are you sure you want to end your administration session?
              </p>
            </div>
            
            <div className="flex gap-3 pt-2">
              <button
                onClick={handleConfirmLogout}
                className="flex-1 py-3 bg-foreground text-background hover:bg-accent hover:text-accent-foreground text-[10px] font-extrabold uppercase tracking-widest rounded-full transition-all duration-300 shadow-sm border border-transparent"
              >
                Sign Out
              </button>
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-3 border border-border bg-background hover:bg-secondary/40 text-foreground text-[10px] font-extrabold uppercase tracking-widest rounded-full transition-all duration-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}