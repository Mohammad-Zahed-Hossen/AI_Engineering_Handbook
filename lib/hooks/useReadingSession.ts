'use client';

import { useEffect, useRef } from 'react';
import { saveContinueReading } from '@/lib/session-tracking';

const QUALIFY_DWELL_MS = 45_000; // 45 seconds
const QUALIFY_SCROLL_PCT = 15; // 15% scroll

interface UseReadingSessionProps {
  href: string;
  name: string;
  type: string;
  category?: string;
}

export function useReadingSession({ href, name, type, category }: UseReadingSessionProps): void {
  const startTimeRef = useRef<number>(0);
  const maxScrollPercentRef = useRef<number>(0);

  useEffect(() => {
    // Record start time on mount
    startTimeRef.current = Date.now();
    maxScrollPercentRef.current = 0;

    // Throttled scroll handler
    let scrollTimeout: NodeJS.Timeout | null = null;
    const handleScroll = () => {
      if (scrollTimeout) return;
      
      scrollTimeout = setTimeout(() => {
        const scrollY = window.scrollY;
        const scrollHeight = document.documentElement.scrollHeight;
        const clientHeight = document.documentElement.clientHeight;
        
        if (scrollHeight > clientHeight) {
          const scrollPercent = (scrollY / (scrollHeight - clientHeight)) * 100;
          if (scrollPercent > maxScrollPercentRef.current) {
            maxScrollPercentRef.current = scrollPercent;
          }
        }
        
        scrollTimeout = null;
      }, 1000);
    };

    // Add passive scroll listener
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Handler for visibility change and beforeunload
    const handleSave = () => {
      const dwellMs = Date.now() - startTimeRef.current;
      
      if (dwellMs >= QUALIFY_DWELL_MS && maxScrollPercentRef.current >= QUALIFY_SCROLL_PCT) {
        saveContinueReading({
          href,
          name,
          type,
          category,
          timestamp: Date.now(),
          scrollY: window.scrollY,
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
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleSave);
      if (scrollTimeout) clearTimeout(scrollTimeout);
    };
  }, [href, name, type, category]);
}
