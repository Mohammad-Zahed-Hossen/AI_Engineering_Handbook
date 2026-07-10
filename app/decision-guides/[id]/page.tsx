import { notFound } from 'next/navigation';
import { getDecisionGuide, getAllDecisionGuideIds } from '@/lib/data';
import ContentPageLayout from '@/components/shared/ContentPageLayout';
import MetadataBadges from '@/components/shared/MetadataBadges';
import RelatedContent from '@/components/shared/RelatedContent';
import DecisionOptionGrid from '@/components/shared/DecisionOptionGrid';
import ExpandableText from '@/components/shared/ExpandableText';
import { Scale, ArrowRight, Link as LinkIcon } from 'lucide-react';
import Link from 'next/link';

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

  const toc = [
    { id: 'problem', label: 'Problem' },
    { id: 'evaluation-criteria', label: 'Evaluation Criteria' },
    { id: 'options', label: 'Options' },
    ...(decisionGuide.comparison_table ? [{ id: 'comparison-table', label: 'Comparison Table' }] : []),
    { id: 'recommendations', label: 'Recommendations' },
    ...(decisionGuide.use_cases && decisionGuide.use_cases.length > 0 ? [{ id: 'use-cases', label: 'Use Cases' }] : []),
  ];

  // Combine all related content
  const allRelatedContent = [
    ...decisionGuide.related_workflows.map(r => ({ ...r, type: 'workflow' as const })),
    ...decisionGuide.related_packages.map(r => ({ ...r, type: 'package' as const })),
    ...decisionGuide.related_models.map(r => ({ ...r, type: 'model' as const })),
  ];

  return (
    <ContentPageLayout breadcrumbs={breadcrumbs} toc={toc}>
      {/* Header */}
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold tracking-tight">{decisionGuide.title}</h1>
        <ExpandableText cacheKey={`decision-desc-${decisionGuide.id}`} fadeClass="from-background to-transparent">
          <p className="text-muted-foreground">{decisionGuide.description}</p>
        </ExpandableText>
        <MetadataBadges
          type="decision_guide"
          updatedAt={decisionGuide.updated_at}
          lastVerified={decisionGuide.last_verified}
          category={decisionGuide.category}
        />
      </div>

      {/* Problem */}
      <section id="problem" className="space-y-3 scroll-mt-24">
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Scale className="w-5 h-5 text-blue-500" />
          Problem
        </h2>
        <ExpandableText cacheKey={`decision-prob-${decisionGuide.id}`} fadeClass="from-background to-transparent">
          <p className="text-sm text-muted-foreground">{decisionGuide.problem}</p>
        </ExpandableText>
      </section>

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
            <table className="w-full text-sm">
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

      {/* Recommendations */}
      <section id="recommendations" className="space-y-3 scroll-mt-24">
        <h2 className="text-lg font-semibold text-foreground">Recommendations</h2>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">{decisionGuide.recommendations}</p>
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
