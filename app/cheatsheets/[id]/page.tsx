import { notFound } from 'next/navigation';
import { getAllCheatsheetIds, getCheatsheet, getRelatedContent } from '@/lib/data';
import ContentPageLayout from '@/components/shared/ContentPageLayout';
import MetadataBadges from '@/components/shared/MetadataBadges';
import OfficialResources from '@/components/shared/OfficialResources';
import RelatedContent from '@/components/shared/RelatedContent';

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
      toc={[{ id: 'cheatsheet', label: 'Cheatsheet' }]}
    >
      <header className="space-y-3 border-b border-border pb-4">
        <h1>{cheatsheet.name}</h1>
        <MetadataBadges type="cheatsheet" updatedAt={cheatsheet.updated_at} />
      </header>

      <OfficialResources sources={cheatsheet.sources} githubRepo={cheatsheet.github_repo} />

      <div className="space-y-6">
        <section id="cheatsheet" className="space-y-2 scroll-mt-24">
          <h2>Cheatsheet</h2>
          <div className="rounded-lg border border-border overflow-x-auto bg-card">
            <table className="min-w-full divide-y divide-border text-left text-sm">
              <thead className="bg-muted/40 text-[10px] font-semibold text-muted-foreground uppercase">
                <tr>
                  <th className="px-4 py-2 w-[25%]">Problem</th>
                  <th className="px-4 py-2 w-[25%]">Trigger</th>
                  <th className="px-4 py-2 w-[25%]">Snippet</th>
                  <th className="px-4 py-2">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {cheatsheet.entries.map((entry, idx) => (
                  <tr key={idx} className="hover:bg-muted/10 align-top">
                    <td className="px-4 py-3 text-muted-foreground">{entry.problem}</td>
                    <td className="px-4 py-3 text-muted-foreground">{entry.trigger}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      <pre className="whitespace-pre-wrap font-mono">{entry.snippet}</pre>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground space-y-2">
                      <p>{entry.minimal_notes}</p>
                      <p className="text-[11px] text-muted-foreground/70">Common bug: {entry.common_bug}</p>
                      <a
                        href={entry.docs_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline"
                      >
                        Source docs
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <RelatedContent items={relatedContent} />
    </ContentPageLayout>
  );
}
