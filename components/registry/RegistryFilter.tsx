'use client';

import { useState, useEffect } from 'react';
import { RegistryBadge } from './RegistryBadge';
import { PARAMETER_RANGES, CONTEXT_RANGES, GPU_RANGES, SORT_OPTIONS } from '@/lib/registry-constants';

interface RegistryFilterProps {
  onFilterChange: (filters: RegistryFilters) => void;
  families: string[];
}

export interface RegistryFilters {
  minParams?: number;
  maxParams?: number;
  minContext?: number;
  maxContext?: number;
  minGpu?: number;
  maxGpu?: number;
  productionReady?: boolean;
  commercialUse?: boolean;
  family?: string;
  sort?: string;
}

/**
 * Faceted search filter component for registry pages.
 * Allows filtering by parameters, context window, GPU memory, production status, and family.
 */
export default function RegistryFilter({ onFilterChange, families }: RegistryFilterProps) {
  const [filters, setFilters] = useState<RegistryFilters>({});

  useEffect(() => {
    onFilterChange(filters);
  }, [filters, onFilterChange]);

  const updateFilter = (key: keyof RegistryFilters, value: string | number | boolean | undefined) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({});
  };

  const getActiveFilterLabels = () => {
    const labels: string[] = [];
    
    if (filters.minParams || filters.maxParams) {
      const range = PARAMETER_RANGES.find(r => 
        r.min === filters.minParams && r.max === filters.maxParams
      );
      if (range) labels.push(`Params: ${range.label}`);
    }
    
    if (filters.minContext || filters.maxContext) {
      const range = CONTEXT_RANGES.find(r => 
        r.min === filters.minContext && r.max === filters.maxContext
      );
      if (range) labels.push(`Context: ${range.label}`);
    }
    
    if (filters.minGpu || filters.maxGpu) {
      const range = GPU_RANGES.find(r => 
        r.min === filters.minGpu && r.max === filters.maxGpu
      );
      if (range) labels.push(`GPU: ${range.label}`);
    }
    
    if (filters.productionReady !== undefined) {
      labels.push(`Production: ${filters.productionReady ? 'Yes' : 'No'}`);
    }
    
    if (filters.commercialUse !== undefined) {
      labels.push(`Commercial: ${filters.commercialUse ? 'Yes' : 'No'}`);
    }
    
    if (filters.family) {
      labels.push(`Family: ${filters.family}`);
    }
    
    return labels;
  };

  return (
    <div className="space-y-4">
      {/* Active Filters */}
      {getActiveFilterLabels().length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
            Active Filters:
          </span>
          {getActiveFilterLabels().map(label => (
            <RegistryBadge key={label} variant="secondary" size="xs" className="font-mono">
              {label}
            </RegistryBadge>
          ))}
          <button
            onClick={clearFilters}
            className="text-[10px] text-primary hover:underline font-medium"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Filter Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Parameter Count Filter */}
        <div className="space-y-1">
          <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
            Parameters
          </div>
          <div className="flex flex-wrap gap-1">
            {PARAMETER_RANGES.map(range => (
              <button
                key={range.label}
                onClick={() => updateFilter('minParams', range.min)}
                onClickCapture={() => updateFilter('maxParams', range.max)}
                className={`text-[10px] px-2 py-0.5 rounded border font-mono transition-colors ${
                  filters.minParams === range.min && filters.maxParams === range.max
                    ? 'bg-primary/10 border-primary text-primary'
                    : 'border-border hover:bg-muted/50'
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>

        {/* Context Window Filter */}
        <div className="space-y-1">
          <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
            Context Window
          </div>
          <div className="flex flex-wrap gap-1">
            {CONTEXT_RANGES.map(range => (
              <button
                key={range.label}
                onClick={() => {
                  updateFilter('minContext', range.min);
                  updateFilter('maxContext', range.max);
                }}
                className={`text-[10px] px-2 py-0.5 rounded border font-mono transition-colors ${
                  filters.minContext === range.min && filters.maxContext === range.max
                    ? 'bg-primary/10 border-primary text-primary'
                    : 'border-border hover:bg-muted/50'
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>

        {/* GPU Memory Filter */}
        <div className="space-y-1">
          <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
            Min GPU
          </div>
          <div className="flex flex-wrap gap-1">
            {GPU_RANGES.map(range => (
              <button
                key={range.label}
                onClick={() => {
                  updateFilter('minGpu', range.min);
                  updateFilter('maxGpu', range.max);
                }}
                className={`text-[10px] px-2 py-0.5 rounded border font-mono transition-colors ${
                  filters.minGpu === range.min && filters.maxGpu === range.max
                    ? 'bg-primary/10 border-primary text-primary'
                    : 'border-border hover:bg-muted/50'
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>

        {/* Sort Filter */}
        <div className="space-y-1">
          <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
            Sort By
          </div>
          <select
            value={filters.sort || 'relevance'}
            onChange={e => updateFilter('sort', e.target.value)}
            className="text-[10px] px-2 py-1 rounded border border-border bg-background font-mono"
          >
            {SORT_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Status Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
          Status:
        </span>
        <button
          onClick={() => updateFilter('productionReady', true)}
          className={`text-[10px] px-2 py-0.5 rounded border font-mono transition-colors ${
            filters.productionReady === true
              ? 'bg-emerald-500/10 border-emerald-500 text-emerald-600'
              : 'border-border hover:bg-muted/50'
          }`}
        >
          Production Ready
        </button>
        <button
          onClick={() => updateFilter('commercialUse', true)}
          className={`text-[10px] px-2 py-0.5 rounded border font-mono transition-colors ${
            filters.commercialUse === true
              ? 'bg-indigo-500/10 border-indigo-500 text-indigo-600'
              : 'border-border hover:bg-muted/50'
          }`}
        >
          Commercial Use
        </button>
      </div>

      {/* Family Filter */}
      {families.length > 0 && (
        <div className="space-y-1">
          <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
            Family
          </div>
          <div className="flex flex-wrap gap-1">
            {families.map(family => (
              <button
                key={family}
                onClick={() => updateFilter('family', family)}
                className={`text-[10px] px-2 py-0.5 rounded border font-mono transition-colors ${
                  filters.family === family
                    ? 'bg-primary/10 border-primary text-primary'
                    : 'border-border hover:bg-muted/50'
                }`}
              >
                {family}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}