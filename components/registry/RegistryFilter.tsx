'use client';

import { useState, useEffect } from 'react';
import { RegistryBadge } from './RegistryBadge';
import { cn } from '@/lib/utils';

interface RegistryFilterProps {
  onFilterChange: (filters: RegistryFilters) => void;
  families: string[];
}

export interface RegistryFilters {
  productionReady?: boolean;
  commercialUse?: boolean;
  family?: string;
  modality?: string;
  reasoning?: boolean;
  vision?: boolean;
  tool_calling?: boolean;
}

/**
 * Faceted search filter component for registry pages.
 * Allows filtering by production status, commercial use, and family.
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
    
    if (filters.productionReady !== undefined) {
      labels.push(`Production: ${filters.productionReady ? 'Yes' : 'No'}`);
    }
    
    if (filters.commercialUse !== undefined) {
      labels.push(`Commercial: ${filters.commercialUse ? 'Yes' : 'No'}`);
    }
    
    if (filters.family) {
      labels.push(`Family: ${filters.family}`);
    }
    
    if (filters.modality) {
      labels.push(`Modality: ${filters.modality}`);
    }
    
    if (filters.reasoning !== undefined) {
      labels.push(`Reasoning: ${filters.reasoning ? 'Yes' : 'No'}`);
    }
    
    if (filters.vision !== undefined) {
      labels.push(`Vision: ${filters.vision ? 'Yes' : 'No'}`);
    }
    
    if (filters.tool_calling !== undefined) {
      labels.push(`Tool Calling: ${filters.tool_calling ? 'Yes' : 'No'}`);
    }
    
    return labels;
  };

  return (
    <div className="space-y-4">
      {/* Active Filters */}
      {getActiveFilterLabels().length > 0 && (
        <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-2">
          <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider sm:shrink-0">
            Active Filters:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {getActiveFilterLabels().map(label => (
              <RegistryBadge key={label} variant="secondary" size="xs" className="font-mono">
                {label}
              </RegistryBadge>
            ))}
          </div>
          <button
            onClick={clearFilters}
            className="text-[10px] text-primary hover:underline font-medium touch-target-sm sm:shrink-0"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Status Filters */}
      <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-2">
        <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider sm:shrink-0">
          Status:
        </span>
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => updateFilter('productionReady', true)}
            className={cn(
              "text-[10px] px-2.5 py-1 rounded border font-mono transition-colors touch-target-sm",
              filters.productionReady === true
                ? 'bg-emerald-500/10 border-emerald-500 text-emerald-600'
                : 'border-border hover:bg-muted/50'
            )}
          >
            Production Ready
          </button>
          <button
            onClick={() => updateFilter('commercialUse', true)}
            className={cn(
              "text-[10px] px-2.5 py-1 rounded border font-mono transition-colors touch-target-sm",
              filters.commercialUse === true
                ? 'bg-indigo-500/10 border-indigo-500 text-indigo-600'
                : 'border-border hover:bg-muted/50'
            )}
          >
            Commercial Use
          </button>
        </div>
      </div>

      {/* Modality Filter */}
      <div className="space-y-1">
        <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
          Modality
        </div>
        <div className="flex flex-wrap gap-1.5">
          {(['llm', 'embedding', 'reranker', 'vision', 'speech', 'multimodal'] as const).map(m => (
            <button
              key={m}
              onClick={() => updateFilter('modality', m)}
              className={cn(
                "text-[10px] px-2.5 py-1 rounded border font-mono transition-colors touch-target-sm",
                filters.modality === m
                  ? 'bg-primary/10 border-primary text-primary'
                  : 'border-border hover:bg-muted/50'
              )}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* Capability Filters */}
      <div className="space-y-1">
        <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
          Capabilities
        </div>
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => updateFilter('reasoning', true)}
            className={cn(
              "text-[10px] px-2.5 py-1 rounded border font-mono transition-colors touch-target-sm",
              filters.reasoning === true
                ? 'bg-amber-500/10 border-amber-500 text-amber-600'
                : 'border-border hover:bg-muted/50'
            )}
          >
            Reasoning
          </button>
          <button
            onClick={() => updateFilter('vision', true)}
            className={cn(
              "text-[10px] px-2.5 py-1 rounded border font-mono transition-colors touch-target-sm",
              filters.vision === true
                ? 'bg-sky-500/10 border-sky-500 text-sky-600'
                : 'border-border hover:bg-muted/50'
            )}
          >
            Vision
          </button>
          <button
            onClick={() => updateFilter('tool_calling', true)}
            className={cn(
              "text-[10px] px-2.5 py-1 rounded border font-mono transition-colors touch-target-sm",
              filters.tool_calling === true
                ? 'bg-violet-500/10 border-violet-500 text-violet-600'
                : 'border-border hover:bg-muted/50'
            )}
          >
            Tool Calling
          </button>
        </div>
      </div>

      {/* Family Filter */}
      {families.length > 0 && (
        <div className="space-y-1">
          <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
            Family
          </div>
          <div className="flex flex-wrap gap-1.5">
            {families.map(family => (
              <button
                key={family}
                onClick={() => updateFilter('family', family)}
                className={cn(
                  "text-[10px] px-2.5 py-1 rounded border font-mono transition-colors touch-target-sm",
                  filters.family === family
                    ? 'bg-primary/10 border-primary text-primary'
                    : 'border-border hover:bg-muted/50'
                )}
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