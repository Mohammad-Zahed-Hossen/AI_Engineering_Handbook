import { notFound } from 'next/navigation';
import { getAllPackageIds, getPackage, getRelatedContent, getContentPath, getContentName, getAllPackages } from '@/lib/data';
import { resolvePackageRelationship } from '@/lib/relationships';
import ContentPageLayout from '@/components/shared/ContentPageLayout';
import MetadataBadges from '@/components/shared/MetadataBadges';
import OfficialResources from '@/components/shared/OfficialResources';
import PackageTaskList from '@/components/shared/PackageTaskList';
import { CodeBlock } from '@/components/shared/CodeBlock';
import QuickSetupSection from '@/components/shared/QuickSetupSection';
import RelatedContent from '@/components/shared/RelatedContent';
import ReadingSessionTracker from '@/components/shared/ReadingSessionTracker';
import ExpandableText from '@/components/shared/ExpandableText';
import { Prose } from '@/components/shared/Prose';

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

  const allPackages = getAllPackages();

  // Resolve task cross-references
  const resolvedTasks = pkg.tasks.map(task => ({
    ...task,
    syntaxBlock: <CodeBlock code={task.syntax} language={pkg.language} />,
    exampleBlock: <CodeBlock code={task.example} language={pkg.language} />,
    related_workflow_links: (task.related_workflows || [])
      .map(id => ({ 
        id, 
        href: getContentPath('workflow', id),
        name: getContentName('workflow', id)
      }))
      .filter(r => r.href !== null) as { id: string; href: string; name: string }[],
    related_cheatsheet_links: (task.related_cheatsheets || [])
      .map(id => ({ 
        id, 
        href: getContentPath('cheatsheet', id),
        name: getContentName('cheatsheet', id)
      }))
      .filter(r => r.href !== null) as { id: string; href: string; name: string }[],
    visualization_equivalents: (task.visualization_equivalents || [])
      .map(eq => resolvePackageRelationship(eq, pkg.id, allPackages))
      .filter((r): r is NonNullable<typeof r> => r !== null),
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

      <QuickSetupSection install={pkg.install} importAs={pkg.import_as} importLanguage={pkg.language} />

      <section id="summary" className="scroll-mt-24">
        <ExpandableText cacheKey={`pkg-summary-${pkg.id}`} fadeClass="from-background to-transparent">
          <Prose content={pkg.summary} className="content-prose text-sm text-muted-foreground" />
        </ExpandableText>
      </section>

      <OfficialResources sources={pkg.sources} githubRepo={pkg.github_repo} />

      <PackageTaskList tasks={resolvedTasks} packageName={pkg.id} language={pkg.language} />

      <RelatedContent items={relatedContent} />
    </ContentPageLayout>
  );
}
