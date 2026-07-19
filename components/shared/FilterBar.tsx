'use client';

import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FilterBarProps {
  label: string;
  options: string[];
  selectedOptions: string[];
  onToggle: (option: string) => void;
  onClear: () => void;
  compact?: boolean;
  showLabel?: boolean;
  horizontal?: boolean;
}

export default function FilterBar({
  label,
  options,
  selectedOptions,
  onToggle,
  onClear,
  compact = false,
  showLabel = true,
  horizontal = false,
}: FilterBarProps) {
  const hasActiveFilters = selectedOptions.length > 0;
  
  if (horizontal) {
    // Horizontal chip-only layout for compact toolbar
    return (
      <div className="flex flex-wrap items-center gap-1">
        {showLabel && (
          <span className="text-[11px] font-medium text-muted-foreground shrink-0 mr-1">
            {label}
          </span>
        )}
        {options.map((opt) => {
          const active = selectedOptions.includes(opt);
          return (
            <button
              key={opt}
              onClick={() => onToggle(opt)}
              className={cn(
                "px-2 py-1.5 rounded-md border text-[11px] font-medium cursor-pointer select-none touch-target transition-all",
                "min-h-[36px] min-w-[36px] flex items-center justify-center",
                active
                  ? "bg-primary text-primary-foreground border-primary shadow-sm"
                  : "bg-secondary/50 text-secondary-foreground border-border hover:bg-secondary hover:border-border/80"
              )}
            >
              {opt}
            </button>
          );
        })}
      </div>
    );
  }
  
  return (
    <div className={cn(
      "bg-card text-card-foreground border border-border rounded-lg",
      compact ? "p-2" : "p-2.5 min-[360px]:p-3",
      "flex flex-col gap-2"
    )}>
      {/* Header with label and clear button */}
      <div className="flex items-center justify-between gap-2">
        {showLabel && (
          <span className="text-xs font-semibold text-muted-foreground font-sans shrink-0">
            {label}
          </span>
        )}
        {hasActiveFilters && (
          <button
            onClick={onClear}
            className="flex items-center gap-1.5 text-xs font-medium text-rose-500 hover:text-rose-600 transition-colors touch-target"
          >
            <X className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Clear</span>
            <span className="sm:hidden">({selectedOptions.length})</span>
          </button>
        )}
      </div>
      
      {/* Filter chips */}
      <div className="flex flex-wrap gap-1.5">
        {options.map((opt) => {
          const active = selectedOptions.includes(opt);
          return (
            <button
              key={opt}
              onClick={() => onToggle(opt)}
              className={cn(
                "px-3 py-2 rounded-md border text-xs font-medium cursor-pointer select-none touch-target transition-all",
                "min-h-[44px] min-w-[44px] flex items-center justify-center",
                active
                  ? "bg-primary text-primary-foreground border-primary shadow-sm"
                  : "bg-secondary/50 text-secondary-foreground border-border hover:bg-secondary hover:border-border/80"
              )}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}