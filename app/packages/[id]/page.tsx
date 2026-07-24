import { notFound } from 'next/navigation';
import { getAllPackageIds, getPackage, getRelatedContent, getAllPackages, getCanonicalRelationshipsForEntity, resolveGraphNodes, shouldRenderKnowledgeGraph } from '@/lib/data';
import { resolvePackageRelationship } from '@/lib/relationships';
import PackagePageLayout from '@/components/shared/PackagePageLayout';
import MetadataBadges from '@/components/shared/MetadataBadges';
import OfficialResources from '@/components/shared/OfficialResources';
import PackageTaskList from '@/components/shared/PackageTaskList';
import RelatedContent from '@/components/shared/RelatedContent';
import ReadingSessionTracker from '@/components/shared/ReadingSessionTracker';
import ExpandableText from '@/components/shared/ExpandableText';
import { ProseClient } from '@/components/shared/Prose';
import PackageSnapshot from '@/components/shared/PackageSnapshot';
import { CodeBlock } from '@/components/shared/CodeBlock';
import StickyActionBar from '@/components/shared/StickyActionBar';
import FavoriteButton from '@/components/shared/FavoriteButton';
import KnowledgeGraphPanel from '@/components/shared/KnowledgeGraphPanel';

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

  const resolvedTasks = pkg.tasks.map(task => ({
    ...task,
    syntaxBlock: <CodeBlock code={task.syntax} language={pkg.language} />,
    exampleBlock: <CodeBlock code={task.example} language={pkg.language} />,
    visualization_equivalents: (task.visualization_equivalents || [])
      .map(eq => resolvePackageRelationship(eq, pkg.id, allPackages))
      .filter((r): r is NonNullable<typeof r> => r !== null),
  })) as unknown as Parameters<typeof PackageTaskList>[0]['tasks'];

  // Task navigation items for StickyActionBar TOC
  const taskNavItems = pkg.tasks.map(task => ({
    id: slugify(task.task),
    label: task.task,
  }));

  const relatedContent = getRelatedContent('package', pkg.id);
  const rawGraphItems = getCanonicalRelationshipsForEntity('package', pkg.id);
  const graphNodes = resolveGraphNodes(rawGraphItems, 'package', pkg.id).filter(n => n.type !== 'package_task');
  const shouldShowGraph = shouldRenderKnowledgeGraph(relatedContent, graphNodes);

  return (
    <PackagePageLayout
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Packages', href: '/packages' },
        { label: pkg.name },
      ]}
    >
      <ReadingSessionTracker id={pkg.id} href={`/packages/${pkg.id}`} name={pkg.name} type="package" />

      <header className="space-y-3 border-b border-border pb-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h1>{pkg.name}</h1>
            <MetadataBadges type="package" updatedAt={pkg.updated_at} version={pkg.version} />
          </div>
          <FavoriteButton type="package" id={pkg.id} name={pkg.name} href={`/packages/${pkg.id}`} />
        </div>
      </header>

      {/* Package Snapshot - Single source of truth for install/import */}
      <PackageSnapshot
        name={pkg.name}
        version={pkg.version}
        install={pkg.install}
        importAs={pkg.import_as}
        language={pkg.language}
        taskCount={pkg.tasks.length}
        updatedAt={pkg.updated_at}
      />

      <section id="summary" className="scroll-mt-24">
        <ExpandableText cacheKey={`pkg-summary-${pkg.id}`} fadeClass="from-background to-transparent">
          <ProseClient content={pkg.summary} className="content-prose text-sm text-muted-foreground" />
        </ExpandableText>
      </section>

      <PackageTaskList tasks={resolvedTasks} packageName={pkg.id} language={pkg.language} />

      <RelatedContent items={relatedContent} />

      {shouldShowGraph && <KnowledgeGraphPanel nodes={graphNodes} />}

      {/* Further Study - Moved to bottom */}
      <OfficialResources sources={pkg.sources} githubRepo={pkg.github_repo} />

      {/* On this Page - Bottom popup navigation */}
      <StickyActionBar tocItems={taskNavItems} />
    </PackagePageLayout>
  );
}
