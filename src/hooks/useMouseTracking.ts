import { useEffect, useRef } from 'react';

interface UseMouseTrackingProps {
  enabled: boolean;
  panelRef: React.RefObject<HTMLElement>;
  boxSelector: string;
  dependencies?: any[];
}

export const useMouseTracking = ({
  enabled,
  panelRef,
  boxSelector,
  dependencies = []
}: UseMouseTrackingProps) => {
  const cachedSelectorsRef = useRef<{
    boxes: HTMLElement[];
    icons: Map<HTMLElement, HTMLElement[]>;
    lines: Map<HTMLElement, HTMLElement[]>;
  } | null>(null);

const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const panel = panelRef.current;
    if (!panel || !enabled) return;

    // Cache selectors ONCE
    const boxes = Array.from(panel.querySelectorAll(boxSelector)) as HTMLElement[];
    const icons = new Map<HTMLElement, HTMLElement[]>();
    const lines = new Map<HTMLElement, HTMLElement[]>();
    
    boxes.forEach(box => {
      icons.set(box, Array.from(box.querySelectorAll('.box-icon-container')) as HTMLElement[]);
      lines.set(box, Array.from(box.querySelectorAll('.box-divider-line')) as HTMLElement[]);
    });
    
    cachedSelectorsRef.current = { boxes, icons, lines };

    const handleMouseMove = (e: MouseEvent) => {
      const cached = cachedSelectorsRef.current;
      if (!cached) return;
      
      // Cancel any pending animation frame
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }

      // Batch DOM updates with requestAnimationFrame
      rafRef.current = requestAnimationFrame(() => {
        cached.boxes.forEach((box) => {
          const rect = box.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          
          box.style.setProperty('--mouse-x', `${x}px`);
          box.style.setProperty('--mouse-y', `${y}px`);
          
          cached.icons.get(box)?.forEach(icon => {
            icon.style.setProperty('--mouse-x', `${x}px`);
            icon.style.setProperty('--mouse-y', `${y}px`);
          });
          
          cached.lines.get(box)?.forEach(line => {
            line.style.setProperty('--mouse-x', `${x}px`);
            line.style.setProperty('--mouse-y', `${y}px`);
          });
        });
      });
    };

    panel.addEventListener('mousemove', handleMouseMove);

    return () => {
      panel.removeEventListener('mousemove', handleMouseMove);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [enabled, panelRef, boxSelector, ...dependencies]);

  return cachedSelectorsRef;
};