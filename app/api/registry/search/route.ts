import { NextRequest, NextResponse } from 'next/server';
import { getAllRegistryFamilies, getRegistryVariantsByFamily } from '@/lib/data';

/**
 * API route for registry search with faceted filtering.
 * Supports filtering by production status, commercial use, family, modality, and capabilities.
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  
  const page = parseInt(searchParams.get('page') || '1', 10);
  const pageSize = parseInt(searchParams.get('page_size') || '12', 10);
  
  // Get all registry families
  const allFamilies = getAllRegistryFamilies();
  
  // Apply filters
  const filteredFamilies = allFamilies.filter((family) => {
    // Production ready filter
    if (searchParams.get('production_ready') === 'true') {
      if (family.engineering_snapshot?.production_ready !== true) {
        return false;
      }
    }
    
    // Commercial use filter
    if (searchParams.get('commercial_use') === 'true') {
      if (family.license_info?.commercial_use !== true) {
        return false;
      }
    }
    
    // Family filter
    if (searchParams.get('family')) {
      if (family.id !== searchParams.get('family')) {
        return false;
      }
    }
    
    // Modality filter
    if (searchParams.get('modality')) {
      if (family.modality !== searchParams.get('modality')) {
        return false;
      }
    }
    
    // Capability filters
    if (searchParams.get('reasoning') === 'true') {
      if (family.capabilities?.reasoning !== true) {
        return false;
      }
    }
    
    if (searchParams.get('vision') === 'true') {
      if (family.capabilities?.vision !== true) {
        return false;
      }
    }
    
    if (searchParams.get('tool_calling') === 'true') {
      if (family.capabilities?.tool_calling !== true) {
        return false;
      }
    }
    
    return true;
  });
  
// Calculate pagination
  const total = filteredFamilies.length;
  const totalPages = Math.ceil(total / pageSize);
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedFamilies = filteredFamilies.slice(startIndex, endIndex);

  // Add variant count to each family
  const familiesWithVariantCount = paginatedFamilies.map(family => ({
    ...family,
    variant_count: getRegistryVariantsByFamily(family.id).length,
  }));

  return NextResponse.json({
    results: familiesWithVariantCount,
    total,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
    page,
    pageSize,
  });
}