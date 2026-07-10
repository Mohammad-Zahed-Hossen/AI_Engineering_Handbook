import { notFound } from 'next/navigation';
import { getPrinciple, getAllPrincipleIds } from '@/lib/data';
import ContentPageLayout from '@/components/shared/ContentPageLayout';
import MetadataBadges from '@/components/shared/MetadataBadges';
import RelatedContent from '@/components/shared/RelatedContent';
import ExpandableText from '@/components/shared/ExpandableText';
import { BookOpen, Brain, AlertTriangle, CheckCircle2, Link2 } from 'lucide-react';

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

  const toc = [
    { id: 'statement', label: 'Statement' },
    { id: 'intuition', label: 'Intuition' },
    ...(principle.mathematical_formulation ? [{ id: 'mathematical-formulation', label: 'Mathematical Formulation' }] : []),
    ...(principle.implications && principle.implications.length > 0 ? [{ id: 'implications', label: 'Implications' }] : []),
    ...(principle.limitations && principle.limitations.length > 0 ? [{ id: 'limitations', label: 'Limitations' }] : []),
    ...(principle.related_concepts && principle.related_concepts.length > 0 ? [{ id: 'related-concepts', label: 'Related Concepts' }] : []),
  ];

  // Combine all related content
  const allRelatedContent = [
    ...principle.referenced_by_patterns.map(id => ({ id, type: 'pattern' as const })),
    ...principle.referenced_by_models.map(id => ({ id, type: 'model' as const })),
    ...principle.referenced_by_workflows.map(id => ({ id, type: 'workflow' as const })),
  ];

  return (
    <ContentPageLayout breadcrumbs={breadcrumbs} toc={toc}>
      {/* Header */}
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold tracking-tight">{principle.title}</h1>
        <ExpandableText cacheKey={`principle-desc-${principle.id}`} fadeClass="from-background to-transparent">
          <p className="text-muted-foreground">{principle.description}</p>
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
          <p className="text-sm text-muted-foreground">{principle.statement}</p>
        </ExpandableText>
      </section>

      {/* Intuition */}
      <section id="intuition" className="space-y-3 scroll-mt-24">
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Brain className="w-5 h-5 text-purple-500" />
          Intuition
        </h2>
        <ExpandableText cacheKey={`principle-intuition-${principle.id}`} fadeClass="from-background to-transparent">
          <p className="text-sm text-muted-foreground">{principle.intuition}</p>
        </ExpandableText>
      </section>

      {/* Mathematical Formulation */}
      {principle.mathematical_formulation && (
        <section id="mathematical-formulation" className="space-y-3 scroll-mt-24">
          <h2 className="text-lg font-semibold text-foreground">Mathematical Formulation</h2>
          <div className="rounded-lg border border-border bg-card p-4">
            <pre className="text-sm text-muted-foreground whitespace-pre-wrap font-mono">
              {principle.mathematical_formulation}
            </pre>
          </div>
        </section>
      )}

      {/* Implications */}
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
