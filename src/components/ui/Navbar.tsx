"use client";
import { useState, useEffect, useRef } from 'react';
import Sidebar from './Sidebar';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: string;
  isSpecial?: boolean;
}

const Navbar = ({ activeTab, setActiveTab, sidebarOpen, setSidebarOpen }: NavbarProps) => {
  const [scrolled, setScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const navContainerRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  // Check for mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Mouse tracking for gradient effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Update navbar container
      if (navContainerRef.current) {
        try {
          const rect = navContainerRef.current.getBoundingClientRect();
          if (rect && rect.width && rect.height) {
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            navContainerRef.current.style.setProperty('--mouse-x', `${x}%`);
            navContainerRef.current.style.setProperty('--mouse-y', `${y}%`);
          }
        } catch (err) {
          // Silently handle any errors during mouse tracking
        }
      }

      // Update menu button
      if (menuButtonRef.current) {
        try {
          const rect = menuButtonRef.current.getBoundingClientRect();
          if (rect && rect.width && rect.height) {
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            menuButtonRef.current.style.setProperty('--mouse-x', `${x}%`);
            menuButtonRef.current.style.setProperty('--mouse-y', `${y}%`);
          }
        } catch (err) {
          // Silently handle any errors during mouse tracking
        }
      }
    };

    // Add a small delay to ensure refs are initialized
    const timeoutId = setTimeout(() => {
      document.addEventListener('mousemove', handleMouseMove);
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Handle tab click - switch tabs and scroll to top
  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navItems: NavItem[] = [
    { id: 'discover', label: 'Discover', icon: 'bi-rocket-takeoff' },
    { id: 'information', label: 'Information', icon: 'bi-pin' },
    { id: 'affiliations', label: 'Affiliations', icon: 'bi-patch-check' },
    { id: 'ventures', label: 'Ventures', icon: 'bi-stars', isSpecial: true }
  ];

  return (
    <>
      <style>{`
        .nav-button-active-border {
          position: relative;
          padding: 1px;
          background: transparent;
          border-radius: 9999px;
        }

        .nav-button-active-border::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 9999px;
          padding: 1px;
          background: linear-gradient(90deg, 
            transparent 0%,
            rgba(0, 255, 166, 0.8) 15%,
            rgba(255, 215, 0, 0.6) 30%,
            rgba(236, 72, 153, 0.6) 45%,
            rgba(147, 51, 234, 0.6) 60%,
            rgba(59, 130, 246, 0.5) 75%,
            transparent 90%
          );
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          animation: orbitBorder 3s linear infinite;
          background-size: 200% 100%;
        }

        .sandbox-border {
          position: relative;
          padding: 0px;
          background: transparent;
          border-radius: 9999px;
        }

        .sandbox-border::before {
          display: none;
        }

        @keyframes orbitBorder {
          0% { background-position: 0% 0%; }
          100% { background-position: 200% 0%; }
        }

        .sandbox-loader-wrapper {
          width: 16px;
          height: 16px;
          display: inline-block;
          margin-right: 6px;
          position: relative;
          overflow: hidden;
          flex-shrink: 0;
        }

        @media (max-width: 640px) {
          .sandbox-loader-wrapper {
            width: 12px;
            height: 12px;
            margin-right: 4px;
          }
        }

        .sandbox-loader {
          --color-one: #E52B50;
          --color-two: #C41E3A;
          --color-three: rgba(229, 43, 80, 0.5);
          --color-four: rgba(196, 30, 58, 0.5);
          --color-five: rgba(229, 43, 80, 0.25);
          --time-animation: 2s;
          position: absolute;
          top: 50%;
          left: 50%;
          width: 100px;
          height: 100px;
          margin-left: -50px;
          margin-top: -50px;
          transform: scale(0.16);
          border-radius: 50%;
          animation: colorize calc(var(--time-animation) * 3) ease-in-out infinite;
        }

        @media (max-width: 640px) {
          .sandbox-loader { transform: scale(0.12); }
        }

        .sandbox-loader::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 100px;
          height: 100px;
          border-radius: 50%;
          border-top: solid 1px var(--color-one);
          border-bottom: solid 1px var(--color-two);
          background: linear-gradient(180deg, var(--color-five), var(--color-four));
          box-shadow:
            inset 0 8px 8px 0 var(--color-three),
            inset 0 -8px 8px 0 var(--color-four);
        }

        .sandbox-loader .box {
          width: 100px;
          height: 100px;
          background: linear-gradient(180deg, var(--color-one) 30%, var(--color-two) 70%);
          mask: url(#clipping);
          -webkit-mask: url(#clipping);
        }

        .sandbox-loader svg { position: absolute; }
        .sandbox-loader svg #clipping {
          filter: contrast(15);
          animation: roundness calc(var(--time-animation) / 2) linear infinite;
        }
        .sandbox-loader svg #clipping polygon { filter: blur(7px); }
        .sandbox-loader svg #clipping polygon:nth-child(1) { transform-origin: 75% 25%; transform: rotate(90deg); }
        .sandbox-loader svg #clipping polygon:nth-child(2) { transform-origin: 50% 50%; animation: rotation var(--time-animation) linear infinite reverse; }
        .sandbox-loader svg #clipping polygon:nth-child(3) { transform-origin: 50% 60%; animation: rotation var(--time-animation) linear infinite; animation-delay: calc(var(--time-animation) / -3); }
        .sandbox-loader svg #clipping polygon:nth-child(4) { transform-origin: 40% 40%; animation: rotation var(--time-animation) linear infinite reverse; }
        .sandbox-loader svg #clipping polygon:nth-child(5) { transform-origin: 40% 40%; animation: rotation var(--time-animation) linear infinite reverse; animation-delay: calc(var(--time-animation) / -2); }
        .sandbox-loader svg #clipping polygon:nth-child(6) { transform-origin: 60% 40%; animation: rotation var(--time-animation) linear infinite; }
        .sandbox-loader svg #clipping polygon:nth-child(7) { transform-origin: 60% 40%; animation: rotation var(--time-animation) linear infinite; animation-delay: calc(var(--time-animation) / -1.5); }

        @keyframes rotation {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes roundness {
          0%, 100% { filter: contrast(15); }
          20%, 40% { filter: contrast(3); }
          60% { filter: contrast(15); }
        }

        @keyframes colorize {
          0%, 100% { filter: hue-rotate(0deg); }
          20% { filter: hue-rotate(-30deg); }
          40% { filter: hue-rotate(-60deg); }
          60% { filter: hue-rotate(-90deg); }
          80% { filter: hue-rotate(-45deg); }
        }

        .glass-nav {
          position: relative;
          background: rgba(15, 15, 15, 0.75);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          box-shadow: 
            0 8px 32px rgba(0, 0, 0, 0.6),
            0 12px 48px rgba(0, 0, 0, 0.4),
            inset 0 1px 1px rgba(255, 255, 255, 0.1),
            inset 0 -1px 1px rgba(0, 0, 0, 0.5);
        }

        /* Navbar hover gradient effect */
        .glass-nav::before {
          content: '';
          position: absolute;
          inset: -1px;
          border-radius: inherit;
          padding: 0.5px;
          background: radial-gradient(
            150px circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
            rgba(0, 255, 166, 0.8),
            rgba(255, 215, 0, 0.6),
            rgba(236, 72, 153, 0.6),
            rgba(147, 51, 234, 0.6),
            rgba(59, 130, 246, 0.5),
            transparent 70%
          );
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          opacity: 0;
          transition: opacity 0.4s ease-in-out;
          pointer-events: none;
          z-index: -1;
        }

        .glass-nav:hover::before {
          opacity: 1;
        }

        /* Menu button hover gradient effect */
        .hamburger-btn {
          position: relative;
        }

        .hamburger-btn::before {
          content: '';
          position: absolute;
          inset: -1px;
          border-radius: inherit;
          padding: 0.5px;
          background: radial-gradient(
            120px circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
            rgba(0, 255, 166, 0.8),
            rgba(255, 215, 0, 0.6),
            rgba(236, 72, 153, 0.6),
            rgba(147, 51, 234, 0.6),
            rgba(59, 130, 246, 0.5),
            transparent 70%
          );
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          opacity: 0;
          transition: opacity 0.4s ease-in-out;
          pointer-events: none;
          z-index: -1;
        }

        .hamburger-btn:hover::before {
          opacity: 1;
        }

        .nav-button {
          box-shadow: 
            0 2px 8px rgba(0, 0, 0, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.05);
          transition: all 0.3s ease;
        }

        .nav-button:hover {
          box-shadow: 
            0 4px 12px rgba(0, 0, 0, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
          transform: translateY(-1px);
        }

        .nav-button-active {
          background: rgba(255, 255, 255, 0.08);
          box-shadow: 
            0 2px 8px rgba(0, 0, 0, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.1),
            inset 0 -1px 0 rgba(0, 0, 0, 0.2);
          color: rgba(255, 255, 255, 0.85);
        }

        .nav-button-inactive {
          color: rgba(255, 255, 255, 0.6);
        }

        .nav-button-active-text {
          color: rgba(255, 255, 255, 0.85);
        }
      `}</style>

      {/* Sidebar Component */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 flex justify-center transition-all duration-500 ${
        scrolled ? 'pt-2' : 'pt-4'
      }`} style={{ paddingLeft: '12px', paddingRight: '12px' }}>
        <div className="w-full max-w-fit flex items-center gap-3">
          {/* Glassmorphic Dock Container */}
          <div ref={navContainerRef} className="glass-nav rounded-full border border-white/10">
            <div 
              className="flex items-center gap-2" 
              style={{ 
                padding: isMobile ? '5px 8px' : '7px 10px'
              }}
            >
              {navItems.map((item) => {
                const isActive = activeTab === item.id;
                
                if (item.isSpecial) {
                  return (
                    <div key={item.id} className={isActive ? 'nav-button-active-border' : ''}>
                      <button
                        onClick={() => handleTabClick(item.id)}
                        className={`
                          nav-button relative rounded-full flex items-center
                          font-semibold tracking-wide transition-all duration-300
                          ${isActive 
                            ? 'nav-button-active' 
                            : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white'
                          }
                        `}
                        style={{ 
                          padding: isMobile ? '5px 10px' : '7px 18px',
                          fontSize: isMobile ? '0.75rem' : '0.875rem'
                        }}
                      >
                        <div className="sandbox-loader-wrapper">
                          <div className="sandbox-loader">
                            <svg width="100" height="100" viewBox="0 0 100 100">
                              <defs>
                                <mask id="clipping">
                                  <polygon points="0,0 100,0 100,100 0,100" fill="black"></polygon>
                                  <polygon points="25,25 75,25 50,75" fill="white"></polygon>
                                  <polygon points="50,25 75,75 25,75" fill="white"></polygon>
                                  <polygon points="35,35 65,35 50,65" fill="white"></polygon>
                                  <polygon points="35,35 65,35 50,65" fill="white"></polygon>
                                  <polygon points="35,35 65,35 50,65" fill="white"></polygon>
                                  <polygon points="35,35 65,35 50,65" fill="white"></polygon>
                                </mask>
                              </defs>
                            </svg>
                            <div className="box"></div>
                          </div>
                        </div>
                        <span className={isActive ? 'nav-button-active-text' : ''}>{item.label}</span>
                      </button>
                    </div>
                  );
                }
                
                return (
                  <div key={item.id} className={isActive ? 'nav-button-active-border' : ''}>
                    <button
                      onClick={() => handleTabClick(item.id)}
                      className={`
                        nav-button relative rounded-full
                        font-medium tracking-wide transition-all duration-300
                        ${isActive 
                          ? 'nav-button-active' 
                          : 'text-gray-400 hover:text-gray-200 hover:bg-white/10'
                        }
                      `}
                      style={{ 
                        padding: isMobile ? '5px 10px' : '7px 16px',
                        fontSize: isMobile ? '0.75rem' : '0.875rem'
                      }}
                    >
                      <i className={`bi ${item.icon} ${isMobile ? 'text-xs' : 'text-sm'} mr-1.5`}></i>
                      <span className={isActive ? 'nav-button-active-text' : ''}>{item.label}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Hamburger Menu Button - Increased size to match navbar height */}
          <button
            ref={menuButtonRef}
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={`hamburger-btn glass-nav rounded-full border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 transition-all ${sidebarOpen ? 'open' : ''}`}
            style={{
              padding: isMobile ? '10px' : '14px',
              width: isMobile ? '38px' : '52px',
              height: isMobile ? '38px' : '52px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <i 
              className={`bi ${sidebarOpen ? 'bi-dash-square' : 'bi-grid'} transition-all duration-300`}
              style={{ fontSize: isMobile ? '16px' : '20px' }}
            ></i>
          </button>
        </div>
      </nav>
    </>
  );
};

export default Navbar;