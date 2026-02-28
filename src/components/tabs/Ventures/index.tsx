"use client";
import { useState } from 'react';
import VenturesTab from './Defense';

type VenturesSubtab = 'ventures-defense' | 'ventures-civic-operations' | 'ventures-healthcare';

interface VenturesProps {
  activeSubtab?: string;
}

const Ventures = ({ activeSubtab }: VenturesProps) => {
  const active = (activeSubtab as VenturesSubtab) ?? 'ventures-defense';

  return (
    <>
      {active === 'ventures-defense' && <VenturesTab />}
      {active === 'ventures-civic-operations' && <VenturesTab />}
      {active === 'ventures-healthcare' && <VenturesTab />}
    </>
  );
};

export default Ventures;