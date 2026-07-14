import { notFound } from 'next/navigation';
import { getPattern, getAllPatternIds } from '@/lib/data';
import ContentPageLayout from '@/components/shared/ContentPageLayout';
import MetadataBadges from '@/components/shared/MetadataBadges';
import RelatedContent from '@/components/shared/RelatedContent';
import ExpandableText from '@/components/shared/ExpandableText';
import { Prose } from '@/components/shared/Prose';
import { CodeBlock } from '@/components/shared/CodeBlock';
import { Lightbulb, AlertTriangle, Code, Layers } from 'lucide-react';
import ReadingSessionTracker from '@/components/shared/ReadingSessionTracker';
import DecisionSummary from '@/components/shared/DecisionSummary';
import PatternSnapshot from '@/components/shared/PatternSnapshot';
import TradeoffTable from '@/components/shared/TradeoffTable';
import DecisionFlow from '@/components/shared/DecisionFlow';
import VisualTrainingLoop from '@/components/shared/VisualTrainingLoop';
import AntiPatternCard from '@/components/shared/AntiPatternCard';
import VariationCard from '@/components/shared/VariationCard';
import RelatedPatternGraph from '@/components/shared/RelatedPatternGraph';

export async function generateStaticParams() {
  const ids = getAllPatternIds();
  return ids.map((id) => ({ id }));
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function PatternPage({ params }: PageProps) {
  const { id } = await params;
  const pattern = getPattern(id);

  if (!pattern) {
    notFound();
  }

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Patterns', href: '/patterns' },
    { label: pattern.title },
  ];

  const toc = [
    { id: 'decision-summary', label: 'Decision Summary' },
    { id: 'pattern-snapshot', label: 'Pattern Snapshot' },
    ...(pattern.tradeoffs && pattern.tradeoffs.length > 0 ? [{ id: 'tradeoffs', label: 'Tradeoffs' }] : []),
    ...(pattern.decision_flow && pattern.decision_flow.length > 0 ? [{ id: 'decision-flow', label: 'Decision Flow' }] : []),
    { id: 'concept', label: 'Concept' },
    { id: 'applicability', label: 'Applicability' },
    ...(pattern.implementation_notes ? [{ id: 'implementation-notes', label: 'Implementation Notes' }] : []),
    ...(pattern.examples && pattern.examples.length > 0 ? [{ id: 'examples', label: 'Examples' }] : []),
    ...(pattern.anti_patterns && pattern.anti_patterns.length > 0 ? [{ id: 'anti-patterns', label: 'Anti-Patterns' }] : []),
    ...(pattern.variations && pattern.variations.length > 0 ? [{ id: 'variations', label: 'Variations' }] : []),
  ];

  // Combine all related content
  const allRelatedContent = [
    ...pattern.related_workflows.map(id => ({ id, type: 'workflow' as const, relationship_type: 'related_workflows' })),
    ...pattern.related_models.map(id => ({ id, type: 'model' as const, relationship_type: 'related_models' })),
    ...pattern.related_packages.map(id => ({ id, type: 'package' as const, relationship_type: 'related_packages' })),
    ...pattern.related_principles.map(id => ({ id, type: 'principle' as const, relationship_type: 'related_principles' })),
    ...pattern.related_debug_guides.map(id => ({ id, type: 'debug_guide' as const, relationship_type: 'related_debug_guides' })),
  ];

  return (
    <ContentPageLayout breadcrumbs={breadcrumbs} toc={toc}>
      <ReadingSessionTracker href={`/patterns/${pattern.id}`} name={pattern.title} type="pattern" />
      {/* Header */}
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold tracking-tight">{pattern.title}</h1>
        <ExpandableText cacheKey={`pattern-desc-${pattern.id}`} fadeClass="from-background to-transparent">
          <Prose content={pattern.description} className="text-muted-foreground" />
        </ExpandableText>
        <MetadataBadges
          type="pattern"
          updatedAt={pattern.updated_at}
          lastVerified={pattern.last_verified}
          category={pattern.category}
          difficulty={pattern.difficulty}
          domain={pattern.domain}
          engineeringArea={pattern.engineering_area}
        />
      </div>

      {/* Decision Summary */}
      {pattern.decision_summary && (
        <section id="decision-summary" className="scroll-mt-24">
          <DecisionSummary
            whenToUse={pattern.decision_summary.when_to_use}
            dontUse={pattern.decision_summary.dont_use}
            tradeoff={pattern.decision_summary.tradeoff}
          />
        </section>
      )}

      {/* Pattern Snapshot */}
      {pattern.pattern_snapshot && (
        <section id="pattern-snapshot" className="scroll-mt-24">
          <PatternSnapshot
            primaryGoal={pattern.pattern_snapshot.primary_goal}
            primaryConstraint={pattern.pattern_snapshot.primary_constraint}
            effectiveBatch={pattern.pattern_snapshot.effective_batch}
            typicalUsage={pattern.pattern_snapshot.typical_usage}
          />
        </section>
      )}

      {/* Tradeoffs */}
      {pattern.tradeoffs && pattern.tradeoffs.length > 0 && (
        <section id="tradeoffs" className="scroll-mt-24">
          <TradeoffTable tradeoffs={pattern.tradeoffs} />
        </section>
      )}

      {/* Decision Flow */}
      {pattern.decision_flow && pattern.decision_flow.length > 0 && (
        <section id="decision-flow" className="scroll-mt-24">
          <DecisionFlow steps={pattern.decision_flow} />
        </section>
      )}

      {/* Concept */}
      <section id="concept" className="space-y-3 scroll-mt-24">
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-yellow-500" />
          Concept
        </h2>
        <ExpandableText cacheKey={`pattern-concept-${pattern.id}`} fadeClass="from-background to-transparent">
          <Prose content={pattern.concept} className="text-sm text-muted-foreground" />
        </ExpandableText>
      </section>

      {/* Applicability */}
      <section id="applicability" className="space-y-3 scroll-mt-24">
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Layers className="w-5 h-5 text-blue-500" />
          Applicability
        </h2>
        <ExpandableText cacheKey={`pattern-app-${pattern.id}`} fadeClass="from-background to-transparent">
          <Prose content={pattern.applicability} className="text-sm text-muted-foreground" />
        </ExpandableText>
      </section>

      {/* Implementation Notes */}
      {pattern.implementation_notes && (
        <section id="implementation-notes" className="space-y-3 scroll-mt-24">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Code className="w-5 h-5 text-purple-500" />
            Implementation Notes
          </h2>
          <ExpandableText cacheKey={`pattern-impl-${pattern.id}`} fadeClass="from-background to-transparent">
            <Prose content={pattern.implementation_notes} className="text-sm text-muted-foreground" />
          </ExpandableText>
        </section>
      )}

      {/* Examples */}
      {pattern.examples && pattern.examples.length > 0 && (
        <section id="examples" className="space-y-3 scroll-mt-24">
          <h2 className="text-lg font-semibold text-foreground">Examples</h2>
          <div className="space-y-2">
            {pattern.examples.map((example, idx) => (
              <div key={idx} className="rounded-lg border border-border bg-card p-4">
                <CodeBlock code={example} language="text" />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Anti-Patterns */}
      {pattern.anti_patterns && pattern.anti_patterns.length > 0 && (
        <section id="anti-patterns" className="space-y-3 scroll-mt-24">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            Anti-Patterns
          </h2>
          <div className="space-y-2">
            {pattern.anti_patterns.map((antiPattern, idx) => (
              <AntiPatternCard key={idx} antiPattern={antiPattern} />
            ))}
          </div>
        </section>
      )}

      {/* Variations */}
      {pattern.variations && pattern.variations.length > 0 && (
        <section id="variations" className="space-y-3 scroll-mt-24">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-500" />
            Variations
          </h2>
          <div className="space-y-3">
            {pattern.variations.map((variation, idx) => (
              <VariationCard key={idx} variation={variation} />
            ))}
          </div>
        </section>
      )}

      {/* Related Pattern Graph */}
      {allRelatedContent.length > 0 && (
        <RelatedPatternGraph patternId={pattern.id} relatedPatterns={allRelatedContent} />
      )}

      {/* Related Content */}
      {allRelatedContent.length > 0 && (
        <RelatedContent items={allRelatedContent} />
      )}
    </ContentPageLayout>
  );
}
