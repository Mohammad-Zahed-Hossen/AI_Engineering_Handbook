import { notFound } from 'next/navigation';
import { getPattern, getAllPatternIds, getRelatedContent } from '@/lib/data';
import ContentPageLayout from '@/components/shared/ContentPageLayout';
import MetadataBadges from '@/components/shared/MetadataBadges';
import RelatedContent from '@/components/shared/RelatedContent';
import ExpandableText from '@/components/shared/ExpandableText';
import { Prose } from '@/components/shared/Prose';
import { CodeBlock } from '@/components/shared/CodeBlock';
import { Lightbulb, AlertTriangle, Code, Layers, ArrowLeft, ArrowRight, ChevronDown, ChevronRight } from 'lucide-react';
import ReadingSessionTracker from '@/components/shared/ReadingSessionTracker';
import DecisionSummary from '@/components/shared/DecisionSummary';
import PatternSnapshot from '@/components/shared/PatternSnapshot';
import TradeoffTable from '@/components/shared/TradeoffTable';
import DecisionFlow from '@/components/shared/DecisionFlow';
import AntiPatternCard from '@/components/shared/AntiPatternCard';
import VariationCard from '@/components/shared/VariationCard';
import RelatedPatternGraph from '@/components/shared/RelatedPatternGraph';
import SystemInteractions from '@/components/shared/SystemInteractions';
import Link from 'next/link';
import CollapsibleSection from '@/components/shared/CollapsibleSection';
import SectionSummary from '@/components/shared/SectionSummary';
import BackToTop from '@/components/shared/BackToTop';

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

  const allPatternIds = getAllPatternIds();
  const currentIndex = allPatternIds.indexOf(id);
  const previousPatternId = currentIndex > 0 ? allPatternIds[currentIndex - 1] : null;
  const nextPatternId = currentIndex < allPatternIds.length - 1 ? allPatternIds[currentIndex + 1] : null;

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Patterns', href: '/patterns' },
    { label: pattern.title },
  ];

  // Combine all related content
  const allRelatedContent = getRelatedContent('pattern', pattern.id);

  const toc = [
    { id: 'decision-summary', label: 'Decision Summary' },
    { id: 'pattern-snapshot', label: 'Pattern Snapshot' },
    ...(pattern.tradeoffs && pattern.tradeoffs.length > 0 ? [{ id: 'tradeoffs', label: 'Tradeoffs' }] : []),
    ...(pattern.system_interactions && pattern.system_interactions.length > 0 ? [{ id: 'system-interactions', label: 'System Interactions' }] : []),
    ...(pattern.decision_flow && pattern.decision_flow.length > 0 ? [{ id: 'decision-flow', label: 'Decision Flow' }] : []),
    { id: 'concept', label: 'Concept' },
    { id: 'applicability', label: 'Applicability' },
    ...(pattern.implementation_notes ? [{ id: 'implementation-notes', label: 'Implementation Notes' }] : []),
    ...(pattern.examples && pattern.examples.length > 0 ? [{ id: 'examples', label: 'Examples' }] : []),
    ...(pattern.anti_patterns && pattern.anti_patterns.length > 0 ? [{ id: 'anti-patterns', label: 'Anti-Patterns' }] : []),
    ...(pattern.variations && pattern.variations.length > 0 ? [{ id: 'variations', label: 'Variations' }] : []),
    ...(allRelatedContent.length > 0 ? [{ id: 'related-content', label: 'Related Content' }] : []),
  ];

  return (
    <ContentPageLayout breadcrumbs={breadcrumbs} toc={toc}>
      <ReadingSessionTracker href={`/patterns/${pattern.id}`} name={pattern.title} type="pattern" />
      {/* Header */}
      <div className="space-y-3">
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
          confidence={pattern.confidence}
          engineeringMaturity={pattern.engineering_maturity}
          lifecycle={pattern.lifecycle}
          stability={pattern.stability}
          simplified={true}
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

      {/* System Interactions */}
      {pattern.system_interactions && pattern.system_interactions.length > 0 && (
        <section id="system-interactions" className="scroll-mt-24">
          <SystemInteractions interactions={pattern.system_interactions} />
        </section>
      )}

      {/* Decision Flow */}
      {pattern.decision_flow && pattern.decision_flow.length > 0 && (
        <section id="decision-flow" className="scroll-mt-24">
          <DecisionFlow steps={pattern.decision_flow} />
        </section>
      )}

      {/* Concept */}
      <section id="concept" className="scroll-mt-24">
        <CollapsibleSection 
          title="Concept" 
          icon={<Lightbulb className="w-5 h-5 text-yellow-500" />}
          defaultOpen={true}
        >
          <SectionSummary 
            points={[
              pattern.concept.split('.').slice(0, 2).join('.').trim(),
              pattern.concept.split('.').slice(2, 3).join('.').trim()
            ].filter(Boolean)}
            icon={<Lightbulb className="w-4 h-4 text-yellow-500" />}
          />
          <Prose content={pattern.concept} className="text-sm text-muted-foreground leading-relaxed" />
        </CollapsibleSection>
      </section>

      {/* Applicability */}
      <section id="applicability" className="scroll-mt-24">
        <CollapsibleSection 
          title="Applicability" 
          icon={<Layers className="w-5 h-5 text-blue-500" />}
          defaultOpen={true}
        >
          <SectionSummary 
            points={[
              pattern.applicability.split('.').slice(0, 2).join('.').trim(),
              pattern.applicability.split('.').slice(2, 3).join('.').trim()
            ].filter(Boolean)}
            icon={<Layers className="w-4 h-4 text-blue-500" />}
          />
          <Prose content={pattern.applicability} className="text-sm text-muted-foreground leading-relaxed" />
        </CollapsibleSection>
      </section>

      {/* Implementation Notes */}
      {pattern.implementation_notes && (
        <section id="implementation-notes" className="scroll-mt-24">
          <CollapsibleSection 
            title="Implementation Notes" 
            icon={<Code className="w-5 h-5 text-purple-500" />}
            defaultOpen={false}
          >
            <SectionSummary 
              points={[
                pattern.implementation_notes.split('.').slice(0, 2).join('.').trim(),
                pattern.implementation_notes.split('.').slice(2, 3).join('.').trim()
              ].filter(Boolean)}
              icon={<Code className="w-4 h-4 text-purple-500" />}
            />
            <Prose content={pattern.implementation_notes} className="text-sm text-muted-foreground leading-relaxed" />
          </CollapsibleSection>
        </section>
      )}

      {/* Examples */}
      {pattern.examples && pattern.examples.length > 0 && (
        <section id="examples" className="space-y-2 scroll-mt-24">
          <h2 className="text-lg font-semibold text-foreground">Examples</h2>
          <div className="space-y-3">
            {pattern.examples.map((example, idx) => (
              <div key={idx} className="rounded-lg border border-border bg-card p-4">
                <CodeBlock code={example} language="text" showLineNumbers={true} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Anti-Patterns */}
      {pattern.anti_patterns && pattern.anti_patterns.length > 0 && (
        <section id="anti-patterns" className="scroll-mt-24">
          <CollapsibleSection 
            title="Anti-Patterns" 
            icon={<AlertTriangle className="w-5 h-5 text-amber-500" />}
            defaultOpen={false}
          >
            <div className="space-y-3">
              {pattern.anti_patterns.map((antiPattern, idx) => (
                <AntiPatternCard key={idx} antiPattern={antiPattern} />
              ))}
            </div>
          </CollapsibleSection>
        </section>
      )}

      {/* Variations */}
      {pattern.variations && pattern.variations.length > 0 && (
        <section id="variations" className="scroll-mt-24">
          <CollapsibleSection 
            title="Variations" 
            icon={<Layers className="w-5 h-5 text-indigo-500" />}
            defaultOpen={false}
          >
            <div className="space-y-3">
              {pattern.variations.map((variation, idx) => (
                <VariationCard key={idx} variation={variation} />
              ))}
            </div>
          </CollapsibleSection>
        </section>
      )}

      {/* Related Content */}
      {allRelatedContent.length > 0 && (
        <section id="related-content" className="scroll-mt-24 space-y-3">
          <RelatedPatternGraph patternId={pattern.id} relatedPatterns={allRelatedContent} />
          <RelatedContent items={allRelatedContent} />
        </section>
      )}

      {/* Pattern Navigation */}
      <nav className="pt-6 mt-8 border-t border-border" aria-label="Pattern navigation">
        {/* Progress Indicator */}
        <div className="flex items-center justify-center mb-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="font-medium text-foreground">{currentIndex + 1}</span>
            <span>of</span>
            <span className="font-medium text-foreground">{allPatternIds.length}</span>
            <span className="ml-1">patterns</span>
          </div>
        </div>

        {/* Navigation Cards - Always 3 columns, smaller on mobile */}
        <div className="grid grid-cols-3 gap-2">
          {/* Previous Pattern */}
          {previousPatternId ? (
            <Link
              href={`/patterns/${previousPatternId}`}
              className="group flex items-center gap-2 p-2 rounded-lg border border-border bg-card hover:bg-muted/50 hover:border-border/80 transition-all"
            >
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-muted group-hover:bg-primary/10 transition-colors">
                <ArrowLeft className="w-3 h-3 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="block text-[9px] uppercase tracking-wider text-muted-foreground mb-0.5">Previous</span>
                <span className="block text-xs font-medium text-foreground truncate">{getPattern(previousPatternId)?.title || previousPatternId}</span>
              </div>
            </Link>
          ) : (
            <div /> // Spacer for layout balance
          )}

          {/* Back to Patterns */}
          <Link
            href="/patterns"
            className="group flex items-center justify-center p-2 rounded-lg border border-border bg-card hover:bg-muted/50 hover:border-border/80 transition-all text-center"
          >
            <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">Back to Patterns</span>
          </Link>

          {/* Next Pattern */}
          {nextPatternId ? (
            <Link
              href={`/patterns/${nextPatternId}`}
              className="group flex items-center gap-2 p-2 rounded-lg border border-border bg-card hover:bg-muted/50 hover:border-border/80 transition-all"
            >
              <div className="flex-1 min-w-0 text-right">
                <span className="block text-[9px] uppercase tracking-wider text-muted-foreground mb-0.5">Next</span>
                <span className="block text-xs font-medium text-foreground truncate">{getPattern(nextPatternId)?.title || nextPatternId}</span>
              </div>
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-muted group-hover:bg-primary/10 transition-colors">
                <ArrowRight className="w-3 h-3 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            </Link>
          ) : (
            <div /> // Spacer for layout balance
          )}
        </div>
      </nav>
      <BackToTop />
    </ContentPageLayout>
  );
}
