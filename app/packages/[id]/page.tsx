import { notFound } from 'next/navigation';
import { getAllPackageIds, getPackage, getRelatedContent } from '@/lib/data';
import { CodeBlock } from '@/components/shared/CodeBlock';
import ContentPageLayout from '@/components/shared/ContentPageLayout';
import MetadataBadges from '@/components/shared/MetadataBadges';
import OfficialResources from '@/components/shared/OfficialResources';
import PackageTaskList from '@/components/shared/PackageTaskList';
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

      <PackageTaskList tasks={pkg.tasks} packageName={pkg.name} />

      <RelatedContent items={relatedContent} />
    </ContentPageLayout>
  );
}
