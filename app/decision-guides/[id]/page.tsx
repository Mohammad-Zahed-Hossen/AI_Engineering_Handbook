import { notFound } from 'next/navigation';
import { getDecisionGuide, getAllDecisionGuideIds } from '@/lib/data';
import ExpandableText from '@/components/shared/ExpandableText';

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

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{decisionGuide.title}</h1>
        <ExpandableText cacheKey={`decision-desc-${decisionGuide.id}`} fadeClass="from-background to-transparent">
          <p className="text-muted-foreground mt-2">{decisionGuide.description}</p>
        </ExpandableText>
      </div>

      <div className="prose prose-zinc dark:prose-invert max-w-none space-y-4">
        {/* Decision Guide content will be rendered here */}
        <div>
          <h2 className="text-lg font-semibold mb-1">Problem</h2>
          <ExpandableText cacheKey={`decision-prob-${decisionGuide.id}`} fadeClass="from-background to-transparent">
            <p>{decisionGuide.problem}</p>
          </ExpandableText>
        </div>
        
        <div>
          <h2 className="text-lg font-semibold mb-2">Options</h2>
          <ul className="space-y-2">
            {decisionGuide.options.map((option, idx) => (
              <li key={idx}>
                <strong>{option.name}</strong>: {option.best_for}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
