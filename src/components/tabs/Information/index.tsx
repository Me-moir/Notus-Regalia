"use client";
import { lazy, Suspense } from 'react';

// Eager load: First section loads immediately
import Statements from './Statements';

// Lazy load: Add more sections here as you build them
// const NextSection = lazy(() => import('./NextSection'));
// const AnotherSection = lazy(() => import('./AnotherSection'));

interface InformationProps {
  // Add props here if needed in the future
}

const Information = ({}: InformationProps) => {
  return (
    <>
      {/* First section - loads immediately */}
      <Statements />
      
      {/* Future sections - lazy load as you add them */}
      {/* 
      <Suspense fallback={<div className="min-h-screen bg-black" />}>
        <NextSection />
      </Suspense>
      
      <Suspense fallback={<div className="min-h-screen bg-black" />}>
        <AnotherSection />
      </Suspense>
      */}
    </>
  );
};

export default Information;