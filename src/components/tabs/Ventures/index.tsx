"use client";
import { lazy, Suspense } from 'react';

// Eager load: First section loads immediately
import VenturesTab from './VenturesTab';

// Lazy load: add more sections as you build them

interface VenturesProps {
  // Add props here if needed in the future
}

const Ventures = ({}: VenturesProps) => {
  return (
    <>
      {/* First section - loads immediately */}
      <VenturesTab />
      
      {/* Future sections - lazy load as you add them */}
    </>
  );
};

export default Ventures;