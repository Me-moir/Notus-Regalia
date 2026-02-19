"use client";

import { memo, useCallback, useEffect, useRef, useState } from "react";

const STAR_COUNT = 300;
const MAX_DEPTH = 1500;
const SPEED = 0.5;
const STAR_COLOR = "#ffffff";
const BG = "#0a0a0f";

const CYCLE_WORDS = ["Manila, Philippines.", "14.5995° N, 120.9842° E"];
const TYPE_SPEED = 80;
const DELETE_SPEED = 50;
const PAUSE_AFTER_TYPE = 2000;
const PAUSE_AFTER_DELETE = 400;

function useTypingCycle(words: string[]) {
  const [display, setDisplay] = useState("");
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    let wordIdx = 0;
    let charIdx = 0;
    let isDeleting = false;

    const step = () => {
      const word = words[wordIdx];

      if (!isDeleting) {
        charIdx++;
        setDisplay(word.slice(0, charIdx));
        if (charIdx === word.length) {
          isDeleting = true;
          timeout = setTimeout(step, PAUSE_AFTER_TYPE);
        } else {
          timeout = setTimeout(step, TYPE_SPEED);
        }
      } else {
        charIdx--;
        setDisplay(word.slice(0, charIdx));
        if (charIdx === 0) {
          isDeleting = false;
          wordIdx = (wordIdx + 1) % words.length;
          timeout = setTimeout(step, PAUSE_AFTER_DELETE);
        } else {
          timeout = setTimeout(step, DELETE_SPEED);
        }
      }
    };

    timeout = setTimeout(step, PAUSE_AFTER_DELETE);
    return () => clearTimeout(timeout);
  }, [words]);

  // Blinking cursor
  useEffect(() => {
    const id = setInterval(() => setShowCursor((v) => !v), 530);
    return () => clearInterval(id);
  }, []);

  return { display, cursor: showCursor ? "|" : "\u00A0" };
}

interface Star {
  x: number;
  y: number;
  z: number;
  twinkleSpeed: number;
  twinkleOffset: number;
}

function useStarfield(canvasRef: React.RefObject<HTMLCanvasElement | null>, containerRef: React.RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let { width, height } = container.getBoundingClientRect();
    canvas.width = width;
    canvas.height = height;

    let animationId: number;
    let tick = 0;

    const createStar = (): Star => ({
      x: (Math.random() - 0.5) * width * 2,
      y: (Math.random() - 0.5) * height * 2,
      z: Math.random() * MAX_DEPTH,
      twinkleSpeed: Math.random() * 0.02 + 0.01,
      twinkleOffset: Math.random() * Math.PI * 2,
    });

    const stars: Star[] = Array.from({ length: STAR_COUNT }, createStar);

    const ro = new ResizeObserver(() => {
      ({ width, height } = container.getBoundingClientRect());
      canvas.width = width;
      canvas.height = height;
    });
    ro.observe(container);

    const animate = () => {
      tick++;
      ctx.fillStyle = "rgba(10, 10, 15, 0.2)";
      ctx.fillRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;

      for (const star of stars) {
        star.z -= SPEED * 2;

        if (star.z <= 0) {
          star.x = (Math.random() - 0.5) * width * 2;
          star.y = (Math.random() - 0.5) * height * 2;
          star.z = MAX_DEPTH;
        }

        const scale = 400 / star.z;
        const x = cx + star.x * scale;
        const y = cy + star.y * scale;

        if (x < -10 || x > width + 10 || y < -10 || y > height + 10) continue;

        const size = Math.max(0.5, (1 - star.z / MAX_DEPTH) * 3);
        let opacity = (1 - star.z / MAX_DEPTH) * 0.9 + 0.1;

        if (star.twinkleSpeed > 0.015) {
          opacity *= 0.7 + 0.3 * Math.sin(tick * star.twinkleSpeed + star.twinkleOffset);
        }

        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fillStyle = STAR_COLOR;
        ctx.globalAlpha = opacity;
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      animationId = requestAnimationFrame(animate);
    };

    ctx.fillStyle = BG;
    ctx.fillRect(0, 0, width, height);
    animationId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationId);
      ro.disconnect();
    };
  }, [canvasRef, containerRef]);
}

const AboutHeader = memo(() => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useStarfield(canvasRef, containerRef);
  const { display, cursor } = useTypingCycle(CYCLE_WORDS);

  return (
    <section className="relative" style={{ marginBottom: 0 }}>
      <div
        ref={containerRef}
        className="relative flex items-center justify-center overflow-hidden"
        style={{
          height: "clamp(280px, 45vh, 500px)",
          paddingTop: "72px",
          background: BG,
          borderBottom: "1px dashed var(--border-dashed)",
        }}
      >
        {/* Starfield canvas */}
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

        {/* Nebula glow */}
        <div
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            background:
              "radial-gradient(ellipse at 30% 40%, rgba(56,100,180,0.15) 0%, transparent 50%), radial-gradient(ellipse at 70% 60%, rgba(100,60,150,0.1) 0%, transparent 50%)",
          }}
        />

        {/* Vignette */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 0%, transparent 40%, rgba(5,5,10,0.9) 100%)",
          }}
        />

        {/* Title + Subtitle */}
        <div className="relative z-10 flex flex-col items-center gap-3">
          <h1
            className="select-none text-4xl font-bold tracking-[0.35em] sm:text-5xl md:text-6xl lg:text-7xl"
            style={{
              background: "linear-gradient(180deg, #ffffff 0%, #b0b0b0 40%, #8a8a8a 70%, #a0a0a0 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            NOTOSPHERE
          </h1>
          <p
            className="select-none font-mono text-xs tracking-[0.15em] sm:text-sm"
            style={{ color: "rgba(180,180,190,0.7)" }}
          >
            Based in{" "}
            <span style={{ color: "rgba(220,220,230,0.9)" }}>
              {display}
            </span>
            <span
              className="inline-block w-[2px] align-middle"
              style={{ color: "rgba(220,220,230,0.7)" }}
            >
              {cursor}
            </span>
          </p>
        </div>
      </div>
    </section>
  );
});

AboutHeader.displayName = "AboutHeader";

export default AboutHeader;