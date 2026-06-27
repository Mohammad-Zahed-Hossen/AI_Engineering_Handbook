import { notFound } from 'next/navigation';
import { getAllCheatsheetIds, getCheatsheet, getRelatedContent } from '@/lib/data';
import ContentPageLayout from '@/components/shared/ContentPageLayout';
import MetadataBadges from '@/components/shared/MetadataBadges';
import OfficialResources from '@/components/shared/OfficialResources';
import RelatedContent from '@/components/shared/RelatedContent';
import CheatsheetEntry from '@/components/shared/CheatsheetEntry';

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

  return (
    <ContentPageLayout
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Cheatsheets', href: '/cheatsheets' },
        { label: cheatsheet.name },
      ]}
      toc={cheatsheet.entries.length <= 1
        ? [{ id: 'cheatsheet-header', label: 'Cheatsheet' }]
        : [
            { id: 'cheatsheet-header', label: cheatsheet.name },
            ...cheatsheet.entries.map((entry, idx) => ({
              id: `entry-${idx}`,
              label: entry.problem.split(' ').slice(0, 4).join(' '),
            })),
          ]}
    >
      <header className="space-y-3 border-b border-border pb-4">
        <h1>{cheatsheet.name}</h1>
        <MetadataBadges type="cheatsheet" updatedAt={cheatsheet.updated_at} />
      </header>

      <OfficialResources sources={cheatsheet.sources} githubRepo={cheatsheet.github_repo} />

      <div className="space-y-6">
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
              />
            ))}
          </div>
        </section>
      </div>

      <RelatedContent items={relatedContent} />
    </ContentPageLayout>
  );
}
