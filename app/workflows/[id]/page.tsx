import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getAllWorkflowIds, getWorkflow, getRelatedContent, contentExists } from '@/lib/data';
import SectionCard from '@/components/shared/SectionCard';
import ContentPageLayout from '@/components/shared/ContentPageLayout';
import MetadataBadges from '@/components/shared/MetadataBadges';
import OfficialResources from '@/components/shared/OfficialResources';
import RelatedContent from '@/components/shared/RelatedContent';
import WorkflowStepList from '@/components/shared/WorkflowStepList';
import ReadingSessionTracker from '@/components/shared/ReadingSessionTracker';

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
        ...(workflow.evaluation_checks?.length
          ? [{ id: 'evaluation', label: 'Evaluation' }]
          : []),
      ]}
    >
      <ReadingSessionTracker href={`/workflows/${workflow.id}`} name={workflow.name} type="workflow" category={workflow.category} />
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
        <WorkflowStepList steps={workflow.steps} />
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

      {workflow.evaluation_checks && workflow.evaluation_checks.length > 0 && (
        <div id="evaluation" className="rounded-lg border border-border bg-card p-4 space-y-2 scroll-mt-24">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground block">
            Evaluation Checklist
          </span>
          <ul className="space-y-1.5">
            {workflow.evaluation_checks.map((check, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                <span className="mt-0.5 text-emerald-500 shrink-0 text-xs">✓</span>
                <span className="leading-relaxed">{check}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {workflow.next_links && workflow.next_links.length > 0 && (() => {
        const validLinks = workflow.next_links
          .filter(wfId => contentExists('workflow', wfId))
          .map(wfId => {
            let name = wfId;
            try { name = getWorkflow(wfId).name; } catch { }
            return { id: wfId, name };
          });
        if (!validLinks.length) return null;
        return (
          <div className="space-y-2">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground block">
              Next Workflow
            </span>
            <div className="flex flex-wrap gap-2">
              {validLinks.map(({ id: wfId, name }) => (
                <Link
                  key={wfId}
                  href={`/workflows/${wfId}`}
                  className="inline-flex items-center gap-1.5 rounded border border-border bg-muted/40 
                             px-3 py-1.5 text-xs font-medium text-foreground 
                             hover:bg-muted hover:border-foreground/20 transition-colors"
                >
                  {name} →
                </Link>
              ))}
            </div>
          </div>
        );
      })()}

      <RelatedContent items={relatedContent} />
    </ContentPageLayout>
  );
}
