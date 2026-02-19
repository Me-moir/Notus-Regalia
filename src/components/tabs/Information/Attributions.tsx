"use client";
import { memo } from 'react';
import React from 'react';
import { contentData } from '@/data/information-data';
import ContentHeader from './ContentHeader';
import { CardSpotlight } from '@/components/ui/card-spotlight';

interface Partner {
  logo: React.ReactNode;
  name: string;
  purpose: string;
}

const partners: Partner[] = [
  {
    logo: (
      <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>
      </svg>
    ),
    name: 'Acme Corp',
    purpose: 'Cloud Infrastructure',
  },
  {
    logo: (
      <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>
      </svg>
    ),
    name: 'Bright Labs',
    purpose: 'Research Partner',
  },
  {
    logo: (
      <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
      </svg>
    ),
    name: 'CoreStack',
    purpose: 'Data Analytics',
  },
  {
    logo: (
      <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
    name: 'Deft Systems',
    purpose: 'Security Framework',
  },
  {
    logo: (
      <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/>
      </svg>
    ),
    name: 'Elevate AI',
    purpose: 'AI / ML Platform',
  },
  {
    logo: (
      <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><circle cx="12" cy="20" r="1" fill="rgba(255,255,255,0.85)" stroke="none"/>
      </svg>
    ),
    name: 'Flux Networks',
    purpose: 'Network Provider',
  },
  {
    logo: (
      <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22V12M12 12C12 12 7 9 7 5a5 5 0 0 1 10 0c0 4-5 7-5 7z"/>
      </svg>
    ),
    name: 'GreenPath',
    purpose: 'Sustainability Tools',
  },
  {
    logo: (
      <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/>
      </svg>
    ),
    name: 'Helios Studio',
    purpose: 'Design Systems',
  },
];

const PartnerCard = ({ partner }: { partner: Partner }) => (
  <CardSpotlight>
    {/* Icon pill — centered, bigger */}
    <div style={{
      width: 64, height: 64,
      borderRadius: '50%',
      background: 'rgba(255,255,255,0.08)',
      border: '1px solid rgba(255,255,255,0.14)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0,
    }}>
      {partner.logo}
    </div>

    {/* Divider */}
    <hr style={{ width: '75%', height: '1px', background: 'hsl(240, 9%, 17%)', border: 'none', margin: 0 }} />

    {/* Text — centered, larger */}
    <div style={{ textAlign: 'center' }}>
      <p style={{ color: '#fff', fontWeight: 700, fontSize: '1rem', margin: 0, letterSpacing: '0.01em' }}>
        {partner.name}
      </p>
      <p style={{ color: 'hsl(0, 0%, 60%)', fontSize: '0.75rem', margin: '0.35rem 0 0', letterSpacing: '0.02em' }}>
        {partner.purpose}
      </p>
    </div>
  </CardSpotlight>
);

interface AttributionsProps {
  isTransitioning?: boolean;
}

const content = contentData.attributions;

const Attributions = memo(({ isTransitioning = false }: AttributionsProps) => {
  return (
    <div className={`px-4 sm:px-8 lg:px-20 py-8 sm:py-12 lg:py-16 transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
      <div className="max-w-7xl mx-auto space-y-8 sm:space-y-12">

        <ContentHeader
          icon={content.icon}
          title={content.title}
          isTransitioning={isTransitioning}
        />

        <div className="space-y-6 sm:space-y-8">
          {content.sections.map((section, index) => (
            <div key={index} className="space-y-3 sm:space-y-4">
              {section.heading && (
                <h3 className={`text-xl sm:text-2xl lg:text-3xl font-semibold ${section.heading === 'Acknowledgments' ? 'text-center' : ''}`} style={{ color: 'var(--content-primary)' }}>
                  {section.heading}
                </h3>
              )}
              <div className={section.heading === 'Acknowledgments' ? 'space-y-3 sm:space-y-4 text-center max-w-3xl mx-auto' : 'space-y-3 sm:space-y-4'}>
                {section.content.map((paragraph, pIndex) => (
                  <p key={pIndex} className={section.heading === 'Acknowledgments' ? 'text-base sm:text-lg lg:text-xl leading-relaxed mx-auto' : 'text-base sm:text-lg lg:text-xl leading-relaxed'} style={{ color: 'var(--content-muted)' }}>
                    {paragraph}
                  </p>
                ))}
              </div>
              {index < content.sections.length - 1 && (
                <div className="w-full h-px bg-gradient-to-r from-transparent via-[var(--border-color)] to-transparent mt-6 sm:mt-8" />
              )}
            </div>
          ))}
        </div>

        <div className="w-full h-px bg-gradient-to-r from-transparent via-[var(--border-color)] to-transparent" />

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 sm:gap-8">
          {partners.map((partner) => (
            <PartnerCard key={partner.name} partner={partner} />
          ))}
        </div>

        <div className="pt-6 sm:pt-8" style={{ borderTop: '1px solid var(--border-color)' }}>
          <p className="text-sm sm:text-base text-center" style={{ color: 'var(--content-muted)' }}>
            Last updated: January 2026 • All trademarks and logos are the property of their respective owners.
          </p>
        </div>

      </div>
    </div>
  );
});

Attributions.displayName = 'Attributions';
export default Attributions;