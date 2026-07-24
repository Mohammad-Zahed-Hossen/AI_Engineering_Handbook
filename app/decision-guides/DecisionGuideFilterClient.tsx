'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { BarChart3, GitCompare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DecisionGuide } from '@/types/decision-guide';
import FilterBar from '@/components/shared/FilterBar';
import SearchFilterToolbar from '@/components/shared/SearchFilterToolbar';
import HighlightMatch from '@/components/shared/HighlightMatch';

interface DecisionGuideFilterClientProps {
  decisionGuides: DecisionGuide[];
}

// Category display names
const categoryLabels: Record<string, string> = {
  models: 'Models',
  frameworks: 'Frameworks',
  llm: 'LLM',
  infrastructure: 'Infrastructure',
  data_processing: 'Data Processing',
  deployment: 'Deployment',
};

// Difficulty badge styles
const getDifficultyBadgeClass = (difficulty: string) => {
  switch (difficulty) {
    case 'beginner':
      return 'text-green-600 border-green-200 bg-green-50 dark:text-green-400 dark:border-green-500/30 dark:bg-green-500/10';
    case 'intermediate':
      return 'text-blue-600 border-blue-200 bg-blue-50 dark:text-blue-400 dark:border-blue-500/30 dark:bg-blue-500/10';
    case 'advanced':
      return 'text-amber-600 border-amber-200 bg-amber-50 dark:text-amber-400 dark:border-amber-500/30 dark:bg-amber-500/10';
    case 'expert':
      return 'text-purple-600 border-purple-200 bg-purple-50 dark:text-purple-400 dark:border-purple-500/30 dark:bg-purple-500/10';
    default:
      return 'text-muted-foreground border-border bg-muted';
  }
};

// Lifecycle badge styles
const getLifecycleBadgeClass = (lifecycle: string) => {
  switch (lifecycle) {
    case 'stable':
      return 'text-emerald-600 border-emerald-200 bg-emerald-50 dark:text-emerald-400 dark:border-emerald-500/30 dark:bg-emerald-500/10';
    case 'verified':
      return 'text-blue-600 border-blue-200 bg-blue-50 dark:text-blue-400 dark:border-blue-500/30 dark:bg-blue-500/10';
    case 'draft':
      return 'text-slate-600 border-slate-200 bg-slate-50 dark:text-slate-400 dark:border-slate-500/30 dark:bg-slate-500/10';
    case 'deprecated':
      return 'text-rose-600 border-rose-200 bg-rose-50 dark:text-rose-400 dark:border-rose-500/30 dark:bg-rose-500/10';
    default:
      return 'text-muted-foreground border-border bg-muted';
  }
};

export default function DecisionGuideFilterClient({ decisionGuides }: DecisionGuideFilterClientProps) {
  // Extract unique values for filters
  const categories = useMemo(() => {
    const cats = new Set(decisionGuides.map(dg => dg.category).filter(Boolean));
    return Array.from(cats).sort() as string[];
  }, [decisionGuides]);

  const difficulties = useMemo(() => {
    const diffs = new Set(decisionGuides.map(dg => dg.difficulty).filter(Boolean));
    return Array.from(diffs).sort() as string[];
  }, [decisionGuides]);

  const lifecycles = useMemo(() => {
    const ls = new Set(decisionGuides.map(dg => dg.lifecycle).filter(Boolean));
    return Array.from(ls).sort() as string[];
  }, [decisionGuides]);

  // Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedDifficulties, setSelectedDifficulties] = useState<string[]>([]);
  const [selectedLifecycles, setSelectedLifecycles] = useState<string[]>([]);

  // Filter decision guides
  const filteredGuides = useMemo(() => {
    return decisionGuides.filter(dg => {
      const matchesSearch = searchQuery === '' || 
        dg.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dg.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dg.id?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategories.length === 0 || 
        (dg.category && selectedCategories.includes(dg.category));
      
      const matchesDifficulty = selectedDifficulties.length === 0 || 
        (dg.difficulty && selectedDifficulties.includes(dg.difficulty));
      
      const matchesLifecycle = selectedLifecycles.length === 0 || 
        (dg.lifecycle && selectedLifecycles.includes(dg.lifecycle));
      
      return matchesSearch && matchesCategory && matchesDifficulty && matchesLifecycle;
    });
  }, [decisionGuides, searchQuery, selectedCategories, selectedDifficulties, selectedLifecycles]);

  // Group guides by category
  const groupedGuides = useMemo(() => {
    const groups: Record<string, DecisionGuide[]> = {};
    filteredGuides.forEach(dg => {
      const cat = dg.category || 'Uncategorized';
      if (!groups[cat]) {
        groups[cat] = [];
      }
      groups[cat].push(dg);
    });
    return groups;
  }, [filteredGuides]);

  const categoryOrder = Object.keys(groupedGuides).sort();

  // Clear all filters
  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedCategories([]);
    setSelectedDifficulties([]);
    setSelectedLifecycles([]);
  };

  const activeFilters = [
    ...selectedCategories.map(c => ({ label: `Category: ${categoryLabels[c] || c}`, value: c, onRemove: () => setSelectedCategories(prev => prev.filter(item => item !== c)) })),
    ...selectedDifficulties.map(d => ({ label: `Difficulty: ${d}`, value: d, onRemove: () => setSelectedDifficulties(prev => prev.filter(item => item !== d)) })),
    ...selectedLifecycles.map(l => ({ label: `Lifecycle: ${l}`, value: l, onRemove: () => setSelectedLifecycles(prev => prev.filter(item => item !== l)) })),
  ];

  return (
    <div className="space-y-6">
      {/* Header with title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Decision Guides</h1>
      </div>

      {/* Search Bar & Filters Toolbar */}
      <SearchFilterToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search decision guides by title or description..."
        showClearSearch={true}
        activeFilters={activeFilters}
        onClearAll={activeFilters.length > 0 || searchQuery.length > 0 ? clearAllFilters : undefined}
        resultCount={filteredGuides.length}
        totalCount={decisionGuides.length}
        moreFiltersContent={
          <div className="space-y-3">
            <FilterBar
              label="Category"
              options={categories}
              selectedOptions={selectedCategories}
              onToggle={(cat) => setSelectedCategories(prev => 
                prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
              )}
              onClear={() => setSelectedCategories([])}
            />
            <FilterBar
              label="Difficulty"
              options={difficulties}
              selectedOptions={selectedDifficulties}
              onToggle={(diff) => setSelectedDifficulties(prev => 
                prev.includes(diff) ? prev.filter(d => d !== diff) : [...prev, diff]
              )}
              onClear={() => setSelectedDifficulties([])}
            />
            <FilterBar
              label="Lifecycle"
              options={lifecycles}
              selectedOptions={selectedLifecycles}
              onToggle={(lc) => setSelectedLifecycles(prev => 
                prev.includes(lc) ? prev.filter(l => l !== lc) : [...prev, lc]
              )}
              onClear={() => setSelectedLifecycles([])}
            />
          </div>
        }
      />

      {/* Decision Guide List */}
      <div className="space-y-4">
        {filteredGuides.length === 0 ? (
          <div className="p-8 text-center text-sm text-muted-foreground bg-card border border-border rounded-lg">
            No decision guides match the selected filter criteria.
          </div>
        ) : (
          categoryOrder.map(category => {
            const guidesInCategory = groupedGuides[category];
            return (
              <div key={category} className="border border-border rounded-lg bg-card overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 bg-muted/10 border-b border-border">
                  <h3 className="text-sm font-semibold text-foreground capitalize">
                    {categoryLabels[category] || category}
                  </h3>
                  <span className="text-xs text-muted-foreground">
                    {guidesInCategory.length}
                  </span>
                </div>
                <div className="p-2.5 min-[360px]:p-3 space-y-2.5 min-[390px]:space-y-3">
                  {guidesInCategory.map(dg => (
                    <Link
                      key={dg.id}
                      href={`/decision-guides/${dg.id}`}
                      className="block rounded-lg border border-border bg-card mobile-card-padding hover:border-foreground/20 hover:bg-muted/30 transition-colors touch-target"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <h2 className="text-sm font-medium text-foreground">
                            <HighlightMatch text={dg.title || dg.id} match={searchQuery} />
                          </h2>
                          <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                            {dg.description}
                          </p>
                          
                          {/* Metadata badges */}
                          <div className="flex flex-wrap items-center gap-2 mt-3">
                            {/* Options count badge */}
                            {dg.options && dg.options.length > 0 && (
                              <span className="text-[9px] font-mono text-muted-foreground flex items-center gap-1">
                                <GitCompare className="h-2.5 w-2.5" />
                                {dg.options.length} option{dg.options.length !== 1 ? 's' : ''}
                              </span>
                            )}
                            
                            {/* Criteria count badge */}
                            {dg.evaluation_criteria && dg.evaluation_criteria.length > 0 && (
                              <span className="text-[9px] font-mono text-muted-foreground flex items-center gap-1">
                                <BarChart3 className="h-2.5 w-2.5" />
                                {dg.evaluation_criteria.length} criteria
                              </span>
                            )}
                            
                            {/* Difficulty badge */}
                            {dg.difficulty && (
                              <span className={cn(
                                "text-[9px] font-mono px-1.5 py-0.5 rounded border capitalize",
                                getDifficultyBadgeClass(dg.difficulty)
                              )}>
                                {dg.difficulty}
                              </span>
                            )}
                            
                            {/* Lifecycle badge */}
                            {dg.lifecycle && (
                              <span className={cn(
                                "text-[9px] font-mono px-1.5 py-0.5 rounded border capitalize",
                                getLifecycleBadgeClass(dg.lifecycle)
                              )}>
                                {dg.lifecycle}
                              </span>
                            )}
                            
                            {/* Related content count */}
                            {((dg.related_workflows?.length || 0) + (dg.related_packages?.length || 0) + (dg.related_models?.length || 0)) > 0 && (
                              <span className="text-[9px] font-mono text-muted-foreground">
                                {dg.related_workflows?.length || 0} workflow{(dg.related_workflows?.length || 0) !== 1 ? 's' : ''}, {dg.related_packages?.length || 0} package{(dg.related_packages?.length || 0) !== 1 ? 's' : ''}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}