import { notFound } from 'next/navigation';
import { getDecisionGuide, getAllDecisionGuideIds, getRelatedContent, getCanonicalRelationshipsForEntity, resolveGraphNodes, shouldRenderKnowledgeGraph } from '@/lib/data';
import ContentPageLayout from '@/components/shared/ContentPageLayout';
import MetadataBadges from '@/components/shared/MetadataBadges';
import RelatedContent from '@/components/shared/RelatedContent';
import DecisionOptionGrid from '@/components/shared/DecisionOptionGrid';
import ExpandableText from '@/components/shared/ExpandableText';
import { ProseClient } from '@/components/shared/Prose';
import { Scale, GitBranch, ArrowRight as ArrowRightIcon, Building2, BarChart3, AlertTriangle } from 'lucide-react';
import ReadingSessionTracker from '@/components/shared/ReadingSessionTracker';
import FavoriteButton from '@/components/shared/FavoriteButton';
import DecisionSnapshot from '@/components/shared/DecisionSnapshot';
import DecisionMatrix from '@/components/shared/DecisionMatrix';
import ConstraintRecommendations from '@/components/shared/ConstraintRecommendations';
import HiddenCosts from '@/components/shared/HiddenCosts';
import DecisionTree from '@/components/shared/DecisionTree';
import HybridStrategyComponent from '@/components/shared/HybridStrategy';
import MigrationPath from '@/components/shared/MigrationPath';
import ProductionExamples from '@/components/shared/ProductionExamples';
import PhaseDivider from '@/components/shared/PhaseDivider';
import CollapsibleSection from '@/components/shared/CollapsibleSection';
import SectionSummary from '@/components/shared/SectionSummary';
import TradeoffHeatmap from '@/components/shared/TradeoffHeatmap';
import KnowledgeGraphPanel from '@/components/shared/KnowledgeGraphPanel';


export async function generateStaticParams() {
  const ids = getAllDecisionGuideIds();
  return ids.map((id) => ({ id }));
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function DecisionGuidePage({ params }: PageProps) {
  const { id } = await params;
  const decisionGuide = getDecisionGuide(id);

  if (!decisionGuide) {
    notFound();
  }

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Decision Guides', href: '/decision-guides' },
    { label: decisionGuide.title },
  ];

  // Check if any option has hidden costs for TOC
  const hasHiddenCosts = decisionGuide.options?.some(opt => opt.hidden_costs && opt.hidden_costs.length > 0);
  
  // Build TOC dynamically based on available sections
  const toc = [
    ...(decisionGuide.default_recommendation || decisionGuide.one_sentence_summary 
      ? [{ id: 'decision-snapshot', label: 'Decision Snapshot' }] 
      : []),
    { id: 'problem', label: 'Problem' },
    ...(decisionGuide.decision_matrix && decisionGuide.decision_matrix.length > 0 
      ? [{ id: 'decision-matrix', label: 'Decision Matrix' }] 
      : []),
    ...(decisionGuide.tradeoff_analysis && decisionGuide.tradeoff_analysis.length > 0 
      ? [{ id: 'tradeoff-analysis', label: 'Tradeoff Analysis' }] 
      : []),
    ...(decisionGuide.evaluation_criteria && decisionGuide.evaluation_criteria.length > 0 
      ? [{ id: 'evaluation-criteria', label: 'Evaluation Criteria' }] 
      : []),
    ...(decisionGuide.constraint_recommendations && decisionGuide.constraint_recommendations.length > 0 
      ? [{ id: 'constraint-recommendations', label: 'Constraint Recommendations' }] 
      : []),
    { id: 'options', label: 'Options' },
    ...(hasHiddenCosts
      ? [{ id: 'hidden-costs', label: 'Hidden Costs' }] 
      : []),
    { id: 'recommendations', label: 'Recommendations' },
    ...(decisionGuide.decision_tree && decisionGuide.decision_tree.length > 0 
      ? [{ id: 'decision-tree', label: 'Decision Tree' }] 
      : []),
    ...(decisionGuide.hybrid_strategy ? [{ id: 'hybrid-strategy', label: 'Hybrid Strategy' }] : []),
    ...(decisionGuide.migration_path && decisionGuide.migration_path.length > 0 
      ? [{ id: 'migration-path', label: 'Migration Path' }] 
      : []),
    ...(decisionGuide.production_examples && decisionGuide.production_examples.length > 0 
      ? [{ id: 'production-examples', label: 'Production Examples' }] 
      : []),
    ...(decisionGuide.common_mistakes && decisionGuide.common_mistakes.length > 0 
      ? [{ id: 'common-mistakes', label: 'Common Mistakes' }] 
      : []),
  ];

  const allRelatedContent = getRelatedContent('decision_guide', decisionGuide.id);
  const rawGraphItems = getCanonicalRelationshipsForEntity('decision_guide', decisionGuide.id);
  const graphNodes = resolveGraphNodes(rawGraphItems, 'decision_guide', decisionGuide.id).filter(n => n.type !== 'package_task');
  const shouldShowGraph = shouldRenderKnowledgeGraph(allRelatedContent, graphNodes);

  return (
    <ContentPageLayout breadcrumbs={breadcrumbs} toc={toc}>
      <ReadingSessionTracker id={decisionGuide.id} href={`/decision-guides/${decisionGuide.id}`} name={decisionGuide.title} type="decision_guide" category={decisionGuide.category} />
      
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-semibold tracking-tight">{decisionGuide.title}</h1>
            <ExpandableText cacheKey={`decision-desc-${decisionGuide.id}`} fadeClass="from-background to-transparent">
              <ProseClient content={decisionGuide.description} className="text-muted-foreground" />
            </ExpandableText>
            <MetadataBadges
              type="decision_guide"
              updatedAt={decisionGuide.updated_at}
              lastVerified={decisionGuide.last_verified}
              category={decisionGuide.category}
            />
          </div>
          <FavoriteButton type="decision_guide" id={decisionGuide.id} name={decisionGuide.title} href={`/decision-guides/${decisionGuide.id}`} />
        </div>
      </div>

      {/* OVERVIEW PHASE */}
      <PhaseDivider label="Overview" />

      {/* Decision Snapshot */}
      <DecisionSnapshot guide={decisionGuide} />

      {/* Problem */}
      <section id="problem" className="space-y-3 scroll-mt-24">
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Scale className="w-5 h-5 text-blue-500" />
          Problem
        </h2>
        <ExpandableText cacheKey={`decision-prob-${decisionGuide.id}`} fadeClass="from-background to-transparent">
          <ProseClient content={decisionGuide.problem} className="text-sm text-muted-foreground" />
        </ExpandableText>
      </section>

      {/* COMPARE PHASE */}
      <PhaseDivider label="Compare" />

      {/* Decision Matrix */}
      <DecisionMatrix matrix={decisionGuide.decision_matrix || []} />

      {/* Tradeoff Analysis - Collapsible */}
      {decisionGuide.tradeoff_analysis && decisionGuide.tradeoff_analysis.length > 0 && (
        <section id="tradeoff-analysis" className="scroll-mt-24">
          <CollapsibleSection 
            title="Tradeoff Analysis" 
            icon={<BarChart3 className="w-5 h-5 text-blue-500" />}
            defaultOpen={false}
            cacheKey={`tradeoff-analysis-${decisionGuide.id}`}
          >
            <SectionSummary 
              points={decisionGuide.tradeoff_analysis?.slice(0, 2).map(t => t.criterion) || []}
            />
            <TradeoffHeatmap tradesoffs={decisionGuide.tradeoff_analysis} />
          </CollapsibleSection>
        </section>
      )}

      {/* Evaluation Criteria - Collapsible */}
      {decisionGuide.evaluation_criteria && decisionGuide.evaluation_criteria.length > 0 && (
        <section id="evaluation-criteria" className="scroll-mt-24">
          <CollapsibleSection 
            title="Evaluation Criteria" 
            icon={<BarChart3 className="w-5 h-5 text-blue-500" />}
            defaultOpen={false}
            cacheKey={`evaluation-criteria-${decisionGuide.id}`}
          >
            <SectionSummary 
              points={decisionGuide.evaluation_criteria?.slice(0, 2).map(c => c.criterion) || []}
            />
            <div className="space-y-2">
              {decisionGuide.evaluation_criteria.map((criteria, idx) => (
                <div key={idx} className="rounded-lg border border-border bg-card p-3 flex items-start gap-3">
                  <div className="shrink-0 w-8 h-8 flex items-center justify-center rounded bg-primary/10 text-primary text-[10px] font-bold font-mono">
                    {criteria.weight}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{criteria.criterion}</p>
                    {criteria.description && (
                      <p className="text-xs text-muted-foreground mt-0.5">{criteria.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CollapsibleSection>
        </section>
      )}

      {/* Constraint Based Recommendations - Always visible (actionable) */}
      <ConstraintRecommendations recommendations={decisionGuide.constraint_recommendations || []} />

      {/* Options */}
      <section id="options" className="space-y-3 scroll-mt-24">
        <h2 className="text-lg font-semibold text-foreground">Options</h2>
        <DecisionOptionGrid options={decisionGuide.options} />
      </section>

      {/* Hidden Costs - Dedicated section (critical for decision) */}
      <HiddenCosts options={decisionGuide.options} />

      {/* DECIDE PHASE */}
      <PhaseDivider label="Decide" />

      {/* Recommendations */}
      <section id="recommendations" className="space-y-3 scroll-mt-24">
        <h2 className="text-lg font-semibold text-foreground">Recommendations</h2>
        <div className="rounded-lg border border-border bg-card p-4">
          <ProseClient content={decisionGuide.recommendations} className="text-sm text-muted-foreground" />
        </div>
      </section>

      {/* Decision Tree */}
      <DecisionTree tree={decisionGuide.decision_tree || []} />

      {/* IMPLEMENT PHASE */}
      <PhaseDivider label="Implement" />

      {/* Hybrid Strategy - Collapsible */}
      {decisionGuide.hybrid_strategy && (
        <section id="hybrid-strategy" className="scroll-mt-24">
          <CollapsibleSection 
            title="Hybrid Strategy" 
            icon={<GitBranch className="w-5 h-5 text-blue-500" />}
            defaultOpen={false}
            cacheKey={`hybrid-strategy-${decisionGuide.id}`}
          >
            <SectionSummary 
              points={[
                decisionGuide.hybrid_strategy?.when_both_wins?.split('.')[0] || '',
                decisionGuide.hybrid_strategy?.architecture_overview?.split('.')[0] || ''
              ].filter(Boolean)}
            />
            <HybridStrategyComponent strategy={decisionGuide.hybrid_strategy} />
          </CollapsibleSection>
        </section>
      )}

      {/* Migration Path - Collapsible */}
      {decisionGuide.migration_path && decisionGuide.migration_path.length > 0 && (
        <section id="migration-path" className="scroll-mt-24">
          <CollapsibleSection 
            title="Migration Path" 
            icon={<ArrowRightIcon className="w-5 h-5 text-blue-500" />}
            defaultOpen={false}
            cacheKey={`migration-path-${decisionGuide.id}`}
          >
            <SectionSummary 
              points={decisionGuide.migration_path?.slice(0, 2).map(s => s.step) || []}
            />
            <MigrationPath steps={decisionGuide.migration_path} />
          </CollapsibleSection>
        </section>
      )}

      {/* Production Examples - Collapsible */}
      {decisionGuide.production_examples && decisionGuide.production_examples.length > 0 && (
        <section id="production-examples" className="scroll-mt-24">
          <CollapsibleSection 
            title="Production Examples" 
            icon={<Building2 className="w-5 h-5 text-blue-500" />}
            defaultOpen={false}
            cacheKey={`production-examples-${decisionGuide.id}`}
          >
            <SectionSummary 
              points={decisionGuide.production_examples?.slice(0, 2).map(e => e.system) || []}
            />
            <ProductionExamples examples={decisionGuide.production_examples} />
          </CollapsibleSection>
        </section>
      )}

      {/* Common Mistakes - Collapsible */}
      {decisionGuide.common_mistakes && decisionGuide.common_mistakes.length > 0 && (
        <section id="common-mistakes" className="scroll-mt-24">
          <CollapsibleSection 
            title="Common Engineering Mistakes" 
            icon={<AlertTriangle className="w-5 h-5 text-blue-500" />}
            defaultOpen={false}
            cacheKey={`common-mistakes-${decisionGuide.id}`}
          >
            <SectionSummary 
              points={decisionGuide.common_mistakes?.slice(0, 2) || []}
            />
            <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-4">
              <ul className="space-y-1">
                {decisionGuide.common_mistakes.map((mistake, idx) => (
                  <li key={idx} className="text-xs text-muted-foreground pl-3 relative before:content-['✗'] before:absolute before:left-0 before:text-red-500">
                    {mistake}
                  </li>
                ))}
              </ul>
            </div>
          </CollapsibleSection>
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