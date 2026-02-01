import { useEffect, useRef } from 'react';

interface UseCardPositioningProps {
  containerRef: React.RefObject<HTMLDivElement>;
  cardsRef: React.RefObject<(HTMLDivElement | null)[]>;
  activeIndex: number;
  isMobile: boolean;
  swipeOffset?: number;
}

export const useCardPositioning = ({
  containerRef,
  cardsRef,
  activeIndex,
  isMobile,
  swipeOffset = 0
}: UseCardPositioningProps) => {
  const positionTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (positionTimeoutRef.current) {
      cancelAnimationFrame(positionTimeoutRef.current);
    }

    positionTimeoutRef.current = requestAnimationFrame(() => {
      const container = containerRef.current;
      const cards = cardsRef.current?.filter(Boolean);
      
      if (!container || !cards || cards.length === 0) return;

      if (isMobile) {
        // If user is mid-swipe, don't fight them
        if (swipeOffset !== 0) return;

        const cardWidth = 280;
        const gap = 40;
        const containerWidth = window.innerWidth - 32;
        const centerPosition = containerWidth / 2;
        
        const cardArrayIndex = activeIndex - 1;
        const offsetToCard = cardArrayIndex * (cardWidth + gap);
        const targetX = -offsetToCard + centerPosition - (cardWidth / 2);
        
        container.style.transition = 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        container.style.transform = `translate3d(${targetX}px, 0, 0)`;
      } else {
        // Desktop layout
        const cardWidth = 400;
        const gap = 80;
        
        const rightPadding = window.innerWidth >= 1024 ? 64 : 32;
        const rightContainerWidth = (window.innerWidth * 0.5) - rightPadding;
        const centerPosition = rightContainerWidth / 2;
        
        const cardArrayIndex = activeIndex - 1;
        const offsetToCard = cardArrayIndex * (cardWidth + gap);
        const targetX = -offsetToCard + centerPosition - (cardWidth / 2);
        
        container.style.transition = 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        container.style.transform = `translate3d(${targetX}px, 0, 0)`;
      }
      
      // Scale cards based on distance from active
      cards.forEach((card, index) => {
        if (!card) return;
        
        const cardNumber = index + 1;
        let scale: number;
        
        if (cardNumber === activeIndex) {
          scale = isMobile ? 1.05 : 1.1;
        } else if (Math.abs(cardNumber - activeIndex) === 1) {
          scale = isMobile ? 0.92 : 0.95;
        } else {
          scale = isMobile ? 0.82 : 0.85;
        }
        
        card.style.transition = 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        card.style.transform = `scale(${scale})`;
      });
    });

    return () => {
      if (positionTimeoutRef.current) {
        cancelAnimationFrame(positionTimeoutRef.current);
      }
    };
  }, [containerRef, cardsRef, activeIndex, isMobile, swipeOffset]);
};