import { notFound } from 'next/navigation';
import { getPrinciple, getAllPrincipleIds } from '@/lib/data';
import ExpandableText from '@/components/shared/ExpandableText';

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

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{principle.title}</h1>
        <ExpandableText cacheKey={`principle-desc-${principle.id}`} fadeClass="from-background to-transparent">
          <p className="text-muted-foreground mt-2">{principle.description}</p>
        </ExpandableText>
      </div>

      <div className="prose prose-zinc dark:prose-invert max-w-none space-y-4">
        {/* Principle content will be rendered here */}
        <div>
          <h2 className="text-lg font-semibold mb-1">Statement</h2>
          <ExpandableText cacheKey={`principle-statement-${principle.id}`} fadeClass="from-background to-transparent">
            <p>{principle.statement}</p>
          </ExpandableText>
        </div>
        
        <div>
          <h2 className="text-lg font-semibold mb-1">Intuition</h2>
          <ExpandableText cacheKey={`principle-intuition-${principle.id}`} fadeClass="from-background to-transparent">
            <p>{principle.intuition}</p>
          </ExpandableText>
        </div>
      </div>
    </div>
  );
}
