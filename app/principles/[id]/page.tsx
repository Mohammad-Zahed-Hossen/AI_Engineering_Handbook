import { notFound } from 'next/navigation';
import { getPrinciple, getAllPrincipleIds } from '@/lib/data';
import ContentPageLayout from '@/components/shared/ContentPageLayout';
import MetadataBadges from '@/components/shared/MetadataBadges';
import RelatedContent from '@/components/shared/RelatedContent';
import ExpandableText from '@/components/shared/ExpandableText';
import { ProseClient } from '@/components/shared/Prose';
import { BookOpen, Brain, AlertTriangle, CheckCircle2, Link2, Lightbulb, ClipboardList, BarChart3, History } from 'lucide-react';
import ReadingSessionTracker from '@/components/shared/ReadingSessionTracker';
import EngineeringConsequenceCard from '@/components/principles/EngineeringConsequenceCard';
import ViolationWarningCard from '@/components/principles/ViolationWarningCard';
import AppearsInGroup from '@/components/principles/AppearsInGroup';
import MentalModelDisplay from '@/components/principles/MentalModelDisplay';
import DecisionChecklist from '@/components/principles/DecisionChecklist';
import MisconceptionRow from '@/components/principles/MisconceptionRow';
import TradeoffComparison from '@/components/principles/TradeoffComparison';
import CollapsibleSection from '@/components/shared/CollapsibleSection';
import PhaseDivider from '@/components/shared/PhaseDivider';
import Callout from '@/components/shared/Callout';

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

  // Build TOC - organized by thematic blocks
  const toc = [
    { id: 'core-understanding', label: 'Core Understanding' },
    { id: 'statement', label: 'Statement' },
    { id: 'intuition', label: 'Intuition' },
    ...(principle.mental_model ? [{ id: 'mental-model', label: 'Mental Model' }] : []),
    { id: 'engineering-impact', label: 'Engineering Impact' },
    ...(principle.engineering_consequences && principle.engineering_consequences.length > 0 
      ? [{ id: 'engineering-consequences', label: 'Engineering Consequences' }] : []),
    ...(principle.engineering_heuristic ? [{ id: 'engineering-heuristic', label: 'Engineering Heuristic' }] : []),
    { id: 'application', label: 'Application' },
    ...(principle.decision_checklist && principle.decision_checklist.length > 0 
      ? [{ id: 'decision-checklist', label: 'Decision Checklist' }] : []),
    ...(principle.appears_in && principle.appears_in.length > 0 
      ? [{ id: 'appears-in', label: 'Appears In' }] : []),
    ...(principle.tradeoffs ? [{ id: 'tradeoffs', label: 'Tradeoffs' }] : []),
    { id: 'pitfalls', label: 'Pitfalls' },
    ...(principle.common_violations && principle.common_violations.length > 0 
      ? [{ id: 'common-violations', label: 'Common Violations' }] : []),
    ...(principle.misconceptions && principle.misconceptions.length > 0 
      ? [{ id: 'misconceptions', label: 'Misconceptions' }] : []),
    ...(principle.limitations && principle.limitations.length > 0 
      ? [{ id: 'limitations', label: 'Limitations' }] : []),
    { id: 'reference', label: 'Reference' },
    ...(principle.mathematical_formulation ? [{ id: 'mathematical-formulation', label: 'Mathematical Formulation' }] : []),
    ...(principle.historical_origin ? [{ id: 'historical-origin', label: 'Historical Origin' }] : []),
    ...(principle.implications && principle.implications.length > 0 
      ? [{ id: 'implications', label: 'Implications' }] : []),
    ...(principle.related_concepts && principle.related_concepts.length > 0 
      ? [{ id: 'related-concepts', label: 'Related Concepts' }] : []),
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
      
      {/* Header - Hero section */}
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold tracking-tight">{principle.title}</h1>
        <ExpandableText cacheKey={`principle-desc-${principle.id}`} fadeClass="from-background to-transparent">
          <ProseClient content={principle.description} className="text-muted-foreground" />
        </ExpandableText>
        <MetadataBadges
          type="principle"
          updatedAt={principle.updated_at}
          lastVerified={principle.last_verified}
          category={principle.category}
        />
      </div>

      {/* CORE UNDERSTANDING BLOCK - Always visible, no borders */}
      <PhaseDivider label="Core Understanding" />

      <section id="statement" className="space-y-3 scroll-mt-24">
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-blue-500" />
          Statement
        </h2>
        <ExpandableText cacheKey={`principle-statement-${principle.id}`} fadeClass="from-background to-transparent">
          <ProseClient content={principle.statement} className="text-sm text-muted-foreground" />
        </ExpandableText>
      </section>

      <section id="intuition" className="space-y-3 scroll-mt-24">
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Brain className="w-5 h-5 text-purple-500" />
          Intuition
        </h2>
        <ExpandableText cacheKey={`principle-intuition-${principle.id}`} fadeClass="from-background to-transparent">
          <ProseClient content={principle.intuition} className="text-sm text-muted-foreground" />
        </ExpandableText>
      </section>

      {principle.mental_model && (
        <section id="mental-model" className="space-y-3 scroll-mt-24">
          <MentalModelDisplay content={principle.mental_model} />
        </section>
      )}

      {/* ENGINEERING IMPACT BLOCK - Always visible */}
      <PhaseDivider label="Engineering Impact" />

      {principle.engineering_consequences && principle.engineering_consequences.length > 0 && (
        <section id="engineering-consequences" className="space-y-3 scroll-mt-24">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            Engineering Consequences
          </h2>
          <div className="space-y-2">
            {principle.engineering_consequences.map((consequence, idx) => (
              <EngineeringConsequenceCard
                key={consequence.title}
                title={consequence.title}
                explanation={consequence.explanation}
              />
            ))}
          </div>
        </section>
      )}

      {principle.engineering_heuristic && (
        <section id="engineering-heuristic" className="space-y-3 scroll-mt-24">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-amber-500" />
            Engineering Heuristic
          </h2>
          <Callout variant="action">
            <p className="text-sm text-foreground font-medium">&ldquo;{principle.engineering_heuristic}&rdquo;</p>
          </Callout>
        </section>
      )}

      {/* RELATED CONTENT - Prominently positioned after core understanding */}
      {allRelatedContent.length > 0 && (
        <div className="pt-4">
          <RelatedContent items={allRelatedContent} />
        </div>
      )}

      {/* APPLICATION BLOCK - Collapsible for secondary content */}
      <PhaseDivider label="Application" />

      {principle.decision_checklist && principle.decision_checklist.length > 0 && (
        <section id="decision-checklist" className="scroll-mt-24">
          <CollapsibleSection 
            title="Decision Checklist"
            icon={<ClipboardList className="w-5 h-5 text-blue-500" />}
            defaultOpen={false}
            cacheKey={`decision-checklist-${principle.id}`}
          >
            <DecisionChecklist questions={principle.decision_checklist} />
          </CollapsibleSection>
        </section>
      )}

      {principle.appears_in && principle.appears_in.length > 0 && (
        <section id="appears-in" className="scroll-mt-24">
          <CollapsibleSection 
            title="Appears In"
            icon={<Link2 className="w-5 h-5 text-blue-500" />}
            defaultOpen={false}
            cacheKey={`appears-in-${principle.id}`}
          >
            <div className="space-y-2">
              {principle.appears_in.map((appearance) => (
                <AppearsInGroup
                  key={appearance.domain}
                  domain={appearance.domain}
                  examples={appearance.examples}
                />
              ))}
            </div>
          </CollapsibleSection>
        </section>
      )}

      {principle.tradeoffs && (
        <section id="tradeoffs" className="scroll-mt-24">
          <CollapsibleSection 
            title="Tradeoffs"
            icon={<BarChart3 className="w-5 h-5 text-muted-foreground" />}
            defaultOpen={false}
            cacheKey={`tradeoffs-${principle.id}`}
          >
            <TradeoffComparison
              benefits={principle.tradeoffs.benefits}
              costs={principle.tradeoffs.costs}
            />
          </CollapsibleSection>
        </section>
      )}

      {/* PITFALLS BLOCK - Collapsible for secondary content */}
      <PhaseDivider label="Pitfalls" />

      {principle.common_violations && principle.common_violations.length > 0 && (
        <section id="common-violations" className="scroll-mt-24">
          <CollapsibleSection 
            title="Common Violations"
            icon={<AlertTriangle className="w-5 h-5 text-red-500" />}
            defaultOpen={false}
            cacheKey={`common-violations-${principle.id}`}
          >
            <div className="space-y-2">
              {principle.common_violations.map((violation) => (
                <ViolationWarningCard
                  key={violation.violation}
                  violation={violation.violation}
                  symptoms={violation.symptoms}
                  whyItHappens={violation.why_it_happens}
                />
              ))}
            </div>
          </CollapsibleSection>
        </section>
      )}

      {principle.misconceptions && principle.misconceptions.length > 0 && (
        <section id="misconceptions" className="scroll-mt-24">
          <CollapsibleSection 
            title="Misconceptions"
            icon={<AlertTriangle className="w-5 h-5 text-amber-500" />}
            defaultOpen={false}
            cacheKey={`misconceptions-${principle.id}`}
          >
            <div className="space-y-2">
              {principle.misconceptions.map((misconception) => (
                <MisconceptionRow
                  key={misconception.myth}
                  myth={misconception.myth}
                  reality={misconception.reality}
                />
              ))}
            </div>
          </CollapsibleSection>
        </section>
      )}

      {principle.limitations && principle.limitations.length > 0 && (
        <section id="limitations" className="scroll-mt-24">
          <CollapsibleSection 
            title="Limitations"
            icon={<AlertTriangle className="w-5 h-5 text-orange-500" />}
            defaultOpen={false}
            cacheKey={`limitations-${principle.id}`}
          >
            <div className="space-y-2">
              {principle.limitations.map((limitation) => (
                <div key={limitation} className="rounded-lg border border-orange-500/20 bg-orange-500/5 p-4">
                  <p className="text-sm text-orange-700 dark:text-orange-400">{limitation}</p>
                </div>
              ))}
            </div>
          </CollapsibleSection>
        </section>
      )}

      {/* REFERENCE BLOCK - Collapsible for deep-dive content */}
      <PhaseDivider label="Reference" />

      {principle.mathematical_formulation && (
        <section id="mathematical-formulation" className="scroll-mt-24">
          <CollapsibleSection 
            title="Mathematical Formulation"
            defaultOpen={false}
            cacheKey={`mathematical-formulation-${principle.id}`}
          >
            <div className="rounded-lg border border-border bg-card p-4">
              <ProseClient content={principle.mathematical_formulation} className="text-sm text-muted-foreground" />
            </div>
          </CollapsibleSection>
        </section>
      )}

      {principle.historical_origin && (
        <section id="historical-origin" className="scroll-mt-24">
          <CollapsibleSection 
            title="Historical Origin"
            icon={<History className="w-5 h-5 text-muted-foreground" />}
            defaultOpen={false}
            cacheKey={`historical-origin-${principle.id}`}
          >
            <div className="rounded-lg border border-border bg-card p-4">
              <ProseClient content={principle.historical_origin} className="text-sm text-muted-foreground" />
            </div>
          </CollapsibleSection>
        </section>
      )}

      {principle.implications && principle.implications.length > 0 && (
        <section id="implications" className="scroll-mt-24">
          <CollapsibleSection 
            title="Implications"
            icon={<CheckCircle2 className="w-5 h-5 text-emerald-500" />}
            defaultOpen={false}
            cacheKey={`implications-${principle.id}`}
          >
            <div className="space-y-2">
              {principle.implications.map((implication) => (
                <div key={implication} className="rounded-lg border border-border bg-card p-4">
                  <p className="text-sm text-muted-foreground">{implication}</p>
                </div>
              ))}
            </div>
          </CollapsibleSection>
        </section>
      )}

      {principle.related_concepts && principle.related_concepts.length > 0 && (
        <section id="related-concepts" className="scroll-mt-24">
          <CollapsibleSection 
            title="Related Concepts"
            icon={<Link2 className="w-5 h-5 text-blue-500" />}
            defaultOpen={false}
            cacheKey={`related-concepts-${principle.id}`}
          >
            <div className="flex flex-wrap gap-2">
              {principle.related_concepts.map((concept) => (
                <span
                  key={concept}
                  className="inline-flex items-center gap-1.5 rounded border border-border bg-muted px-3 py-1.5 text-xs text-muted-foreground"
                >
                  {concept}
                </span>
              ))}
            </div>
          </CollapsibleSection>
        </section>
      )}
    </ContentPageLayout>
  );
}