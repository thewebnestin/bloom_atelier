"use client";
import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function HeroScrollSequence() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const sectionRef = useRef(null);
  
  // We have 5 keyframes. We'll map these across a 100-step scroll.
  const frameCount = 100;
  const keyframes = [
    '/forest_zoom_1.png',
    '/forest_zoom_2.png',
    '/forest_zoom_3.png',
    '/forest_zoom_4.png',
    '/forest_zoom_5.png',
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    
    // Set canvas size
    const updateCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    // Preload keyframe images
    const images = [];
    let loadedCount = 0;

    keyframes.forEach((src, i) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        loadedCount++;
        if (loadedCount === keyframes.length) {
          renderInitialFrame();
          initScrollAnimation();
        }
      };
      images[i] = img;
    });

    const renderInitialFrame = () => {
      renderFrame(0);
    };

    const renderFrame = (index) => {
      // Map 0-99 to 0-4
      const progressInSegment = (index % (frameCount / keyframes.length)) / (frameCount / keyframes.length);
      const keyframeIndex = Math.min(Math.floor((index / frameCount) * keyframes.length), keyframes.length - 1);
      const img = images[keyframeIndex];
      
      if (!img) return;

      // Base scale to cover canvas
      const baseScale = Math.max(canvas.width / img.width, canvas.height / img.height);
      
      // Micro-zoom effect: subtle zoom-in during the segment
      const microZoom = 1 + (progressInSegment * 0.05); 
      const finalScale = baseScale * microZoom;

      const x = (canvas.width / 2) - (img.width / 2) * finalScale;
      const y = (canvas.height / 2) - (img.height / 2) * finalScale;
      
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(img, x, y, img.width * finalScale, img.height * finalScale);
    };

    const initScrollAnimation = () => {
      const airtable = { frame: 0 };

      gsap.to(airtable, {
        frame: frameCount - 1,
        snap: "frame",
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=300%", // Scroll distance
          scrub: 0.5,
          pin: true,
        },
        onUpdate: () => renderFrame(airtable.frame)
      });

      // Text Overlays Animation
      gsap.fromTo(".hero-text", 
        { opacity: 0, y: 50 },
        { 
          opacity: 1, 
          y: 0, 
          stagger: 0.2,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "top -20%",
            scrub: true,
          }
        }
      );
    };

    return () => {
      window.removeEventListener('resize', updateCanvasSize);
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative h-screen w-full overflow-hidden bg-black">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-cover" />
      
      {/* Cinematic Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 pointer-events-none" />
      
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
        <span className="hero-text text-accent text-[10px] font-bold uppercase tracking-[0.8em] mb-6">
          Bloom Atelier Studio
        </span>
        <h1 className="hero-text text-6xl md:text-9xl font-extrabold tracking-tighter uppercase text-white leading-[0.8]">
          The Genesis <br /> 
          <span className="opacity-20 italic">Sequence.</span>
        </h1>
        <p className="hero-text text-white/40 text-[11px] uppercase tracking-[0.4em] mt-10 max-w-md font-medium">
          Scroll to explore the origin of permanent flora. A journey through the structural mist.
        </p>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 opacity-30">
        <span className="text-[8px] uppercase font-bold tracking-widest text-white">Scroll to Begin</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-white to-transparent" />
      </div>
    </section>
  );
}
