'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, ChevronDown, ChevronUp, Lightbulb, BookOpen, GitCompare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Principle, PrincipleCategory } from '@/types/principle';
import FilterBar from '@/components/shared/FilterBar';

interface PrincipleFilterClientProps {
  principles: Principle[];
}

// Category display names
const categoryLabels: Record<PrincipleCategory, string> = {
  learning_theory: 'Learning Theory',
  optimization: 'Optimization',
  representation: 'Representation',
  systems: 'Systems',
  information_theory: 'Information Theory',
  statistics: 'Statistics',
  probability: 'Probability',
};


// Engineering maturity badge styles
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

export default function PrincipleFilterClient({ principles }: PrincipleFilterClientProps) {
  // Extract unique values for filters
  const categories = useMemo(() => {
    const cats = new Set(principles.map(p => p.category).filter(Boolean));
    return Array.from(cats).sort() as string[];
  }, [principles]);

  const engineeringAreas = useMemo(() => {
    const areas = new Set(principles.map(p => p.engineering_area).filter(Boolean));
    return Array.from(areas).sort() as string[];
  }, [principles]);

  const maturities = useMemo(() => {
    const mats = new Set(principles.map(p => p.engineering_maturity).filter(Boolean));
    return Array.from(mats).sort() as string[];
  }, [principles]);

  // Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedEngineeringAreas, setSelectedEngineeringAreas] = useState<string[]>([]);
  const [selectedMaturities, setSelectedMaturities] = useState<string[]>([]);
  const [isFiltersExpanded, setIsFiltersExpanded] = useState(false);

  // Filter principles
  const filteredPrinciples = useMemo(() => {
    return principles.filter(principle => {
      const matchesSearch = searchQuery === '' || 
        principle.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        principle.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        principle.id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (principle.statement && principle.statement.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = selectedCategories.length === 0 || 
        (principle.category && selectedCategories.includes(principle.category));
      
      const matchesEngineeringArea = selectedEngineeringAreas.length === 0 || 
        (principle.engineering_area && selectedEngineeringAreas.includes(principle.engineering_area));
      
      const matchesMaturity = selectedMaturities.length === 0 || 
        (principle.engineering_maturity && selectedMaturities.includes(principle.engineering_maturity));
      
      return matchesSearch && matchesCategory && matchesEngineeringArea && matchesMaturity;
    });
  }, [principles, searchQuery, selectedCategories, selectedEngineeringAreas, selectedMaturities]);

  // Group principles by category
  const groupedPrinciples = useMemo(() => {
    const groups: Record<string, Principle[]> = {};
    filteredPrinciples.forEach(principle => {
      const cat = principle.category || 'Uncategorized';
      if (!groups[cat]) {
        groups[cat] = [];
      }
      groups[cat].push(principle);
    });
    return groups;
  }, [filteredPrinciples]);

  const categoryOrder = Object.keys(groupedPrinciples).sort();

  // Clear all filters
  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedCategories([]);
    setSelectedEngineeringAreas([]);
    setSelectedMaturities([]);
  };

  const totalActiveFilters = selectedCategories.length + selectedEngineeringAreas.length + selectedMaturities.length;

  return (
    <div className="space-y-6">
      {/* Header with title and clear filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Principles</h1>
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
          placeholder="Search principles by name, description, or statement..."
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

      {/* Principle List */}
      <div className="space-y-4">
        {filteredPrinciples.length === 0 ? (
          <div className="p-8 text-center text-sm text-muted-foreground bg-card border border-border rounded-lg">
            No principles match the selected filter criteria.
          </div>
        ) : (
          categoryOrder.map(category => {
            const principlesInCategory = groupedPrinciples[category];
            return (
              <div key={category} className="border border-border rounded-lg bg-card overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 bg-muted/10 border-b border-border">
                  <h3 className="text-sm font-semibold text-foreground">
                    {categoryLabels[category as PrincipleCategory] || category}
                  </h3>
                  <span className="text-xs text-muted-foreground">
                    {principlesInCategory.length}
                  </span>
                </div>
                <div className="p-2.5 min-[360px]:p-3 space-y-2.5 min-[390px]:space-y-3">
                  {principlesInCategory.map(principle => (
                    <Link
                      key={principle.id}
                      href={`/principles/${principle.id}`}
                      className="block rounded-lg border border-border bg-card mobile-card-padding hover:border-foreground/20 hover:bg-muted/30 transition-colors touch-target"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <h2 className="text-sm font-medium text-foreground">{principle.title || principle.id}</h2>
                          <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                            {principle.description}
                          </p>
                          
                          {/* Metadata badges */}
                          <div className="flex flex-wrap items-center gap-2 mt-3">
                            {/* Engineering consequences count */}
                            {principle.engineering_consequences && principle.engineering_consequences.length > 0 && (
                              <span className="text-[9px] font-mono text-muted-foreground flex items-center gap-1">
                                <Lightbulb className="h-2.5 w-2.5" />
                                {principle.engineering_consequences.length} consequence{principle.engineering_consequences.length !== 1 ? 's' : ''}
                              </span>
                            )}
                            
                            {/* Decision checklist count */}
                            {principle.decision_checklist && principle.decision_checklist.length > 0 && (
                              <span className="text-[9px] font-mono text-muted-foreground flex items-center gap-1">
                                <GitCompare className="h-2.5 w-2.5" />
                                {principle.decision_checklist.length} check{principle.decision_checklist.length !== 1 ? 's' : ''}
                              </span>
                            )}
                            
                            {/* Related content count */}
                            {((principle.referenced_by_patterns?.length || 0) + 
                              (principle.referenced_by_models?.length || 0) + 
                              (principle.referenced_by_workflows?.length || 0)) > 0 && (
                              <span className="text-[9px] font-mono text-muted-foreground flex items-center gap-1">
                                <BookOpen className="h-2.5 w-2.5" />
                                {principle.referenced_by_patterns?.length || 0} pattern{(principle.referenced_by_patterns?.length || 0) !== 1 ? 's' : ''}, {principle.referenced_by_models?.length || 0} model{(principle.referenced_by_models?.length || 0) !== 1 ? 's' : ''}
                              </span>
                            )}
                            
                            {/* Maturity badge */}
                            {principle.engineering_maturity && (
                              <span className={cn(
                                "text-[9px] font-mono px-1.5 py-0.5 rounded border capitalize",
                                getMaturityBadgeClass(principle.engineering_maturity)
                              )}>
                                {principle.engineering_maturity.replace(/_/g, ' ')}
                              </span>
                            )}
                            
                            {/* Reading time */}
                            {principle.estimated_reading_time && (
                              <span className="text-[9px] font-mono text-muted-foreground">
                                {principle.estimated_reading_time} min read
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