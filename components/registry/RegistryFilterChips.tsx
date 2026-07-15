'use client';

import { cn } from '@/lib/utils';

interface RegistryFilterChipsProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  availableFilters: string[];
}

export default function RegistryFilterChips({
  activeFilter,
  onFilterChange,
  availableFilters,
}: RegistryFilterChipsProps) {
  // Generate filter chips dynamically from data + static "All"
  const filters = ['All', ...availableFilters.filter(f => f !== 'All')];

  return (
    <div className="flex flex-wrap items-center gap-1.5 select-none">
      {filters.map((filter) => {
        const isActive = activeFilter === filter;
        return (
          <button
            key={filter}
            onClick={() => onFilterChange(filter)}
            className={cn(
              'px-2.5 py-1 rounded-full text-[10px] font-medium transition-colors border',
              isActive
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-secondary text-secondary-foreground border-border hover:bg-muted'
            )}
          >
            {filter}
          </button>
        );
      })}
    </div>
  );
}