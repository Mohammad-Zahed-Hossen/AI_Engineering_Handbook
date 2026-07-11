import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getAllWorkflowIds, getWorkflow, getRelatedContent, contentExists, resolveWorkflowStepLinks } from '@/lib/data';
import SectionCard from '@/components/shared/SectionCard';
import ContentPageLayout from '@/components/shared/ContentPageLayout';
import MetadataBadges from '@/components/shared/MetadataBadges';
import OfficialResources from '@/components/shared/OfficialResources';
import RelatedContent from '@/components/shared/RelatedContent';
import WorkflowStepList from '@/components/shared/WorkflowStepList';
import ReadingSessionTracker from '@/components/shared/ReadingSessionTracker';
import ExpandableText from '@/components/shared/ExpandableText';
import { CodeBlock } from '@/components/shared/CodeBlock';
import CollapsibleRow from '@/components/shared/CollapsibleRow';

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

  const hasProductionProfile = !!(
    workflow.production_notes ||
    workflow.scaling_notes ||
    workflow.cost_notes ||
    workflow.latency_notes ||
    workflow.observability_notes
  );

  const resolvedLinks = resolveWorkflowStepLinks(workflow);

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
        ...(workflow.worked_examples?.length
          ? [{ id: 'worked-examples', label: 'Worked Examples' }]
          : []),
        { id: 'failures', label: 'Failure Points' },
        ...(hasProductionProfile
          ? [{ id: 'production', label: 'Production Profile' }]
          : []),
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
        <ExpandableText cacheKey={`workflow-overview-${workflow.id}`} fadeClass="from-background to-transparent">
          <p className="content-prose text-sm text-muted-foreground">{workflow.overview}</p>
        </ExpandableText>
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
        <WorkflowStepList steps={workflow.steps} resolvedLinks={resolvedLinks} />
      </SectionCard>

      {workflow.worked_examples && workflow.worked_examples.length > 0 && (
        <section id="worked-examples" className="space-y-4 scroll-mt-24">
          <h2 className="text-base font-bold text-foreground uppercase tracking-wider text-[10px] font-sans">
            Worked Examples
          </h2>
          <div className="space-y-4">
            {workflow.worked_examples.map((example, idx) => (
              <div key={idx} className="border border-border rounded-lg bg-card overflow-hidden transition-colors hover:border-foreground/15">
                <div className="border-b border-border bg-muted/20 px-4 py-3">
                  <h3 className="text-xs font-semibold text-foreground uppercase tracking-tight">{example.name}</h3>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{example.description}</p>
                </div>
                <div className="p-4 space-y-4">
                  {example.code && (
                    <div className="rounded overflow-hidden text-xs">
                      <CodeBlock
                        code={example.code}
                        language={example.language || 'python'}
                        filename={example.name}
                      />
                    </div>
                  )}
                  {example.implementation_notes && (
                    <div className="rounded border border-border bg-muted/30 p-3 text-xs leading-relaxed">
                      <span className="text-[10px] font-semibold uppercase text-muted-foreground block mb-1">
                        Implementation Notes
                      </span>
                      <p className="text-muted-foreground">{example.implementation_notes}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

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

      {hasProductionProfile && (
        <CollapsibleRow
          id="production"
          label="Production Profile"
          teaser="Production, scaling, cost, latency, and observability wisdom"
          enableHashDeepLink={true}
        >
          <div className="space-y-4 text-xs leading-relaxed text-muted-foreground">
            {workflow.production_notes && (
              <div id="production-deployment" className="scroll-mt-24">
                <span className="text-[10px] font-semibold uppercase text-foreground block mb-1">
                  Production Deployment
                </span>
                <p className="text-sm leading-relaxed">{workflow.production_notes}</p>
              </div>
            )}
            {workflow.scaling_notes && (
              <div id="production-scaling" className="scroll-mt-24">
                <span className="text-[10px] font-semibold uppercase text-foreground block mb-1">
                  Scaling & Throughput
                </span>
                <p className="text-sm leading-relaxed">{workflow.scaling_notes}</p>
              </div>
            )}
            {workflow.cost_notes && (
              <div id="production-cost" className="scroll-mt-24">
                <span className="text-[10px] font-semibold uppercase text-foreground block mb-1">
                  Infrastructure Cost
                </span>
                <p className="text-sm leading-relaxed">{workflow.cost_notes}</p>
              </div>
            )}
            {workflow.latency_notes && (
              <div id="production-latency" className="scroll-mt-24">
                <span className="text-[10px] font-semibold uppercase text-foreground block mb-1">
                  Latency & Performance
                </span>
                <p className="text-sm leading-relaxed">{workflow.latency_notes}</p>
              </div>
            )}
            {workflow.observability_notes && (
              <div id="production-observability" className="scroll-mt-24">
                <span className="text-[10px] font-semibold uppercase text-foreground block mb-1">
                  Observability & Monitoring
                </span>
                <p className="text-sm leading-relaxed">{workflow.observability_notes}</p>
              </div>
            )}
          </div>
        </CollapsibleRow>
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
