'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import FamilyCard from './FamilyCard';
import RegistryFilter, { RegistryFilters } from './RegistryFilter';
import PaginationControls from './PaginationControls';
import { RegistryFamily } from '@/types/registry';
import { paginate, DEFAULT_PAGE_SIZES, PaginationResult } from '@/lib/pagination';

interface RegistryFamilyViewProps {
  families: RegistryFamily[];
}

/**
 * Client-side view component for registry families with filtering and pagination.
 */
export default function RegistryFamilyView({ families }: RegistryFamilyViewProps) {
  const [filters, setFilters] = useState<RegistryFilters>({});
  const [currentPage, setCurrentPage] = useState(1);

  // Get unique family IDs for the filter
  const familyIds = useMemo(() => 
    [...new Set(families.map(f => f.id))], 
    [families]
  );

  // Apply filters to families
  const filteredFamilies = useMemo(() => {
    return families.filter(family => {
      if (filters.productionReady === true && family.engineering_snapshot?.production_ready !== true) return false;
      if (filters.commercialUse === true && family.license_info?.commercial_use !== true) return false;
      if (filters.family && family.id !== filters.family) return false;
      return true;
    });
  }, [families, filters]);

  // Paginate filtered families
  const pagination = useMemo(() => {
    return paginate(filteredFamilies, currentPage, DEFAULT_PAGE_SIZES.registryFamilies);
  }, [filteredFamilies, currentPage]);

  // Reset to first page when filters change
  const prevFiltersRef = useRef(filters);
  useEffect(() => {
    if (JSON.stringify(prevFiltersRef.current) !== JSON.stringify(filters)) {
      setCurrentPage(1);
      prevFiltersRef.current = filters;
    }
  }, [filters]);

  return (
    <div className="space-y-4">
      {/* Faceted Search Filter */}
      <RegistryFilter 
        onFilterChange={setFilters} 
        families={familyIds} 
      />

      {/* Family Grid */}
      <div className="grid gap-3 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {pagination.items.map((family) => (
          <FamilyCard key={family.id} family={family} />
        ))}
      </div>

      {pagination.items.length === 0 && (
        <div className="p-8 text-center text-xs text-muted-foreground">
          No families match the selected filters.
        </div>
      )}

      {/* Pagination Controls */}
      <PaginationControls 
        pagination={pagination as PaginationResult<unknown>} 
        onPageChange={setCurrentPage} 
      />
    </div>
  );
}
