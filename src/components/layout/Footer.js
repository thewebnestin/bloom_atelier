"use client";
import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Phone, MessageCircle } from 'lucide-react';

export default function Footer() {
  const videoRef = useRef(null);
  const [isReversing, setIsReversing] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let interval;

    const handlePlayback = () => {
      if (isReversing) {
        // Reverse playback logic
        video.pause();
        interval = setInterval(() => {
          if (video.currentTime <= 0.1) {
            clearInterval(interval);
            setIsReversing(false);
            video.play().catch(() => {});
          } else {
            video.currentTime -= 0.05; // Adjust for smoothness vs performance
          }
        }, 40); // ~25fps reverse
      }
    };

    const handleEnded = () => {
      setIsReversing(true);
    };

    video.addEventListener('ended', handleEnded);
    handlePlayback();

    return () => {
      video.removeEventListener('ended', handleEnded);
      if (interval) clearInterval(interval);
    };
  }, [isReversing]);

  return (
    <footer className="relative w-full overflow-hidden mt-10">
      {/* 
          Ultra-Smooth Fade Transition:
          Multi-stop gradient for a seamless transition from the page background.
          We use absolute positioning to overlap the video slightly more for a deep blend.
      */}
      <div className="absolute top-0 left-0 right-0 h-70 bg-gradient-to-b from-background via-background/60 to-transparent z-20 pointer-events-none" />

      {/* Video Container - Height reduced for a more compact, cinematic look */}
      <div className="relative min-h-[65vh] w-full flex items-center justify-center">
        {/* Background Video */}
        <div className="absolute inset-0 overflow-hidden">
          <video 
            ref={videoRef}
            autoPlay 
            muted 
            playsInline
            className="absolute inset-0 w-full h-full object-cover scale-[1.02]"
          >
            <source src="/footer-bg.mp4" type="video/mp4" />
          </video>
        </div>

        {/* Subtle Tint Overlay for Readability */}
        <div className="absolute inset-0 bg-[#051f20]/15 pointer-events-none z-10" />

        {/* Footer Content */}
        <div className="relative z-30 flex flex-col items-center justify-center min-h-[65vh] w-full px-8 text-center pt-20">
          
          {/* Brand Mark */}
          <div className="mb-14">
            <h2 className="text-5xl md:text-8xl font-extrabold tracking-tighter uppercase text-[#DAF1DE] leading-[0.8] drop-shadow-lg">
              Bloom <br /> Atelier
            </h2>
            <p className="text-[#DAF1DE]/60 text-[9px] uppercase tracking-[0.5em] mt-6 font-bold">
              Studio Reserve · Permanent Collection
            </p>
          </div>

          {/* Nav Links */}
          <div className="flex flex-wrap justify-center gap-x-12 gap-y-4 mb-16">
            {[
              { label: 'Shop', href: '/shop' },
              { label: 'Collections', href: '/#catalog' },
              { label: 'Archive', href: '/#atelier' },
              { label: 'Custom', href: '/#custom' },
            ].map(item => (
              <Link 
                key={item.label} 
                href={item.href}
                className="text-[10px] uppercase font-extrabold tracking-[0.3em] text-[#DAF1DE]/50 hover:text-[#DAF1DE] transition-all duration-500"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Social Links & Contact */}
          <div className="flex gap-6 sm:gap-10 mb-16 flex-wrap justify-center items-center">
            <a 
              href="https://www.instagram.com/bloomatelier.__"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-[8px] uppercase font-bold tracking-[0.4em] text-[#DAF1DE]/40 hover:text-[#DAF1DE] transition-all duration-300 hover:scale-105"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="14" 
                height="14" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="opacity-80"
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
              className="flex items-center gap-2 text-[8px] uppercase font-bold tracking-[0.4em] text-[#DAF1DE]/40 hover:text-[#DAF1DE] transition-all duration-300 hover:scale-105"
            >
              <MessageCircle size={14} className="opacity-80" strokeWidth={2} />
              WhatsApp
            </a>
            <a 
              href="tel:+918714793136"
              className="flex items-center gap-2 text-[8px] uppercase font-bold tracking-[0.4em] text-[#DAF1DE]/40 hover:text-[#DAF1DE] transition-all duration-300 hover:scale-105"
            >
              <Phone size={14} className="opacity-80" strokeWidth={2} />
              +91 8714793136
            </a>
          </div>

          {/* Bottom Line */}
          <div className="w-full max-w-6xl flex justify-between items-center py-10 border-t border-white/5">
            <p className="text-[8px] uppercase font-bold tracking-[0.4em] text-[#DAF1DE]/20">
              © 2026 Bloom Atelier
            </p>
            <p className="text-[8px] uppercase font-bold tracking-[0.4em] text-[#DAF1DE]/20">
              Designed for Permanence
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
