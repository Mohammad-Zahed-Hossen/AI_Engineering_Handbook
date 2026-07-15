import { notFound } from 'next/navigation';
import { getPrinciple, getAllPrincipleIds } from '@/lib/data';
import ContentPageLayout from '@/components/shared/ContentPageLayout';
import MetadataBadges from '@/components/shared/MetadataBadges';
import RelatedContent from '@/components/shared/RelatedContent';
import ExpandableText from '@/components/shared/ExpandableText';
import { Prose } from '@/components/shared/Prose';
import { BookOpen, Brain, AlertTriangle, CheckCircle2, Link2, Lightbulb, ClipboardList, BarChart3, History } from 'lucide-react';
import ReadingSessionTracker from '@/components/shared/ReadingSessionTracker';
import EngineeringConsequenceCard from '@/components/principles/EngineeringConsequenceCard';
import ViolationWarningCard from '@/components/principles/ViolationWarningCard';
import AppearsInGroup from '@/components/principles/AppearsInGroup';
import MentalModelDisplay from '@/components/principles/MentalModelDisplay';
import DecisionChecklist from '@/components/principles/DecisionChecklist';
import MisconceptionRow from '@/components/principles/MisconceptionRow';
import TradeoffComparison from '@/components/principles/TradeoffComparison';

export async function generateStaticParams() {
  const ids = getAllPrincipleIds();
  return ids.map((id) => ({ id }));
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function PrinciplePage({ params }: PageProps) {
  const { id } = await params;
  const principle = getPrinciple(id);

  if (!principle) {
    notFound();
  }

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Principles', href: '/principles' },
    { label: principle.title },
  ];

  // Build TOC - only include sections that have data
  const toc = [
    { id: 'statement', label: 'Statement' },
    { id: 'intuition', label: 'Intuition' },
    ...(principle.mathematical_formulation ? [{ id: 'mathematical-formulation', label: 'Mathematical Formulation' }] : []),
    ...(principle.engineering_consequences && principle.engineering_consequences.length > 0 ? [{ id: 'engineering-consequences', label: 'Engineering Consequences' }] : []),
    ...(principle.common_violations && principle.common_violations.length > 0 ? [{ id: 'common-violations', label: 'Common Violations' }] : []),
    ...(principle.appears_in && principle.appears_in.length > 0 ? [{ id: 'appears-in', label: 'Appears In' }] : []),
    ...(principle.mental_model ? [{ id: 'mental-model', label: 'Mental Model' }] : []),
    ...(principle.tradeoffs ? [{ id: 'tradeoffs', label: 'Tradeoffs' }] : []),
    ...(principle.decision_checklist && principle.decision_checklist.length > 0 ? [{ id: 'decision-checklist', label: 'Decision Checklist' }] : []),
    ...(principle.misconceptions && principle.misconceptions.length > 0 ? [{ id: 'misconceptions', label: 'Misconceptions' }] : []),
    ...(principle.engineering_heuristic ? [{ id: 'engineering-heuristic', label: 'Engineering Heuristic' }] : []),
    ...(principle.historical_origin ? [{ id: 'historical-origin', label: 'Historical Origin' }] : []),
    ...(principle.implications && principle.implications.length > 0 ? [{ id: 'implications', label: 'Implications' }] : []),
    ...(principle.limitations && principle.limitations.length > 0 ? [{ id: 'limitations', label: 'Limitations' }] : []),
    ...(principle.related_concepts && principle.related_concepts.length > 0 ? [{ id: 'related-concepts', label: 'Related Concepts' }] : []),
  ];

  // Combine all related content
  const allRelatedContent = [
    ...principle.referenced_by_patterns.map(id => ({ id, type: 'pattern' as const, relationship_type: 'referenced_by_patterns' })),
    ...principle.referenced_by_models.map(id => ({ id, type: 'model' as const, relationship_type: 'referenced_by_models' })),
    ...principle.referenced_by_workflows.map(id => ({ id, type: 'workflow' as const, relationship_type: 'referenced_by_workflows' })),
  ];

  return (
    <ContentPageLayout breadcrumbs={breadcrumbs} toc={toc}>
      <ReadingSessionTracker href={`/principles/${principle.id}`} name={principle.title} type="principle" category={principle.category} />
      {/* Header */}
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold tracking-tight">{principle.title}</h1>
        <ExpandableText cacheKey={`principle-desc-${principle.id}`} fadeClass="from-background to-transparent">
          <Prose content={principle.description} className="text-muted-foreground" />
        </ExpandableText>
        <MetadataBadges
          type="principle"
          updatedAt={principle.updated_at}
          lastVerified={principle.last_verified}
          category={principle.category}
        />
      </div>

      {/* Statement */}
      <section id="statement" className="space-y-3 scroll-mt-24">
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-blue-500" />
          Statement
        </h2>
        <ExpandableText cacheKey={`principle-statement-${principle.id}`} fadeClass="from-background to-transparent">
          <Prose content={principle.statement} className="text-sm text-muted-foreground" />
        </ExpandableText>
      </section>

      {/* Intuition */}
      <section id="intuition" className="space-y-3 scroll-mt-24">
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Brain className="w-5 h-5 text-purple-500" />
          Intuition
        </h2>
        <ExpandableText cacheKey={`principle-intuition-${principle.id}`} fadeClass="from-background to-transparent">
          <Prose content={principle.intuition} className="text-sm text-muted-foreground" />
        </ExpandableText>
      </section>

      {/* Mathematical Formulation */}
      {principle.mathematical_formulation && (
        <section id="mathematical-formulation" className="space-y-3 scroll-mt-24">
          <h2 className="text-lg font-semibold text-foreground">Mathematical Formulation</h2>
          <div className="rounded-lg border border-border bg-card p-4">
            <Prose content={principle.mathematical_formulation} className="text-sm text-muted-foreground" />
          </div>
        </section>
      )}

      {/* Engineering Consequences */}
      {principle.engineering_consequences && principle.engineering_consequences.length > 0 && (
        <section id="engineering-consequences" className="space-y-3 scroll-mt-24">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            Engineering Consequences
          </h2>
          <div className="space-y-2">
            {principle.engineering_consequences.map((consequence, idx) => (
              <EngineeringConsequenceCard
                key={idx}
                title={consequence.title}
                explanation={consequence.explanation}
              />
            ))}
          </div>
        </section>
      )}

      {/* Common Violations */}
      {principle.common_violations && principle.common_violations.length > 0 && (
        <section id="common-violations" className="space-y-3 scroll-mt-24">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            Common Violations
          </h2>
          <div className="space-y-2">
            {principle.common_violations.map((violation, idx) => (
              <ViolationWarningCard
                key={idx}
                violation={violation.violation}
                symptoms={violation.symptoms}
                whyItHappens={violation.why_it_happens}
              />
            ))}
          </div>
        </section>
      )}

      {/* Appears In */}
      {principle.appears_in && principle.appears_in.length > 0 && (
        <section id="appears-in" className="space-y-3 scroll-mt-24">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Link2 className="w-5 h-5 text-blue-500" />
            Appears In
          </h2>
          <div className="space-y-2">
            {principle.appears_in.map((appearance, idx) => (
              <AppearsInGroup
                key={idx}
                domain={appearance.domain}
                examples={appearance.examples}
              />
            ))}
          </div>
        </section>
      )}

      {/* Mental Model */}
      {principle.mental_model && (
        <section id="mental-model" className="space-y-3 scroll-mt-24">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-purple-500" />
            Mental Model
          </h2>
          <MentalModelDisplay content={principle.mental_model} />
        </section>
      )}

      {/* Tradeoffs */}
      {principle.tradeoffs && (
        <section id="tradeoffs" className="space-y-3 scroll-mt-24">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-muted-foreground" />
            Tradeoffs
          </h2>
          <TradeoffComparison
            benefits={principle.tradeoffs.benefits}
            costs={principle.tradeoffs.costs}
          />
        </section>
      )}

      {/* Decision Checklist */}
      {principle.decision_checklist && principle.decision_checklist.length > 0 && (
        <section id="decision-checklist" className="space-y-3 scroll-mt-24">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-blue-500" />
            Decision Checklist
          </h2>
          <DecisionChecklist questions={principle.decision_checklist} />
        </section>
      )}

      {/* Misconceptions */}
      {principle.misconceptions && principle.misconceptions.length > 0 && (
        <section id="misconceptions" className="space-y-3 scroll-mt-24">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            Misconceptions
          </h2>
          <div className="space-y-2">
            {principle.misconceptions.map((misconception, idx) => (
              <MisconceptionRow
                key={idx}
                myth={misconception.myth}
                reality={misconception.reality}
              />
            ))}
          </div>
        </section>
      )}

      {/* Engineering Heuristic */}
      {principle.engineering_heuristic && (
        <section id="engineering-heuristic" className="space-y-3 scroll-mt-24">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-amber-500" />
            Engineering Heuristic
          </h2>
          <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-4">
            <p className="text-sm text-muted-foreground italic">"{principle.engineering_heuristic}"</p>
          </div>
        </section>
      )}

      {/* Historical Origin */}
      {principle.historical_origin && (
        <section id="historical-origin" className="space-y-3 scroll-mt-24">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <History className="w-5 h-5 text-muted-foreground" />
            Historical Origin
          </h2>
          <div className="rounded-lg border border-border bg-card p-4">
            <Prose content={principle.historical_origin} className="text-sm text-muted-foreground" />
          </div>
        </section>
      )}

      {/* Implications (Legacy) */}
      {principle.implications && principle.implications.length > 0 && (
        <section id="implications" className="space-y-3 scroll-mt-24">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            Implications
          </h2>
          <div className="space-y-2">
            {principle.implications.map((implication, idx) => (
              <div key={idx} className="rounded-lg border border-border bg-card p-4">
                <p className="text-sm text-muted-foreground">{implication}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Limitations */}
      {principle.limitations && principle.limitations.length > 0 && (
        <section id="limitations" className="space-y-3 scroll-mt-24">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            Limitations
          </h2>
          <div className="space-y-2">
            {principle.limitations.map((limitation, idx) => (
              <div key={idx} className="rounded-lg border border-orange-500/20 bg-orange-500/5 p-4">
                <p className="text-sm text-orange-700 dark:text-orange-400">{limitation}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Related Concepts */}
      {principle.related_concepts && principle.related_concepts.length > 0 && (
        <section id="related-concepts" className="space-y-3 scroll-mt-24">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Link2 className="w-5 h-5 text-blue-500" />
            Related Concepts
          </h2>
          <div className="flex flex-wrap gap-2">
            {principle.related_concepts.map((concept, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 rounded border border-border bg-muted px-3 py-1.5 text-xs text-muted-foreground"
              >
                {concept}
              </span>
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