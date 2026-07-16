/**
 * Pagination utilities for registry and other content types.
 * Provides consistent pagination logic across the application.
 */

export interface PaginationResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

/**
 * Paginates an array of items.
 * @param items - Array of items to paginate
 * @param page - Current page number (1-indexed)
 * @param pageSize - Number of items per page
 * @returns Pagination result with items and metadata
 */
export function paginate<T>(items: T[], page: number, pageSize: number): PaginationResult<T> {
  const total = items.length;
  const totalPages = Math.ceil(total / pageSize);
  const normalizedPage = Math.max(1, Math.min(page, totalPages));
  const start = (normalizedPage - 1) * pageSize;
  const end = start + pageSize;
  
  return {
    items: items.slice(start, end),
    total,
    page: normalizedPage,
    pageSize,
    totalPages,
    hasNext: normalizedPage < totalPages,
    hasPrev: normalizedPage > 1,
  };
}

/**
 * Default page sizes for different content types.
 */
export const DEFAULT_PAGE_SIZES = {
  registryFamilies: 12,
  registryVariants: 20,
  search: 20,
} as const;

/**
 * Generates page numbers for pagination display.
 * @param current - Current page
 * @param total - Total pages
 * @param maxVisible - Maximum number of page buttons to show
 * @returns Array of page numbers to display
 */
export function getPageNumbers(
  current: number,
  total: number,
  maxVisible: number = 5
): (number | 'ellipsis')[] {
  if (total <= maxVisible) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages: (number | 'ellipsis')[] = [];
  const half = Math.floor(maxVisible / 2);

  // Always show first page
  pages.push(1);

  if (current > half + 2) {
    pages.push('ellipsis');
  }

  // Show pages around current
  const start = Math.max(2, current - half);
  const end = Math.min(total - 1, current + half);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (current < total - half - 1) {
    pages.push('ellipsis');
  }

  // Always show last page
  if (total > 1) {
    pages.push(total);
  }

  return pages;
}