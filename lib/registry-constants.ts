/**
 * Shared constants for registry components.
 * Used by both the client-side filter and server-side API.
 */

// Parameter count ranges (in millions)
export const PARAMETER_RANGES = [
  { label: '< 1B', min: 0, max: 1000 },
  { label: '1-10B', min: 1000, max: 10000 },
  { label: '10-100B', min: 10000, max: 100000 },
  { label: '> 100B', min: 100000, max: Infinity },
] as const;

// Context window ranges (in tokens)
export const CONTEXT_RANGES = [
  { label: '< 4K', min: 0, max: 4000 },
  { label: '4K-32K', min: 4000, max: 32000 },
  { label: '32K-128K', min: 32000, max: 128000 },
  { label: '> 128K', min: 128000, max: Infinity },
] as const;

// GPU memory ranges (in MB)
export const GPU_RANGES = [
  { label: '< 8GB', min: 0, max: 8000 },
  { label: '8-16GB', min: 8000, max: 16000 },
  { label: '16-24GB', min: 16000, max: 24000 },
  { label: '24-48GB', min: 24000, max: 48000 },
  { label: '> 48GB', min: 48000, max: Infinity },
] as const;

// Sort options
export const SORT_OPTIONS = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'params_asc', label: 'Params ↑' },
  { value: 'params_desc', label: 'Params ↓' },
  { value: 'size_asc', label: 'Size ↑' },
  { value: 'size_desc', label: 'Size ↓' },
  { value: 'name_asc', label: 'Name A-Z' },
  { value: 'name_desc', label: 'Name Z-A' },
] as const;

export type SortOption = typeof SORT_OPTIONS[number]['value'];