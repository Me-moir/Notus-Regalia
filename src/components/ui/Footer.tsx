"use client";
import Image from 'next/image';
import { useRef, useEffect, useState, useCallback, useMemo } from 'react';

const logoImage = '/assets/Notosphere-logo.svg';

/* ═══════════════════════════════════════════════════════════════
   DotPattern — inlined so Footer stays a single file
   ═══════════════════════════════════════════════════════════════ */
function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) }
    : { r: 0, g: 0, b: 0 };
}

interface Dot { x: number; y: number; baseOpacity: number; }

function DotPattern({
  containerRef: externalContainerRef,
  dotSize = 2,
  gap = 24,
  baseColor = '#404040',
  glowColor = '#22d3ee',
  proximity = 120,
  glowIntensity = 1,
  waveSpeed = 0.5,
}: {
  containerRef: React.RefObject<HTMLDivElement>;
  dotSize?: number;
  gap?: number;
  baseColor?: string;
  glowColor?: string;
  proximity?: number;
  glowIntensity?: number;
  waveSpeed?: number;
}) {
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const dotsRef    = useRef<Dot[]>([]);
  const mouseRef   = useRef({ x: -1000, y: -1000 });
  const animRef    = useRef<number | null>(null);
  const startTime  = useRef(Date.now());

  const baseRgb = useMemo(() => hexToRgb(baseColor), [baseColor]);
  const glowRgb = useMemo(() => hexToRgb(glowColor), [glowColor]);

  const buildGrid = useCallback(() => {
    const canvas    = canvasRef.current;
    const container = externalContainerRef.current;
    if (!canvas || !container) return;

    const rect = container.getBoundingClientRect();
    const dpr  = window.devicePixelRatio || 1;
    canvas.width  = rect.width  * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width  = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    const ctx = canvas.getContext('2d');
    if (ctx) ctx.scale(dpr, dpr);

    const cell = dotSize + gap;
    const cols = Math.ceil(rect.width  / cell) + 1;
    const rows = Math.ceil(rect.height / cell) + 1;
    const ox   = (rect.width  - (cols - 1) * cell) / 2;
    const oy   = (rect.height - (rows - 1) * cell) / 2;

    const dots: Dot[] = [];
    for (let r = 0; r < rows; r++)
      for (let c = 0; c < cols; c++)
        dots.push({ x: ox + c * cell, y: oy + r * cell, baseOpacity: 0.85 + Math.random() * 0.15 });
    dotsRef.current = dots;
  }, [externalContainerRef, dotSize, gap]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr   = window.devicePixelRatio || 1;
    ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);

    const { x: mx, y: my } = mouseRef.current;
    const proxSq = proximity * proximity;
    const time   = (Date.now() - startTime.current) * 0.001 * waveSpeed;

    for (const dot of dotsRef.current) {
      const dx = dot.x - mx, dy = dot.y - my;
      const distSq = dx * dx + dy * dy;
      const wave   = Math.sin(dot.x * 0.02 + dot.y * 0.02 + time) * 0.5 + 0.5;
      let opacity  = dot.baseOpacity + wave * 0.15;
      let scale    = 1 + wave * 0.2;
      let r = baseRgb.r, g = baseRgb.g, b = baseRgb.b, glow = 0;

      if (distSq < proxSq) {
        const t = 1 - Math.sqrt(distSq) / proximity;
        const e = t * t * (3 - 2 * t);
        r = Math.round(baseRgb.r + (glowRgb.r - baseRgb.r) * e);
        g = Math.round(baseRgb.g + (glowRgb.g - baseRgb.g) * e);
        b = Math.round(baseRgb.b + (glowRgb.b - baseRgb.b) * e);
        opacity = Math.min(1, opacity + e * 0.7);
        scale   = scale + e * 0.8;
        glow    = e * glowIntensity;
      }

      const radius = (dotSize / 2) * scale;

      if (glow > 0) {
        const grad = ctx.createRadialGradient(dot.x, dot.y, 0, dot.x, dot.y, radius * 4);
        grad.addColorStop(0,   `rgba(${glowRgb.r},${glowRgb.g},${glowRgb.b},${glow * 0.4})`);
        grad.addColorStop(0.5, `rgba(${glowRgb.r},${glowRgb.g},${glowRgb.b},${glow * 0.1})`);
        grad.addColorStop(1,   `rgba(${glowRgb.r},${glowRgb.g},${glowRgb.b},0)`);
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, radius * 4, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      }

      ctx.beginPath();
      ctx.arc(dot.x, dot.y, radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${r},${g},${b},${opacity})`;
      ctx.fill();
    }
    animRef.current = requestAnimationFrame(draw);
  }, [proximity, baseRgb, glowRgb, dotSize, glowIntensity, waveSpeed]);

  useEffect(() => {
    buildGrid();
    const ro = new ResizeObserver(buildGrid);
    if (externalContainerRef.current) ro.observe(externalContainerRef.current);
    return () => ro.disconnect();
  }, [buildGrid, externalContainerRef]);

  useEffect(() => {
    animRef.current = requestAnimationFrame(draw);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [draw]);

  useEffect(() => {
    const container = externalContainerRef.current;
    if (!container) return;
    const onMove  = (e: MouseEvent) => {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const onLeave = () => { mouseRef.current = { x: -1000, y: -1000 }; };
    container.addEventListener('mousemove', onMove);
    container.addEventListener('mouseleave', onLeave);
    return () => { container.removeEventListener('mousemove', onMove); container.removeEventListener('mouseleave', onLeave); };
  }, [externalContainerRef]);

  return (
    <>
      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }} />
      {/* Vignette */}
      <div style={{ pointerEvents: 'none', position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, transparent 0%, transparent 40%, rgba(7,7,14,0.7) 100%)' }} />
    </>
  );
}

const Footer = () => {
  const footerRef = useRef<HTMLElement>(null);
  const logoBadgeRef = useRef<HTMLAnchorElement>(null);
  const newsletterRef = useRef<HTMLDivElement>(null);
  const [email, setEmail] = useState('');
  const [submitState, setSubmitState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);
  const [showSuggestion, setShowSuggestion] = useState(false);
  const emailInputRef = useRef<HTMLInputElement>(null);

  const SUGGESTION = '@gmail.com';

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setEmail(val);
    setShowSuggestion(val.length > 0 && !val.includes('@'));
  };

  const completeSuggestion = () => {
    if (showSuggestion) {
      setEmail(prev => prev + SUGGESTION);
      setShowSuggestion(false);
      emailInputRef.current?.focus();
    }
  };

  const handleEmailKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Tab' && showSuggestion) {
      e.preventDefault();
      completeSuggestion();
    }
  };

  const handleCopyEmail = (address: string) => {
    navigator.clipboard.writeText(address).then(() => {
      setCopiedEmail(address);
      setTimeout(() => setCopiedEmail(null), 2000);
    });
  };

  useEffect(() => {
    const footer = footerRef.current;
    if (!footer) return;

    let rafId: number | null = null;

    const handleMouseMove = (e: MouseEvent) => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        const rect = footer.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        footer.style.setProperty('--mouse-x', `${x}px`);
        footer.style.setProperty('--mouse-y', `${y}px`);
        rafId = null;
      });
    };

    footer.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      footer.removeEventListener('mousemove', handleMouseMove);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || submitState === 'loading') return;
    setSubmitState('loading');
    await new Promise(res => setTimeout(res, 1200));
    setSubmitState('success');
    setEmail('');
    setTimeout(() => setSubmitState('idle'), 4000);
  };

  const contacts = [
    { label: 'General Inquiries', value: 'hello@notosphere.group', icon: 'bi-envelope' },
    { label: 'Support', value: 'support@notosphere.group', icon: 'bi-headset' },
    { label: 'Press & Media', value: 'press@notosphere.group', icon: 'bi-newspaper' },
    { label: 'Partnerships', value: 'partners@notosphere.group', icon: 'bi-briefcase' },
    { label: 'Careers', value: 'careers@notosphere.group', icon: 'bi-person-badge' },
    { label: 'Security', value: 'security@notosphere.group', icon: 'bi-shield-lock' },
  ];

  const sections = [
    { title: 'Information', links: ['About', 'Organization', 'Vision', 'Ventures', 'Approach'] },
    { title: 'Reach Out', links: ['Contact', 'Support', 'Feedback', 'Report bug'] },
    { title: 'Tools', links: ["The Fool's Sandbox", "Attributions", "Resources"] },
    { title: 'Affiliates', links: ['Partners', 'Sponsors', 'Licenses'] },
    { title: 'Community', links: ['Contribute', 'Build With Us', 'Become a Fool', 'Sandbox Program'] },
    { title: 'Legal', links: ['Acceptable Use Policy', 'Terms & Conditions', 'Privacy Policy', 'Cookie Policy'] },
  ];

  return (
    <footer 
      ref={footerRef}
      className="relative overflow-hidden mt-20 z-10 text-slate-300 glass-footer"
    >
      <style jsx>{`

        footer { border-top: none; }

        .footer-grid-bg {
          background-image:
            linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
          background-size: 28px 28px;
          mask-image: linear-gradient(to bottom, transparent, black 6%, black 96%, transparent);
          -webkit-mask-image: linear-gradient(to bottom, transparent, black 6%, black 96%, transparent);
          opacity: 0.7;
        }

        .footer-spotlight {
          background: radial-gradient(520px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(14,165,164,0.06), transparent 36%);
          transition: opacity 260ms ease;
        }

        .glass-footer {
          background: var(--glass-bg);
          backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px);
          box-shadow:
            0 -8px 32px var(--glass-shadow-1), 0 -12px 48px var(--glass-shadow-2),
            inset 0 1px 1px var(--glass-inset-top), inset 0 -1px 1px var(--glass-inset-bottom);
          position: relative;
        }
        .glass-footer::before {
          content: ''; position: absolute; top: -1px; left: 0; right: 0; height: 1px;
          background: radial-gradient(600px circle at var(--mouse-x, 50%) 0%,
            rgba(0,255,166,0.9), rgba(255,215,0,0.7), rgba(236,72,153,0.7),
            rgba(147,51,234,0.6), rgba(59,130,246,0.5), transparent 70%);
          opacity: 0; transition: opacity 0.35s ease; pointer-events: none;
        }
        .glass-footer:hover::before { opacity: 1; }
        .glass-footer::after {
          content: '';
          position: absolute; left: 0; right: 0; top: 0; height: 1px;
          transform-origin: top; transform: scaleY(0.35);
          background: var(--border-color); opacity: 0.95; pointer-events: none;
        }

        /* ── Band dividers ── */
        .band-divider {
          height: 1px;
          background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.06) 20%, rgba(255,255,255,0.06) 80%, transparent 100%);
        }

        /* ── Eyebrow ── */
        .section-eyebrow { display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem; }
        .section-eyebrow-label {
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          color: #334155;
          white-space: nowrap;
          font-weight: 600;
        }
        .section-eyebrow-line { flex: 1; height: 1px; background: linear-gradient(90deg, rgba(255,255,255,0.05), transparent); }

        /* ══ BAND 1: Contact ══ */
        .contact-band {
          padding: 4rem clamp(1rem, 5vw, 9rem);
          background: linear-gradient(160deg, #0a0a0f 0%, #0d0d14 60%, #080810 100%);
          isolation: isolate;
          border-top: 1px solid rgba(255, 255, 255, 0.07);
          position: relative;
        }
        .contact-band::before {
          content: '';
          position: absolute;
          top: -1px; left: 0; right: 0; height: 1px;
          background: radial-gradient(600px circle at var(--mouse-x, 50%) 0%,
            rgba(0,255,166,0.7), rgba(255,215,0,0.5), rgba(236,72,153,0.5),
            rgba(147,51,234,0.45), rgba(59,130,246,0.4), transparent 70%);
          opacity: 0; transition: opacity 0.35s ease; pointer-events: none;
        }
        .glass-footer:hover .contact-band::before { opacity: 1; }

        /* Fluid heading scale: clamp(mobile, fluid, desktop) */
        .contact-heading {
          font-size: clamp(1.5rem, 4vw, 2.875rem);
          font-weight: 300;
          color: #f1f5f9;
          margin-bottom: 0.5rem;
          letter-spacing: -0.025em;
          line-height: 1.1;
        }

        .contact-sub {
          font-size: clamp(0.875rem, 2vw, 1.125rem);
          color: #3d5068;
          line-height: 1.65;
          margin-bottom: 2.5rem;
        }

        .contact-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
          width: 100%;
        }
        @media (max-width: 900px) { .contact-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 540px)  { .contact-grid { grid-template-columns: 1fr; gap: 0.75rem; } }

        /* ══ CONTACT CARDS ══ */
        .contact-card-border {
          position: relative;
          padding: 1px;
          border-radius: 10px;
          width: 100%;
        }

        .contact-card {
          display: flex;
          flex-direction: column;
          border-radius: 10px;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.07);
          box-shadow: 0 2px 8px rgba(0,0,0,0.18), inset 0 1px 0 var(--glass-inset-top);
          transition: box-shadow 0.2s ease, background 0.2s ease, border-color 0.2s ease;
          background: transparent;
          width: 100%;
          cursor: pointer;
          font-family: inherit;
          text-align: left;
        }
        .contact-card:hover {
          box-shadow: 0 4px 14px rgba(0,0,0,0.26), inset 0 1px 0 var(--glass-inset-top);
          background: var(--hover-bg-strong);
          border-color: rgba(255,255,255,0.12);
        }

        .contact-card-body {
          display: flex;
          flex-direction: column;
          gap: 0.625rem;
          padding: 1rem 1rem 1rem;
          flex: 1;
        }
        @media (max-width: 540px) {
          .contact-card-body { padding: 0.875rem; gap: 0.5rem; }
        }

        .contact-card-top {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .contact-card-top .icon-wrap {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          font-size: 0.85rem;
          color: var(--content-faint);
          transition: color 0.15s ease;
          width: 14px;
        }
        .contact-card:hover .contact-card-top .icon-wrap { color: var(--content-secondary); }

        .c-label {
          font-size: clamp(0.65rem, 1.5vw, 0.8rem);
          text-transform: uppercase;
          letter-spacing: 0.2em;
          color: var(--content-faint);
          line-height: 1.2;
          transition: color 0.15s ease;
          white-space: nowrap;
          font-weight: 600;
        }
        .contact-card:hover .c-label { color: var(--content-secondary); }

        .c-cli {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          background: #1c1c1e;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 6px;
          padding: 0.4rem 0.625rem;
          transition: border-color 0.15s ease, background 0.15s ease;
          min-width: 0;
        }
        .contact-card:hover .c-cli {
          border-color: rgba(255,255,255,0.14);
          background: #232325;
        }
        .c-cli-prompt {
          font-size: clamp(0.75rem, 1.8vw, 0.875rem);
          font-family: ui-monospace, Menlo, monospace;
          color: #2dd4bf;
          flex-shrink: 0;
          opacity: 0.7;
          user-select: none;
          transition: opacity 0.15s ease;
        }
        .contact-card:hover .c-cli-prompt { opacity: 1; }
        .c-value {
          font-size: clamp(0.7rem, 1.6vw, 0.875rem);
          color: #94a3b8;
          font-family: ui-monospace, Menlo, monospace;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          line-height: 1.4;
          transition: color 0.15s ease;
          font-weight: 400;
          flex: 1;
          min-width: 0;
        }
        .contact-card:hover .c-value { color: #e2e8f0; }
        .c-cli-copy {
          flex-shrink: 0;
          font-size: 0.7rem;
          color: rgba(45,212,191,0.45);
          transition: color 0.15s ease;
          margin-left: auto;
          padding-left: 0.3rem;
        }
        .contact-card:hover .c-cli-copy { color: rgba(45,212,191,0.85); }

        .c-cli.is-copied {
          border-color: rgba(45,212,191,0.3);
          background: rgba(45,212,191,0.05);
        }
        .c-cli.is-copied .c-cli-prompt { color: #2dd4bf; opacity: 1; }
        .c-cli.is-copied .c-value { color: #2dd4bf; }
        .c-cli.is-copied .c-cli-copy { color: #2dd4bf; }

        /* ══ BAND 2: Newsletter ══ */
        .newsletter-band {
          height: auto;
          min-height: 520px;
          display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center;
          position: relative; overflow: hidden;
          background: linear-gradient(180deg, #080810 0%, #0a0a0f 50%, #07070e 100%);
          isolation: isolate;
          color-scheme: dark;
          padding: 4rem clamp(1rem, 5vw, 9rem);
        }
        @media (max-width: 640px) {
          .newsletter-band { min-height: 460px; padding: 3rem 1.25rem; }
        }
        .newsletter-band::before {
          content: ''; position: absolute; inset: 0;
          background: radial-gradient(900px circle at 50% -10%, rgba(14,165,164,0.03), transparent 60%);
          pointer-events: none;
          z-index: 0;
        }
        .newsletter-accent {
          display: inline-flex; align-items: center; gap: 0.875rem;
          font-size: clamp(0.65rem, 1.5vw, 0.8rem);
          text-transform: uppercase; letter-spacing: 0.2em;
          color: #2dd4bf; margin-bottom: 1.25rem; font-weight: 600;
        }
        .newsletter-accent span { width: 24px; height: 1px; background: currentColor; opacity: 0.45; }
        .newsletter-title {
          font-size: clamp(1.375rem, 3.5vw, 2.875rem);
          font-weight: 300;
          color: #f1f5f9; margin-bottom: 0.625rem; line-height: 1.15;
          letter-spacing: -0.025em;
        }
        .newsletter-sub {
          font-size: clamp(0.8125rem, 1.8vw, 1.125rem);
          color: #3d5068; line-height: 1.65;
          max-width: 68%; margin: 0 auto 2.5rem;
        }
        @media (max-width: 640px) {
          .newsletter-sub { max-width: 95%; margin-bottom: 2rem; }
        }

        /* Force dark values in newsletter band */
        .newsletter-band .nl-search-modal {
          background: #111118 !important;
          border-color: rgba(255,255,255,0.07) !important;
          box-shadow: 0 8px 24px rgba(0,0,0,0.18), 0 0 0 0.5px rgba(255,255,255,0.04) !important;
        }
        .newsletter-band .nl-search-header {
          border-bottom-color: rgba(255,255,255,0.06) !important;
        }
        .newsletter-band .nl-input {
          color: #f1f5f9 !important;
        }
        .newsletter-band .nl-input::placeholder {
          color: #334155 !important;
          opacity: 1 !important;
        }
        .newsletter-band .nl-btn {
          color: #64748b !important;
          background: rgba(255,255,255,0.04) !important;
          border-color: rgba(255,255,255,0.08) !important;
        }
        .newsletter-band .nl-btn:hover:not(:disabled) {
          color: #f1f5f9 !important;
          background: rgba(255,255,255,0.08) !important;
        }
        .newsletter-band .bi-envelope {
          color: #334155 !important;
        }

        .nl-form { display: flex; flex-direction: column; align-items: center; gap: 0; width: min(680px, 92vw); }

        .nl-slot {
          width: min(680px, 92vw);
          height: 58px;
          flex-shrink: 0;
          position: relative;
        }
        @media (max-width: 480px) { .nl-slot { height: 52px; } }
        .nl-slot .nl-form {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
        }
        .nl-slot .nl-success {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .nl-search-modal {
          width: 100%;
          border-radius: 14px;
          background: var(--surface-secondary);
          border: 0.5px solid var(--border-color);
          box-shadow: 0 8px 24px rgba(0,0,0,0.18), 0 0 0 0.5px var(--glass-inset-top);
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .nl-search-header {
          display: flex;
          align-items: center;
          padding: clamp(12px, 2.5vw, 18px) clamp(14px, 3vw, 20px);
          gap: clamp(8px, 1.5vw, 12px);
          border-bottom: 0.5px solid var(--border-color);
        }

        .nl-input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          font-size: clamp(0.875rem, 2vw, 1.0625rem);
          font-weight: 500;
          color: var(--content-primary);
          letter-spacing: -0.01em;
          font-family: inherit;
        }
        .nl-input::placeholder {
          color: var(--content-faint);
          opacity: 0.7;
        }

        .nl-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          padding: 3px 7px;
          border-radius: 6px;
          font-size: clamp(0.6rem, 1.4vw, 0.7rem);
          font-weight: 600;
          letter-spacing: 0.04em;
          color: var(--content-faint);
          background: var(--hover-bg);
          border: 1px solid var(--border-color);
          cursor: pointer;
          flex-shrink: 0;
          transition: color 0.12s ease, background 0.12s ease;
          user-select: none;
          font-family: inherit;
          text-transform: uppercase;
        }
        .nl-btn:hover:not(:disabled) {
          color: var(--content-primary);
          background: var(--hover-bg-strong);
        }
        .nl-btn:disabled { opacity: 0.35; cursor: not-allowed; }

        .nl-success { display: inline-flex; align-items: center; gap: 0.5rem; color: #34d399; font-size: clamp(0.9rem, 2vw, 1.2rem); animation: fadeIn 300ms ease; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }

        @keyframes spin { to { transform: rotate(360deg); } }
        .spinner { width: 0.75rem; height: 0.75rem; border: 2px solid rgba(45,212,191,0.2); border-top-color: #2dd4bf; border-radius: 50%; animation: spin 0.6s linear infinite; }

        .nl-input-wrap { position: relative; flex: 1; display: flex; align-items: center; min-width: 0; overflow: hidden; }
        .nl-input-wrap .nl-input { width: 100%; position: relative; z-index: 1; background: transparent; }

        .nl-ghost-overlay {
          position: absolute;
          left: 0; top: 0; bottom: 0;
          display: flex;
          align-items: center;
          pointer-events: none;
          user-select: none;
          font-size: clamp(0.875rem, 2vw, 1.0625rem);
          font-weight: 500;
          letter-spacing: -0.01em;
          white-space: pre;
          z-index: 0;
          overflow: hidden;
          max-width: 100%;
        }
        .nl-ghost-typed { color: transparent; }
        .nl-ghost-suggestion { color: rgba(45,212,191,0.38); }

        .nl-autocomplete-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          padding: 2px 6px;
          border-radius: 5px;
          font-size: clamp(0.6rem, 1.2vw, 0.72rem);
          font-weight: 700;
          letter-spacing: 0.06em;
          color: rgba(45,212,191,0.55);
          background: rgba(45,212,191,0.07);
          border: 1px solid rgba(45,212,191,0.2);
          text-transform: uppercase;
          flex-shrink: 0;
          cursor: pointer;
          white-space: nowrap;
          animation: fadeIn 0.15s ease;
          transition: color 0.12s ease, background 0.12s ease, border-color 0.12s ease;
          user-select: none;
        }
        .nl-autocomplete-pill:hover {
          color: rgba(45,212,191,0.9);
          background: rgba(45,212,191,0.12);
          border-color: rgba(45,212,191,0.4);
        }
        /* Hide tab pill on very small screens where it overlaps */
        @media (max-width: 400px) { .nl-autocomplete-pill { display: none; } }

        /* ══ BAND 3: Main footer ══ */
        .system-status { border: 1px solid rgba(255,255,255,0.04); background: rgba(255,255,255,0.015); }
        .system-status .preserve-system { color: inherit; }

        .footer-brand-title {
          font-size: clamp(1.75rem, 4vw, 2.875rem);
          font-weight: 700;
          color: #ffffff;
          letter-spacing: -0.025em;
          line-height: 1.1;
        }

        .footer-tagline {
          font-size: clamp(0.875rem, 2vw, 1.125rem);
          font-weight: 300;
          line-height: 1.65;
          color: #94a3b8;
          border-left: 1px solid rgba(255,255,255,0.1);
          padding-left: 1rem;
          margin-top: 0.25rem;
        }
        .footer-tagline-emphasis {
          font-weight: 500;
          color: #e2e8f0;
          margin-top: 0.5rem;
        }

        .footer-nav-title {
          font-size: clamp(0.65rem, 1.4vw, 0.8rem);
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          color: #475569;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          justify-content: center;
        }
        @media (min-width: 640px) { .footer-nav-title { justify-content: flex-start; } }

        .footer-nav-link {
          font-size: clamp(0.875rem, 2vw, 1.05rem);
          color: #64748b;
        }

        .footer-meta {
          font-size: clamp(0.65rem, 1.4vw, 0.8rem);
          font-weight: 500;
          letter-spacing: 0.12em;
        }

        .tech-link { position: relative; display: inline-flex; align-items: center; transition: color 180ms ease, text-shadow 180ms ease; }
        .tech-link::before, .tech-link::after { opacity: 0; color: #0ea5a4; transition: opacity 180ms ease, transform 180ms ease; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; }
        .tech-link::before { content: '['; margin-right: 6px; transform: translateX(4px); }
        .tech-link::after  { content: ']'; margin-left: 6px; transform: translateX(-4px); }
        .tech-link:hover { color: #ffffff; text-shadow: 0 0 10px rgba(255,255,255,0.15); }
        .tech-link:hover::before, .tech-link:hover::after { opacity: 1; transform: translateX(0); }

        .hud-border-top { position: relative; }
        .hud-border-top::before { content: ''; position: absolute; top: -1px; left: 50%; width: 44px; height: 2px; transform: translateX(-50%); background: linear-gradient(90deg, #06b6d4, #0891b2); border-radius: 2px; opacity: 0.9; }
        @media (min-width: 1024px) { .hud-border-top::before { left: 0; transform: none; } }

        .logo-badge-wrapper { position: relative; display: inline-flex; padding: 2px; border-radius: 1.125rem; background: transparent; cursor: pointer; }
        .logo-badge-wrapper::before { content: ''; position: absolute; inset: 0; border-radius: inherit; padding: 2px; background: radial-gradient(360px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(0,255,166,0.85), rgba(255,215,0,0.65), rgba(236,72,153,0.65), rgba(147,51,234,0.65), rgba(59,130,246,0.55), transparent 70%); -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0); -webkit-mask-composite: xor; mask-composite: exclude; opacity: 0; transition: opacity 0.3s ease; pointer-events: none; z-index: 0; }
        .logo-badge-wrapper:hover::before { opacity: 1; }
        .logo-badge { position: relative; display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem; padding: 0.5rem; border-radius: 1rem; background: transparent; z-index: 1; width: fit-content; }

        /* Logo size on mobile */
        @media (max-width: 640px) {
          .logo-badge-img { height: 100px !important; width: 100px !important; }
        }

        /* Grid/spotlight don't bleed into isolated bands */
        .contact-band > .footer-grid-bg,
        .newsletter-band > .footer-grid-bg { display: none; }

        /* Band 3 reduced top padding on mobile */
        @media (max-width: 640px) {
          .footer-band3 { padding-top: 3.5rem !important; padding-bottom: 2.5rem !important; }
          .footer-brand-gap { gap: 3rem !important; margin-bottom: 3rem !important; }
          .footer-nav-gap { gap: 2.5rem 2rem !important; }
        }

        /* Light mode overrides */
        :global(.light) .contact-band { background: linear-gradient(160deg, #f0f4f8 0%, #e8edf3 100%); }
        :global(.light) .glass-footer { background: linear-gradient(to bottom, #f8fafc 0%, #eef2f6 60%); color: var(--content-primary); border-top: none; }
        :global(.light) .glass-footer::after { background: var(--border-color); }
        :global(.light) .footer-grid-bg { background-image: linear-gradient(rgba(0,0,0,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.02) 1px, transparent 1px); }
        :global(.light) .band-divider { background: linear-gradient(90deg, transparent, rgba(0,0,0,0.06) 20%, rgba(0,0,0,0.06) 80%, transparent); }
        :global(.light) .footer-brand-title { color: #0f172a; }
        :global(.light) .footer-tagline { color: #475569; border-left-color: rgba(0,0,0,0.1); }
        :global(.light) .footer-tagline-emphasis { color: #0f172a; }
        :global(.light) .footer-nav-title { color: #94a3b8; }
        :global(.light) .footer-nav-link { color: #475569; }
        :global(.light) .system-status { background: #000000; border-color: rgba(0,0,0,0.9); }
        :global(.light) .system-status .preserve-system { color: #ffffff; }
        :global(.light) .tech-link::before, :global(.light) .tech-link::after { color: #0ea5a4; }
        :global(.light) .tech-link { color: #0f172a; }
        :global(.light) .hud-border-top::before { background: linear-gradient(90deg, #06b6d4, #0891b2); }
        :global(.light) .contact-heading { color: #0f172a; }
        :global(.light) .contact-sub { color: #64748b; }
        :global(.light) .section-eyebrow-label { color: #94a3b8; }

        :global(.light) .c-cli {
          background: #3a3a3c;
          border-color: rgba(255,255,255,0.1);
        }
        :global(.light) .contact-card:hover .c-cli {
          background: #48484a;
          border-color: rgba(255,255,255,0.16);
        }
        :global(.light) .c-cli-prompt { color: #2dd4bf; }
        :global(.light) .c-value { color: #94a3b8; }
        :global(.light) .contact-card:hover .c-value { color: #e2e8f0; }
        :global(.light) .c-cli-copy { color: rgba(45,212,191,0.45); }
        :global(.light) .contact-card:hover .c-cli-copy { color: rgba(45,212,191,0.85); }
        :global(.light) .c-cli.is-copied {
          background: #000000;
          border-color: rgba(45,212,191,0.4);
        }

        /* Glass boxes for social icons */
        .glass-box {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 2.25rem;
          height: 2.25rem;
          border-radius: 0.5rem;
          background: var(--hover-bg-10);
          border: 1px solid rgba(255,255,255,0.12);
          backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px);
          box-shadow: 0 2px 8px rgba(0,0,0,0.18), inset 0 1px 0 var(--glass-inset-top);
          color: var(--content-faint);
          transition: background 180ms ease, box-shadow 180ms ease, transform 180ms ease, color 180ms ease;
        }
        .glass-box:hover {
          background: var(--hover-bg-strong);
          box-shadow: 0 4px 14px rgba(0,0,0,0.26), inset 0 1px 0 var(--glass-inset-top);
          transform: translateY(-1px);
          color: var(--content-primary);
        }
        @media (max-width: 640px) {
          .glass-box { width: 2rem; height: 2rem; }
        }
      `}</style>

      {/* Shared decorative layers */}
      <div className="absolute inset-0 pointer-events-none footer-grid-bg" />
      <div className="absolute inset-0 pointer-events-none footer-spotlight opacity-0 transition-opacity duration-500 hover:opacity-100" />

      {/* ══════════════════════════════════════════
          BAND 1 — Contact
      ══════════════════════════════════════════ */}
      <div className="relative z-10 contact-band">
        <div className="section-eyebrow">
          <span className="section-eyebrow-label">Get in touch</span>
          <span className="section-eyebrow-line" />
        </div>
        <h2 className="contact-heading">Contact & Support</h2>
        <p className="contact-sub">
          Reach the right team directly. Every message is read and routed within one business day.
        </p>
        <div className="contact-grid">
          {contacts.map((c, i) => {
            const isCopied = copiedEmail === c.value;
            return (
              <div key={i} className="contact-card-border">
                <button
                  onClick={() => handleCopyEmail(c.value)}
                  className="contact-card"
                  type="button"
                >
                  <span className="contact-card-body">
                    <span className="contact-card-top">
                      <span className="icon-wrap">
                        <i className={`bi ${isCopied ? 'bi-check2' : c.icon}`} />
                      </span>
                      <span className="c-label">{isCopied ? 'Copied!' : c.label}</span>
                    </span>

                    <span className={`c-cli${isCopied ? ' is-copied' : ''}`}>
                      <span className="c-cli-prompt">{isCopied ? '✓' : '>'}</span>
                      <span className="c-value">{c.value}</span>
                      <i className={`bi ${isCopied ? 'bi-check-lg' : 'bi-copy'} c-cli-copy`} />
                    </span>
                  </span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <div className="band-divider relative z-10" />

      {/* ══════════════════════════════════════════
          BAND 2 — Newsletter
      ══════════════════════════════════════════ */}
      <div ref={newsletterRef} className="relative z-10 newsletter-band">
        <DotPattern
          containerRef={newsletterRef}
          dotSize={1.5}
          gap={28}
          baseColor="#1e2a38"
          glowColor="#2dd4bf"
          proximity={100}
          glowIntensity={0.9}
          waveSpeed={0.4}
        />

        <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
          <p className="newsletter-accent">
            <span />Notosphere Signal<span />
          </p>
          <h2 className="newsletter-title">Dispatches from the edge of thought</h2>
          <p className="newsletter-sub">
            Curated insights on emerging ideas, ventures, and moments that matter — delivered sparingly, always with intent. No noise. No algorithms. Just signal.
          </p>

          <div className="nl-slot">
            {submitState === 'success' ? (
              <p className="nl-success">
                <i className="bi bi-check-circle-fill" />
                You're in. Watch for the first dispatch.
              </p>
            ) : (
              <form className="nl-form" onSubmit={handleNewsletterSubmit}>
                <div className="nl-search-modal">
                  <div className="nl-search-header">
                    <i className="bi bi-envelope" style={{ color: '#334155', fontSize: '0.9rem' }} />

                    <div className="nl-input-wrap">
                      {showSuggestion && (
                        <div className="nl-ghost-overlay" aria-hidden>
                          <span className="nl-ghost-typed">{email}</span>
                          <span className="nl-ghost-suggestion">{SUGGESTION}</span>
                        </div>
                      )}
                      <input
                        ref={emailInputRef}
                        type="email"
                        className="nl-input"
                        placeholder="What's your email address?"
                        value={email}
                        onChange={handleEmailChange}
                        onKeyDown={handleEmailKeyDown}
                        required
                        disabled={submitState === 'loading'}
                      />
                    </div>

                    {showSuggestion && (
                      <button
                        type="button"
                        className="nl-autocomplete-pill"
                        onClick={completeSuggestion}
                        tabIndex={-1}
                      >
                        <i className="bi bi-arrow-bar-right" style={{ fontSize: '0.6rem' }} />
                        Tab
                      </button>
                    )}

                    <button type="submit" className="nl-btn" disabled={submitState === 'loading' || !email}>
                      {submitState === 'loading'
                        ? <span className="spinner" />
                        : <><i className="bi bi-arrow-return-left" style={{ fontSize: '0.72rem' }} /> Enter</>}
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      <div className="band-divider relative z-10" />

      {/* ══════════════════════════════════════════
          BAND 3 — Main Footer
      ══════════════════════════════════════════ */}
      <div
        className="footer-band3 relative z-10 w-full pt-20 pb-10"
        style={{ paddingLeft: 'clamp(1rem, 5vw, 9rem)', paddingRight: 'clamp(1rem, 5vw, 9rem)' }}
      >
        <div className="footer-brand-gap flex flex-col lg:flex-row items-center lg:items-start text-center lg:text-left gap-14 lg:gap-12 mb-16">

          {/* Brand */}
          <div className="flex flex-col items-center lg:items-start lg:w-1/3 space-y-6">
            <a href="/#hero" aria-label="Go to top" ref={logoBadgeRef} className="logo-badge-wrapper group inline-flex">
              <div className="logo-badge">
                <Image
                  src={logoImage}
                  alt="Notosphere"
                  width={160}
                  height={160}
                  className="logo-badge-img h-40 w-40 object-contain relative z-10 transition-transform duration-500 opacity-95 group-hover:opacity-100"
                  priority={false}
                />
              </div>
            </a>

            <div className="space-y-3 footer-brand">
              <h3 className="footer-brand-title">
                Notosphere <span className="text-slate-500 font-light">Group</span>
              </h3>
              <div className="footer-tagline">
                <p>Beyond Perception.</p>
                <p>Beyond Form.</p>
                <p className="footer-tagline-emphasis">Beyond Fate.</p>
              </div>
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 border border-white/5 bg-white/[0.02] rounded-sm system-status">
              <span className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-pulse shadow-[0_0_8px_#14b8a6]" />
              <span className="footer-meta preserve-system uppercase tracking-widest text-slate-400">
                the many return to one
              </span>
            </div>
          </div>

          {/* Nav grid */}
          <div className="footer-nav-gap grid grid-cols-2 sm:grid-cols-3 gap-x-10 gap-y-12 lg:w-2/3">
            {sections.map((section, idx) => (
              <div key={idx} className="space-y-4 hud-border-top pt-4 text-center sm:text-left">
                <h4 className="footer-nav-title">
                  {section.title}
                </h4>
                <ul className="space-y-2.5">
                  {section.links.map((link, linkIdx) => (
                    <li key={linkIdx}>
                      <a href="#" className="tech-link footer-nav-link">{link}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col-reverse sm:flex-row items-center sm:justify-between justify-center pt-10 border-t border-dashed border-white/10 gap-5">
          <p className="footer-meta text-slate-500 uppercase tracking-wider">
            © 2026 Notosphere Group. All rights reserved.
          </p>
          <div className="flex items-center gap-2.5">
            {['bi-twitter-x', 'bi-github', 'bi-discord', 'bi-linkedin'].map((icon, idx) => (
              <a
                key={idx}
                href="#"
                className="glass-box text-slate-400 transition-all duration-300 hover:text-teal-400"
                aria-label={icon.replace('bi-','')}
              >
                <i className={`bi ${icon} text-sm`}></i>
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;