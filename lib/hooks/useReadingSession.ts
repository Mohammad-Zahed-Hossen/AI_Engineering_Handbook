'use client';

import { useEffect, useRef } from 'react';
import { saveContinueReading } from '@/lib/session-tracking';

const QUALIFY_DWELL_MS = 45_000; // 45 seconds
const QUALIFY_SCROLL_PCT = 15; // 15% scroll
const COMPLETED_SCROLL_PCT = 90; // 90% scroll - treat as completed

interface UseReadingSessionProps {
  href: string;
  name: string;
  type: string;
  category?: string;
}

export function useReadingSession({ href, name, type, category }: UseReadingSessionProps): void {
  const startTimeRef = useRef<number>(0);
  const maxScrollPercentRef = useRef<number>(0);
  const mainElementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    // Get the main scroll container element
    const mainElement = document.getElementById('main-scroll');
    mainElementRef.current = mainElement;

    // Record start time on mount
    startTimeRef.current = Date.now();
    maxScrollPercentRef.current = 0;

    // Throttled scroll handler
    let scrollTimeout: NodeJS.Timeout | null = null;
    const handleScroll = () => {
      if (scrollTimeout) return;
      
      scrollTimeout = setTimeout(() => {
        // Use the main scroll container if available, otherwise fall back to window
        const scrollElement = mainElementRef.current || document.documentElement;
        const scrollY = mainElementRef.current ? mainElementRef.current.scrollTop : window.scrollY;
        const scrollHeight = scrollElement.scrollHeight;
        const clientHeight = mainElementRef.current ? mainElementRef.current.clientHeight : window.innerHeight;
        
        if (scrollHeight > clientHeight) {
          const scrollPercent = (scrollY / (scrollHeight - clientHeight)) * 100;
          if (scrollPercent > maxScrollPercentRef.current) {
            maxScrollPercentRef.current = scrollPercent;
          }
        }
        
        scrollTimeout = null;
      }, 1000);
    };

    // Add scroll listener to the main scroll container (or window as fallback)
    if (mainElement) {
      mainElement.addEventListener('scroll', handleScroll, { passive: true });
    } else {
      window.addEventListener('scroll', handleScroll, { passive: true });
    }

    // Handler for visibility change and beforeunload
    const handleSave = () => {
      const dwellMs = Date.now() - startTimeRef.current;
      
      // Only save if user has spent enough time AND scrolled enough, but hasn't completed the page
      if (dwellMs >= QUALIFY_DWELL_MS && 
          maxScrollPercentRef.current >= QUALIFY_SCROLL_PCT && 
          maxScrollPercentRef.current < COMPLETED_SCROLL_PCT) {
        const currentScrollY = mainElementRef.current ? mainElementRef.current.scrollTop : window.scrollY;
        saveContinueReading({
          href,
          name,
          type,
          category,
          timestamp: Date.now(),
          scrollY: currentScrollY,
          scrollPercent: maxScrollPercentRef.current,
          dwellMs,
        });
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        handleSave();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleSave);

    // Cleanup
    return () => {
      if (mainElement) {
        mainElement.removeEventListener('scroll', handleScroll);
      } else {
        window.removeEventListener('scroll', handleScroll);
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleSave);
      if (scrollTimeout) clearTimeout(scrollTimeout);
    };
  }, [href, name, type, category]);
}
