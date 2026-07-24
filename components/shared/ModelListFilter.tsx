'use client';

import { useState } from 'react';
import { Model, ProblemType } from '@/types/model';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import FilterBar from './FilterBar';
import SearchFilterToolbar from './SearchFilterToolbar';
import { ChevronDown, ChevronRight } from 'lucide-react';

const difficultyLevels = ['beginner', 'intermediate', 'advanced', 'expert'];
const maturityLevels = ['experimental', 'prototype', 'production', 'deprecated'];

const problemTypesList: ProblemType[] = [
  'classification',
  'regression',
  'clustering',
  'generation',
  'embedding',
  'detection',
  'segmentation',
];

interface ModelListFilterProps {
  models: Model[];
  category: string;
  categoriesMeta?: Record<string, {
    label: string;
    description: string;
    comparison_columns: string[];
    decision_flow?: Array<{ question: string; if_yes: string; if_no: string }>;
    linked_decision_guide?: string | null;
  }>;
}

export function ModelListFilter({ models, category, categoriesMeta = {} }: ModelListFilterProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProblems, setSelectedProblems] = useState<ProblemType[]>([]);
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([]);
  const [selectedDifficulties, setSelectedDifficulties] = useState<string[]>([]);
  const [selectedMaturities, setSelectedMaturities] = useState<string[]>([]);

  // Derived subcategories list
  const subcategoriesList = Array.from(new Set(models.map((m) => m.subcategory))).sort();

  const [expandedSubcategories, setExpandedSubcategories] = useState<Set<string>>(() => {
    // Default open if subcategory has <= 6 models, else closed
    const initialSet = new Set<string>();
    subcategoriesList.forEach((sub) => {
      const count = models.filter((m) => m.subcategory === sub).length;
      if (count <= 6) {
        initialSet.add(sub);
      }
    });
    return initialSet;
  });

  const handleToggleProblem = (opt: string) => {
    const pt = opt as ProblemType;
    if (selectedProblems.includes(pt)) {
      setSelectedProblems(selectedProblems.filter((p) => p !== pt));
    } else {
      setSelectedProblems([...selectedProblems, pt]);
    }
  };

  const handleToggleSubcategory = (sub: string) => {
    if (selectedSubcategories.includes(sub)) {
      setSelectedSubcategories(selectedSubcategories.filter((s) => s !== sub));
    } else {
      setSelectedSubcategories([...selectedSubcategories, sub]);
    }
  };

  const toggleDifficulty = (opt: string) => {
    if (selectedDifficulties.includes(opt)) {
      setSelectedDifficulties(selectedDifficulties.filter((d) => d !== opt));
    } else {
      setSelectedDifficulties([...selectedDifficulties, opt]);
    }
  };

  const toggleMaturity = (opt: string) => {
    if (selectedMaturities.includes(opt)) {
      setSelectedMaturities(selectedMaturities.filter((m) => m !== opt));
    } else {
      setSelectedMaturities([...selectedMaturities, opt]);
    }
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedProblems([]);
    setSelectedSubcategories([]);
    setSelectedDifficulties([]);
    setSelectedMaturities([]);
  };

  const toggleSubcategoryExpand = (sub: string) => {
    const next = new Set(expandedSubcategories);
    if (next.has(sub)) {
      next.delete(sub);
    } else {
      next.add(sub);
    }
    setExpandedSubcategories(next);
  };

  const filteredModels = models.filter((model) => {
    const matchesSearch =
      searchQuery === '' ||
      model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      model.decisionsummary.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      model.subcategory.toLowerCase().includes(searchQuery.toLowerCase()) ||
      model.problem_types.some((pt) => pt.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesProblem = selectedProblems.length === 0 || model.problem_types.some((pt) => selectedProblems.includes(pt));
    const matchesSubcategory = selectedSubcategories.length === 0 || selectedSubcategories.includes(model.subcategory);
    const matchesDifficulty = selectedDifficulties.length === 0 || selectedDifficulties.includes(model.difficulty);
    const matchesMaturity = selectedMaturities.length === 0 || selectedMaturities.includes(model.engineeringmaturity);
    return matchesSearch && matchesProblem && matchesSubcategory && matchesDifficulty && matchesMaturity;
  });

  // Group filtered models by subcategory
  const grouped: Record<string, Model[]> = {};
  filteredModels.forEach((m) => {
    const sub = m.subcategory;
    if (!grouped[sub]) {
      grouped[sub] = [];
    }
    grouped[sub].push(m);
  });

  const subcategoriesPresent = Object.keys(grouped).sort();

  // Build active filters array for display - capitalize first letter for better readability
  const activeFilters = [
    ...selectedProblems.map(p => ({ label: p.charAt(0).toUpperCase() + p.slice(1), value: p, onRemove: () => handleToggleProblem(p) })),
    ...selectedSubcategories.map(s => ({ label: s.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()), value: s, onRemove: () => handleToggleSubcategory(s) })),
    ...selectedDifficulties.map(d => ({ label: d.charAt(0).toUpperCase() + d.slice(1), value: d, onRemove: () => toggleDifficulty(d) })),
    ...selectedMaturities.map(m => ({ label: m.charAt(0).toUpperCase() + m.slice(1), value: m, onRemove: () => toggleMaturity(m) })),
  ];

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <SearchFilterToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search models by name, subcategory, problem type, or description..."
        showClearSearch={true}
        activeFilters={activeFilters}
        onClearAll={activeFilters.length > 0 || searchQuery.length > 0 ? clearAllFilters : undefined}
        resultCount={filteredModels.length}
        totalCount={models.length}
        moreFiltersContent={
          <div className="space-y-3">
            <FilterBar
              label="Difficulty"
              options={difficultyLevels}
              selectedOptions={selectedDifficulties}
              onToggle={toggleDifficulty}
              onClear={() => setSelectedDifficulties([])}
              horizontal
            />
            <FilterBar
              label="Maturity"
              options={maturityLevels}
              selectedOptions={selectedMaturities}
              onToggle={toggleMaturity}
              onClear={() => setSelectedMaturities([])}
              horizontal
            />
          </div>
        }
      >
        <FilterBar
          label="Problem Type"
          options={problemTypesList}
          selectedOptions={selectedProblems}
          onToggle={handleToggleProblem}
          onClear={() => setSelectedProblems([])}
          horizontal
        />
        <FilterBar
          label="Subcategory"
          options={subcategoriesList}
          selectedOptions={selectedSubcategories}
          onToggle={handleToggleSubcategory}
          onClear={() => setSelectedSubcategories([])}
          horizontal
        />
      </SearchFilterToolbar>

      {/* Grouped Collapsible Sections */}
      <div className="space-y-4">
        {subcategoriesPresent.length === 0 ? (
          <div className="p-8 text-center text-xs text-muted-foreground bg-card border border-border rounded-lg select-none">
            No models match the selected filter criteria.
          </div>
        ) : (
          subcategoriesPresent.map((sub) => {
            const modelsInSub = grouped[sub];
            const meta = categoriesMeta[sub];
            const isExpanded = expandedSubcategories.has(sub);

            return (
              <div key={sub} className="border border-border rounded-lg bg-card overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-3.5 bg-muted/10 border-b border-border select-none text-left">
                  <button
                    onClick={() => toggleSubcategoryExpand(sub)}
                    className="flex items-center gap-2 flex-1 text-left touch-target"
                  >
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    )}
                    <h3 className="text-sm font-semibold text-foreground capitalize">
                      {meta?.label || sub.replace(/_/g, ' ')}
                    </h3>
                    <span className="text-xs text-muted-foreground">
                      ({modelsInSub.length})
                    </span>
                  </button>
                  <Link
                    href={`/models/${category}/compare/${sub}`}
                    className="text-xs font-medium text-primary hover:underline pr-2 touch-target-sm"
                  >
                    Compare &rarr;
                  </Link>
                </div>

                {/* Content (Table & Cards) */}
                {isExpanded && (
                  <div className="p-3 sm:p-4">
                    {/* Mobile Card View - full width on mobile */}
                    <div className="md:hidden space-y-3">
                      {modelsInSub.map((m) => (
                        <Link
                          key={m.id}
                          href={`/models/${category}/${m.id}`}
                          className="block rounded-lg border border-border bg-card p-3.5 hover:border-foreground/20 hover:bg-muted/30 active:bg-muted/50 transition-colors touch-target"
                        >
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <h3 className="text-sm font-semibold text-primary">{m.name}</h3>
                            <span className={cn(
                              "shrink-0 text-[9px] font-mono px-1.5 py-0.5 rounded border capitalize",
                              m.difficulty === 'beginner' && 'text-emerald-600 border-emerald-200 bg-emerald-50 dark:text-emerald-400 dark:border-emerald-500/30 dark:bg-emerald-500/10',
                              m.difficulty === 'intermediate' && 'text-amber-600 border-amber-200 bg-amber-50 dark:text-amber-400 dark:border-amber-500/30 dark:bg-amber-500/10',
                              m.difficulty === 'advanced' && 'text-rose-600 border-rose-200 bg-rose-50 dark:text-rose-400 dark:border-rose-500/30 dark:bg-rose-500/10',
                              m.difficulty === 'expert' && 'text-purple-600 border-purple-200 bg-purple-50 dark:text-purple-400 dark:border-purple-500/30 dark:bg-purple-500/10',
                            )}>
                              {m.difficulty}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground leading-relaxed mb-3 line-clamp-2">
                            {m.decisionsummary.summary}
                          </p>
                          <div className="flex flex-wrap items-center gap-2">
                            {m.problem_types.map((pt) => (
                              <span
                                key={pt}
                                className="px-1.5 py-0.5 rounded bg-secondary text-secondary-foreground border border-border text-[9px] font-mono capitalize"
                              >
                                {pt}
                              </span>
                            ))}
                            <span className="text-[9px] font-mono capitalize ml-auto text-muted-foreground">
                              Maturity: {m.engineeringmaturity}
                            </span>
                          </div>
                        </Link>
                      ))}
                    </div>

                    {/* Desktop Table View */}
                    <div className="hidden md:block bg-card text-card-foreground border border-border rounded-lg overflow-hidden transition-colors hover:border-foreground/15">
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-border text-left">
                          <thead className="bg-muted/40 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider select-none">
                            <tr>
                              <th className="px-4 py-2.5 w-1/4">Model Name</th>
                              <th className="px-4 py-2.5 w-2/5">Summary</th>
                              <th className="px-4 py-2.5">Problem Types</th>
                              <th className="px-4 py-2.5 text-center">Difficulty</th>
                              <th className="px-4 py-2.5 text-center">Maturity</th>
                              <th className="px-4 py-2.5 text-right pr-6">Action</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border text-[11px]">
                            {modelsInSub.map((m) => (
                              <tr key={m.id} className="hover:bg-muted/10 font-sans">
                                <td className="px-4 py-3 align-middle">
                                  <Link
                                    href={`/models/${category}/${m.id}`}
                                    className="font-semibold text-primary hover:underline text-xs"
                                  >
                                    {m.name}
                                  </Link>
                                </td>
                                <td className="px-4 py-3 align-middle text-muted-foreground leading-relaxed">
                                  {m.decisionsummary.summary}
                                </td>
                                <td className="px-4 py-3 align-middle">
                                  <div className="flex flex-wrap gap-1">
                                    {m.problem_types.map((pt) => (
                                      <span
                                        key={pt}
                                        className="px-1.5 py-0.5 rounded bg-secondary text-secondary-foreground border border-border text-[9px] font-mono capitalize"
                                      >
                                        {pt}
                                      </span>
                                    ))}
                                  </div>
                                </td>
                                <td className="px-4 py-3 align-middle text-center capitalize font-mono">
                                  <span className={cn(
                                    m.difficulty === 'beginner' && 'text-emerald-500',
                                    m.difficulty === 'intermediate' && 'text-amber-500',
                                    m.difficulty === 'advanced' && 'text-rose-500',
                                    m.difficulty === 'expert' && 'text-purple-500'
                                  )}>
                                    {m.difficulty}
                                  </span>
                                </td>
                                <td className="px-4 py-3 align-middle text-center capitalize font-mono text-muted-foreground">
                                  {m.engineeringmaturity}
                                </td>
                                <td className="px-4 py-3 align-middle text-right pr-6">
                                  <Link
                                    href={`/models/${category}/${m.id}`}
                                    className="text-xs text-foreground font-semibold hover:underline"
                                  >
                                    Configure &rarr;
                                  </Link>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}