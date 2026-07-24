import { notFound } from 'next/navigation';
import { getDebugGuide, getAllDebugGuideIds, getRelatedContent, getCanonicalRelationshipsForEntity, resolveGraphNodes, shouldRenderKnowledgeGraph } from '@/lib/data';
import ContentPageLayout from '@/components/shared/ContentPageLayout';
import MetadataBadges from '@/components/shared/MetadataBadges';
import RelatedContent from '@/components/shared/RelatedContent';
import DebugChecklist from '@/components/shared/DebugChecklist';
import DiagnosticCommandList from '@/components/shared/DiagnosticCommandList';
import VerificationChecklist from '@/components/shared/VerificationChecklist';
import QuickIdentificationChecklist from '@/components/shared/QuickIdentificationChecklist';
import ExpandableText from '@/components/shared/ExpandableText';
import { ProseClient } from '@/components/shared/Prose';
import { AlertTriangle, CheckCircle2, Activity, Shield, Search, Terminal, TestTube, XCircle, ArrowUpCircle, ChevronRight } from 'lucide-react';
import ReadingSessionTracker from '@/components/shared/ReadingSessionTracker';
import DebugDashboard from '@/components/shared/DebugDashboard';
import FavoriteButton from '@/components/shared/FavoriteButton';
import DecisionWizard from '@/components/shared/DecisionWizard';
import RootCauseCard from '@/components/shared/RootCauseCard';
import DiagnosticTestCard from '@/components/shared/DiagnosticTestCard';
import SolutionGroup from '@/components/shared/SolutionGroup';
import KnowledgeGraphPanel from '@/components/shared/KnowledgeGraphPanel';


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

  const allRelatedContent = getRelatedContent('debug_guide', debugGuide.id);
  const rawGraphItems = getCanonicalRelationshipsForEntity('debug_guide', debugGuide.id);
  const graphNodes = resolveGraphNodes(rawGraphItems, 'debug_guide', debugGuide.id).filter(n => n.type !== 'package_task');
  const shouldShowGraph = shouldRenderKnowledgeGraph(allRelatedContent, graphNodes);

  // Sort root causes by probability (high -> medium -> low)
  const sortedRootCauses = [...debugGuide.root_causes].sort((a, b) => {
    const order: Record<string, number> = { high: 0, medium: 1, low: 2 };
    return (order[a.probability || 'medium'] || 1) - (order[b.probability || 'medium'] || 1);
  });

  return (
    <ContentPageLayout breadcrumbs={breadcrumbs} toc={toc}>
      <ReadingSessionTracker id={debugGuide.id} href={`/debug-guides/${debugGuide.id}`} name={debugGuide.title} type="debug_guide" category={debugGuide.category} />
      
      {/* Debug Dashboard - Hero Section */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <DebugDashboard
            title={debugGuide.title}
            category={debugGuide.category}
            overview={debugGuide.overview}
            hasQuickIdentification={debugGuide.quick_identification && debugGuide.quick_identification.length > 0}
          />
        </div>
        <FavoriteButton type="debug_guide" id={debugGuide.id} name={debugGuide.title} href={`/debug-guides/${debugGuide.id}`} />
      </div>

      {/* Workflow Progress Indicator */}
      <div className="border-t border-b border-border py-3 -mx-4 px-4">
        <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground">
          <span>Identify</span>
          <ChevronRight className="w-3 h-3" />
          <span>Diagnose</span>
          <ChevronRight className="w-3 h-3" />
          <span>Fix</span>
          <ChevronRight className="w-3 h-3" />
          <span>Verify</span>
        </div>
      </div>

      {/* Description */}
      <ExpandableText cacheKey={`debug-desc-${debugGuide.id}`} fadeClass="from-background to-transparent">
        <ProseClient content={debugGuide.description} className="text-muted-foreground" />
      </ExpandableText>

      {/* Metadata Badges */}
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

      {/* Quick Identification - High Priority */}
      {debugGuide.quick_identification && debugGuide.quick_identification.length > 0 && (
        <section id="quick-identification" className="space-y-3 scroll-mt-24">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Search className="w-5 h-5 text-blue-500" />
            Quick Identification
          </h2>
          <QuickIdentificationChecklist items={debugGuide.quick_identification} guideId={debugGuide.id} />
          <p className="text-xs text-muted-foreground italic">If you see these signs, continue to diagnosis.</p>
        </section>
      )}

      {/* Symptoms - High Priority */}
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
                <ProseClient content={symptom.description} className="text-xs text-muted-foreground mt-1" />
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

      {/* Root Causes - High Priority, Collapsible */}
      <section id="root-causes" className="space-y-3 scroll-mt-24">
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Activity className="w-5 h-5 text-red-500" />
          Root Causes
        </h2>
        <div className="space-y-3">
          {sortedRootCauses.map((cause, idx) => (
            <RootCauseCard
              key={idx}
              cause={cause}
              defaultExpanded={cause.probability === 'high'}
            />
          ))}
        </div>
      </section>

      {/* Investigation Checklist - Medium Priority */}
      {debugGuide.investigation_checklist && debugGuide.investigation_checklist.length > 0 && (
        <section id="investigation" className="space-y-3 scroll-mt-24">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Search className="w-5 h-5 text-blue-500" />
            Investigation Checklist
          </h2>
          <div className="border border-border rounded-lg bg-card p-4">
            <DebugChecklist items={debugGuide.investigation_checklist} />
          </div>
        </section>
      )}

      {/* Diagnostic Commands - Medium Priority */}
      {debugGuide.diagnostic_commands && debugGuide.diagnostic_commands.length > 0 && (
        <section id="diagnostic-commands" className="space-y-3 scroll-mt-24">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Terminal className="w-5 h-5 text-purple-500" />
            Diagnostic Commands
          </h2>
          <DiagnosticCommandList commands={debugGuide.diagnostic_commands} />
        </section>
      )}

      {/* Diagnostic Tests - Medium Priority */}
      {debugGuide.diagnostic_tests && debugGuide.diagnostic_tests.length > 0 && (
        <section id="diagnostic-tests" className="space-y-3 scroll-mt-24">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <TestTube className="w-5 h-5 text-indigo-500" />
            Diagnostic Tests
          </h2>
          <div className="space-y-3">
            {debugGuide.diagnostic_tests.map((test, idx) => (
              <DiagnosticTestCard key={idx} test={test} />
            ))}
          </div>
        </section>
      )}

      {/* Decision Tree - Highest Priority, Wizard Style */}
      {debugGuide.decision_tree && (
        <DecisionWizard tree={debugGuide.decision_tree} />
      )}

      {/* Solutions - Highest Priority, Grouped */}
      <section id="solutions" className="space-y-3 scroll-mt-24">
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          Solutions
        </h2>
        <SolutionGroup solutions={debugGuide.solutions} />
      </section>

      {/* Verification Checklist - Medium Priority */}
      {debugGuide.verification_checklist && debugGuide.verification_checklist.length > 0 && (
        <section id="verification" className="space-y-3 scroll-mt-24">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            Verification Checklist
          </h2>
          <div className="border border-emerald-500/20 bg-emerald-500/5 p-4">
            <VerificationChecklist items={debugGuide.verification_checklist} />
          </div>
        </section>
      )}

      {/* Prevention - Lower Priority */}
      <section id="prevention" className="space-y-3 scroll-mt-24">
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Shield className="w-5 h-5 text-purple-500" />
          Prevention
        </h2>
        <div className="space-y-3">
          {debugGuide.prevention.map((prev, idx) => (
            <div key={idx} className="border border-purple-500/20 bg-purple-500/5 p-4">
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

      {/* Common Misconceptions - Lower Priority */}
      {debugGuide.common_misconceptions && debugGuide.common_misconceptions.length > 0 && (
        <section id="misconceptions" className="space-y-3 scroll-mt-24">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <XCircle className="w-5 h-5 text-amber-500" />
            Common Misconceptions
          </h2>
          <div className="space-y-3">
            {debugGuide.common_misconceptions.map((misconception, idx) => (
              <div key={idx} className="border border-amber-500/20 bg-amber-500/5 p-4">
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

      {/* False Positive Cases - Lower Priority */}
      {debugGuide.false_positive_cases && debugGuide.false_positive_cases.length > 0 && (
        <section id="false-positives" className="space-y-3 scroll-mt-24">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <XCircle className="w-5 h-5 text-red-500" />
            False Positive Cases
          </h2>
          <div className="space-y-3">
            {debugGuide.false_positive_cases.map((fp, idx) => (
              <div key={idx} className="border border-red-500/20 bg-red-500/5 p-4">
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

      {/* Escalation Paths - Lower Priority */}
      {debugGuide.escalation_paths && debugGuide.escalation_paths.length > 0 && (
        <section id="escalation" className="space-y-3 scroll-mt-24">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <ArrowUpCircle className="w-5 h-5 text-blue-500" />
            Escalation Paths
          </h2>
          <div className="space-y-3">
            {debugGuide.escalation_paths.map((path, idx) => (
              <div key={idx} className="border border-blue-500/20 bg-blue-500/5 p-4">
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

      {/* Related Content & Knowledge Graph */}
      {allRelatedContent.length > 0 && (
        <RelatedContent items={allRelatedContent} />
      )}
      {shouldShowGraph && <KnowledgeGraphPanel nodes={graphNodes} />}

    </ContentPageLayout>
  );
}