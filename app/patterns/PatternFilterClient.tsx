'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import FilterBar from '@/components/shared/FilterBar';
import { cn } from '@/lib/utils';
import { Pattern } from '@/types/pattern';
import { Search, ChevronDown, ChevronUp } from 'lucide-react';

interface PatternFilterClientProps {
  patterns: Pattern[];
}

export default function PatternFilterClient({ patterns }: PatternFilterClientProps) {
  // Extract unique values for filters
  const categories = useMemo(() => {
    const cats = new Set(patterns.map(p => p.category).filter(Boolean));
    return Array.from(cats).sort() as string[];
  }, [patterns]);

  const difficulties = useMemo(() => {
    const diffs = new Set(patterns.map(p => p.difficulty).filter(Boolean));
    return Array.from(diffs).sort() as string[];
  }, [patterns]);

  const engineeringAreas = useMemo(() => {
    const areas = new Set(patterns.map(p => p.engineering_area).filter(Boolean));
    return Array.from(areas).sort() as string[];
  }, [patterns]);

  const maturities = useMemo(() => {
    const mats = new Set(patterns.map(p => p.engineering_maturity).filter(Boolean));
    return Array.from(mats).sort() as string[];
  }, [patterns]);

  // Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedDifficulties, setSelectedDifficulties] = useState<string[]>([]);
  const [selectedEngineeringAreas, setSelectedEngineeringAreas] = useState<string[]>([]);
  const [selectedMaturities, setSelectedMaturities] = useState<string[]>([]);
  const [isFiltersExpanded, setIsFiltersExpanded] = useState(false);

  // Filter patterns
  const filteredPatterns = useMemo(() => {
    return patterns.filter(pattern => {
      const matchesSearch = searchQuery === '' || 
        pattern.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pattern.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pattern.id?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategories.length === 0 || 
        (pattern.category && selectedCategories.includes(pattern.category));
      const matchesDifficulty = selectedDifficulties.length === 0 || 
        (pattern.difficulty && selectedDifficulties.includes(pattern.difficulty));
      const matchesEngineeringArea = selectedEngineeringAreas.length === 0 || 
        (pattern.engineering_area && selectedEngineeringAreas.includes(pattern.engineering_area));
      const matchesMaturity = selectedMaturities.length === 0 || 
        (pattern.engineering_maturity && selectedMaturities.includes(pattern.engineering_maturity));
      
      return matchesSearch && matchesCategory && matchesDifficulty && matchesEngineeringArea && matchesMaturity;
    });
  }, [patterns, searchQuery, selectedCategories, selectedDifficulties, selectedEngineeringAreas, selectedMaturities]);

  // Group patterns by category
  const groupedPatterns = useMemo(() => {
    const groups: Record<string, Pattern[]> = {};
    filteredPatterns.forEach(pattern => {
      const cat = pattern.category || 'Uncategorized';
      if (!groups[cat]) {
        groups[cat] = [];
      }
      groups[cat].push(pattern);
    });
    return groups;
  }, [filteredPatterns]);

  const categoryOrder = Object.keys(groupedPatterns).sort();

  // Clear all filters
  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedCategories([]);
    setSelectedDifficulties([]);
    setSelectedEngineeringAreas([]);
    setSelectedMaturities([]);
  };

  const totalActiveFilters = selectedCategories.length + selectedDifficulties.length + 
    selectedEngineeringAreas.length + selectedMaturities.length;

  const getMaturityBadgeClass = (maturity: string) => {
    const isProductionReady = maturity === 'production_ready' || maturity === 'production_proven';
    const isExperimental = maturity === 'experimental' || maturity === 'research';
    
    if (isProductionReady) {
      return 'text-emerald-600 border-emerald-200 bg-emerald-50 dark:text-emerald-400 dark:border-emerald-500/30 dark:bg-emerald-500/10';
    }
    if (isExperimental) {
      return 'text-amber-600 border-amber-200 bg-amber-50 dark:text-amber-400 dark:border-amber-500/30 dark:bg-amber-500/10';
    }
    return 'text-muted-foreground border-border bg-muted';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Patterns</h1>
        {(totalActiveFilters > 0 || searchQuery) && (
          <button
            onClick={clearAllFilters}
            className="text-xs text-rose-500 hover:text-rose-600 font-medium touch-target-sm"
          >
            Clear All ({totalActiveFilters + (searchQuery ? 1 : 0)})
          </button>
        )}
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search patterns by name or description..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 text-sm border border-border rounded-lg bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent touch-target"
        />
      </div>

      {/* Collapsible Filters */}
      <div className="border border-border rounded-lg bg-card overflow-hidden">
        <button
          onClick={() => setIsFiltersExpanded(!isFiltersExpanded)}
          className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-foreground hover:bg-muted/50 transition-colors touch-target"
        >
          <span>Filters {totalActiveFilters > 0 && `(${totalActiveFilters} active)`}</span>
          {isFiltersExpanded ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          )}
        </button>
        
        {isFiltersExpanded && (
          <div className="border-t border-border p-4 space-y-3">
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
              label="Engineering Area"
              options={engineeringAreas}
              selectedOptions={selectedEngineeringAreas}
              onToggle={(area) => setSelectedEngineeringAreas(prev => 
                prev.includes(area) ? prev.filter(a => a !== area) : [...prev, area]
              )}
              onClear={() => setSelectedEngineeringAreas([])}
            />
            <FilterBar
              label="Maturity"
              options={maturities}
              selectedOptions={selectedMaturities}
              onToggle={(mat) => setSelectedMaturities(prev => 
                prev.includes(mat) ? prev.filter(m => m !== mat) : [...prev, mat]
              )}
              onClear={() => setSelectedMaturities([])}
            />
          </div>
        )}
      </div>

      {/* Pattern List */}
      <div className="space-y-4">
        {filteredPatterns.length === 0 ? (
          <div className="p-8 text-center text-sm text-muted-foreground bg-card border border-border rounded-lg">
            No patterns match the selected filter criteria.
          </div>
        ) : (
          categoryOrder.map(category => {
            const patternsInCategory = groupedPatterns[category];
            return (
              <div key={category} className="border border-border rounded-lg bg-card overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 bg-muted/10 border-b border-border">
                  <h3 className="text-sm font-semibold text-foreground capitalize">
                    {category}
                  </h3>
                  <span className="text-xs text-muted-foreground">
                    {patternsInCategory.length}
                  </span>
                </div>
                <div className="p-3 space-y-3">
                  {patternsInCategory.map(pattern => (
                    <Link
                      key={pattern.id}
                      href={`/patterns/${pattern.id}`}
                      className="block rounded-lg border border-border bg-card p-4 hover:border-foreground/20 hover:bg-muted/30 transition-colors touch-target"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <h2 className="text-sm font-medium text-foreground">{pattern.title || pattern.id}</h2>
                          <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                            {pattern.description}
                          </p>
                          <div className="flex flex-wrap items-center gap-2 mt-3">
                            {pattern.difficulty && (
                              <span className="text-[10px] font-mono capitalize text-muted-foreground">
                                {pattern.difficulty}
                              </span>
                            )}
                            {pattern.engineering_area && (
                              <span className="text-[10px] font-mono capitalize text-muted-foreground">
                                {pattern.engineering_area}
                              </span>
                            )}
                            {pattern.engineering_maturity && (
                              <span className={cn(
                                "text-[9px] font-mono px-1.5 py-0.5 rounded border capitalize",
                                getMaturityBadgeClass(pattern.engineering_maturity)
                              )}>
                                {pattern.engineering_maturity.replace(/_/g, ' ')}
                              </span>
                            )}
                            {pattern.estimated_reading_time && (
                              <span className="text-[9px] font-mono text-muted-foreground">
                                {pattern.estimated_reading_time} min read
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