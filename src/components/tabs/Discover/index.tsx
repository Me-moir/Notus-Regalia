"use client";
import { lazy, Suspense } from 'react';

// Eager load: These are preloaded during LoadingScreen
import HeroSection from './HeroSection';
import Overview from './Overview';
import FeatureSection from './FeatureSection';

// Lazy load: Load on-demand as user scrolls
const Features = lazy(() => import('./FeatureSection'));
const JourneyStepsSection = lazy(() => import('../Information/Statements'));
const CTASection = lazy(() => import('./CTASection'));

interface DiscoverProps {
  activeCardIndex: number;
  setActiveCardIndex: (index: number) => void;
  textAnimationKey: number;
  isAnimating: boolean;
}

const Discover = ({ 
  activeCardIndex, 
  setActiveCardIndex,
  textAnimationKey,
  isAnimating 
}: DiscoverProps) => {
  return (
    <>
      {/* Already loaded during LoadingScreen - show immediately */}
      <HeroSection />
      
      <Overview />
      
      {/* Lazy loaded - minimal invisible fallbacks since user already saw loading screen */}
      <Suspense fallback={<div className="h-screen bg-gradient-to-b from-[#141414] via-[#0a0a0a] to-black" />}>
        <FeatureSection
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

export default Discover;