import Link from "next/link";
import { 
  getDashboardCounts, 
  getAllPackages, 
  getAllModels, 
  getRegistryTasks, 
  getAllWorkflows, 
  getAllCheatsheetIds,
  getRecentContent
} from "@/lib/data";
import SectionCard from "@/components/shared/SectionCard";

export default function Home() {
  const counts = getDashboardCounts();
  const packages = getAllPackages();
  const mlModels = getAllModels("ml");
  const dlModels = getAllModels("dl");
  const llmModels = getAllModels("llm");
  const registryTasks = getRegistryTasks();
  const workflows = getAllWorkflows();
  const cheatsheets = getAllCheatsheetIds();

  const totalModelsCount = counts.models_ml + counts.models_dl + counts.models_llm;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-card text-card-foreground border border-border p-6 rounded-lg shadow-sm">
        <h1 className="text-xl font-bold tracking-tight text-foreground font-sans">
          AI Engineering Knowledge System
        </h1>
        <p className="text-xs text-muted-foreground mt-1 max-w-2xl leading-relaxed">
          A localized, zero-latency repository of Python package references, model configurations, registries, deployment workflows, and quick-access syntax cheatsheets.
        </p>
      </div>

      {/* Primary Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Packages Summary */}
        <SectionCard 
          title="Python Packages" 
          subtitle="Imports, syntax, and options"
          badge={<span className="font-mono bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 px-2 py-0.5 rounded text-[10px] font-semibold">{counts.packages} Cataloged</span>}
        >
          <div className="space-y-3">
            <p className="text-[11px] text-muted-foreground">
              Reference sheets for scientific computation, data frames, deep learning frameworks, and transformer model libraries.
            </p>
            <div className="border-t border-border pt-2">
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1">Quick Links</span>
              <ul className="space-y-1">
                {packages.map(pkg => (
                  <li key={pkg.id}>
                    <Link 
                      href={`/packages/${pkg.id}`} 
                      className="flex items-center justify-between p-1.5 rounded bg-muted/40 hover:bg-muted text-[11px] font-mono text-foreground"
                    >
                      <span>{pkg.name}</span>
                      <span className="text-[9px] text-muted-foreground font-sans">v{pkg.version} &rarr;</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </SectionCard>

        {/* Models Summary */}
        <SectionCard 
          title="Models Library" 
          subtitle="Architectures, training, and parameters"
          badge={<span className="font-mono bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 px-2 py-0.5 rounded text-[10px] font-semibold">{totalModelsCount} Cataloged</span>}
        >
          <div className="space-y-3">
            <p className="text-[11px] text-muted-foreground">
              Detailed listings covering machine learning classifiers, neural blocks, self-attention transformers, and large open language models.
            </p>
            <div className="border-t border-border pt-2 space-y-2">
              <div>
                <span className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1">Machine Learning (ML) &middot; {counts.models_ml}</span>
                <div className="flex flex-wrap gap-1">
                  {mlModels.map(m => (
                    <Link 
                      key={m.id} 
                      href={`/models/ml/${m.id}`} 
                      className="px-1.5 py-0.5 rounded bg-muted/40 hover:bg-muted border border-border/40 text-[10px] text-foreground"
                    >
                      {m.name}
                    </Link>
                  ))}
                </div>
              </div>
              <div>
                <span className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1">Deep Learning (DL) &middot; {counts.models_dl}</span>
                <div className="flex flex-wrap gap-1">
                  {dlModels.map(m => (
                    <Link 
                      key={m.id} 
                      href={`/models/dl/${m.id}`} 
                      className="px-1.5 py-0.5 rounded bg-muted/40 hover:bg-muted border border-border/40 text-[10px] text-foreground"
                    >
                      {m.name}
                    </Link>
                  ))}
                </div>
              </div>
              <div>
                <span className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1">Large Language Models &middot; {counts.models_llm}</span>
                <div className="flex flex-wrap gap-1">
                  {llmModels.map(m => (
                    <Link 
                      key={m.id} 
                      href={`/models/llm/${m.id}`} 
                      className="px-1.5 py-0.5 rounded bg-muted/40 hover:bg-muted border border-border/40 text-[10px] text-foreground"
                    >
                      {m.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </SectionCard>

        {/* Model Registry Summary */}
        <SectionCard 
          title="Model Registries" 
          subtitle="Weights, parameters, and sizes"
          badge={<span className="font-mono bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 px-2 py-0.5 rounded text-[10px] font-semibold">Verified Registry</span>}
        >
          <div className="space-y-3">
            <p className="text-[11px] text-muted-foreground">
              Aggregated catalog of embedding generators, speech transcripts, optical character recognizers, and multimodal foundational checkpoints.
            </p>
            <div className="border-t border-border pt-2">
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1">Tasks</span>
              <div className="grid grid-cols-2 gap-1">
                {registryTasks.map(task => (
                  <Link 
                    key={task} 
                    href={`/registry/${task}`} 
                    className="p-1.5 rounded bg-muted/40 hover:bg-muted text-[10px] text-foreground capitalize flex items-center justify-between"
                  >
                    <span>{task}s</span>
                    <span className="text-muted-foreground/80">&rarr;</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </SectionCard>

        {/* Workflows Summary */}
        <SectionCard 
          title="AI Workflows" 
          subtitle="Production deployment and pipelines"
          badge={<span className="font-mono bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 px-2 py-0.5 rounded text-[10px] font-semibold">{counts.workflows} Documented</span>}
        >
          <div className="space-y-3">
            <p className="text-[11px] text-muted-foreground">
              Structured walkthrough guides for Retrieval-Augmented Generation (RAG), model fine-tuning, evaluation, and hardware inference optimizations.
            </p>
            <div className="border-t border-border pt-2">
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1">Pipelines</span>
              <ul className="space-y-1">
                {workflows.map(wf => (
                  <li key={wf.id}>
                    <Link 
                      href={`/workflows/${wf.id}`} 
                      className="flex items-center justify-between p-1.5 rounded bg-muted/40 hover:bg-muted text-[11px] text-foreground font-medium"
                    >
                      <span>{wf.name}</span>
                      <span className="text-[9px] text-indigo-500 font-mono font-semibold uppercase">{wf.type} &rarr;</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </SectionCard>

        {/* Cheatsheets Summary */}
        <SectionCard 
          title="Syntax Cheatsheets" 
          subtitle="Quick code recall sheets"
          badge={<span className="font-mono bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 px-2 py-0.5 rounded text-[10px] font-semibold">{cheatsheets.length} Loaded</span>}
        >
          <div className="space-y-3">
            <p className="text-[11px] text-muted-foreground">
              Reference groups containing syntax definitions, constructor methods, training APIs, and validation modules.
            </p>
            <div className="border-t border-border pt-2">
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1">Syntaxes</span>
              <div className="flex flex-wrap gap-1">
                {cheatsheets.map(csId => (
                  <Link 
                    key={csId} 
                    href={`/cheatsheets/${csId}`} 
                    className="px-2 py-1 rounded bg-muted/40 hover:bg-muted border border-border/40 text-[10px] font-mono text-foreground capitalize"
                  >
                    {csId}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </SectionCard>

        {/* Recently Updated Summary */}
        <SectionCard 
          title="Recently Updated" 
          subtitle="Latest catalog edits and activity log"
          badge={<span className="font-mono bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 px-2 py-0.5 rounded text-[10px] font-semibold">Activity</span>}
        >
          <div className="space-y-3">
            <p className="text-[11px] text-muted-foreground">
              Recently modified reference items, package documentation segments, and deployment pipeline workflows.
            </p>
            <div className="border-t border-border pt-2">
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1">Activity Log</span>
              <ul className="space-y-1.5">
                {getRecentContent(5).map(item => {
                  const href = item.type === 'model'
                    ? `/models/${item.category}/${item.id}`
                    : item.type === 'package'
                    ? `/packages/${item.id}`
                    : item.type === 'workflow'
                    ? `/workflows/${item.id}`
                    : `/cheatsheets/${item.id}`;
                  return (
                    <li key={`${item.type}-${item.id}`}>
                      <Link 
                        href={href} 
                        className="flex items-center justify-between p-1.5 rounded bg-muted/40 hover:bg-muted text-[11px] text-foreground transition-all"
                      >
                        <div className="flex items-center gap-2">
                          <span className="bg-secondary text-secondary-foreground text-[8px] font-mono uppercase px-1 py-0.5 rounded border border-border select-none">
                            {item.type}
                          </span>
                          <span className="font-medium truncate max-w-[120px]">{item.name}</span>
                        </div>
                        <span className="text-[9px] text-muted-foreground font-mono">{item.updated_at}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
