import Link from "next/link";
import { 
  getDashboardData,
  getKnowledgeExplorerPreview,
  getSummaryForItem,
} from "@/lib/data";
import SearchBoxWrapper from "@/components/shared/SearchBoxWrapper";
import ContentTypeBadge from "@/components/shared/ContentTypeBadge";
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
} from "lucide-react";

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

  // Get preview items for knowledge explorer cards
  const packagePreview = getKnowledgeExplorerPreview('package', 3);
  const modelPreview = getKnowledgeExplorerPreview('model', 3);
  const workflowPreview = getKnowledgeExplorerPreview('workflow', 3);

  return (
    <div className="space-y-8 pb-10">
      {/* Section 1: Global Search */}
      <header className="space-y-4">
        <div>
          <h1>
            AI Engineering Handbook
          </h1>
          <p className="mt-1 text-xs text-muted-foreground leading-relaxed max-w-2xl">
            A production-ready reference catalog for package syntax, neural network architectures, pipeline workflows, cheatsheets, and debug baseline guides.
          </p>
        </div>
        <SearchBoxWrapper placeholder="Search by library name, task type, or engineering problem…" />
        
        {/* Popular Searches */}
        {popularSearches.length > 0 && (
          <div className="flex flex-wrap gap-1.5 items-center">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider select-none">Popular:</span>
            {popularSearches.map(term => (
              <Link
                key={term}
                href={`/search?q=${encodeURIComponent(term)}`}
                className="text-[10px] px-2 py-0.5 rounded bg-muted/50 hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors cursor-pointer"
              >
                {term}
              </Link>
            ))}
          </div>
        )}
      </header>

      {/* Section 2: Personalized Widgets */}
      <PersonalizedWidgets />
      <RecentlyAddedWidgetServer />

      {/* Section 3: Problem-first Entry */}
      {problemCategories.length > 0 && (
        <section className="mobile-section-spacing">
          <div className="rounded-xl border border-border bg-card mobile-card-padding hover:border-foreground/20 hover:shadow-sm transition-all">
            <div className="flex items-start gap-2.5 sm:gap-3">
              <div className="p-1.5 sm:p-2 rounded-lg bg-primary/5 border border-primary/10 shrink-0">
                <Layers className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-xs sm:text-sm font-bold text-foreground mb-2">
                  Not sure where to start?
                </h2>
                <p className="text-[10px] sm:text-xs text-muted-foreground mb-3">
                  Browse by Engineering Problem
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {problemCategories.slice(0, 5).map(cat => (
                    <Link
                      key={cat.id}
                      href={`/problem-index#${cat.id.toLowerCase().replace(/\s+/g, '-')}`}
                      className="text-[10px] px-2 py-0.5 rounded bg-muted/30 hover:bg-primary/10 text-foreground hover:text-primary transition-colors cursor-pointer"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>
              <Link
                href="/problem-index"
                className="shrink-0 text-[10px] font-mono font-bold text-muted-foreground bg-muted px-1.5 py-0.5 rounded hover:bg-primary/10 hover:text-primary transition-colors"
              >
                View All →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Section 4: Knowledge Explorer */}
      <section className="mobile-section-spacing space-y-3">
        <div className="flex items-center gap-1.5 select-none">
          <Compass className="w-4.5 h-4.5 text-primary" />
          <h2 className="text-sm font-bold text-foreground">Knowledge Explorer</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3">
          {[
            { 
              title: 'Problem Index', 
              description: 'Map common machine learning and deep learning engineering issues directly to reference guides.', 
              count: totalModelsCount,
              href: '/problem-index', 
              icon: Layers 
            },
            { 
              title: 'Packages', 
              description: 'Scientific Python library references, function definitions, parameters, and syntax helpers.', 
              count: counts.packages, 
              href: '/packages', 
              icon: Code,
              preview: packagePreview
            },
            { 
              title: 'Models Library', 
              description: 'Prebuilt architectures, layers structures, and hyperparameter blueprints.', 
              count: totalModelsCount, 
              href: '/models', 
              icon: Cpu,
              preview: modelPreview
            },
            { 
              title: 'Workflows', 
              description: 'Step-by-step end-to-end pipelines, evaluation baselines, and production setup details.', 
              count: counts.workflows, 
              href: '/workflows', 
              icon: WorkflowIcon,
              preview: workflowPreview
            },
            { 
              title: 'Cheatsheets', 
              description: 'Dynamic reference index cards for quick API syntax recall and common bugs.', 
              count: counts.cheatsheets, 
              href: '/cheatsheets', 
              icon: FileCode2 
            },
            { 
              title: 'Model Registry', 
              description: 'Deployment metadata and download locations for AI models.', 
              count: counts.registry_families, 
              href: '/registry', 
              icon: Terminal 
            },
          ].map(cat => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.title}
                href={cat.href}
                className="group rounded-xl border border-border bg-card mobile-card-padding hover:border-foreground/20 hover:shadow-sm transition-all flex flex-col gap-2.5 sm:gap-3 cursor-pointer"
              >
                <div className="flex items-start gap-2.5 sm:gap-3">
                  <div className="p-1.5 sm:p-2 rounded-lg bg-primary/5 border border-primary/10 group-hover:bg-primary/10 group-hover:border-primary/20 transition-all shrink-0">
                    <Icon className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h3 className="text-xs sm:text-sm font-bold text-foreground leading-snug group-hover:text-primary transition-colors">
                        {cat.title}
                      </h3>
                      <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
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
                
                <span className="inline-block mt-auto text-[8px] sm:text-[9px] font-mono font-bold text-muted-foreground bg-muted px-1 sm:px-1.5 py-0.5 rounded select-none self-start">
                  {cat.count} {cat.count === 1 ? 'entry' : 'entries'} →
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Section 5: Knowledge Distribution */}
      <section className="mobile-section-spacing space-y-3">
        <div className="flex items-center gap-1.5 select-none">
          <Activity className="w-4.5 h-4.5 text-primary" />
          <h2 className="text-sm font-bold text-foreground">Knowledge Distribution</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { label: 'Packages', count: distribution.packages },
            { label: 'ML Models', count: distribution.models_ml },
            { label: 'DL Models', count: distribution.models_dl },
            { label: 'LLM Models', count: distribution.models_llm },
            { label: 'Workflows', count: distribution.workflows },
            { label: 'Cheatsheets', count: distribution.cheatsheets },
            { label: 'Registry', count: distribution.registry_families },
            { label: 'Decision Guides', count: distribution.decision_guides },
            { label: 'Debug Guides', count: distribution.debug_guides },
            { label: 'Patterns', count: distribution.patterns },
            { label: 'Principles', count: distribution.principles },
          ].map(stat => (
            <div key={stat.label} className="bg-muted/10 border border-border/80 p-3 rounded-lg flex flex-col justify-between select-none">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{stat.label}</span>
              <span className="text-xl font-extrabold text-foreground mt-1">{stat.count}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Section 6: Developer Intent Navigation */}
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
                  className="group p-3 border border-border bg-card hover:border-foreground/15 rounded-lg transition-all flex items-center justify-between gap-3 cursor-pointer"
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

      {/* Section 7: Featured Collections */}
      <section className="mobile-section-spacing space-y-3">
        <div className="flex items-center gap-1.5 select-none">
          <Star className="w-4.5 h-4.5 text-primary" />
          <h2 className="text-sm font-bold text-foreground">Featured Collections</h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Card 1: Core Libraries */}
          <div className="rounded-xl border border-border bg-card mobile-card-padding space-y-3 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-2 select-none">Core Libraries</span>
              {featured.packages.length > 0 ? (
                <div className="space-y-2">
                  {featured.packages.map(pkg => (
                    <Link
                      key={pkg.id}
                      href={`/packages/${pkg.id}`}
                      className="group flex items-center justify-between p-2 rounded border border-border/60 hover:border-foreground/15 transition-all text-xs"
                    >
                      <div className="min-w-0">
                        <span className="font-semibold text-foreground font-mono group-hover:text-primary transition-colors truncate block">
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
          <div className="rounded-xl border border-border bg-card mobile-card-padding space-y-3 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-2 select-none">Production Workflows</span>
              {featured.workflows.length > 0 ? (
                <div className="space-y-2">
                  {featured.workflows.map(wf => (
                    <Link
                      key={wf.id}
                      href={`/workflows/${wf.id}`}
                      className="group flex items-center justify-between p-2 rounded border border-border/60 hover:border-foreground/15 transition-all text-xs"
                    >
                      <div className="min-w-0">
                        <span className="font-semibold text-foreground group-hover:text-primary transition-colors truncate block">
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
                  <p className="text-xs text-muted-foreground">No workflows available yet.</p>
                </div>
              )}
            </div>
          </div>

          {/* Card 3: Core Architectures */}
          <div className="rounded-xl border border-border bg-card mobile-card-padding space-y-3 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-2 select-none">Core Architectures</span>
              {featured.models.length > 0 ? (
                <div className="space-y-2">
                  {featured.models.map(m => (
                    <Link
                      key={`${m.category}-${m.id}`}
                      href={`/models/${m.category}/${m.id}`}
                      className="group flex items-center justify-between p-2 rounded border border-border/60 hover:border-foreground/15 transition-all text-xs"
                    >
                      <div className="min-w-0">
                        <span className="font-semibold text-foreground group-hover:text-primary transition-colors truncate block">
                          {m.name}
                        </span>
                        {m.difficulty && (
                          <span className="text-[9px] text-muted-foreground block mt-0.5">
                            {m.category?.toUpperCase()} · {m.estimated_reading_time} min
                          </span>
                        )}
                      </div>
                      <span className="shrink-0 text-[8px] font-mono font-bold uppercase tracking-wider bg-primary/10 text-primary px-1.5 py-0.5 rounded ml-2">
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

      {/* Section 8: Recently Updated */}
      <section className="mobile-section-spacing space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 select-none">
            <Bookmark className="w-4.5 h-4.5 text-primary" />
            <h2 className="text-sm font-bold text-foreground">Recently Updated</h2>
          </div>
          <span className="text-[10px] font-mono text-muted-foreground select-none">Sorted by updated_at</span>
        </div>
        {recent.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recent.map(item => {
              const href = item.type === 'model'
                ? `/models/${item.category}/${item.id}`
                : item.type === 'package'
                ? `/packages/${item.id}`
                : item.type === 'workflow'
                ? `/workflows/${item.id}`
                : item.type === 'registry'
                ? `/registry/${item.category}`
                : `/cheatsheets/${item.id}`;

              const summary = getSummaryForItem(item);

              return (
                <div
                  key={`${item.type}-${item.id}`}
                  className="rounded-xl border border-border bg-card mobile-card-padding flex flex-col justify-between gap-3 hover:shadow-sm hover:border-foreground/15 transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 select-none">
                      <ContentTypeBadge type={item.type} className="px-1.5 py-0.5 text-[8px] font-bold uppercase" />
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
                  <div className="border-t border-border/60 pt-2.5 mt-auto flex justify-end">
                    <Link
                      href={href}
                      className="inline-flex items-center gap-0.5 px-2.5 py-1 rounded bg-primary/5 hover:bg-primary/10 border border-primary/10 hover:border-primary/20 text-[10px] font-bold text-primary transition-all cursor-pointer select-none"
                    >
                      Open Reference
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-xl border border-border bg-card mobile-card-padding">
            <p className="text-xs text-muted-foreground text-center">
              No recent updates. Check back soon for new content.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}