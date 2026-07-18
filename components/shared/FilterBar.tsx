'use client';

import { cn } from '@/lib/utils';

interface FilterBarProps {
  label: string;
  options: string[];
  selectedOptions: string[];
  onToggle: (option: string) => void;
  onClear: () => void;
}

export default function FilterBar({
  label,
  options,
  selectedOptions,
  onToggle,
  onClear,
}: FilterBarProps) {
  return (
    <div className="bg-card text-card-foreground border border-border rounded-lg p-3 flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-2 sm:gap-3 select-none text-xs">
      <span className="font-semibold text-muted-foreground font-sans sm:shrink-0">{label}:</span>
      <div className="flex flex-wrap gap-1.5 flex-1">
        {options.map((opt) => {
          const active = selectedOptions.includes(opt);
          return (
            <button
              key={opt}
              onClick={() => onToggle(opt)}
              className={cn(
                "px-2.5 py-1.5 rounded border text-[10px] font-medium cursor-pointer select-none touch-target",
                active
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-secondary text-secondary-foreground border-border hover:bg-muted"
              )}
            >
              {opt}
            </button>
          );
        })}
      </div>
      {selectedOptions.length > 0 && (
        <button
          onClick={onClear}
          className="text-[10px] text-rose-500 hover:text-rose-600 font-semibold cursor-pointer touch-target sm:shrink-0"
        >
          Clear Filters ({selectedOptions.length})
        </button>
      )}
    </div>
  );
}