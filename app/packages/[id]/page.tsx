import { Fragment } from 'react';
import { notFound } from 'next/navigation';
import { getAllPackageIds, getPackage, getRelatedContent } from '@/lib/data';
import { CodeBlock } from '@/components/shared/CodeBlock';
import SectionCard from '@/components/shared/SectionCard';
import ContentPageLayout from '@/components/shared/ContentPageLayout';
import MetadataBadges from '@/components/shared/MetadataBadges';
import OfficialResources from '@/components/shared/OfficialResources';
import RelatedContent from '@/components/shared/RelatedContent';

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
    if ((e as NodeJS.ErrnoException).code === 'ENOENT') notFound();
    throw e;
  }

  const toc = [
    { id: 'setup', label: 'Quick Setup' },
    { id: 'summary', label: 'Summary' },
    ...pkg.sections.map(s => ({ id: s.name.toLowerCase().replace(/\s+/g, '-'), label: s.name })),
  ];
  const relatedContent = getRelatedContent('package', pkg.id);

  return (
    <ContentPageLayout
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Packages', href: '/packages/numpy' },
        { label: pkg.name },
      ]}
      toc={toc}
    >
      <header className="space-y-3 border-b border-border pb-4">
        <h1>{pkg.name}</h1>
        <MetadataBadges type="package" updatedAt={pkg.updated_at} version={pkg.version} />
      </header>

      <section id="setup" className="space-y-3 scroll-mt-24">
        <h2>Quick Setup</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-[10px] font-semibold uppercase text-muted-foreground mb-1">Install</h3>
            <CodeBlock code={pkg.install} language="bash" />
          </div>
          <div>
            <h3 className="text-[10px] font-semibold uppercase text-muted-foreground mb-1">Import</h3>
            <CodeBlock code={pkg.import_as} language="python" />
          </div>
        </div>
      </section>

      <section id="summary" className="scroll-mt-24">
        <p className="content-prose text-sm text-muted-foreground">{pkg.summary}</p>
      </section>

      <OfficialResources sources={pkg.sources} githubRepo={pkg.github_repo} />

      <div className="space-y-6">
        {pkg.sections.map(section => (
          <SectionCard
            key={section.name}
            title={section.name}
            subtitle={`API reference for ${section.name}`}
          >
            <div id={section.name.toLowerCase().replace(/\s+/g, '-')} className="space-y-4 scroll-mt-24">
              <div className="rounded-lg border border-border overflow-x-auto bg-card">
                <table className="min-w-[760px] divide-y divide-border text-left text-sm">
                  <thead className="bg-muted/40 text-[10px] font-semibold text-muted-foreground uppercase">
                    <tr>
                      <th className="w-[28%] px-3 py-2">Function</th>
                      <th className="w-[32%] px-3 py-2">Purpose</th>
                      <th className="px-3 py-2">Example</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {section.functions.map((fn, idx) => {
                      const functionKey = `${section.name}-${fn.fn}-${idx}`;
                      const hasExtendedFields = 
                        (fn.common_errors && fn.common_errors.length > 0) ||
                        fn.performance_note ||
                        (fn.related_fns && fn.related_fns.length > 0);

                      return (
                        <Fragment key={functionKey}>
                          <tr className="hover:bg-muted/10">
                            <td className="px-3 py-2 align-top">
                              <div className="flex items-start gap-2">
                                <code className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[11px] leading-relaxed text-primary">
                                  {fn.fn}
                                </code>
                                {fn.docs_url && (
                                  <a
                                    href={fn.docs_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    title="Official documentation"
                                    className="mt-0.5 shrink-0 text-[11px] text-muted-foreground hover:text-foreground"
                                  >
                                    Docs
                                  </a>
                                )}
                              </div>
                            </td>
                            <td className="px-3 py-2 text-muted-foreground align-top leading-relaxed">{fn.purpose}</td>
                            <td className="px-3 py-2 align-top">
                              <CodeBlock code={fn.example} language="python" />
                            </td>
                          </tr>
                          {hasExtendedFields && (
                            <tr className="bg-muted/20">
                              <td colSpan={3} className="px-3 py-3">
                                <div className="flex flex-wrap gap-4">
                                  {fn.common_errors && fn.common_errors.length > 0 && (
                                    <div className="flex-1 min-w-[200px] border-l-2 border-amber-600 bg-amber-600/5 p-3 rounded-r">
                                      <h3 className="text-[10px] font-semibold uppercase mb-1 text-amber-800 dark:text-amber-300">Common Errors</h3>
                                      <ul className="list-disc pl-4 space-y-1 text-xs text-amber-800 dark:text-amber-300">
                                        {fn.common_errors.map((error, errIdx) => (
                                          <li key={errIdx}>{error}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                  {fn.performance_note && (
                                    <div className="flex-1 min-w-[200px] border-l-2 border-blue-600 bg-blue-600/5 p-3 rounded-r">
                                      <h3 className="text-[10px] font-semibold uppercase mb-1 text-blue-800 dark:text-blue-300">Performance</h3>
                                      <p className="text-xs text-blue-800 dark:text-blue-300">{fn.performance_note}</p>
                                    </div>
                                  )}
                                  {fn.related_fns && fn.related_fns.length > 0 && (
                                    <div className="flex-1 min-w-[200px] p-3">
                                      <h3 className="text-[10px] font-semibold uppercase mb-1 text-muted-foreground">See Also</h3>
                                      <div className="flex flex-wrap gap-1.5">
                                        {fn.related_fns.map((relatedFn, relIdx) => (
                                          <span key={relIdx} className="text-[10px] font-mono px-1.5 py-0.5 bg-muted rounded text-muted-foreground">
                                            {relatedFn}
                                          </span>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </td>
                            </tr>
                          )}
                        </Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              {section.gotchas.length > 0 && (
                <div className="border-l-2 border-amber-500 bg-amber-500/5 p-3 rounded-r text-sm text-amber-800 dark:text-amber-300">
                  <h3 className="text-[10px] font-semibold uppercase mb-1">Gotchas</h3>
                  <ul className="list-disc pl-4 space-y-1">
                    {section.gotchas.map((gotcha, idx) => (
                      <li key={idx}>{gotcha}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </SectionCard>
        ))}
      </div>

      <RelatedContent items={relatedContent} />
    </ContentPageLayout>
  );
}
