import { notFound } from 'next/navigation';
import { getAllCheatsheetIds, getCheatsheet, getRelatedContent } from '@/lib/data';
import ContentPageLayout from '@/components/shared/ContentPageLayout';
import MetadataBadges from '@/components/shared/MetadataBadges';
import OfficialResources from '@/components/shared/OfficialResources';
import RelatedContent from '@/components/shared/RelatedContent';
import CheatsheetEntry from '@/components/shared/CheatsheetEntry';
import { CodeBlock } from '@/components/shared/CodeBlock';
import ReadingSessionTracker from '@/components/shared/ReadingSessionTracker';
import DataTable from '@/components/shared/DataTable';

export async function generateStaticParams() {
  return getAllCheatsheetIds().map((id) => ({ id }));
}

interface PageProps {
  params: Promise<{ id: string }>;
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

  const toc = [
    { id: 'cheatsheet-header', label: cheatsheet.name },
    ...cheatsheet.entries.map((entry, idx) => ({
      id: `entry-${idx}`,
      label: entry.problem.split(' ').slice(0, 4).join(' '),
    })),
  ];

  if (cheatsheet.quick_references) {
    cheatsheet.quick_references.forEach((ref, idx) => {
      toc.push({ id: `quick-ref-${idx}`, label: ref.title });
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
      <ReadingSessionTracker href={`/cheatsheets/${cheatsheet.id}`} name={cheatsheet.name} type="cheatsheet" />
      <header className="space-y-3 border-b border-border pb-4">
        <h1>{cheatsheet.name}</h1>
        <MetadataBadges type="cheatsheet" updatedAt={cheatsheet.updated_at} />
      </header>

      <OfficialResources sources={cheatsheet.sources} githubRepo={cheatsheet.github_repo} />

      <div className="space-y-8">
        <section id="cheatsheet-header" className="space-y-2 scroll-mt-24">
          <h2>Cheatsheet</h2>
          <p className="text-xs text-muted-foreground">
            {cheatsheet.entries.length} {cheatsheet.entries.length === 1 ? 'entry' : 'entries'}
            {' — '}tap any entry to expand
          </p>
          <div className="space-y-3">
            {cheatsheet.entries.map((entry, idx) => (
              <CheatsheetEntry
                key={idx}
                entry={entry}
                idx={idx}
                id={`entry-${idx}`}
                codeBlock={<CodeBlock code={entry.snippet} language="python" />}
              />
            ))}
          </div>
        </section>


        {cheatsheet.quick_references && cheatsheet.quick_references.map((ref, refIdx) => (
          <section key={refIdx} id={`quick-ref-${refIdx}`} className="space-y-3 scroll-mt-24">
            <h2>{ref.title}</h2>
            <DataTable
              headers={ref.headers}
              rows={ref.rows}
              monoColumns={ref.headers.map((h, i) => ['api', 'attribute', 'style', 'marker', 'setting', 'parameter'].includes(h.toLowerCase()) ? i : -1).filter(i => i >= 0)}
            />
          </section>
        ))}

      </div>

      <RelatedContent items={relatedContent} />
    </ContentPageLayout>
  );
}
