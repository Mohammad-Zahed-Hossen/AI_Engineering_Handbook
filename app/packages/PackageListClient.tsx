'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronRight } from 'lucide-react';
import type { Package } from '@/types/package';
import { cn } from '@/lib/utils';
import ContentTypeBadge from '@/components/shared/ContentTypeBadge';
import SearchFilterToolbar from '@/components/shared/SearchFilterToolbar';
import HighlightMatch from '@/components/shared/HighlightMatch';

interface PackageListClientProps {
  packages: Package[];
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

// Get maturity badge styling
const getMaturityBadgeClass = (maturity: string | undefined) => {
  const isProductionReady = maturity === 'production_ready' || maturity === 'production_proven';
  const isExperimental = maturity === 'experimental' || maturity === 'research';
  
  if (isProductionReady) {
    return 'text-emerald-700 dark:text-emerald-400 border-emerald-200 bg-emerald-50 dark:border-emerald-500/30 dark:bg-emerald-500/10';
  }
  if (isExperimental) {
    return 'text-amber-700 dark:text-amber-400 border-amber-200 bg-amber-50 dark:border-amber-500/30 dark:bg-amber-500/10';
  }
  return 'text-muted-foreground border-border bg-muted';
};

// Get unique values for filters
const getUniqueValues = <T extends string>(packages: Package[], key: keyof Package): T[] => {
  const values = new Set<T>();
  packages.forEach(pkg => {
    const val = pkg[key];
    if (val) values.add(val as T);
  });
  return Array.from(values).sort();
};

export default function PackageListClient({ packages }: PackageListClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulties, setSelectedDifficulties] = useState<string[]>([]);
  const [selectedMaturities, setSelectedMaturities] = useState<string[]>([]);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  // Get unique filter options
  const difficultyOptions = useMemo(() => getUniqueValues(packages, 'difficulty'), [packages]);
  const maturityOptions = useMemo(() => getUniqueValues(packages, 'engineering_maturity'), [packages]);

  // Filter packages based on search and filters
  const filteredPackages = useMemo(() => {
    return packages.filter(pkg => {
      const matchesSearch = searchQuery === '' || 
        pkg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pkg.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pkg.tasks.some(task => task.task.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesDifficulty = selectedDifficulties.length === 0 || 
        selectedDifficulties.includes(pkg.difficulty || '');

      const matchesMaturity = selectedMaturities.length === 0 || 
        selectedMaturities.includes(pkg.engineering_maturity || '');

      return matchesSearch && matchesDifficulty && matchesMaturity;
    });
  }, [packages, searchQuery, selectedDifficulties, selectedMaturities]);

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

  const toggleMaturity = (opt: string) => {
    if (selectedMaturities.includes(opt)) {
      setSelectedMaturities(selectedMaturities.filter(m => m !== opt));
    } else {
      setSelectedMaturities(prev => [...prev, opt]);
    }
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedDifficulties([]);
    setSelectedMaturities([]);
  };

  const activeFilters = [
    ...selectedDifficulties.map(d => ({ label: `Difficulty: ${d}`, value: d, onRemove: () => toggleDifficulty(d) })),
    ...selectedMaturities.map(m => ({ label: `Maturity: ${m.replace(/_/g, ' ')}`, value: m, onRemove: () => toggleMaturity(m) })),
  ];

  return (
    <div className="space-y-4">
      {/* Search and Filters Toolbar */}
      <SearchFilterToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search packages by name, task, or description..."
        showClearSearch={true}
        activeFilters={activeFilters}
        onClearAll={activeFilters.length > 0 || searchQuery.length > 0 ? clearAllFilters : undefined}
        resultCount={filteredPackages.length}
        totalCount={packages.length}
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

            {/* Maturity filters */}
            {maturityOptions.length > 0 && (
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground block mb-1.5">
                  Maturity
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {maturityOptions.map(opt => (
                    <button
                      key={opt}
                      onClick={() => toggleMaturity(opt)}
                      className={cn(
                        "px-2.5 py-1 text-[10px] font-mono font-medium rounded border capitalize transition-colors touch-target",
                        selectedMaturities.includes(opt)
                          ? "bg-primary/10 text-primary border-primary/20"
                          : getMaturityBadgeClass(opt)
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
      {filteredPackages.length === 0 && (
        <div className="p-8 text-center text-sm bg-card border border-border rounded-lg text-muted-foreground select-none">
          No packages match the selected search or filter criteria.
        </div>
      )}

      {/* Package List */}
      <div className="space-y-3">
        {filteredPackages.map(pkg => {
          const isExpanded = expandedIds.has(pkg.id);
          const taskCount = pkg.tasks.length;
          const hasInstall = !!pkg.install;
          const hasImport = !!pkg.import_as;
          
          return (
            <div
              key={pkg.id}
              className="group rounded-lg border border-border bg-card overflow-hidden hover:border-foreground/20 transition-colors"
            >
              <Link
                href={`/packages/${pkg.id}`}
                className="block"
              >
                <div className="p-4 flex flex-col gap-3">
                  {/* Header row */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h2 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors">
                          <HighlightMatch text={pkg.name} match={searchQuery} />
                        </h2>
                        <ContentTypeBadge type="package" />
                        {pkg.version && (
                          <span className="text-[10px] font-mono text-muted-foreground border border-border bg-muted px-1.5 py-0.5 rounded">
                            v{pkg.version}
                          </span>
                        )}
                      </div>
                      
                      {/* Metadata badges */}
                      <div className="flex flex-wrap items-center gap-1.5 mt-2">
                        {pkg.difficulty && (
                          <span className={cn(
                            "text-[10px] font-mono px-1.5 py-0.5 rounded border capitalize",
                            getDifficultyBadgeClass(pkg.difficulty)
                          )}>
                            {pkg.difficulty}
                          </span>
                        )}
                        {pkg.engineering_maturity && (
                          <span className={cn(
                            "text-[10px] font-mono px-1.5 py-0.5 rounded border capitalize",
                            getMaturityBadgeClass(pkg.engineering_maturity)
                          )}>
                            {pkg.engineering_maturity.replace(/_/g, ' ')}
                          </span>
                        )}
                        {pkg.domain && (
                          <span className="text-[10px] font-mono text-muted-foreground capitalize">
                            {pkg.domain.replace(/_/g, ' ')}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {/* Task count badge */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="text-[10px] font-mono text-muted-foreground bg-muted/50 px-2 py-1 rounded">
                        {taskCount} {taskCount === 1 ? 'task' : 'tasks'}
                      </span>
                    </div>
                  </div>

                  {/* Quick setup preview (when expanded) */}
                  {isExpanded && (hasInstall || hasImport) && (
                    <div className="grid gap-3 md:grid-cols-2 pt-2 border-t border-border/50">
                      {hasInstall && (
                        <div>
                          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground block mb-1">
                            Install
                          </span>
                          <code className="text-[10px] font-mono bg-muted/50 px-2 py-1 rounded text-foreground block truncate">
                            {pkg.install}
                          </code>
                        </div>
                      )}
                      {hasImport && (
                        <div>
                          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground block mb-1">
                            Import
                          </span>
                          <code className="text-[10px] font-mono bg-muted/50 px-2 py-1 rounded text-foreground block truncate">
                            {pkg.import_as}
                          </code>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Summary preview */}
                  <p className={cn(
                    "text-xs text-muted-foreground leading-relaxed transition-all",
                    isExpanded ? "line-clamp-none" : "line-clamp-2"
                  )}>
                    {pkg.summary}
                  </p>

                  {/* Expand/collapse button */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      toggleExpand(pkg.id);
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