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
import QuickNav from '@/components/shared/QuickNav';
import { parseLabeledClauses } from '@/lib/text/parseLabeledClauses';
import { ProseClient, ProseInline } from '@/components/shared/Prose';
import { BadgeRow } from '@/components/shared/BadgeRow';
import { Server, Cpu, Clock, DollarSign, Activity, BookOpen, AlertTriangle, CheckCircle2, ArrowRight } from 'lucide-react';
import FavoriteButton from '@/components/shared/FavoriteButton';

export async function generateStaticParams() {
  return getAllWorkflowIds().map((id) => ({ id }));
}

interface PageProps {
  params: Promise<{ id: string }>;
}

// Helper to render production notes with clause parsing
function renderProductionNotes(notes: string | undefined, labels: string[]) {
  if (!notes) return null;
  const clauses = parseLabeledClauses(notes, labels);
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
  return <div className="text-sm leading-relaxed content-prose"><ProseInline content={notes} /></div>;
}

// Compact Quick Facts component for hero - mobile-first
function QuickFacts({ workflow }: { workflow: { steps: unknown[]; difficulty?: string; domain?: string; estimated_reading_time?: number; engineering_maturity?: string } }) {
  const primaryFacts = [
    { label: 'Steps', value: String(workflow.steps.length) },
    workflow.difficulty && { label: 'Difficulty', value: workflow.difficulty },
    workflow.domain && { label: 'Domain', value: workflow.domain },
  ].filter(Boolean) as { label: string; value: string }[];

  const secondaryFacts = [
    workflow.estimated_reading_time && { label: 'Time', value: `${workflow.estimated_reading_time} min` },
    workflow.engineering_maturity && { label: 'Status', value: workflow.engineering_maturity.replace('_', ' ') },
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {primaryFacts.map((fact) => (
        <span
          key={fact.label}
          className="text-[10px] font-mono text-muted-foreground"
        >
          {fact.label}: <span className="font-medium text-foreground">{fact.value}</span>
        </span>
      ))}
      {secondaryFacts.length > 0 && (
        <span className="text-[10px] font-mono text-muted-foreground">
          {secondaryFacts.map((fact, i) => (
            <span key={fact.label}>
              {i > 0 && ' · '}
              {fact.label}: <span className="font-medium text-foreground">{fact.value}</span>
            </span>
          ))}
        </span>
      )}
    </div>
  );
}

// Production Profile Card component
function ProductionProfileCard({ 
  id, 
  title, 
  icon, 
  notes, 
  labels 
}: { 
  id: string; 
  title: string; 
  icon: React.ReactNode; 
  notes: string | undefined; 
  labels: string[];
}) {
  if (!notes) return null;

  return (
    <CollapsibleRow
      id={id}
      label={
        <div className="flex items-center gap-2">
          {icon}
          <span>{title}</span>
        </div>
      }
      teaser="Engineering considerations for production deployment"
      enableHashDeepLink={true}
      className="bg-card"
    >
      {renderProductionNotes(notes, labels)}
    </CollapsibleRow>
  );
}

// Worked Example Card component
function WorkedExampleCard({ 
  example, 
  idx 
}: { 
  example: { name: string; description: string; code?: string; language?: string; implementation_notes?: string; related_step?: number }; 
  idx: number;
}) {
  const hasCode = !!example.code;
  const hasNotes = !!example.implementation_notes;

  return (
    <CollapsibleRow
      id={`example-${idx}`}
      label={
        <div className="flex flex-col gap-1">
          <span className="text-xs font-semibold uppercase tracking-tight">{example.name}</span>
          <span className="text-[10px] font-normal text-muted-foreground">{example.description}</span>
        </div>
      }
      teaser={
        <div className="flex items-center gap-2 mt-1">
          {example.related_step && (
            <span className="text-[10px] text-muted-foreground">
              Related to Step {example.related_step}
            </span>
          )}
        </div>
      }
      enableHashDeepLink={true}
      className="bg-card"
    >
      {hasCode && (
        <div className="rounded-md border border-border overflow-hidden my-2">
          <CodeBlock
            code={example.code!}
            language={example.language || 'python'}
            filename={example.name}
          />
        </div>
      )}
      {hasNotes && (
        <div className="rounded border border-border bg-muted/30 p-3 text-xs leading-relaxed">
          <span className="text-[10px] font-semibold uppercase text-muted-foreground block mb-1">
            Implementation Notes
          </span>
          <ProseClient content={example.implementation_notes!} className="text-muted-foreground" />
        </div>
      )}
    </CollapsibleRow>
  );
}

// Failure Point Card component
function FailurePointCard({ 
  failure 
}: { 
  failure: string;
}) {
  // Try parsing with recovery strategy first
  let clauses = parseLabeledClauses(failure, [
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
    clauses = parseLabeledClauses(failure, [
      'Failure:',
      '* Origin:',
      '* Trigger:',
      '* Immediate symptom:',
      '* Downstream propagation:',
      '* Why debugging is difficult:',
      '* Recommended detection:'
    ]);
  }

  return (
    <div className="border-l-2 border-amber-500 bg-amber-500/5 rounded-r-lg p-3">
      {clauses ? (
        <div className="space-y-1.5">
          {clauses.map((clause, cIdx) => (
            <div key={cIdx} className={cIdx === 0 ? "" : "pl-3 border-l border-amber-500/20"}>
              <span className="font-semibold text-[10px] uppercase text-amber-800 dark:text-amber-400">
                {clause.label.replace(/^\*\s*/, '')}
              </span>
              <span className="ml-1 text-sm text-muted-foreground"><ProseInline content={clause.text} /></span>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-sm text-muted-foreground"><ProseInline content={failure} /></div>
      )}
    </div>
  );
}

// Next Workflow Continuation component
function NextWorkflowSection({ 
  nextLinks, 
  currentWorkflowName 
}: { 
  nextLinks: string[];
  currentWorkflowName: string;
}) {
  const validLinks = nextLinks
    .filter(wfId => contentExists('workflow', wfId))
    .map(wfId => {
      let name = wfId;
      try { name = getWorkflow(wfId).name; } catch { }
      return { id: wfId, name };
    });

  if (!validLinks.length) return null;

  return (
    <section id="next" className="space-y-3">
      <div className="flex items-center gap-2">
        <ArrowRight className="w-4 h-4 text-primary" />
        <h2 className="text-sm font-semibold text-foreground">Continue Learning</h2>
      </div>
      <p className="text-xs text-muted-foreground">
        After {currentWorkflowName}, explore these related workflows:
      </p>
      <div className="flex flex-col sm:flex-row gap-2">
        {validLinks.map(({ id: wfId, name }) => (
          <Link
            key={wfId}
            href={`/workflows/${wfId}`}
            className="flex-1 rounded-lg border border-border bg-card p-3 hover:bg-muted/30 transition-colors group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-foreground group-hover:text-primary transition-colors">
                {name}
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
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

  const hasWorkedExamples = workflow.worked_examples && workflow.worked_examples.length > 0;
  const hasFailures = workflow.common_failure_points.length > 0;
  const hasEvaluation = workflow.evaluation_checks && workflow.evaluation_checks.length > 0;
  const hasNextLinks = workflow.next_links && workflow.next_links.length > 0;

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

  // Build quick nav items
  const quickNavItems = [
    { id: 'steps', label: 'Steps' },
    ...(hasWorkedExamples ? [{ id: 'worked-examples', label: 'Examples' }] : []),
    ...(hasFailures ? [{ id: 'failures', label: 'Failures' }] : []),
    ...(hasProductionProfile ? [{ id: 'production', label: 'Production' }] : []),
    ...(hasEvaluation ? [{ id: 'evaluation', label: 'Evaluation' }] : []),
  ];

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
        ...(hasWorkedExamples ? [{ id: 'worked-examples', label: 'Worked Examples' }] : []),
        ...(hasFailures ? [{ id: 'failures', label: 'Failure Points' }] : []),
        ...(hasProductionProfile ? [{ id: 'production', label: 'Production Profile' }] : []),
        ...(hasEvaluation ? [{ id: 'evaluation', label: 'Evaluation' }] : []),
      ]}
    >
      <ReadingSessionTracker id={workflow.id} href={`/workflows/${workflow.id}`} name={workflow.name} type="workflow" category={workflow.category} />
      
      {/* Hero Section */}
      <header id="overview" className="space-y-3 border-b border-border pb-3 scroll-mt-24">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h1>{workflow.name}</h1>
            
            <ExpandableText cacheKey={`workflow-overview-${workflow.id}`} fadeClass="from-background to-transparent" maxLines={3}>
              <ProseClient content={workflow.overview} className="text-sm text-muted-foreground" />
            </ExpandableText>
            
            <MetadataBadges
              type="workflow"
              updatedAt={workflow.updated_at}
              category={workflow.category}
              difficulty={workflow.difficulty}
              domain={workflow.domain}
              engineeringArea={workflow.engineering_area}
            />
            
            <QuickFacts workflow={workflow} />
          </div>
          <FavoriteButton type="workflow" id={workflow.id} name={workflow.name} href={`/workflows/${workflow.id}`} />
        </div>
        
        {workflow.starter_stack.length > 0 && (
          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-muted-foreground">Starter Stack:</span>
            <BadgeRow defaultVisible={4}>
              {workflow.starter_stack.map(tool => {
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

      {/* Quick Navigation */}
      {quickNavItems.length > 1 && (
        <QuickNav items={quickNavItems} />
      )}

      {/* Workflow Steps - Primary Content */}
      <SectionCard 
        title="Workflow Steps" 
        subtitle="Sequential pipeline" 
        badge={`${workflow.steps.length} steps`} 
        id="steps" 
        className="scroll-mt-24"
      >
        <WorkflowStepList steps={stepsWithHighlightedCode} resolvedLinks={resolvedLinks} workedExamples={workflow.worked_examples} />
      </SectionCard>

      {/* Worked Examples - Secondary Content */}
      {hasWorkedExamples && (
        <section id="worked-examples" className="space-y-3 scroll-mt-24">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-primary" />
            <h2 className="text-sm font-semibold text-foreground">Worked Examples</h2>
          </div>
          <p className="text-xs text-muted-foreground">
            Implementation recipes for key steps in this workflow.
          </p>
          <div className="space-y-2">
            {workflow.worked_examples.map((example, idx) => (
              <WorkedExampleCard 
                key={idx} 
                example={example} 
                idx={idx}
              />
            ))}
          </div>
        </section>
      )}

      {/* Failure Points - Warning Section */}
      {hasFailures && (
        <section id="failures" className="space-y-3 scroll-mt-24">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <h2 className="text-sm font-semibold text-foreground">Failure Points</h2>
          </div>
          <p className="text-xs text-muted-foreground">
            Common failure modes and detection strategies.
          </p>
          <div className="space-y-2">
            {workflow.common_failure_points.map((pt, idx) => (
              <FailurePointCard key={idx} failure={pt} />
            ))}
          </div>
        </section>
      )}

      {/* Production Profile - Engineering Dashboard */}
      {hasProductionProfile && (
        <section id="production" className="space-y-3 scroll-mt-24">
          <div className="flex items-center gap-2">
            <Server className="w-4 h-4 text-primary" />
            <h2 className="text-sm font-semibold text-foreground">Production Profile</h2>
          </div>
          <p className="text-xs text-muted-foreground">
            Engineering considerations for production deployment.
          </p>
          <div className="space-y-2">
            <ProductionProfileCard
              id="production-deployment"
              title="Deployment"
              icon={<Server className="w-3.5 h-3.5 text-blue-500" />}
              notes={workflow.production_notes}
              labels={['Benefit:', 'Trade-off:', 'When not to use it:', 'Operational impact:']}
            />
            <ProductionProfileCard
              id="production-scaling"
              title="Scaling & Throughput"
              icon={<Cpu className="w-3.5 h-3.5 text-green-500" />}
              notes={workflow.scaling_notes}
              labels={['Benefit:', 'Trade-off:', 'When not to use it:', 'Operational impact:']}
            />
            <ProductionProfileCard
              id="production-latency"
              title="Latency & Performance"
              icon={<Clock className="w-3.5 h-3.5 text-orange-500" />}
              notes={workflow.latency_notes}
              labels={['Benefit:', 'Trade-off:', 'When not to use it:', 'Operational impact:']}
            />
            <ProductionProfileCard
              id="production-cost"
              title="Infrastructure Cost"
              icon={<DollarSign className="w-3.5 h-3.5 text-purple-500" />}
              notes={workflow.cost_notes}
              labels={['Benefit:', 'Trade-off:', 'When not to use it:', 'Operational impact:']}
            />
            <ProductionProfileCard
              id="production-observability"
              title="Observability & Monitoring"
              icon={<Activity className="w-3.5 h-3.5 text-cyan-500" />}
              notes={workflow.observability_notes}
              labels={['Benefit:', 'Trade-off:', 'When not to use it:', 'Operational impact:']}
            />
          </div>
        </section>
      )}

      {/* Evaluation Checklist - Success Section */}
      {hasEvaluation && (
        <section id="evaluation" className="space-y-3 scroll-mt-24">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <h2 className="text-sm font-semibold text-foreground">Evaluation Checklist</h2>
          </div>
          <p className="text-xs text-muted-foreground">
            Verify your implementation against these criteria.
          </p>
          <div className="rounded-lg border border-border bg-card p-3">
            <ul className="space-y-2">
              {workflow.evaluation_checks!.map((check, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs">
                  <span className="mt-0.5 text-emerald-500 shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </span>
                  <span className="leading-relaxed text-muted-foreground">{check}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Next Workflow - Continuation */}
      {hasNextLinks && (
        <NextWorkflowSection nextLinks={workflow.next_links!} currentWorkflowName={workflow.name} />
      )}

      {/* Official Resources */}
      <OfficialResources sources={workflow.sources} githubRepo={workflow.github_repo} />

      {/* Related Content */}
      <RelatedContent items={relatedContent} />
    </ContentPageLayout>
  );
}