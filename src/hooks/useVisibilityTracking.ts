import { useState, useEffect, useRef } from 'react';

interface UseVisibilityTrackingProps {
  elementId: string;
  threshold?: number; // percentage (0-100)
  onVisibilityChange?: (isVisible: boolean) => void;
}

export const useVisibilityTracking = ({
  elementId,
  threshold = 70,
  onVisibilityChange
}: UseVisibilityTrackingProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const isVisibleRef = useRef(false);

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
        
        const visible = visibilityPercentage >= threshold;
        
        if (visible !== isVisibleRef.current) {
          setIsVisible(visible);
          isVisibleRef.current = visible;
          onVisibilityChange?.(visible);
        }
      },
      { 
        threshold: [0, 0.5, 0.7, 1.0],
        rootMargin: '0px'
      }
    );

    const element = document.getElementById(elementId);
    
    if (element) {
      observer.observe(element);
    }

    return () => {
      observer.disconnect();
    };
  }, [elementId, threshold, onVisibilityChange]);

  return { isVisible, isVisibleRef };
};