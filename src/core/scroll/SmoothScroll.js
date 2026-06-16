"use client";
import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function SmoothScroll({ children }) {
  const lenisRef = useRef(null);
  const pathname = usePathname();

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.15,
      smoothTouch: false,
      infinite: false,
    });

    lenisRef.current = lenis;

    // Synchronize ScrollTrigger with Lenis scroll events
    lenis.on('scroll', ScrollTrigger.update);

    // Sync Lenis RAF with GSAP Ticker animation loop
    const updateTicker = (time) => {
      lenis.raf(time * 1000); // Convert seconds to milliseconds
    };
    gsap.ticker.add(updateTicker);

    // Disable GSAP lag smoothing to keep scrolling synchronized
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(updateTicker);
      lenisRef.current = null;
    };
  }, []);

  // Resize Lenis and reset scroll on page transition to keep page height sync'd and scroll smooth
  useEffect(() => {
    if (lenisRef.current) {
      lenisRef.current.resize();
      lenisRef.current.scrollTo(0, { immediate: true });
    }
  }, [pathname]);

  return <>{children}</>;
}
