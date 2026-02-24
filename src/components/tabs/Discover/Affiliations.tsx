"use client";
import { memo } from 'react';

const affiliations = [
  {
    tier: 'Strategic',
    code: 'AFF-A',
    name: 'The Sovereign Collective',
    type: 'Alliance',
    region: 'Global',
    since: '2022',
    description: 'A coalition of aligned organisations operating at the intersection of capital and continuity.',
  },
  {
    tier: 'Strategic',
    code: 'AFF-B',
    name: 'Meridian Institute',
    type: 'Research Partner',
    region: 'Asia-Pacific',
    since: '2023',
    description: 'Joint research into emergent intelligence architectures and post-fragmentation social systems.',
  },
  {
    tier: 'Operational',
    code: 'AFF-C',
    name: 'Vantage Protocol',
    type: 'Technology Partner',
    region: 'North America',
    since: '2023',
    description: 'Infrastructure and toolchain partner enabling secure, sovereign data pipelines across the continuum.',
  },
  {
    tier: 'Operational',
    code: 'AFF-D',
    name: 'Arclight Foundation',
    type: 'Philanthropic Arm',
    region: 'Europe',
    since: '2021',
    description: 'Supports access programs, community intelligence initiatives, and the Sandbox Program scholarships.',
  },
  {
    tier: 'Community',
    code: 'AFF-E',
    name: 'The Open Dynasty Network',
    type: 'Community Alliance',
    region: 'Distributed',
    since: '2024',
    description: 'A decentralised network of contributors, builders, and Fools operating under the Notus ethos.',
  },
];

const TIER_META: Record<string, { color: string }> = {
  Strategic:   { color: '#E31B54' },
  Operational: { color: '#94a3b8' },
  Community:   { color: '#4ade80' },
};

const AffiliationRow = memo(({ aff, index }: { aff: typeof affiliations[0]; index: number }) => {
  const tm = TIER_META[aff.tier];
  return (
    <div className="aff-row" style={{ animationDelay: `${index * 60}ms` }}>
      <div className="aff-row-accent" style={{ background: tm.color }} />
      <div className="aff-col aff-col-code">
        <span className="aff-code">{aff.code}</span>
      </div>
      <div className="aff-col aff-col-main">
        <div className="aff-name-row">
          <span className="aff-name">{aff.name}</span>
          <span className="aff-tier" style={{ color: tm.color, borderColor: `${tm.color}40` }}>{aff.tier}</span>
        </div>
        <p className="aff-desc">{aff.description}</p>
      </div>
      <div className="aff-col aff-col-meta">
        <span className="aff-meta-item">{aff.type}</span>
        <span className="aff-meta-item aff-region">{aff.region}</span>
        <span className="aff-meta-item aff-since">est. {aff.since}</span>
      </div>
    </div>
  );
});
AffiliationRow.displayName = 'AffiliationRow';

const Affiliations = () => {
  return (
    <section id="section-affiliations" className="aff-root">
      <style jsx>{`
        .aff-root {
          position: relative;
          background: var(--surface-primary, #07070e);
          color: var(--content-primary, #e2e8f0);
          border-top: 1px solid rgba(255,255,255,0.08);
          padding: clamp(4rem, 8vw, 7rem) clamp(1.25rem, 6vw, 9rem);
          overflow: hidden;
        }
        .aff-root::before {
          content: '';
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px);
          background-size: 32px 32px;
          mask-image: linear-gradient(to bottom, transparent, black 8%, black 92%, transparent);
          -webkit-mask-image: linear-gradient(to bottom, transparent, black 8%, black 92%, transparent);
          pointer-events: none;
        }

        .eyebrow {
          display: inline-flex; align-items: center; gap: 0.55rem;
          font-size: clamp(0.65rem, 1.2vw, 0.75rem);
          font-family: ui-monospace, Menlo, monospace;
          text-transform: uppercase; letter-spacing: 0.22em;
          font-weight: 700; color: #E31B54; margin-bottom: 1.25rem;
        }
        .eyebrow-dot {
          width: 5px; height: 5px; border-radius: 50%;
          background: #E31B54; flex-shrink: 0;
          animation: epulse 2s ease-in-out infinite;
        }
        @keyframes epulse {
          0%,100% { opacity:1; box-shadow: 0 0 0 0 rgba(227,27,84,0.5); }
          50%      { opacity:0.7; box-shadow: 0 0 0 5px rgba(227,27,84,0); }
        }

        .section-heading {
          font-size: clamp(2.25rem, 5vw, 4rem);
          font-weight: 300; letter-spacing: -0.03em; line-height: 1.05;
          color: #f1f5f9; margin-bottom: 0.75rem;
        }
        .section-heading-accent { color: #E31B54; }

        .section-sub {
          font-size: clamp(0.875rem, 1.8vw, 1.05rem);
          color: rgba(255,255,255,0.4); line-height: 1.65;
          max-width: 52ch; margin-bottom: 3rem;
        }

        .stat-bar {
          display: flex; align-items: center; gap: 2rem;
          margin-bottom: 3rem; padding: 0.875rem 1.5rem;
          border: 1px solid rgba(255,255,255,0.06);
          border-left: 3px solid #E31B54;
          background: rgba(255,255,255,0.015);
          width: fit-content;
        }
        .stat { display: flex; flex-direction: column; gap: 0.2rem; }
        .stat-value {
          font-size: 1.35rem; font-weight: 700;
          font-family: ui-monospace, Menlo, monospace; letter-spacing: -0.02em;
          color: #f1f5f9;
        }
        .stat-label {
          font-size: 0.62rem; text-transform: uppercase; letter-spacing: 0.18em;
          color: rgba(255,255,255,0.35); font-family: ui-monospace, Menlo, monospace;
        }
        .stat-divider { width: 1px; height: 2rem; background: rgba(255,255,255,0.08); }

        /* ── Table ── */
        .aff-table {
          display: flex; flex-direction: column;
          border: 1px solid rgba(255,255,255,0.07);
        }
        .aff-table-head {
          display: grid;
          grid-template-columns: 80px 1fr 160px;
          gap: 1.5rem; padding: 0.6rem 1.5rem;
          background: rgba(255,255,255,0.02);
          border-bottom: 1px solid rgba(255,255,255,0.07);
        }
        .aff-head-label {
          font-size: 0.58rem; font-family: ui-monospace, Menlo, monospace;
          text-transform: uppercase; letter-spacing: 0.18em;
          color: rgba(255,255,255,0.2);
        }

        .aff-row {
          position: relative;
          display: grid;
          grid-template-columns: 80px 1fr 160px;
          gap: 1.5rem; padding: 1.5rem;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          transition: background 0.2s ease;
          animation: row-in 0.5s cubic-bezier(0.22,1,0.36,1) both;
          overflow: hidden;
        }
        .aff-row:last-child { border-bottom: none; }
        .aff-row:hover { background: rgba(255,255,255,0.02); }
        @keyframes row-in {
          from { opacity:0; transform:translateY(10px); }
          to   { opacity:1; transform:translateY(0); }
        }

        .aff-row-accent {
          position: absolute; left: 0; top: 0; bottom: 0; width: 3px;
          opacity: 0; transition: opacity 0.25s ease;
        }
        .aff-row:hover .aff-row-accent { opacity: 1; }

        .aff-col { display: flex; flex-direction: column; justify-content: center; gap: 0.3rem; min-width: 0; }

        .aff-code {
          font-family: ui-monospace, Menlo, monospace;
          font-size: 0.65rem; letter-spacing: 0.14em;
          color: rgba(255,255,255,0.22); text-transform: uppercase;
        }
        .aff-name-row { display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap; }
        .aff-name {
          font-size: clamp(0.9rem, 1.6vw, 1.05rem); font-weight: 600;
          color: #f1f5f9; letter-spacing: -0.01em;
        }
        .aff-tier {
          font-size: 0.58rem; font-family: ui-monospace, Menlo, monospace;
          text-transform: uppercase; letter-spacing: 0.12em;
          padding: 2px 7px; border: 1px solid; border-radius: 1px; white-space: nowrap;
        }
        .aff-desc {
          font-size: clamp(0.78rem, 1.3vw, 0.88rem);
          color: rgba(255,255,255,0.4); line-height: 1.6; margin-top: 0.2rem;
        }
        .aff-col-meta { align-items: flex-end; text-align: right; }
        .aff-meta-item {
          font-family: ui-monospace, Menlo, monospace;
          font-size: 0.65rem; color: rgba(255,255,255,0.3);
          letter-spacing: 0.06em; white-space: nowrap;
        }
        .aff-region { color: rgba(255,255,255,0.2); }
        .aff-since  { color: rgba(255,255,255,0.15); }

        @media (max-width: 768px) {
          .aff-table-head { display: none; }
          .aff-row { grid-template-columns: 1fr; gap: 0.5rem; }
          .aff-col-code { flex-direction: row; align-items: center; }
          .aff-col-meta { align-items: flex-start; text-align: left; flex-direction: row; gap: 1rem; flex-wrap: wrap; }
          .stat-bar { flex-wrap: wrap; gap: 1rem; }
        }

        :global(.light) .aff-root { background: #f8fafc; color: #0f172a; }
        :global(.light) .aff-root::before {
          background-image:
            linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px);
        }
        :global(.light) .section-heading { color: #0f172a; }
        :global(.light) .section-sub { color: #64748b; }
        :global(.light) .stat-bar { background: rgba(0,0,0,0.02); border-color: rgba(0,0,0,0.08); }
        :global(.light) .stat-value { color: #0f172a; }
        :global(.light) .stat-label { color: #94a3b8; }
        :global(.light) .stat-divider { background: rgba(0,0,0,0.08); }
        :global(.light) .aff-table { border-color: rgba(0,0,0,0.08); }
        :global(.light) .aff-table-head { background: rgba(0,0,0,0.02); border-bottom-color: rgba(0,0,0,0.08); }
        :global(.light) .aff-head-label { color: #94a3b8; }
        :global(.light) .aff-row { border-bottom-color: rgba(0,0,0,0.06); }
        :global(.light) .aff-row:hover { background: rgba(0,0,0,0.015); }
        :global(.light) .aff-name { color: #0f172a; }
        :global(.light) .aff-code { color: #94a3b8; }
        :global(.light) .aff-desc { color: #64748b; }
        :global(.light) .aff-meta-item { color: #94a3b8; }
        :global(.light) .aff-region { color: #cbd5e1; }
        :global(.light) .aff-since  { color: #e2e8f0; }
      `}</style>

      <div className="relative z-10">
        <div className="eyebrow"><span className="eyebrow-dot" />External Alliances</div>
        <h2 className="section-heading">Affili<span className="section-heading-accent">ations</span></h2>
        <p className="section-sub">
          Carefully selected alliances — each partnership advancing the continuum through a specific lens of geography, capability, or community.
        </p>

        <div className="stat-bar">
          <div className="stat">
            <span className="stat-value">{affiliations.length}</span>
            <span className="stat-label">Partners</span>
          </div>
          <div className="stat-divider" />
          {(['Strategic', 'Operational', 'Community'] as const).map(tier => (
            <div key={tier} className="stat">
              <span className="stat-value" style={{ color: TIER_META[tier].color }}>
                {affiliations.filter(a => a.tier === tier).length}
              </span>
              <span className="stat-label">{tier}</span>
            </div>
          ))}
        </div>

        <div className="aff-table">
          <div className="aff-table-head">
            <span className="aff-head-label">Code</span>
            <span className="aff-head-label">Organisation</span>
            <span className="aff-head-label" style={{ textAlign: 'right' }}>Details</span>
          </div>
          {affiliations.map((aff, i) => (
            <AffiliationRow key={aff.code} aff={aff} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default memo(Affiliations);