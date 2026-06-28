import Link from "next/link";
import { 
  getDashboardCounts, 
  getAllPackages, 
  getAllModels, 
  getRegistryTasks, 
  getAllWorkflows, 
  getRecentContent
} from "@/lib/data";
import { buildSearchIndex } from "@/lib/search";
import SectionCard from "@/components/shared/SectionCard";
import SearchBox from "@/components/shared/SearchBox";
import ContentTypeBadge from "@/components/shared/ContentTypeBadge";
import ContinueReadingSection from "@/components/shared/ContinueReadingSection";
import RecentKnowledgeSection from "@/components/shared/RecentKnowledgeSection";

export default function Home() {
  const counts = getDashboardCounts();
  const packages = getAllPackages();
  const mlModels = getAllModels("ml");
  const dlModels = getAllModels("dl");
  const llmModels = getAllModels("llm");
  const registryTasks = getRegistryTasks();
  const workflows = getAllWorkflows();
  const recent = getRecentContent(6);
  const searchIndex = buildSearchIndex();

  const totalModelsCount = counts.models_ml + counts.models_dl + counts.models_llm;
  const popularPackageIds = ['numpy', 'pandas', 'pytorch', 'jax', 'polars', 'dask'];
  const popularPackages = popularPackageIds
    .map(packageId => packages.find(pkg => pkg.id === packageId))
    .filter((pkg): pkg is NonNullable<typeof pkg> => Boolean(pkg));

  return (
    <div className="space-y-8">
      {/* Global Search */}
      <section className="space-y-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">
            AI Engineering Handbook
          </h1>
          <p className="content-prose mt-1 text-xs text-muted-foreground">
            Static reference for packages, models, workflows, registries, and cheatsheets.
          </p>
        </div>
        <SearchBox index={searchIndex} placeholder="Search by name, summary, or problem type…" />
      </section>

      {/* Continue Reading — session resumption */}
      <ContinueReadingSection />

      {/* Recent Knowledge — browsing history */}
      <RecentKnowledgeSection />

      {/* Categories */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-foreground">Categories</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          {[
            { label: 'Packages', count: counts.packages, href: '/packages' },
            { label: 'Models', count: totalModelsCount, href: '/models' },
            { label: 'Workflows', count: counts.workflows, href: '/workflows' },
            { label: 'Cheatsheets', count: counts.cheatsheets, href: '/cheatsheets' },
            { label: 'Registry', count: counts.registry_tasks, href: '/registry' },
          ].filter(item => item.count > 0).map(cat => (
            <Link
              key={cat.label}
              href={cat.href}
              className="rounded-lg border border-border bg-card p-3 hover:border-foreground/20 active:bg-muted/50 transition-colors"
            >
              <div className="text-sm font-medium text-foreground">{cat.label}</div>
              <div className="text-[10px] font-mono text-muted-foreground mt-1">{cat.count} entries</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Recently Updated */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">Recently Updated</h2>
          <span className="text-[10px] font-mono text-muted-foreground">Sorted by updated_at</span>
        </div>
        <ul className="divide-y divide-border rounded-lg border border-border overflow-hidden">
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

            return (
              <li key={`${item.type}-${item.id}`}>
                <Link
                  href={href}
                  className="flex items-center justify-between px-3 py-2 hover:bg-muted/30 transition-colors"
                >
                  <span className="text-sm font-medium text-foreground truncate">{item.name}</span>
                  <div className="flex items-center gap-2">
                    <ContentTypeBadge type={item.type} className="px-1.5 py-0 text-[8px]" />
                    <span className="text-[10px] font-mono text-muted-foreground">{item.updated_at}</span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Quick Access */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-foreground">Quick Access</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SectionCard title="Python Packages" subtitle={`${counts.packages} cataloged`}>
            <ul className="space-y-1">
              {popularPackages.slice(0, 6).map(pkg => (
                <li key={pkg.id}>
                  <Link href={`/packages/${pkg.id}`} className="text-xs text-foreground hover:underline font-mono">
                    {pkg.name} <span className="text-muted-foreground">v{pkg.version}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </SectionCard>

          <SectionCard title="Models Library" subtitle={`${totalModelsCount} cataloged`}>
            <div className="space-y-2 text-xs">
              {counts.models_ml > 0 && (
                <div>
                  <span className="text-muted-foreground uppercase text-[10px]">ML</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {mlModels.slice(0, 4).map(m => (
                      <Link key={m.id} href={`/models/ml/${m.id}`} className="rounded border border-border px-1.5 py-0.5 hover:bg-muted">
                        {m.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
              {counts.models_dl > 0 && (
                <div>
                  <span className="text-muted-foreground uppercase text-[10px]">DL</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {dlModels.slice(0, 4).map(m => (
                      <Link key={m.id} href={`/models/dl/${m.id}`} className="rounded border border-border px-1.5 py-0.5 hover:bg-muted">
                        {m.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
              {counts.models_llm > 0 && (
                <div>
                  <span className="text-muted-foreground uppercase text-[10px]">LLM</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {llmModels.slice(0, 4).map(m => (
                      <Link key={m.id} href={`/models/llm/${m.id}`} className="rounded border border-border px-1.5 py-0.5 hover:bg-muted">
                        {m.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </SectionCard>

          <SectionCard title="Workflows" subtitle={`${counts.workflows} documented`}>
            <ul className="space-y-1">
              {workflows.slice(0, 6).map(wf => (
                <li key={wf.id}>
                  <Link href={`/workflows/${wf.id}`} className="text-xs text-foreground hover:underline">
                    {wf.name}
                  </Link>
                </li>
              ))}
            </ul>
            {workflows.length > 6 && (
              <Link href="/workflows" className="text-xs text-muted-foreground hover:text-foreground hover:underline font-mono mt-2 block">
                See all {workflows.length} workflows →
              </Link>
            )}
          </SectionCard>

          <SectionCard title="Registry Tasks" subtitle={`${counts.registry_tasks} task groups`}>
            <div className="flex flex-wrap gap-1">
              {registryTasks.map(task => (
                <Link
                  key={task}
                  href={`/registry/${task}`}
                  className="rounded border border-border px-2 py-1 text-xs capitalize hover:bg-muted"
                >
                  {task}
                </Link>
              ))}
            </div>
          </SectionCard>
        </div>
      </section>

    </div>
  );
}
