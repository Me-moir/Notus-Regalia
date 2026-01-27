import { useState, useEffect, useRef, useCallback } from 'react';

interface UseCardCarouselProps {
  totalCards: number;
  initialCard?: number;
  autoAdvanceDelay?: number;
  manualInteractionDelay?: number;
}

export function useCardCarousel({
  totalCards,
  initialCard = 1,
  autoAdvanceDelay = 5000,
  manualInteractionDelay = 10000
}: UseCardCarouselProps) {
  const [activeCardIndex, setActiveCardIndex] = useState(initialCard);
  const [isManualInteraction, setIsManualInteraction] = useState(false);
  const carouselTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isVisibleRef = useRef(false);

  const goToCard = useCallback((cardIndex: number, manual: boolean = false) => {
    const clampedIndex = Math.max(1, Math.min(cardIndex, totalCards));
    setActiveCardIndex(clampedIndex);
    
    if (manual) {
      setIsManualInteraction(true);
      if (carouselTimerRef.current) {
        clearTimeout(carouselTimerRef.current);
      }
      carouselTimerRef.current = setTimeout(() => {
        setIsManualInteraction(false);
      }, manualInteractionDelay);
    }
  }, [totalCards, manualInteractionDelay]);

  useEffect(() => {
    if (!isVisibleRef.current) {
      return;
    }
    
    const delay = isManualInteraction ? manualInteractionDelay : autoAdvanceDelay;
    
    const timer = setTimeout(() => {
      const next = activeCardIndex >= totalCards ? 1 : activeCardIndex + 1;
      setActiveCardIndex(next);
    }, delay);
    
    return () => clearTimeout(timer);
  }, [activeCardIndex, isManualInteraction, totalCards, autoAdvanceDelay, manualInteractionDelay]);

  useEffect(() => {
    return () => {
      if (carouselTimerRef.current) {
        clearTimeout(carouselTimerRef.current);
      }
    };
  }, []);

  const setVisible = useCallback((visible: boolean) => {
    isVisibleRef.current = visible;
  }, []);

  return {
    activeCardIndex,
    setActiveCardIndex,
    goToCard,
    setVisible
  };
}