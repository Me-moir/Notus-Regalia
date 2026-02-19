"use client";
import { memo, useState, useEffect } from 'react';
import { useTheme } from '@/context/ThemeContext';

const ThemeToggle = memo(() => {
  const { theme, toggleTheme } = useTheme();
  const [animating, setAnimating] = useState(false);

  // Initial attention-grab animation: after 2s delay, spin the sun icon for 2s
  useEffect(() => {
    const delayTimer = setTimeout(() => {
      setAnimating(true);
    }, 2000);

    return () => clearTimeout(delayTimer);
  }, []);

  // Stop the animation after 2 seconds of spinning
  useEffect(() => {
    if (!animating) return;
    const stopTimer = setTimeout(() => {
      setAnimating(false);
    }, 2000);
    return () => clearTimeout(stopTimer);
  }, [animating]);

  const isDark = theme === 'dark';

  return (
    <>
      <style jsx>{`
        @keyframes sunSpin {
          0% { transform: rotate(0deg) scale(1); }
          25% { transform: rotate(180deg) scale(1.3); }
          50% { transform: rotate(360deg) scale(1); }
          75% { transform: rotate(540deg) scale(1.3); }
          100% { transform: rotate(720deg) scale(1); }
        }
        @keyframes sunGlow {
          0%, 100% { 
            text-shadow: 0 0 4px rgba(255, 255, 255, 0.3);
            filter: brightness(1);
          }
          25%, 75% { 
            text-shadow: 0 0 16px rgba(255, 255, 255, 1), 0 0 32px rgba(255, 255, 255, 0.7), 0 0 48px rgba(255, 255, 255, 0.4);
            filter: brightness(1.8);
          }
          50% { 
            text-shadow: 0 0 24px rgba(255, 255, 255, 1), 0 0 48px rgba(255, 255, 255, 0.8), 0 0 72px rgba(255, 255, 255, 0.5);
            filter: brightness(2.2);
          }
        }
        .sun-spin-animate {
          animation: sunSpin 2s cubic-bezier(0.4, 0, 0.2, 1) forwards,
                     sunGlow 2s ease-in-out forwards;
          color: #ffffff !important;
        }
      `}</style>
      <button
        onClick={toggleTheme}
        className="nav-button relative font-medium tracking-wide transition-all duration-300 hover:scale-105 flex items-center gap-2"
        style={{
          padding: '6px 14px',
          fontSize: '0.8rem',
          color: 'var(--content-faint)',
          borderRadius: '9999px',
          border: '1px solid var(--border-color)',
          background: 'var(--surface-elevated)',
        }}
        aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
        title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      >
        <i
          className={`bi ${isDark ? 'bi-sun-fill' : 'bi-moon-stars-fill'} text-sm${isDark && animating ? ' sun-spin-animate' : ''}`}
          style={{
            display: 'inline-block',
            transition: 'color 0.3s, transform 0.3s',
            color: isDark ? '#ffffff' : '#000000',
          }}
        ></i>
        <span
          style={{
            fontSize: '0.75rem',
            fontWeight: 500,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            color: 'var(--content-secondary)',
            transition: 'color 0.3s',
          }}
        >
          {isDark ? 'Light' : 'Dark'}
        </span>
      </button>
    </>
  );
});

ThemeToggle.displayName = 'ThemeToggle';

export default ThemeToggle;