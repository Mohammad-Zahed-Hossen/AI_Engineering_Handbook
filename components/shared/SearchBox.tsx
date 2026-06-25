'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { createFuse, SearchResult } from '@/lib/search-types';
import ContentTypeBadge from './ContentTypeBadge';
import { formatContentType } from '@/lib/resources';

interface SearchBoxProps {
  index: SearchResult[];
  placeholder?: string;
  limit?: number;
  compact?: boolean;
}

export default function SearchBox({
  index,
  placeholder = 'Search packages, models, workflows…',
  limit = 8,
  compact = false,
}: SearchBoxProps) {
  const [query, setQuery] = useState('');
  const fuse = useMemo(() => createFuse(index), [index]);

  const results = useMemo(() => {
    const trimmed = query.trim();
    if (!trimmed) return [];
    return fuse.search(trimmed, { limit }).map(r => r.item);
  }, [fuse, query, limit]);

  return (
    <div className={compact ? 'relative w-full max-w-md' : 'relative w-full'}>
      <label htmlFor="handbook-search" className="sr-only">
        Search handbook
      </label>
      <input
        id="handbook-search"
        type="search"
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/40"
      />

      {query.trim() && (
        <div className="absolute z-20 mt-1 w-full overflow-hidden rounded-lg border border-border bg-popover shadow-sm">
          {results.length === 0 ? (
            <p className="px-3 py-2 text-xs text-muted-foreground">No results found.</p>
          ) : (
            <ul className="max-h-80 overflow-y-auto">
              {results.map(result => (
                <li key={`${result.type}-${result.id}`} className="border-b border-border last:border-b-0">
                  <Link
                    href={result.href}
                    onClick={() => setQuery('')}
                    className="block px-3 py-2.5 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-sm font-medium text-foreground">{result.name}</span>
                      <ContentTypeBadge type={result.type} className="px-1.5 py-0 text-[8px]" />
                      {result.category && (
                        <span className="text-[10px] font-mono uppercase text-muted-foreground">
                          {result.category}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {result.summary}
                    </p>
                    <p className="mt-1 text-[10px] text-muted-foreground/80">
                      {formatContentType(result.type)}
                      {result.updated_at ? ` · Updated ${result.updated_at}` : ''}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
