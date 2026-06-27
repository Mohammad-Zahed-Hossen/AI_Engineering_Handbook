'use client';

import { Fragment, useEffect, useId, useMemo, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { FuseResultMatch } from 'fuse.js';
import { createFuse, SearchResult } from '@/lib/search-types';
import ContentTypeBadge from './ContentTypeBadge';
import { formatContentType } from '@/lib/resources';
import { cn } from '@/lib/utils';
import { Clock, Search } from 'lucide-react';

interface SearchEngine {
  search: (query: string, limit?: number) => SearchResult[];
}

type SearchDisplayResult = {
  item: SearchResult;
  matches?: readonly FuseResultMatch[];
};

interface SearchBoxProps {
  index: SearchResult[];
  placeholder?: string;
  limit?: number;
  compact?: boolean;
  engine?: SearchEngine | null;
}

const RECENT_SEARCHES_KEY = 'aens-recent-searches';
const MAX_RECENT = 5;

const TYPE_ORDER: SearchResult['type'][] = ['package', 'model', 'function', 'cheatsheet', 'workflow', 'registry'];

const TYPE_LABELS: Record<SearchResult['type'], string> = {
  package: 'Packages',
  model: 'Models',
  function: 'Functions',
  cheatsheet: 'Cheatsheets',
  workflow: 'Workflows',
  registry: 'Registry',
};

function loadRecentSearches(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(RECENT_SEARCHES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveRecentSearches(searches: string[]) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(searches.slice(0, MAX_RECENT)));
  } catch {
    // Storage may be full — ignore
  }
}

function addRecentSearch(query: string) {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed || trimmed.length < 2) return;
  const existing = loadRecentSearches();
  const next = [trimmed, ...existing.filter(s => s !== trimmed)];
  saveRecentSearches(next.slice(0, MAX_RECENT));
}

// Text-based highlighting for engine path (no Fuse matches)
function highlightText(text: string, query: string): React.ReactNode {
  if (!query.trim()) return text;
  const tokens = query
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter(t => t.length >= 2)
    .sort((a, b) => b.length - a.length); // Longest first to avoid overlapping

  if (tokens.length === 0) return text;

  // Build regex that matches any token (case-insensitive)
  const pattern = new RegExp(`(${tokens.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'gi');

  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let matchIndex = 0;

  text.replace(pattern, (match, _group, offset) => {
    if (offset > lastIndex) {
      parts.push(<Fragment key={`t-${matchIndex}`}>{text.slice(lastIndex, offset)}</Fragment>);
    }
    parts.push(
      <mark key={`m-${matchIndex}`} className="rounded bg-primary/15 px-0.5 text-foreground">
        {match}
      </mark>
    );
    lastIndex = offset + match.length;
    matchIndex++;
    return match;
  });

  if (lastIndex < text.length) {
    parts.push(<Fragment key="tail">{text.slice(lastIndex)}</Fragment>);
  }

  return parts.length > 0 ? <>{parts}</> : text;
}

export default function SearchBox({
  index,
  placeholder = 'Search packages, models, workflows…',
  limit = 8,
  compact = false,
  engine = null,
}: SearchBoxProps) {
  const router = useRouter();
  const inputId = useId();
  const listboxId = useId();
  const resultRefs = useRef<Array<HTMLAnchorElement | null>>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const [focused, setFocused] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>(() => loadRecentSearches());
  const fuse = useMemo(() => createFuse(index), [index]);

  // Keyboard shortcut
  useEffect(() => {
    function handleGlobalKeyDown(e: KeyboardEvent) {
      if (e.key !== '/') return;
      const tag = (document.activeElement as HTMLElement)?.tagName?.toLowerCase();
      const isEditable = (document.activeElement as HTMLElement)?.isContentEditable;
      if (tag === 'input' || tag === 'textarea' || isEditable) return;
      e.preventDefault();
      document.getElementById(inputId)?.focus();
    }
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [inputId]);

  // Scroll dropdown into view on mobile when results appear
  useEffect(() => {
    if (query.trim() && dropdownRef.current) {
      const rect = dropdownRef.current.getBoundingClientRect();
      const viewportHeight = window.visualViewport?.height ?? window.innerHeight;
      if (rect.bottom > viewportHeight) {
        dropdownRef.current.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
  }, [query]);

  const results = useMemo<SearchDisplayResult[]>(() => {
    const trimmed = query.trim();
    if (!trimmed) return [];

    if (engine?.search) {
      return engine.search(trimmed, limit).map(item => ({ item }));
    }

    return fuse.search(trimmed, { limit }).map(result => ({
      item: result.item,
      matches: result.matches,
    }));
  }, [fuse, query, limit, engine]);

  const groupedResults = useMemo(() => {
    const groups = new Map<SearchResult['type'], SearchDisplayResult[]>();
    results.forEach(r => {
      const list = groups.get(r.item.type) || [];
      list.push(r);
      groups.set(r.item.type, list);
    });
    return TYPE_ORDER.map(type => ({ type, label: TYPE_LABELS[type], items: groups.get(type) || [] }))
      .filter(g => g.items.length > 0);
  }, [results]);

  const flatResults = useMemo(() => {
    return groupedResults.flatMap(g => g.items);
  }, [groupedResults]);

  const handleSelect = useCallback((href: string) => {
    if (query.trim()) {
      addRecentSearch(query);
      setRecentSearches(loadRecentSearches());
    }
    setQuery('');
    setActiveIndex(0);
    router.push(href);
  }, [query, router]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!query.trim()) return;

    const total = flatResults.length;
    if (total === 0) return;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex(current => {
        const next = Math.min(current + 1, total - 1);
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

    if (event.key === 'Enter' && flatResults[activeIndex]) {
      event.preventDefault();
      handleSelect(flatResults[activeIndex].item.href);
    }

    if (event.key === 'Escape') {
      event.preventDefault();
      setQuery('');
      setActiveIndex(0);
    }
  };

  const getMatch = (matches: readonly FuseResultMatch[] | undefined, key: string) =>
    matches?.find(match => match.key === key);

  const HighlightFuse = ({
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

  const showRecent = focused && !query.trim() && recentSearches.length > 0;
  const showResults = query.trim().length > 0;

  // Global flat index for keyboard navigation
  let globalIndex = 0;

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
        onFocus={() => setFocused(true)}
        onBlur={() => setTimeout(() => setFocused(false), 150)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        role="combobox"
        aria-expanded={showResults || showRecent}
        aria-controls={listboxId}
        aria-activedescendant={flatResults[activeIndex] ? `${listboxId}-${activeIndex}` : undefined}
        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/40"
      />

      {!focused && !query && (
        <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
          <kbd className="text-[9px] font-mono text-muted-foreground/50 border border-border/50 rounded px-1 py-0.5">
            /
          </kbd>
        </div>
      )}

      {/* Recent searches */}
      {showRecent && (
        <div className="absolute z-20 mt-1 w-full overflow-hidden rounded-lg border border-border bg-popover shadow-sm">
          <div className="px-3 py-1.5 border-b border-border bg-muted/30">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Clock className="w-3 h-3" />
              Recent searches
            </span>
          </div>
          <ul id={listboxId} role="listbox" className="max-h-60 overflow-y-auto">
            {recentSearches.map((term) => (
              <li key={term} role="option" aria-selected={false} className="border-b border-border last:border-b-0">
                <button
                  onClick={() => {
                    setQuery(term);
                    setActiveIndex(0);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-left text-sm text-foreground hover:bg-muted/50 transition-colors"
                >
                  <Search className="w-3.5 h-3.5 text-muted-foreground" />
                  <span>{term}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Search results */}
      {showResults && (
        <div
          ref={dropdownRef}
          className="absolute z-20 mt-1 w-full overflow-hidden rounded-lg border border-border bg-popover shadow-sm"
        >
          {results.length === 0 ? (
            <div className="px-3 py-4 text-center">
              <p className="text-xs text-muted-foreground">No results found for &ldquo;{query.trim()}&rdquo;</p>
              <p className="mt-1 text-[10px] text-muted-foreground/60">Try a different keyword or check spelling.</p>
            </div>
          ) : (
            <div id={listboxId} role="listbox" className="max-h-[60vh] overflow-y-auto">
              {groupedResults.map(group => (
                <div key={group.type}>
                  {/* Sticky group header */}
                  <div className="sticky top-0 z-10 px-3 py-1 bg-muted/60 border-b border-border backdrop-blur-sm select-none">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      {group.label}
                    </span>
                  </div>
                  {group.items.map((searchResult) => {
                    const result = searchResult.item;
                    const title = result.type === 'function' ? result.fn_signature || result.name : result.name;
                    const titleMatch = getMatch(
                      searchResult.matches,
                      result.type === 'function' && result.fn_signature ? 'fn_signature' : 'name'
                    ) ?? getMatch(searchResult.matches, 'name');
                    const summaryMatch = getMatch(searchResult.matches, 'summary');
                    const isActive = globalIndex === activeIndex;
                    const currentIdx = globalIndex++;

                    return (
                      <div
                        id={`${listboxId}-${currentIdx}`}
                        key={`${result.type}-${result.id}`}
                        role="option"
                        aria-selected={isActive}
                        className="border-b border-border last:border-b-0"
                      >
                        <Link
                          href={result.href}
                          ref={node => {
                            resultRefs.current[currentIdx] = node;
                          }}
                          onClick={() => handleSelect(result.href)}
                          onMouseEnter={() => setActiveIndex(currentIdx)}
                          className={cn(
                            'block px-3 py-2.5 transition-colors',
                            isActive ? 'bg-muted text-foreground' : 'hover:bg-muted/50'
                          )}
                        >
                          <div className="flex items-center gap-2 mb-0.5">
                            {searchResult.matches ? (
                              <HighlightFuse
                                text={title}
                                match={titleMatch}
                                className={result.type === 'function'
                                  ? 'text-sm font-mono text-foreground'
                                  : 'text-sm font-medium text-foreground'}
                              />
                            ) : (
                              <span className={result.type === 'function'
                                ? 'text-sm font-mono text-foreground'
                                : 'text-sm font-medium text-foreground'}>
                                {highlightText(title, query)}
                              </span>
                            )}
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
                            {searchResult.matches ? (
                              <HighlightFuse text={result.summary} match={summaryMatch} />
                            ) : (
                              highlightText(result.summary, query)
                            )}
                          </p>
                          <p className="mt-1 text-[10px] text-muted-foreground/80">
                            {formatContentType(result.type)}
                            {result.updated_at ? ` · Updated ${result.updated_at}` : ''}
                          </p>
                        </Link>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
