import { notFound } from 'next/navigation';
import { getPattern, getAllPatternIds } from '@/lib/data';
import ContentPageLayout from '@/components/shared/ContentPageLayout';
import MetadataBadges from '@/components/shared/MetadataBadges';
import RelatedContent from '@/components/shared/RelatedContent';
import ExpandableText from '@/components/shared/ExpandableText';
import { Prose } from '@/components/shared/Prose';
import { CodeBlock } from '@/components/shared/CodeBlock';
import { Lightbulb, AlertTriangle, Code, Layers } from 'lucide-react';

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
    { id: 'concept', label: 'Concept' },
    { id: 'applicability', label: 'Applicability' },
    ...(pattern.implementation_notes ? [{ id: 'implementation-notes', label: 'Implementation Notes' }] : []),
    ...(pattern.examples && pattern.examples.length > 0 ? [{ id: 'examples', label: 'Examples' }] : []),
    ...(pattern.anti_patterns && pattern.anti_patterns.length > 0 ? [{ id: 'anti-patterns', label: 'Anti-Patterns' }] : []),
  ];

  // Combine all related content
  const allRelatedContent = [
    ...pattern.related_workflows.map(id => ({ id, type: 'workflow' as const })),
    ...pattern.related_models.map(id => ({ id, type: 'model' as const })),
    ...pattern.related_packages.map(id => ({ id, type: 'package' as const })),
    ...pattern.related_principles.map(id => ({ id, type: 'principle' as const })),
  ];

  return (
    <ContentPageLayout breadcrumbs={breadcrumbs} toc={toc}>
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
        />
      </div>

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
                <CodeBlock code={example} language="python" />
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
              <div key={idx} className="rounded-lg border border-red-500/20 bg-red-500/5 p-4">
                <p className="text-sm text-red-700 dark:text-red-400">{antiPattern}</p>
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
