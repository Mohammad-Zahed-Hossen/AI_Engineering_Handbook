'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, ChevronDown, ChevronUp, AlertCircle, Clock, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DebugGuide } from '@/types/debug-guide';
import FilterBar from '@/components/shared/FilterBar';

interface DebugGuideFilterClientProps {
  debugGuides: DebugGuide[];
}

// Category display names
const categoryLabels: Record<string, string> = {
  training: 'Training',
  gpu: 'GPU',
  data: 'Data',
  llm: 'LLM',
  python: 'Python',
  deployment: 'Deployment',
  performance: 'Performance',
  memory: 'Memory',
};

// Severity badge styles
const getSeverityBadgeClass = (severity: string) => {
  switch (severity) {
    case 'critical':
      return 'text-red-600 border-red-200 bg-red-50 dark:text-red-400 dark:border-red-500/30 dark:bg-red-500/10';
    case 'high':
      return 'text-orange-600 border-orange-200 bg-orange-50 dark:text-orange-400 dark:border-orange-500/30 dark:bg-orange-500/10';
    case 'medium':
      return 'text-amber-600 border-amber-200 bg-amber-50 dark:text-amber-400 dark:border-amber-500/30 dark:bg-amber-500/10';
    case 'low':
      return 'text-blue-600 border-blue-200 bg-blue-50 dark:text-blue-400 dark:border-blue-500/30 dark:bg-blue-500/10';
    default:
      return 'text-muted-foreground border-border bg-muted';
  }
};

// Frequency display
const getFrequencyLabel = (frequency: string) => {
  switch (frequency) {
    case 'common':
      return 'Common';
    case 'occasional':
      return 'Occasional';
    case 'rare':
      return 'Rare';
    default:
      return null;
  }
};

// Stage display
const getStageLabel = (stage: string) => {
  switch (stage) {
    case 'development':
      return 'Dev';
    case 'testing':
      return 'Test';
    case 'production':
      return 'Prod';
    case 'any':
      return 'Any';
    default:
      return null;
  }
};

export default function DebugGuideFilterClient({ debugGuides }: DebugGuideFilterClientProps) {
  // Extract unique values for filters
  const categories = useMemo(() => {
    const cats = new Set(debugGuides.map(dg => dg.category).filter(Boolean));
    return Array.from(cats).sort() as string[];
  }, [debugGuides]);

  const severities = useMemo(() => {
    const s = new Set(debugGuides.map(dg => dg.overview?.severity).filter(Boolean));
    return Array.from(s).sort() as string[];
  }, [debugGuides]);

  const frequencies = useMemo(() => {
    const f = new Set(debugGuides.map(dg => dg.overview?.frequency).filter(Boolean));
    return Array.from(f).sort() as string[];
  }, [debugGuides]);

  // Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSeverities, setSelectedSeverities] = useState<string[]>([]);
  const [selectedFrequencies, setSelectedFrequencies] = useState<string[]>([]);
  const [isFiltersExpanded, setIsFiltersExpanded] = useState(false);

  // Filter debug guides
  const filteredGuides = useMemo(() => {
    return debugGuides.filter(dg => {
      const matchesSearch = searchQuery === '' || 
        dg.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dg.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dg.id?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategories.length === 0 || 
        (dg.category && selectedCategories.includes(dg.category));
      
      const matchesSeverity = selectedSeverities.length === 0 || 
        (dg.overview?.severity && selectedSeverities.includes(dg.overview.severity));
      
      const matchesFrequency = selectedFrequencies.length === 0 || 
        (dg.overview?.frequency && selectedFrequencies.includes(dg.overview.frequency));
      
      return matchesSearch && matchesCategory && matchesSeverity && matchesFrequency;
    });
  }, [debugGuides, searchQuery, selectedCategories, selectedSeverities, selectedFrequencies]);

  // Group guides by category
  const groupedGuides = useMemo(() => {
    const groups: Record<string, DebugGuide[]> = {};
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
    setSelectedSeverities([]);
    setSelectedFrequencies([]);
  };

  const totalActiveFilters = selectedCategories.length + selectedSeverities.length + selectedFrequencies.length;

  return (
    <div className="space-y-6">
      {/* Header with title and clear filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Debug Guides</h1>
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
          placeholder="Search debug guides by name, description, or ID..."
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
              label="Severity"
              options={severities}
              selectedOptions={selectedSeverities}
              onToggle={(sev) => setSelectedSeverities(prev => 
                prev.includes(sev) ? prev.filter(s => s !== sev) : [...prev, sev]
              )}
              onClear={() => setSelectedSeverities([])}
            />
            <FilterBar
              label="Frequency"
              options={frequencies}
              selectedOptions={selectedFrequencies}
              onToggle={(freq) => setSelectedFrequencies(prev => 
                prev.includes(freq) ? prev.filter(f => f !== freq) : [...prev, freq]
              )}
              onClear={() => setSelectedFrequencies([])}
            />
          </div>
        )}
      </div>

      {/* Debug Guide List */}
      <div className="space-y-4">
        {filteredGuides.length === 0 ? (
          <div className="p-8 text-center text-sm text-muted-foreground bg-card border border-border rounded-lg">
            No debug guides match the selected filter criteria.
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
                      href={`/debug-guides/${dg.id}`}
                      className="block rounded-lg border border-border bg-card mobile-card-padding hover:border-foreground/20 hover:bg-muted/30 transition-colors touch-target"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <h2 className="text-sm font-medium text-foreground">{dg.title || dg.id}</h2>
                          <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                            {dg.description}
                          </p>
                          
                          {/* Metadata badges */}
                          <div className="flex flex-wrap items-center gap-2 mt-3">
                            {/* Severity badge */}
                            {dg.overview?.severity && (
                              <span className={cn(
                                "text-[9px] font-mono px-1.5 py-0.5 rounded border capitalize",
                                getSeverityBadgeClass(dg.overview.severity)
                              )}>
                                {dg.overview.severity}
                              </span>
                            )}
                            
                            {/* Frequency badge */}
                            {dg.overview?.frequency && (
                              <span className="text-[9px] font-mono text-muted-foreground capitalize">
                                {getFrequencyLabel(dg.overview.frequency)}
                              </span>
                            )}
                            
                            {/* Stage badge */}
                            {dg.overview?.typical_stage && (
                              <span className="text-[9px] font-mono text-muted-foreground capitalize">
                                {getStageLabel(dg.overview.typical_stage)}
                              </span>
                            )}
                            
                            {/* Estimated fix time */}
                            {dg.overview?.estimated_fix_time && (
                              <span className="text-[9px] font-mono text-muted-foreground flex items-center gap-1">
                                <Clock className="h-2.5 w-2.5" />
                                {dg.overview.estimated_fix_time}
                              </span>
                            )}
                            
                            {/* Symptom count */}
                            {dg.symptoms && dg.symptoms.length > 0 && (
                              <span className="text-[9px] font-mono text-muted-foreground flex items-center gap-1">
                                <AlertCircle className="h-2.5 w-2.5" />
                                {dg.symptoms.length} symptom{dg.symptoms.length !== 1 ? 's' : ''}
                              </span>
                            )}
                            
                            {/* Solution count */}
                            {dg.solutions && dg.solutions.length > 0 && (
                              <span className="text-[9px] font-mono text-muted-foreground flex items-center gap-1">
                                <BarChart3 className="h-2.5 w-2.5" />
                                {dg.solutions.length} solution{dg.solutions.length !== 1 ? 's' : ''}
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