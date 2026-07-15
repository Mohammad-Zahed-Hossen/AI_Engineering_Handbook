import { notFound } from 'next/navigation';
import { getDebugGuide, getAllDebugGuideIds } from '@/lib/data';
import ContentPageLayout from '@/components/shared/ContentPageLayout';
import MetadataBadges from '@/components/shared/MetadataBadges';
import RelatedContent from '@/components/shared/RelatedContent';
import DebugSolutionList from '@/components/shared/DebugSolutionList';
import DebugOverviewCard from '@/components/shared/DebugOverviewCard';
import DebugChecklist from '@/components/shared/DebugChecklist';
import DiagnosticCommandList from '@/components/shared/DiagnosticCommandList';
import DebugDecisionTree from '@/components/shared/DebugDecisionTree';
import VerificationChecklist from '@/components/shared/VerificationChecklist';
import ExpandableText from '@/components/shared/ExpandableText';
import { Prose } from '@/components/shared/Prose';
import { AlertTriangle, CheckCircle2, Activity, Shield, Search, Terminal, TestTube, XCircle, ArrowUpCircle } from 'lucide-react';
import ReadingSessionTracker from '@/components/shared/ReadingSessionTracker';

export async function generateStaticParams() {
  const ids = getAllDebugGuideIds();
  return ids.map((id) => ({ id }));
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function DebugGuidePage({ params }: PageProps) {
  const { id } = await params;
  const debugGuide = getDebugGuide(id);

  if (!debugGuide) {
    notFound();
  }

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Debug Guides', href: '/debug-guides' },
    { label: debugGuide.title },
  ];

  const toc = [
    { id: 'overview', label: 'Overview' },
    { id: 'quick-identification', label: 'Quick Identification' },
    { id: 'symptoms', label: 'Symptoms' },
    { id: 'root-causes', label: 'Root Causes' },
    { id: 'investigation', label: 'Investigation' },
    { id: 'diagnostic-commands', label: 'Diagnostic Commands' },
    { id: 'diagnostic-tests', label: 'Diagnostic Tests' },
    { id: 'decision-tree', label: 'Decision Tree' },
    { id: 'solutions', label: 'Solutions' },
    { id: 'verification', label: 'Verification' },
    { id: 'prevention', label: 'Prevention' },
    { id: 'misconceptions', label: 'Misconceptions' },
    { id: 'false-positives', label: 'False Positives' },
    { id: 'escalation', label: 'Escalation' },
  ];

  // Combine all related content
  const allRelatedContent = [
    ...debugGuide.related_packages.map(id => ({ id, type: 'package' as const, relationship_type: 'related_packages' })),
    ...debugGuide.related_workflows.map(id => ({ id, type: 'workflow' as const, relationship_type: 'related_workflows' })),
    ...debugGuide.related_patterns.map(id => ({ id, type: 'pattern' as const, relationship_type: 'related_patterns' })),
    ...debugGuide.related_models.map(id => ({ id, type: 'model' as const, relationship_type: 'related_models' })),
    ...debugGuide.related_registry.map(id => ({ id, type: 'registry' as const, relationship_type: 'related_registry' })),
  ];

  return (
    <ContentPageLayout breadcrumbs={breadcrumbs} toc={toc}>
      <ReadingSessionTracker href={`/debug-guides/${debugGuide.id}`} name={debugGuide.title} type="debug_guide" category={debugGuide.category} />
      
      {/* Header */}
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold tracking-tight">{debugGuide.title}</h1>
        <ExpandableText cacheKey={`debug-desc-${debugGuide.id}`} fadeClass="from-background to-transparent">
          <Prose content={debugGuide.description} className="text-muted-foreground" />
        </ExpandableText>
        <MetadataBadges
          type="debug_guide"
          updatedAt={debugGuide.updated_at}
          lastVerified={debugGuide.last_verified}
          category={debugGuide.category}
          difficulty={debugGuide.difficulty}
          domain={debugGuide.domain}
          engineeringArea={debugGuide.engineering_area}
          confidence={debugGuide.confidence}
          engineeringMaturity={debugGuide.engineering_maturity}
          lifecycle={debugGuide.lifecycle}
          stability={debugGuide.stability}
        />
      </div>

      {/* Overview Card */}
      {debugGuide.overview && (
        <section id="overview" className="space-y-3 scroll-mt-24">
          <DebugOverviewCard overview={debugGuide.overview} />
        </section>
      )}

      {/* Quick Identification */}
      {debugGuide.quick_identification && debugGuide.quick_identification.length > 0 && (
        <section id="quick-identification" className="space-y-3 scroll-mt-24">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Search className="w-5 h-5 text-blue-500" />
            Quick Identification
          </h2>
          <div className="space-y-2">
            {debugGuide.quick_identification.map((item, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <span className="shrink-0 w-4 h-4 flex items-center justify-center rounded border border-emerald-500/20 bg-emerald-500/5 text-emerald-600 text-[10px] font-bold mt-0.5">
                  ✓
                </span>
                <div className="flex-1">
                  <span className="text-sm text-foreground">{item.check}</span>
                  {item.description && (
                    <span className="block text-xs text-muted-foreground mt-0.5">{item.description}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground italic">If you see these signs, continue to diagnosis.</p>
        </section>
      )}

      {/* Symptoms */}
      <section id="symptoms" className="space-y-3 scroll-mt-24">
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-orange-500" />
          Symptoms
        </h2>
        <div className="space-y-3">
          {debugGuide.symptoms.map((symptom, idx) => (
            <div key={idx} className="rounded-lg border border-border bg-card p-4">
              <p className="text-sm font-medium text-foreground">{symptom.symptom}</p>
              {symptom.description && (
                <Prose content={symptom.description} className="text-xs text-muted-foreground mt-1" />
              )}
              {symptom.error_message && (
                <div className="mt-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Error Message</span>
                  <pre className="text-xs font-mono bg-muted/50 border border-border rounded p-2 mt-1 overflow-x-auto">
                    <code className="text-foreground">{symptom.error_message}</code>
                  </pre>
                </div>
              )}
              {symptom.where_appears && (
                <div className="mt-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Where Appears</span>
                  <p className="text-xs text-muted-foreground mt-0.5">{symptom.where_appears}</p>
                </div>
              )}
              {symptom.frequency && (
                <div className="mt-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Frequency</span>
                  <span className="text-xs text-muted-foreground ml-1 capitalize">{symptom.frequency}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Root Causes */}
      <section id="root-causes" className="space-y-3 scroll-mt-24">
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Activity className="w-5 h-5 text-red-500" />
          Root Causes
        </h2>
        <div className="space-y-3">
          {debugGuide.root_causes.map((cause, idx) => (
            <div key={idx} className="rounded-lg border border-border bg-card p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{cause.cause}</p>
                  {cause.explanation && (
                    <Prose content={cause.explanation} className="text-xs text-muted-foreground mt-1" />
                  )}
                  {cause.recognition_clues && cause.recognition_clues.length > 0 && (
                    <div className="mt-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Recognition Clues</span>
                      <ul className="mt-1 space-y-0.5">
                        {cause.recognition_clues.map((clue, cIdx) => (
                          <li key={cIdx} className="text-xs text-muted-foreground">• {clue}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {cause.typical_environment && (
                    <div className="mt-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Typical Environment</span>
                      <p className="text-xs text-muted-foreground mt-0.5">{cause.typical_environment}</p>
                    </div>
                  )}
                </div>
                <span className={`shrink-0 px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                  cause.probability === 'high' 
                    ? 'bg-red-500/10 text-red-700 dark:text-red-400' 
                    : cause.probability === 'medium'
                    ? 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400'
                    : 'bg-blue-500/10 text-blue-700 dark:text-blue-400'
                }`}>
                  {cause.probability} likelihood
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Investigation Checklist */}
      {debugGuide.investigation_checklist && debugGuide.investigation_checklist.length > 0 && (
        <section id="investigation" className="space-y-3 scroll-mt-24">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Search className="w-5 h-5 text-blue-500" />
            Investigation Checklist
          </h2>
          <div className="rounded-lg border border-border bg-card p-4">
            <DebugChecklist items={debugGuide.investigation_checklist} />
          </div>
        </section>
      )}

      {/* Diagnostic Commands */}
      {debugGuide.diagnostic_commands && debugGuide.diagnostic_commands.length > 0 && (
        <section id="diagnostic-commands" className="space-y-3 scroll-mt-24">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Terminal className="w-5 h-5 text-purple-500" />
            Diagnostic Commands
          </h2>
          <DiagnosticCommandList commands={debugGuide.diagnostic_commands} />
        </section>
      )}

      {/* Diagnostic Tests */}
      {debugGuide.diagnostic_tests && debugGuide.diagnostic_tests.length > 0 && (
        <section id="diagnostic-tests" className="space-y-3 scroll-mt-24">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <TestTube className="w-5 h-5 text-indigo-500" />
            Diagnostic Tests
          </h2>
          <div className="space-y-3">
            {debugGuide.diagnostic_tests.map((test, idx) => (
              <div key={idx} className="rounded-lg border border-border bg-card p-4 space-y-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Purpose</span>
                  <p className="text-sm text-foreground mt-0.5">{test.purpose}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Test</span>
                  <p className="text-sm text-foreground mt-0.5">{test.test}</p>
                </div>
                {test.command && (
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Command</span>
                    <pre className="text-xs font-mono bg-muted/50 border border-border rounded p-2 mt-1 overflow-x-auto">
                      <code className="text-foreground">{test.command}</code>
                    </pre>
                  </div>
                )}
                {test.expected_result && (
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Expected Result</span>
                    <p className="text-sm text-muted-foreground mt-0.5">{test.expected_result}</p>
                  </div>
                )}
                {test.interpretation && (
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Interpretation</span>
                    <p className="text-sm text-muted-foreground mt-0.5">{test.interpretation}</p>
                  </div>
                )}
                {test.next_action && (
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Next Action</span>
                    <p className="text-sm text-foreground mt-0.5">{test.next_action}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Decision Tree */}
      {debugGuide.decision_tree && (
        <DebugDecisionTree tree={debugGuide.decision_tree} />
      )}

      {/* Solutions */}
      <section id="solutions" className="space-y-3 scroll-mt-24">
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          Solutions
        </h2>
        <DebugSolutionList solutions={debugGuide.solutions} />
      </section>

      {/* Verification Checklist */}
      {debugGuide.verification_checklist && debugGuide.verification_checklist.length > 0 && (
        <section id="verification" className="space-y-3 scroll-mt-24">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            Verification Checklist
          </h2>
          <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-4">
            <VerificationChecklist items={debugGuide.verification_checklist} />
          </div>
        </section>
      )}

      {/* Prevention */}
      <section id="prevention" className="space-y-3 scroll-mt-24">
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Shield className="w-5 h-5 text-purple-500" />
          Prevention
        </h2>
        <div className="space-y-3">
          {debugGuide.prevention.map((prev, idx) => (
            <div key={idx} className="rounded-lg border border-purple-500/20 bg-purple-500/5 p-4">
              <h3 className="text-xs font-semibold text-purple-700 dark:text-purple-400 mb-2 capitalize">
                {prev.category}
              </h3>
              <ul className="space-y-1">
                {prev.practices.map((practice, pIdx) => (
                  <li key={pIdx} className="text-sm text-muted-foreground pl-3 relative before:content-['•'] before:absolute before:left-0 before:text-muted-foreground">
                    {practice}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Common Misconceptions */}
      {debugGuide.common_misconceptions && debugGuide.common_misconceptions.length > 0 && (
        <section id="misconceptions" className="space-y-3 scroll-mt-24">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <XCircle className="w-5 h-5 text-amber-500" />
            Common Misconceptions
          </h2>
          <div className="space-y-3">
            {debugGuide.common_misconceptions.map((misconception, idx) => (
              <div key={idx} className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-4">
                <div className="space-y-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">Misconception</span>
                    <p className="text-sm text-foreground mt-0.5">{misconception.misconception}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">Reality</span>
                    <p className="text-sm text-muted-foreground mt-0.5">{misconception.reality}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* False Positive Cases */}
      {debugGuide.false_positive_cases && debugGuide.false_positive_cases.length > 0 && (
        <section id="false-positives" className="space-y-3 scroll-mt-24">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <XCircle className="w-5 h-5 text-red-500" />
            False Positive Cases
          </h2>
          <div className="space-y-3">
            {debugGuide.false_positive_cases.map((fp, idx) => (
              <div key={idx} className="rounded-lg border border-red-500/20 bg-red-500/5 p-4">
                <p className="text-sm font-medium text-foreground mb-2">{fp.case}</p>
                {fp.why_it_looks_similar && (
                  <div className="mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Why It Looks Similar</span>
                    <p className="text-xs text-muted-foreground mt-0.5">{fp.why_it_looks_similar}</p>
                  </div>
                )}
                {fp.how_to_distinguish && (
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">How to Distinguish</span>
                    <p className="text-xs text-muted-foreground mt-0.5">{fp.how_to_distinguish}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Escalation Paths */}
      {debugGuide.escalation_paths && debugGuide.escalation_paths.length > 0 && (
        <section id="escalation" className="space-y-3 scroll-mt-24">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <ArrowUpCircle className="w-5 h-5 text-blue-500" />
            Escalation Paths
          </h2>
          <div className="space-y-3">
            {debugGuide.escalation_paths.map((path, idx) => (
              <div key={idx} className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-4">
                <p className="text-sm font-medium text-foreground mb-2">{path.path}</p>
                {path.when_to_use && (
                  <div className="mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">When to Use</span>
                    <p className="text-xs text-muted-foreground mt-0.5">{path.when_to_use}</p>
                  </div>
                )}
                {path.tradeoffs && path.tradeoffs.length > 0 && (
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Tradeoffs</span>
                    <ul className="mt-1 space-y-0.5">
                      {path.tradeoffs.map((tradeoff, tIdx) => (
                        <li key={tIdx} className="text-xs text-muted-foreground">• {tradeoff}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Related Content */}
      {allRelatedContent.length > 0 && (
        <RelatedContent items={allRelatedContent} />
      )}
    </ContentPageLayout>
  );
}