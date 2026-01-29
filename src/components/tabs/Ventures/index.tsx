"use client";
import { lazy, Suspense } from 'react';

// Eager load: First section loads immediately
import VenturesTab from './VenturesTab';

// Lazy load: Add more sections here as you build them
// const VenturesOverview = lazy(() => import('./VenturesOverview'));
// const VenturesShowcase = lazy(() => import('./VenturesShowcase'));
// const VenturesCTA = lazy(() => import('./VenturesCTA'));

interface VenturesProps {
  // Add props here if needed in the future
}

const Ventures = ({}: VenturesProps) => {
  return (
    <>
      {/* First section - loads immediately */}
      <VenturesTab />
      
      {/* Future sections - lazy load as you add them */}
      {/* 
      <Suspense fallback={<div className="min-h-screen bg-black" />}>
        <VenturesOverview />
      </Suspense>
      
      <Suspense fallback={<div className="min-h-screen bg-black" />}>
        <VenturesShowcase />
      </Suspense>
      
      <Suspense fallback={<div className="min-h-screen bg-black" />}>
        <VenturesCTA />
      </Suspense>
      */}
    </>
  );
};

export default Ventures;