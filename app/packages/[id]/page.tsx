import { notFound } from 'next/navigation';
import { getAllPackageIds, getPackage, getContentName, getContentPath } from '@/lib/data';
import { CodeBlock } from '@/components/shared/CodeBlock';
import SectionCard from '@/components/shared/SectionCard';
import Link from 'next/link';

/**
 * Pre-generates parameters for all package routes using the index list.
 * Invoked statically during next build.
 */
export async function generateStaticParams() {
  return getAllPackageIds().map((id) => ({ id }));
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function PackageDetailPage({ params }: PageProps) {
  const { id } = await params;

  let pkg;
  try {
    pkg = getPackage(id);
  } catch (e) {
    if ((e as NodeJS.ErrnoException).code === 'ENOENT') {
      notFound();
    } else {
      throw e;
    }
  }

  if (!pkg) {
    notFound();
  }

  const officialDocs = pkg.sources.find(
    url => !url.includes('arxiv.org') && !url.includes('biorxiv.org') && !url.includes('researchgate.net') && !url.includes('doi.org')
  );
  const researchPaper = pkg.sources.find(
    url => url.includes('arxiv.org') || url.includes('biorxiv.org') || url.includes('researchgate.net') || url.includes('doi.org')
  );

  return (
    <div className="max-w-3xl mx-auto space-y-8 select-text">
      {/* SECTION 1: Header */}
      <header className="border-b border-border pb-4 flex items-center justify-between select-none">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold tracking-tight text-foreground font-sans">
            {pkg.name}
          </h1>
          <span className="bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 px-2 py-0.5 rounded text-[10px] font-semibold font-mono">
            v{pkg.version}
          </span>
        </div>
        {officialDocs && (
          <a
            href={officialDocs}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-indigo-500 hover:underline font-sans font-semibold animate-in fade-in duration-200"
          >
            Official Docs &rarr;
          </a>
        )}
      </header>

      {/* SECTION 2: Quick Setup */}
      <section className="space-y-4">
        <h3 className="text-xs font-bold text-foreground uppercase tracking-wider font-sans select-none">
          Quick Setup
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1 font-sans select-none">
              Install Command
            </span>
            <CodeBlock code={pkg.install} language="bash" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1 font-sans select-none">
              Typical Import
            </span>
            <CodeBlock code={pkg.import_as} language="python" />
          </div>
        </div>
      </section>

      {/* SECTION 3: Summary */}
      <section className="text-xs leading-relaxed text-muted-foreground max-w-2xl font-sans">
        {pkg.summary}
      </section>

      {/* SECTION 3.5: Official Resources */}
      {(officialDocs || researchPaper || pkg.github_repo) && (
        <section className="border border-border p-4 rounded bg-card select-none space-y-2">
          <h3 className="text-xs font-bold text-foreground uppercase tracking-wider font-sans">
            Official Resources
          </h3>
          <div className="flex flex-wrap gap-4 text-xs font-sans">
            {officialDocs && (
              <a
                href={officialDocs}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-indigo-500 hover:underline font-semibold"
              >
                <span>🌐</span> Documentation &rarr;
              </a>
            )}
            {researchPaper && (
              <a
                href={researchPaper}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-indigo-500 hover:underline font-semibold"
              >
                <span>📄</span> Original Paper &rarr;
              </a>
            )}
            {pkg.github_repo && (
              <a
                href={pkg.github_repo}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-indigo-500 hover:underline font-semibold"
              >
                <span>💻</span> GitHub Repository &rarr;
              </a>
            )}
          </div>
        </section>
      )}

      {/* SECTION 4: Sections & SECTION 5: Gotchas */}
      <section className="space-y-6">
        {pkg.sections.map((section) => (
          <SectionCard
            key={section.name}
            title={section.name}
            subtitle={`API interfaces inside ${section.name}`}
          >
            <div className="space-y-6">
              {/* Function list */}
              <div className="border border-border rounded overflow-x-auto bg-card">
                <table className="min-w-full divide-y divide-border text-left">
                  <thead className="bg-muted/40 text-[9px] font-semibold text-muted-foreground uppercase tracking-wider select-none font-sans">
                    <tr>
                      <th className="px-4 py-2 w-1/4">Function Name</th>
                      <th className="px-4 py-2 w-1/3">Purpose</th>
                      <th className="px-4 py-2">Example</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border text-[11px]">
                    {section.functions.map((fn, idx) => (
                      <tr key={idx} className="hover:bg-muted/10 font-sans">
                        <td className="px-4 py-2.5 font-mono text-indigo-500 font-semibold align-top break-all select-all">
                          {fn.fn}
                        </td>
                        <td className="px-4 py-2.5 text-muted-foreground align-top leading-relaxed font-sans">
                          {fn.purpose}
                          <div className="mt-1 text-[8px] font-bold uppercase text-muted-foreground/75 select-none">
                            Category: <span className="font-mono text-foreground/80">{fn.category}</span>
                          </div>
                        </td>
                        <td className="px-4 py-2.5 align-top">
                          <CodeBlock code={fn.example} language="python" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Gotchas (rendered inside corresponding section card) */}
              {section.gotchas && section.gotchas.length > 0 && (
                <div className="bg-amber-500/5 border-l-2 border-amber-500 p-3 rounded-r text-[11px] text-amber-700 dark:text-amber-400">
                  <span className="font-semibold block uppercase text-[9px] tracking-wider mb-1 select-none font-sans">
                    Gotchas & Common Mistakes
                  </span>
                  <ul className="list-disc pl-4 space-y-1 font-sans">
                    {section.gotchas.map((gotcha, idx) => (
                      <li key={idx} className="leading-relaxed">{gotcha}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </SectionCard>
        ))}
      </section>

      {/* SECTION 6: Alternatives */}
      {pkg.alternatives && pkg.alternatives.length > 0 && (
        <section className="border-t border-border pt-4 select-none">
          <h3 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block mb-2 font-sans">
            Alternative Packages
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {pkg.alternatives.map((alt) => {
              const name = getContentName(alt.type, alt.id);
              const path = getContentPath(alt.type, alt.id);

              if (path) {
                return (
                  <Link
                    key={alt.id}
                    href={path}
                    className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 text-[10px] font-mono font-semibold hover:underline flex items-center gap-1"
                  >
                    <span className="text-[8px] bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 px-1 py-0.2 rounded font-sans uppercase">
                      {alt.type}
                    </span>
                    {name}
                  </Link>
                );
              }
              return (
                <span
                  key={alt.id}
                  className="px-2 py-0.5 rounded bg-secondary text-secondary-foreground border border-border text-[10px] font-mono flex items-center gap-1"
                >
                  <span className="text-[8px] bg-muted text-muted-foreground px-1 py-0.2 rounded font-sans uppercase">
                    {alt.type}
                  </span>
                  {name}
                </span>
              );
            })}
          </div>
        </section>
      )}

      {/* SECTION 7: Sources */}
      {pkg.sources && pkg.sources.length > 0 && (
        <section className="border-t border-border pt-4 select-none">
          <h3 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block mb-2 font-sans">
            Sources & References
          </h3>
          <ul className="list-disc pl-4 space-y-1 text-xs text-muted-foreground font-sans">
            {pkg.sources.map((source, idx) => (
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
