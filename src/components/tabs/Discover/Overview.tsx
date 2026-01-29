"use client";
import { memo, useEffect, useRef, useState } from 'react';
import styles from '@/styles/ui.module.css';
import { OverviewSection, FeatureSections } from '@/data/Discover-data';

const Overview = memo(() => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | undefined>(undefined);
  const containerRef = useRef<HTMLDivElement>(null);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; text: string } | null>(null);
  const [eyeTooltip, setEyeTooltip] = useState<{ x: number; y: number } | null>(null);
  const eyeIconRef = useRef<HTMLDivElement>(null);
  const hoveredOrbitRef = useRef<number | null>(null);
  const hoveredVentureRef = useRef<number | null>(null);
  const pausedAnglesRef = useRef<{ [key: number]: number }>({});

  // Venture data for orbital system
  const ventures = [
    { name: 'HealthTech Venture', angle: 0, orbit: 1, color: 'rgba(0, 255, 166, 0.8)' },
    { name: 'FinTech Venture', angle: 120, orbit: 1, color: 'rgba(255, 215, 0, 0.8)' },
    { name: 'EduTech Venture', angle: 240, orbit: 1, color: 'rgba(236, 72, 153, 0.8)' },
    { name: 'AgriTech Venture', angle: 60, orbit: 2, color: 'rgba(147, 51, 234, 0.8)' },
    { name: 'CleanTech Venture', angle: 180, orbit: 2, color: 'rgba(59, 130, 246, 0.8)' },
    { name: 'PropTech Venture', angle: 300, orbit: 2, color: 'rgba(0, 255, 166, 0.6)' },
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let isActive = true;
    let time = 0;
    let currentVentures: Array<{ x: number; y: number; radius: number; name: string; index: number }> = [];
    let currentOrbits: Array<{ centerX: number; centerY: number; radius: number; orbitIndex: number }> = [];

    const updateCanvasSize = () => {
      if (!canvas || !isActive || !container) return;
      
      try {
        const rect = canvas.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) return;
        
        // Set display size (css pixels)
        canvas.style.width = rect.width + 'px';
        canvas.style.height = rect.height + 'px';
        
        // Set actual size in memory (scaled for retina displays)
        const scale = window.devicePixelRatio || 1;
        canvas.width = rect.width * scale;
        canvas.height = rect.height * scale;
        
        // Scale context to match
        ctx.scale(scale, scale);
      } catch (error) {
        console.error('Canvas resize error:', error);
      }
    };

    updateCanvasSize();
    
    const resizeHandler = () => {
      if (isActive) {
        updateCanvasSize();
      }
    };
    
    window.addEventListener('resize', resizeHandler);

    // Mouse move handler - using refs to prevent re-render glitch
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      let foundHover = false;

      // Check ventures first (higher priority)
      for (const venture of currentVentures) {
        const distance = Math.sqrt(
          Math.pow(mouseX - venture.x, 2) + Math.pow(mouseY - venture.y, 2)
        );
        if (distance <= venture.radius) {
          // Position tooltip well above the venture logo with more clearance
          const tooltipX = rect.left + venture.x;
          const tooltipY = rect.top + venture.y - venture.radius - 50; // Increased offset to prevent obstruction
          setTooltip({ x: tooltipX, y: tooltipY, text: venture.name });
          hoveredVentureRef.current = venture.index;
          hoveredOrbitRef.current = null;
          canvas.style.cursor = 'pointer';
          return;
        }
      }

      // Check orbits (no tooltip, just opacity change and pause all logos in that orbit)
      for (const orbit of currentOrbits) {
        const distance = Math.sqrt(
          Math.pow(mouseX - orbit.centerX, 2) + Math.pow(mouseY - orbit.centerY, 2)
        );
        const isOnOrbit = Math.abs(distance - orbit.radius) <= 15;
        if (isOnOrbit) {
          hoveredOrbitRef.current = orbit.orbitIndex;
          hoveredVentureRef.current = null;
          setTooltip(null);
          canvas.style.cursor = 'pointer';
          return;
        }
      }

      setTooltip(null);
      hoveredVentureRef.current = null;
      hoveredOrbitRef.current = null;
      canvas.style.cursor = 'default';
    };

    const handleMouseLeave = () => {
      setTooltip(null);
      hoveredVentureRef.current = null;
      hoveredOrbitRef.current = null;
      if (canvas) {
        canvas.style.cursor = 'default';
      }
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    const animate = () => {
      if (!isActive || !canvas) return;

      // Use the display size for calculations, not the internal scaled size
      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      
      if (width === 0 || height === 0) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      const centerX = width / 2;
      const centerY = height / 2;

      ctx.clearRect(0, 0, width, height);

      const orbit1Radius = Math.min(width, height) * 0.3;
      const orbit2Radius = Math.min(width, height) * 0.42;

      // Store orbit data for hit detection
      currentOrbits = [
        { centerX, centerY, radius: orbit1Radius, orbitIndex: 1 },
        { centerX, centerY, radius: orbit2Radius, orbitIndex: 2 }
      ];

      // Draw orbit 1 (full circle) with hover effect
      ctx.strokeStyle = hoveredOrbitRef.current === 1 ? 'rgba(255, 255, 255, 0.8)' : 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = hoveredOrbitRef.current === 1 ? 2 : 1;
      ctx.beginPath();
      ctx.arc(centerX, centerY, orbit1Radius, 0, Math.PI * 2);
      ctx.stroke();

      // Draw orbit 2 (full circle) with hover effect
      ctx.strokeStyle = hoveredOrbitRef.current === 2 ? 'rgba(255, 255, 255, 0.8)' : 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = hoveredOrbitRef.current === 2 ? 2 : 1;
      ctx.beginPath();
      ctx.arc(centerX, centerY, orbit2Radius, 0, Math.PI * 2);
      ctx.stroke();

      // Draw connecting lines from center (like spokes)
      ventures.forEach((venture) => {
        const orbitRadius = venture.orbit === 1 ? orbit1Radius : orbit2Radius;
        const angle = ((venture.angle + time * (venture.orbit === 1 ? 0.3 : 0.2)) * Math.PI) / 180;
        
        const x = centerX + orbitRadius * Math.cos(angle);
        const y = centerY + orbitRadius * Math.sin(angle);

        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(x, y);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      // Draw center logo (Regalitica)
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.font = 'bold 20px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('R', centerX, centerY);

      // Draw center circle
      ctx.beginPath();
      ctx.arc(centerX, centerY, 35, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(0, 255, 166, 0.6)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Store venture positions for hit detection and draw ventures
      currentVentures = [];
      
      // Helper function to normalize angle to 0-360 range
      const normalizeAngle = (angle: number) => {
        return ((angle % 360) + 360) % 360;
      };
      
      // Helper function to calculate shortest angular distance
      const getAngularDistance = (angle1: number, angle2: number) => {
        let diff = angle2 - angle1;
        while (diff > 180) diff -= 360;
        while (diff < -180) diff += 360;
        return diff;
      };
      
      // Calculate all venture angles first for collision detection
      const ventureAngles: { [key: number]: number } = {};
      const pausedVentures = new Set<number>();
      
      ventures.forEach((venture, index) => {
        const orbitRadius = venture.orbit === 1 ? orbit1Radius : orbit2Radius;
        
        // Check if this venture is hovered
        const isVentureHovered = hoveredVentureRef.current === index;
        // Check if this orbit is hovered (pause all ventures in this orbit)
        const isOrbitHovered = hoveredOrbitRef.current === venture.orbit;
        
        let currentAngle;
        if (isVentureHovered || isOrbitHovered) {
          // Pause this venture
          if (!(index in pausedAnglesRef.current)) {
            pausedAnglesRef.current[index] = venture.angle + time * (venture.orbit === 1 ? 0.3 : 0.2);
          }
          currentAngle = pausedAnglesRef.current[index];
          pausedVentures.add(index);
        } else {
          // Check if it was paused before - if so, continue from paused position
          if (index in pausedAnglesRef.current) {
            // Resume from paused position by setting the base angle
            const pausedAngle = pausedAnglesRef.current[index];
            const speed = venture.orbit === 1 ? 0.3 : 0.2;
            // Calculate how much time has passed and adjust base angle
            venture.angle = pausedAngle - (time * speed);
            delete pausedAnglesRef.current[index];
          }
          currentAngle = venture.angle + time * (venture.orbit === 1 ? 0.3 : 0.2);
        }
        
        ventureAngles[index] = normalizeAngle(currentAngle);
      });
      
      // Collision detection - queue like marbles
      const minDistance = 20; // degrees - minimum gap between ventures
      let collisionDetected = true;
      let iterations = 0;
      const maxIterations = 10; // Prevent infinite loops
      
      while (collisionDetected && iterations < maxIterations) {
        collisionDetected = false;
        iterations++;
        
        ventures.forEach((venture, index) => {
          // Skip if already manually paused (hovered)
          if (hoveredVentureRef.current === index || hoveredOrbitRef.current === venture.orbit) {
            return;
          }
          
          // Get all ventures on the same orbit
          const sameOrbitVentures = ventures
            .map((v, i) => ({ ...v, index: i }))
            .filter(v => v.orbit === venture.orbit && v.index !== index);
          
          sameOrbitVentures.forEach(other => {
            const angle1 = ventureAngles[index];
            const angle2 = ventureAngles[other.index];
            
            // Calculate signed angular distance (positive = other is ahead)
            const distance = getAngularDistance(angle1, angle2);
            
            // If we're catching up to a paused venture (or queued venture)
            if (distance > 0 && distance < minDistance && pausedVentures.has(other.index)) {
              // Queue this venture behind the paused one
              const queuedAngle = normalizeAngle(angle2 - minDistance);
              ventureAngles[index] = queuedAngle;
              
              // Mark this venture as paused (queued)
              if (!(index in pausedAnglesRef.current)) {
                pausedAnglesRef.current[index] = queuedAngle;
                pausedVentures.add(index);
                collisionDetected = true;
              }
            }
          });
        });
      }
      
      // Now draw all ventures
      ventures.forEach((venture, index) => {
        const orbitRadius = venture.orbit === 1 ? orbit1Radius : orbit2Radius;
        const currentAngle = (ventureAngles[index] * Math.PI) / 180;
        
        const x = centerX + orbitRadius * Math.cos(currentAngle);
        const y = centerY + orbitRadius * Math.sin(currentAngle);

        // Enlarge if hovered
        const isVentureHovered = hoveredVentureRef.current === index;
        const radius = isVentureHovered ? 26 : 22;

        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = venture.color;
        ctx.fill();

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.font = 'bold 11px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`V${index + 1}`, x, y);

        currentVentures.push({ x, y, radius, name: venture.name, index });
      });

      time += 1;
      if (isActive) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animate();

    return () => {
      isActive = false;
      
      // Clean up event listeners
      window.removeEventListener('resize', resizeHandler);
      
      if (canvas) {
        try {
          canvas.removeEventListener('mousemove', handleMouseMove);
          canvas.removeEventListener('mouseleave', handleMouseLeave);
        } catch (error) {
          // Silently handle if canvas is already removed
        }
      }
      
      // Cancel animation frame
      if (animationRef.current !== undefined) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = undefined;
      }
    };
  }, []);

  return (
    <section 
      className="relative overflow-hidden bg-[#0a0a0a] mb-20"
      style={{
        borderTop: '1px dashed rgba(255, 255, 255, 0.2)',
        borderBottom: '1px dashed rgba(255, 255, 255, 0.2)'
      }}
    >
      {/* Grain overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '100px 100px',
        }}
      />

      <div className="relative z-10 px-12 lg:px-20">
        {/* EXACT REFERENCE LAYOUT: LEFT-RIGHT SPLIT */}
        <div className="grid grid-cols-1 lg:grid-cols-2">
          
          {/* LEFT SIDE - Content container without flex stretch */}
          <div className="pt-16 py-8 pr-8" style={{ borderRight: '1px dashed rgba(255, 255, 255, 0.2)' }}>
            {/* Large Title with Eye Icon */}
            <div className="mb-6 pb-6 overflow-visible">
              <div className="flex items-center gap-3">
                <h1 
                  className="text-5xl lg:text-6xl font-bold"
                  style={{
                    background: 'linear-gradient(135deg, #ffffff 0%, #d4d4d4 50%, #a3a3a3 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    lineHeight: '1.3'
                  }}
                >
                  {OverviewSection.title}
                </h1>
                
                {/* Eye Icon Circle - Clickable */}
                <div
                  ref={eyeIconRef}
                  className="relative flex-shrink-0 w-12 h-12 rounded-full bg-gray-900/60 border border-gray-700 flex items-center justify-center cursor-pointer hover:bg-gray-800/80 transition-all group"
                  onMouseEnter={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    setEyeTooltip({ x: rect.left, y: rect.top + rect.height / 2 });
                  }}
                  onMouseMove={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    setEyeTooltip({ x: rect.left, y: rect.top + rect.height / 2 });
                  }}
                  onMouseLeave={() => setEyeTooltip(null)}
                  onClick={() => {
                    // Placeholder for future hyperlink
                    console.log('Eye icon clicked - Add hyperlink here');
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
                  
                  {/* Eye Icon */}
                  <svg className="w-5 h-5 text-white relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
              </div>
            </div>
            
            {/* Divider Line */}
            <div className="w-full h-px bg-gradient-to-r from-white/20 via-white/40 to-white/20 mb-5" />
            
            {/* Description */}
            <p className="text-sm text-gray-400 mb-6 leading-relaxed">
              {OverviewSection.description[0]}
              <br /><br />
              {OverviewSection.description[1]}
            </p>

            {/* Button */}
            <div className="mb-6">
              <button 
                className={styles.premiumBtn + " inline-flex"}
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  const y = e.clientY - rect.top;
                  e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
                  e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
                }}
              >
                <svg className={styles.premiumBtnSvg} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                  />
                </svg>
                <div className="premium-txt-wrapper">
                  <div className="premium-txt-1">
                    {OverviewSection.buttonText.split('').map((letter, i) => (
                      <span key={i} className={styles.premiumBtnLetter} style={{ animationDelay: `${i * 0.08}s` }}>
                        {letter === ' ' ? '\u00A0' : letter}
                      </span>
                    ))}
                  </div>
                </div>
                <div 
                  className={styles.premiumBtnBorder}
                  style={{
                    background: 'radial-gradient(150px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(0, 255, 166, 0.8), rgba(255, 215, 0, 0.6), rgba(236, 72, 153, 0.6), rgba(147, 51, 234, 0.6), rgba(59, 130, 246, 0.5), transparent 70%)',
                    padding: '2px',
                    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    WebkitMaskComposite: 'xor',
                    maskComposite: 'exclude'
                  } as React.CSSProperties}
                />
              </button>
            </div>

            {/* Divider Line before Canvas */}
            <div className="w-full h-px bg-gradient-to-r from-white/20 via-white/40 to-white/20 mb-6" />

            {/* Canvas Area - Slightly bigger fixed size */}
            <div ref={containerRef} className="relative w-full h-[480px]">
              <canvas 
                ref={canvasRef} 
                className="w-full h-full"
                style={{ display: 'block' }}
              />
              
              {/* Venture Tooltip - Positioned well above logo with pointer-events-none */}
              {tooltip && (
                <div 
                  className="fixed z-50 pointer-events-none"
                  style={{
                    left: `${tooltip.x}px`,
                    top: `${tooltip.y}px`,
                    transform: 'translateX(-50%)'
                  }}
                >
                  <div className="bg-gray-900 text-white px-3 py-2 rounded-lg shadow-xl border border-white/20 text-sm whitespace-nowrap">
                    {tooltip.text}
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-2 h-2 bg-gray-900 border-r border-b border-white/20 rotate-45" />
                  </div>
                </div>
              )}
              
              {/* Eye Icon Tooltip */}
              {eyeTooltip && (
                <div 
                  className="fixed pointer-events-none z-50"
                  style={{
                    left: `${eyeTooltip.x + 60}px`,
                    top: `${eyeTooltip.y}px`,
                    transform: 'translateY(-50%)'
                  }}
                >
                  <div className="bg-gray-900 text-white px-3 py-2 rounded-lg shadow-xl border border-white/20 text-sm whitespace-nowrap">
                    About our team
                    <div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-gray-900 border-l border-t border-white/20 rotate-45" />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT SIDE - 2 columns × 4 rows Grid */}
          <div className="grid grid-cols-2 grid-rows-4 gap-0">
            {FeatureSections.map((feature, index) => (
              <div 
                key={index}
                className="relative backdrop-blur-sm p-8 transition-all group overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, #0f0f0f 0%, #050505 100%)',
                  borderBottom: index < 6 ? '1px dashed rgba(255, 255, 255, 0.2)' : 'none',
                  borderRight: '1px dashed rgba(255, 255, 255, 0.2)'
                }}
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  const y = e.clientY - rect.top;
                  e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
                  e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
                }}
              >
                {/* Background Lighten Effect on Hover */}
                <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                
                {/* Gradient Border Effect on Hover */}
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background: 'radial-gradient(300px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(0, 255, 166, 0.8), rgba(255, 215, 0, 0.7), rgba(236, 72, 153, 0.7), rgba(147, 51, 234, 0.7), rgba(59, 130, 246, 0.6), transparent 70%)',
                    padding: '1px',
                    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    WebkitMaskComposite: 'xor',
                    maskComposite: 'exclude'
                  }}
                />
                
                {/* Icon - Lift upwards on hover */}
                <div className="mb-6 text-2xl text-white/80 transition-transform duration-300 group-hover:-translate-y-2 relative z-10">
                  <i className={`bi ${feature.icon}`}></i>
                </div>
                
                {/* Title - Lift upwards on hover */}
                <h3 className="text-lg font-semibold text-white mb-3 leading-tight transition-transform duration-300 group-hover:-translate-y-2 relative z-10">
                  {feature.title}
                </h3>
                
                {/* Description - Lift upwards on hover */}
                <p className="text-sm text-gray-400 leading-relaxed transition-transform duration-300 group-hover:-translate-y-2 relative z-10">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
});

Overview.displayName = 'Overview';

export default Overview;