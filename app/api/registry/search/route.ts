import { buildSearchEngine, buildSearchIndex } from '@/lib/search';
import { PARAMETER_RANGES, CONTEXT_RANGES, GPU_RANGES } from '@/lib/registry-constants';
import { paginate, DEFAULT_PAGE_SIZES } from '@/lib/pagination';

/**
 * API endpoint for registry search with faceted filtering and pagination.
 * Supports filtering by: parameter_count, context_window, min_gpu_memory, production_ready, commercial_use, family
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') || '';
  const page = parseInt(searchParams.get('page') || '1', 10);
  const pageSize = parseInt(searchParams.get('page_size') || String(DEFAULT_PAGE_SIZES.search), 10);
  
  // Faceted filter parameters
  const minParams = searchParams.get('min_params');
  const maxParams = searchParams.get('max_params');
  const minContext = searchParams.get('min_context');
  const maxContext = searchParams.get('max_context');
  const minGpu = searchParams.get('min_gpu');
  const maxGpu = searchParams.get('max_gpu');
  const productionReady = searchParams.get('production_ready');
  const commercialUse = searchParams.get('commercial_use');
  const family = searchParams.get('family');
  const sort = searchParams.get('sort') || 'relevance';

  // Get all registry entries from search index
  const index = buildSearchIndex();
  const registryEntries = index.filter(e => e.type === 'registry');
  
  // Apply faceted filters
  let filtered = registryEntries.filter(entry => {
    if (minParams && entry.parameter_count && entry.parameter_count < parseInt(minParams)) return false;
    if (maxParams && entry.parameter_count && entry.parameter_count > parseInt(maxParams)) return false;
    if (minContext && entry.context_window && entry.context_window < parseInt(minContext)) return false;
    if (maxContext && entry.context_window && entry.context_window > parseInt(maxContext)) return false;
    if (minGpu && entry.min_gpu_memory && entry.min_gpu_memory < parseInt(minGpu)) return false;
    if (maxGpu && entry.min_gpu_memory && entry.min_gpu_memory > parseInt(maxGpu)) return false;
    if (productionReady === 'true' && entry.production_ready !== true) return false;
    if (productionReady === 'false' && entry.production_ready !== false) return false;
    if (commercialUse === 'true' && entry.commercial_use !== true) return false;
    if (commercialUse === 'false' && entry.commercial_use !== false) return false;
    if (family && entry.family !== family) return false;
    return true;
  });

  // Apply search query
  if (query) {
    const engine = buildSearchEngine();
    const searchResults = engine.search(query, filtered.length);
    const searchIds = new Set(searchResults.map(r => r.id));
    filtered = filtered.filter(e => searchIds.has(e.id));
  }

  // Apply sorting
  filtered = [...filtered].sort((a, b) => {
    switch (sort) {
      case 'params_asc':
        return (a.parameter_count || 0) - (b.parameter_count || 0);
      case 'params_desc':
        return (b.parameter_count || 0) - (a.parameter_count || 0);
      case 'size_asc':
        return (a.min_gpu_memory || 0) - (b.min_gpu_memory || 0);
      case 'size_desc':
        return (b.min_gpu_memory || 0) - (a.min_gpu_memory || 0);
      case 'name_asc':
        return a.name.localeCompare(b.name);
      case 'name_desc':
        return b.name.localeCompare(a.name);
      default:
        return 0; // Keep original order (relevance)
    }
  });

  // Apply pagination
  const pagination = paginate(filtered, page, pageSize);

  return Response.json({
    query,
    page,
    pageSize,
    total: pagination.total,
    totalPages: pagination.totalPages,
    hasNext: pagination.hasNext,
    hasPrev: pagination.hasPrev,
    results: pagination.items,
  });
}

/**
 * Get available filter values for faceted search.
 */
export async function POST() {
  const index = buildSearchIndex();
  const registryEntries = index.filter(e => e.type === 'registry');

  // Extract unique values for filters
  const families = [...new Set(registryEntries.map(e => e.family).filter(Boolean))];

  return Response.json({
    families,
    parameterRanges: PARAMETER_RANGES,
    contextRanges: CONTEXT_RANGES,
    gpuRanges: GPU_RANGES,
  });
}
