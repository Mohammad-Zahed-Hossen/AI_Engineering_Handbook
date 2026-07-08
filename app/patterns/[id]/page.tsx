import { notFound } from 'next/navigation';
import { getPattern, getAllPatternIds } from '@/lib/data';
import ExpandableText from '@/components/shared/ExpandableText';

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

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{pattern.title}</h1>
        <ExpandableText cacheKey={`pattern-desc-${pattern.id}`} fadeClass="from-background to-transparent">
          <p className="text-muted-foreground mt-2">{pattern.description}</p>
        </ExpandableText>
      </div>

      <div className="prose prose-zinc dark:prose-invert max-w-none space-y-4">
        {/* Pattern content will be rendered here */}
        <div>
          <h2 className="text-lg font-semibold mb-1">Concept</h2>
          <ExpandableText cacheKey={`pattern-concept-${pattern.id}`} fadeClass="from-background to-transparent">
            <p>{pattern.concept}</p>
          </ExpandableText>
        </div>
        
        <div>
          <h2 className="text-lg font-semibold mb-1">Applicability</h2>
          <ExpandableText cacheKey={`pattern-app-${pattern.id}`} fadeClass="from-background to-transparent">
            <p>{pattern.applicability}</p>
          </ExpandableText>
        </div>
      </div>
    </div>
  );
}
