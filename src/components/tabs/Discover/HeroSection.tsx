"use client";
import { useEffect, useState } from 'react';
import Prism from '@/components/ui/Prism';
import { ContainerTextFlip } from "@/components/ui/container-text-flip";

const HeroSection = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
      <style jsx>{`
        @media (max-width: 768px) {
          section {
            min-height: 0 !important;
            height: fit-content !important;
            padding-top: 10rem;
            padding-bottom: 1rem;
          }
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        @keyframes liquidFlow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
      
      {/* Prism Background */}
      <div style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}>
        <Prism
          animationType="hover"
          timeScale={1}
          height={4.1}
          baseWidth={5}
          scale={2.5}
          hueShift={0}
          colorFrequency={1}
          noise={0}
          glow={1}
        />
      </div>
      
      {/* Text Overlay */}
      <div className="relative z-20 w-full max-w-6xl mx-auto text-center px-4 sm:px-6 md:px-8 lg:px-12 mt-12 sm:mt-16 md:mt-24">
        <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl mb-4 sm:mb-5 md:mb-6 max-w-4xl mx-auto drop-shadow-lg font-bold leading-tight overflow-visible">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-x-2 px-2 sm:px-4 md:pl-8 overflow-visible">
            <span className="whitespace-nowrap bg-gradient-to-b from-white via-gray-300 to-gray-500 bg-clip-text text-transparent">
              We build systems that build
            </span>
            {isMounted && (
              <span className="inline-flex justify-center sm:justify-start items-center w-full sm:w-auto overflow-visible" 
                style={{ minWidth: 'auto', maxWidth: '100%', minHeight: '1.5em', paddingTop: '0.1em', paddingBottom: '0.1em' }}>
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
        
        <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-gray-300 max-w-3xl mx-auto drop-shadow-lg leading-relaxed mb-6 sm:mb-8 md:mb-10 px-2">
          <strong className="font-bold text-gray-200">Regalitica</strong> is a holding and venture-building entity focused on developing early-stage systems.
        </p>

        <div className="mt-16 sm:mt-24 md:mt-32 mb-0 pb-0 flex items-center justify-center px-2 sm:px-4">
          {/* Liquid Glass Container */}
          <div className="relative group">
            {/* Glass Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent rounded-3xl blur-xl"></div>
            
            {/* Main Glass Container */}
            <div 
              className="relative backdrop-blur-2xl bg-white/5 rounded-3xl border border-white/10 shadow-2xl overflow-hidden transition-all duration-700 hover:border-white/20 hover:bg-white/10"
              style={{
                boxShadow: '0 8px 32px 0 rgba(255, 255, 255, 0.05), inset 0 1px 0 0 rgba(255, 255, 255, 0.1)',
              }}
            >
              {/* Shimmer Effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                <div 
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                  style={{
                    animation: 'shimmer 3s infinite',
                    backgroundSize: '200% 100%',
                  }}
                ></div>
              </div>

              {/* Liquid Gradient Border Animation */}
              <div 
                className="absolute inset-0 opacity-50 group-hover:opacity-75 transition-opacity duration-700 rounded-3xl"
                style={{
                  background: 'linear-gradient(45deg, rgba(139, 92, 246, 0.1), rgba(59, 130, 246, 0.1), rgba(236, 72, 153, 0.1), rgba(139, 92, 246, 0.1))',
                  backgroundSize: '400% 400%',
                  animation: 'liquidFlow 8s ease infinite',
                }}
              ></div>

              {/* Logos Container */}
              <div className="relative flex items-center justify-center gap-3 sm:gap-4 md:gap-6 lg:gap-8 px-6 sm:px-8 md:px-10 lg:px-12 py-4 sm:py-5 md:py-6 flex-wrap">
                <img src="/assets/nextjs.png" alt="Next.js" className="grayscale hover:grayscale-0 transition-all duration-300 h-5 sm:h-7 md:h-9 lg:h-11 hover:scale-110" style={{ width: 'auto', objectFit: 'contain' }} />
                <img src="/assets/react.png" alt="React" className="grayscale hover:grayscale-0 transition-all duration-300 h-5 sm:h-7 md:h-9 lg:h-11 hover:scale-110" style={{ width: 'auto', objectFit: 'contain' }} />
                <img src="/assets/framer.png" alt="Framer Motion" className="grayscale hover:grayscale-0 transition-all duration-300 h-5 sm:h-7 md:h-9 lg:h-11 hover:scale-110" style={{ width: 'auto', objectFit: 'contain' }} />
                <img src="/assets/gsap.png" alt="GSAP" className="grayscale hover:grayscale-0 transition-all duration-300 h-5 sm:h-7 md:h-9 lg:h-11 hover:scale-110" style={{ width: 'auto', objectFit: 'contain' }} />
                <img src="/assets/spline.png" alt="Spline" className="grayscale hover:grayscale-0 transition-all duration-300 h-5 sm:h-7 md:h-9 lg:h-11 hover:scale-110" style={{ width: 'auto', objectFit: 'contain' }} />
                <img src="/assets/tailwind.png" alt="Tailwind CSS" className="grayscale hover:grayscale-0 transition-all duration-300 h-5 sm:h-7 md:h-9 lg:h-11 hover:scale-110" style={{ width: 'auto', objectFit: 'contain' }} />
                <img src="/assets/aceternity.png" alt="Aceternity UI" className="grayscale hover:grayscale-0 transition-all duration-300 h-5 sm:h-7 md:h-9 lg:h-11 hover:scale-110" style={{ width: 'auto', objectFit: 'contain' }} />
              </div>

              {/* Bottom Reflection */}
              <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-white/5 to-transparent pointer-events-none"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;