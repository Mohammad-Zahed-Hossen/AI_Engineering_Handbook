'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronRight, Search } from 'lucide-react';
import { Model, ModelCategory, ProblemType } from '@/types/model';
import { cn } from '@/lib/utils';
import FilterBar from './FilterBar';

interface ModelHubExplorerProps {
  initialModels: Model[];
  categoriesMeta: {
    ml: Record<string, {
      label: string;
      description: string;
      comparison_columns: string[];
      decision_flow?: Array<{ question: string; if_yes: string; if_no: string }>;
      linked_decision_guide?: string | null;
    }>;
    dl: Record<string, {
      label: string;
      description: string;
      comparison_columns: string[];
      decision_flow?: Array<{ question: string; if_yes: string; if_no: string }>;
      linked_decision_guide?: string | null;
    }>;
    llm: Record<string, {
      label: string;
      description: string;
      comparison_columns: string[];
      decision_flow?: Array<{ question: string; if_yes: string; if_no: string }>;
      linked_decision_guide?: string | null;
    }>;
  };
}

const problemTypesList: ProblemType[] = [
  'classification',
  'regression',
  'clustering',
  'generation',
  'embedding',
  'detection',
  'segmentation',
];

export default function ModelHubExplorer({ initialModels, categoriesMeta }: ModelHubExplorerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProblems, setSelectedProblems] = useState<ProblemType[]>([]);
  const [expandedDomains, setExpandedDomains] = useState<Set<ModelCategory>>(
    new Set<ModelCategory>(['ml', 'dl', 'llm'])
  );

  // Group subcategories present per domain for filtering
  const allSubcategories = Array.from(new Set(initialModels.map((m) => m.subcategory)));

  const [expandedSubcategories, setExpandedSubcategories] = useState<Set<string>>(() => {
    // Default open if subcategory has <= 6 models, else closed
    const initialSet = new Set<string>();
    allSubcategories.forEach((sub) => {
      const count = initialModels.filter((m) => m.subcategory === sub).length;
      if (count <= 6) {
        initialSet.add(sub);
      }
    });
    return initialSet;
  });

  const toggleDomain = (domain: ModelCategory) => {
    const next = new Set(expandedDomains);
    if (next.has(domain)) {
      next.delete(domain);
    } else {
      next.add(domain);
    }
    setExpandedDomains(next);
  };

  const toggleSubcategory = (sub: string) => {
    const next = new Set(expandedSubcategories);
    if (next.has(sub)) {
      next.delete(sub);
    } else {
      next.add(sub);
    }
    setExpandedSubcategories(next);
  };

  const toggleProblem = (opt: string) => {
    const pt = opt as ProblemType;
    if (selectedProblems.includes(pt)) {
      setSelectedProblems(selectedProblems.filter((p) => p !== pt));
    } else {
      setSelectedProblems([...selectedProblems, pt]);
    }
  };

  // Filter models based on search query and problem types
  const filteredModels = initialModels.filter((m) => {
    const matchesSearch =
      searchQuery === '' ||
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.decisionsummary.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.subcategory.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.problem_types.some((pt) => pt.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesProblems =
      selectedProblems.length === 0 || m.problem_types.some((pt) => selectedProblems.includes(pt));

    return matchesSearch && matchesProblems;
  });

  // Group models by domain -> subcategory
  const grouped: Record<ModelCategory, Record<string, Model[]>> = {
    ml: {},
    dl: {},
    llm: {},
  };

  filteredModels.forEach((m) => {
    const cat = m.category;
    const sub = m.subcategory;
    if (!grouped[cat][sub]) {
      grouped[cat][sub] = [];
    }
    grouped[cat][sub].push(m);
  });

  const domainLabels: Record<ModelCategory, string> = {
    ml: 'Machine Learning',
    dl: 'Deep Learning',
    llm: 'Large Language Models',
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search models by name, subcategory, problem type, or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm bg-card text-card-foreground border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary touch-target"
          />
        </div>
        <FilterBar
          label="Filter by Problem Type"
          options={problemTypesList}
          selectedOptions={selectedProblems}
          onToggle={toggleProblem}
          onClear={() => setSelectedProblems([])}
        />
      </div>

      {/* Main tree list */}
      <div className="space-y-4">
        {(['ml', 'dl', 'llm'] as ModelCategory[]).map((domain) => {
          const domainGroup = grouped[domain];
          const subcategories = Object.keys(domainGroup).sort();
          const totalInDomain = Object.values(domainGroup).reduce((acc, curr) => acc + curr.length, 0);

          if (totalInDomain === 0) return null;

          const isDomainExpanded = expandedDomains.has(domain);

          return (
            <div key={domain} className="border border-border rounded-lg bg-card overflow-hidden">
              {/* Domain Header */}
              <button
                onClick={() => toggleDomain(domain)}
                className="w-full flex items-center justify-between p-4 bg-muted/20 hover:bg-muted/40 transition-colors border-b border-border select-none text-left touch-target"
              >
                <div className="flex items-center gap-2">
                  {isDomainExpanded ? (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  )}
                  <h2 className="text-base font-semibold text-foreground">
                    {domainLabels[domain]}
                  </h2>
                  <span className="px-1.5 py-0.5 rounded-full bg-secondary text-secondary-foreground text-[10px] font-mono border border-border">
                    {totalInDomain} models
                  </span>
                </div>
              </button>

              {/* Subcategories (if expanded) */}
              {isDomainExpanded && (
                <div className="p-3 sm:p-4 space-y-4">
                  {subcategories.map((sub) => {
                    const modelsInSub = domainGroup[sub];
                    const meta = categoriesMeta[domain]?.[sub];
                    const isSubExpanded = expandedSubcategories.has(sub);

                    return (
                      <div key={sub} className="border border-border/80 rounded-md overflow-hidden bg-card/50">
                        {/* Subcategory Header */}
                        <div className="flex items-center justify-between p-3 bg-muted/10 border-b border-border/60 select-none text-left">
                          <button
                            onClick={() => toggleSubcategory(sub)}
                            className="flex items-center gap-2 flex-1 text-left touch-target"
                          >
                            {isSubExpanded ? (
                              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                            ) : (
                              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                            )}
                            <h3 className="text-xs font-semibold text-foreground capitalize">
                              {meta?.label || sub.replace(/_/g, ' ')}
                            </h3>
                            <span className="text-[10px] text-muted-foreground">
                              ({modelsInSub.length})
                            </span>
                          </button>
                          <Link
                            href={`/models/${domain}/compare/${sub}`}
                            className="text-[10px] font-medium text-primary hover:underline pr-2 touch-target"
                          >
                            Compare &rarr;
                          </Link>
                        </div>

                        {/* Models in subcategory (if expanded) */}
                        {isSubExpanded && (
                          <div className="p-3 grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                            {modelsInSub.map((m) => (
                              <Link
                                key={m.id}
                                href={`/models/${domain}/${m.id}`}
                                className="block rounded-lg border border-border bg-card p-3.5 hover:border-foreground/20 hover:bg-muted/30 transition-colors touch-target"
                              >
                                <div className="flex items-start justify-between gap-2 mb-2">
                                  <h4 className="text-xs font-semibold text-primary">{m.name}</h4>
                                  <span
                                    className={cn(
                                      "shrink-0 text-[8px] font-mono px-1.5 py-0.5 rounded border capitalize",
                                      m.difficulty === 'beginner' &&
                                        'text-emerald-600 border-emerald-200 bg-emerald-50 dark:text-emerald-400 dark:border-emerald-500/30 dark:bg-emerald-500/10',
                                      m.difficulty === 'intermediate' &&
                                        'text-amber-600 border-amber-200 bg-amber-50 dark:text-amber-400 dark:border-amber-500/30 dark:bg-amber-500/10',
                                      m.difficulty === 'advanced' &&
                                        'text-rose-600 border-rose-200 bg-rose-50 dark:text-rose-400 dark:border-rose-500/30 dark:bg-rose-500/10',
                                      m.difficulty === 'expert' &&
                                        'text-purple-600 border-purple-200 bg-purple-50 dark:text-purple-400 dark:border-purple-500/30 dark:bg-purple-500/10'
                                    )}
                                  >
                                    {m.difficulty}
                                  </span>
                                </div>
                                <p className="text-[10px] text-muted-foreground leading-relaxed mb-3 line-clamp-2">
                                  {m.decisionsummary.summary}
                                </p>
                                <div className="flex flex-wrap items-center gap-1.5 pt-1.5 border-t border-border/40">
                                  {m.problem_types.slice(0, 2).map((pt) => (
                                    <span
                                      key={pt}
                                      className="px-1.5 py-0.5 rounded bg-secondary text-secondary-foreground border border-border text-[8px] font-mono capitalize"
                                    >
                                      {pt}
                                    </span>
                                  ))}
                                  <span className="text-[8px] font-mono capitalize ml-auto text-muted-foreground">
                                    Maturity: {m.engineeringmaturity}
                                  </span>
                                </div>
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        {filteredModels.length === 0 && (
          <div className="p-8 text-center text-sm bg-card border border-border rounded-lg text-muted-foreground select-none">
            No models match the selected search or filter criteria.
          </div>
        )}
      </div>
    </div>
  );
}