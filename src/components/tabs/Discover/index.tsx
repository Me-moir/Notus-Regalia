"use client";
import { memo } from 'react';
import Overview from './Overview';
import AboutHeader from './AboutHeader';

/* ═══════════════════════════════════════════════════════════════════════════
   Empty placeholder section — reused for future pages
   ═══════════════════════════════════════════════════════════════════════════ */
const PlaceholderSection = memo(({ id, title, subtitle }: { id: string; title: string; subtitle: string }) => (
  <section
    id={id}
    className="relative overflow-hidden"
    style={{
      background: 'var(--gradient-section)',
      borderTop: '1px dashed var(--border-dashed)',
      borderBottom: '1px dashed var(--border-dashed)',
    }}
  >
    <div className="relative z-10 px-4 sm:px-8 lg:px-20 py-24 sm:py-32 lg:py-40">
      <div className="max-w-3xl mx-auto text-center">
        <h2
          className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4"
          style={{
            background: 'var(--text-gradient)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            lineHeight: '1.3',
          }}
        >
          {title}
        </h2>
        <div
          className="w-24 sm:w-32 h-px mx-auto mb-6"
          style={{ background: 'linear-gradient(to right, transparent, var(--border-dashed), transparent)' }}
        />
        <p className="text-sm sm:text-base" style={{ color: 'var(--content-muted)' }}>
          {subtitle}
        </p>
      </div>
    </div>
  </section>
));
PlaceholderSection.displayName = 'PlaceholderSection';

const Discover = () => {
  return (
    <div style={{ paddingTop: 'env(safe-area-inset-top)' }}>
      {/* About Header */}
      <AboutHeader />

      {/* Overview Section */}
      <div id="section-overview">
        <Overview />
      </div>

      {/* About Section — placeholder */}
      <PlaceholderSection
        id="section-about"
        title="About"
        subtitle="This section is coming soon."
      />

      {/* Direction Section — placeholder */}
      <PlaceholderSection
        id="section-direction"
        title="Direction"
        subtitle="This section is coming soon."
      />

      {/* Team Section — placeholder */}
      <PlaceholderSection
        id="section-team"
        title="Team"
        subtitle="This section is coming soon."
      />

      {/* Governance Section — placeholder */}
      <PlaceholderSection
        id="section-governance"
        title="Governance"
        subtitle="This section is coming soon."
      />

      {/* Affiliations Section — placeholder */}
      <PlaceholderSection
        id="section-affiliations"
        title="Affiliations"
        subtitle="This section is coming soon."
      />
    </div>
  );
};

export default Discover;