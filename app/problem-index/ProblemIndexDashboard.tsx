'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  Search, 
  FileText, 
  Eye, 
  Cpu, 
  Layers, 
  ArrowRight, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2, 
  HelpCircle, 
  X,
  Clock,
  Compass,
  ChevronsDown,
  ChevronsUp
} from 'lucide-react';

interface Problem {
  id: string;
  name: string;
  description: string;
  related_workflows: string[];
  related_decision_guides?: string[];
}

interface ProblemCategory {
  description: string;
  problems: Problem[];
}

interface Taxonomy {
  [category: string]: ProblemCategory;
}

interface WorkflowMetadata {
  id: string;
  title: string;
  description: string;
  type: string;
  difficulty?: string;
  duration?: number;
  tags: string[];
}

interface DecisionGuideMetadata {
  id: string;
  title: string;
  description: string;
  related_model_subcategory?: {
    category: string;
    subcategory: string;
  };
}

interface ProblemIndexDashboardProps {
  taxonomy: Taxonomy;
  workflowMap: Record<string, WorkflowMetadata>;
  decisionGuideMap: Record<string, DecisionGuideMetadata>;
}

function getCategoryIcon(categoryName: string) {
  const norm = categoryName.toLowerCase();
  if (norm.includes('nlp') || norm.includes('natural language')) return FileText;
  if (norm.includes('vision') || norm.includes('image') || norm.includes('video')) return Eye;
  if (norm.includes('infra') || norm.includes('distributed') || norm.includes('deep learning')) return Cpu;
  return Layers;
}

// 1. Text Highlight Component
function HighlightText({ text, query }: { text: string; query: string }) {
  if (!query || !query.trim()) return <>{text}</>;
  const escapedQuery = query.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  const regex = new RegExp(`(${escapedQuery})`, 'gi');
  const parts = text.split(regex);
  return (
    <>
      {parts.map((part, i) => 
        regex.test(part) ? (
          <mark key={i} className="bg-yellow-500/30 dark:bg-yellow-500/20 text-inherit px-0.5 rounded font-medium">
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </>
  );
}

export default function ProblemIndexDashboard({ taxonomy, workflowMap, decisionGuideMap }: ProblemIndexDashboardProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Initial States
  const initialQuery = searchParams.get('q') || '';
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(initialQuery);

  const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('problem_index_collapsed_categories');
        if (stored) return new Set(JSON.parse(stored));
      } catch {}
    }
    return new Set();
  });

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [isFilterCollapsed, setIsFilterCollapsed] = useState(false);
  const [stickyState, setStickyState] = useState<'full' | 'compact' | 'icon'>('full');
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  // Memoize Category Slugs
  const categorySlugs = useMemo(() => {
    const slugs: Record<string, string> = {};
    Object.keys(taxonomy).forEach(cat => {
      slugs[cat] = cat.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    });
    return slugs;
  }, [taxonomy]);

  // 2. Debounce Search Input and Sync URL Query Param
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      
      const params = new URLSearchParams(window.location.search);
      if (searchQuery.trim()) {
        params.set('q', searchQuery);
      } else {
        params.delete('q');
      }
      const newSearch = params.toString();
      router.replace(newSearch ? `?${newSearch}` : window.location.pathname, { scroll: false });
    }, 150);

    return () => clearTimeout(timer);
  }, [searchQuery, router]);

  // 3. Keyboard Shortcut (focus with Ctrl+K or '/') and Escape to collapse
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      
      // Escape to collapse expanded search
      if (e.key === 'Escape' && isSearchExpanded) {
        setIsSearchExpanded(false);
        return;
      }

      if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA' || activeEl.getAttribute('contenteditable') === 'true')) {
        return;
      }
      if (e.key === '/') {
        e.preventDefault();
        setIsSearchExpanded(true);
        searchInputRef.current?.focus();
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchExpanded(true);
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchExpanded]);

  // 4. Filter Collapse on Scroll with 3-State Sticky Bar
  useEffect(() => {
    const mainElement = document.getElementById('main-scroll');
    if (!mainElement) return;

    let lastScrollY = mainElement.scrollTop;
    let stateTransitionTimeout: NodeJS.Timeout | null = null;

    const handleScroll = () => {
      const scrollY = mainElement.scrollTop;
      const direction = scrollY > lastScrollY ? 'down' : 'up';

      // Filter collapse (toolbar row only)
      setIsFilterCollapsed(scrollY > 80);

      // 3-state sticky bar logic with direction awareness
      // Debounce state transitions to avoid flickering on rapid scroll
      if (stateTransitionTimeout) {
        clearTimeout(stateTransitionTimeout);
      }

      stateTransitionTimeout = setTimeout(() => {
        if (scrollY <= 40) {
          setStickyState('full');
          setIsSearchExpanded(false);
        } else if (scrollY <= 200) {
          setStickyState('compact');
          setIsSearchExpanded(false);
        } else {
          // Past 200px - use direction awareness
          if (direction === 'down') {
            setStickyState('icon');
            setIsSearchExpanded(false);
          } else {
            // Scrolling up - return to compact
            setStickyState('compact');
          }
        }
      }, 50); // Small debounce for state transitions

      lastScrollY = scrollY;
    };

    mainElement.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => {
      mainElement.removeEventListener('scroll', handleScroll);
      if (stateTransitionTimeout) {
        clearTimeout(stateTransitionTimeout);
      }
    };
  }, []);

  // 5. Highlight Visible Category on Scroll (Intersection Observer)
  useEffect(() => {
    const categories = Object.keys(taxonomy);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            const matchedCat = categories.find(cat => categorySlugs[cat] === id.replace('category-', ''));
            if (matchedCat) {
              setActiveCategory(matchedCat);
            }
          }
        });
      },
      {
        rootMargin: '-10% 0px -75% 0px', // detect items passing the upper half of the viewport
      }
    );

    categories.forEach(cat => {
      const slug = categorySlugs[cat];
      const el = document.getElementById(`category-${slug}`);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [taxonomy, categorySlugs]);

  // 5. Dynamic Statistics calculations
  const stats = useMemo(() => {
    const categories = Object.keys(taxonomy);
    let totalProblemsCount = 0;
    let solvedProblemsCount = 0;
    let maxCategoryName = '';
    let maxCategorySize = 0;

    categories.forEach(cat => {
      const pList = taxonomy[cat].problems;
      totalProblemsCount += pList.length;
      solvedProblemsCount += pList.filter(p => p.related_workflows.length > 0 || (p.related_decision_guides && p.related_decision_guides.length > 0)).length;

      if (pList.length > maxCategorySize) {
        maxCategorySize = pList.length;
        maxCategoryName = cat;
      }
    });

    const coveragePercent = totalProblemsCount > 0 ? Math.round((solvedProblemsCount / totalProblemsCount) * 100) : 0;

    return {
      totalCategories: categories.length,
      totalProblems: totalProblemsCount,
      solvedProblems: solvedProblemsCount,
      coveragePercent,
      largestCategoryName: maxCategoryName,
      largestCategorySize: maxCategorySize,
    };
  }, [taxonomy]);

  // 6. Filter & Solved-First Sorting Logic
  const filteredTaxonomy = useMemo(() => {
    const query = debouncedSearchQuery.toLowerCase().trim();
    const result: Taxonomy = {};

    Object.entries(taxonomy).forEach(([category, data]) => {
      const matchingProblems = data.problems.filter(p => {
        if (!query) return true;
        const hasBaseMatch = (
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          category.toLowerCase().includes(query)
        );
        if (hasBaseMatch) return true;

        return p.related_workflows.some(wfId => {
          if (wfId.toLowerCase().includes(query)) return true;
          const wf = workflowMap[wfId];
          return wf && (
            wf.title.toLowerCase().includes(query) ||
            wf.description.toLowerCase().includes(query) ||
            wf.difficulty?.toLowerCase().includes(query) ||
            wf.tags?.some(tag => tag.toLowerCase().includes(query))
          );
        });
      });

      if (matchingProblems.length > 0 || (query && category.toLowerCase().includes(query))) {
        const problemsToRender = matchingProblems.length > 0 ? matchingProblems : data.problems;

        // Sort solved problems (workflows or decision guides available) ahead of unsolved ones
        const sorted = [...problemsToRender].sort((a, b) => {
          const aSolved = (a.related_workflows.length > 0 || (a.related_decision_guides && a.related_decision_guides.length > 0)) ? 1 : 0;
          const bSolved = (b.related_workflows.length > 0 || (b.related_decision_guides && b.related_decision_guides.length > 0)) ? 1 : 0;
          return bSolved - aSolved; // 1 (solved) before 0 (unsolved)
        });

        result[category] = {
          description: data.description,
          problems: sorted,
        };
      }
    });

    return result;
  }, [taxonomy, debouncedSearchQuery, workflowMap]);

  const totalFilteredProblems = useMemo(() => {
    return Object.values(filteredTaxonomy).reduce((acc, data) => acc + data.problems.length, 0);
  }, [filteredTaxonomy]);

  // Collapse / Expand handlers
  const handleToggleCollapse = (category: string) => {
    setCollapsedCategories(prev => {
      const next = new Set(prev);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      localStorage.setItem('problem_index_collapsed_categories', JSON.stringify(Array.from(next)));
      return next;
    });
  };

  const expandAll = () => {
    setCollapsedCategories(new Set());
    localStorage.setItem('problem_index_collapsed_categories', '[]');
  };

  const collapseAll = () => {
    const allCats = Object.keys(taxonomy);
    setCollapsedCategories(new Set(allCats));
    localStorage.setItem('problem_index_collapsed_categories', JSON.stringify(allCats));
  };

  const handleScrollToCategory = (category: string) => {
    const slug = categorySlugs[category];
    const element = document.getElementById(`category-${slug}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const hasResults = Object.keys(filteredTaxonomy).length > 0;

  return (
    <div className="space-y-8">
      {/* Dynamic Statistics Bar */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-muted/20 border border-border p-4 rounded-xl">
        <div className="p-3 bg-card border border-border/50 rounded-lg flex flex-col justify-between">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Total Categories</span>
          <span className="text-2xl font-extrabold text-foreground mt-1.5">{stats.totalCategories}</span>
        </div>
        <div className="p-3 bg-card border border-border/50 rounded-lg flex flex-col justify-between">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Total Problems</span>
          <span className="text-2xl font-extrabold text-foreground mt-1.5">{stats.totalProblems}</span>
        </div>
        <div className="p-3 bg-card border border-border/50 rounded-lg flex flex-col justify-between">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider font-sans">Solutions Available</span>
          <div className="flex items-baseline gap-2 mt-1.5">
            <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">{stats.solvedProblems}</span>
            <span className="text-xs text-muted-foreground">({stats.coveragePercent}% cover)</span>
          </div>
        </div>
        <div className="p-3 bg-card border border-border/50 rounded-lg flex flex-col justify-between">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Largest Domain</span>
          <span className="text-xs font-semibold text-foreground mt-1.5 truncate" title={stats.largestCategoryName}>
            {stats.largestCategoryName || 'N/A'}
          </span>
          <span className="text-[10px] text-muted-foreground mt-0.5">{stats.largestCategorySize} problems</span>
        </div>
      </section>

      {/* Sticky Filters & Search Area */}
      <div className={`sticky top-14 md:top-16 z-20 bg-background/95 backdrop-blur-md border-b border-border space-y-3 transition-all duration-300 ${
        stickyState === 'full' ? 'py-3' : 'py-1.5'
      }`}>
        <div className="relative">
          {/* Icon trigger button (shown in icon state) */}
          {stickyState === 'icon' && !isSearchExpanded && (
            <button
              onClick={() => {
                setIsSearchExpanded(true);
                setTimeout(() => searchInputRef.current?.focus(), 0);
              }}
              className="w-9 h-9 flex items-center justify-center rounded-lg border border-border bg-card hover:bg-muted transition-all cursor-pointer"
              aria-label="Open search"
            >
              <Search className="w-4.5 h-4.5 text-muted-foreground" />
            </button>
          )}

          {/* Search input (hidden in icon state unless expanded) */}
          <div
            className={`transition-all duration-300 ease-in-out ${
              stickyState === 'icon' && !isSearchExpanded
                ? 'opacity-0 pointer-events-none absolute'
                : 'opacity-100 relative'
            }`}
          >
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-muted-foreground" />
            <input
              ref={searchInputRef}
              id="problem-search-input"
              type="text"
              placeholder="Search problems, workflows, tags, categories... (Press '/' to focus)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-3 rounded-lg border border-border bg-card text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
              aria-label="Search problems"
            />
            {searchQuery ? (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            ) : (
              <kbd className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                Ctrl K
              </kbd>
            )}
          </div>
        </div>

        {/* Navigation & Action Toolbar */}
        <div 
          className={`flex flex-col md:flex-row md:items-center md:justify-between gap-3 pt-1 transition-all duration-300 ${
            isFilterCollapsed ? 'opacity-0 h-0 overflow-hidden pointer-events-none' : 'opacity-100'
          }`}
        >
          {/* Scrollable Navigation Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 select-none scrollbar-none w-full md:max-w-[70%]">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider shrink-0 mr-1">
              Jump To:
            </span>
            {Object.keys(taxonomy).map(category => {
              const IconComponent = getCategoryIcon(category);
              const size = taxonomy[category].problems.length;
              const isActive = activeCategory === category;
              return (
                <button
                  key={category}
                  onClick={() => handleScrollToCategory(category)}
                  tabIndex={isFilterCollapsed ? -1 : undefined}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all whitespace-nowrap cursor-pointer ${
                    isActive 
                      ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                      : 'border-border bg-muted/30 text-muted-foreground hover:text-foreground hover:bg-muted hover:border-foreground/25'
                  }`}
                >
                  <IconComponent className="w-3.5 h-3.5" />
                  <span>{category}</span>
                  <span className={`text-[9px] px-1 rounded-md font-bold ${isActive ? 'bg-primary-foreground/20 text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>{size}</span>
                </button>
              );
            })}
          </div>

          {/* Bulk Toggles and Search Summary Counter */}
          <div className="flex items-center justify-between md:justify-end gap-3 select-none w-full md:w-auto border-t border-border/40 pt-2 md:border-t-0 md:pt-0">
            <div>
              {searchQuery.trim() ? (
                <p className="text-[10px] font-semibold text-muted-foreground select-none">
                  Found {totalFilteredProblems} matching {totalFilteredProblems === 1 ? 'problem' : 'problems'}
                </p>
              ) : (
                <span className="text-[10px] text-muted-foreground font-medium select-none">
                  Global Dashboard Actions
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={expandAll}
                tabIndex={isFilterCollapsed ? -1 : undefined}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded text-[10px] font-bold uppercase tracking-wider border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-all cursor-pointer"
                aria-label="Expand all categories"
              >
                <ChevronsDown className="w-3.5 h-3.5" />
                Expand All
              </button>
              <button
                onClick={collapseAll}
                tabIndex={isFilterCollapsed ? -1 : undefined}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded text-[10px] font-bold uppercase tracking-wider border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-all cursor-pointer"
                aria-label="Collapse all categories"
              >
                <ChevronsUp className="w-3.5 h-3.5" />
                Collapse All
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Category & Problem Grid */}
      {hasResults ? (
        <div className="space-y-6">
          {Object.entries(filteredTaxonomy).map(([category, data]) => {
            // Auto-expand everything when searching, otherwise check local state
            const isCollapsed = debouncedSearchQuery.trim() ? false : collapsedCategories.has(category);
            const IconComponent = getCategoryIcon(category);
            const slug = categorySlugs[category];

            const totalInCat = taxonomy[category].problems.length;
            const solvedInCat = taxonomy[category].problems.filter(p => p.related_workflows.length > 0 || (p.related_decision_guides && p.related_decision_guides.length > 0)).length;

            return (
              <section
                key={category}
                id={`category-${slug}`}
                className="scroll-mt-36 rounded-xl border border-border bg-card overflow-hidden transition-all duration-300"
              >
                {/* Category Header */}
                <button
                  onClick={() => handleToggleCollapse(category)}
                  aria-expanded={!isCollapsed}
                  aria-controls={`category-content-${slug}`}
                  className="w-full px-5 py-4 bg-muted/10 hover:bg-muted/20 border-b border-border transition-all flex items-start justify-between gap-3 text-left cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-lg bg-primary/5 border border-primary/10">
                      <IconComponent className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-md font-bold text-foreground flex items-center flex-wrap gap-2">
                        <span>{category}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary font-mono font-bold">
                          {data.problems.length} {data.problems.length === 1 ? 'Problem' : 'Problems'}
                        </span>
                        <span className="text-[10px] text-muted-foreground font-medium select-none">
                          ({solvedInCat}/{totalInCat} solved)
                        </span>
                      </h2>
                      <p className="text-xs text-muted-foreground mt-0.5">{data.description}</p>
                    </div>
                  </div>
                  {isCollapsed ? (
                    <ChevronDown className="w-5 h-5 text-muted-foreground shrink-0 mt-1" />
                  ) : (
                    <ChevronUp className="w-5 h-5 text-muted-foreground shrink-0 mt-1" />
                  )}
                </button>

                {/* Collapsible content area with CSS Grid Row Animation */}
                <div 
                  id={`category-content-${slug}`}
                  aria-hidden={isCollapsed}
                  className="grid transition-[grid-template-rows,opacity] duration-300 ease-in-out"
                  style={{
                    gridTemplateRows: isCollapsed ? '0fr' : '1fr',
                    opacity: isCollapsed ? 0 : 1,
                  }}
                >
                  <div className="overflow-hidden">
                    <div className="p-5 grid gap-4 grid-cols-1 md:grid-cols-2">
                      {data.problems.map(problem => {
                        const hasWorkflows = problem.related_workflows.length > 0 || (problem.related_decision_guides && problem.related_decision_guides.length > 0);
                        return (
                          <div
                            key={problem.id}
                            className="rounded-lg border border-border bg-muted/5 dark:bg-muted/[0.005] p-4 flex flex-col justify-between gap-4 transition-shadow hover:shadow-sm"
                          >
                            <div>
                              {/* Problem Name & Status */}
                              <div className="flex items-start justify-between gap-2">
                                <h3 className="text-sm font-bold text-foreground leading-snug">
                                  <HighlightText text={problem.name} query={debouncedSearchQuery} />
                                </h3>
                                <div className="flex items-center gap-1.5 shrink-0">
                                  <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-muted font-bold text-muted-foreground font-mono select-none" title="Total solutions count">
                                    {problem.related_workflows.length + (problem.related_decision_guides?.length ?? 0)} {problem.related_workflows.length + (problem.related_decision_guides?.length ?? 0) === 1 ? 'solution' : 'solutions'}
                                  </span>
                                  {hasWorkflows ? (
                                    <span className="inline-flex items-center gap-1 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 px-1.5 py-0.5 text-[9px] font-mono font-bold tracking-wide select-none">
                                      <CheckCircle2 className="w-3 h-3" />
                                      Active
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1 rounded bg-muted text-muted-foreground px-1.5 py-0.5 text-[9px] font-mono font-medium select-none">
                                      <Compass className="w-3 h-3" />
                                      Coming Soon
                                    </span>
                                  )}
                                </div>
                              </div>
                              <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                                <HighlightText text={problem.description} query={debouncedSearchQuery} />
                              </p>
                            </div>

                            {/* Workflows Connections */}
                            <div className="space-y-2 border-t border-border/60 pt-3 mt-auto">
                              <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider block">
                                Recommended Solutions
                              </span>
                              {hasWorkflows ? (
                                <div className="space-y-2">
                                  {problem.related_workflows.map(wfId => {
                                    const metadata = workflowMap[wfId];
                                    if (metadata) {
                                      return (
                                        <div 
                                          key={wfId}
                                          className="rounded border border-border/80 bg-card p-2.5 flex flex-col justify-between gap-1.5 hover:border-foreground/15 transition-all text-xs"
                                        >
                                          <div className="flex items-center justify-between gap-3">
                                            <div className="min-w-0">
                                              <p className="font-semibold text-foreground truncate">
                                                <HighlightText text={metadata.title} query={debouncedSearchQuery} />
                                              </p>
                                            </div>
                                            <Link
                                              href={`/workflows/${wfId}`}
                                              className="shrink-0 inline-flex items-center gap-0.5 px-2 py-1 rounded bg-primary/5 hover:bg-primary/10 border border-primary/10 hover:border-primary/20 text-[10px] font-bold text-primary transition-all cursor-pointer select-none"
                                            >
                                              Open
                                              <ArrowRight className="w-3 h-3" />
                                            </Link>
                                          </div>
                                          {metadata.description && (
                                            <p className="text-[11px] text-muted-foreground/85 leading-normal line-clamp-2">
                                              <HighlightText text={metadata.description} query={debouncedSearchQuery} />
                                            </p>
                                          )}
                                          <div className="flex flex-wrap items-center gap-1.5 text-[9px] font-mono text-muted-foreground select-none">
                                            <span className="capitalize">{metadata.type}</span>
                                            {metadata.difficulty && (
                                              <>
                                                <span>•</span>
                                                <span className="capitalize">{metadata.difficulty}</span>
                                              </>
                                            )}
                                            {metadata.duration && (
                                              <>
                                                <span>•</span>
                                                <span className="inline-flex items-center gap-0.5">
                                                  <Clock className="w-2.5 h-2.5" />
                                                  {metadata.duration} min
                                                </span>
                                              </>
                                            )}
                                            {metadata.tags.slice(0, 3).map(tag => (
                                              <span key={tag} className="px-1 rounded bg-muted/60 text-muted-foreground text-[8px]">
                                                #{tag}
                                              </span>
                                            ))}
                                          </div>
                                        </div>
                                      );
                                    }

                                    // Fallback if workflow file not indexed yet
                                    return (
                                      <div 
                                        key={wfId}
                                        className="rounded border border-border/80 bg-card p-2.5 flex items-center justify-between gap-3 text-xs"
                                      >
                                        <span className="font-mono text-muted-foreground truncate">{wfId}</span>
                                        <Link
                                          href={`/workflows/${wfId}`}
                                          className="shrink-0 inline-flex items-center gap-0.5 px-2 py-1 rounded bg-primary/5 hover:bg-primary/10 border border-primary/10 text-[10px] font-bold text-primary transition-all cursor-pointer"
                                        >
                                          Open
                                          <ArrowRight className="w-3 h-3" />
                                        </Link>
                                      </div>
                                    );
                                  })}
                                </div>
                              ) : (
                                <div className="rounded border border-dashed border-border p-3 text-center text-xs bg-muted/5 flex flex-col items-center justify-center py-4 select-none">
                                  <HelpCircle className="w-4 h-4 text-muted-foreground/60 mb-1" />
                                  <span className="text-[10px] font-medium text-muted-foreground leading-relaxed">
                                    No recommended workflow available yet.
                                  </span>
                                </div>
                              )}
                            </div>

                            {/* Decision Guides Connections */}
                            {problem.related_decision_guides && problem.related_decision_guides.length > 0 && (
                              <div className="space-y-2 border-t border-border/60 pt-3">
                                <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider block">
                                  Decision Guides
                                </span>
                                <div className="space-y-2">
                                  {problem.related_decision_guides.map(dgId => {
                                    const metadata = decisionGuideMap[dgId];
                                    if (metadata) {
                                      return (
                                        <div 
                                          key={dgId}
                                          className="rounded border border-border/80 bg-card p-2.5 flex flex-col justify-between gap-1.5 hover:border-foreground/15 transition-all text-xs"
                                        >
                                          <div className="flex items-center justify-between gap-3">
                                            <div className="min-w-0">
                                              <p className="font-semibold text-foreground truncate">
                                                <HighlightText text={metadata.title} query={debouncedSearchQuery} />
                                              </p>
                                            </div>
                                            <div className="flex items-center gap-2 shrink-0">
                                              {metadata.related_model_subcategory && (
                                                <Link
                                                  href={`/models/${metadata.related_model_subcategory.category}/compare/${metadata.related_model_subcategory.subcategory}`}
                                                  className="inline-flex items-center gap-0.5 px-2 py-1 rounded bg-muted/50 hover:bg-muted border border-border/50 text-[9px] font-bold text-muted-foreground hover:text-foreground transition-all cursor-pointer select-none"
                                                >
                                                  Compare Models
                                                  <ArrowRight className="w-3 h-3" />
                                                </Link>
                                              )}
                                              <Link
                                                href={`/decision-guides/${dgId}`}
                                                className="inline-flex items-center gap-0.5 px-2 py-1 rounded bg-primary/5 hover:bg-primary/10 border border-primary/10 hover:border-primary/20 text-[10px] font-bold text-primary transition-all cursor-pointer select-none"
                                              >
                                                Open
                                                <ArrowRight className="w-3 h-3" />
                                              </Link>
                                            </div>
                                          </div>
                                          {metadata.description && (
                                            <p className="text-[11px] text-muted-foreground/85 leading-normal line-clamp-2">
                                              <HighlightText text={metadata.description} query={debouncedSearchQuery} />
                                            </p>
                                          )}
                                        </div>
                                      );
                                    }

                                    // Fallback if decision guide file not indexed yet
                                    return (
                                      <div 
                                        key={dgId}
                                        className="rounded border border-border/80 bg-card p-2.5 flex items-center justify-between gap-3 text-xs"
                                      >
                                        <span className="font-mono text-muted-foreground truncate">{dgId}</span>
                                        <Link
                                          href={`/decision-guides/${dgId}`}
                                          className="shrink-0 inline-flex items-center gap-0.5 px-2 py-1 rounded bg-primary/5 hover:bg-primary/10 border border-primary/10 text-[10px] font-bold text-primary transition-all cursor-pointer"
                                        >
                                          Open
                                          <ArrowRight className="w-3 h-3" />
                                        </Link>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </section>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="rounded-xl border border-dashed border-border bg-card p-8 text-center flex flex-col items-center justify-center py-12 select-none">
          <Search className="w-8 h-8 text-muted-foreground/60 mb-2" />
          <h3 className="text-md font-bold text-foreground">No matches found</h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm leading-relaxed">
            We couldn&apos;t find any problems matching &quot;{searchQuery}&quot;.
          </p>
          <button 
            onClick={() => setSearchQuery('')}
            className="mt-3 px-4 py-2 bg-primary text-primary-foreground text-xs font-semibold rounded-lg hover:bg-primary/90 transition-colors cursor-pointer"
          >
            Clear Search
          </button>
        </div>
      )}
    </div>
  );
}
