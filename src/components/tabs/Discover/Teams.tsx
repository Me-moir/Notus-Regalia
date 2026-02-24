"use client";
import { memo, useRef, useEffect, useState } from 'react';
import Image from 'next/image';

const founders = [
  {
    id: 'F-001',
    name: 'Founder Name',
    title: 'Chief Executive Officer',
    role: 'Vision & Strategy',
    src: null as string | null,
    initials: 'FN',
    links: { x: '#', linkedin: '#' },
  },
  {
    id: 'F-002',
    name: 'Founder Name',
    title: 'Chief Operating Officer',
    role: 'Operations & Structure',
    src: null as string | null,
    initials: 'FN',
    links: { x: '#', linkedin: '#' },
  },
  {
    id: 'F-003',
    name: 'Founder Name',
    title: 'Chief Technology Officer',
    role: 'Systems & Infrastructure',
    src: null as string | null,
    initials: 'FN',
    links: { x: '#', linkedin: '#' },
  },
  {
    id: 'F-004',
    name: 'Founder Name',
    title: 'Chief Creative Officer',
    role: 'Design & Perception',
    src: null as string | null,
    initials: 'FN',
    links: { x: '#', linkedin: '#' },
  },
];

const stats = [
  { value: '4',  accent: true,  label: 'Founders'       },
  { value: '6',  accent: false, label: 'Active Units'   },
  { value: '44', accent: false, label: 'Total Members'  },
];

/* ── Founder Card ── */
const FounderCard = memo(({ founder, index }: { founder: typeof founders[0]; index: number }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty('--cx', `${e.clientX - r.left}px`);
      el.style.setProperty('--cy', `${e.clientY - r.top}px`);
    };
    el.addEventListener('mousemove', onMove, { passive: true });
    return () => el.removeEventListener('mousemove', onMove);
  }, []);

  return (
    <div
      ref={cardRef}
      className="fc-wrap"
      style={{ animationDelay: `${index * 100}ms` }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Portrait area */}
      <div className="fc-portrait">
        {founder.src ? (
          <Image
            src={founder.src}
            alt={founder.name}
            fill
            className="fc-img"
            style={{ objectFit: 'cover', objectPosition: 'top center' }}
          />
        ) : (
          <div className="fc-placeholder">
            <div className="fc-placeholder-grid" />
            {/* Silhouette */}
            <svg className="fc-silhouette" viewBox="0 0 120 160" fill="none" xmlns="http://www.w3.org/2000/svg">
              <ellipse cx="60" cy="52" rx="26" ry="28" fill="rgba(227,27,84,0.18)" />
              <path d="M10 160 C10 118 30 100 60 100 C90 100 110 118 110 160Z" fill="rgba(227,27,84,0.18)" />
            </svg>
            <span className="fc-tba">Portrait TBA</span>
          </div>
        )}

        {/* ID badge */}
        <span className="fc-id">{founder.id}</span>

        {/* Social overlay on hover */}
        <div className={`fc-overlay${hovered ? ' is-hovered' : ''}`}>
          <div className="fc-socials">
            <a href={founder.links.x} className="fc-social-btn" aria-label="X" onClick={e => e.stopPropagation()}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            <a href={founder.links.linkedin} className="fc-social-btn" aria-label="LinkedIn" onClick={e => e.stopPropagation()}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Info below portrait */}
      <div className="fc-info">
        <h3 className="fc-name">{founder.name}</h3>
        <p className="fc-title">{founder.title}</p>
        <span className="fc-role">{founder.role}</span>
      </div>
    </div>
  );
});
FounderCard.displayName = 'FounderCard';

/* ── Main ── */
const Teams = () => (
  <section id="section-teams" className="teams-root">
    <style jsx>{`

      /* Root */
      .teams-root {
        position: relative;
        background: var(--gradient-section);
        color: var(--content-primary);
        border-top: 1px dashed var(--border-dashed);
        border-bottom: 1px dashed var(--border-dashed);
        overflow: hidden;
      }
      .teams-root::before {
        content: '';
        position: absolute; inset: 0; pointer-events: none;
        background-image:
          linear-gradient(rgba(255,255,255,0.012) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.012) 1px, transparent 1px);
        background-size: 32px 32px;
        mask-image: linear-gradient(to bottom, transparent, black 4%, black 96%, transparent);
        -webkit-mask-image: linear-gradient(to bottom, transparent, black 4%, black 96%, transparent);
      }

      /* ═══════════════════════════
         TOP HERO ROW
      ═══════════════════════════ */
      .teams-hero {
        display: grid;
        grid-template-columns: 1fr;
        gap: 2rem;
        padding: 2rem clamp(1.25rem, 3vw, 2.5rem);
        border-bottom: 1px dashed var(--border-dashed);
        position: relative; z-index: 1;
      }
      @media (min-width: 768px) {
        .teams-hero {
          grid-template-columns: 1fr auto;
          gap: 2.5rem;
          align-items: start;
        }
      }

      /* Left: text */
      .teams-hero-left { display: flex; flex-direction: column; }

      .teams-eyebrow {
        display: inline-flex; align-items: center; gap: 0.55rem;
        font-size: clamp(0.65rem, 1.2vw, 0.72rem);
        font-family: ui-monospace, Menlo, monospace;
        text-transform: uppercase; letter-spacing: 0.22em;
        font-weight: 700; color: #E31B54; margin-bottom: 0.6rem;
      }
      .teams-eyebrow-dot {
        width: 5px; height: 5px; border-radius: 50%;
        background: #E31B54; flex-shrink: 0;
        animation: epulse 2s ease-in-out infinite;
      }
      @keyframes epulse {
        0%,100% { opacity:1; box-shadow:0 0 0 0 rgba(227,27,84,0.5); }
        50%      { opacity:0.7; box-shadow:0 0 0 5px rgba(227,27,84,0); }
      }

      .teams-heading {
        font-size: clamp(1.25rem, 2.5vw, 2rem);
        font-weight: 700; letter-spacing: -0.03em; line-height: 1.0;
        color: #f1f5f9;
        margin-bottom: 0.875rem;
      }

      .teams-sub {
        font-size: clamp(0.8rem, 1.3vw, 0.9rem);
        color: var(--content-muted); line-height: 1.75;
        max-width: 52ch;
      }

      /* Right: stats box */
      .teams-stats-box {
        border: 1px dashed var(--border-dashed);
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        min-width: 320px;
        position: relative;
      }
      @media (max-width: 767px) {
        .teams-stats-box { min-width: 0; width: 100%; }
      }

      /* Crimson top + bottom accent lines */
      .teams-stats-box::before,
      .teams-stats-box::after {
        content: '';
        position: absolute; left: 0; right: 0; height: 2px;
        background: #E31B54;
        box-shadow: 0 0 10px rgba(227,27,84,0.5);
      }
      .teams-stats-box::before { top: -2px; }
      .teams-stats-box::after  { bottom: -2px; }

      .stat-cell {
        display: flex; flex-direction: column;
        align-items: center; justify-content: center;
        padding: 1rem 1.25rem;
        border-right: 1px dashed var(--border-dashed);
        gap: 0.3rem;
      }
      .stat-cell:last-child { border-right: none; }

      .stat-value {
        font-family: ui-monospace, Menlo, monospace;
        font-size: clamp(1.25rem, 2vw, 1.65rem);
        font-weight: 700; line-height: 1; letter-spacing: -0.02em;
        color: var(--content-primary);
      }
      .stat-value.accent { color: #E31B54; }
      .stat-label {
        font-size: 0.55rem; text-transform: uppercase; letter-spacing: 0.18em;
        color: rgba(255,255,255,0.3); font-family: ui-monospace, Menlo, monospace;
        text-align: center;
      }
      .stat-divider {
        position: absolute; top: 50%; transform: translateY(-50%);
        width: 1px; height: 40%; background: var(--border-dashed);
      }

      /* ═══════════════════════════
         FOUNDERS STRIP
      ═══════════════════════════ */
      .founders-section {
        position: relative; z-index: 1;
      }

      .founders-label-row {
        display: flex; align-items: center; gap: 1rem;
        padding: 0.875rem clamp(1.25rem, 3vw, 2.5rem);
        border-bottom: 1px solid rgba(255,255,255,0.06);
      }
      .founders-label {
        font-size: clamp(0.85rem, 1.5vw, 1rem);
        font-weight: 500; color: var(--content-primary);
        white-space: nowrap;
      }
      .founders-label-line {
        flex: 1; height: 1px;
        background: linear-gradient(to right, rgba(255,255,255,0.12), transparent);
      }

      /* 4-column portrait grid */
      .founders-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
      }
      @media (max-width: 767px) {
        .founders-grid { grid-template-columns: repeat(2, 1fr); }
      }

      .fc-wrap {
        position: relative;
        border-right: 1px solid rgba(255,255,255,0.06);
        animation: card-in 0.55s cubic-bezier(0.22,1,0.36,1) both;
        cursor: default;
      }
      .fc-wrap:last-child { border-right: none; }
      @media (max-width: 767px) {
        .fc-wrap:nth-child(2n) { border-right: none; }
        .fc-wrap:nth-child(n+3) { border-top: 1px solid rgba(255,255,255,0.06); }
      }
      @keyframes card-in {
        from { opacity:0; transform:translateY(16px); }
        to   { opacity:1; transform:translateY(0); }
      }

      /* Portrait */
      .fc-portrait {
        position: relative;
        width: 100%;
        aspect-ratio: 2/3;
        overflow: hidden;
        background: #0a0a10;
      }

      .fc-img { transition: transform 0.6s ease; }
      .fc-wrap:hover .fc-img { transform: scale(1.05); }

      .fc-placeholder {
        width: 100%; height: 100%;
        display: flex; align-items: center; justify-content: center;
        background: linear-gradient(160deg, #0d0d18 0%, #140a0e 100%);
        position: relative;
      }
      .fc-placeholder-grid {
        position: absolute; inset: 0;
        background-image:
          linear-gradient(rgba(227,27,84,0.05) 1px, transparent 1px),
          linear-gradient(90deg, rgba(227,27,84,0.05) 1px, transparent 1px);
        background-size: 24px 24px;
      }
      .fc-initials {
        font-family: ui-monospace, Menlo, monospace;
        font-size: clamp(2rem, 5vw, 3.5rem); font-weight: 200;
        color: rgba(227,27,84,0.2); position: relative; z-index: 1;
        letter-spacing: 0.05em;
      }

      /* Red tint overlay on placeholder — matches screenshot feel */
      .fc-placeholder::after {
        content: '';
        position: absolute; inset: 0;
        background: rgba(227,27,84,0.06);
        mix-blend-mode: multiply;
        pointer-events: none;
      }

      .fc-id {
        position: absolute; top: 0.75rem; left: 0.75rem;
        font-family: ui-monospace, Menlo, monospace;
        font-size: 0.52rem; letter-spacing: 0.14em; text-transform: uppercase;
        color: rgba(255,255,255,0.4);
        background: rgba(0,0,0,0.6); backdrop-filter: blur(6px);
        padding: 3px 7px; border-radius: 1px;
        border: 1px solid rgba(255,255,255,0.1);
      }

      /* Hover overlay with socials */
      .fc-overlay {
        position: absolute; inset: 0;
        background: linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.1) 60%, transparent 100%);
        display: flex; align-items: flex-end; justify-content: flex-end;
        padding: 1rem;
        opacity: 0; transition: opacity 0.3s ease;
      }
      .fc-overlay.is-hovered { opacity: 1; }
      .fc-socials { display: flex; gap: 0.4rem; }
      .fc-social-btn {
        display: inline-flex; align-items: center; justify-content: center;
        width: 30px; height: 30px; border-radius: 2px;
        background: rgba(0,0,0,0.65); backdrop-filter: blur(8px);
        border: 1px solid rgba(255,255,255,0.12);
        color: rgba(255,255,255,0.65); text-decoration: none;
        transition: color 0.2s, border-color 0.2s, background 0.2s;
      }
      .fc-social-btn:hover { color:#fff; border-color:rgba(227,27,84,0.5); background:rgba(227,27,84,0.18); }

      /* Info bar below portrait */
      .fc-info {
        padding: 0.75rem 1rem 0.875rem;
        border-top: 1px solid rgba(255,255,255,0.06);
        display: flex; flex-direction: column; gap: 0.2rem;
        transition: background 0.2s ease;
      }
      .fc-wrap:hover .fc-info { background: rgba(227,27,84,0.04); }

      .fc-name {
        font-size: 0.8rem; font-weight: 700;
        color: var(--content-primary); letter-spacing: -0.01em; line-height: 1.2;
      }
      .fc-title {
        font-size: 0.6rem; color: #E31B54; font-weight: 600;
        font-family: ui-monospace, Menlo, monospace;
        text-transform: uppercase; letter-spacing: 0.1em;
      }
      .fc-role {
        font-size: 0.55rem; font-family: ui-monospace, Menlo, monospace;
        text-transform: uppercase; letter-spacing: 0.1em;
        color: rgba(255,255,255,0.25);
      }

      /* Light mode */
      :global(.light) .teams-root { background: var(--gradient-section); }
      :global(.light) .teams-root::before {
        background-image:
          linear-gradient(rgba(0,0,0,0.025) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,0,0,0.025) 1px, transparent 1px);
      }
      :global(.light) .teams-heading { color: #0f172a; }
      :global(.light) .stat-label { color: rgba(0,0,0,0.3); }
      :global(.light) .stat-value { color: #0f172a; }
      :global(.light) .fc-wrap { border-right-color: rgba(0,0,0,0.08); }
      :global(.light) .fc-info { border-top-color: rgba(0,0,0,0.08); }
      :global(.light) .fc-wrap:hover .fc-info { background: rgba(227,27,84,0.03); }
      :global(.light) .fc-name { color: #0f172a; }
      :global(.light) .fc-role { color: rgba(0,0,0,0.35); }
      :global(.light) .fc-placeholder { background: linear-gradient(160deg, #f8fafc 0%, #fff1f4 100%); border-color: rgba(227,27,84,0.15); }
      :global(.light) .fc-placeholder::before { border-color: rgba(227,27,84,0.1); }
      :global(.light) .fc-tba { color: rgba(227,27,84,0.45); border-color: rgba(227,27,84,0.2); }
      :global(.light) .fc-placeholder-grid {
        background-image:
          linear-gradient(rgba(227,27,84,0.07) 1px, transparent 1px),
          linear-gradient(90deg, rgba(227,27,84,0.07) 1px, transparent 1px);
      }
      :global(.light) .fc-id { background: rgba(255,255,255,0.85); color: rgba(0,0,0,0.3); border-color: rgba(0,0,0,0.1); }
      :global(.light) .founders-label-line { background: linear-gradient(to right, rgba(0,0,0,0.12), transparent); }
      :global(.light) .founders-label-row { border-bottom-color: rgba(0,0,0,0.08); }
    `}</style>

    {/* ── Top hero row ── */}
    <div className="teams-hero">
      <div className="teams-hero-left">
        <div className="teams-eyebrow"><span className="teams-eyebrow-dot" />Dynasty Structure</div>
        <h2 className="teams-heading">The Organization</h2>
        <p className="teams-sub">
          The Notus Dynasty is built on layered authority and specialised execution —
          four founders at the apex, six units in motion, and a community at the base.
        </p>
      </div>

      <div className="teams-stats-box">
        {stats.map((s, i) => (
          <div key={i} className="stat-cell">
            <span className={`stat-value${s.accent ? ' accent' : ''}`}>{s.value}</span>
            <span className="stat-label">{s.label}</span>
          </div>
        ))}
      </div>
    </div>

    {/* ── Founders strip ── */}
    <div className="founders-section">
      <div className="founders-label-row">
        <span className="founders-label">The Four Founders</span>
        <div className="founders-label-line" />
      </div>
      <div className="founders-grid">
        {founders.map((f, i) => <FounderCard key={f.id} founder={f} index={i} />)}
      </div>
    </div>

  </section>
);

export default memo(Teams);