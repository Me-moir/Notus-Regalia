"use client";
import { useState, useRef } from 'react';

const ProjectHighlightsTitle = () => {
  const [iconTooltip, setIconTooltip] = useState<{ x: number; y: number } | null>(null);
  const iconRef = useRef<HTMLDivElement>(null);

  return (
    <section className="relative w-full" style={{ marginTop: '15vh', marginBottom: '5vh' }}>
      {/* Title with gradient and icon */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-3">
          <h2 
            className="text-6xl lg:text-6xl font-bold"
            style={{
              background: 'linear-gradient(135deg, #ffffff 0%, #d4d4d4 50%, #a3a3a3 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              lineHeight: '1.3'
            }}
          >
            Portfolio Overview
          </h2>
          
          {/* Stars Icon Circle - Clickable */}
          <div
            ref={iconRef}
            className="relative flex-shrink-0 w-12 h-12 rounded-full bg-gray-900/60 border border-gray-700 flex items-center justify-center cursor-pointer hover:bg-gray-800/80 transition-all group"
            onMouseEnter={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              setIconTooltip({ x: rect.left, y: rect.top + rect.height / 2 });
            }}
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              setIconTooltip({ x: rect.left, y: rect.top + rect.height / 2 });
            }}
            onMouseLeave={() => setIconTooltip(null)}
            onClick={() => {
              // Placeholder for future hyperlink
              console.log('Stars icon clicked - Add hyperlink here');
            }}
          >
            {/* Gradient border on hover */}
            <div 
              className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
              style={{
                background: 'radial-gradient(150px circle at 50% 50%, rgba(0, 255, 166, 0.8), rgba(255, 215, 0, 0.6), rgba(236, 72, 153, 0.6), rgba(147, 51, 234, 0.6), rgba(59, 130, 246, 0.5), transparent 70%)',
                padding: '2px',
                WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                WebkitMaskComposite: 'xor',
                maskComposite: 'exclude'
              }}
            />
            
            {/* puzzle Icon */}
            <i className="bi bi-puzzle text-white text-2xl relative z-10"></i>
          </div>
        </div>
      </div>

      {/* Icon Tooltip */}
      {iconTooltip && (
        <div 
          className="fixed pointer-events-none z-50"
          style={{
            left: `${iconTooltip.x + 60}px`,
            top: `${iconTooltip.y}px`,
            transform: 'translateY(-50%)'
          }}
        >
          <div className="bg-gray-900 text-white px-3 py-2 rounded-lg shadow-xl border border-white/20 text-sm whitespace-nowrap">
            Featured projects
            <div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-gray-900 border-l border-t border-white/20 rotate-45" />
          </div>
        </div>
      )}
    </section>
  );
};

export default ProjectHighlightsTitle;