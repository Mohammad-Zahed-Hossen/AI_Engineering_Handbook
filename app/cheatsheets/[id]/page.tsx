import { notFound } from 'next/navigation';
import { getAllCheatsheetIds, getCheatsheet } from '@/lib/data';

/**
 * Pre-generates parameters for all cheatsheet routes using the index list.
 * Invoked statically during next build.
 */
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
    if ((e as NodeJS.ErrnoException).code === 'ENOENT') {
      notFound();
    } else {
      throw e;
    }
  }

  if (!cheatsheet) {
    notFound();
  }

  const officialDocs = cheatsheet.sources.find(
    url => !url.includes('arxiv.org') && !url.includes('biorxiv.org') && !url.includes('researchgate.net') && !url.includes('doi.org')
  );

  return (
    <div className="max-w-3xl mx-auto space-y-8 select-text">
      {/* SECTION 1: Header */}
      <header className="border-b border-border pb-4 flex items-center justify-between select-none">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold tracking-tight text-foreground font-sans">
            {cheatsheet.name}
          </h1>
          <span className="bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 px-2 py-0.5 rounded text-[10px] font-semibold font-mono uppercase">
            Cheatsheet
          </span>
        </div>
        {officialDocs && (
          <a
            href={officialDocs}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-indigo-500 hover:underline font-sans font-semibold"
          >
            Official Docs &rarr;
          </a>
        )}
      </header>

      {/* SECTION 2: Cheatsheet Groups */}
      <div className="space-y-6">
        {cheatsheet.groups.map((group) => (
          <section key={group.group} className="space-y-2">
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider font-sans select-none">
              {group.group}
            </h3>
            <div className="border border-border rounded overflow-x-auto bg-card">
              <table className="min-w-full divide-y divide-border text-left">
                <thead className="bg-muted/40 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider select-none font-sans">
                  <tr>
                    <th className="px-4 py-2 w-[45%]">Function / Command</th>
                    <th className="px-4 py-2">Purpose</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border text-[11px] font-sans">
                  {group.items.map((item, idx) => (
                    <tr key={idx} className="hover:bg-muted/10">
                      <td className="px-4 py-2.5 align-top">
                        <code className="font-mono text-[10px] text-indigo-500 bg-indigo-500/5 border border-indigo-500/10 px-1.5 py-0.5 rounded break-all select-all font-semibold">
                          {item.fn}
                        </code>
                      </td>
                      <td className="px-4 py-2.5 text-muted-foreground leading-relaxed align-top">
                        {item.purpose}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ))}
      </div>

      {/* SECTION 3: Sources & References */}
      {cheatsheet.sources && cheatsheet.sources.length > 0 && (
        <section className="border-t border-border pt-4 select-none">
          <h3 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block mb-2 font-sans">
            Sources & References
          </h3>
          <ul className="list-disc pl-4 space-y-1 text-xs text-muted-foreground font-sans">
            {cheatsheet.sources.map((source, idx) => (
              <li key={idx}>
                {source.startsWith('http') ? (
                  <a href={source} target="_blank" rel="noopener noreferrer" className="hover:underline text-indigo-500">
                    {source}
                  </a>
                ) : (
                  <span>{source}</span>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

