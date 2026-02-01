import { useRef, useCallback, useState } from 'react';

interface SwipeState {
  startX: number;
  startY: number;
  currentX: number;
  isDragging: boolean;
  didMove: boolean;
  baseTranslateX: number;
}

interface UseSwipeGestureProps {
  enabled: boolean;
  activeIndex: number;
  maxIndex: number;
  onSwipe: (direction: 'left' | 'right') => void;
  getBaseTranslate: (index: number) => number;
}

export const useSwipeGesture = ({
  enabled,
  activeIndex,
  maxIndex,
  onSwipe,
  getBaseTranslate
}: UseSwipeGestureProps) => {
  const swipeRef = useRef<SwipeState>({
    startX: 0,
    startY: 0,
    currentX: 0,
    isDragging: false,
    didMove: false,
    baseTranslateX: 0,
  });
  
  const [swipeOffset, setSwipeOffset] = useState(0);

  const handleSwipeStart = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    if (!enabled) return;
    const touch = e.touches[0];
    swipeRef.current = {
      startX: touch.clientX,
      startY: touch.clientY,
      currentX: touch.clientX,
      isDragging: true,
      didMove: false,
      baseTranslateX: getBaseTranslate(activeIndex),
    };
  }, [enabled, activeIndex, getBaseTranslate]);

  const handleSwipeMove = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    if (!enabled || !swipeRef.current.isDragging) return;
    const touch = e.touches[0];
    const dx = touch.clientX - swipeRef.current.startX;
    const dy = touch.clientY - swipeRef.current.startY;

    // First move: lock direction
    if (!swipeRef.current.didMove) {
      if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return; // dead-zone
      if (Math.abs(dy) > Math.abs(dx)) {
        // Vertical scroll wins → abort swipe
        swipeRef.current.isDragging = false;
        setSwipeOffset(0);
        return;
      }
      swipeRef.current.didMove = true;
      e.preventDefault(); // lock to horizontal
    }

    e.preventDefault();
    swipeRef.current.currentX = touch.clientX;

    // Rubber-band at edges
    const atStart = activeIndex === 1 && dx > 0;
    const atEnd = activeIndex === maxIndex && dx < 0;
    const dampened = (atStart || atEnd) ? dx * 0.25 : dx;

    setSwipeOffset(dampened);
  }, [enabled, activeIndex, maxIndex]);

  const handleSwipeEnd = useCallback(() => {
    if (!enabled || !swipeRef.current.isDragging) return;
    swipeRef.current.isDragging = false;

    const dx = swipeRef.current.currentX - swipeRef.current.startX;
    const THRESHOLD = 50; // px needed to commit a swipe

    if (dx < -THRESHOLD && activeIndex < maxIndex) {
      onSwipe('left');
    } else if (dx > THRESHOLD && activeIndex > 1) {
      onSwipe('right');
    }
    
    setSwipeOffset(0);
  }, [enabled, activeIndex, maxIndex, onSwipe]);

  return {
    swipeOffset,
    swipeRef,
    handlers: {
      onTouchStart: handleSwipeStart,
      onTouchMove: handleSwipeMove,
      onTouchEnd: handleSwipeEnd,
      onTouchCancel: handleSwipeEnd,
    }
  };
};