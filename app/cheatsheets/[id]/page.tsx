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
      toc={cheatsheet.entries.length <= 1
        ? [{ id: 'cheatsheet-header', label: 'Cheatsheet' }]
        : [
            { id: 'cheatsheet-header', label: cheatsheet.name },
            ...cheatsheet.entries.slice(0, 12).map((entry, idx) => ({
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
          <div className="space-y-3">
            {cheatsheet.entries.map((entry, idx) => (
              <div
                key={idx}
                id={`entry-${idx}`}
                className="scroll-mt-24 rounded-lg border border-border bg-card overflow-hidden"
              >
                {/* Entry header — Problem statement */}
                <div className="px-4 py-2.5 border-b border-border bg-muted/30 flex items-start justify-between gap-4">
                  <p className="text-sm font-semibold text-foreground leading-snug">
                    {entry.problem}
                  </p>
                  <span className="shrink-0 text-[9px] font-mono text-muted-foreground/60 pt-0.5">
                    #{idx + 1}
                  </span>
                </div>

                {/* Entry body */}
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] divide-y lg:divide-y-0 lg:divide-x divide-border">
                  
                  {/* Left: Trigger + Notes + Bug */}
                  <div className="p-4 space-y-3">
                    {entry.trigger && (
                      <div>
                        <span className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground block mb-1">
                          When to use
                        </span>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {entry.trigger}
                        </p>
                      </div>
                    )}
                    {entry.minimal_notes && (
                      <div>
                        <span className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground block mb-1">
                          Note
                        </span>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {entry.minimal_notes}
                        </p>
                      </div>
                    )}
                    {entry.common_bug && (
                      <div className="rounded border-l-2 border-amber-500 bg-amber-500/5 px-3 py-2">
                        <span className="text-[9px] font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400 block mb-1">
                          Common bug
                        </span>
                        <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
                          {entry.common_bug}
                        </p>
                      </div>
                    )}
                    {entry.docs_url && (
                      <a
                        href={entry.docs_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] text-primary hover:underline block"
                      >
                        Docs ↗
                      </a>
                    )}
                  </div>

                  {/* Right: Code snippet */}
                  <div className="p-4">
                    <span className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground block mb-2">
                      Snippet
                    </span>
                    <div className="relative rounded-md bg-zinc-950 border border-zinc-800 font-mono">
                      <pre className="overflow-x-auto p-3 text-[11px] text-zinc-200 leading-relaxed">
                        <code>{entry.snippet}</code>
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <RelatedContent items={relatedContent} />
    </ContentPageLayout>
  );
}
