import { notFound } from 'next/navigation';
import { getModelIds, getModel, getRelatedContent } from '@/lib/data';
import { ModelCategory } from '@/types/model';
import { CodeBlock } from '@/components/shared/CodeBlock';
import ContentPageLayout from '@/components/shared/ContentPageLayout';
import MetadataBadges from '@/components/shared/MetadataBadges';
import OfficialResources from '@/components/shared/OfficialResources';
import RelatedContent from '@/components/shared/RelatedContent';
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
        <div className="rounded-lg border border-border bg-card p-4">
          <h2 className="text-emerald-700 dark:text-emerald-400">Use When</h2>
          <p className="mt-2 text-sm text-muted-foreground">{model.use_when}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <h2 className="text-rose-700 dark:text-rose-400">Avoid When</h2>
          <p className="mt-2 text-sm text-muted-foreground">{model.avoid_when}</p>
        </div>
      </section>

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

      <section id="performance" className="rounded-lg border border-border bg-card p-4 scroll-mt-24">
        <h2>Performance Overview</h2>
        <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          {[
            ['Training', model.training_speed],
            ['Inference', model.inference_speed],
            ['Memory', model.memory_usage],
            ['Interpretability', model.interpretability],
          ].map(([label, value]) => (
            <div key={label} className="rounded border border-border bg-muted/30 p-2">
              <span className="text-[10px] uppercase text-muted-foreground block mb-1">{label}</span>
              <span className="text-sm font-mono font-medium capitalize">{value}</span>
            </div>
          ))}
        </div>
      </section>

      {model.key_hyperparams.length > 0 && (
        <section id="hyperparams" className="space-y-2 scroll-mt-24">
          <h2>Key Hyperparameters</h2>
          <div className="rounded-lg border border-border overflow-x-auto bg-card">
            <table className="min-w-full divide-y divide-border text-left text-sm">
              <thead className="bg-muted/40 text-[10px] font-semibold text-muted-foreground uppercase">
                <tr>
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Default</th>
                  <th className="px-4 py-2">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {model.key_hyperparams.map(hp => (
                  <tr key={hp.name} className="hover:bg-muted/10">
                    <td className="px-4 py-2 font-mono text-primary">{hp.name}</td>
                    <td className="px-4 py-2 font-mono">{hp.default === null ? 'null' : String(hp.default)}</td>
                    <td className="px-4 py-2 text-muted-foreground">{hp.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      <section id="quick-start" className="space-y-2 scroll-mt-24">
        <h2>Quick Start</h2>
        <CodeBlock code={model.quick_start} language="python" />
      </section>

      <RelatedContent items={relatedContent} />
    </ContentPageLayout>
  );
}
