'use client';

import { useReadingSession } from '@/lib/hooks/useReadingSession';

interface ReadingSessionTrackerProps {
  href: string;
  name: string;
  type: string;
  category?: string;
}

export default function ReadingSessionTracker({ href, name, type, category }: ReadingSessionTrackerProps) {
  useReadingSession({ href, name, type, category });
  return null;
}
