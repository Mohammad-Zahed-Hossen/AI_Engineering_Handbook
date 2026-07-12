import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getAllWorkflowIds, getWorkflow, getRelatedContent, contentExists, resolveWorkflowStepLinks, getContentPath } from '@/lib/data';
import SectionCard from '@/components/shared/SectionCard';
import ContentPageLayout from '@/components/shared/ContentPageLayout';
import MetadataBadges from '@/components/shared/MetadataBadges';
import OfficialResources from '@/components/shared/OfficialResources';
import RelatedContent from '@/components/shared/RelatedContent';
import WorkflowStepList from '@/components/shared/WorkflowStepList';
import ReadingSessionTracker from '@/components/shared/ReadingSessionTracker';
import ExpandableText from '@/components/shared/ExpandableText';
import { CodeBlock, highlightCodeSnippet } from '@/components/shared/CodeBlock';
import CollapsibleRow from '@/components/shared/CollapsibleRow';
import ContentTypeBadge from '@/components/shared/ContentTypeBadge';
import { parseLabeledClauses } from '@/lib/text/parseLabeledClauses';
import { linkFootnotes } from '@/lib/text/linkFootnotes';
import { Prose, ProseInline } from '@/components/shared/Prose';
import { parseResourceUrl, categorizeSources } from '@/lib/resources';
import { BadgeRow } from '@/components/shared/BadgeRow';

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

  const stepsWithHighlightedCode = await Promise.all(
    workflow.steps.map(async (step) => {
      if (!step.code) return step;
      const highlightedCodeData = await highlightCodeSnippet(step.code, step.language || 'python');
      return {
        ...step,
        highlightedCodeData,
      };
    })
  );

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
        {(() => {
          // Build a map of footnote number -> resource-${category}-${index} anchor for direct linking to Further Study
          const sourceUrls = workflow.sources.map((s): string => typeof s === 'string' ? s : (s as any).url);
          const categorized = categorizeSources(sourceUrls);
          const footnoteToAnchor: Record<number, string> = {};
          Object.entries(categorized).forEach(([category, urls]: [string, string[]]) => {
            urls.forEach((url: string, idx: number) => {
              const sourceIndex = sourceUrls.indexOf(url);
              if (sourceIndex !== -1) {
                footnoteToAnchor[sourceIndex + 1] = `resource-${category}-${idx}`;
              }
            });
          });

          // Replace GFM footnote references [^1] with direct links to Further Study anchors
          const overviewWithLinks = workflow.overview.replace(/\[\^(\d+)\]/g, (match, numStr) => {
            const num = parseInt(numStr, 10);
            const anchor = footnoteToAnchor[num];
            return anchor ? ` [[${num}]](#${anchor})` : match;
          });
          return (
            <>
              <ExpandableText cacheKey={`workflow-overview-${workflow.id}`} fadeClass="from-background to-transparent" maxLines={4}>
                <Prose content={overviewWithLinks} className="text-sm text-muted-foreground" />
              </ExpandableText>
              {workflow.sources && workflow.sources.length > 0 && (
                <span className="text-[9px] text-muted-foreground/70">
                  {workflow.sources.length} {workflow.sources.length === 1 ? 'source' : 'sources'} cited
                </span>
              )}
            </>
          );
        })()}
        {workflow.starter_stack.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-muted-foreground">Starter Stack:</span>
            <BadgeRow defaultVisible={8}>
              {workflow.starter_stack.map(tool => {
              // Try to resolve as package first, then model
              let link = null;
              let type = null;
              
              if (contentExists('package', tool)) {
                link = getContentPath('package', tool);
                type = 'package';
              } else if (contentExists('model', tool)) {
                link = getContentPath('model', tool);
                type = 'model';
              }
              
              const content = (
                <>
                  <ContentTypeBadge type={type || 'tool'} className="px-1 py-0 text-[8px] h-3.5 leading-none shrink-0" />
                  <span className="truncate text-[10px] font-mono">{tool}</span>
                </>
              );
              
              if (link) {
                return (
                  <Link
                    key={tool}
                    href={link}
                    className="inline-flex items-center gap-1 rounded border border-border bg-muted/40 px-1.5 py-0.5 text-[9px] font-medium text-foreground hover:bg-muted hover:border-foreground/20 transition-colors select-none"
                  >
                    {content}
                  </Link>
                );
              }
              
              return (
                <span
                  key={tool}
                  className="inline-flex items-center gap-1 rounded border border-border bg-muted px-1.5 py-0.5 text-[9px] text-muted-foreground select-none"
                >
                  {content}
                </span>
              );
            })}
            </BadgeRow>
          </div>
        )}
      </header>

      <SectionCard title="Workflow Steps" subtitle="Sequential pipeline" badge={`${workflow.steps.length} steps`} id="steps" className="scroll-mt-24">
        <WorkflowStepList steps={stepsWithHighlightedCode} resolvedLinks={resolvedLinks} workedExamples={workflow.worked_examples} />
      </SectionCard>

      {workflow.worked_examples && workflow.worked_examples.length > 0 && (
        <section id="worked-examples" className="space-y-4 scroll-mt-24">
          <h2 className="text-base font-bold text-foreground uppercase tracking-wider text-[10px] font-sans">
            Worked Examples
          </h2>
          <div className="space-y-4">
            {workflow.worked_examples.map((example, idx) => (
              <div key={idx} id={`example-${idx}`} className="border border-border rounded-lg bg-card overflow-hidden transition-colors hover:border-foreground/15">
                <div className="border-b border-border bg-muted/20 px-4 py-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <h3 className="text-xs font-semibold text-foreground uppercase tracking-tight">{example.name}</h3>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{example.description}</p>
                    </div>
                    {example.related_step ? (
                      <Link
                        href={`#step-${example.related_step}`}
                        className="shrink-0 text-[10px] font-medium text-primary hover:underline"
                      >
                        Used in Step {example.related_step}
                      </Link>
                    ) : (
                      <span className="shrink-0 text-[10px] font-medium text-muted-foreground">
                        Full Pipeline Recipe
                      </span>
                    )}
                  </div>
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
                      <Prose content={linkFootnotes(example.implementation_notes)} className="text-muted-foreground" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {workflow.common_failure_points.length > 0 && (
        <div id="failures" className="border-l-2 border-amber-500 bg-amber-500/5 p-4 rounded-r scroll-mt-24">
          <h2 className="text-amber-700 dark:text-amber-400 font-sans text-xs font-bold uppercase tracking-wider mb-2">Common Failure Points</h2>
          <ul className="mt-2 space-y-4 text-sm text-muted-foreground">
            {workflow.common_failure_points.map((pt, idx) => {
              // Try parsing with recovery strategy first
              let clauses = parseLabeledClauses(pt, [
                'Failure:',
                '* Origin:',
                '* Trigger:',
                '* Immediate symptom:',
                '* Downstream propagation:',
                '* Why debugging is difficult:',
                '* Recommended detection:',
                '* Recovery strategy:'
              ]);
              
              if (!clauses) {
                // Try without recovery strategy
                clauses = parseLabeledClauses(pt, [
                  'Failure:',
                  '* Origin:',
                  '* Trigger:',
                  '* Immediate symptom:',
                  '* Downstream propagation:',
                  '* Why debugging is difficult:',
                  '* Recommended detection:'
                ]);
              }
              
              if (clauses) {
                return (
                  <li key={idx} className="content-prose space-y-1 text-sm list-none">
                    {clauses.map((clause, cIdx) => (
                      <div key={cIdx} className={cIdx === 0 ? "mb-1.5" : "pl-3 border-l border-amber-500/20"}>
                        <span className="font-semibold text-[10px] uppercase text-amber-800 dark:text-amber-400">
                          {clause.label.replace(/^\*\s*/, '')}
                        </span>
                        <span className="ml-1 text-muted-foreground"><ProseInline content={clause.text} /></span>
                      </div>
                    ))}
                  </li>
                );
              }
              
              return (
                <li key={idx} className="content-prose list-disc pl-4">
                  <ProseInline content={pt} />
                </li>
              );
            })}
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
          {/* Sub-navigation pills */}
          <div className="flex flex-wrap gap-1.5 mb-6 border-b border-border pb-3">
            {workflow.production_notes && (
              <a
                href="#production-deployment"
                className="inline-flex items-center rounded border border-border bg-muted/40 px-2 py-1 text-[10px] font-medium text-foreground hover:bg-muted hover:border-foreground/20 transition-colors select-none"
              >
                Deployment
              </a>
            )}
            {workflow.scaling_notes && (
              <a
                href="#production-scaling"
                className="inline-flex items-center rounded border border-border bg-muted/40 px-2 py-1 text-[10px] font-medium text-foreground hover:bg-muted hover:border-foreground/20 transition-colors select-none"
              >
                Scaling
              </a>
            )}
            {workflow.cost_notes && (
              <a
                href="#production-cost"
                className="inline-flex items-center rounded border border-border bg-muted/40 px-2 py-1 text-[10px] font-medium text-foreground hover:bg-muted hover:border-foreground/20 transition-colors select-none"
              >
                Cost
              </a>
            )}
            {workflow.latency_notes && (
              <a
                href="#production-latency"
                className="inline-flex items-center rounded border border-border bg-muted/40 px-2 py-1 text-[10px] font-medium text-foreground hover:bg-muted hover:border-foreground/20 transition-colors select-none"
              >
                Latency
              </a>
            )}
            {workflow.observability_notes && (
              <a
                href="#production-observability"
                className="inline-flex items-center rounded border border-border bg-muted/40 px-2 py-1 text-[10px] font-medium text-foreground hover:bg-muted hover:border-foreground/20 transition-colors select-none"
              >
                Observability
              </a>
            )}
          </div>

          <div className="space-y-4 text-xs leading-relaxed text-muted-foreground">
            {workflow.production_notes && (
              <div id="production-deployment" className="scroll-mt-24">
                <span className="text-[10px] font-semibold uppercase text-foreground block mb-1">
                  Production Deployment
                </span>
                {(() => {
                  const clauses = parseLabeledClauses(workflow.production_notes, ['Benefit:', 'Trade-off:', 'When not to use it:', 'Operational impact:']);
                  if (clauses) {
                    return (
                      <div className="text-sm leading-relaxed space-y-0.5 content-prose">
                        {clauses.map((clause, cIdx) => (
                          <div key={cIdx}>
                            <span className="font-semibold text-[10px] uppercase">{clause.label}</span>
                            <span className="ml-1"><ProseInline content={clause.text} /></span>
                          </div>
                        ))}
                      </div>
                    );
                  }
                  return <p className="text-sm leading-relaxed content-prose"><ProseInline content={workflow.production_notes} /></p>;
                })()}
              </div>
            )}
            {workflow.scaling_notes && (
              <div id="production-scaling" className="scroll-mt-24">
                <span className="text-[10px] font-semibold uppercase text-foreground block mb-1">
                  Scaling & Throughput
                </span>
                {(() => {
                  const clauses = parseLabeledClauses(workflow.scaling_notes, ['Benefit:', 'Trade-off:', 'When not to use it:', 'Operational impact:']);
                  if (clauses) {
                    return (
                      <div className="text-sm leading-relaxed space-y-0.5 content-prose">
                        {clauses.map((clause, cIdx) => (
                          <div key={cIdx}>
                            <span className="font-semibold text-[10px] uppercase">{clause.label}</span>
                            <span className="ml-1"><ProseInline content={clause.text} /></span>
                          </div>
                        ))}
                      </div>
                    );
                  }
                  return <p className="text-sm leading-relaxed content-prose"><ProseInline content={workflow.scaling_notes} /></p>;
                })()}
              </div>
            )}
            {workflow.cost_notes && (
              <div id="production-cost" className="scroll-mt-24">
                <span className="text-[10px] font-semibold uppercase text-foreground block mb-1">
                  Infrastructure Cost
                </span>
                {(() => {
                  const clauses = parseLabeledClauses(workflow.cost_notes, ['Benefit:', 'Trade-off:', 'When not to use it:', 'Operational impact:']);
                  if (clauses) {
                    return (
                      <div className="text-sm leading-relaxed space-y-0.5 content-prose">
                        {clauses.map((clause, cIdx) => (
                          <div key={cIdx}>
                            <span className="font-semibold text-[10px] uppercase">{clause.label}</span>
                            <span className="ml-1"><ProseInline content={clause.text} /></span>
                          </div>
                        ))}
                      </div>
                    );
                  }
                  return <p className="text-sm leading-relaxed content-prose"><ProseInline content={workflow.cost_notes} /></p>;
                })()}
              </div>
            )}
            {workflow.latency_notes && (
              <div id="production-latency" className="scroll-mt-24">
                <span className="text-[10px] font-semibold uppercase text-foreground block mb-1">
                  Latency & Performance
                </span>
                {(() => {
                  const clauses = parseLabeledClauses(workflow.latency_notes, ['Benefit:', 'Trade-off:', 'When not to use it:', 'Operational impact:']);
                  if (clauses) {
                    return (
                      <div className="text-sm leading-relaxed space-y-0.5 content-prose">
                        {clauses.map((clause, cIdx) => (
                          <div key={cIdx}>
                            <span className="font-semibold text-[10px] uppercase">{clause.label}</span>
                            <span className="ml-1"><ProseInline content={clause.text} /></span>
                          </div>
                        ))}
                      </div>
                    );
                  }
                  return <p className="text-sm leading-relaxed content-prose"><ProseInline content={workflow.latency_notes} /></p>;
                })()}
              </div>
            )}
            {workflow.observability_notes && (
              <div id="production-observability" className="scroll-mt-24">
                <span className="text-[10px] font-semibold uppercase text-foreground block mb-1">
                  Observability & Monitoring
                </span>
                {(() => {
                  const clauses = parseLabeledClauses(workflow.observability_notes, ['Benefit:', 'Trade-off:', 'When not to use it:', 'Operational impact:']);
                  if (clauses) {
                    return (
                      <div className="text-sm leading-relaxed space-y-0.5 content-prose">
                        {clauses.map((clause, cIdx) => (
                          <div key={cIdx}>
                            <span className="font-semibold text-[10px] uppercase">{clause.label}</span>
                            <span className="ml-1"><ProseInline content={clause.text} /></span>
                          </div>
                        ))}
                      </div>
                    );
                  }
                  return <p className="text-sm leading-relaxed content-prose"><ProseInline content={workflow.observability_notes} /></p>;
                })()}
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

      <OfficialResources sources={workflow.sources} githubRepo={workflow.github_repo} />

      <RelatedContent items={relatedContent} />
    </ContentPageLayout>
  );
}