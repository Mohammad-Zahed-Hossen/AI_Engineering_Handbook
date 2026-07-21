'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import FilterBar from '@/components/shared/FilterBar';
import { Workflow } from '@/types/workflow';
import { Search, ChevronDown, ChevronUp } from 'lucide-react';

interface WorkflowFilterClientProps {
  workflows: Workflow[];
}

export default function WorkflowFilterClient({ workflows }: WorkflowFilterClientProps) {
  // Extract unique values for filters
  const categories = useMemo(() => {
    const cats = new Set(workflows.map(w => w.category).filter(Boolean));
    return Array.from(cats).sort() as string[];
  }, [workflows]);

  const difficulties = useMemo(() => {
    const diffs = new Set(workflows.map(w => w.difficulty).filter(Boolean));
    return Array.from(diffs).sort() as string[];
  }, [workflows]);

  const maturities = useMemo(() => {
    const mats = new Set(workflows.map(w => w.engineering_maturity).filter(Boolean));
    return Array.from(mats).sort() as string[];
  }, [workflows]);

  // Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedDifficulties, setSelectedDifficulties] = useState<string[]>([]);
  const [selectedMaturities, setSelectedMaturities] = useState<string[]>([]);
  const [isFiltersExpanded, setIsFiltersExpanded] = useState(false);

  // Filter workflows
  const filteredWorkflows = useMemo(() => {
    return workflows.filter(wf => {
      const matchesSearch = searchQuery === '' || 
        wf.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        wf.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        wf.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        wf.id?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategories.length === 0 || 
        (wf.category && selectedCategories.includes(wf.category));
      const matchesDifficulty = selectedDifficulties.length === 0 || 
        (wf.difficulty && selectedDifficulties.includes(wf.difficulty));
      const matchesMaturity = selectedMaturities.length === 0 || 
        (wf.engineering_maturity && selectedMaturities.includes(wf.engineering_maturity));
      
      return matchesSearch && matchesCategory && matchesDifficulty && matchesMaturity;
    });
  }, [workflows, searchQuery, selectedCategories, selectedDifficulties, selectedMaturities]);

  // Group workflows by category
  const groupedWorkflows = useMemo(() => {
    const groups: Record<string, Workflow[]> = {};
    filteredWorkflows.forEach(wf => {
      const cat = wf.category || 'Uncategorized';
      if (!groups[cat]) {
        groups[cat] = [];
      }
      groups[cat].push(wf);
    });
    return groups;
  }, [filteredWorkflows]);

  const categoryOrder = Object.keys(groupedWorkflows).sort();

  // Clear all filters
  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedCategories([]);
    setSelectedDifficulties([]);
    setSelectedMaturities([]);
  };

  const totalActiveFilters = selectedCategories.length + selectedDifficulties.length + 
    selectedMaturities.length;

  const getDifficultyBadgeClass = (difficulty: string) => {
    if (difficulty === 'beginner') {
      return 'text-emerald-600 border-emerald-200 bg-emerald-50 dark:text-emerald-400 dark:border-emerald-500/30 dark:bg-emerald-500/10';
    }
    if (difficulty === 'intermediate') {
      return 'text-amber-600 border-amber-200 bg-amber-50 dark:text-amber-400 dark:border-amber-500/30 dark:bg-amber-500/10';
    }
    if (difficulty === 'advanced') {
      return 'text-red-600 border-red-200 bg-red-50 dark:text-red-400 dark:border-red-500/30 dark:bg-red-500/10';
    }
    return 'text-muted-foreground border-border bg-muted';
  };

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

  // Compute stats
  const uniqueCategories = new Set(workflows.map(w => w.category)).size;
  const productionReady = workflows.filter(w => w.engineering_maturity === 'production_ready').length;
  const totalSteps = workflows.reduce((sum, w) => sum + (w.steps?.length || 0), 0);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Workflows</h1>
          {(totalActiveFilters > 0 || searchQuery) && (
            <button
              onClick={clearAllFilters}
              className="text-xs text-rose-500 hover:text-rose-600 font-medium touch-target-sm"
            >
              Clear All ({totalActiveFilters + (searchQuery ? 1 : 0)})
            </button>
          )}
        </div>
        <p className="text-xs text-muted-foreground max-w-2xl leading-relaxed">
          End-to-end engineering workflows and pipelines for AI/ML projects.
          From data pipelines and model training to deployment and production monitoring.
        </p>
      </div>

      {/* Statistics Dashboard - mobile first: 2 columns, then 3, then 4 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        <div className="bg-card border border-border rounded-lg p-3">
          <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Workflows</div>
          <div className="text-lg font-bold text-foreground font-mono">{workflows.length}</div>
        </div>
        <div className="bg-card border border-border rounded-lg p-3">
          <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Categories</div>
          <div className="text-lg font-bold text-foreground font-mono">{uniqueCategories}</div>
        </div>
        <div className="bg-card border border-border rounded-lg p-3">
          <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Production</div>
          <div className="text-lg font-bold text-emerald-600 font-mono">{productionReady}</div>
        </div>
        <div className="bg-card border border-border rounded-lg p-3">
          <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Steps</div>
          <div className="text-lg font-bold text-indigo-600 font-mono">{totalSteps}</div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search workflows by name or description..."
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

      {/* Workflow List */}
      <div className="space-y-4">
        {filteredWorkflows.length === 0 ? (
          <div className="p-8 text-center text-sm text-muted-foreground bg-card border border-border rounded-lg">
            No workflows match the selected filter criteria.
          </div>
        ) : (
          categoryOrder.map(category => {
            const workflowsInCategory = groupedWorkflows[category];
            return (
              <div key={category} className="border border-border rounded-lg bg-card overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 bg-muted/10 border-b border-border">
                  <h3 className="text-sm font-semibold text-foreground capitalize">
                    {category.replace(/-/g, ' ')}
                  </h3>
                  <span className="text-xs text-muted-foreground">
                    {workflowsInCategory.length}
                  </span>
                </div>
                <div className="p-2.5 min-[360px]:p-3 space-y-2.5 min-[390px]:space-y-3">
                  {workflowsInCategory.map(wf => (
                    <Link
                      key={wf.id}
                      href={`/workflows/${wf.id}`}
                      className="block rounded-lg border border-border bg-card mobile-card-padding hover:border-foreground/20 hover:bg-muted/30 transition-colors touch-target"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <h2 className="text-sm font-medium text-foreground">{wf.name || wf.title}</h2>
                          <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                            {wf.description}
                          </p>
                          <div className="flex flex-wrap items-center gap-2 mt-3">
                            {wf.category && (
                              <span className="text-[10px] font-mono text-muted-foreground bg-muted/50 px-1.5 py-0.5 rounded">
                                {wf.category}
                              </span>
                            )}
                            <span className="text-[10px] font-mono text-muted-foreground/70">
                              {wf.steps?.length || 0} {((wf.steps?.length || 0) === 1) ? 'step' : 'steps'}
                            </span>
                            {wf.difficulty && (
                              <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded border capitalize ${getDifficultyBadgeClass(wf.difficulty)}`}>
                                {wf.difficulty}
                              </span>
                            )}
                            {wf.engineering_maturity && (
                              <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded border capitalize ${getMaturityBadgeClass(wf.engineering_maturity)}`}>
                                {wf.engineering_maturity.replace(/_/g, ' ')}
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