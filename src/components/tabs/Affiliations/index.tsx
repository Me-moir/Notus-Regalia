"use client";
import { lazy, Suspense } from 'react';

// Eager load: First section loads immediately
import AffiliatesTab from './AffiliatesTab';

// Lazy load: Add more sections here as you build them
// const PartnersSection = lazy(() => import('./PartnersSection'));
// const SponsorsSection = lazy(() => import('./SponsorsSection'));
// const LicensesSection = lazy(() => import('./LicensesSection'));

interface AffiliationsProps {
  // Add props here if needed in the future
}

const Affiliations = ({}: AffiliationsProps) => {
  return (
    <>
      {/* First section - loads immediately */}
      <AffiliatesTab />
      
      {/* Future sections - lazy load as you add them */}
      {/* 
      <Suspense fallback={<div className="min-h-screen bg-black" />}>
        <PartnersSection />
      </Suspense>
      
      <Suspense fallback={<div className="min-h-screen bg-black" />}>
        <SponsorsSection />
      </Suspense>
      
      <Suspense fallback={<div className="min-h-screen bg-black" />}>
        <LicensesSection />
      </Suspense>
      */}
    </>
  );
};

export default Affiliations;