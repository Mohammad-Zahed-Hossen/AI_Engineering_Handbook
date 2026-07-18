'use client';

import { useState, useEffect } from 'react';
import FamilyCard from './FamilyCard';
import RegistryFilter, { RegistryFilters } from './RegistryFilter';
import PaginationControls from './PaginationControls';
import { RegistryFamily } from '@/types/registry';
import { PaginationResult } from '@/lib/pagination';

interface RegistryFamilyViewProps {
  families: RegistryFamily[];
}

interface ApiResponse {
  results: RegistryFamily[];
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
  page: number;
  pageSize: number;
}

/**
 * Client-side view component for registry families with API-based filtering and pagination.
 */
export default function RegistryFamilyView({ families: initialFamilies }: RegistryFamilyViewProps) {
  const [filters, setFilters] = useState<RegistryFilters>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [apiData, setApiData] = useState<ApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Get unique family IDs for the filter
  const familyIds = [...new Set(initialFamilies.map(f => f.id))];

  // Fetch from API when filters or page change
  useEffect(() => {
    const fetchFromApi = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams({
          page: currentPage.toString(),
          page_size: '12', // Use a reasonable page size for families
          category: 'families',
        });

        if (filters.productionReady !== undefined) {
          params.set('production_ready', filters.productionReady.toString());
        }
        if (filters.commercialUse !== undefined) {
          params.set('commercial_use', filters.commercialUse.toString());
        }
        if (filters.family) {
          params.set('family', filters.family);
        }
        if (filters.modality) {
          params.set('modality', filters.modality);
        }
        if (filters.reasoning !== undefined) {
          params.set('reasoning', filters.reasoning.toString());
        }
        if (filters.vision !== undefined) {
          params.set('vision', filters.vision.toString());
        }
        if (filters.tool_calling !== undefined) {
          params.set('tool_calling', filters.tool_calling.toString());
        }

        const response = await fetch(`/api/registry/search?${params.toString()}`);
        const data = await response.json();
        setApiData(data);
      } catch (error) {
        console.error('Failed to fetch from API:', error);
        setApiData(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFromApi();
  }, [filters, currentPage]);

  // Use API data for display
  const pagination = apiData ? {
    items: apiData.results,
    total: apiData.total,
    totalPages: apiData.totalPages,
    page: apiData.page,
    pageSize: apiData.pageSize,
    hasNext: apiData.hasNext,
    hasPrev: apiData.hasPrev,
  } : {
    items: [],
    total: 0,
    totalPages: 0,
    page: 1,
    pageSize: 12,
    hasNext: false,
    hasPrev: false,
  };

  // Type for API response with variant_count
  type FamilyWithVariantCount = RegistryFamily & { variant_count?: number };

  const handleFilterChange = (newFilters: RegistryFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-4">
      {/* Faceted Search Filter */}
      <RegistryFilter 
        onFilterChange={handleFilterChange} 
        families={familyIds} 
      />

      {isLoading && (
        <div className="p-8 text-center text-xs text-muted-foreground">
          Loading...
        </div>
      )}

      {/* Family Grid - mobile first: 1 column, then 2, then 3 */}
      <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {!isLoading && (pagination.items as FamilyWithVariantCount[]).map((family) => (
          <FamilyCard key={family.id} family={family} variantCount={family.variant_count ?? 0} />
        ))}
      </div>

      {!isLoading && pagination.items.length === 0 && (
        <div className="p-8 text-center text-xs text-muted-foreground">
          No families match the selected filters.
        </div>
      )}

      {/* Pagination Controls */}
      {!isLoading && (
        <PaginationControls 
          pagination={pagination as PaginationResult<unknown>} 
          onPageChange={setCurrentPage} 
        />
      )}
    </div>
  );
}