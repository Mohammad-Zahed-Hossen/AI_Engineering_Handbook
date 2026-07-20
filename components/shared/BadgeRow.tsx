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
          className="inline-flex items-center gap-0.5 rounded border border-border bg-muted/30 px-1.5 py-0.5 text-[9px] font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
          aria-expanded={expanded}
          aria-label={expanded ? 'Show less items' : `Show ${children.length - mobileDefault} more items`}
        >
          {expanded ? (
            <>
              <ChevronUp className="w-2.5 h-2.5" />
              less
            </>
          ) : (
            <>
              <ChevronDown className="w-2.5 h-2.5" />
              +{children.length - mobileDefault}
            </>
          )}
        </button>
      )}
    </div>
  );
}