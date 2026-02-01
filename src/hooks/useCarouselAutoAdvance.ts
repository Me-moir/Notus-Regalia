import { useEffect, useRef, useState, useCallback } from 'react';

interface UseCarouselAutoAdvanceProps {
  enabled: boolean;
  isVisible: boolean;
  activeIndex: number;
  maxIndex: number;
  onAdvance: (nextIndex: number) => void;
  autoDelay?: number;
  manualDelay?: number;
}

export const useCarouselAutoAdvance = ({
  enabled,
  isVisible,
  activeIndex,
  maxIndex,
  onAdvance,
  autoDelay = 5000,
  manualDelay = 10000
}: UseCarouselAutoAdvanceProps) => {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isManualInteraction, setIsManualInteraction] = useState(false);

  const resetManualInteraction = useCallback(() => {
    setIsManualInteraction(true);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      setIsManualInteraction(false);
    }, manualDelay);
  }, [manualDelay]);

  useEffect(() => {
    if (!enabled || !isVisible) {
      return;
    }
    
    const delay = isManualInteraction ? manualDelay : autoDelay;
    
    const timer = setTimeout(() => {
      const next = activeIndex >= maxIndex ? 1 : activeIndex + 1;
      onAdvance(next);
    }, delay);
    
    return () => {
      clearTimeout(timer);
    };
  }, [enabled, isVisible, activeIndex, maxIndex, isManualInteraction, autoDelay, manualDelay, onAdvance]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return { resetManualInteraction };
};