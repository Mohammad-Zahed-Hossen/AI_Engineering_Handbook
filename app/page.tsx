import Link from "next/link";
import fs from "fs";
import path from "path";
import { 
  getDashboardCounts, 
  getAllPackages, 
  getAllModels, 
  getAllWorkflows, 
  getRecentContent,
  getPackage,
  getModel,
  getWorkflow,
  getCheatsheet,
  getPattern,
  getDebugGuide,
  getDecisionGuide,
  getPrinciple,
  RecentContentItem
} from "@/lib/data";
import SearchBox from "@/components/shared/SearchBox";
import ContentTypeBadge from "@/components/shared/ContentTypeBadge";
import RecentActivity from "@/components/shared/RecentActivity";
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
  ShieldCheck
} from "lucide-react";

// Helper function to resolve dynamic summaries for recent items
function getSummaryForItem(item: RecentContentItem): string {
  try {
    switch (item.type) {
      case 'package':
        return getPackage(item.id).summary || '';
      case 'model':
        return getModel(item.category as 'ml' | 'dl' | 'llm', item.id).description || '';
      case 'workflow':
        return getWorkflow(item.id).overview || getWorkflow(item.id).description || '';
      case 'cheatsheet':
        return getCheatsheet(item.id).description || '';
      case 'pattern':
        return getPattern(item.id).description || '';
      case 'debug_guide':
        return getDebugGuide(item.id).description || '';
      case 'decision_guide':
        return getDecisionGuide(item.id).description || '';
      case 'principle':
        return getPrinciple(item.id).description || '';
      default:
        return '';
    }
  } catch {
    return '';
  }
}

export default function Home() {
  const counts = getDashboardCounts();
  const packages = getAllPackages();
  const mlModels = getAllModels("ml");
  const dlModels = getAllModels("dl");
  const llmModels = getAllModels("llm");
  const workflows = getAllWorkflows();
  const recent = getRecentContent(6);

  const totalModelsCount = counts.models_ml + counts.models_dl + counts.models_llm;

  // Dynamically count total problems in the taxonomy
  const taxonomyPath = path.join(process.cwd(), 'data', 'problem-index', 'taxonomy.json');
  let problemsCount = 0;
  try {
    if (fs.existsSync(taxonomyPath)) {
      const taxonomyData = JSON.parse(fs.readFileSync(taxonomyPath, 'utf-8')) as Record<string, unknown>;
      problemsCount = Object.values(taxonomyData).reduce((acc: number, cat: unknown) => {
        const c = cat as { problems?: unknown[] };
        return acc + (c?.problems?.length || 0);
      }, 0);
    }
  } catch {}

  // Dynamic collections sorting (no hardcoding)
  const featuredPackages = [...packages]
    .sort((a, b) => (b.tasks?.length || 0) - (a.tasks?.length || 0))
    .slice(0, 3);

  const featuredWorkflows = [...workflows]
    .sort((a, b) => (b.steps?.length || 0) - (a.steps?.length || 0))
    .slice(0, 3);

  const featuredModels = [
    ...(mlModels.slice(0, 1)),
    ...(dlModels.slice(0, 1)),
    ...(llmModels.slice(0, 1))
  ].filter(Boolean);

  return (
    <div className="space-y-8 pb-10">
      {/* Section 1: Global Search */}
      <header className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground font-sans">
            AI Engineering Handbook
          </h1>
          <p className="mt-1 text-xs text-muted-foreground leading-relaxed max-w-2xl">
            A production-ready reference catalog for package syntax, neural network architectures, pipeline workflows, cheatsheets, and debug baseline guides.
          </p>
        </div>
        <SearchBox placeholder="Search by library name, task type, or engineering problem…" />
      </header>

      {/* Section 2: Resume Learning (User Context Group) */}
      <RecentActivity />

      {/* Section 3: Knowledge Explorer */}
      <section className="space-y-3">
        <div className="flex items-center gap-1.5 select-none">
          <Compass className="w-4.5 h-4.5 text-primary" />
          <h2 className="text-sm font-bold text-foreground">Knowledge Explorer</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { 
              title: 'Problem Index', 
              description: 'Map common machine learning and deep learning engineering issues directly to reference guides.', 
              count: problemsCount, 
              href: '/problem-index', 
              icon: Layers 
            },
            { 
              title: 'Packages', 
              description: 'Scientific Python library references, function definitions, parameters, and syntax helpers.', 
              count: counts.packages, 
              href: '/packages', 
              icon: Code 
            },
            { 
              title: 'Models Library', 
              description: 'Prebuilt architectures, layers structures, and hyperparameter blueprints.', 
              count: totalModelsCount, 
              href: '/models', 
              icon: Cpu 
            },
            { 
              title: 'Workflows', 
              description: 'Step-by-step end-to-end pipelines, evaluation baselines, and production setup details.', 
              count: counts.workflows, 
              href: '/workflows', 
              icon: WorkflowIcon 
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
                className="group rounded-xl border border-border bg-card p-4 hover:border-foreground/20 hover:shadow-sm transition-all flex items-start gap-3 cursor-pointer"
              >
                <div className="p-2 rounded-lg bg-primary/5 border border-primary/10 group-hover:bg-primary/10 group-hover:border-primary/20 transition-all shrink-0">
                  <Icon className="w-4.5 h-4.5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <h3 className="text-sm font-bold text-foreground leading-snug group-hover:text-primary transition-colors">
                      {cat.title}
                    </h3>
                    <ArrowRight className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    {cat.description}
                  </p>
                  <span className="inline-block mt-3 text-[9px] font-mono font-bold text-muted-foreground bg-muted px-1.5 py-0.5 rounded select-none">
                    {cat.count} {cat.count === 1 ? 'entry' : 'entries'} →
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Section 4: Knowledge Overview (Metrics) */}
      <section className="space-y-3">
        <div className="flex items-center gap-1.5 select-none">
          <Activity className="w-4.5 h-4.5 text-primary" />
          <h2 className="text-sm font-bold text-foreground">Handbook Overview</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { label: 'Packages', count: counts.packages },
            { label: 'Models', count: totalModelsCount },
            { label: 'Workflows', count: counts.workflows },
            { label: 'Cheatsheets', count: counts.cheatsheets },
            { label: 'Registry', count: counts.registry_families },
            { label: 'Problem Index', count: problemsCount },
          ].map(stat => (
            <div key={stat.label} className="bg-muted/10 border border-border/80 p-3 rounded-lg flex flex-col justify-between select-none">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{stat.label}</span>
              <span className="text-xl font-extrabold text-foreground mt-1">{stat.count}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Section 5: Developer Shortcuts */}
      <section className="space-y-3">
        <div className="flex items-center gap-1.5 select-none">
          <Terminal className="w-4.5 h-4.5 text-primary" />
          <h2 className="text-sm font-bold text-foreground">Developer Intent Shortcuts</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { 
              title: 'Troubleshoot GPU OOM', 
              subtitle: 'Debug CUDA memory exhaustion errors', 
              href: '/debug-guides/cuda-out-of-memory', 
              icon: Flame 
            },
            { 
              title: 'RAG vs Fine-Tuning', 
              subtitle: 'Compare architectural tradeoff guidelines', 
              href: '/decision-guides/rag-vs-fine-tuning', 
              icon: Scale 
            },
            { 
              title: 'Model Training Loop', 
              subtitle: 'Boilerplate PyTorch execution structure', 
              href: '/patterns/training-loop', 
              icon: RefreshCw 
            },
            { 
              title: 'Build a RAG Pipeline', 
              subtitle: 'Step-by-step vector search workflow', 
              href: '/workflows/build-rag-system', 
              icon: WorkflowIcon 
            },
            { 
              title: 'Single Source of Truth', 
              subtitle: 'Handbook configuration principles', 
              href: '/principles/single-source-of-truth', 
              icon: ShieldCheck 
            },
            { 
              title: 'PyTorch Cheatsheet', 
              subtitle: 'Zap through tensor operations & api calls', 
              href: '/cheatsheets/pytorch', 
              icon: Zap 
            },
          ].map(shortcut => {
            const Icon = shortcut.icon;
            return (
              <Link
                key={shortcut.title}
                href={shortcut.href}
                className="group p-3 border border-border bg-card hover:border-foreground/15 rounded-lg transition-all flex items-center justify-between gap-3 cursor-pointer"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="p-1.5 rounded bg-muted/60 text-muted-foreground group-hover:text-primary group-hover:bg-primary/5 transition-all shrink-0">
                    <Icon className="w-4 h-4 shrink-0" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xs font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                      {shortcut.title}
                    </h3>
                    <p className="text-[9px] text-muted-foreground truncate mt-0.5">
                      {shortcut.subtitle}
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-muted-foreground shrink-0 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            );
          })}
        </div>
      </section>

      {/* Section 6: Featured Collections */}
      <section className="space-y-3">
        <div className="flex items-center gap-1.5 select-none">
          <Star className="w-4.5 h-4.5 text-primary" />
          <h2 className="text-sm font-bold text-foreground">Featured Collections</h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Card 1: Top Packages */}
          <div className="rounded-xl border border-border bg-card p-4 space-y-3 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-2 select-none">Most Complete Packages</span>
              <div className="space-y-2">
                {featuredPackages.map(pkg => (
                  <Link
                    key={pkg.id}
                    href={`/packages/${pkg.id}`}
                    className="group flex items-center justify-between p-2 rounded border border-border/60 hover:border-foreground/15 transition-all text-xs"
                  >
                    <div className="min-w-0">
                      <span className="font-semibold text-foreground font-mono group-hover:text-primary transition-colors truncate block">
                        {pkg.name}
                      </span>
                      <span className="text-[10px] text-muted-foreground block mt-0.5 truncate">{pkg.summary}</span>
                    </div>
                    <span className="shrink-0 text-[9px] font-mono font-bold bg-muted px-1.5 py-0.5 rounded text-muted-foreground ml-2">
                      {pkg.tasks?.length || 0} tasks
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Card 2: Featured Workflows */}
          <div className="rounded-xl border border-border bg-card p-4 space-y-3 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-2 select-none">Complex Blueprints</span>
              <div className="space-y-2">
                {featuredWorkflows.map(wf => (
                  <Link
                    key={wf.id}
                    href={`/workflows/${wf.id}`}
                    className="group flex items-center justify-between p-2 rounded border border-border/60 hover:border-foreground/15 transition-all text-xs"
                  >
                    <div className="min-w-0">
                      <span className="font-semibold text-foreground group-hover:text-primary transition-colors truncate block">
                        {wf.name}
                      </span>
                      <span className="text-[10px] text-muted-foreground block mt-0.5 truncate">{wf.overview}</span>
                    </div>
                    <span className="shrink-0 text-[9px] font-mono font-bold bg-muted px-1.5 py-0.5 rounded text-muted-foreground ml-2">
                      {wf.steps?.length || 0} steps
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Card 3: Important Models */}
          <div className="rounded-xl border border-border bg-card p-4 space-y-3 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-2 select-none">Neural Libraries</span>
              <div className="space-y-2">
                {featuredModels.map(m => (
                  <Link
                    key={m.id}
                    href={`/models/${m.category}/${m.id}`}
                    className="group flex items-center justify-between p-2 rounded border border-border/60 hover:border-foreground/15 transition-all text-xs"
                  >
                    <div className="min-w-0">
                      <span className="font-semibold text-foreground group-hover:text-primary transition-colors truncate block">
                        {m.name}
                      </span>
                      <span className="text-[10px] text-muted-foreground block mt-0.5 truncate">{m.description}</span>
                    </div>
                    <span className="shrink-0 text-[8px] font-mono font-bold uppercase tracking-wider bg-primary/10 text-primary px-1.5 py-0.5 rounded ml-2">
                      {m.category}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 7: Recently Updated */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 select-none">
            <Bookmark className="w-4.5 h-4.5 text-primary" />
            <h2 className="text-sm font-bold text-foreground">Recently Updated</h2>
          </div>
          <span className="text-[10px] font-mono text-muted-foreground select-none">Sorted by updated_at</span>
        </div>
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
                className="rounded-xl border border-border bg-card p-4 flex flex-col justify-between gap-3 hover:shadow-sm hover:border-foreground/15 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 select-none">
                    <ContentTypeBadge type={item.type} className="px-1.5 py-0.5 text-[8px] font-bold uppercase" />
                    <span className="text-[10px] font-mono text-muted-foreground">{item.updated_at}</span>
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
      </section>
    </div>
  );
}
