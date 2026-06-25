import { notFound } from 'next/navigation';
import { getAllWorkflowIds, getWorkflow } from '@/lib/data';
import SectionCard from '@/components/shared/SectionCard';

/**
 * Pre-generates parameters for all workflow routes using the index list.
 * Invoked statically during next build.
 */
export async function generateStaticParams() {
  return getAllWorkflowIds().map((id) => ({ id }));
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function WorkflowDetailPage({ params }: PageProps) {
  const { id } = await params;

  let workflow;
  try {
    workflow = getWorkflow(id);
  } catch (e) {
    if ((e as NodeJS.ErrnoException).code === 'ENOENT') {
      notFound();
    } else {
      throw e;
    }
  }

  if (!workflow) {
    notFound();
  }

  const officialDocs = workflow.sources.find(
    url => !url.includes('arxiv.org') && !url.includes('biorxiv.org') && !url.includes('researchgate.net') && !url.includes('doi.org')
  );
  const researchPaper = workflow.sources.find(
    url => url.includes('arxiv.org') || url.includes('biorxiv.org') || url.includes('researchgate.net') || url.includes('doi.org')
  );

  return (
    <div className="max-w-3xl mx-auto space-y-8 select-text">
      {/* Workflow Header */}
      <header className="border-b border-border pb-4 flex items-center justify-between select-none">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold tracking-tight text-foreground font-sans">
            {workflow.name}
          </h1>
          <span className="bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 px-2 py-0.5 rounded text-[10px] font-semibold font-mono uppercase">
            {workflow.type}
          </span>
          <span className="bg-zinc-500/10 text-zinc-500 border border-zinc-500/20 px-2 py-0.5 rounded text-[10px] font-semibold font-mono uppercase">
            {workflow.category}
          </span>
        </div>
      </header>

      {/* Overview & Starter Stack */}
      <div className="bg-card text-card-foreground border border-border p-5 rounded-lg shadow-sm">
        <p className="text-xs text-muted-foreground leading-relaxed font-sans">
          {workflow.overview}
        </p>

        {/* Starter Stack */}
        {workflow.starter_stack && workflow.starter_stack.length > 0 && (
          <div className="mt-4 pt-3 border-t border-border flex items-center gap-2 flex-wrap text-xs select-none">
            <span className="font-semibold text-muted-foreground font-sans">Starter Stack:</span>
            <div className="flex flex-wrap gap-1.5 font-mono">
              {workflow.starter_stack.map((tool) => (
                <span key={tool} className="px-2 py-0.5 rounded bg-secondary text-secondary-foreground border border-border text-[10px]">
                  {tool}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* SECTION 2.5: Official Resources */}
      {(officialDocs || researchPaper || workflow.github_repo) && (
        <section className="border border-border p-4 rounded bg-card select-none space-y-2">
          <h3 className="text-xs font-bold text-foreground uppercase tracking-wider font-sans">
            Official Resources
          </h3>
          <div className="flex flex-wrap gap-4 text-xs font-sans">
            {officialDocs && (
              <a
                href={officialDocs}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-indigo-500 hover:underline font-semibold"
              >
                <span>🌐</span> Documentation &rarr;
              </a>
            )}
            {researchPaper && (
              <a
                href={researchPaper}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-indigo-500 hover:underline font-semibold"
              >
                <span>📄</span> Original Paper &rarr;
              </a>
            )}
            {workflow.github_repo && (
              <a
                href={workflow.github_repo}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-indigo-500 hover:underline font-semibold"
              >
                <span>💻</span> GitHub Repository &rarr;
              </a>
            )}
          </div>
        </section>
      )}

      {/* Step by Step Pipeline (rendered as a numbered list) */}
      <SectionCard title="Workflow Step Pipeline" subtitle="Chronological engineering sequence and design choices">
        <ol className="space-y-6">
          {workflow.steps.map((s) => (
            <li key={s.step} className="flex gap-4 items-start border-b border-border/40 pb-6 last:border-b-0 last:pb-0">
              {/* Step number badge */}
              <div className="bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 w-8 h-8 rounded-full flex items-center justify-center font-mono font-bold text-sm shrink-0 select-none">
                {s.step}
              </div>

              {/* Step details */}
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2 justify-between">
                  <h4 className="text-sm font-semibold text-foreground font-sans">
                    {s.name}
                  </h4>
                  <div className="flex flex-wrap gap-1 select-none font-mono">
                    {s.tools.map((t) => (
                      <span key={t} className="px-1.5 py-0.5 rounded bg-secondary text-secondary-foreground border border-border text-[9px]">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed font-sans">
                  {s.what}
                </p>
                {/* Highlighted box for decision */}
                <div className="bg-muted/40 border border-border p-3 rounded text-[11px] text-foreground/95 leading-relaxed font-sans mt-2">
                  <span className="font-bold text-[9px] uppercase tracking-wider block mb-1 text-muted-foreground select-none">
                    Key Decision & Baseline
                  </span>
                  {s.decision}
                </div>
              </div>
            </li>
          ))}
        </ol>
      </SectionCard>

      {/* Failure Points */}
      {workflow.common_failure_points && workflow.common_failure_points.length > 0 && (
        <div className="bg-rose-500/5 border-l-2 border-rose-500 p-4 rounded text-[11px] text-rose-700 dark:text-rose-400 select-none">
          <span className="font-semibold block uppercase text-[9px] tracking-wider mb-2 select-none font-sans">
            Common Production Failure Points
          </span>
          <ul className="list-disc pl-4 space-y-1.5 font-sans leading-relaxed">
            {workflow.common_failure_points.map((pt, idx) => (
              <li key={idx}>{pt}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
