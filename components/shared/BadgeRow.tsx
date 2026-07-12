'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface BadgeRowProps {
  children: React.ReactNode[];
  defaultVisible?: number;
  className?: string;
}

export function BadgeRow({ children, defaultVisible = 8, className = '' }: BadgeRowProps) {
  const [expanded, setExpanded] = useState(false);
  const showMore = children.length > defaultVisible;
  const visibleChildren = expanded ? children : children.slice(0, defaultVisible);

  return (
    <div className={`flex flex-wrap gap-1.5 items-center ${className}`}>
      {visibleChildren}
      {showMore && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="inline-flex items-center gap-1 rounded border border-border bg-muted/40 px-1.5 py-0.5 text-[9px] font-medium text-foreground hover:bg-muted hover:border-foreground/20 transition-colors select-none cursor-pointer"
        >
          {expanded ? (
            <>
              <ChevronUp className="w-3 h-3" />
              Show less
            </>
          ) : (
            <>
              <ChevronDown className="w-3 h-3" />
              +{children.length - defaultVisible} more
            </>
          )}
        </button>
      )}
    </div>
  );
}
