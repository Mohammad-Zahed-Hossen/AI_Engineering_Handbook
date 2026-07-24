'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronRight } from 'lucide-react';
import type { Cheatsheet } from '@/types/cheatsheet';
import { cn } from '@/lib/utils';
import ContentTypeBadge from '@/components/shared/ContentTypeBadge';
import SearchFilterToolbar from '@/components/shared/SearchFilterToolbar';
import HighlightMatch from '@/components/shared/HighlightMatch';

interface CheatsheetListClientProps {
  cheatsheets: Cheatsheet[];
}

// Get difficulty badge styling
const getDifficultyBadgeClass = (difficulty: string | undefined) => {
  switch (difficulty) {
    case 'beginner':
      return 'text-emerald-700 dark:text-emerald-400 border-emerald-200 bg-emerald-50 dark:border-emerald-500/30 dark:bg-emerald-500/10';
    case 'intermediate':
      return 'text-amber-700 dark:text-amber-400 border-amber-200 bg-amber-50 dark:border-amber-500/30 dark:bg-amber-500/10';
    case 'advanced':
      return 'text-rose-700 dark:text-rose-400 border-rose-200 bg-rose-50 dark:border-rose-500/30 dark:bg-rose-500/10';
    case 'expert':
      return 'text-purple-700 dark:text-purple-400 border-purple-200 bg-purple-50 dark:border-purple-500/30 dark:bg-purple-500/10';
    default:
      return 'text-muted-foreground border-border bg-muted';
  }
};

// Get unique values for filters
const getUniqueValues = <T extends string>(cheatsheets: Cheatsheet[], key: keyof Cheatsheet): T[] => {
  const values = new Set<T>();
  cheatsheets.forEach(cs => {
    const val = cs[key];
    if (val) values.add(val as T);
  });
  return Array.from(values).sort();
};

export default function CheatsheetListClient({ cheatsheets }: CheatsheetListClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulties, setSelectedDifficulties] = useState<string[]>([]);
  const [selectedDomains, setSelectedDomains] = useState<string[]>([]);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  // Get unique filter options
  const difficultyOptions = useMemo(() => getUniqueValues(cheatsheets, 'difficulty'), [cheatsheets]);
  const domainOptions = useMemo(() => getUniqueValues(cheatsheets, 'domain'), [cheatsheets]);

  // Filter cheatsheets based on search and filters
  const filteredCheatsheets = useMemo(() => {
    return cheatsheets.filter(cs => {
      const matchesSearch = searchQuery === '' || 
        cs.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cs.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cs.entries.some(entry => 
          entry.problem.toLowerCase().includes(searchQuery.toLowerCase()) ||
          entry.trigger.toLowerCase().includes(searchQuery.toLowerCase())
        );

      const matchesDifficulty = selectedDifficulties.length === 0 || 
        selectedDifficulties.includes(cs.difficulty || '');

      const matchesDomain = selectedDomains.length === 0 || 
        selectedDomains.includes(cs.domain || '');

      return matchesSearch && matchesDifficulty && matchesDomain;
    });
  }, [cheatsheets, searchQuery, selectedDifficulties, selectedDomains]);

  const toggleExpand = (id: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleDifficulty = (opt: string) => {
    if (selectedDifficulties.includes(opt)) {
      setSelectedDifficulties(selectedDifficulties.filter(d => d !== opt));
    } else {
      setSelectedDifficulties([...selectedDifficulties, opt]);
    }
  };

  const toggleDomain = (opt: string) => {
    if (selectedDomains.includes(opt)) {
      setSelectedDomains(selectedDomains.filter(d => d !== opt));
    } else {
      setSelectedDomains(prev => [...prev, opt]);
    }
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedDifficulties([]);
    setSelectedDomains([]);
  };

  const activeFilters = [
    ...selectedDifficulties.map(d => ({ label: `Difficulty: ${d}`, value: d, onRemove: () => toggleDifficulty(d) })),
    ...selectedDomains.map(dm => ({ label: `Domain: ${dm.replace(/_/g, ' ')}`, value: dm, onRemove: () => toggleDomain(dm) })),
  ];

  return (
    <div className="space-y-4">
      {/* Search and Filters Toolbar */}
      <SearchFilterToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search cheatsheets by name, description, or problem..."
        showClearSearch={true}
        activeFilters={activeFilters}
        onClearAll={activeFilters.length > 0 || searchQuery.length > 0 ? clearAllFilters : undefined}
        resultCount={filteredCheatsheets.length}
        totalCount={cheatsheets.length}
        moreFiltersContent={
          <div className="space-y-3">
            {/* Difficulty filters */}
            {difficultyOptions.length > 0 && (
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground block mb-1.5">
                  Difficulty
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {difficultyOptions.map(opt => (
                    <button
                      key={opt}
                      onClick={() => toggleDifficulty(opt)}
                      className={cn(
                        "px-2.5 py-1 text-[10px] font-mono font-medium rounded border capitalize transition-colors touch-target",
                        selectedDifficulties.includes(opt)
                          ? "bg-primary/10 text-primary border-primary/20"
                          : getDifficultyBadgeClass(opt)
                      )}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Domain filters */}
            {domainOptions.length > 0 && (
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground block mb-1.5">
                  Domain
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {domainOptions.map(opt => (
                    <button
                      key={opt}
                      onClick={() => toggleDomain(opt)}
                      className={cn(
                        "px-2.5 py-1 text-[10px] font-mono font-medium rounded border capitalize transition-colors touch-target",
                        selectedDomains.includes(opt)
                          ? "bg-primary/10 text-primary border-primary/20"
                          : "text-muted-foreground border-border bg-muted"
                      )}
                    >
                      {opt.replace(/_/g, ' ')}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        }
      />

      {/* Empty state */}
      {filteredCheatsheets.length === 0 && (
        <div className="p-8 text-center text-sm bg-card border border-border rounded-lg text-muted-foreground select-none">
          No cheatsheets match the selected search or filter criteria.
        </div>
      )}

      {/* Cheatsheet List */}
      <div className="space-y-3">
        {filteredCheatsheets.map(cs => {
          const isExpanded = expandedIds.has(cs.id);
          const entryCount = cs.entries.length;
          const hasQuickRefs = cs.quick_references && cs.quick_references.length > 0;
          
          return (
            <div
              key={cs.id}
              className="group rounded-lg border border-border bg-card overflow-hidden hover:border-foreground/20 transition-colors"
            >
              <Link
                href={`/cheatsheets/${cs.id}`}
                className="block"
              >
                <div className="p-4 flex flex-col gap-3">
                  {/* Header row */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h2 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors">
                          <HighlightMatch text={cs.name} match={searchQuery} />
                        </h2>
                        <ContentTypeBadge type="cheatsheet" />
                      </div>
                      
                      {/* Metadata badges */}
                      <div className="flex flex-wrap items-center gap-1.5 mt-2">
                        {cs.difficulty && (
                          <span className={cn(
                            "text-[10px] font-mono px-1.5 py-0.5 rounded border capitalize",
                            getDifficultyBadgeClass(cs.difficulty)
                          )}>
                            {cs.difficulty}
                          </span>
                        )}
                        {cs.domain && (
                          <span className="text-[10px] font-mono text-muted-foreground capitalize">
                            {cs.domain.replace(/_/g, ' ')}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {/* Entry count badge */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="text-[10px] font-mono text-muted-foreground bg-muted/50 px-2 py-1 rounded">
                        {entryCount} {entryCount === 1 ? 'entry' : 'entries'}
                      </span>
                    </div>
                  </div>

                  {/* Quick reference preview (when expanded) */}
                  {isExpanded && hasQuickRefs && (
                    <div className="grid gap-3 md:grid-cols-2 pt-2 border-t border-border/50">
                      {cs.quick_references!.slice(0, 2).map((ref, idx) => (
                        <div key={idx}>
                          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground block mb-1">
                            {ref.title}
                          </span>
                          <div className="text-[10px] font-mono text-muted-foreground">
                            {ref.headers.slice(0, 3).join(' | ')}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Description preview */}
                  <p className={cn(
                    "text-xs text-muted-foreground leading-relaxed transition-all",
                    isExpanded ? "line-clamp-none" : "line-clamp-2"
                  )}>
                    {cs.description}
                  </p>

                  {/* Expand/collapse button */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      toggleExpand(cs.id);
                    }}
                    className="flex items-center gap-1 text-[10px] font-medium text-primary hover:text-primary/80 transition-colors ml-auto touch-target-sm"
                    aria-label={isExpanded ? 'Collapse details' : 'Expand details'}
                  >
                    {isExpanded ? (
                      <>
                        <ChevronDown className="w-3.5 h-3.5" />
                        Show less
                      </>
                    ) : (
                      <>
                        <ChevronRight className="w-3.5 h-3.5" />
                        Show more
                      </>
                    )}
                  </button>
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}