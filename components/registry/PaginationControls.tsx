'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { PaginationResult, getPageNumbers } from '@/lib/pagination';

interface PaginationControlsProps {
  pagination: PaginationResult<unknown>;
  onPageChange: (page: number) => void;
}

/**
 * Pagination controls component for registry pages.
 * Displays page numbers with ellipsis for large result sets.
 */
export default function PaginationControls({ pagination, onPageChange }: PaginationControlsProps) {
  const { page, totalPages, hasPrev, hasNext } = pagination;

  if (totalPages <= 1) return null;

  const pages = getPageNumbers(page, totalPages);

  return (
    <div className="flex items-center justify-center gap-1 mt-6">
      <button
        onClick={() => hasPrev && onPageChange(page - 1)}
        disabled={!hasPrev}
        className={`p-1.5 rounded border transition-colors ${
          hasPrev 
            ? 'border-border hover:bg-muted/50' 
            : 'border-border/50 opacity-50 cursor-not-allowed'
        }`}
        aria-label="Previous page"
      >
        <ChevronLeft className="h-3 w-3" />
      </button>

      {pages.map((p, idx) => 
        p === 'ellipsis' ? (
          <span key={`ellipsis-${idx}`} className="text-xs text-muted-foreground px-1">
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`min-w-[24px] h-6 text-xs font-mono rounded border transition-colors ${
              p === page
                ? 'bg-primary/10 border-primary text-primary'
                : 'border-border hover:bg-muted/50'
            }`}
          >
            {p}
          </button>
        )
      )}

      <button
        onClick={() => hasNext && onPageChange(page + 1)}
        disabled={!hasNext}
        className={`p-1.5 rounded border transition-colors ${
          hasNext 
            ? 'border-border hover:bg-muted/50' 
            : 'border-border/50 opacity-50 cursor-not-allowed'
        }`}
        aria-label="Next page"
      >
        <ChevronRight className="h-3 w-3" />
      </button>
    </div>
  );
}