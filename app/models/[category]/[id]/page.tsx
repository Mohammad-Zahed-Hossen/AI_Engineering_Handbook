import { notFound } from 'next/navigation';
import { getModelIds, getModel, getRelatedContent } from '@/lib/data';
import { ModelCategory } from '@/types/model';
import ContentPageLayout from '@/components/shared/ContentPageLayout';
import MetadataBadges from '@/components/shared/MetadataBadges';
import OfficialResources from '@/components/shared/OfficialResources';
import RelatedContent from '@/components/shared/RelatedContent';
import ModelCollapsibleSections from '@/components/shared/ModelCollapsibleSections';
import { validateModelCategory } from '@/lib/route-params';
import ReadingSessionTracker from '@/components/shared/ReadingSessionTracker';
import ExpandableText from '@/components/shared/ExpandableText';

export async function generateStaticParams() {
  const categories: ModelCategory[] = ['ml', 'dl', 'llm'];
  const params: { category: string; id: string }[] = [];

  for (const category of categories) {
    const ids = getModelIds(category);
    for (const id of ids) {
      params.push({ category, id });
    }
  }

  return params;
}

interface PageProps {
  params: Promise<{ category: string; id: string }>;
}

export default async function ModelDetailPage({ params }: PageProps) {
  const { category, id } = await params;
  const validCategory = validateModelCategory(category);
  if (!validCategory) notFound();

  let model;
  try {
    model = getModel(validCategory, id);
  } catch (e) {
    if ((e as NodeJS.ErrnoException).code === 'ENOENT') notFound();
    throw e;
  }

  const toc = [
    { id: 'summary', label: 'Summary' },
    { id: 'decision-guide', label: 'Decision Guide' },
    { id: 'pros-cons', label: 'Strengths & Limitations' },
    { id: 'core-understanding', label: 'Core Theory' },
    { id: 'engineering-considerations', label: 'Engineering' },
    { id: 'hyperparameters', label: 'Hyperparameters' },
    { id: 'comparisons', label: 'Tradeoffs' },
  ];
  
  const relatedContent = getRelatedContent('model', model.id, validCategory);

  return (
    <ContentPageLayout
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Models', href: `/models/${validCategory}` },
        { label: model.name },
      ]}
      toc={toc}
    >
      <ReadingSessionTracker href={`/models/${validCategory}/${model.id}`} name={model.name} type="model" category={validCategory} />
      
      <header id="summary" className="space-y-3 border-b border-border pb-4 scroll-mt-24">
        <h1>{model.name}</h1>
        <MetadataBadges
          type="model"
          updatedAt={model.updated_at}
          category={model.domain}
          problemTypes={model.problem_types}
        />
        <div className="rounded-lg bg-muted/30 p-3.5 border border-border/80">
          <span className="text-[10px] font-bold uppercase text-muted-foreground block mb-1">Architecture Overview</span>
          <p className="text-xs text-foreground leading-relaxed leading-relaxed font-sans">{model.description}</p>
        </div>
        <ExpandableText cacheKey={`model-summary-${model.id}`} fadeClass="from-background to-transparent">
          <p className="content-prose text-sm text-muted-foreground leading-relaxed">{model.decisionsummary.summary}</p>
        </ExpandableText>
      </header>

      <OfficialResources sources={model.sources} githubRepo={model.githubrepo} />

      <section id="decision-guide" className="grid grid-cols-1 md:grid-cols-2 gap-4 scroll-mt-24">
        <div className="rounded-lg border border-border bg-card p-4 border-l-2 border-l-emerald-500 space-y-2">
          <h2 className="text-emerald-700 dark:text-emerald-400 font-sans text-sm font-bold">Use When (Best Use Cases)</h2>
          <ul className="list-disc pl-4 space-y-1 text-xs text-muted-foreground leading-relaxed">
            {model.decisionsummary.bestusecases.map((use, idx) => (
              <li key={idx}>{use}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-lg border border-border bg-card p-4 border-l-2 border-l-amber-500 space-y-2">
          <h2 className="text-amber-700 dark:text-amber-400 font-sans text-sm font-bold">Avoid When</h2>
          <ul className="list-disc pl-4 space-y-1 text-xs text-muted-foreground leading-relaxed">
            {model.decisionsummary.avoidwhen.map((avoid, idx) => (
              <li key={idx}>{avoid}</li>
            ))}
          </ul>
        </div>
      </section>

      <section id="pros-cons" className="grid grid-cols-1 md:grid-cols-2 gap-4 scroll-mt-24">
        <div className="rounded-lg border border-border bg-card p-4 border-l-2 border-l-teal-500 space-y-2">
          <h2 className="text-teal-700 dark:text-teal-400 font-sans text-sm font-bold">Strengths (Pros)</h2>
          <ul className="list-disc pl-4 space-y-1 text-xs text-muted-foreground leading-relaxed">
            {model.decisionsummary.strengths.map((pro, idx) => (
              <li key={idx}>{pro}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-lg border border-border bg-card p-4 border-l-2 border-l-rose-500 space-y-2">
          <h2 className="text-rose-700 dark:text-rose-400 font-sans text-sm font-bold">Limitations (Cons)</h2>
          <ul className="list-disc pl-4 space-y-1 text-xs text-muted-foreground leading-relaxed">
            {model.decisionsummary.limitations.map((con, idx) => (
              <li key={idx}>{con}</li>
            ))}
          </ul>
        </div>
      </section>

      <ModelCollapsibleSections model={model} />

      <RelatedContent items={relatedContent} />
    </ContentPageLayout>
  );
}
