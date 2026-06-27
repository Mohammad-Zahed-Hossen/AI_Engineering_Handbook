import { notFound } from 'next/navigation';
import { getAllPackageIds, getPackage, getRelatedContent, getContentPath } from '@/lib/data';
import ContentPageLayout from '@/components/shared/ContentPageLayout';
import MetadataBadges from '@/components/shared/MetadataBadges';
import OfficialResources from '@/components/shared/OfficialResources';
import PackageTaskList from '@/components/shared/PackageTaskList';
import QuickSetupSection from '@/components/shared/QuickSetupSection';
import RelatedContent from '@/components/shared/RelatedContent';
import ReadingSessionTracker from '@/components/shared/ReadingSessionTracker';

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

  // Resolve task cross-references
  const resolvedTasks = pkg.tasks.map(task => ({
    ...task,
    related_workflow_links: task.related_workflows
      .map(id => ({ id, href: getContentPath('workflow', id) }))
      .filter(r => r.href !== null) as { id: string; href: string }[],
    related_cheatsheet_links: task.related_cheatsheets
      .map(id => ({ id, href: getContentPath('cheatsheet', id) }))
      .filter(r => r.href !== null) as { id: string; href: string }[],
  }));

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
      <ReadingSessionTracker href={`/packages/${pkg.id}`} name={pkg.name} type="package" />
      <header className="space-y-3 border-b border-border pb-4">
        <h1>{pkg.name}</h1>
        <MetadataBadges type="package" updatedAt={pkg.updated_at} version={pkg.version} />
      </header>

      <QuickSetupSection install={pkg.install} importAs={pkg.import_as} />

      <section id="summary" className="scroll-mt-24">
        <p className="content-prose text-sm text-muted-foreground">{pkg.summary}</p>
      </section>

      <OfficialResources sources={pkg.sources} githubRepo={pkg.github_repo} />

      <PackageTaskList tasks={resolvedTasks} packageName={pkg.name} />

      <RelatedContent items={relatedContent} />
    </ContentPageLayout>
  );
}
