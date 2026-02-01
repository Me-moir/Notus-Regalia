"use client";
import { useEffect, useState } from 'react';
import Spline from '@splinetool/react-spline';
import { ContainerTextFlip } from "@/components/ui/container-text-flip";
import { EmailFormEffect } from "@/components/ui/EmailFormEffect";

const HeroSection = () => {
  const [isMounted, setIsMounted] = useState(false);

  const placeholders = [
    "Valid Email Address",
    "The Best Way to Reach You",
    "Company or Personal email, either works",
    "Join Our Initiative!",
  ];

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('Email changed:', e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    console.log('Email submitted:', e);
  };

  return (
    <section className="relative min-h-screen md:min-h-screen flex items-center justify-center overflow-hidden">
      {/* Combined styles for mobile height and vignette */}
      <style jsx>{`
        @media (max-width: 768px) {
          section {
            min-height: 0 !important;
            height: fit-content !important;
            padding-top: 10rem;
            padding-bottom: 1rem;
          }
        }
        
        .vignette-overlay {
          background: radial-gradient(ellipse at bottom left, rgba(0, 0, 0, 0.9) 0%, rgba(0, 0, 0, 0.6) 15%, rgba(0, 0, 0, 0.3) 25%, transparent 40%),
                      radial-gradient(ellipse at bottom right, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 1) 10%, rgba(0, 0, 0, 1) 25%, transparent 20%);
        }
        
        @media (max-width: 768px) {
          .vignette-overlay {
            background: radial-gradient(ellipse 120% 100% at bottom left, rgba(0, 0, 0, 0.95) 0%, rgba(0, 0, 0, 0.75) 12%, rgba(0, 0, 0, 0.5) 25%, rgba(0, 0, 0, 0.2) 40%, transparent 55%),
                        radial-gradient(ellipse at bottom right, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 1) 10%, rgba(0, 0, 0, 1) 25%, transparent 20%);
          }
        }
      `}</style>
      
      {/* Spline 3D Scene Background with Vignette Overlay */}
      <main className="absolute inset-0 w-full h-full scale-[1.15] md:scale-[1.15] sm:scale-[1.3] xs:scale-[1.4] z-0" 
            style={{ transform: 'translateY(-20%)' }}>
        <Spline
          scene="https://prod.spline.design/4UafzF3exFxPPgi6/scene.splinecode" 
        />
        
        {/* Vignette overlay - adjusted for mobile with responsive expansion */}
        <div 
          className="absolute inset-0 pointer-events-none vignette-overlay"
        />
      </main>
      
      {/* Text Overlay - Fully Responsive */}
      <div className="relative z-20 w-full max-w-6xl mx-auto text-center px-4 sm:px-6 md:px-8 lg:px-12 mt-12 sm:mt-16 md:mt-24">
        {/* First line with animated text - FIXED OVERFLOW */}
        <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl mb-4 sm:mb-5 md:mb-6 max-w-4xl mx-auto drop-shadow-lg font-bold leading-tight overflow-visible">
          {/* Mobile: Stacked Layout */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-x-2 px-2 sm:px-4 md:pl-8 overflow-visible">
            <span className="whitespace-nowrap bg-gradient-to-b from-white via-gray-300 to-gray-500 bg-clip-text text-transparent">
              We build systems that build
            </span>
            {isMounted && (
              <span 
                className="inline-flex justify-center sm:justify-start items-center w-full sm:w-auto overflow-visible" 
                style={{ 
                  minWidth: 'auto', 
                  maxWidth: '100%',
                  minHeight: '1.5em', // Prevent height collapse
                  paddingTop: '0.1em', // Add breathing room
                  paddingBottom: '0.1em'
                }}
              >
                <div className="overflow-visible w-full">
                  <ContainerTextFlip 
                    words={["Companies", "Possibilities", "Dominance"]} 
                    className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl overflow-visible" 
                  />
                </div>
              </span>
            )}
          </div>
        </div>
        
        {/* Second paragraph - Mobile Optimized */}
        <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-gray-300 max-w-3xl mx-auto drop-shadow-lg leading-relaxed mb-6 sm:mb-8 md:mb-10 px-2">
          <strong className="font-bold text-gray-200">Regalitica</strong> is a holding and venture-building entity focused on developing early-stage systems.
        </p>

        {/* Email Input - Mobile Optimized */}
        {isMounted && (
          <div className="w-full max-w-2xl mx-auto pointer-events-auto relative z-30 px-2 sm:px-0">
            <EmailFormEffect
              placeholders={placeholders}
              onChange={handleChange}
              onSubmit={handleSubmit}
            />
          </div>
        )}

        {/* Logo Row - Tech Stack - Mobile Optimized - crops bottom only */}
        <div className="mt-16 sm:mt-24 md:mt-32 mb-0 pb-0 flex items-center justify-center gap-2 sm:gap-3 md:gap-5 lg:gap-7 opacity-40 hover:opacity-70 transition-opacity duration-500 flex-wrap px-2 sm:px-4">
          <img 
            src="/assets/nextjs.png" 
            alt="Next.js" 
            className="grayscale hover:grayscale-0 transition-all duration-300 h-5 sm:h-7 md:h-9 lg:h-11" 
            style={{ width: 'auto', objectFit: 'contain' }} 
          />
          <img 
            src="/assets/react.png" 
            alt="React" 
            className="grayscale hover:grayscale-0 transition-all duration-300 h-5 sm:h-7 md:h-9 lg:h-11" 
            style={{ width: 'auto', objectFit: 'contain' }} 
          />
          <img 
            src="/assets/framer.png" 
            alt="Framer Motion" 
            className="grayscale hover:grayscale-0 transition-all duration-300 h-5 sm:h-7 md:h-9 lg:h-11" 
            style={{ width: 'auto', objectFit: 'contain' }} 
          />
          <img 
            src="/assets/gsap.png" 
            alt="GSAP" 
            className="grayscale hover:grayscale-0 transition-all duration-300 h-5 sm:h-7 md:h-9 lg:h-11" 
            style={{ width: 'auto', objectFit: 'contain' }} 
          />
          <img 
            src="/assets/spline.png" 
            alt="Spline" 
            className="grayscale hover:grayscale-0 transition-all duration-300 h-5 sm:h-7 md:h-9 lg:h-11" 
            style={{ width: 'auto', objectFit: 'contain' }} 
          />
          <img 
            src="/assets/tailwind.png" 
            alt="Tailwind CSS" 
            className="grayscale hover:grayscale-0 transition-all duration-300 h-5 sm:h-7 md:h-9 lg:h-11" 
            style={{ width: 'auto', objectFit: 'contain' }} 
          />
          <img 
            src="/assets/aceternity.png" 
            alt="Aceternity UI" 
            className="grayscale hover:grayscale-0 transition-all duration-300 h-5 sm:h-7 md:h-9 lg:h-11" 
            style={{ width: 'auto', objectFit: 'contain' }} 
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;