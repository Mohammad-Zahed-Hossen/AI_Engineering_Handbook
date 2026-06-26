import { notFound } from 'next/navigation';
import { getAllWorkflowIds, getWorkflow, getRelatedContent } from '@/lib/data';
import SectionCard from '@/components/shared/SectionCard';
import ContentPageLayout from '@/components/shared/ContentPageLayout';
import MetadataBadges from '@/components/shared/MetadataBadges';
import OfficialResources from '@/components/shared/OfficialResources';
import RelatedContent from '@/components/shared/RelatedContent';

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
    if ((e as NodeJS.ErrnoException).code === 'ENOENT') notFound();
    throw e;
  }
  const relatedContent = getRelatedContent('workflow', workflow.id);

  return (
    <ContentPageLayout
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Workflows', href: '/workflows' },
        { label: workflow.name },
      ]}
      toc={[
        { id: 'overview', label: 'Overview' },
        { id: 'steps', label: 'Steps' },
        { id: 'failures', label: 'Failure Points' },
      ]}
    >
      <header id="overview" className="space-y-3 border-b border-border pb-4 scroll-mt-24">
        <h1>{workflow.name}</h1>
        <MetadataBadges
          type="workflow"
          updatedAt={workflow.updated_at}
          category={workflow.category}
        />
        <p className="content-prose text-sm text-muted-foreground">{workflow.overview}</p>
        {workflow.starter_stack.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-muted-foreground">Starter Stack:</span>
            {workflow.starter_stack.map(tool => (
              <span key={tool} className="rounded border border-border bg-muted px-2 py-0.5 text-[10px] font-mono">
                {tool}
              </span>
            ))}
          </div>
        )}
      </header>

      <OfficialResources sources={workflow.sources} githubRepo={workflow.github_repo} />

      <SectionCard title="Workflow Steps" subtitle="Sequential pipeline">
        <ol id="steps" className="space-y-6 scroll-mt-24">
          {workflow.steps.map(s => (
            <li key={s.step} className="flex gap-4 border-b border-border/50 pb-6 last:border-b-0 last:pb-0">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border bg-muted text-sm font-mono font-semibold">
                {s.step}
              </div>
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3>{s.name}</h3>
                  <div className="flex flex-wrap gap-1">
                    {s.tools.map(t => (
                      <span key={t} className="rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] font-mono">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{s.what}</p>
                <div className="rounded border border-border bg-muted/30 p-3 text-sm">
                  <span className="text-[10px] font-semibold uppercase text-muted-foreground block mb-1">
                    Key Decision
                  </span>
                  {s.decision}
                </div>
              </div>
            </li>
          ))}
        </ol>
      </SectionCard>

      {workflow.common_failure_points.length > 0 && (
        <div id="failures" className="border-l-2 border-rose-500 bg-rose-500/5 p-4 rounded-r scroll-mt-24">
          <h2 className="text-rose-700 dark:text-rose-400">Common Failure Points</h2>
          <ul className="mt-2 list-disc pl-4 space-y-1 text-sm text-muted-foreground">
            {workflow.common_failure_points.map((pt, idx) => (
              <li key={idx}>{pt}</li>
            ))}
          </ul>
        </div>
      )}

      <RelatedContent items={relatedContent} />
    </ContentPageLayout>
  );
}
