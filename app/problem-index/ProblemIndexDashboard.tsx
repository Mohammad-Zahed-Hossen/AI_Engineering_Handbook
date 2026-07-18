'use client';

import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
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
  X,
  Compass,
  ChevronsDown,
  ChevronsUp,
  Filter,
  Check,
  RotateCcw,
  Boxes,
  BookOpen,
  Activity,
  Award,
  Terminal
} from 'lucide-react';

import {
  Taxonomy,
  Problem,
  NavigatorProblemType,
  InputModality,
  EngineeringComplexity,
  EngineeringCharacteristic
} from '@/types/problem';

interface WorkflowMetadata {
  id: string;
  title: string;
  description: string;
  type: string;
  difficulty?: string;
  duration?: number;
  tags: string[];
  confidence?: string;
  stability?: string;
  lifecycle?: string;
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
  modelMap: Record<string, { name: string; category: string }>;
  patternMap: Record<string, string>;
  debugGuideMap: Record<string, string>;
  packageMap: Record<string, string>;
  registryMap: Record<string, string>;
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

// 2. Resolve link helper
function resolveLink(
  id: string,
  modelMap: Record<string, { category: string }>,
  patternMap: Record<string, string>,
  debugGuideMap: Record<string, string>,
  packageMap: Record<string, string>,
  registryMap: Record<string, string>,
  workflowMap: Record<string, WorkflowMetadata>
): string | null {
  if (workflowMap[id]) return `/workflows/${id}`;
  if (modelMap[id]) return `/models/${modelMap[id].category}/${id}`;
  if (patternMap[id]) return `/patterns/${id}`;
  if (debugGuideMap[id]) return `/debug-guides/${id}`;
  if (packageMap[id]) return `/packages/${id}`;
  if (registryMap[id]) return `/registry/families/${id}`;
  return null;
}

// 3. Resolve name helper
function resolveName(
  id: string,
  modelMap: Record<string, { name: string }>,
  patternMap: Record<string, string>,
  debugGuideMap: Record<string, string>,
  packageMap: Record<string, string>,
  registryMap: Record<string, string>,
  workflowMap: Record<string, { title: string }>
): string {
  if (workflowMap[id]) return workflowMap[id].title;
  if (modelMap[id]) return modelMap[id].name;
  if (patternMap[id]) return patternMap[id];
  if (debugGuideMap[id]) return debugGuideMap[id];
  if (packageMap[id]) return packageMap[id];
  if (registryMap[id]) return registryMap[id];
  return id.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

// 4. Compute Maturity
function getProblemMaturity(problem: Problem, workflowMap: Record<string, WorkflowMetadata>): 'Production' | 'Stable' | 'Beta' | 'Research' | 'Experimental' {
  const workflows = problem.related_workflows.map(id => workflowMap[id]).filter(Boolean);
  const hasWorkflows = workflows.length > 0;
  const hasDecisionGuides = (problem.related_decision_guides?.length ?? 0) > 0;

  if (hasWorkflows) {
    if (workflows.some(w => w.confidence === 'production_proven')) return 'Production';
    if (workflows.some(w => w.stability === 'stable')) return 'Stable';
    if (workflows.some(w => w.lifecycle === 'verified')) return 'Beta';
    return 'Research';
  }
  if (hasDecisionGuides) {
    return 'Experimental';
  }
  return 'Experimental';
}


// 6. Render Complexity Stars
function renderComplexityStars(complexity: EngineeringComplexity): string {
  switch (complexity) {
    case 'beginner': return '★☆☆';
    case 'intermediate': return '★★☆';
    case 'advanced': return '★★★';
    case 'expert': return '★★★★';
    default: return '☆☆☆';
  }
}

export default function ProblemIndexDashboard({
  taxonomy,
  workflowMap,
  decisionGuideMap,
  modelMap,
  patternMap,
  debugGuideMap,
  packageMap,
  registryMap
}: ProblemIndexDashboardProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Initial States
  const initialQuery = searchParams.get('q') || '';
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(initialQuery);

  // Lazy initial state: load collapsed categories from localStorage after hydration
  // Use empty Set initially to match server-side rendering, then sync with localStorage in useEffect
  const [hydratedState, setHydratedState] = useState<{ collapsedCategories: Set<string>; isHydrated: boolean }>({
    collapsedCategories: new Set(),
    isHydrated: false
  });

  // Sync collapsed categories from localStorage after hydration
  useEffect(() => {
    const stored = localStorage.getItem('problem_index_collapsed_categories');
    const categories = stored ? JSON.parse(stored) : [];

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHydratedState({
      collapsedCategories: new Set(categories),
      isHydrated: true
    });
  }, []);

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [stickyState, setStickyState] = useState<'full' | 'compact'>('full');

  // Multi-select filters states
  const [selectedTypes, setSelectedTypes] = useState<NavigatorProblemType[]>([]);
  const [selectedModalities, setSelectedModalities] = useState<InputModality[]>([]);
  const [selectedComplexities, setSelectedComplexities] = useState<EngineeringComplexity[]>([]);
  const [selectedMaturities, setSelectedMaturities] = useState<string[]>([]);
  const [selectedCharacteristics, setSelectedCharacteristics] = useState<EngineeringCharacteristic[]>([]);

  // Sort State
  const [sortBy, setSortBy] = useState<'name' | 'maturity' | 'complexity' | 'solutions'>('maturity');

  // Open dropdown tracker
  const [openDropdown, setOpenDropdown] = useState<'type' | 'modality' | 'complexity' | 'maturity' | 'characteristic' | 'sort' | 'moreFilters' | null>(null);

  // Card expansion state for additional solutions and related resources
  const [expandedCards, setExpandedCards] = useState<Record<string, { solutions: boolean; resources: boolean }>>({});

  // Memoize Category Slugs
  const categorySlugs = useMemo(() => {
    const slugs: Record<string, string> = {};
    Object.keys(taxonomy).forEach(cat => {
      slugs[cat] = cat.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    });
    return slugs;
  }, [taxonomy]);

  // Debounce Search Input and Sync URL Query Param
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

  // Keyboard Shortcut (focus with Ctrl+K or '/')
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;

      if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA' || activeEl.getAttribute('contenteditable') === 'true')) {
        return;
      }
      if (e.key === '/') {
        e.preventDefault();
        searchInputRef.current?.focus();
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Unified Scroll State Controller
  useEffect(() => {
    const mainElement = document.getElementById('main-scroll');
    if (!mainElement) return;

    const handleScroll = () => {
      const scrollY = mainElement.scrollTop;

      // Change sticky state at 120px
      setStickyState(scrollY > 120 ? 'compact' : 'full');
    };

    mainElement.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => {
      mainElement.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Highlight Visible Category on Scroll (Intersection Observer)
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
        rootMargin: '-10% 0px -75% 0px',
      }
    );

    categories.forEach(cat => {
      const slug = categorySlugs[cat];
      const el = document.getElementById(`category-${slug}`);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [taxonomy, categorySlugs]);

  // Search logic helper
  const matchesSearch = useCallback((problem: Problem, query: string, categoryName: string) => {
    if (!query) return true;

    // 1. Base details
    if (problem.name.toLowerCase().includes(query)) return true;
    if (problem.description.toLowerCase().includes(query)) return true;
    if (categoryName.toLowerCase().includes(query)) return true;

    // 2. Aliases, keywords, tokens, tags
    if (problem.aliases?.some(a => a.toLowerCase().includes(query))) return true;
    if (problem.keywords?.some(k => k.toLowerCase().includes(query))) return true;
    if (problem.search_tokens?.some(s => s.toLowerCase().includes(query))) return true;
    if (problem.tags?.some(t => t.toLowerCase().includes(query))) return true;

    // 3. Prerequisites requires
    if (problem.requires?.some(rId => {
      if (rId.toLowerCase().includes(query)) return true;
      const resolved = resolveName(rId, modelMap, patternMap, debugGuideMap, packageMap, registryMap, workflowMap);
      return resolved.toLowerCase().includes(query);
    })) return true;

    // 4. Cross references
    if (problem.related_models?.some(mId => {
      if (mId.toLowerCase().includes(query)) return true;
      const details = modelMap[mId];
      return details && details.name.toLowerCase().includes(query);
    })) return true;

    if (problem.related_patterns?.some(pId => {
      if (pId.toLowerCase().includes(query)) return true;
      const name = patternMap[pId];
      return name && name.toLowerCase().includes(query);
    })) return true;

    if (problem.related_debug_guides?.some(dId => {
      if (dId.toLowerCase().includes(query)) return true;
      const name = debugGuideMap[dId];
      return name && name.toLowerCase().includes(query);
    })) return true;

    if (problem.related_packages?.some(pId => {
      if (pId.toLowerCase().includes(query)) return true;
      const name = packageMap[pId];
      return name && name.toLowerCase().includes(query);
    })) return true;

    if (problem.related_registry?.some(rId => {
      if (rId.toLowerCase().includes(query)) return true;
      const name = registryMap[rId];
      return name && name.toLowerCase().includes(query);
    })) return true;

    // 5. Workflows
    if (problem.related_workflows.some(wfId => {
      if (wfId.toLowerCase().includes(query)) return true;
      const wf = workflowMap[wfId];
      return wf && (
        wf.title.toLowerCase().includes(query) ||
        wf.description.toLowerCase().includes(query) ||
        wf.tags?.some(tag => tag.toLowerCase().includes(query))
      );
    })) return true;

    // 6. Decision Guides
    if (problem.related_decision_guides?.some(dgId => {
      if (dgId.toLowerCase().includes(query)) return true;
      const dg = decisionGuideMap[dgId];
      return dg && (
        dg.title.toLowerCase().includes(query) ||
        dg.description.toLowerCase().includes(query)
      );
    })) return true;

    return false;
  }, [modelMap, patternMap, debugGuideMap, packageMap, registryMap, workflowMap, decisionGuideMap]);

  // Filter & Sorting Logic
  const filteredTaxonomy = useMemo(() => {
    const query = debouncedSearchQuery.toLowerCase().trim();
    const result: Taxonomy = {};

    Object.entries(taxonomy).forEach(([category, data]) => {
      const matchingProblems = data.problems.filter(p => {
        // Search query filter
        if (!matchesSearch(p, query, category)) return false;

        // Problem Type filter
        if (selectedTypes.length > 0 && !p.problem_type.some(t => selectedTypes.includes(t))) return false;

        // Input Modality filter
        if (selectedModalities.length > 0 && !p.input_modalities.some(m => selectedModalities.includes(m))) return false;

        // Complexity filter
        if (selectedComplexities.length > 0 && !selectedComplexities.includes(p.engineering_complexity)) return false;

        // Maturity filter
        if (selectedMaturities.length > 0) {
          const maturity = getProblemMaturity(p, workflowMap);
          if (!selectedMaturities.includes(maturity)) return false;
        }

        // Characteristics filter
        if (selectedCharacteristics.length > 0) {
          if (!p.engineering_characteristics) return false;
          if (!p.engineering_characteristics.some(c => selectedCharacteristics.includes(c))) return false;
        }

        return true;
      });

      if (matchingProblems.length > 0) {
        // Sort problems within category
        const sorted = [...matchingProblems].sort((a, b) => {
          if (sortBy === 'name') {
            return a.name.localeCompare(b.name);
          }
          if (sortBy === 'maturity') {
            const matWeight = { 'Production': 4, 'Stable': 3, 'Beta': 2, 'Research': 1, 'Experimental': 0 };
            const aM = matWeight[getProblemMaturity(a, workflowMap)];
            const bM = matWeight[getProblemMaturity(b, workflowMap)];
            return bM - aM; // Mature first
          }
          if (sortBy === 'complexity') {
            const compWeight = { 'beginner': 0, 'intermediate': 1, 'advanced': 2, 'expert': 3 };
            return compWeight[a.engineering_complexity] - compWeight[b.engineering_complexity]; // Easy to hard
          }
          if (sortBy === 'solutions') {
            const aS = a.related_workflows.length + (a.related_decision_guides?.length ?? 0);
            const bS = b.related_workflows.length + (b.related_decision_guides?.length ?? 0);
            return bS - aS; // Most solutions first
          }
          return 0;
        });

        result[category] = {
          description: data.description,
          problems: sorted,
        };
      }
    });

    return result;
  }, [
    taxonomy,
    debouncedSearchQuery,
    selectedTypes,
    selectedModalities,
    selectedComplexities,
    selectedMaturities,
    selectedCharacteristics,
    sortBy,
    workflowMap,
    matchesSearch
  ]);

  const totalFilteredProblems = useMemo(() => {
    return Object.values(filteredTaxonomy).reduce((acc, data) => acc + data.problems.length, 0);
  }, [filteredTaxonomy]);

  const hasActiveFilters =
    selectedTypes.length > 0 ||
    selectedModalities.length > 0 ||
    selectedComplexities.length > 0 ||
    selectedMaturities.length > 0 ||
    selectedCharacteristics.length > 0;

  const clearAllFilters = () => {
    setSelectedTypes([]);
    setSelectedModalities([]);
    setSelectedComplexities([]);
    setSelectedMaturities([]);
    setSelectedCharacteristics([]);
    setSortBy('maturity');
  };

  // Collapse / Expand handlers
  const handleToggleCollapse = (category: string) => {
    setHydratedState(prev => {
      const next = new Set(prev.collapsedCategories);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      localStorage.setItem('problem_index_collapsed_categories', JSON.stringify(Array.from(next)));
      return { ...prev, collapsedCategories: next };
    });
  };

  const expandAll = () => {
    setHydratedState(prev => ({ ...prev, collapsedCategories: new Set() }));
    localStorage.setItem('problem_index_collapsed_categories', '[]');
  };

  const collapseAll = () => {
    const allCats = Object.keys(taxonomy);
    setHydratedState(prev => ({ ...prev, collapsedCategories: new Set(allCats) }));
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

  // Toggle helpers for multi-select arrays
  const toggleFilter = <T,>(list: T[], setList: (updated: T[]) => void, item: T) => {
    if (list.includes(item)) {
      setList(list.filter(i => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  const toggleCardExpansion = (problemId: string, section: 'solutions' | 'resources') => {
    setExpandedCards(prev => ({
      ...prev,
      [problemId]: {
        ...prev[problemId],
        [section]: !prev[problemId]?.[section]
      }
    }));
  };

  return (
    <div className="space-y-6 relative">
      {/* Background click-outside overlay for active filter dropdowns */}
      {openDropdown && (
        <div
          className="fixed inset-0 z-30 cursor-default"
          onClick={() => setOpenDropdown(null)}
        />
      )}


      {/* Sticky Filters & Search Area */}
      <div className={`sticky top-0 z-40 transition-all duration-300 ${stickyState === 'compact'
          ? 'bg-background/95 backdrop-blur-md border-b border-border py-2'
          : 'bg-background/95 backdrop-blur-md border-b border-border py-3'
        }`}>
        <div className="relative space-y-3">
          {/* Persistent Search input */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-muted-foreground" />
            <input
              ref={searchInputRef}
              id="problem-search-input"
              type="text"
              placeholder="Search problems, workflows, aliases, tags, or cross-references... (Press '/' to focus)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-2 rounded-lg border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all shadow-xs"
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
              <kbd className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[9px] font-medium text-muted-foreground">
                Ctrl K
              </kbd>
            )}
          </div>

          {/* Interactive Filters Grid & Sorting Panel */}
          <div className="flex items-center gap-2 pt-1 z-50 overflow-x-auto pb-1 scrollbar-none md:flex-wrap">
            {/* Primary Filters: Complexity, Maturity */}
            {/* Complexity Filter */}
            <div className="relative">
              <button
                onClick={() => setOpenDropdown(openDropdown === 'complexity' ? null : 'complexity')}
                aria-expanded={openDropdown === 'complexity'}
                className={`inline-flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-semibold border cursor-pointer select-none transition-all focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 min-h-[44px] ${selectedComplexities.length > 0
                    ? 'bg-primary/10 text-primary border-primary/30'
                    : 'bg-card border-border hover:bg-muted/50'
                  }`}
              >
                <Filter className="w-3 h-3" />
                <span>Complexity</span>
                {selectedComplexities.length > 0 && (
                  <span className="ml-1 bg-primary text-primary-foreground text-[9px] font-bold px-1.5 py-0.2 rounded-full">
                    {selectedComplexities.length}
                  </span>
                )}
                <ChevronDown className="w-3 h-3 ml-0.5" />
              </button>
              {openDropdown === 'complexity' && (
                <div className="absolute left-0 mt-1.5 w-48 rounded-lg border border-border bg-card shadow-lg p-2 space-y-1 z-40">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase px-2 py-1">Filter by Complexity</p>
                  {(['beginner', 'intermediate', 'advanced', 'expert'] as EngineeringComplexity[]).map(c => (
                    <button
                      key={c}
                      onClick={() => toggleFilter(selectedComplexities, setSelectedComplexities, c)}
                      className="w-full flex items-center justify-between px-2.5 py-1.5 rounded text-xs text-foreground hover:bg-muted text-left cursor-pointer focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1"
                    >
                      <span className="capitalize">{c} {renderComplexityStars(c)}</span>
                      {selectedComplexities.includes(c) && <Check className="w-3.5 h-3.5 text-primary" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Maturity Filter */}
            <div className="relative">
              <button
                onClick={() => setOpenDropdown(openDropdown === 'maturity' ? null : 'maturity')}
                aria-expanded={openDropdown === 'maturity'}
                className={`inline-flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-semibold border cursor-pointer select-none transition-all focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 min-h-[44px] ${selectedMaturities.length > 0
                    ? 'bg-primary/10 text-primary border-primary/30'
                    : 'bg-card border-border hover:bg-muted/50'
                  }`}
              >
                <Filter className="w-3 h-3" />
                <span>Maturity</span>
                {selectedMaturities.length > 0 && (
                  <span className="ml-1 bg-primary text-primary-foreground text-[9px] font-bold px-1.5 py-0.2 rounded-full">
                    {selectedMaturities.length}
                  </span>
                )}
                <ChevronDown className="w-3 h-3 ml-0.5" />
              </button>
              {openDropdown === 'maturity' && (
                <div className="absolute left-0 mt-1.5 w-48 rounded-lg border border-border bg-card shadow-lg p-2 space-y-1 z-40">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase px-2 py-1">Filter by Maturity</p>
                  {['Production', 'Stable', 'Beta', 'Research', 'Experimental'].map(m => (
                    <button
                      key={m}
                      onClick={() => toggleFilter(selectedMaturities, setSelectedMaturities, m)}
                      className="w-full flex items-center justify-between px-2.5 py-1.5 rounded text-xs text-foreground hover:bg-muted text-left cursor-pointer focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1"
                    >
                      <span>{m}</span>
                      {selectedMaturities.includes(m) && <Check className="w-3.5 h-3.5 text-primary" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* More Filters (Type, Modality, Characteristics) */}
            <div className="relative">
              <button
                onClick={() => setOpenDropdown(openDropdown === 'moreFilters' ? null : 'moreFilters')}
                aria-expanded={openDropdown === 'moreFilters'}
                className={`inline-flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-semibold border cursor-pointer select-none transition-all focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 min-h-[44px] ${selectedTypes.length > 0 || selectedModalities.length > 0 || selectedCharacteristics.length > 0
                    ? 'bg-primary/10 text-primary border-primary/30'
                    : 'bg-card border-border hover:bg-muted/50'
                  }`}
              >
                <Filter className="w-3 h-3" />
                <span>More filters</span>
                {(selectedTypes.length + selectedModalities.length + selectedCharacteristics.length) > 0 && (
                  <span className="ml-1 bg-primary text-primary-foreground text-[9px] font-bold px-1.5 py-0.2 rounded-full">
                    {selectedTypes.length + selectedModalities.length + selectedCharacteristics.length}
                  </span>
                )}
                <ChevronDown className="w-3 h-3 ml-0.5" />
              </button>
              {openDropdown === 'moreFilters' && (
                <div className="absolute left-0 mt-1.5 w-72 rounded-lg border border-border bg-card shadow-lg p-3 space-y-3 z-40 max-h-96 overflow-y-auto">
                  {/* Type Filter */}
                  <div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase px-2 py-1">Problem Type</p>
                    <div className="space-y-1">
                      {(['classification', 'generation', 'retrieval', 'prediction', 'ranking', 'clustering', 'planning', 'reasoning', 'forecasting'] as NavigatorProblemType[]).map(t => (
                        <button
                          key={t}
                          onClick={() => toggleFilter(selectedTypes, setSelectedTypes, t)}
                          className="w-full flex items-center justify-between px-2.5 py-1.5 rounded text-xs text-foreground hover:bg-muted text-left cursor-pointer focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1"
                        >
                          <span className="capitalize">{t}</span>
                          {selectedTypes.includes(t) && <Check className="w-3.5 h-3.5 text-primary" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Modality Filter */}
                  <div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase px-2 py-1">Input Modality</p>
                    <div className="space-y-1">
                      {(['text', 'image', 'audio', 'video', 'tabular', 'multimodal'] as InputModality[]).map(m => (
                        <button
                          key={m}
                          onClick={() => toggleFilter(selectedModalities, setSelectedModalities, m)}
                          className="w-full flex items-center justify-between px-2.5 py-1.5 rounded text-xs text-foreground hover:bg-muted text-left cursor-pointer focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1"
                        >
                          <span className="capitalize">{m}</span>
                          {selectedModalities.includes(m) && <Check className="w-3.5 h-3.5 text-primary" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Characteristics Filter */}
                  <div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase px-2 py-1">Engineering Traits</p>
                    <div className="space-y-1">
                      {([
                        'real_time', 'batch', 'streaming', 'offline', 'gpu_required',
                        'large_dataset', 'low_latency', 'high_throughput', 'resource_constrained'
                      ] as EngineeringCharacteristic[]).map(c => (
                        <button
                          key={c}
                          onClick={() => toggleFilter(selectedCharacteristics, setSelectedCharacteristics, c)}
                          className="w-full flex items-center justify-between px-2.5 py-1.5 rounded text-xs text-foreground hover:bg-muted text-left cursor-pointer focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1"
                        >
                          <span className="capitalize">{c.replace(/_/g, ' ')}</span>
                          {selectedCharacteristics.includes(c) && <Check className="w-3.5 h-3.5 text-primary" />}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Reset Filters */}
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="inline-flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-semibold border border-dashed border-red-500/30 text-red-500 hover:bg-red-500/10 cursor-pointer select-none transition-all focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 min-h-[44px]"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}

            {/* Sorting Options */}
            <div className="relative ml-auto">
              <button
                onClick={() => setOpenDropdown(openDropdown === 'sort' ? null : 'sort')}
                aria-expanded={openDropdown === 'sort'}
                className="inline-flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-semibold border border-border bg-card hover:bg-muted/50 cursor-pointer select-none transition-all shadow-xs focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 min-h-[44px]"
              >
                <span className="text-muted-foreground font-normal">Sort:</span>
                <span className="capitalize font-bold">{sortBy === 'solutions' ? 'Solution Count' : sortBy}</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
              {openDropdown === 'sort' && (
                <div className="absolute right-0 mt-1.5 w-48 rounded-lg border border-border bg-card shadow-lg p-2 space-y-1 z-40">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase px-2 py-1">Sort Problems</p>
                  {[
                    { value: 'maturity', label: 'Solution Maturity' },
                    { value: 'complexity', label: 'Complexity' },
                    { value: 'name', label: 'Alphabetical Name' },
                    { value: 'solutions', label: 'Solution Count' }
                  ].map(s => (
                    <button
                      key={s.value}
                      onClick={() => {
                        setSortBy(s.value as typeof sortBy);
                        setOpenDropdown(null);
                      }}
                      className="w-full flex items-center justify-between px-2.5 py-1.5 rounded text-xs text-foreground hover:bg-muted text-left cursor-pointer focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1"
                    >
                      <span>{s.label}</span>
                      {sortBy === s.value && <Check className="w-3.5 h-3.5 text-primary" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Active Filter Badges - integrated inline with filters */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-1.5 mt-2 select-none overflow-x-auto pb-1 scrollbar-none md:flex-wrap">
            {selectedComplexities.map(c => (
              <span key={c} className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-muted text-[10px] font-medium border border-border text-foreground">
                <span className="capitalize">{c}</span>
                <button onClick={() => toggleFilter(selectedComplexities, setSelectedComplexities, c)} className="hover:text-red-500 cursor-pointer focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 min-h-[32px] min-w-[32px] flex items-center justify-center">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            {selectedMaturities.map(m => (
              <span key={m} className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-muted text-[10px] font-medium border border-border text-foreground">
                <span>{m}</span>
                <button onClick={() => toggleFilter(selectedMaturities, setSelectedMaturities, m)} className="hover:text-red-500 cursor-pointer focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 min-h-[32px] min-w-[32px] flex items-center justify-center">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            {selectedTypes.map(t => (
              <span key={t} className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-muted text-[10px] font-medium border border-border text-foreground">
                <span className="capitalize">{t}</span>
                <button onClick={() => toggleFilter(selectedTypes, setSelectedTypes, t)} className="hover:text-red-500 cursor-pointer focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 min-h-[32px] min-w-[32px] flex items-center justify-center">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            {selectedModalities.map(m => (
              <span key={m} className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-muted text-[10px] font-medium border border-border text-foreground">
                <span className="capitalize">{m}</span>
                <button onClick={() => toggleFilter(selectedModalities, setSelectedModalities, m)} className="hover:text-red-500 cursor-pointer focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 min-h-[32px] min-w-[32px] flex items-center justify-center">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            {selectedCharacteristics.map(c => (
              <span key={c} className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-muted text-[10px] font-medium border border-border text-foreground">
                <span className="capitalize">{c.replace(/_/g, ' ')}</span>
                <button onClick={() => toggleFilter(selectedCharacteristics, setSelectedCharacteristics, c)} className="hover:text-red-500 cursor-pointer focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 min-h-[32px] min-w-[32px] flex items-center justify-center">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Navigation & Action Toolbar */}
      <div
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 pt-2 mt-2 border-t border-border/40"
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
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all whitespace-nowrap cursor-pointer select-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 min-h-[44px] ${isActive
                    ? 'bg-primary text-primary-foreground border-primary shadow-xs'
                    : 'border-border bg-muted/30 text-muted-foreground hover:text-foreground hover:bg-muted hover:border-foreground/25'
                  }`}
              >
                <IconComponent className="w-3.5 h-3.5" />
                <span>{category}</span>
                <span className={`text-[9px] px-1 rounded font-bold ${isActive ? 'bg-primary-foreground/20 text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>{size}</span>
              </button>
            );
          })}
        </div>

        {/* Bulk Toggles and Search Summary Counter */}
        <div className="flex items-center justify-between md:justify-end gap-3 select-none w-full md:w-auto border-t border-border/40 pt-2 md:border-t-0 md:pt-0">
          <div>
            <p className="text-[10px] font-bold text-muted-foreground select-none">
              {searchQuery.trim() || hasActiveFilters ? (
                `Found ${totalFilteredProblems} matching ${totalFilteredProblems === 1 ? 'problem' : 'problems'}`
              ) : (
                'Global Dashboard Actions'
              )}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={expandAll}
              className="inline-flex items-center gap-1 px-2.5 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 min-h-[44px]"
              aria-label="Expand all categories"
            >
              <ChevronsDown className="w-3.5 h-3.5" />
              Expand All
            </button>
            <button
              onClick={collapseAll}
              className="inline-flex items-center gap-1 px-2.5 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 min-h-[44px]"
              aria-label="Collapse all categories"
            >
              <ChevronsUp className="w-3.5 h-3.5" />
              Collapse All
            </button>
          </div>
        </div>
      </div>

      {/* Category & Problem Grid */}
      {hasResults ? (
        <div className="space-y-6 pt-20">
          {Object.entries(filteredTaxonomy).map(([category, data]) => {
            // On server and before hydration, all categories are expanded (isCollapsed = false)
            // After hydration, use localStorage state
            const isCollapsed = !hydratedState.isHydrated ? false : (debouncedSearchQuery.trim() || hasActiveFilters ? false : hydratedState.collapsedCategories.has(category));
            const IconComponent = getCategoryIcon(category);
            const slug = categorySlugs[category];

            const totalInCat = taxonomy[category].problems.length;
            const solvedInCat = taxonomy[category].problems.filter(p => p.related_workflows.length > 0 || (p.related_decision_guides && p.related_decision_guides.length > 0)).length;

            return (
              <section
                key={category}
                id={`category-${slug}`}
                className="scroll-mt-20 rounded-l border border-border bg-card overflow-hidden transition-all duration-100"
              >
                {/* Category Header */}
                <button
                  onClick={() => handleToggleCollapse(category)}
                  aria-expanded={!isCollapsed}
                  aria-controls={`category-content-${slug}`}
                  suppressHydrationWarning
                  className="w-full px-5 py-4 bg-muted/10 hover:bg-muted/20 border-b border-border transition-all flex items-start justify-between gap-3 text-left cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-lg bg-primary/5 border border-primary/10">
                      <IconComponent className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-sm font-bold text-foreground flex items-center flex-wrap gap-2">
                        <span>{category}</span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary font-mono font-bold">
                          {data.problems.length} {data.problems.length === 1 ? 'Problem' : 'Problems'}
                        </span>
                        <span className="text-[9px] text-muted-foreground font-medium select-none">
                          ({solvedInCat}/{totalInCat} solved)
                        </span>
                      </h2>
                      <p className="text-xs text-muted-foreground mt-0.5">{data.description}</p>
                    </div>
                  </div>
                  <ChevronDown
                    suppressHydrationWarning
                    className={`w-5 h-5 text-muted-foreground shrink-0 mt-1 transition-transform duration-200 ${isCollapsed ? 'rotate-0' : 'rotate-180'}`}
                  />
                </button>

                {/* Collapsible content area */}
                <div
                  id={`category-content-${slug}`}
                  aria-hidden={isCollapsed}
                  suppressHydrationWarning
                  className="grid transition-[grid-template-rows,opacity] duration-300 ease-in-out"
                  style={{
                    gridTemplateRows: isCollapsed ? '0fr' : '1fr',
                    opacity: isCollapsed ? 0 : 1,
                  }}
                >
                  <div className="overflow-hidden">
<div className="p-4 sm:p-5 grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2">
                      {data.problems.map(problem => {
                        const hasWorkflows = problem.related_workflows.length > 0 || (problem.related_decision_guides && problem.related_decision_guides.length > 0);
                        const computedMaturity = getProblemMaturity(problem, workflowMap);
                        const isExpanded = expandedCards[problem.id] || { solutions: false, resources: false };

                        // Get the highest maturity workflow for primary action
                        const primaryWorkflow = problem.related_workflows.length > 0
                          ? problem.related_workflows
                            .map(id => workflowMap[id])
                            .filter(Boolean)
                            .sort((a, b) => {
                              const maturityWeight: Record<string, number> = { 'production_proven': 4, 'stable': 3, 'verified': 2, 'experimental': 1, 'research': 0 };
                              const aConfidence = (a.confidence || 'research') as keyof typeof maturityWeight;
                              const bConfidence = (b.confidence || 'research') as keyof typeof maturityWeight;
                              const aWeight = maturityWeight[aConfidence] ?? 0;
                              const bWeight = maturityWeight[bConfidence] ?? 0;
                              return bWeight - aWeight;
                            })[0]
                          : null;

                        const additionalWorkflows = primaryWorkflow
                          ? problem.related_workflows.filter(id => id !== primaryWorkflow.id)
                          : problem.related_workflows;

                        const hasRelatedResources =
                          (problem.related_models?.length ?? 0) > 0 ||
                          (problem.related_patterns?.length ?? 0) > 0 ||
                          (problem.related_debug_guides?.length ?? 0) > 0 ||
                          (problem.related_packages?.length ?? 0) > 0 ||
                          (problem.related_registry?.length ?? 0) > 0;

                        return (
<div
                            key={problem.id}
                            className="rounded-xl border border-border/80 bg-muted/5 dark:bg-muted/[0.005] p-4 sm:p-5 flex flex-col gap-3 sm:gap-4 transition-all hover:shadow-sm hover:border-border/100 touch-target"
                          >
                            {/* Header Zone: Problem name + aliases + combined status/maturity */}
                            <div>
                              <div className="flex items-start justify-between gap-3">
                                <div className="flex-1">
                                  <h3 className="text-sm font-bold text-foreground leading-snug">
                                    <HighlightText text={problem.name} query={debouncedSearchQuery} />
                                  </h3>
                                  {problem.aliases && problem.aliases.length > 0 && (
                                    <p className="text-[10px] text-muted-foreground mt-0.5 font-medium">
                                      Also known as: {problem.aliases.slice(0, 2).map(a => <span key={a} className="mr-1.5 italic">&ldquo;{a}&rdquo;</span>)}
                                      {problem.aliases.length > 2 && <span className="text-muted-foreground">+{problem.aliases.length - 2} more</span>}
                                    </p>
                                  )}
                                </div>
                                <div className="flex items-center gap-1.5 shrink-0">
                                  {/* Combined status/maturity badge */}
                                  <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-mono font-bold select-none ${computedMaturity === 'Production' ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400' :
                                      computedMaturity === 'Stable' ? 'bg-blue-500/10 text-blue-700 dark:text-blue-400' :
                                        computedMaturity === 'Beta' ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400' :
                                          'bg-muted text-muted-foreground'
                                    }`}>
                                    {hasWorkflows ? <CheckCircle2 className="w-2.5 h-2.5" /> : <Compass className="w-2.5 h-2.5" />}
                                    {computedMaturity}
                                  </span>
                                </div>
                              </div>
                              {/* Summary Zone: Description */}
                              <p className="text-xs text-muted-foreground mt-2 leading-relaxed max-w-prose">
                                <HighlightText text={problem.description} query={debouncedSearchQuery} />
                              </p>
                            </div>

                            {/* Primary Action Zone: Best solution surfaced immediately */}
                            {primaryWorkflow && (
                              <div className="bg-card border border-border/60 rounded-lg p-3">
                                <div className="flex items-center justify-between gap-3">
                                  <div className="flex-1 min-w-0">
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Start here</p>
                                    <p className="text-xs font-bold text-foreground truncate">
                                      <HighlightText text={primaryWorkflow.title} query={debouncedSearchQuery} />
                                    </p>
                                    {primaryWorkflow.description && (
                                      <p className="text-[11px] text-muted-foreground leading-normal line-clamp-1 mt-0.5">
                                        <HighlightText text={primaryWorkflow.description} query={debouncedSearchQuery} />
                                      </p>
                                    )}
                                  </div>
                                  <Link
                                    href={`/workflows/${primaryWorkflow.id}`}
                                    className="shrink-0 inline-flex items-center gap-1 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 transition-all cursor-pointer select-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 min-h-[44px]"
                                  >
                                    Open
                                    <ArrowRight className="w-3 h-3" />
                                  </Link>
                                </div>
                              </div>
                            )}

                            {/* Fact Strip: Compact metadata */}
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-muted-foreground">
                              <span className="font-medium">Complexity:</span>
                              <span className="font-semibold text-foreground capitalize inline-flex items-center gap-0.5">
                                {problem.engineering_complexity}
                                <span className="text-amber-500 font-mono text-[8px]">
                                  {renderComplexityStars(problem.engineering_complexity)}
                                </span>
                              </span>
                              <span className="text-border/40">|</span>
                              <span className="font-medium">Modality:</span>
                              <span className="font-semibold text-foreground capitalize">{problem.input_modalities.join(', ')}</span>
                              {problem.engineering_characteristics && problem.engineering_characteristics.length > 0 && (
                                <>
                                  <span className="text-border/40">|</span>
                                  <span className="font-medium">Traits:</span>
                                  <span className="font-semibold text-foreground truncate max-w-[150px]" title={problem.engineering_characteristics.join(', ').replace(/_/g, ' ')}>
                                    {problem.engineering_characteristics.slice(0, 2).join(', ').replace(/_/g, ' ')}
                                    {problem.engineering_characteristics.length > 2 && '...'}
                                  </span>
                                </>
                              )}
                            </div>

                            {/* Prerequisites - only when non-empty */}
                            {problem.requires && problem.requires.length > 0 && (
                              <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
                                <span className="font-semibold text-muted-foreground uppercase tracking-wider">Requires:</span>
                                {problem.requires.slice(0, 3).map(rId => {
                                  const link = resolveLink(rId, modelMap, patternMap, debugGuideMap, packageMap, registryMap, workflowMap);
                                  const name = resolveName(rId, modelMap, patternMap, debugGuideMap, packageMap, registryMap, workflowMap);

                                  if (link) {
                                    return (
                                      <Link
                                        key={rId}
                                        href={link}
                                        className="inline-flex items-center px-2 py-0.5 rounded bg-primary/5 hover:bg-primary/10 border border-primary/10 hover:border-primary/20 text-[10px] font-semibold text-primary transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1"
                                      >
                                        {name}
                                      </Link>
                                    );
                                  }

                                  return (
                                    <span key={rId} className="inline-flex items-center px-2 py-0.5 rounded bg-muted text-[10px] font-medium border border-border text-foreground">
                                      {name}
                                    </span>
                                  );
                                })}
                                {problem.requires.length > 3 && (
                                  <span className="text-muted-foreground">+{problem.requires.length - 3} more</span>
                                )}
                              </div>
                            )}

                            {/* Additional Solutions - collapsible */}
                            {(additionalWorkflows.length > 0 || (problem.related_decision_guides && problem.related_decision_guides.length > 0)) && (
                              <div className="border-t border-border/50 pt-3">
                                <button
                                  onClick={() => toggleCardExpansion(problem.id, 'solutions')}
                                  className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1"
                                >
                                  {isExpanded.solutions ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                                  {additionalWorkflows.length + (problem.related_decision_guides?.length ?? 0)} more solutions
                                </button>
                                {isExpanded.solutions && (
                                  <div className="mt-2 space-y-2">
                                    {additionalWorkflows.map(wfId => {
                                      const metadata = workflowMap[wfId];
                                      if (metadata) {
                                        return (
                                          <div key={wfId} className="rounded-lg border border-border/80 bg-card p-3 flex flex-col justify-between gap-1.5 hover:border-foreground/15 transition-all text-xs shadow-xs">
                                            <div className="flex items-center justify-between gap-3">
                                              <div className="min-w-0">
                                                <p className="font-bold text-foreground truncate">
                                                  <HighlightText text={metadata.title} query={debouncedSearchQuery} />
                                                </p>
                                              </div>
                                              <Link href={`/workflows/${wfId}`} className="shrink-0 inline-flex items-center gap-0.5 px-2 py-1 rounded bg-primary/5 hover:bg-primary/10 border border-primary/10 hover:border-primary/20 text-[10px] font-bold text-primary transition-all cursor-pointer select-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1">
                                                Open <ArrowRight className="w-3 h-3" />
                                              </Link>
                                            </div>
                                            {metadata.description && (
                                              <p className="text-[11px] text-muted-foreground leading-normal line-clamp-2">
                                                <HighlightText text={metadata.description} query={debouncedSearchQuery} />
                                              </p>
                                            )}
                                          </div>
                                        );
                                      }
                                      return null;
                                    })}
                                    {problem.related_decision_guides?.map(dgId => {
                                      const metadata = decisionGuideMap[dgId];
                                      if (metadata) {
                                        return (
                                          <div key={dgId} className="rounded-lg border border-border/80 bg-card p-3 flex flex-col justify-between gap-1.5 hover:border-foreground/15 transition-all text-xs shadow-xs">
                                            <div className="flex items-center justify-between gap-3">
                                              <div className="min-w-0">
                                                <p className="font-bold text-foreground truncate">
                                                  <HighlightText text={metadata.title} query={debouncedSearchQuery} />
                                                </p>
                                              </div>
                                              <Link href={`/decision-guides/${dgId}`} className="shrink-0 inline-flex items-center gap-0.5 px-2 py-1 rounded bg-primary/5 hover:bg-primary/10 border border-primary/10 hover:border-primary/20 text-[10px] font-bold text-primary transition-all cursor-pointer select-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1">
                                                Open <ArrowRight className="w-3 h-3" />
                                              </Link>
                                            </div>
                                            {metadata.description && (
                                              <p className="text-[11px] text-muted-foreground leading-normal line-clamp-2">
                                                <HighlightText text={metadata.description} query={debouncedSearchQuery} />
                                              </p>
                                            )}
                                          </div>
                                        );
                                      }
                                      return null;
                                    })}
                                  </div>
                                )}
                              </div>
                            )}

                            {/* Related Resources - collapsible */}
                            {hasRelatedResources && (
                              <div className="border-t border-border/50 pt-3">
                                <button
                                  onClick={() => toggleCardExpansion(problem.id, 'resources')}
                                  className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1"
                                >
                                  {isExpanded.resources ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                                  Related resources
                                </button>
                                {isExpanded.resources && (
                                  <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[10px]">
                                    {problem.related_models?.map(mId => {
                                      const details = modelMap[mId];
                                      if (details) {
                                        return (
                                          <Link key={mId} href={`/models/${details.category}/${mId}`} className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded bg-primary/5 hover:bg-primary/10 border border-primary/10 hover:border-primary/20 text-[10px] font-semibold text-primary transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1">
                                            <Award className="w-3 h-3" /> {details.name}
                                          </Link>
                                        );
                                      }
                                      return null;
                                    })}
                                    {problem.related_patterns?.map(pId => {
                                      const name = patternMap[pId];
                                      return (
                                        <Link key={pId} href={`/patterns/${pId}`} className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded bg-primary/5 hover:bg-primary/10 border border-primary/10 hover:border-primary/20 text-[10px] font-semibold text-primary transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1">
                                          <Activity className="w-3 h-3" /> {name || pId}
                                        </Link>
                                      );
                                    })}
                                    {problem.related_debug_guides?.map(dId => {
                                      const name = debugGuideMap[dId];
                                      return (
                                        <Link key={dId} href={`/debug-guides/${dId}`} className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded bg-primary/5 hover:bg-primary/10 border border-primary/10 hover:border-primary/20 text-[10px] font-semibold text-primary transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1">
                                          <Terminal className="w-3 h-3" /> {name || dId}
                                        </Link>
                                      );
                                    })}
                                    {problem.related_packages?.map(pId => {
                                      const name = packageMap[pId];
                                      return (
                                        <Link key={pId} href={`/packages/${pId}`} className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded bg-primary/5 hover:bg-primary/10 border border-primary/10 hover:border-primary/20 text-[10px] font-semibold text-primary transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1">
                                          <Boxes className="w-3 h-3" /> {name || pId}
                                        </Link>
                                      );
                                    })}
                                    {problem.related_registry?.map(rId => {
                                      const name = registryMap[rId];
                                      return (
                                        <Link key={rId} href={`/registry/families/${rId}`} className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded bg-primary/5 hover:bg-primary/10 border border-primary/10 hover:border-primary/20 text-[10px] font-semibold text-primary transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1">
                                          <BookOpen className="w-3 h-3" /> {name || rId}
                                        </Link>
                                      );
                                    })}
                                  </div>
                                )}
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
        <div className="rounded-xl border border-dashed border-border bg-card p-8 text-center flex flex-col items-center justify-center py-12 select-none !mt-52">
          <Search className="w-8 h-8 text-muted-foreground/60 mb-2" />
          <h3 className="text-md font-bold text-foreground">No matches found</h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm leading-relaxed">
            We couldn&apos;t find any problems matching your search/filters criteria.
          </p>
          <button
            onClick={() => { setSearchQuery(''); clearAllFilters(); }}
            className="mt-3 px-4 py-2 bg-primary text-primary-foreground text-xs font-semibold rounded-lg hover:bg-primary/90 transition-colors cursor-pointer"
          >
            Clear Search & Filters
          </button>
        </div>
      )}
    </div>
  );
}
