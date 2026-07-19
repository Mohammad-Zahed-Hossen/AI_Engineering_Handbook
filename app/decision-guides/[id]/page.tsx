import { notFound } from 'next/navigation';
import { getDecisionGuide, getAllDecisionGuideIds } from '@/lib/data';
import ContentPageLayout from '@/components/shared/ContentPageLayout';
import MetadataBadges from '@/components/shared/MetadataBadges';
import RelatedContent from '@/components/shared/RelatedContent';
import DecisionOptionGrid from '@/components/shared/DecisionOptionGrid';
import ExpandableText from '@/components/shared/ExpandableText';
import { Prose } from '@/components/shared/Prose';
import { Scale, ArrowRight, Link as LinkIcon, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import ReadingSessionTracker from '@/components/shared/ReadingSessionTracker';
import DecisionGuideSummary from '@/components/shared/DecisionGuideSummary';
import DecisionMatrix from '@/components/shared/DecisionMatrix';
import ConstraintRecommendations from '@/components/shared/ConstraintRecommendations';
import TradeoffHeatmap from '@/components/shared/TradeoffHeatmap';
import HiddenCosts from '@/components/shared/HiddenCosts';
import DecisionTree from '@/components/shared/DecisionTree';
import HybridStrategyComponent from '@/components/shared/HybridStrategy';
import MigrationPath from '@/components/shared/MigrationPath';
import ProductionExamples from '@/components/shared/ProductionExamples';

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

  // Build TOC dynamically based on available sections
  const toc = [
    ...(decisionGuide.default_recommendation || decisionGuide.one_sentence_summary 
      ? [{ id: 'decision-summary', label: 'Decision Summary' }] 
      : []),
    { id: 'problem', label: 'Problem' },
    ...(decisionGuide.assumptions && decisionGuide.assumptions.length > 0 
      ? [{ id: 'engineering-context', label: 'Engineering Context' }] 
      : []),
    ...(decisionGuide.decision_matrix && decisionGuide.decision_matrix.length > 0 
      ? [{ id: 'decision-matrix', label: 'Decision Matrix' }] 
      : []),
    ...(decisionGuide.constraint_recommendations && decisionGuide.constraint_recommendations.length > 0 
      ? [{ id: 'constraint-recommendations', label: 'Constraint Recommendations' }] 
      : []),
    { id: 'evaluation-criteria', label: 'Evaluation Criteria' },
    { id: 'options', label: 'Options' },
    ...(decisionGuide.comparison_table ? [{ id: 'comparison-table', label: 'Comparison Table' }] : []),
    ...(decisionGuide.tradeoff_analysis && decisionGuide.tradeoff_analysis.length > 0 
      ? [{ id: 'tradeoff-analysis', label: 'Tradeoff Analysis' }] 
      : []),
    { id: 'recommendations', label: 'Recommendations' },
    ...(decisionGuide.use_cases && decisionGuide.use_cases.length > 0 ? [{ id: 'use-cases', label: 'Use Cases' }] : []),
    ...(decisionGuide.common_mistakes && decisionGuide.common_mistakes.length > 0 
      ? [{ id: 'common-mistakes', label: 'Common Mistakes' }] 
      : []),
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
  ];

  // Combine all related content
  const allRelatedContent = [
    ...decisionGuide.related_workflows.map(id => ({ id, type: 'workflow' as const, relationship_type: 'related_workflows' })),
    ...decisionGuide.related_packages.map(id => ({ id, type: 'package' as const, relationship_type: 'related_packages' })),
    ...decisionGuide.related_models.map(id => ({ id, type: 'model' as const, relationship_type: 'related_models' })),
  ];

  return (
    <ContentPageLayout breadcrumbs={breadcrumbs} toc={toc}>
      <ReadingSessionTracker href={`/decision-guides/${decisionGuide.id}`} name={decisionGuide.title} type="decision_guide" category={decisionGuide.category} />
      
      {/* Header */}
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold tracking-tight">{decisionGuide.title}</h1>
        <ExpandableText cacheKey={`decision-desc-${decisionGuide.id}`} fadeClass="from-background to-transparent">
          <Prose content={decisionGuide.description} className="text-muted-foreground" />
        </ExpandableText>
        <MetadataBadges
          type="decision_guide"
          updatedAt={decisionGuide.updated_at}
          lastVerified={decisionGuide.last_verified}
          category={decisionGuide.category}
        />
      </div>

      {/* Decision Summary */}
      <DecisionGuideSummary guide={decisionGuide} />

      {/* Problem */}
      <section id="problem" className="space-y-3 scroll-mt-24">
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Scale className="w-5 h-5 text-blue-500" />
          Problem
        </h2>
        <ExpandableText cacheKey={`decision-prob-${decisionGuide.id}`} fadeClass="from-background to-transparent">
          <Prose content={decisionGuide.problem} className="text-sm text-muted-foreground" />
        </ExpandableText>
      </section>

      {/* Engineering Context */}
      {(decisionGuide.assumptions && decisionGuide.assumptions.length > 0) || decisionGuide.scope || (decisionGuide.out_of_scope && decisionGuide.out_of_scope.length > 0) ? (
        <section id="engineering-context" className="space-y-3 scroll-mt-24">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Scale className="w-5 h-5 text-blue-500" />
            Engineering Context
          </h2>
          
          {decisionGuide.assumptions && decisionGuide.assumptions.length > 0 && (
            <div className="rounded-lg border border-border bg-card p-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-2">
                Assumptions
              </span>
              <ul className="space-y-1">
                {decisionGuide.assumptions.map((assumption, idx) => (
                  <li key={idx} className="text-xs text-muted-foreground pl-3 relative before:content-['•'] before:absolute before:left-0">
                    {assumption}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {decisionGuide.scope && (
            <div className="rounded-lg border border-border bg-card p-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                Scope
              </span>
              <p className="text-sm text-muted-foreground">{decisionGuide.scope}</p>
            </div>
          )}

          {decisionGuide.out_of_scope && decisionGuide.out_of_scope.length > 0 && (
            <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 block mb-2">
                Out of Scope
              </span>
              <ul className="space-y-1">
                {decisionGuide.out_of_scope.map((item, idx) => (
                  <li key={idx} className="text-xs text-muted-foreground pl-3 relative before:content-['✗'] before:absolute before:left-0 before:text-amber-500">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      ) : null}

      {/* Decision Matrix */}
      <DecisionMatrix matrix={decisionGuide.decision_matrix || []} />

      {/* Constraint Based Recommendations */}
      <ConstraintRecommendations recommendations={decisionGuide.constraint_recommendations || []} />

      {/* Evaluation Criteria */}
      <section id="evaluation-criteria" className="space-y-3 scroll-mt-24">
        <h2 className="text-lg font-semibold text-foreground">Evaluation Criteria</h2>
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
      </section>

      {/* Options */}
      <section id="options" className="space-y-3 scroll-mt-24">
        <h2 className="text-lg font-semibold text-foreground">Options</h2>
        <DecisionOptionGrid options={decisionGuide.options} />
      </section>

      {/* Comparison Table */}
      {decisionGuide.comparison_table && (
        <section id="comparison-table" className="space-y-3 scroll-mt-24">
          <h2 className="text-lg font-semibold text-foreground">Comparison Table</h2>
          <div className="rounded-lg border border-border bg-card overflow-x-auto">
            <table className="w-full text-sm comparison-table">
              <tbody>
                {Object.entries(decisionGuide.comparison_table).map(([key, value], idx) => (
                  <tr key={idx} className="border-t border-border last:border-0">
                    <td className="px-4 py-3 font-medium text-foreground bg-muted/30 w-1/3">
                      {key}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Tradeoff Analysis */}
      <TradeoffHeatmap tradesoffs={decisionGuide.tradeoff_analysis || []} />

      {/* Hidden Costs */}
      <HiddenCosts options={decisionGuide.options} />

      {/* Recommendations */}
      <section id="recommendations" className="space-y-3 scroll-mt-24">
        <h2 className="text-lg font-semibold text-foreground">Recommendations</h2>
        <div className="rounded-lg border border-border bg-card p-4">
          <Prose content={decisionGuide.recommendations} className="text-sm text-muted-foreground" />
        </div>
      </section>

      {/* Use Cases */}
      {decisionGuide.use_cases && decisionGuide.use_cases.length > 0 && (
        <section id="use-cases" className="space-y-3 scroll-mt-24">
          <h2 className="text-lg font-semibold text-foreground">Use Cases</h2>
          <div className="flex flex-wrap gap-2">
            {decisionGuide.use_cases.map((useCase, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 rounded border border-border bg-muted px-3 py-1.5 text-xs text-muted-foreground"
              >
                <LinkIcon className="w-3 h-3" />
                {useCase}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Common Engineering Mistakes */}
      {decisionGuide.common_mistakes && decisionGuide.common_mistakes.length > 0 && (
        <section id="common-mistakes" className="space-y-3 scroll-mt-24">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-blue-500" />
            Common Engineering Mistakes
          </h2>
          <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-4">
            <ul className="space-y-1">
              {decisionGuide.common_mistakes.map((mistake, idx) => (
                <li key={idx} className="text-xs text-muted-foreground pl-3 relative before:content-['✗'] before:absolute before:left-0 before:text-red-500">
                  {mistake}
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Decision Tree */}
      <DecisionTree tree={decisionGuide.decision_tree || []} />

      {/* Hybrid Strategy */}
      <HybridStrategyComponent strategy={decisionGuide.hybrid_strategy} />

      {/* Migration Path */}
      <MigrationPath steps={decisionGuide.migration_path || []} />

      {/* Production Examples */}
      <ProductionExamples examples={decisionGuide.production_examples || []} />

      {/* Compare Models Link */}
      {decisionGuide.related_model_subcategory && (
        <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
          <Link
            href={`/models/${decisionGuide.related_model_subcategory.category}/compare/${decisionGuide.related_model_subcategory.subcategory}`}
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            Compare Models in {decisionGuide.related_model_subcategory.subcategory}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      {/* Related Content */}
      {allRelatedContent.length > 0 && (
        <RelatedContent items={allRelatedContent} />
      )}
    </ContentPageLayout>
  );
}