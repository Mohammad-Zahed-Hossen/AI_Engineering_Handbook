'use client';

import { Search, X, Filter } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface SearchFilterToolbarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  children: React.ReactNode;
  showClearSearch?: boolean;
  activeFilters?: { label: string; value: string; onRemove: () => void }[];
  onClearAll?: () => void;
  resultCount?: number;
  totalCount?: number;
  moreFiltersContent?: React.ReactNode;
}

export default function SearchFilterToolbar({
  searchQuery,
  onSearchChange,
  searchPlaceholder = 'Search models by name, subcategory, problem type, or description...',
  children,
  showClearSearch = true,
  activeFilters = [],
  onClearAll,
  resultCount,
  totalCount,
  moreFiltersContent,
}: SearchFilterToolbarProps) {
  const hasSearch = searchQuery.length > 0;
  const hasActiveFilters = activeFilters.length > 0;
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const hasMoreFilters = Boolean(moreFiltersContent);

  return (
    <div className="space-y-2.5">
      {/* Unified search bar with results count and More Filters */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-10 py-2 text-sm bg-card text-card-foreground border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring/40 focus:border-ring touch-target min-h-[44px]"
          />
          {hasSearch && showClearSearch && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors touch-target p-1"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        {hasMoreFilters && (
          <button
            onClick={() => setShowMoreFilters(!showMoreFilters)}
            className={cn(
              "flex items-center justify-center px-3 py-2 text-sm font-medium border rounded-lg touch-target min-h-[44px] min-w-[44px] transition-colors shrink-0",
              showMoreFilters
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card text-card-foreground border-border hover:bg-muted"
            )}
            aria-expanded={showMoreFilters}
            aria-label={showMoreFilters ? 'Hide more filters' : 'Show more filters'}
          >
            <Filter className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Results count and active filters in one row */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        {(resultCount !== undefined || totalCount !== undefined) && (
          <div className="text-[11px] text-muted-foreground">
            {resultCount !== undefined && totalCount !== undefined ? (
              <span>
                <strong className="text-foreground">{resultCount}</strong> / {totalCount}
              </span>
            ) : resultCount !== undefined ? (
              <span>
                <strong className="text-foreground">{resultCount}</strong> models
              </span>
            ) : null}
          </div>
        )}
        {hasActiveFilters && onClearAll && (
          <button
            onClick={onClearAll}
            className="text-[11px] font-medium text-rose-500 hover:text-rose-600 transition-colors touch-target px-2 py-1"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Active filter chips */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-1">
          {activeFilters.map((filter, idx) => (
            <button
              key={idx}
              onClick={filter.onRemove}
              className="inline-flex items-center gap-1.5 px-2 py-1 text-[11px] font-medium bg-primary/10 text-primary border border-primary/20 rounded-md hover:bg-primary/20 transition-colors touch-target min-h-[32px]"
            >
              {filter.label}
              <X className="h-3 w-3 shrink-0" />
            </button>
          ))}
        </div>
      )}

      {/* Primary filter section */}
      {children && (
        <div className="space-y-1.5">
          {children}
        </div>
      )}

      {/* More filters collapsible section */}
      {hasMoreFilters && showMoreFilters && (
        <div className="pt-2 mt-2 border-t border-border/60 space-y-1.5 animate-in fade-in slide-in-from-top-2">
          {moreFiltersContent}
        </div>
      )}
    </div>
  );
}
