'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

export default function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const mainElement = document.getElementById('main-scroll');
    if (!mainElement) return;

    const updateProgress = () => {
      const scrollTop = mainElement.scrollTop;
      const scrollHeight = mainElement.scrollHeight - mainElement.clientHeight;
      const percent = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
      setProgress(Math.min(100, Math.max(0, percent)));
    };

    mainElement.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
    return () => mainElement.removeEventListener('scroll', updateProgress);
  }, []);

  return (
    <div
      className={cn(
        "fixed top-0 left-0 right-0 z-50 h-[2px] bg-primary/10 transition-opacity duration-300",
        progress > 0 && progress < 100 ? "opacity-100" : "opacity-0"
      )}
      aria-hidden="true"
    >
      <div
        className="h-full bg-primary transition-[width] duration-150 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
