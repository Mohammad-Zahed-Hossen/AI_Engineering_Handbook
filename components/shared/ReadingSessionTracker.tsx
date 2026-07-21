'use client';

import { useReadingSession } from '@/lib/hooks/useReadingSession';
import { recordVisit } from '@/lib/dashboard-state';
import { useEffect } from 'react';

interface ReadingSessionTrackerProps {
  id: string;
  href: string;
  name: string;
  type: 'package' | 'model' | 'workflow' | 'cheatsheet' | 'pattern' | 'debug_guide' | 'decision_guide' | 'principle' | 'registry';
  category?: string;
}

export default function ReadingSessionTracker({ id, href, name, type, category }: ReadingSessionTrackerProps) {
  useReadingSession({ href, name, type, category });
  
  // Record visit for history/frequently used tracking
  useEffect(() => {
    recordVisit({ type, id, name, href });
  }, [type, id, name, href]);
  
  return null;
}