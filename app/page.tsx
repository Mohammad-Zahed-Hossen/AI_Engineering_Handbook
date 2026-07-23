import Link from "next/link";
import { 
  getDashboardData,
  getKnowledgeExplorerPreview,
  getSummaryForItem,
  resolvePopularSearch,
  getContentHref,
  getAllPackageIds,
  getModelIds,
  getAllWorkflowIds,
  getAllCheatsheetIds,
  getAllPatternIds,
  getAllDebugGuideIds,
  getAllDecisionGuideIds,
  getAllPrincipleIds,
  getAllRegistryFamilyIds,
} from "@/lib/data";
import SearchBoxWrapper from "@/components/shared/SearchBoxWrapper";
import PersonalizedWidgets from "@/components/shared/PersonalizedWidgets";
import RecentlyAddedWidgetServer from "@/components/shared/RecentlyAddedWidgetServer";
import { formatRelativeTime } from "@/lib/format-date";
import { 
  ArrowRight, 
  Layers, 
  Code, 
  Cpu, 
  Workflow as WorkflowIcon, 
  Terminal, 
  ChevronRight, 
  Compass, 
  FileCode2, 
  Star,
  Activity,
  Bookmark,
  Flame,
  Zap,
  RefreshCw,
  Scale,
  ShieldCheck,
  Library,
  BarChart3,
  TrendingUp,
  Sparkles,
} from "lucide-react";
import {
  getContentTypeIcon,
  getContentTypeLabel,
} from "@/lib/content-type-meta";

// Icon mapping for dynamic intent loading
const INTENT_ICONS: Record<string, React.ElementType> = {
  Flame,
  Workflow: WorkflowIcon,
  Scale,
  Zap,
  Terminal,
  RefreshCw,
  ShieldCheck,
};

export default function Home() {
  const dashboardData = getDashboardData();
  const { counts, distribution, featured, intents, problemCategories, popularSearches, recent } = dashboardData;

  const totalModelsCount = counts.models_ml + counts.models_dl + counts.models_llm;
  const totalContent =
    getAllPackageIds().length +
    getModelIds('ml').length + getModelIds('dl').length + getModelIds('llm').length +
    getAllWorkflowIds().length +
    getAllCheatsheetIds().length +
    getAllPatternIds().length +
    getAllDebugGuideIds().length +
    getAllDecisionGuideIds().length +
    getAllPrincipleIds().length +
    getAllRegistryFamilyIds().length;

  // Get preview items for knowledge explorer cards
  const packagePreview = getKnowledgeExplorerPreview('package', 3);
  const modelPreview = getKnowledgeExplorerPreview('model', 3);
  const workflowPreview = getKnowledgeExplorerPreview('workflow', 3);

  return (
    <div className="space-y-6 sm:space-y-8 pb-10">
      {/* ── Section 1: Hero / Global Search ── */}
      <header className="space-y-4 sm:space-y-5">
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary/5 via-primary/[0.03] to-background border border-primary/10 p-4 sm:p-6">
          {/* Subtle decorative gradient blob */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 rounded-lg bg-primary/10 border border-primary/20">
                <Library className="w-4 h-4 text-primary" />
              </div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-primary/70">
                v{/* Version placeholder */}1.0
              </span>
            </div>
            <h1 className="text-lg sm:text-xl lg:text-2xl font-extrabold text-foreground tracking-tight">
              AENS
            </h1>
            <p className="mt-1.5 text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-2xl">
              A production-ready reference catalog for package syntax, neural network architectures, 
              pipeline workflows, cheatsheets, and debug baseline guides.
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <SearchBoxWrapper placeholder="Search by library name, task type, or engineering problem…" />
          
          {/* Quick Stats Bar */}
          <div className="flex flex-wrap gap-1.5 items-center text-[10px] text-muted-foreground select-none">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-muted/60 border border-border/60 font-medium">
              <BarChart3 className="w-3 h-3" />
              {totalContent} total entries
            </span>
            <span className="text-muted-foreground/40">·</span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-muted/60 border border-border/60 font-medium">
              <TrendingUp className="w-3 h-3" />
              {recent.length} recently updated
            </span>
            <span className="text-muted-foreground/40">·</span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-muted/60 border border-border/60 font-medium">
              <Sparkles className="w-3 h-3" />
              {intents.length} quick actions
            </span>
          </div>
        </div>

        {/* Popular Searches */}
        {popularSearches.length > 0 && (
          <div className="flex flex-wrap gap-1.5 items-center">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider select-none">Popular:</span>
            {popularSearches.map(term => {
              const resolvedHref = resolvePopularSearch(term);
              const href = resolvedHref || `/search?q=${encodeURIComponent(term)}`;
              return (
                <Link
                  key={term}
                  href={href}
                  className="group text-[10px] px-2 py-0.5 rounded-full bg-muted/50 hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all cursor-pointer border border-transparent hover:border-primary/20"
                >
                  <span className="inline-flex items-center gap-1">
                    {term}
                    <ArrowRight className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100 transition-opacity -ml-0.5" />
                  </span>
                </Link>
              );
            })}
          </div>
        )}
      </header>

      {/* ── Section 2: Personalized Widgets ── */}
      <PersonalizedWidgets />
      <RecentlyAddedWidgetServer />

      {/* ── Section 3: Problem-first Entry ── */}
      {problemCategories.length > 0 && (
        <section className="mobile-section-spacing">
          <div className="rounded-xl border border-border bg-card mobile-card-padding hover:border-primary/20 hover:shadow-sm hover:shadow-primary/5 transition-all group">
            <div className="flex items-start gap-2.5 sm:gap-3">
              <div className="p-1.5 sm:p-2 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 shrink-0 group-hover:from-primary/15 group-hover:to-primary/10 transition-all">
                <Layers className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-xs sm:text-sm font-bold text-foreground mb-1">
                  Not sure where to start?
                </h2>
                <p className="text-[10px] sm:text-xs text-muted-foreground mb-3">
                  Browse by Engineering Problem — find solutions organized by real-world challenges
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {problemCategories.slice(0, 5).map(cat => (
                    <Link
                      key={cat.id}
                      href={`/problem-index#${cat.id.toLowerCase().replace(/\s+/g, '-')}`}
                      className="text-[10px] px-2.5 py-1 rounded-full bg-muted/30 hover:bg-primary/10 text-foreground hover:text-primary transition-all cursor-pointer border border-transparent hover:border-primary/20 font-medium"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>
              <Link
                href="/problem-index"
                className="shrink-0 text-[10px] font-mono font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded-full hover:bg-primary/10 hover:text-primary transition-all inline-flex items-center gap-1"
              >
                View All <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── Section 4: Knowledge Explorer ── */}
      <section className="mobile-section-spacing space-y-3">
        <div className="flex items-center justify-between select-none">
          <div className="flex items-center gap-1.5">
            <Compass className="w-4.5 h-4.5 text-primary" />
            <h2 className="text-sm font-bold text-foreground">Knowledge Explorer</h2>
          </div>
          <span className="text-[10px] text-muted-foreground font-mono">
            {6} sections
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3">
          {[
            { 
              title: 'Problem Index', 
              description: 'Map common machine learning and deep learning engineering issues directly to reference guides.', 
              count: totalModelsCount,
              href: '/problem-index', 
              icon: Layers,
              accent: 'from-indigo-500/10 to-indigo-500/5',
              borderAccent: 'hover:border-indigo-500/30',
            },
            { 
              title: 'Packages', 
              description: 'Scientific Python library references, function definitions, parameters, and syntax helpers.', 
              count: counts.packages, 
              href: '/packages', 
              icon: Code,
              preview: packagePreview,
              accent: 'from-emerald-500/10 to-emerald-500/5',
              borderAccent: 'hover:border-emerald-500/30',
            },
            { 
              title: 'Models Library', 
              description: 'Prebuilt architectures, layers structures, and hyperparameter blueprints.', 
              count: totalModelsCount, 
              href: '/models', 
              icon: Cpu,
              preview: modelPreview,
              accent: 'from-violet-500/10 to-violet-500/5',
              borderAccent: 'hover:border-violet-500/30',
            },
            { 
              title: 'Workflows', 
              description: 'Step-by-step end-to-end pipelines, evaluation baselines, and production setup details.', 
              count: counts.workflows, 
              href: '/workflows', 
              icon: WorkflowIcon,
              preview: workflowPreview,
              accent: 'from-blue-500/10 to-blue-500/5',
              borderAccent: 'hover:border-blue-500/30',
            },
            { 
              title: 'Cheatsheets', 
              description: 'Dynamic reference index cards for quick API syntax recall and common bugs.', 
              count: counts.cheatsheets, 
              href: '/cheatsheets', 
              icon: FileCode2,
              accent: 'from-amber-500/10 to-amber-500/5',
              borderAccent: 'hover:border-amber-500/30',
            },
            { 
              title: 'Model Registry', 
              description: 'Deployment metadata and download locations for AI models.', 
              count: counts.registry_families, 
              href: '/registry', 
              icon: Terminal,
              accent: 'from-rose-500/10 to-rose-500/5',
              borderAccent: 'hover:border-rose-500/30',
            },
          ].map(cat => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.title}
                href={cat.href}
                className={`group rounded-xl border border-border bg-card mobile-card-padding ${cat.borderAccent} hover:shadow-sm transition-all flex flex-col gap-2.5 sm:gap-3 cursor-pointer relative overflow-hidden`}
              >
                {/* Accent gradient strip */}
                <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${cat.accent} opacity-60 group-hover:opacity-100 transition-opacity`} />
                
                <div className="flex items-start gap-2.5 sm:gap-3">
                  <div className={`p-1.5 sm:p-2 rounded-lg bg-gradient-to-br ${cat.accent} border border-primary/10 group-hover:border-primary/20 transition-all shrink-0`}>
                    <Icon className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h3 className="text-xs sm:text-sm font-bold text-foreground leading-snug group-hover:text-primary transition-colors">
                        {cat.title}
                      </h3>
                      <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all shrink-0" />
                    </div>
                    <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 sm:mt-1 leading-relaxed">
                      {cat.description}
                    </p>
                  </div>
                </div>
                
                {/* Preview items */}
                {cat.preview && cat.preview.length > 0 && (
                  <div className="border-t border-border/60 pt-2">
                    <div className="flex flex-col gap-1">
                      {cat.preview.map(item => (
                        <div key={item.id} className="flex items-center justify-between text-[10px]">
                          <span className="text-muted-foreground truncate">
                            {item.name}
                          </span>
                          {item.tasks && item.tasks > 0 && (
                            <span className="shrink-0 text-[9px] font-mono bg-muted px-1 py-0 rounded ml-1">
                              {item.tasks} tasks
                            </span>
                          )}
                          {item.steps && item.steps > 0 && (
                            <span className="shrink-0 text-[9px] font-mono bg-muted px-1 py-0 rounded ml-1">
                              {item.steps} steps
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <span className="inline-block mt-auto text-[8px] sm:text-[9px] font-mono font-bold text-muted-foreground bg-muted px-1 sm:px-1.5 py-0.5 rounded select-none self-start group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                  {cat.count} {cat.count === 1 ? 'entry' : 'entries'} →
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ── Section 5: Knowledge Distribution with Mini Bar Charts ── */}
      <section className="mobile-section-spacing space-y-3">
        <div className="flex items-center gap-1.5 select-none">
          <Activity className="w-4.5 h-4.5 text-primary" />
          <h2 className="text-sm font-bold text-foreground">Knowledge Distribution</h2>
        </div>

        {(() => {
          const distItems = [
            { label: 'Packages', count: distribution.packages, color: 'bg-emerald-500' },
            { label: 'ML Models', count: distribution.models_ml, color: 'bg-violet-500' },
            { label: 'DL Models', count: distribution.models_dl, color: 'bg-violet-600' },
            { label: 'LLM Models', count: distribution.models_llm, color: 'bg-violet-700' },
            { label: 'Workflows', count: distribution.workflows, color: 'bg-blue-500' },
            { label: 'Cheatsheets', count: distribution.cheatsheets, color: 'bg-amber-500' },
            { label: 'Registry', count: distribution.registry_families, color: 'bg-rose-500' },
            { label: 'Decision Guides', count: distribution.decision_guides, color: 'bg-cyan-500' },
            { label: 'Debug Guides', count: distribution.debug_guides, color: 'bg-red-500' },
            { label: 'Patterns', count: distribution.patterns, color: 'bg-orange-500' },
            { label: 'Principles', count: distribution.principles, color: 'bg-purple-500' },
          ];
          const maxCount = Math.max(...distItems.map(d => d.count), 1);
          
          return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
              {distItems.map(stat => {
                const percent = (stat.count / maxCount) * 100;
                const barWidth = Math.max(percent, 4); // minimum 4% for visibility
                return (
                  <div key={stat.label} className="bg-muted/10 border border-border/80 p-3 rounded-lg flex flex-col gap-1.5 select-none hover:bg-muted/20 transition-colors">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{stat.label}</span>
                      <span className="text-lg font-extrabold text-foreground tabular-nums">{stat.count}</span>
                    </div>
                    {/* Mini progress bar */}
                    <div className="w-full h-1.5 rounded-full bg-muted/40 overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${stat.color} transition-all duration-500`}
                        style={{ width: `${barWidth}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })()}
      </section>

      {/* ── Section 6: Developer Intent Navigation ── */}
      {intents.length > 0 && (
        <section className="mobile-section-spacing space-y-3">
          <div className="flex items-center gap-1.5 select-none">
            <Terminal className="w-4.5 h-4.5 text-primary" />
            <h2 className="text-sm font-bold text-foreground">I want to...</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {intents.map(intent => {
              const Icon = INTENT_ICONS[intent.icon] || Terminal;
              return (
                <Link
                  key={intent.intent}
                  href={intent.target}
                  className="group p-3 border border-border bg-card hover:border-foreground/15 rounded-lg transition-all flex items-center justify-between gap-3 cursor-pointer hover:shadow-sm"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="p-1.5 rounded bg-muted/60 text-muted-foreground group-hover:text-primary group-hover:bg-primary/5 transition-all shrink-0">
                      <Icon className="w-4 h-4 shrink-0" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-xs font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                        {intent.intent}
                      </h3>
                      <p className="text-[9px] text-muted-foreground truncate mt-0.5">
                        {intent.description}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-muted-foreground shrink-0 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* ── Section 7: Featured Collections ── */}
      <section className="mobile-section-spacing space-y-3">
        <div className="flex items-center gap-1.5 select-none">
          <Star className="w-4.5 h-4.5 text-primary" />
          <h2 className="text-sm font-bold text-foreground">Featured Collections</h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Card 1: Core Libraries */}
          <div className="rounded-xl border border-border bg-card mobile-card-padding space-y-3 flex flex-col justify-between hover:border-emerald-500/20 hover:shadow-sm transition-all group">
            <div>
              <div className="flex items-center gap-2 mb-3 select-none">
                <div className="p-1 rounded bg-emerald-500/10 border border-emerald-500/20">
                  <Code className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Core Libraries</span>
              </div>
              {featured.packages.length > 0 ? (
                <div className="space-y-1.5">
                  {featured.packages.map(pkg => (
                    <Link
                      key={pkg.id}
                      href={`/packages/${pkg.id}`}
                      className="group/item flex items-center justify-between p-2 rounded-lg border border-border/60 hover:border-emerald-500/20 hover:bg-emerald-500/5 transition-all text-xs"
                    >
                      <div className="min-w-0">
                        <span className="font-semibold text-foreground font-mono group-hover/item:text-emerald-600 dark:group-hover/item:text-emerald-400 transition-colors truncate block">
                          {pkg.name}
                        </span>
                        {pkg.difficulty && (
                          <span className="text-[9px] text-muted-foreground block mt-0.5">
                            {pkg.difficulty} · {pkg.estimated_reading_time} min
                          </span>
                        )}
                      </div>
                      <span className="shrink-0 text-[9px] font-mono font-bold bg-muted px-1.5 py-0.5 rounded text-muted-foreground ml-2">
                        {pkg.tasks || 0} tasks
                      </span>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="rounded-lg border border-dashed border-border p-3 text-center select-none">
                  <p className="text-xs text-muted-foreground">No packages available yet.</p>
                </div>
              )}
            </div>
          </div>

          {/* Card 2: Production Workflows */}
          <div className="rounded-xl border border-border bg-card mobile-card-padding space-y-3 flex flex-col justify-between hover:border-blue-500/20 hover:shadow-sm transition-all group">
            <div>
              <div className="flex items-center gap-2 mb-3 select-none">
                <div className="p-1 rounded bg-blue-500/10 border border-blue-500/20">
                  <WorkflowIcon className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Production Workflows</span>
              </div>
              {featured.workflows.length > 0 ? (
                <div className="space-y-1.5">
                  {featured.workflows.map(wf => (
                    <Link
                      key={wf.id}
                      href={`/workflows/${wf.id}`}
                      className="group/item flex items-center justify-between p-2 rounded-lg border border-border/60 hover:border-blue-500/20 hover:bg-blue-500/5 transition-all text-xs"
                    >
                      <div className="min-w-0">
                        <span className="font-semibold text-foreground group-hover/item:text-blue-600 dark:group-hover/item:text-blue-400 transition-colors truncate block">
                          {wf.name}
                        </span>
                        {wf.difficulty && (
                          <span className="text-[9px] text-muted-foreground block mt-0.5">
                            {wf.difficulty} · {wf.estimated_reading_time} min
                          </span>
                        )}
                      </div>
                      <span className="shrink-0 text-[9px] font-mono font-bold bg-muted px-1.5 py-0.5 rounded text-muted-foreground ml-2">
                        {wf.steps || 0} steps
                      </span>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="rounded-lg border border-dashed border-border p-3 text-center select-none">
                  <p className="text-xs text-m-foreground">No workflows available yet.</p>
                </div>
              )}
            </div>
          </div>

          {/* Card 3: Core Architectures */}
          <div className="rounded-xl border border-border bg-card mobile-card-padding space-y-3 flex flex-col justify-between hover:border-violet-500/20 hover:shadow-sm transition-all group">
            <div>
              <div className="flex items-center gap-2 mb-3 select-none">
                <div className="p-1 rounded bg-violet-500/10 border border-violet-500/20">
                  <Cpu className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" />
                </div>
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Core Architectures</span>
              </div>
              {featured.models.length > 0 ? (
                <div className="space-y-1.5">
                  {featured.models.map(m => (
                    <Link
                      key={`${m.category}-${m.id}`}
                      href={`/models/${m.category}/${m.id}`}
                      className="group/item flex items-center justify-between p-2 rounded-lg border border-border/60 hover:border-violet-500/20 hover:bg-violet-500/5 transition-all text-xs"
                    >
                      <div className="min-w-0">
                        <span className="font-semibold text-foreground group-hover/item:text-violet-600 dark:group-hover/item:text-violet-400 transition-colors truncate block">
                          {m.name}
                        </span>
                        {m.difficulty && (
                          <span className="text-[9px] text-muted-foreground block mt-0.5">
                            {m.category?.toUpperCase()} · {m.estimated_reading_time} min
                          </span>
                        )}
                      </div>
                      <span className="shrink-0 text-[8px] font-mono font-bold uppercase tracking-wider bg-violet-500/10 text-violet-600 dark:text-violet-400 px-1.5 py-0.5 rounded ml-2">
                        {m.category?.toUpperCase()}
                      </span>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="rounded-lg border border-dashed border-border p-3 text-center select-none">
                  <p className="text-xs text-muted-foreground">No models available yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 8: Recently Updated ── */}
      <section className="mobile-section-spacing space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 select-none">
            <Bookmark className="w-4.5 h-4.5 text-primary" />
            <h2 className="text-sm font-bold text-foreground">Recently Updated</h2>
          </div>
          <span className="text-[10px] font-mono text-muted-foreground select-none">Sorted by updated_at</span>
        </div>
        {recent.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recent.map(item => {
              const href = getContentHref(
                item.type as 'package' | 'model' | 'workflow' | 'cheatsheet' | 'pattern' | 'debug_guide' | 'decision_guide' | 'principle' | 'registry',
                item.id,
                item.category
              );

              const summary = getSummaryForItem(item);
              const ItemIcon = getContentTypeIcon(item.type);

              return (
                <div
                  key={`${item.type}-${item.id}`}
                  className="rounded-xl border border-border bg-card mobile-card-padding flex flex-col justify-between gap-3 hover:shadow-sm hover:border-foreground/15 transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 select-none">
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-muted text-[8px] font-bold uppercase tracking-wider text-muted-foreground">
                        <ItemIcon className="w-2.5 h-2.5" />
                        {getContentTypeLabel(item.type)}
                      </span>
                      <span className="text-[10px] font-mono text-muted-foreground">
                        {formatRelativeTime(item.updated_at)}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-foreground mt-2 leading-snug">
                      {item.name}
                    </h3>
                    {summary && (
                      <p className="text-[11px] text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                        {summary}
                      </p>
                    )}
                  </div>
                {href && (
                  <div className="border-t border-border/60 pt-2.5 mt-auto flex justify-end">
                    <Link
                      href={href}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-primary/5 hover:bg-primary/10 border border-primary/10 hover:border-primary/20 text-[10px] font-bold text-primary transition-all cursor-pointer select-none"
                    >
                      Open Reference
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-xl border border-border bg-card mobile-card-padding">
            <p className="text-xs text-muted-foreground text-center py-4">
              No recent updates. Check back soon for new content.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}