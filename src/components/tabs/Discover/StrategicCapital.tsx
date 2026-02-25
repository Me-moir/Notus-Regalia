"use client";
import React, { memo, useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import {
  type Investor,
  type CapitalPhase,
  CAPITAL_PHASES,
  CAPITAL_STATS,
  INVESTOR_TYPE_COLORS,
} from '@/data/Discover-data';

/* ─────────────────────────────────────────
   SPRING PRESS UTILITY
───────────────────────────────────────── */
function springPress(el: Element) {
  el.classList.remove('sc-tab-pressed');
  void (el as HTMLElement).offsetWidth;
  el.classList.add('sc-tab-pressed');
  const cleanup = () => {
    el.classList.remove('sc-tab-pressed');
    el.removeEventListener('animationend', cleanup);
  };
  el.addEventListener('animationend', cleanup);
}

/* ─────────────────────────────────────────
   LOGO PLACEHOLDER
───────────────────────────────────────── */
function LogoPlaceholder({ name, color }: { name: string; color: string }) {
  const initials = name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
  return (
    <div style={{
      width: '100%', height: '100%',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: `linear-gradient(135deg, ${color}18 0%, ${color}08 100%)`,
      fontFamily: 'ui-monospace, Menlo, monospace',
      fontSize: 'clamp(1.25rem, 3vw, 1.75rem)',
      fontWeight: 700, color, letterSpacing: '-0.02em', userSelect: 'none',
    }}>
      {initials}
    </div>
  );
}

/* ─────────────────────────────────────────
   INVESTOR MODAL
───────────────────────────────────────── */
function InvestorModal({ investor, onClose }: { investor: Investor; onClose: () => void }) {
  const [mounted, setMounted] = useState(false);
  const color = INVESTOR_TYPE_COLORS[investor.type] || '#E31B54';

  useEffect(() => {
    setMounted(true);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!mounted) return null;

  return createPortal(
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 99999,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '24px', boxSizing: 'border-box',
        background: 'rgba(0,0,0,0.82)',
        backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        className="sc-modal-panel"
        style={{
          position: 'relative', display: 'flex', flexDirection: 'column',
          width: '100%', maxWidth: '620px', maxHeight: '88vh',
          borderRadius: '16px', overflow: 'hidden',
          background: '#0d0d1a',
          border: '1px solid rgba(255,255,255,0.10)',
          boxShadow: `0 32px 80px rgba(0,0,0,0.9), 0 0 0 1px ${color}12`,
        }}
      >
        {/* ── Header: centered logo, close top-right ── */}
        <div
          className="sc-modal-logo-header"
          style={{
            position: 'relative', flexShrink: 0, height: '160px',
            background: 'linear-gradient(170deg, #0e0e1c 0%, #160c14 100%)',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            overflow: 'hidden',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <div style={{ position: 'absolute', inset: 0, backgroundImage: `radial-gradient(circle, ${color}18 1px, transparent 1px)`, backgroundSize: '22px 22px', opacity: 0.7, pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse at 50% 50%, ${color}14 0%, transparent 65%)`, pointerEvents: 'none' }} />

          <div style={{
            position: 'relative', zIndex: 2,
            width: '88px', height: '88px',
            borderRadius: '16px', border: `1px solid ${color}35`,
            overflow: 'hidden', background: '#0d0d1a',
          }}>
            {investor.logo
              ? <img src={investor.logo} alt={investor.name} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '10px' }} />
              : <LogoPlaceholder name={investor.name} color={color} />
            }
          </div>

          {/* Close Profile button */}
          <div
            className="sc-tab-border"
            style={{ position: 'absolute', top: '14px', right: '14px', zIndex: 4 }}
            onPointerDown={e => springPress(e.currentTarget)}
          >
            <div className="sc-tab-item">
              <button className="sc-tab-btn sc-modal-btn" onClick={onClose} aria-label="Close profile">
                Close Profile
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ marginLeft: '4px', opacity: 0.6 }}>
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* ── Info body ── */}
        <div
          className="sc-modal-info"
          style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '2.25rem 2.5rem 2rem 2rem', overflowY: 'auto', minWidth: 0 }}
        >
          <div
            className="sc-modal-eyebrow"
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              fontFamily: 'ui-monospace, Menlo, monospace', fontSize: '10px',
              letterSpacing: '0.2em', textTransform: 'uppercase' as const,
              fontWeight: 700, color: 'rgba(255,255,255,0.30)', marginBottom: '16px',
            }}
          >
            <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#E31B54', flexShrink: 0 }} />
            {investor.phaseLabel}
          </div>

          <h2
            className="sc-modal-name"
            style={{
              fontSize: 'clamp(1.4rem, 3vw, 2rem)', fontWeight: 700,
              letterSpacing: '-0.03em', lineHeight: 1.1,
              background: 'linear-gradient(135deg, #f1f5f9 0%, rgba(241,245,249,0.6) 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', margin: 0,
            }}
          >{investor.name}</h2>

          <p style={{
            fontFamily: 'ui-monospace, Menlo, monospace', fontSize: '11px',
            color, fontWeight: 700, textTransform: 'uppercase' as const,
            letterSpacing: '0.14em', margin: '10px 0 0',
          }}>{investor.type}</p>

          <span
            className="sc-modal-role-tag"
            style={{
              display: 'inline-block', marginTop: '14px',
              fontFamily: 'ui-monospace, Menlo, monospace', fontSize: '10px',
              textTransform: 'uppercase' as const, letterSpacing: '0.12em',
              color: 'rgba(255,255,255,0.30)', background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.09)', padding: '4px 12px',
              borderRadius: '4px', alignSelf: 'flex-start',
            }}
          >{investor.investmentStructure}</span>

          <div className="sc-modal-divider" style={{ width: '100%', height: '1px', margin: '24px 0', background: 'linear-gradient(90deg, rgba(227,27,84,0.3), rgba(255,255,255,0.06) 50%, transparent)' }} />

          <div className="sc-modal-stats" style={{
            display: 'flex', alignItems: 'stretch',
            border: '1px solid rgba(255,255,255,0.07)', borderRadius: '10px',
            overflow: 'hidden', marginBottom: '24px', background: 'rgba(255,255,255,0.02)',
          }}>
            {[
              { val: investor.year,                lab: 'Year'      },
              { val: investor.roundName,           lab: 'Round'     },
              { val: investor.investmentStructure, lab: 'Structure' },
            ].map((s, i) => (
              <React.Fragment key={s.lab}>
                {i > 0 && <div className="sc-modal-stat-sep" style={{ width: '1px', background: 'rgba(255,255,255,0.07)', flexShrink: 0 }} />}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px 16px', gap: '8px' }}>
                  <span className="sc-modal-stat-val" style={{ fontFamily: 'ui-monospace, Menlo, monospace', fontSize: '15px', fontWeight: 700, color: '#f1f5f9', letterSpacing: '-0.02em', textAlign: 'center' as const, wordBreak: 'break-word' as const }}>{s.val}</span>
                  <span className="sc-modal-stat-lab" style={{ fontFamily: 'ui-monospace, Menlo, monospace', fontSize: '9px', textTransform: 'uppercase' as const, letterSpacing: '0.16em', color: 'rgba(255,255,255,0.25)', textAlign: 'center' as const }}>{s.lab}</span>
                </div>
              </React.Fragment>
            ))}
          </div>

          <div style={{ marginBottom: '24px' }}>
            <span className="sc-modal-about-label" style={{ display: 'block', fontFamily: 'ui-monospace, Menlo, monospace', fontSize: '9px', textTransform: 'uppercase' as const, letterSpacing: '0.22em', color: 'rgba(255,255,255,0.25)', marginBottom: '10px' }}>About</span>
            <p className="sc-modal-bio" style={{ fontSize: '14px', lineHeight: 1.85, color: 'rgba(255,255,255,0.55)', margin: 0 }}>{investor.description}</p>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <span className="sc-modal-impact-label" style={{ display: 'block', fontFamily: 'ui-monospace, Menlo, monospace', fontSize: '9px', textTransform: 'uppercase' as const, letterSpacing: '0.22em', color: 'rgba(255,255,255,0.25)', marginBottom: '12px' }}>Strategic Impact</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {investor.strategicImpact.map(impact => (
                <div key={impact} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '1px', background: color, flexShrink: 0, transform: 'rotate(45deg)' }} />
                  <span className="sc-modal-impact-text" style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.4 }}>{impact}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Footer — Learn More */}
          <div className="sc-modal-footer" style={{ display: 'flex', alignItems: 'center', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.07)', marginTop: 'auto' }}>
            <div
              className="sc-tab-border"
              onPointerDown={e => springPress(e.currentTarget)}
            >
              <div className="sc-tab-item">
                <a
                  href={investor.link && investor.link !== '#' ? investor.link : '#'}
                  target={investor.link && investor.link !== '#' ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  className="sc-tab-btn sc-modal-btn"
                  style={{ textDecoration: 'none' }}
                >
                  Learn More
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="13" height="13" style={{ marginLeft: '4px' }}>
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

/* ─────────────────────────────────────────
   INVESTOR CARD
───────────────────────────────────────── */
const InvestorCard = memo(({ investor, index, onExpand }: {
  investor: Investor; index: number; onExpand: (inv: Investor) => void;
}) => {
  const color = INVESTOR_TYPE_COLORS[investor.type] || '#E31B54';

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${e.clientX - rect.left}px`);
    el.style.setProperty('--my', `${e.clientY - rect.top}px`);
  };

  return (
    <div
      className="ic-outer"
      style={{ animationDelay: `${index * 80}ms` }}
      onMouseMove={handleMouseMove}
      onClick={() => onExpand(investor)}
      role="button" tabIndex={0}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') onExpand(investor); }}
    >
      <div className="ic-gradient-border" />
      <div className="ic-inner">

        {/* Logo */}
        <div className="ic-logo-wrap" style={{ borderBottom: `1px solid ${color}18` }}>
          <div className="ic-logo-inner">
            {investor.logo
              ? <img src={investor.logo} alt={investor.name} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '14px' }} />
              : <LogoPlaceholder name={investor.name} color={color} />
            }
          </div>
          <span className="ic-phase-badge" style={{ color, borderColor: `${color}35` }}>
            {investor.year}
          </span>
        </div>

        {/* Info */}
        <div className="ic-info">
          <h3 className="ic-name">{investor.name}</h3>
          <p className="ic-type" style={{ color }}>{investor.type}</p>
          <span className="ic-structure">{investor.investmentStructure}</span>
        </div>

        {/* Footer */}
        <div className="ic-footer">
          <div
            className="sc-tab-border"
            onClick={e => e.stopPropagation()}
            style={{ marginLeft: 'auto' }}
            onPointerDown={e => { e.stopPropagation(); springPress(e.currentTarget); }}
          >
            <div className="sc-tab-item">
              <button className="sc-tab-btn ic-btn" onClick={() => onExpand(investor)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="13" height="13">
                  <path d="M15 3h6m0 0v6m0-6-7 7M9 21H3m0 0v-6m0 6 7-7" />
                </svg>
                Expand
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
InvestorCard.displayName = 'InvestorCard';

/* ─────────────────────────────────────────
   COMING SOON BLOCK
───────────────────────────────────────── */
function ComingSoonBlock({ phase }: { phase: CapitalPhase }) {
  return (
    <div
      className="sc-coming-soon-block"
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
        gap: '1.5rem', padding: '2.5rem 2rem',
        border: '1px dashed var(--border-dashed, rgba(255,255,255,0.1))',
        borderRadius: '12px', background: 'rgba(255,255,255,0.01)',
        position: 'relative', overflow: 'hidden',
      }}
    >
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', backgroundImage: 'linear-gradient(rgba(255,255,255,0.012) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.012) 1px, transparent 1px)', backgroundSize: '24px 24px', opacity: 0.5 }} />
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <span className="sc-coming-soon-label" style={{ fontFamily: 'ui-monospace, Menlo, monospace', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.22em', fontWeight: 700, color: 'rgba(255,255,255,0.35)' }}>Not Yet Open</span>
        <p className="sc-coming-soon-desc" style={{ fontSize: '0.9rem', color: 'var(--content-muted)', lineHeight: 1.7, margin: 0, maxWidth: '48ch' }}>{phase.description}</p>
      </div>
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div className="sc-coming-soon-dot" style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'rgba(255,255,255,0.25)', animation: 'sc-epulse 3s ease-in-out infinite' }} />
        <span className="sc-coming-soon-text" style={{ fontFamily: 'ui-monospace, Menlo, monospace', fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)' }}>Coming Soon</span>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   MAIN SECTION
───────────────────────────────────────── */
const StrategicCapital = () => {
  const [activeInvestor, setActiveInvestor] = useState<Investor | null>(null);
  const handleExpand = useCallback((inv: Investor) => setActiveInvestor(inv), []);
  const handleClose  = useCallback(() => setActiveInvestor(null), []);

  return (
    <>
      <style>{`
        /* ── Keyframes ── */
        @keyframes sc-orbit {
          0%   { background-position:0% 0%; }
          100% { background-position:200% 0%; }
        }
        @keyframes sc-epulse {
          0%,100% { opacity:1; box-shadow:0 0 0 0 rgba(227,27,84,.5); }
          50%     { opacity:.7; box-shadow:0 0 0 5px rgba(227,27,84,0); }
        }
        @keyframes sc-card-in {
          from { opacity:0; transform:translateY(20px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes sc-phase-in {
          from { opacity:0; transform:translateX(-8px); }
          to   { opacity:1; transform:translateX(0); }
        }
        @keyframes scTabPress {
          0%   { transform: scale(1); }
          15%  { transform: scale(0.96); }
          50%  { transform: scale(1.02); }
          72%  { transform: scale(0.992); }
          88%  { transform: scale(1.004); }
          100% { transform: scale(1); }
        }
        .sc-tab-pressed {
          animation: scTabPress 0.75s cubic-bezier(0.16, 1, 0.3, 1) forwards !important;
          transform-origin: center !important;
        }

        /* ── Tab-border button ── */
        .sc-tab-border {
          display:inline-flex; flex-shrink:0;
          border-radius:10.5px; padding:1px;
          position:relative; background:transparent;
          transform-origin: center;
        }
        .sc-tab-border::before {
          content:''; position:absolute; inset:0; border-radius:10.5px;
          background:linear-gradient(90deg,
            rgba(0,255,166,0.0) 0%,  rgba(0,255,166,0.9) 15%,
            rgba(255,215,0,0.7) 30%, rgba(236,72,153,0.7) 45%,
            rgba(147,51,234,0.7) 60%,rgba(59,130,246,0.6) 75%,
            rgba(0,255,166,0.0) 90%);
          background-size:200% 100%;
          animation:sc-orbit 3s linear infinite;
          opacity:0; transition:opacity 0.3s ease; pointer-events:none;
        }
        .sc-tab-border:hover::before { opacity:1; }
        .sc-tab-item {
          display:inline-flex; align-items:stretch; border-radius:9.5px; overflow:hidden;
          box-shadow:0 2px 8px rgba(0,0,0,0.18),inset 0 1px 0 var(--glass-inset-top,rgba(255,255,255,0.06));
          transition:box-shadow 0.2s ease; flex-shrink:0;
          background:var(--navbar-bg,#0f0f0f); position:relative; z-index:1;
        }
        .sc-tab-border:hover .sc-tab-item {
          box-shadow:0 4px 14px rgba(0,0,0,0.26),inset 0 1px 0 var(--glass-inset-top,rgba(255,255,255,0.06));
        }
        .sc-tab-btn {
          display:inline-flex; align-items:center; gap:6px;
          border:none; background:transparent; cursor:pointer;
          font-weight:500; letter-spacing:0.01em;
          color:var(--content-faint,rgba(255,255,255,0.4));
          padding:8px 14px; font-size:0.88rem; line-height:1;
          transition:color 0.15s ease; user-select:none; white-space:nowrap;
        }
        .sc-tab-btn:hover { color:var(--content-primary,#f1f5f9); }
        .ic-btn       { padding:12px 18px !important; font-size:0.93rem !important; font-weight:600 !important; }
        .sc-modal-btn { padding:12px 20px !important; font-size:0.93rem !important; font-weight:600 !important; }

        /* ── Root ── */
        .sc-root {
          position:relative; background:var(--gradient-section);
          color:var(--content-primary);
          border-top:1px dashed var(--border-dashed);
          border-bottom:1px dashed var(--border-dashed);
          overflow:hidden;
        }
        .sc-root::before {
          content:''; position:absolute; inset:0; pointer-events:none;
          background-image:
            linear-gradient(rgba(255,255,255,.025) 1px,transparent 1px),
            linear-gradient(90deg,rgba(255,255,255,.025) 1px,transparent 1px);
          background-size:32px 32px;
          mask-image:linear-gradient(to bottom,transparent,black 4%,black 96%,transparent);
          -webkit-mask-image:linear-gradient(to bottom,transparent,black 4%,black 96%,transparent);
        }

        /* ── Hero ── */
        .sc-hero {
          display:grid; grid-template-columns:1fr;
          gap:3rem; padding:5rem 2rem 4rem;
          position:relative; z-index:1;
        }
        @media(min-width:640px)  { .sc-hero { padding-left:4rem; padding-right:4rem; } }
        @media(min-width:768px)  { .sc-hero { grid-template-columns:1fr auto; gap:4rem; align-items:center; padding:6rem 6rem 5rem; } }
        @media(min-width:1024px) { .sc-hero { padding-left:10rem; padding-right:10rem; } }
        @media(min-width:1280px) { .sc-hero { padding-left:16rem; padding-right:16rem; } }
        .sc-hero-left { display:flex; flex-direction:column; }

        .sc-eyebrow {
          display:inline-flex; align-items:center; gap:.5rem;
          font-size:.65rem; font-family:ui-monospace,Menlo,monospace;
          text-transform:uppercase; letter-spacing:.22em; font-weight:700;
          color:#E31B54; margin-bottom:1.25rem;
        }
        .sc-eyebrow-dot {
          width:5px; height:5px; border-radius:50%;
          background:#E31B54; flex-shrink:0;
          animation:sc-epulse 2s ease-in-out infinite;
        }

        .sc-heading {
          font-size:clamp(1.75rem,4vw,2.75rem);
          font-weight:700; letter-spacing:-.02em; line-height:1.15;
          background:var(--text-gradient,linear-gradient(135deg,#f1f5f9 0%,rgba(241,245,249,.7) 100%));
          -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
          margin-bottom:1.25rem;
        }
        .sc-sub { font-size:.9rem; line-height:2; color:var(--content-muted); }
        @media(min-width:640px) { .sc-sub { font-size:1.2rem; } }

        /* ── Stats box ── */
        .sc-stats-box {
          border:1px dashed var(--border-dashed);
          display:grid; grid-template-columns:repeat(3,1fr);
          min-width:480px; position:relative; align-self:center;
        }
        @media(max-width:767px) { .sc-stats-box { min-width:0; width:100%; } }
        .sc-stats-box::before, .sc-stats-box::after {
          content:''; position:absolute; left:0; right:0; height:2px;
          background:#E31B54; box-shadow:0 0 10px rgba(227,27,84,.5);
        }
        .sc-stats-box::before { top:-2px; }
        .sc-stats-box::after  { bottom:-2px; }
        .sc-stat-cell {
          display:flex; flex-direction:column; align-items:center; justify-content:center;
          padding:2.5rem 2rem; border-right:1px dashed var(--border-dashed); gap:.6rem;
        }
        .sc-stat-cell:last-child { border-right:none; }
        .sc-stat-value {
          font-family:ui-monospace,Menlo,monospace;
          font-size:clamp(1.6rem,2.5vw,2.2rem); font-weight:700;
          line-height:1; letter-spacing:-.04em; color:var(--content-primary);
        }
        .sc-stat-value.accent { color:#E31B54; }
        .sc-stat-label {
          font-size:.65rem; text-transform:uppercase; letter-spacing:.18em;
          color:rgba(255,255,255,.3); font-family:ui-monospace,Menlo,monospace; text-align:center;
        }

        /* ── Body ── */
        .sc-body { position:relative; z-index:1; padding:3rem 2rem 6rem; }
        @media(min-width:640px)  { .sc-body { padding-left:4rem; padding-right:4rem; } }
        @media(min-width:768px)  { .sc-body { padding:3rem 6rem 6rem; } }
        @media(min-width:1024px) { .sc-body { padding-left:10rem; padding-right:10rem; } }
        @media(min-width:1280px) { .sc-body { padding-left:16rem; padding-right:16rem; } }

        /* ── Phase blocks ── */
        .sc-phase-block { margin-bottom:4rem; animation:sc-phase-in 0.6s cubic-bezier(0.22,1,0.36,1) both; }
        .sc-phase-header { display:flex; align-items:center; gap:1.5rem; margin-bottom:0.75rem; }
        .sc-phase-title {
          font-size:clamp(1.1rem,2.5vw,1.5rem); font-weight:300;
          letter-spacing:-0.02em; color:var(--content-primary); white-space:nowrap;
        }
        .sc-phase-title-accent { color:#E31B54; }
        .sc-phase-live-dot {
          width:6px; height:6px; border-radius:50%; background:#E31B54; flex-shrink:0;
          animation:sc-epulse 2s ease-in-out infinite;
        }
        .sc-phase-line {
          flex:1; height:1px;
          background:linear-gradient(to right,rgba(227,27,84,0.3),rgba(255,255,255,0.06) 40%,transparent);
        }
        .sc-phase-coming-tag {
          font-family:ui-monospace,Menlo,monospace; font-size:9px;
          text-transform:uppercase; letter-spacing:0.18em;
          color:rgba(255,255,255,0.4); white-space:nowrap;
          border:1px solid rgba(255,255,255,0.15);
          padding:4px 10px; border-radius:3px;
        }
        .sc-phase-desc { font-size:.9rem; line-height:2; color:var(--content-muted); margin-bottom:2rem; max-width:72ch; }

        /* ── Investor grid ── */
        .ic-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:1.75rem; }
        @media(max-width:1023px) { .ic-grid { grid-template-columns:repeat(3,1fr); } }
        @media(max-width:767px)  { .ic-grid { grid-template-columns:repeat(2,1fr); gap:1.25rem; } }

        /* ── Investor Card ── */
        .ic-outer {
          position:relative; border-radius:.75rem;
          border:1px solid var(--border-color,rgba(255,255,255,.08));
          padding:1px; animation:sc-card-in .5s cubic-bezier(.22,1,.36,1) both;
          transition:transform .3s ease,box-shadow .3s ease; overflow:hidden; cursor:pointer;
        }
        .ic-outer:hover { transform:translateY(-4px); box-shadow:0 20px 50px rgba(0,0,0,.5); }
        .ic-gradient-border {
          position:absolute; inset:0; border-radius:.75rem; padding:1px;
          opacity:0; transition:opacity .4s ease; pointer-events:none; z-index:1;
          background:radial-gradient(400px circle at var(--mx,50%) var(--my,50%),
            rgba(0,255,166,.8),rgba(255,215,0,.6),rgba(236,72,153,.6),
            rgba(147,51,234,.6),rgba(59,130,246,.5),transparent 70%);
          -webkit-mask:linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0);
          -webkit-mask-composite:xor; mask-composite:exclude;
        }
        .ic-outer:hover .ic-gradient-border { opacity:1; }
        .ic-inner {
          position:relative; z-index:2; display:flex; flex-direction:column;
          border-radius:calc(.75rem - 1px); overflow:hidden;
          background:var(--gradient-card,#0f0f1a);
          border:.75px solid var(--border-subtle,rgba(255,255,255,.05)); height:100%;
        }
        .ic-logo-wrap {
          position:relative; width:100%; padding-bottom:100%;
          background:linear-gradient(170deg,#0e0e1c 0%,#160c14 100%);
          overflow:hidden; flex-shrink:0;
        }
        .ic-logo-inner { position:absolute; inset:0; display:flex; align-items:center; justify-content:center; }
        .ic-phase-badge {
          position:absolute; top:.75rem; left:.75rem; z-index:3;
          font-family:ui-monospace,Menlo,monospace; font-size:.5rem;
          letter-spacing:.16em; text-transform:uppercase;
          color:rgba(255,255,255,1); background:rgba(0,0,0,0.72); backdrop-filter:blur(8px);
          border:1px solid rgba(255,255,255,0.22); padding:4px 9px; border-radius:4px;
        }
        :root.light .ic-phase-badge { color:#0f172a; background:rgba(255,255,255,0.92); border:1px solid rgba(0,0,0,0.15); }
        .ic-info {
          padding:1.75rem 1.5rem 1.25rem; display:flex; flex-direction:column; gap:.65rem;
          border-top:1px solid rgba(255,255,255,.05);
        }
        .ic-name {
          font-size:1.2rem; font-weight:700; color:var(--content-primary);
          letter-spacing:-.02em; line-height:1.2; margin:0; transition:transform .3s;
        }
        .ic-outer:hover .ic-name { transform:translateY(-1px); }
        .ic-type {
          font-size:.75rem; font-weight:700; font-family:ui-monospace,Menlo,monospace;
          text-transform:uppercase; letter-spacing:.12em; margin:0; transition:transform .3s;
        }
        .ic-outer:hover .ic-type { transform:translateY(-1px); }
        .ic-structure {
          font-size:.7rem; font-family:ui-monospace,Menlo,monospace;
          text-transform:uppercase; letter-spacing:.1em; color:rgba(255,255,255,.22); transition:transform .3s;
        }
        .ic-outer:hover .ic-structure { transform:translateY(-1px); }
        .ic-footer {
          display:flex; align-items:center; gap:.75rem; padding:1rem 1.25rem 1.25rem;
          border-top:1px solid rgba(255,255,255,.04); margin-top:auto; transition:border-color .3s;
        }
        .ic-outer:hover .ic-footer { border-color:rgba(255,255,255,.08); }

        /* ── Coming soon block ── */
        .sc-coming-soon-block {
          display:flex; flex-direction:column; align-items:flex-start;
          gap:1.5rem; padding:2.5rem 2rem;
          border:1px dashed var(--border-dashed,rgba(255,255,255,0.1));
          border-radius:12px; background:rgba(255,255,255,0.01);
          position:relative; overflow:hidden;
        }

        /* ════════════════════════════════════
           LIGHT MODE
        ════════════════════════════════════ */
        :root.light .sc-root::before { display:none; }
        :root.light .sc-stat-label   { color:rgba(0,0,0,.3); }
        :root.light .sc-stat-value   { color:#0f172a; }
        :root.light .sc-phase-title  { color:#0f172a; }
        :root.light .sc-phase-desc   { color:#64748b; }
        :root.light .sc-phase-coming-tag { color:rgba(0,0,0,.5); border-color:rgba(0,0,0,.2); }
        :root.light .sc-phase-line   { background:linear-gradient(to right,rgba(227,27,84,0.3),rgba(0,0,0,0.06) 40%,transparent); }
        :root.light .ic-outer  { border:1.5px solid rgba(0,0,0,.14); }
        :root.light .ic-outer:hover { transform:translateY(-3px); box-shadow:0 6px 18px rgba(0,0,0,.10); }
        :root.light .ic-outer:hover .ic-gradient-border { opacity:0; }
        :root.light .ic-inner  { background:#ffffff; border:none; }
        :root.light .ic-name   { color:#0f172a; }
        :root.light .ic-structure { color:rgba(0,0,0,.4); }
        :root.light .ic-logo-wrap { background:linear-gradient(170deg,#e2e8f0 0%,#cbd5e1 100%); }
        :root.light .ic-info   { border-top:1px solid rgba(0,0,0,.07); }
        :root.light .ic-footer { border-top:1px solid rgba(0,0,0,.07); }
        :root.light .ic-outer:hover .ic-footer { border-color:rgba(0,0,0,.1); }
        :root.light .sc-tab-item {
          background:#ffffff;
          box-shadow:0 2px 6px rgba(0,0,0,.10),0 4px 16px rgba(0,0,0,.07),inset 0 1px 0 rgba(255,255,255,1);
          outline:1px solid rgba(0,0,0,.11);
        }
        :root.light .sc-tab-border:hover .sc-tab-item {
          box-shadow:0 4px 12px rgba(0,0,0,.14),0 8px 24px rgba(0,0,0,.09),inset 0 1px 0 rgba(255,255,255,1);
          outline:1px solid rgba(0,0,0,.15);
        }
        :root.light .sc-tab-btn       { color:rgba(0,0,0,.45); }
        :root.light .sc-tab-btn:hover { color:rgba(0,0,0,.9);  }
        :root.light .sc-coming-soon-block { border-color:rgba(0,0,0,0.15) !important; background:rgba(0,0,0,0.02) !important; }
        :root.light .sc-coming-soon-label { color:rgba(0,0,0,.5) !important; }
        :root.light .sc-coming-soon-desc  { color:rgba(0,0,0,.6) !important; }
        :root.light .sc-coming-soon-dot   { background:rgba(0,0,0,.3) !important; }
        :root.light .sc-coming-soon-text  { color:rgba(0,0,0,.45) !important; }
        :root.light .sc-modal-panel   { background:#f8fafc !important; border:1px solid rgba(0,0,0,.12) !important; box-shadow:0 24px 60px rgba(0,0,0,.14),0 0 0 1px rgba(0,0,0,.06) !important; }
        :root.light .sc-modal-logo-header { background:linear-gradient(170deg,#e8edf5 0%,#dce3ef 100%) !important; border-bottom:1px solid rgba(0,0,0,.08) !important; }
        :root.light .sc-modal-eyebrow { color:rgba(0,0,0,.35) !important; }
        :root.light .sc-modal-name    { background:linear-gradient(135deg,#0f172a 0%,rgba(15,23,42,.65) 100%) !important; -webkit-background-clip:text !important; -webkit-text-fill-color:transparent !important; background-clip:text !important; }
        :root.light .sc-modal-divider { background:linear-gradient(90deg,rgba(227,27,84,.3),rgba(0,0,0,.08) 50%,transparent) !important; }
        :root.light .sc-modal-about-label { color:rgba(0,0,0,.3) !important; }
        :root.light .sc-modal-bio     { color:rgba(0,0,0,.6) !important; }
        :root.light .sc-modal-stats   { border:1px solid rgba(0,0,0,.12) !important; background:rgba(0,0,0,.04) !important; }
        :root.light .sc-modal-stat-sep { background:rgba(0,0,0,.1) !important; }
        :root.light .sc-modal-stat-val { color:#0f172a !important; }
        :root.light .sc-modal-stat-lab { color:rgba(0,0,0,.4) !important; }
        :root.light .sc-modal-footer  { border-top:1px solid rgba(0,0,0,.08) !important; }
        :root.light .sc-modal-role-tag { color:rgba(0,0,0,.45) !important; background:rgba(0,0,0,.04) !important; border:1px solid rgba(0,0,0,.1) !important; }
        :root.light .sc-modal-info    { border-left:1px solid rgba(0,0,0,.08) !important; }
        :root.light .sc-modal-impact-label { color:rgba(0,0,0,.3) !important; }
        :root.light .sc-modal-impact-text  { color:rgba(0,0,0,.65) !important; }
      `}</style>

      <div style={{ paddingBottom: '8rem' }}>
        <section id="section-strategic-capital" className="sc-root">

          {/* ── HERO ── */}
          <div className="sc-hero">
            <div className="sc-hero-left">
              <div className="sc-eyebrow">
                <span className="sc-eyebrow-dot" />Capital Structure
              </div>
              <h2 className="sc-heading">Strategic Capital</h2>
              <p className="sc-sub">
                Capital aligned with conviction — each phase structured to advance
                the Notus continuum through a specific lens of formation, deployment, and scale.
              </p>
            </div>

            <div className="sc-stats-box">
              {CAPITAL_STATS.map((s, i) => (
                <div key={i} className="sc-stat-cell">
                  <span className={`sc-stat-value${s.accent ? ' accent' : ''}`}>{s.value}</span>
                  <span className="sc-stat-label">{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── PHASES BODY ── */}
          <div className="sc-body">
            {CAPITAL_PHASES.map((phase, pi) => (
              <div
                key={phase.id}
                className="sc-phase-block"
                style={{ animationDelay: `${pi * 120}ms` }}
              >
                <div className="sc-phase-header">
                  {phase.live && <span className="sc-phase-live-dot" />}
                  <h3 className="sc-phase-title">
                    {phase.title.split('—').map((part, i) =>
                      i === 0
                        ? <React.Fragment key={i}><span className="sc-phase-title-accent">{part.trim()}</span>{' — '}</React.Fragment>
                        : <React.Fragment key={i}>{part.trim()}</React.Fragment>
                    )}
                  </h3>
                  <div className="sc-phase-line" />
                  {!phase.live && <span className="sc-phase-coming-tag">Coming Soon</span>}
                </div>

                <p className="sc-phase-desc">{phase.description}</p>

                {phase.live && phase.investors.length > 0 ? (
                  <div className="ic-grid">
                    {phase.investors.map((inv, i) => (
                      <InvestorCard key={inv.id} investor={inv} index={i} onExpand={handleExpand} />
                    ))}
                  </div>
                ) : !phase.live ? (
                  <ComingSoonBlock phase={phase} />
                ) : null}
              </div>
            ))}
          </div>

        </section>
      </div>

      {activeInvestor && <InvestorModal investor={activeInvestor} onClose={handleClose} />}
    </>
  );
};

export default memo(StrategicCapital);