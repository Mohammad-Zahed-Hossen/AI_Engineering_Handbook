import { notFound } from 'next/navigation';
import { getAllPackageIds, getPackage, getRelatedContent } from '@/lib/data';
import { CodeBlock } from '@/components/shared/CodeBlock';
import SectionCard from '@/components/shared/SectionCard';
import ContentPageLayout from '@/components/shared/ContentPageLayout';
import MetadataBadges from '@/components/shared/MetadataBadges';
import OfficialResources from '@/components/shared/OfficialResources';
import RelatedContent from '@/components/shared/RelatedContent';

export async function generateStaticParams() {
  return getAllPackageIds().map((id) => ({ id }));
}

interface PageProps {
  params: Promise<{ id: string }>;
}

function slugify(value: string) {
  return value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

export default async function PackageDetailPage({ params }: PageProps) {
  const { id } = await params;

  let pkg;
  try {
    pkg = getPackage(id);
  } catch (e) {
    if ((e as NodeJS.ErrnoException).code === 'ENOENT') notFound();
    throw e;
  }

  const toc = [
    { id: 'setup', label: 'Quick Setup' },
    { id: 'summary', label: 'Summary' },
    ...pkg.tasks.map(task => ({ id: slugify(task.task), label: task.task })),
  ];
  const relatedContent = getRelatedContent('package', pkg.id);

  return (
    <ContentPageLayout
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Packages', href: '/packages' },
        { label: pkg.name },
      ]}
      toc={toc}
    >
      <header className="space-y-3 border-b border-border pb-4">
        <h1>{pkg.name}</h1>
        <MetadataBadges type="package" updatedAt={pkg.updated_at} version={pkg.version} />
      </header>

      <section id="setup" className="space-y-3 scroll-mt-24">
        <h2>Quick Setup</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-[10px] font-semibold uppercase text-muted-foreground mb-1">Install</h3>
            <CodeBlock code={pkg.install} language="bash" />
          </div>
          <div>
            <h3 className="text-[10px] font-semibold uppercase text-muted-foreground mb-1">Import</h3>
            <CodeBlock code={pkg.import_as} language="python" />
          </div>
        </div>
      </section>

      <section id="summary" className="scroll-mt-24">
        <p className="content-prose text-sm text-muted-foreground">{pkg.summary}</p>
      </section>

      <OfficialResources sources={pkg.sources} githubRepo={pkg.github_repo} />

      <div className="space-y-6">
        {pkg.tasks.map(task => {
          const taskAnchor = slugify(task.task);

          return (
            <SectionCard
              key={task.task}
              title={task.task}
              subtitle={`Mental trigger: ${task.mental_trigger}`}
            >
              <div id={taskAnchor} className="space-y-4 scroll-mt-24">
                <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
                  <div className="rounded-lg border border-border bg-card p-4">
                    <h3 className="mb-2 text-sm font-semibold">Syntax</h3>
                    <CodeBlock code={task.syntax} language="python" />
                  </div>
                  <div className="rounded-lg border border-border bg-card p-4">
                    <h3 className="mb-2 text-sm font-semibold">Example</h3>
                    <CodeBlock code={task.example} language="python" />
                  </div>
                </div>

                <div className="grid gap-4 lg:grid-cols-3 text-sm">
                  <div>
                    <h4 className="text-[11px] font-semibold uppercase text-muted-foreground mb-1">Important parameters</h4>
                    <ul className="list-disc pl-4 space-y-1 text-muted-foreground">
                      {task.important_params.map((param, idx) => (
                        <li key={idx}>{param}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-[11px] font-semibold uppercase text-muted-foreground mb-1">When to use</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">{task.use_when}</p>
                  </div>
                  <div>
                    <h4 className="text-[11px] font-semibold uppercase text-muted-foreground mb-1">Avoid when</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">{task.avoid_when}</p>
                  </div>
                </div>

                {task.decision_notes && (
                  <div className="rounded-lg border border-border bg-card p-4 text-sm text-muted-foreground">
                    <h4 className="text-[11px] font-semibold uppercase mb-1">Decision notes</h4>
                    <p>{task.decision_notes}</p>
                  </div>
                )}

                {task.gotchas.length > 0 && (
                  <div className="border-l-2 border-amber-500 bg-amber-500/5 p-3 rounded-r text-sm text-amber-800 dark:text-amber-300">
                    <h3 className="text-[10px] font-semibold uppercase mb-1">Gotchas</h3>
                    <ul className="list-disc pl-4 space-y-1">
                      {task.gotchas.map((gotcha, idx) => (
                        <li key={idx}>{gotcha}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="grid gap-4 lg:grid-cols-2 text-sm">
                  <div>
                    <h4 className="text-[11px] font-semibold uppercase text-muted-foreground mb-1">Official docs</h4>
                    <a
                      href={task.official_docs}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline"
                    >
                      {task.official_docs}
                    </a>
                  </div>
                  {(task.related_workflows.length > 0 || task.related_cheatsheets.length > 0) && (
                    <div>
                      <h4 className="text-[11px] font-semibold uppercase text-muted-foreground mb-1">Related content</h4>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        {task.related_workflows.length > 0 && (
                          <p>Workflows: {task.related_workflows.join(', ')}</p>
                        )}
                        {task.related_cheatsheets.length > 0 && (
                          <p>Cheatsheets: {task.related_cheatsheets.join(', ')}</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </SectionCard>
          );
        })}
      </div>

      <RelatedContent items={relatedContent} />
    </ContentPageLayout>
  );
}
