'use client';

import { Fragment, useId, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { FuseResultMatch } from 'fuse.js';
import { createFuse, SearchResult } from '@/lib/search-types';
import ContentTypeBadge from './ContentTypeBadge';
import { formatContentType } from '@/lib/resources';
import { cn } from '@/lib/utils';

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
  const router = useRouter();
  const inputId = useId();
  const listboxId = useId();
  const resultRefs = useRef<Array<HTMLAnchorElement | null>>([]);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const fuse = useMemo(() => createFuse(index), [index]);

  const results = useMemo(() => {
    const trimmed = query.trim();
    if (!trimmed) return [];
    return fuse.search(trimmed, { limit });
  }, [fuse, query, limit]);

  const closeSearch = () => {
    setQuery('');
    setActiveIndex(0);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!query.trim()) return;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex(current => {
        const next = Math.min(current + 1, Math.max(results.length - 1, 0));
        resultRefs.current[next]?.scrollIntoView({ block: 'nearest' });
        return next;
      });
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex(current => {
        const next = Math.max(current - 1, 0);
        resultRefs.current[next]?.scrollIntoView({ block: 'nearest' });
        return next;
      });
    }

    if (event.key === 'Enter' && results[activeIndex]) {
      event.preventDefault();
      const href = results[activeIndex].item.href;
      closeSearch();
      router.push(href);
    }

    if (event.key === 'Escape') {
      event.preventDefault();
      closeSearch();
    }
  };

  const getMatch = (matches: readonly FuseResultMatch[] | undefined, key: string) =>
    matches?.find(match => match.key === key);

  const Highlight = ({
    text,
    match,
    className,
  }: {
    text: string;
    match?: FuseResultMatch;
    className?: string;
  }) => {
    if (!match?.indices.length) {
      return <span className={className}>{text}</span>;
    }

    let cursor = 0;
    const chunks: React.ReactNode[] = [];

    match.indices.forEach(([start, end], idx) => {
      if (start > cursor) {
        chunks.push(<Fragment key={`text-${idx}`}>{text.slice(cursor, start)}</Fragment>);
      }
      chunks.push(
        <mark key={`match-${idx}`} className="rounded bg-primary/15 px-0.5 text-foreground">
          {text.slice(start, end + 1)}
        </mark>
      );
      cursor = end + 1;
    });

    if (cursor < text.length) {
      chunks.push(<Fragment key="tail">{text.slice(cursor)}</Fragment>);
    }

    return <span className={className}>{chunks}</span>;
  };

  return (
    <div className={compact ? 'relative w-full max-w-md' : 'relative w-full'}>
      <label htmlFor={inputId} className="sr-only">
        Search handbook
      </label>
      <input
        id={inputId}
        type="search"
        value={query}
        onChange={e => {
          setQuery(e.target.value);
          setActiveIndex(0);
        }}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        role="combobox"
        aria-expanded={Boolean(query.trim())}
        aria-controls={listboxId}
        aria-activedescendant={results[activeIndex] ? `${listboxId}-${activeIndex}` : undefined}
        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/40"
      />

      {query.trim() && (
        <div className="absolute z-20 mt-1 w-full overflow-hidden rounded-lg border border-border bg-popover shadow-sm">
          {results.length === 0 ? (
            <p className="px-3 py-2 text-xs text-muted-foreground">No results found.</p>
          ) : (
            <ul id={listboxId} role="listbox" className="max-h-80 overflow-y-auto">
              {results.map((searchResult, idx) => {
                const result = searchResult.item;
                const title = result.type === 'function' ? result.fn_signature || result.name : result.name;
                const titleMatch = getMatch(
                  searchResult.matches,
                  result.type === 'function' && result.fn_signature ? 'fn_signature' : 'name'
                ) ?? getMatch(searchResult.matches, 'name');
                const summaryMatch = getMatch(searchResult.matches, 'summary');
                const active = idx === activeIndex;

                return (
                <li
                  id={`${listboxId}-${idx}`}
                  key={`${result.type}-${result.id}`}
                  role="option"
                  aria-selected={active}
                  className="border-b border-border last:border-b-0"
                >
                  <Link
                    href={result.href}
                    ref={node => {
                      resultRefs.current[idx] = node;
                    }}
                    onClick={closeSearch}
                    onMouseEnter={() => setActiveIndex(idx)}
                    className={cn(
                      'block px-3 py-2.5 transition-colors',
                      active ? 'bg-muted text-foreground' : 'hover:bg-muted/50'
                    )}
                  >
                    <div className="flex items-center gap-2 mb-0.5">
                      <Highlight
                        text={title}
                        match={titleMatch}
                        className={result.type === 'function'
                          ? 'text-sm font-mono text-foreground'
                          : 'text-sm font-medium text-foreground'}
                      />
                      <ContentTypeBadge type={result.type} className="px-1.5 py-0 text-[8px]" />
                      {result.type === 'function' ? (
                        <>
                          {result.category && (
                            <span className="text-[10px] font-mono uppercase text-muted-foreground">
                              {result.category}
                            </span>
                          )}
                          {result.fn_section && (
                            <span className="text-[10px] text-muted-foreground">
                              · {result.fn_section}
                            </span>
                          )}
                        </>
                      ) : (
                        result.category && (
                          <span className="text-[10px] font-mono uppercase text-muted-foreground">
                            {result.category}
                          </span>
                        )
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      <Highlight text={result.summary} match={summaryMatch} />
                    </p>
                    <p className="mt-1 text-[10px] text-muted-foreground/80">
                      {formatContentType(result.type)}
                      {result.updated_at ? ` · Updated ${result.updated_at}` : ''}
                    </p>
                  </Link>
                </li>
              )})}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
