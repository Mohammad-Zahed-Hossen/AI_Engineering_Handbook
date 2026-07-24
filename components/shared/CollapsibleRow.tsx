'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CollapsibleRowProps {
  id: string;
  label: React.ReactNode;
  teaser?: React.ReactNode;
  icon?: React.ReactNode;
  children: React.ReactNode;
  
  // Controlled props (optional)
  open?: boolean;
  onToggle?: () => void;
  
  // Hash deep-link config
  enableHashDeepLink?: boolean;
  
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
  align?: 'center' | 'start';
}

export default function CollapsibleRow({
  id,
  label,
  teaser,
  icon,
  children,
  open: controlledOpen,
  onToggle: controlledOnToggle,
  enableHashDeepLink = false,
  className,
  headerClassName,
  contentClassName,
  align = 'center',
}: CollapsibleRowProps) {
  const [localOpen, setLocalOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : localOpen;
  const contentRef = useRef<HTMLDivElement>(null);
  
  const handleToggle = useCallback(() => {
    if (isControlled && controlledOnToggle) {
      controlledOnToggle();
    } else {
      setLocalOpen(prev => !prev);
    }
  }, [isControlled, controlledOnToggle]);

  // Attach onBeforeMatch handler imperatively
  useEffect(() => {
    const element = contentRef.current;
    if (element && !isOpen) {
      const handleBeforeMatch = handleToggle;
      element.addEventListener('beforematch', handleBeforeMatch as unknown as EventListener);
      return () => element.removeEventListener('beforematch', handleBeforeMatch as unknown as EventListener);
    }
  }, [isOpen, handleToggle]);

  useEffect(() => {
    if (!enableHashDeepLink) return;

    const expandFromHash = () => {
      const hash = window.location.hash.replace('#', '');
      // Match exact id or prefix (e.g., #production-cost matches #production)
      if (hash === id || hash.startsWith(id + '-')) {
        if (isControlled && controlledOnToggle && !controlledOpen) {
          controlledOnToggle();
        } else if (!isControlled) {
          setLocalOpen(true);
        }

        setTimeout(() => {
          document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    };

    expandFromHash();
    window.addEventListener('hashchange', expandFromHash);
    return () => window.removeEventListener('hashchange', expandFromHash);
  }, [id, enableHashDeepLink, isControlled, controlledOpen, controlledOnToggle]);

  const contentId = `${id}-content`;

  return (
    <section
      id={id}
      className={cn("scroll-mt-24 border border-border rounded-lg bg-card overflow-hidden", className)}
    >
      <button
        onClick={handleToggle}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleToggle();
          }
        }}
        className={cn(
          "w-full flex justify-between px-3.5 py-2.5 sm:px-4 sm:py-3 bg-muted/20 hover:bg-muted/40 transition-colors select-none text-left cursor-pointer touch-target",
          align === 'center' ? 'items-center' : 'items-start',
          headerClassName
        )}
        aria-expanded={isOpen}
        aria-controls={contentId}
      >
        <div className="flex items-start gap-2 flex-1 min-w-0">
          {icon && <span className="shrink-0">{icon}</span>}
          <div className="flex flex-col flex-1 min-w-0">
            {typeof label === 'string' ? (
              <h2 className="text-sm font-bold text-foreground font-sans m-0 leading-tight">{label}</h2>
            ) : (
              label
            )}
            {teaser && (
              <div className="text-[10px] text-muted-foreground mt-0.5 leading-tight">
                {teaser}
              </div>
            )}
          </div>
        </div>
        <div className={cn("shrink-0 ml-1.5", align === 'start' ? 'mt-0.5' : '')}>
          {isOpen ? (
            <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
          ) : (
            <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
          )}
        </div>
      </button>
      <div
        ref={contentRef}
        id={contentId}
        className={cn(
          "bg-card",
          contentClassName?.includes('border-t-0') ? '' : 'border-t border-border',
          contentClassName
        )}
        hidden={!isOpen}
      >
        {children}
      </div>
    </section>
  );
}