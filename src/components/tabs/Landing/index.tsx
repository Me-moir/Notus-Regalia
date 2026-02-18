"use client";
import { useState, useEffect, useRef, lazy, Suspense } from 'react';

// Eager load: These are preloaded during LoadingScreen
import HeroSection from '../Discover/HeroSection';
import BufferSection from '../Discover/BufferSection';
import AboutHeader from '../Discover/AboutHeader';
import InsideOurWorld from '../Discover/About';
import FeatureSection from '../Discover/FeatureSection';

// Lazy load: Load on-demand as user scrolls
const Team = lazy(() => import('../Discover/Team'));
const Contact = lazy(() => import('../Discover/Contact'));

const Landing = () => {
  const [activeCardIndex, setActiveCardIndex] = useState(1);
  const [textAnimationKey, setTextAnimationKey] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const prevCardIndexRef = useRef(1);

  // Handle vanish animation when activeCardIndex changes
  useEffect(() => {
    if (activeCardIndex !== prevCardIndexRef.current) {
      setTextAnimationKey(prev => prev + 1);
      setIsAnimating(true);
      prevCardIndexRef.current = activeCardIndex;

      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [activeCardIndex]);

  return (
    <>
      {/* Home - Hero Section */}
      <HeroSection />

      {/* Buffer Section - "What's in Notosphere?" */}
      <BufferSection />

      {/* About Header Section - "Building Enterprises with Purpose" */}
      <AboutHeader />

      {/* Inside Our World Section */}
      <InsideOurWorld />

      {/* Feature Section - Interactive Cards */}
      <Suspense fallback={<div className="h-screen" style={{ background: 'var(--gradient-section)' }} />}>
        <FeatureSection
          activeCardIndex={activeCardIndex}
          setActiveCardIndex={setActiveCardIndex}
          textAnimationKey={textAnimationKey}
          isAnimating={isAnimating}
        />
      </Suspense>

      {/* Our Team Section */}
      <Suspense fallback={<div className="min-h-screen" style={{ background: 'var(--surface-primary)' }} />}>
        <Team />
      </Suspense>

      {/* Reach Out Section */}
      <Suspense fallback={<div className="min-h-screen" style={{ background: 'var(--surface-primary)' }} />}>
        <Contact />
      </Suspense>
    </>
  );
};

export default Landing;
