import { notFound } from 'next/navigation';
import { getAllCheatsheetIds, getCheatsheet, getRelatedContent, getCanonicalRelationshipsForEntity, resolveGraphNodes, shouldRenderKnowledgeGraph } from '@/lib/data';
import ContentPageLayout from '@/components/shared/ContentPageLayout';
import MetadataBadges from '@/components/shared/MetadataBadges';
import OfficialResources from '@/components/shared/OfficialResources';
import RelatedContent from '@/components/shared/RelatedContent';
import CheatsheetEntryList from './CheatsheetEntryList';
import DataTable from '@/components/shared/DataTable';
import ReadingSessionTracker from '@/components/shared/ReadingSessionTracker';
import FavoriteButton from '@/components/shared/FavoriteButton';
import KnowledgeGraphPanel from '@/components/shared/KnowledgeGraphPanel';

export async function generateStaticParams() {
  return getAllCheatsheetIds().map((id) => ({ id }));
}

interface PageProps {
  params: Promise<{ id: string }>;
}

function slugify(value: string) {
  return value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

export default async function CheatsheetDetailPage({ params }: PageProps) {
  const { id } = await params;

  let cheatsheet;
  try {
    cheatsheet = getCheatsheet(id);
  } catch (e) {
    if ((e as NodeJS.ErrnoException).code === 'ENOENT') notFound();
    throw e;
  }
  const relatedContent = getRelatedContent('cheatsheet', cheatsheet.id);
  const rawGraphItems = getCanonicalRelationshipsForEntity('cheatsheet', cheatsheet.id);
  const graphNodes = resolveGraphNodes(rawGraphItems, 'cheatsheet', cheatsheet.id).filter(n => n.type !== 'package_task');
  const shouldShowGraph = shouldRenderKnowledgeGraph(relatedContent, graphNodes);

  const seenAnchorIds = new Map<string, number>();

  const resolvedEntries = cheatsheet.entries.map((entry) => {
    const baseSlug = slugify(entry.problem);
    const count = (seenAnchorIds.get(baseSlug) || 0) + 1;
    seenAnchorIds.set(baseSlug, count);
    const anchorId = count === 1 ? `entry-${baseSlug}` : `entry-${baseSlug}-${count}`;

    return {
      ...entry,
      anchorId,
    };
  }) as Parameters<typeof CheatsheetEntryList>[0]['entries'];

  // Build TOC with unique anchor IDs
  const toc = [
    { id: 'cheatsheet-header', label: cheatsheet.name },
    ...resolvedEntries.map((entry) => ({
      id: entry.anchorId,
      label: entry.problem.split(' ').slice(0, 6).join(' '),
    })),
  ];

  if (cheatsheet.quick_references) {
    cheatsheet.quick_references.forEach((ref) => {
      const baseSlug = slugify(ref.title);
      const key = `quick-ref-${baseSlug}`;
      const count = (seenAnchorIds.get(key) || 0) + 1;
      seenAnchorIds.set(key, count);
      const refId = count === 1 ? key : `${key}-${count}`;

      toc.push({ id: refId, label: ref.title });
    });
  }

  return (
    <ContentPageLayout
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Cheatsheets', href: '/cheatsheets' },
        { label: cheatsheet.name },
      ]}
      toc={toc}
    >
      <ReadingSessionTracker id={cheatsheet.id} href={`/cheatsheets/${cheatsheet.id}`} name={cheatsheet.name} type="cheatsheet" />
      <header className="space-y-3 border-b border-border pb-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h1>{cheatsheet.name}</h1>
            <MetadataBadges type="cheatsheet" updatedAt={cheatsheet.updated_at} />
          </div>
          <FavoriteButton type="cheatsheet" id={cheatsheet.id} name={cheatsheet.name} href={`/cheatsheets/${cheatsheet.id}`} />
        </div>
      </header>

      <div className="space-y-8">
        <section id="cheatsheet-header" className="space-y-2 scroll-mt-24">
          <h2>Cheatsheet</h2>
          <p className="text-xs text-muted-foreground">
            {cheatsheet.entries.length} {cheatsheet.entries.length === 1 ? 'entry' : 'entries'}
            {' — '}tap any entry to expand
          </p>
          <CheatsheetEntryList entries={resolvedEntries} />
        </section>

        {cheatsheet.quick_references && cheatsheet.quick_references.map((ref) => (
          <section key={slugify(ref.title)} id={`quick-ref-${slugify(ref.title)}`} className="space-y-3 scroll-mt-24">
            <h2>{ref.title}</h2>
            <DataTable
              headers={ref.headers}
              rows={ref.rows}
              monoColumns={ref.monoColumns || ref.headers.map((h, i) => ['api', 'attribute', 'style', 'marker', 'setting', 'parameter'].includes(h.toLowerCase()) ? i : -1).filter(i => i >= 0)}
            />
          </section>
        ))}
      </div>

      <RelatedContent items={relatedContent} />

      {shouldShowGraph && <KnowledgeGraphPanel nodes={graphNodes} />}

      {/* Further Study - Moved to bottom */}
      <OfficialResources sources={cheatsheet.sources} githubRepo={cheatsheet.github_repo} />
    </ContentPageLayout>
  );
}
