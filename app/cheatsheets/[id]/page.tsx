import { notFound } from 'next/navigation';
import { getAllCheatsheetIds, getCheatsheet, getRelatedContent } from '@/lib/data';
import ContentPageLayout from '@/components/shared/ContentPageLayout';
import MetadataBadges from '@/components/shared/MetadataBadges';
import OfficialResources from '@/components/shared/OfficialResources';
import RelatedContent from '@/components/shared/RelatedContent';
import CheatsheetEntry from '@/components/shared/CheatsheetEntry';
import ReadingSessionTracker from '@/components/shared/ReadingSessionTracker';

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

  if (cheatsheet.pyplot_vs_object_oriented_api) {
    toc.push({ id: 'pyplot-vs-oo', label: 'Pyplot vs OO API' });
  }
  if (cheatsheet.common_plot_types) {
    toc.push({ id: 'common-plot-types', label: 'Common Plot Types' });
  }
  if (cheatsheet.figure_layout_options) {
    toc.push({ id: 'figure-layout', label: 'Figure Layout Options' });
  }
  if (cheatsheet.savefig_parameters) {
    toc.push({ id: 'savefig-parameters', label: 'Savefig Parameters' });
  }
  if (cheatsheet.rcparams_quick_reference) {
    toc.push({ id: 'rcparams-reference', label: 'rcParams Reference' });
  }
  if (cheatsheet.marker_reference) {
    toc.push({ id: 'marker-reference', label: 'Marker Reference' });
  }
  if (cheatsheet.line_styles) {
    toc.push({ id: 'line-styles', label: 'Line Styles' });
  }
  if (cheatsheet.named_colors) {
    toc.push({ id: 'named-colors', label: 'Named Colors' });
  }
  if (cheatsheet.recommended_colormaps) {
    toc.push({ id: 'recommended-colormaps', label: 'Colormaps' });
  }
  if (cheatsheet.quick_references) {
    cheatsheet.quick_references.forEach((ref, idx) => {
      toc.push({ id: `quick-ref-${idx}`, label: ref.title });
    });
  }
  if (cheatsheet.performance_checklist) {
    toc.push({ id: 'performance-checklist', label: 'Performance Checklist' });
  }
  if (cheatsheet.common_errors) {
    toc.push({ id: 'common-errors', label: 'Common Errors' });
  }
  if (cheatsheet.production_checklist) {
    toc.push({ id: 'production-checklist', label: 'Production Checklist' });
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
              />
            ))}
          </div>
        </section>

        {cheatsheet.pyplot_vs_object_oriented_api && (
          <section id="pyplot-vs-oo" className="space-y-3 scroll-mt-24">
            <h2>Pyplot vs Object-Oriented API</h2>
            <div className="overflow-x-auto rounded-lg border border-border">
              <table className="w-full text-left border-collapse text-xs">
                <thead className="bg-muted/40 font-semibold text-foreground border-b border-border">
                  <tr>
                    <th className="p-3">API Interface</th>
                    <th className="p-3">Advantages</th>
                    <th className="p-3">Limitations</th>
                    <th className="p-3">Recommended Use Cases</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {cheatsheet.pyplot_vs_object_oriented_api.map((item, idx) => (
                    <tr key={idx} className="hover:bg-muted/10">
                      <td className="p-3 font-mono font-semibold text-foreground">{item.api}</td>
                      <td className="p-3 text-muted-foreground">{item.advantages}</td>
                      <td className="p-3 text-muted-foreground">{item.limitations}</td>
                      <td className="p-3 text-muted-foreground">{item.recommended_use_cases}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {cheatsheet.common_plot_types && (
          <section id="common-plot-types" className="space-y-3 scroll-mt-24">
            <h2>Common Plot Types</h2>
            <div className="overflow-x-auto rounded-lg border border-border">
              <table className="w-full text-left border-collapse text-xs">
                <thead className="bg-muted/40 font-semibold text-foreground border-b border-border">
                  <tr>
                    <th className="p-3">API Method</th>
                    <th className="p-3">Purpose</th>
                    <th className="p-3">Most Important Parameters</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {cheatsheet.common_plot_types.map((item, idx) => (
                    <tr key={idx} className="hover:bg-muted/10">
                      <td className="p-3 font-mono font-semibold text-foreground">{item.api}</td>
                      <td className="p-3 text-muted-foreground">{item.purpose}</td>
                      <td className="p-3 font-mono text-[11px] text-muted-foreground">{item.most_important_parameters}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {cheatsheet.figure_layout_options && (
          <section id="figure-layout" className="space-y-3 scroll-mt-24">
            <h2>Figure Layout Options</h2>
            <div className="overflow-x-auto rounded-lg border border-border">
              <table className="w-full text-left border-collapse text-xs">
                <thead className="bg-muted/40 font-semibold text-foreground border-b border-border">
                  <tr>
                    <th className="p-3">API / Method</th>
                    <th className="p-3">Purpose</th>
                    <th className="p-3">Best For</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {cheatsheet.figure_layout_options.map((item, idx) => (
                    <tr key={idx} className="hover:bg-muted/10">
                      <td className="p-3 font-mono font-semibold text-foreground">{item.api}</td>
                      <td className="p-3 text-muted-foreground">{item.purpose}</td>
                      <td className="p-3 text-muted-foreground">{item.best_for}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {cheatsheet.savefig_parameters && (
          <section id="savefig-parameters" className="space-y-3 scroll-mt-24">
            <h2>savefig Parameters</h2>
            <div className="overflow-x-auto rounded-lg border border-border">
              <table className="w-full text-left border-collapse text-xs">
                <thead className="bg-muted/40 font-semibold text-foreground border-b border-border">
                  <tr>
                    <th className="p-3">Parameter</th>
                    <th className="p-3">Purpose / Behavior</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {cheatsheet.savefig_parameters.map((item, idx) => (
                    <tr key={idx} className="hover:bg-muted/10">
                      <td className="p-3 font-mono font-semibold text-foreground">{item.parameter}</td>
                      <td className="p-3 text-muted-foreground">{item.purpose}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {cheatsheet.rcparams_quick_reference && (
          <section id="rcparams-reference" className="space-y-3 scroll-mt-24">
            <h2>rcParams Reference</h2>
            <div className="overflow-x-auto rounded-lg border border-border">
              <table className="w-full text-left border-collapse text-xs">
                <thead className="bg-muted/40 font-semibold text-foreground border-b border-border">
                  <tr>
                    <th className="p-3">Setting Key</th>
                    <th className="p-3">Typical Use Case</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {cheatsheet.rcparams_quick_reference.map((item, idx) => (
                    <tr key={idx} className="hover:bg-muted/10">
                      <td className="p-3 font-mono font-semibold text-foreground">{item.setting}</td>
                      <td className="p-3 text-muted-foreground">{item.use}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cheatsheet.marker_reference && (
            <section id="marker-reference" className="space-y-3 scroll-mt-24">
              <h2>Marker Reference</h2>
              <div className="overflow-x-auto rounded-lg border border-border">
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="bg-muted/40 font-semibold text-foreground border-b border-border">
                    <tr>
                      <th className="p-3 w-16">Marker</th>
                      <th className="p-3">Meaning</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {cheatsheet.marker_reference.map((item, idx) => (
                      <tr key={idx} className="hover:bg-muted/10">
                        <td className="p-3 font-mono font-semibold text-foreground">{item.marker}</td>
                        <td className="p-3 text-muted-foreground">{item.meaning}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {cheatsheet.line_styles && (
            <section id="line-styles" className="space-y-3 scroll-mt-24">
              <h2>Line Styles</h2>
              <div className="overflow-x-auto rounded-lg border border-border">
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="bg-muted/40 font-semibold text-foreground border-b border-border">
                    <tr>
                      <th className="p-3 w-16">Style</th>
                      <th className="p-3">Meaning</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {cheatsheet.line_styles.map((item, idx) => (
                      <tr key={idx} className="hover:bg-muted/10">
                        <td className="p-3 font-mono font-semibold text-foreground">{item.style}</td>
                        <td className="p-3 text-muted-foreground">{item.meaning}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cheatsheet.named_colors && (
            <section id="named-colors" className="space-y-3 scroll-mt-24">
              <h2>Named Colors</h2>
              <div className="overflow-x-auto rounded-lg border border-border">
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="bg-muted/40 font-semibold text-foreground border-b border-border">
                    <tr>
                      <th className="p-3 w-28">Color</th>
                      <th className="p-3">Typical Use Case</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {cheatsheet.named_colors.map((item, idx) => (
                      <tr key={idx} className="hover:bg-muted/10">
                        <td className="p-3 font-mono font-semibold text-foreground">{item.color}</td>
                        <td className="p-3 text-muted-foreground">{item.typical_use}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {cheatsheet.recommended_colormaps && (
            <section id="recommended-colormaps" className="space-y-3 scroll-mt-24">
              <h2>Recommended Colormaps</h2>
              <div className="overflow-x-auto rounded-lg border border-border">
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="bg-muted/40 font-semibold text-foreground border-b border-border">
                    <tr>
                      <th className="p-3 w-28">Type</th>
                      <th className="p-3">Colormaps</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {cheatsheet.recommended_colormaps.map((item, idx) => (
                      <tr key={idx} className="hover:bg-muted/10">
                        <td className="p-3 font-medium text-foreground">{item.type}</td>
                        <td className="p-3 font-mono text-[11px] text-muted-foreground">{item.colormaps}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}
        </div>

        {cheatsheet.quick_references && cheatsheet.quick_references.map((ref, refIdx) => (
          <section key={refIdx} id={`quick-ref-${refIdx}`} className="space-y-3 scroll-mt-24">
            <h2>{ref.title}</h2>
            <div className="overflow-x-auto rounded-lg border border-border">
              <table className="w-full text-left border-collapse text-xs">
                <thead className="bg-muted/40 font-semibold text-foreground border-b border-border">
                  <tr>
                    {ref.headers.map((header, idx) => (
                      <th key={idx} className="p-3">{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {ref.rows.map((row, rowIdx) => (
                    <tr key={rowIdx} className="hover:bg-muted/10">
                      {row.map((cell, cellIdx) => (
                        <td
                          key={cellIdx}
                          className={`p-3 ${
                            ['api', 'attribute', 'style', 'marker', 'setting', 'parameter'].includes(
                              ref.headers[cellIdx].toLowerCase()
                            )
                              ? 'font-mono font-semibold text-foreground'
                              : 'text-muted-foreground'
                          }`}
                        >
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ))}

        {cheatsheet.performance_checklist && (
          <section id="performance-checklist" className="space-y-3 scroll-mt-24">
            <h2>Performance Checklist</h2>
            <div className="overflow-x-auto rounded-lg border border-border">
              <table className="w-full text-left border-collapse text-xs">
                <thead className="bg-muted/40 font-semibold text-foreground border-b border-border">
                  <tr>
                    <th className="p-3 w-40">Optimization Area</th>
                    <th className="p-3">Recommendations</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {cheatsheet.performance_checklist.map((item, idx) => (
                    <tr key={idx} className="hover:bg-muted/10">
                      <td className="p-3 font-medium text-foreground">{item.area}</td>
                      <td className="p-3 text-muted-foreground">{item.recommendations}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {cheatsheet.common_errors && (
          <section id="common-errors" className="space-y-3 scroll-mt-24">
            <h2>Common Errors & Troubleshooting</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {cheatsheet.common_errors.map((item, idx) => (
                <div key={idx} className="rounded-lg border border-border bg-card p-4 space-y-2 text-xs">
                  <div className="font-semibold text-destructive dark:text-red-400">
                    ❌ {item.error}
                  </div>
                  <div>
                    <span className="font-medium text-foreground/70">Cause: </span>
                    <span className="text-muted-foreground">{item.cause}</span>
                  </div>
                  <div className="rounded bg-emerald-500/5 dark:bg-emerald-500/10 border-l-2 border-emerald-500 px-3 py-1.5 mt-2">
                    <span className="font-semibold text-emerald-700 dark:text-emerald-400">Fix: </span>
                    <span className="text-emerald-800 dark:text-emerald-300">{item.solution}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {cheatsheet.production_checklist && (
          <section id="production-checklist" className="space-y-3 scroll-mt-24">
            <h2>Production Deployment Checklist</h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
              {cheatsheet.production_checklist.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 bg-card border border-border rounded-lg p-3">
                  <span className="shrink-0 flex h-4 w-4 items-center justify-center rounded-full bg-primary/10 text-[9px] font-bold text-primary">
                    ✓
                  </span>
                  <span className="text-muted-foreground leading-normal">{item}</span>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>

      <RelatedContent items={relatedContent} />
    </ContentPageLayout>
  );
}
