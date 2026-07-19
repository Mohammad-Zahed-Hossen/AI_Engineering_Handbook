'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import SearchFilterToolbar from '@/components/shared/SearchFilterToolbar';
import FilterBar from '@/components/shared/FilterBar';

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

const modalities = ['llm', 'embedding', 'reranker', 'vision', 'speech', 'multimodal'];
const capabilities = ['reasoning', 'vision', 'tool_calling'];

// Custom filter bar for status filters (boolean toggles)
function StatusFilterBar({
  filters,
  updateFilter,
}: {
  filters: RegistryFilters;
  updateFilter: (key: keyof RegistryFilters, value: string | number | boolean | undefined) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-1">
      <span className="text-[11px] font-medium text-muted-foreground shrink-0 mr-1">
        Status
      </span>
      <button
        onClick={() => updateFilter('productionReady', filters.productionReady === true ? undefined : true)}
        className={cn(
          "px-2 py-1.5 rounded-md border text-[11px] font-mono cursor-pointer select-none touch-target transition-all min-h-[36px] min-w-[36px] flex items-center justify-center",
          filters.productionReady === true
            ? "bg-emerald-500/10 text-emerald-600 border-emerald-500"
            : "bg-secondary/50 text-secondary-foreground border-border hover:bg-secondary hover:border-border/80"
        )}
      >
        Production
      </button>
      <button
        onClick={() => updateFilter('commercialUse', filters.commercialUse === true ? undefined : true)}
        className={cn(
          "px-2 py-1.5 rounded-md border text-[11px] font-mono cursor-pointer select-none touch-target transition-all min-h-[36px] min-w-[36px] flex items-center justify-center",
          filters.commercialUse === true
            ? "bg-indigo-500/10 text-indigo-600 border-indigo-500"
            : "bg-secondary/50 text-secondary-foreground border-border hover:bg-secondary hover:border-border/80"
        )}
      >
        Commercial
      </button>
    </div>
  );
}

// Custom filter bar for capability filters (boolean toggles)
function CapabilityFilterBar({
  filters,
  updateFilter,
}: {
  filters: RegistryFilters;
  updateFilter: (key: keyof RegistryFilters, value: string | number | boolean | undefined) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-1">
      <span className="text-[11px] font-medium text-muted-foreground shrink-0 mr-1">
        Capabilities
      </span>
      {capabilities.map(cap => (
        <button
          key={cap}
          onClick={() => updateFilter(cap as keyof RegistryFilters, filters[cap as keyof RegistryFilters] === true ? undefined : true)}
          className={cn(
            "px-2 py-1.5 rounded-md border text-[11px] font-mono cursor-pointer select-none touch-target transition-all min-h-[36px] min-w-[36px] flex items-center justify-center",
            filters[cap as keyof RegistryFilters] === true
              ? cap === 'reasoning' ? "bg-amber-500/10 text-amber-600 border-amber-500"
              : cap === 'vision' ? "bg-sky-500/10 text-sky-600 border-sky-500"
              : "bg-violet-500/10 text-violet-600 border-violet-500"
              : "bg-secondary/50 text-secondary-foreground border-border hover:bg-secondary hover:border-border/80"
          )}
        >
          {cap.replace('_', ' ')}
        </button>
      ))}
    </div>
  );
}

/**
 * Faceted search filter component for registry pages.
 * Allows filtering by production status, commercial use, and family.
 */
export default function RegistryFilter({ onFilterChange, families, resultCount, totalCount }: RegistryFilterProps & { resultCount?: number; totalCount?: number }) {
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

  // Build active filters array for display
  const activeFilters = [
    ...(filters.productionReady !== undefined ? [{ label: `Production: ${filters.productionReady ? 'Yes' : 'No'}`, value: 'productionReady', onRemove: () => updateFilter('productionReady', undefined) }] : []),
    ...(filters.commercialUse !== undefined ? [{ label: `Commercial: ${filters.commercialUse ? 'Yes' : 'No'}`, value: 'commercialUse', onRemove: () => updateFilter('commercialUse', undefined) }] : []),
    ...(filters.modality ? [{ label: filters.modality.charAt(0).toUpperCase() + filters.modality.slice(1), value: 'modality', onRemove: () => updateFilter('modality', undefined) }] : []),
    ...(filters.reasoning !== undefined ? [{ label: `Reasoning: ${filters.reasoning ? 'Yes' : 'No'}`, value: 'reasoning', onRemove: () => updateFilter('reasoning', undefined) }] : []),
    ...(filters.vision !== undefined ? [{ label: `Vision: ${filters.vision ? 'Yes' : 'No'}`, value: 'vision', onRemove: () => updateFilter('vision', undefined) }] : []),
    ...(filters.tool_calling !== undefined ? [{ label: `Tool Calling: ${filters.tool_calling ? 'Yes' : 'No'}`, value: 'tool_calling', onRemove: () => updateFilter('tool_calling', undefined) }] : []),
    ...(filters.family ? [{ label: filters.family, value: 'family', onRemove: () => updateFilter('family', undefined) }] : []),
  ];

  const hasActiveFilters = activeFilters.length > 0;

  return (
    <SearchFilterToolbar
      searchQuery=""
      onSearchChange={() => {}}
      searchPlaceholder=""
      showClearSearch={false}
      activeFilters={activeFilters}
      onClearAll={hasActiveFilters ? clearFilters : undefined}
      resultCount={resultCount}
      totalCount={totalCount}
      moreFiltersContent={
        <div className="space-y-1.5">
          <CapabilityFilterBar filters={filters} updateFilter={updateFilter} />
          {families.length > 0 && (
            <FilterBar
              label="Family"
              options={families}
              selectedOptions={filters.family ? [filters.family] : []}
              onToggle={(val) => updateFilter('family', filters.family === val ? undefined : val)}
              onClear={() => updateFilter('family', undefined)}
              horizontal
            />
          )}
        </div>
      }
    >
      <StatusFilterBar filters={filters} updateFilter={updateFilter} />
      <FilterBar
        label="Modality"
        options={modalities}
        selectedOptions={filters.modality ? [filters.modality] : []}
        onToggle={(val) => updateFilter('modality', filters.modality === val ? undefined : val)}
        onClear={() => updateFilter('modality', undefined)}
        horizontal
      />
    </SearchFilterToolbar>
  );
}