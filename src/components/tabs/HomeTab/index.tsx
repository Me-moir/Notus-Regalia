"use client";
import { lazy, Suspense } from 'react';

// Eager load: These are preloaded during LoadingScreen
import HeroSection from './sections/HeroSection';
import PartnersSection from './sections/ExecutiveSummary';

// Lazy load: Load on-demand as user scrolls
const IndustriesCarousel = lazy(() => import('./sections/IndustriesCarousel'));
const JourneyStepsSection = lazy(() => import('./sections/JourneyStepsSection'));
const CTASection = lazy(() => import('./sections/CTASection'));

interface HomeTabProps {
  activeCardIndex: number;
  setActiveCardIndex: (index: number) => void;
  textAnimationKey: number;
  isAnimating: boolean;
}

const HomeTab = ({ 
  activeCardIndex, 
  setActiveCardIndex,
  textAnimationKey,
  isAnimating 
}: HomeTabProps) => {
  return (
    <>
      {/* Already loaded during LoadingScreen - show immediately */}
      <HeroSection />
      
      <PartnersSection />
      
      {/* Lazy loaded - minimal invisible fallbacks since user already saw loading screen */}
      <Suspense fallback={<div className="h-screen bg-gradient-to-b from-[#141414] via-[#0a0a0a] to-black" />}>
        <IndustriesCarousel
          activeCardIndex={activeCardIndex}
          setActiveCardIndex={setActiveCardIndex}
          textAnimationKey={textAnimationKey}
          isAnimating={isAnimating}
        />
      </Suspense>
      
      <Suspense fallback={<div className="min-h-screen bg-black" />}>
        <JourneyStepsSection />
      </Suspense>
      
      <Suspense fallback={<div className="min-h-screen bg-black" />}>
        <CTASection />
      </Suspense>
    </>
  );
};

export default HomeTab;