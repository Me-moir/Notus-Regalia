"use client";
import { useState, useEffect, useRef, useCallback, useMemo, memo } from 'react';
import { allProjects } from '@/data/Discover-data';
import styles from '@/styles/ui.module.css';

interface FeatureSectionProps {
  activeCardIndex: number;
  setActiveCardIndex: (index: number) => void;
  textAnimationKey: number;
  isAnimating: boolean;
}

const FeatureSection = memo(({
  activeCardIndex,
  setActiveCardIndex,
  textAnimationKey,
  isAnimating
}: FeatureSectionProps) => {
  const [cardRotations, setCardRotations] = useState<Record<number, { rotateX: number; rotateY: number }>>({});
  const [isSection3Visible, setIsSection3Visible] = useState(false);
  const isSection3VisibleRef = useRef(false);
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const leftPanelRef = useRef<HTMLDivElement>(null);

  const activeProject = useMemo(() => 
    allProjects[activeCardIndex - 1] || allProjects[0],
    [activeCardIndex]
  );

  // 🔥 Track visibility - CRITICAL for auto-scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        const rect = entry.boundingClientRect;
        const viewportHeight = window.innerHeight;
        
        const visibleTop = Math.max(0, rect.top);
        const visibleBottom = Math.min(viewportHeight, rect.bottom);
        const visibleHeight = Math.max(0, visibleBottom - visibleTop);
        
        const sectionHeight = rect.height;
        const visibilityPercentage = (visibleHeight / sectionHeight) * 100;
        
        const isVisible = visibilityPercentage >= 70;
        
        if (isVisible !== isSection3VisibleRef.current) {
          console.log('🎯 VISIBILITY CHANGED:', isVisible ? '✅ VISIBLE' : '❌ HIDDEN', `(${Math.round(visibilityPercentage)}%)`);
          setIsSection3Visible(isVisible);
          isSection3VisibleRef.current = isVisible;
          
          if (!isVisible) {
            setCardRotations({});
          }
        }
      },
      { 
        threshold: Array.from({ length: 21 }, (_, i) => i * 0.05),
        rootMargin: '0px'
      }
    );

    const section3 = document.getElementById('industries-carousel-section');
    
    if (section3) {
      console.log('📍 Section found and observing');
      observer.observe(section3);
    } else {
      console.error('❌ Section not found!');
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  // 🔥 Mouse tracking for left panel - VIBRANT GRADIENTS
  useEffect(() => {
    const leftPanel = leftPanelRef.current;
    if (!leftPanel) return;

    const handleMouseMove = (e: MouseEvent) => {
      const boxes = leftPanel.querySelectorAll(`.${styles.notificationBox}`);
      
      boxes.forEach((box) => {
        const boxElement = box as HTMLElement;
        const rect = boxElement.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        boxElement.style.setProperty('--mouse-x', `${x}px`);
        boxElement.style.setProperty('--mouse-y', `${y}px`);
        
        // Also update icons and lines inside
        const icons = boxElement.querySelectorAll('.box-icon-container');
        const lines = boxElement.querySelectorAll('.box-divider-line');
        
        icons.forEach((icon) => {
          (icon as HTMLElement).style.setProperty('--mouse-x', `${x}px`);
          (icon as HTMLElement).style.setProperty('--mouse-y', `${y}px`);
        });
        
        lines.forEach((line) => {
          (line as HTMLElement).style.setProperty('--mouse-x', `${x}px`);
          (line as HTMLElement).style.setProperty('--mouse-y', `${y}px`);
        });
      });
    };

    leftPanel.addEventListener('mousemove', handleMouseMove);

    return () => {
      leftPanel.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const lastCardMouseMoveRef = useRef<number>(0);
  
  const handleCardMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>, cardIndex: number) => {
    const cardNumber = cardIndex + 1;
    if (cardNumber !== activeCardIndex) return;
    
    if (!isSection3VisibleRef.current) {
      const card = e.currentTarget;
      const wrapper = card.querySelector(`.${styles.cardInnerWrapper}`) as HTMLElement;
      if (wrapper) {
        wrapper.style.transition = 'none';
        wrapper.style.transform = 'rotateX(0deg) rotateY(0deg)';
        requestAnimationFrame(() => {
          wrapper.style.transition = '';
        });
      }
      setCardRotations(prev => ({
        ...prev,
        [cardIndex]: { rotateX: 0, rotateY: 0 }
      }));
      return;
    }
    
    const now = Date.now();
    if (now - lastCardMouseMoveRef.current < 32) return;
    lastCardMouseMoveRef.current = now;
    
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -15;
    const rotateY = ((x - centerX) / centerX) * 15;
    
    const percentX = (x / rect.width) * 100;
    const percentY = (y / rect.height) * 100;
    card.style.setProperty('--mouse-x', `${percentX}%`);
    card.style.setProperty('--mouse-y', `${percentY}%`);
    
    setCardRotations(prev => ({
      ...prev,
      [cardIndex]: { rotateX, rotateY }
    }));
  }, [activeCardIndex]);

  const handleCardMouseLeave = useCallback((cardIndex: number) => {
    const cardNumber = cardIndex + 1;
    if (cardNumber !== activeCardIndex) return;
    
    setCardRotations(prev => ({
      ...prev,
      [cardIndex]: { rotateX: 0, rotateY: 0 }
    }));
  }, [activeCardIndex]);

  const carouselTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isManualInteraction, setIsManualInteraction] = useState(false);

  const goToCard = useCallback((cardIndex: number, manual: boolean = false) => {
    const clampedIndex = Math.max(1, Math.min(cardIndex, allProjects.length));
    console.log('🎯 Going to card:', clampedIndex, manual ? '(MANUAL)' : '(AUTO)');
    setActiveCardIndex(clampedIndex);
    
    if (manual) {
      setIsManualInteraction(true);
      if (carouselTimerRef.current) {
        clearTimeout(carouselTimerRef.current);
      }
      carouselTimerRef.current = setTimeout(() => {
        console.log('✅ Manual interaction timeout - resuming auto-scroll');
        setIsManualInteraction(false);
      }, 10000);
    }
  }, [setActiveCardIndex]);

  // Function to go to next card
  const goToNextCard = useCallback(() => {
    const nextIndex = activeCardIndex >= allProjects.length ? 1 : activeCardIndex + 1;
    goToCard(nextIndex, true);
  }, [activeCardIndex, goToCard]);

  // 🔥 FIX: Auto-advance carousel - PROPERLY CHECKING VISIBILITY
  useEffect(() => {
    console.log('⏱️ Auto-scroll effect triggered', {
      isSection3Visible,
      activeCardIndex,
      isManualInteraction
    });
    
    if (!isSection3Visible) {
      console.log('⏸️ PAUSED - Section not visible');
      return;
    }
    
    const autoAdvanceDelay = isManualInteraction ? 10000 : 5000;
    console.log(`▶️ ACTIVE - Next card in ${autoAdvanceDelay}ms`);
    
    const timer = setTimeout(() => {
      const next = activeCardIndex >= allProjects.length ? 1 : activeCardIndex + 1;
      console.log('🔄 AUTO-SCROLLING to card', next);
      setActiveCardIndex(next);
    }, autoAdvanceDelay);
    
    return () => {
      console.log('🧹 Cleanup timer');
      clearTimeout(timer);
    };
  }, [activeCardIndex, isManualInteraction, isSection3Visible, setActiveCardIndex]);

  useEffect(() => {
    return () => {
      if (carouselTimerRef.current) {
        clearTimeout(carouselTimerRef.current);
      }
    };
  }, []);

  const cardPositionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  useEffect(() => {
    if (cardPositionTimeoutRef.current) {
      clearTimeout(cardPositionTimeoutRef.current);
    }

    cardPositionTimeoutRef.current = setTimeout(() => {
      const container = cardsContainerRef.current;
      const cards = cardsRef.current.filter(Boolean);
      
      if (!container || cards.length === 0) return;

      requestAnimationFrame(() => {
        const cardWidth = 400;
        const gap = 80;
        
        const rightPadding = window.innerWidth >= 1024 ? 64 : 32;
        const rightContainerWidth = (window.innerWidth * 0.5) - rightPadding;
        const centerPosition = rightContainerWidth / 2;
        
        const cardArrayIndex = activeCardIndex - 1;
        const offsetToCard = cardArrayIndex * (cardWidth + gap);
        const targetX = -offsetToCard + centerPosition - (cardWidth / 2);
        
        container.style.transition = 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        container.style.transform = `translate3d(${targetX}px, 0, 0)`;
        
        cards.forEach((card, index) => {
          if (!card) return;
          
          const cardNumber = index + 1;
          let scale: number;
          
          if (cardNumber === activeCardIndex) {
            scale = 1.1;
          } else if (Math.abs(cardNumber - activeCardIndex) === 1) {
            scale = 0.95;
          } else {
            scale = 0.85;
          }
          
          card.style.transition = 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
          card.style.transform = `scale(${scale})`;
        });
      });
    }, 50);

    return () => {
      if (cardPositionTimeoutRef.current) {
        clearTimeout(cardPositionTimeoutRef.current);
      }
    };
  }, [activeCardIndex]);

  return (
    <section 
      id="industries-carousel-section"
      className="relative overflow-hidden"
      style={{
        background: 'linear-gradient(to bottom, rgb(20, 20, 20) 0%, rgb(10, 10, 10) 50%, rgb(0, 0, 0) 100%)',
        minHeight: '100vh',
        paddingTop: '10vh',
        paddingBottom: '20vh',
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

      {/* Vertical divider line */}
      <div 
        className="absolute left-[50%] top-0 bottom-0 w-px pointer-events-none z-30"
        style={{
          borderLeft: '1px dashed rgba(255, 255, 255, 0.2)'
        }}
      />

      {/* Left Panel */}
      <div 
        ref={leftPanelRef}
        className="absolute left-0 w-[50%] z-20 flex items-start pl-12 pr-8 py-6 lg:pl-20 lg:pr-12"
        style={{
          top: '10vh',
          bottom: '20vh'
        }}
      >
        <div className="w-full flex flex-col h-full">
          <div className="flex-1 flex flex-col">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Industry</p>
            
            <div className="vanish-crossfade-container mb-3">
              <h2 
                key={`industry-name-${textAnimationKey}`}
                className="text-3xl lg:text-4xl font-bold text-white vanish-content leading-tight"
                data-animating={isAnimating ? "true" : "false"}
                data-delay="0"
              >
                {activeProject.industryName}
              </h2>
            </div>
            
            <div className="vanish-crossfade-container mb-5">
              <p 
                key={`industry-desc-${textAnimationKey}`}
                className="text-sm lg:text-base text-gray-400 leading-relaxed vanish-content line-clamp-3 min-h-[4.5rem] max-h-[4.5rem]"
                data-animating={isAnimating ? "true" : "false"}
                data-delay="1"
              >
                {activeProject.industryDescription}
              </p>
            </div>

            {/* Problem Box - 🔥 VIBRANT GRADIENTS */}
            <div className={styles.notificationBox + " mb-3"}>
              <div className={styles.boxInner}>
                <div className="relative flex flex-col">
                  <div className="relative box-icon-container mb-3 w-fit rounded-lg border border-gray-600 p-2">
                    <div 
                      className={`absolute inset-0 rounded-lg opacity-0 ${styles.boxIconGradient}`}
                      style={{
                          background: `radial-gradient(
                            150px circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
                            rgba(0, 255, 166, 0.8),
                            rgba(255, 215, 0, 0.6),
                            rgba(236, 72, 153, 0.6),
                            rgba(147, 51, 234, 0.6),
                            rgba(59, 130, 246, 0.5),
                            transparent 70%
                          )`,
                        padding: '1px',
                        WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                        WebkitMaskComposite: 'xor',
                        maskComposite: 'exclude'
                      }}
                    />
                    <svg className="w-4 h-4 text-neutral-400 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  
                  <div className="relative w-full h-px mb-3 box-divider-line">
                    <div className="absolute inset-0 bg-white/10" />
                    <div 
                      className={`absolute inset-0 opacity-0 ${styles.boxLineGradient}`}
                      style={{
                        background: `radial-gradient(
                          200px circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
                          rgba(0, 255, 166, 0.8),
                          rgba(255, 215, 0, 0.6),
                          rgba(236, 72, 153, 0.6),
                          rgba(147, 51, 234, 0.6),
                          rgba(59, 130, 246, 0.5),
                          transparent 70%
                        )`
                      }}
                    />
                  </div>
                  <h3 className={styles.notititle + " mb-5"}>Problem Statement</h3>
                  <div className="vanish-crossfade-container">
                    <p 
                      key={`problem-${textAnimationKey}`}
                      className={styles.notibody + " vanish-content"}
                      data-animating={isAnimating ? "true" : "false"}
                      data-delay="2"
                    >
                      {activeProject.problem}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Value Proposition Box - 🔥 VIBRANT GRADIENTS */}
            <div className={styles.notificationBox + " mb-3"}>
              <div className={styles.boxInner}>
                <div className="relative flex flex-col">
                  <div className="relative box-icon-container mb-3 w-fit rounded-lg border border-gray-600 p-2">
                    <div 
                      className={`absolute inset-0 rounded-lg opacity-0 ${styles.boxIconGradient}`}
                      style={{
                        background: `radial-gradient(
                          150px circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
                          rgba(0, 255, 166, 0.8),
                          rgba(255, 215, 0, 0.6),
                          rgba(236, 72, 153, 0.6),
                          rgba(147, 51, 234, 0.6),
                          rgba(59, 130, 246, 0.5),
                          transparent 70%
                        )`,
                        padding: '1px',
                        WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                        WebkitMaskComposite: 'xor',
                        maskComposite: 'exclude'
                      }}
                    />
                    <svg className="w-4 h-4 text-neutral-400 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  
                  <div className="relative w-full h-px mb-3 box-divider-line">
                    <div className="absolute inset-0 bg-white/10" />
                    <div 
                      className={`absolute inset-0 opacity-0 ${styles.boxLineGradient}`}
                      style={{
                        background: `radial-gradient(
                          200px circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
                          rgba(0, 255, 166, 0.8),
                          rgba(255, 215, 0, 0.6),
                          rgba(236, 72, 153, 0.6),
                          rgba(147, 51, 234, 0.6),
                          rgba(59, 130, 246, 0.5),
                          transparent 70%
                        )`
                      }}
                    />
                  </div>
                  <h3 className={styles.notititle + " mb-5"}>Value Proposition</h3>
                  <div className="vanish-crossfade-container">
                    <p 
                      key={`value-prop-${textAnimationKey}`}
                      className={styles.notibody + " vanish-content"}
                      data-animating={isAnimating ? "true" : "false"}
                      data-delay="3"
                    >
                      {activeProject.valueProposition}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Team Section */}
          <div className="pt-4 border-t border-white/10 mt-auto">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">Project Team</p>
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center relative">
                {activeProject.team.map((member, idx) => (
                  <div 
                    key={idx}
                    className="relative group hover:z-50 transition-all duration-300"
                    style={{ 
                      zIndex: 50 - (idx * 10),
                      marginLeft: idx === 0 ? 0 : '-1.25rem'
                    }}
                  >
                    <div className={`w-12 h-12 rounded-full ${member.color} border-2 border-white/20 flex items-center justify-center cursor-pointer hover:scale-110 transition-all duration-300 shadow-lg`}>
                      <span className="text-white text-xs font-bold">
                        {idx === 0 ? 'TL' : `M${idx}`}
                      </span>
                    </div>
                    <div className="absolute -top-20 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 whitespace-nowrap">
                      <div className="bg-gray-900 text-white px-4 py-2.5 rounded-lg shadow-2xl border border-white/20">
                        <p className="text-sm font-semibold">{member.name}</p>
                        <p className="text-xs text-gray-400">{member.role}</p>
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-2 h-2 bg-gray-900 border-r border-b border-white/20 rotate-45" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="relative">
                <button 
                  className={styles.premiumBtn}
                  onClick={goToNextCard}
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
                      {'Next Venture'.split('').map((letter, i) => (
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
            </div>
          </div>
        </div>
      </div>

      {/* Cards Container */}
      <div 
        className="absolute left-[50%] right-0 flex items-center z-10 overflow-hidden bg-transparent pr-8 lg:pr-16"
        style={{
          top: '10vh',
          bottom: '20vh'
        }}
      >
        <div 
          ref={cardsContainerRef}
          className={`flex gap-20 items-center bg-transparent ${styles.cardsScrollContainer}`}
        >
          {allProjects.map((project, index) => {
            const cardNumber = index + 1;
            const isActive = cardNumber === activeCardIndex;
            const rotation = (isActive && isSection3Visible) 
              ? (cardRotations[index] || { rotateX: 0, rotateY: 0 }) 
              : { rotateX: 0, rotateY: 0 };
            
            return (
              <div
                key={index}
                ref={(el) => { cardsRef.current[index] = el; }}
                className={`${styles.projectCard} ${styles.noselect} ${!isActive ? styles.cardInactive : styles.cardActive}`}
                onMouseMove={isActive ? (e) => handleCardMouseMove(e, index) : undefined}
                onMouseLeave={isActive ? () => handleCardMouseLeave(index) : undefined}
                style={{ pointerEvents: isActive ? 'auto' : 'none' }}
              >
                <div className={styles.cardOuter}>
                  <div 
                    className={styles.cardInnerWrapper}
                    style={{
                      transform: `rotateX(${rotation.rotateX}deg) rotateY(${rotation.rotateY}deg)`,
                      transition: 'transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)'
                    }}
                    onMouseMove={(e) => {
                      if (!isActive) return;
                      const rect = e.currentTarget.getBoundingClientRect();
                      const x = e.clientX - rect.left;
                      const y = e.clientY - rect.top;
                      e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
                      e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
                    }}
                  >
                    <div className={styles.cardInner}>
                      <div className="absolute top-6 right-6 w-12 h-12 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center z-10">
                        <span className="text-white/40 text-xs">LOGO</span>
                      </div>
                      
                      <div className="flex-1 flex flex-col justify-between">
                        <div className="space-y-2.5">
                          <h3 className="text-lg lg:text-xl font-bold text-white leading-tight pr-16">
                            {project.title}
                          </h3>
                          
                          <div className="text-xs text-gray-500">
                            <span className="font-semibold text-gray-400">{project.industryName}</span>
                          </div>
                          
                          <p className="text-xs text-gray-400 leading-relaxed">
                            {project.description}
                          </p>
                          
                          <div className="h-px bg-white/10" />
                          
                          <div className="flex flex-wrap gap-2 mb-2.5">
                            {project.domains.map((domain, idx) => (
                              <span key={idx} className={`${styles.domainTag} px-2.5 py-1 bg-white/5 rounded text-xs text-gray-300 border border-white/10`}>
                                {domain}
                              </span>
                            ))}
                          </div>
                          
                          <div className="mb-2">
                            <p className="text-xs text-gray-500 mb-2 font-medium">Features</p>
                            <div className="grid grid-cols-2 gap-x-3 gap-y-1">
                              {project.features.map((feature, idx) => (
                                <div key={idx} className="flex items-start gap-1.5">
                                  <span className={styles.prismBullet}>●</span>
                                  <span className="text-xs text-gray-400">{feature}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-2.5">
                          <div className="relative">
                            <div 
                              className="timeline-grid-border absolute inset-0 rounded-lg pointer-events-none"
                              style={{
                                background: 'radial-gradient(300px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(0, 255, 166, 0.8), rgba(255, 215, 0, 0.6), rgba(236, 72, 153, 0.6), rgba(147, 51, 234, 0.6), rgba(59, 130, 246, 0.5), transparent 70%)',
                                padding: '1px',
                                WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                                WebkitMaskComposite: 'xor',
                                maskComposite: 'exclude',
                                opacity: 0,
                                transition: 'opacity 0.3s ease',
                                willChange: 'opacity'
                              }}
                            />
                            <div 
                              className={`${styles.timelineGridBox} relative bg-gray-900/80 rounded-lg p-5`} 
                              style={{ border: '1px solid rgba(255, 255, 255, 0.1)' }}
                              onMouseMove={(e) => {
                                const border = e.currentTarget.previousElementSibling as HTMLElement;
                                if (border) {
                                  const rect = e.currentTarget.getBoundingClientRect();
                                  const x = e.clientX - rect.left;
                                  const y = e.clientY - rect.top;
                                  border.style.setProperty('--mouse-x', `${x}px`);
                                  border.style.setProperty('--mouse-y', `${y}px`);
                                  border.style.opacity = '1';
                                }
                              }}
                              onMouseLeave={(e) => {
                                const border = e.currentTarget.previousElementSibling as HTMLElement;
                                if (border) {
                                  border.style.opacity = '0';
                                }
                              }}
                            >
                              <div 
                                className="absolute inset-0 rounded-lg pointer-events-none overflow-hidden opacity-30"
                                style={{
                                  backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)`,
                                  backgroundSize: '16px 16px',
                                }}
                              />

                              <div className="relative h-14">
                                <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 pointer-events-none">
                                  <div className="w-full h-[0.5px] bg-white" />
                                  <div 
                                    className="absolute left-0 top-0 h-[0.5px] shadow-lg"
                                    style={{ 
                                      width: `${(project.timeline.filter(t => t.status === 'complete').length / project.timeline.length) * 100}%`,
                                      background: 'linear-gradient(to right, rgba(34, 197, 94, 1), rgba(59, 130, 246, 1), rgba(236, 72, 153, 1))',
                                      boxShadow: '0 0 10px rgba(34, 197, 94, 0.5)',
                                      transition: 'width 0.8s ease-in-out'
                                    }}
                                  />
                                </div>
                                
                                <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2">
                                  <div className="relative flex justify-between items-center">
                                    {project.timeline.map((stage, idx) => (
                                      <div key={idx} className="relative group">
                                        <div className={`${styles.techCheckpoint} ${styles[`techCheckpoint${stage.status.charAt(0).toUpperCase() + stage.status.slice(1)}`]}`}>
                                          <div className={`${styles.checkpointInner} ${stage.status === 'current' ? 'checkpoint-inner-current' : ''}`}></div>
                                          {stage.status === 'current' && <div className={styles.checkpointPulse}></div>}
                                        </div>
                                        <div className="absolute -top-14 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 whitespace-nowrap">
                                          <div className="bg-gray-900 text-white text-xs px-2.5 py-1.5 rounded shadow-xl border border-white/20">
                                            <div className="font-semibold">{stage.stage}</div>
                                            <div className="text-[10px] text-gray-400">{stage.date}</div>
                                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-1.5 h-1.5 bg-gray-900 border-r border-b border-white/20 rotate-45" />
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="pt-3 border-t border-white/10">
                            <div className="relative join-button-wrapper">
                              <button 
                                className={styles.premiumBtn}
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
                                    d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"
                                  />
                                </svg>
                                <div className="premium-txt-wrapper">
                                  <div className="premium-txt-1">
                                    {'Join Our Initiative'.split('').map((letter, i) => (
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
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-6 sm:bottom-8 z-20 lg:left-[50%] lg:right-0 left-0 right-0 px-8 lg:px-12">
        <div className="flex gap-2">
          {allProjects.map((project, index) => {
            const segmentIndex = index + 1;
            const isActive = segmentIndex <= activeCardIndex;
            const isCurrent = segmentIndex === activeCardIndex;
            
            const gradientStart = (index / allProjects.length) * 100;
            const gradientEnd = ((index + 1) / allProjects.length) * 100;
            
            return (
              <button 
                key={index}
                className="flex-1 relative cursor-pointer group"
                onClick={() => goToCard(segmentIndex, true)}
                aria-label={`Go to ${project.title}`}
              >
                <div 
                  className={`h-2 rounded-full overflow-hidden border transition-all duration-300 group-hover:border-white/50 group-hover:scale-y-125 ${
                    isCurrent 
                      ? 'border-white/60 shadow-lg' 
                      : isActive 
                        ? 'border-white/30' 
                        : 'border-white/10'
                  }`}
                  style={{
                    background: 'rgba(31, 41, 55, 0.6)',
                    backdropFilter: 'blur(4px)',
                    boxShadow: isCurrent 
                      ? '0 0 12px rgba(255, 255, 255, 0.2), 0 0 24px rgba(59, 130, 246, 0.15)' 
                      : 'none'
                  }}
                >
                  <div 
                    className={`h-full rounded-full transition-all duration-800 ease-in-out ${isActive ? 'w-full' : 'w-0'}`}
                    style={{ 
                      background: isActive 
                        ? `linear-gradient(to right, 
                            hsl(${142 - (gradientStart * 2.5)}, 70%, 50%), 
                            hsl(${142 - (gradientEnd * 2.5)}, 70%, 50%)
                          )`
                        : 'transparent',
                      transitionProperty: 'width, background',
                      transitionDuration: '800ms, 800ms',
                      transitionTimingFunction: 'ease-in-out, ease-in-out'
                    }}
                  />
                </div>
              </button>
            );
          })}
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-500">
          <span>
            {activeCardIndex === 0 ? 'Start' : activeCardIndex > allProjects.length ? allProjects.length : activeCardIndex} / {allProjects.length}
          </span>
          <span>{activeCardIndex === 0 ? 'Begin' : allProjects[activeCardIndex - 1]?.industryName || ''}</span>
        </div>
      </div>
    </section>
  );
});

FeatureSection.displayName = 'FeatureSection';

export default FeatureSection;