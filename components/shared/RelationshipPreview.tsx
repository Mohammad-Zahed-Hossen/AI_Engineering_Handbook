'use client';

import { useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import ContentTypeBadge from './ContentTypeBadge';

interface RelationshipPreviewProps {
  name: string;
  type: string;
  description?: string;
  href: string;
  children: React.ReactNode;
}

export default function RelationshipPreview({ name, type, description, href, children }: RelationshipPreviewProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = useCallback(() => {
    timeoutRef.current = setTimeout(() => setShowTooltip(true), 300);
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setShowTooltip(false);
  }, []);

  const handleFocus = useCallback(() => setShowTooltip(true), []);
  const handleBlur = useCallback(() => setShowTooltip(false), []);

  return (
    <div className="relative inline-flex" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <Link
        href={href}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className="focus:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 rounded"
        aria-describedby={showTooltip ? `preview-${name}` : undefined}
      >
        {children}
      </Link>
      {showTooltip && (
        <div
          id={`preview-${name}`}
          role="tooltip"
          className={cn(
            'absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50',
            'min-w-[180px] max-w-[260px] p-3 rounded-lg',
            'bg-popover border border-border shadow-lg',
            'text-left pointer-events-none'
          )}
        >
          <div className="flex items-center gap-1.5 mb-1">
              <ContentTypeBadge type={type} className="px-1 py-0 text-[8px]" />
            <span className="text-xs font-semibold text-foreground truncate">{name}</span>
          </div>
          {description && (
            <p className="text-[10px] text-muted-foreground line-clamp-2 leading-relaxed">
              {description}
            </p>
          )}
          <div className="mt-1 text-[9px] text-muted-foreground/60 uppercase tracking-wider">
            Click to navigate
          </div>
        </div>
      )}
    </div>
  );
}