import { notFound } from 'next/navigation';
import { getAllCheatsheetIds, getCheatsheet } from '@/lib/data';
import ContentPageLayout from '@/components/shared/ContentPageLayout';
import MetadataBadges from '@/components/shared/MetadataBadges';
import OfficialResources from '@/components/shared/OfficialResources';

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

  return (
    <ContentPageLayout
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Cheatsheets', href: '/cheatsheets/pytorch' },
        { label: cheatsheet.name },
      ]}
      toc={cheatsheet.groups.map(g => ({
        id: g.group.toLowerCase().replace(/\s+/g, '-'),
        label: g.group,
      }))}
    >
      <header className="space-y-3 border-b border-border pb-4">
        <h1>{cheatsheet.name}</h1>
        <MetadataBadges type="cheatsheet" updatedAt={cheatsheet.updated_at} />
      </header>

      <OfficialResources sources={cheatsheet.sources} githubRepo={cheatsheet.github_repo} />

      <div className="space-y-6">
        {cheatsheet.groups.map(group => (
          <section
            key={group.group}
            id={group.group.toLowerCase().replace(/\s+/g, '-')}
            className="space-y-2 scroll-mt-6"
          >
            <h2>{group.group}</h2>
            <div className="rounded-lg border border-border overflow-x-auto bg-card">
              <table className="min-w-full divide-y divide-border text-left text-sm">
                <thead className="bg-muted/40 text-[10px] font-semibold text-muted-foreground uppercase">
                  <tr>
                    <th className="px-4 py-2 w-[45%]">Function / Command</th>
                    <th className="px-4 py-2">Purpose</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {group.items.map((item, idx) => (
                    <tr key={idx} className="hover:bg-muted/10">
                      <td className="px-4 py-2 align-top">
                        <code className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-xs text-primary">
                          {item.fn}
                        </code>
                      </td>
                      <td className="px-4 py-2 text-muted-foreground align-top">{item.purpose}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ))}
      </div>
    </ContentPageLayout>
  );
}
