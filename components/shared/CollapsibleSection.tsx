'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

// Global memory cache to preserve expanded state across page navigations
const expandedCache: Record<string, boolean> = {};

interface CollapsibleSectionProps {
  title: string;
  icon?: React.ReactNode;
  defaultOpen?: boolean;
  children: React.ReactNode;
  className?: string;
  cacheKey?: string;
}

export default function CollapsibleSection({ 
  title, 
  icon, 
  defaultOpen = false, 
  children,
  className,
  cacheKey
}: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(() => {
    if (cacheKey) {
      return expandedCache[cacheKey] || defaultOpen;
    }
    return defaultOpen;
  });

  const handleToggle = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    if (cacheKey) {
      expandedCache[cacheKey] = newState;
    }
  };

  return (
    <div className={cn('border border-border rounded-lg bg-card overflow-hidden', className)}>
      <button
        onClick={handleToggle}
        className="w-full flex items-center gap-2 px-4 py-3 text-sm font-medium text-foreground hover:bg-muted/50 transition-colors text-left"
      >
        {isOpen ? (
          <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
        ) : (
          <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
        )}
        {icon && <span className="shrink-0">{icon}</span>}
        <span>{title}</span>
      </button>
      {isOpen && (
        <div className="border-t border-border p-4">
          {children}
        </div>
      )}
    </div>
  );
}