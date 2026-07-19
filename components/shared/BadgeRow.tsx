'use client';

import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface BadgeRowProps {
  children: React.ReactNode[];
  defaultVisible?: number;
  className?: string;
}

export function BadgeRow({ children, defaultVisible = 8, className = '' }: BadgeRowProps) {
  const [expanded, setExpanded] = useState(false);
  // Use smaller default on mobile (320-390px screens)
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 390);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  const mobileDefault = isMobile ? 4 : defaultVisible;
  const showMore = children.length > mobileDefault;
  const visibleChildren = expanded ? children : children.slice(0, mobileDefault);

  return (
    <div className={`flex flex-wrap gap-1.5 items-center ${className}`}>
      {visibleChildren}
      {showMore && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="inline-flex items-center gap-1 rounded border border-border bg-muted/40 px-2.5 py-1.5 text-[9px] font-medium text-foreground hover:bg-muted hover:border-foreground/20 transition-colors select-none cursor-pointer touch-target"
        >
          {expanded ? (
            <>
              <ChevronUp className="w-3 h-3" />
              Show less
            </>
          ) : (
            <>
              <ChevronDown className="w-3 h-3" />
              +{children.length - mobileDefault} more
            </>
          )}
        </button>
      )}
    </div>
  );
}
