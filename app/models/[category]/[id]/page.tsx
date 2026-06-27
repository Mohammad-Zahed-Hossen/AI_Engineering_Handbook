import { notFound } from 'next/navigation';
import { getModelIds, getModel, getRelatedContent } from '@/lib/data';
import { ModelCategory } from '@/types/model';
import ContentPageLayout from '@/components/shared/ContentPageLayout';
import MetadataBadges from '@/components/shared/MetadataBadges';
import OfficialResources from '@/components/shared/OfficialResources';
import RelatedContent from '@/components/shared/RelatedContent';
import AlternativesList from '@/components/shared/AlternativesList';
import ModelCollapsibleSections from '@/components/shared/ModelCollapsibleSections';
import { validateModelCategory } from '@/lib/route-params';

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
    { id: 'pros-cons', label: 'Pros & Cons' },
    { id: 'performance', label: 'Performance' },
    { id: 'hyperparams', label: 'Hyperparameters' },
    { id: 'quick-start', label: 'Quick Start' },
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
      <header id="summary" className="space-y-3 border-b border-border pb-4 scroll-mt-24">
        <h1>{model.name}</h1>
        <MetadataBadges
          type="model"
          updatedAt={model.updated_at}
          category={model.category}
          problemTypes={model.problem_types}
        />
        <p className="content-prose text-sm text-muted-foreground">{model.summary}</p>
      </header>

      <OfficialResources sources={model.sources} githubRepo={model.github_repo} />

      <section id="decision-guide" className="grid grid-cols-1 md:grid-cols-2 gap-4 scroll-mt-24">
        <div className="rounded-lg border border-border bg-card p-4 border-l-2 border-l-emerald-500">
          <h2 className="text-emerald-700 dark:text-emerald-400">Use When</h2>
          <p className="mt-2 text-sm text-muted-foreground">{model.use_when}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4 border-l-2 border-l-amber-500">
          <h2 className="text-rose-700 dark:text-rose-400">Avoid When</h2>
          <p className="mt-2 text-sm text-muted-foreground">{model.avoid_when}</p>
        </div>
      </section>

      {model.decision_notes && (
        <div className="rounded-lg border border-border bg-card p-4 space-y-1.5">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground block">
            Decision Notes
          </span>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {model.decision_notes}
          </p>
        </div>
      )}

      <section id="pros-cons" className="grid grid-cols-1 md:grid-cols-2 gap-4 scroll-mt-24">
        <div className="rounded-lg border border-border bg-card p-4">
          <h2>Pros</h2>
          <ul className="mt-2 list-disc pl-4 space-y-1 text-sm text-muted-foreground">
            {model.pros.map((pro, idx) => (
              <li key={idx}>{pro}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <h2>Cons</h2>
          <ul className="mt-2 list-disc pl-4 space-y-1 text-sm text-muted-foreground">
            {model.cons.map((con, idx) => (
              <li key={idx}>{con}</li>
            ))}
          </ul>
        </div>
      </section>

      <ModelCollapsibleSections model={model} />

      {model.competitors && model.competitors.length > 0 && (
        <AlternativesList
          alternatives={model.competitors}
          title="Compared To"
        />
      )}

      <RelatedContent items={relatedContent} />
    </ContentPageLayout>
  );
}

