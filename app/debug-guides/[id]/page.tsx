import { notFound } from 'next/navigation';
import { getDebugGuide, getAllDebugGuideIds } from '@/lib/data';
import ExpandableText from '@/components/shared/ExpandableText';

export async function generateStaticParams() {
  const ids = getAllDebugGuideIds();
  return ids.map((id) => ({ id }));
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function DebugGuidePage({ params }: PageProps) {
  const { id } = await params;
  const debugGuide = getDebugGuide(id);

  if (!debugGuide) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{debugGuide.title}</h1>
        <ExpandableText cacheKey={`debug-desc-${debugGuide.id}`} fadeClass="from-background to-transparent">
          <p className="text-muted-foreground mt-2">{debugGuide.description}</p>
        </ExpandableText>
      </div>

      <div className="prose prose-zinc dark:prose-invert max-w-none">
        {/* Debug Guide content will be rendered here */}
        <div className="space-y-4">
          <h2>Symptoms</h2>
          <ul>
            {debugGuide.symptoms.map((symptom, idx) => (
              <li key={idx}>{symptom.symptom}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
