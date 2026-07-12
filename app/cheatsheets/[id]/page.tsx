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
                codeBlock={<CodeBlock code={entry.snippet} language="python" />}
              />
            ))}
          </div>
        </section>

        {cheatsheet.pyplot_vs_object_oriented_api && (
          <section id="pyplot-vs-oo" className="space-y-3 scroll-mt-24">
            <h2>Pyplot vs Object-Oriented API</h2>
            <DataTable
              headers={['API Interface', 'Advantages', 'Limitations', 'Recommended Use Cases']}
              rows={cheatsheet.pyplot_vs_object_oriented_api.map(item => [item.api, item.advantages, item.limitations, item.recommended_use_cases])}
              monoColumns={[0]}
            />
          </section>
        )}

        {cheatsheet.common_plot_types && (
          <section id="common-plot-types" className="space-y-3 scroll-mt-24">
            <h2>Common Plot Types</h2>
            <DataTable
              headers={['API Method', 'Purpose', 'Most Important Parameters']}
              rows={cheatsheet.common_plot_types.map(item => [item.api, item.purpose, item.most_important_parameters])}
              monoColumns={[0]}
              columnStyles={[undefined, undefined, 'font-mono text-[11px] text-muted-foreground']}
            />
          </section>
        )}

        {cheatsheet.figure_layout_options && (
          <section id="figure-layout" className="space-y-3 scroll-mt-24">
            <h2>Figure Layout Options</h2>
            <DataTable
              headers={['API / Method', 'Purpose', 'Best For']}
              rows={cheatsheet.figure_layout_options.map(item => [item.api, item.purpose, item.best_for])}
              monoColumns={[0]}
            />
          </section>
        )}

        {cheatsheet.savefig_parameters && (
          <section id="savefig-parameters" className="space-y-3 scroll-mt-24">
            <h2>savefig Parameters</h2>
            <DataTable
              headers={['Parameter', 'Purpose / Behavior']}
              rows={cheatsheet.savefig_parameters.map(item => [item.parameter, item.purpose])}
              monoColumns={[0]}
            />
          </section>
        )}

        {cheatsheet.rcparams_quick_reference && (
          <section id="rcparams-reference" className="space-y-3 scroll-mt-24">
            <h2>rcParams Reference</h2>
            <DataTable
              headers={['Setting Key', 'Typical Use Case']}
              rows={cheatsheet.rcparams_quick_reference.map(item => [item.setting, item.use])}
              monoColumns={[0]}
            />
          </section>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cheatsheet.marker_reference && (
            <section id="marker-reference" className="space-y-3 scroll-mt-24">
              <h2>Marker Reference</h2>
              <DataTable
                headers={['Marker', 'Meaning']}
                rows={cheatsheet.marker_reference.map(item => [item.marker, item.meaning])}
                monoColumns={[0]}
              />
            </section>
          )}

          {cheatsheet.line_styles && (
            <section id="line-styles" className="space-y-3 scroll-mt-24">
              <h2>Line Styles</h2>
              <DataTable
                headers={['Style', 'Meaning']}
                rows={cheatsheet.line_styles.map(item => [item.style, item.meaning])}
                monoColumns={[0]}
              />
            </section>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cheatsheet.named_colors && (
            <section id="named-colors" className="space-y-3 scroll-mt-24">
              <h2>Named Colors</h2>
              <DataTable
                headers={['Color', 'Typical Use Case']}
                rows={cheatsheet.named_colors.map(item => [item.color, item.typical_use])}
                monoColumns={[0]}
              />
            </section>
          )}

          {cheatsheet.recommended_colormaps && (
            <section id="recommended-colormaps" className="space-y-3 scroll-mt-24">
              <h2>Recommended Colormaps</h2>
              <DataTable
                headers={['Type', 'Colormaps']}
                rows={cheatsheet.recommended_colormaps.map(item => [item.type, item.colormaps])}
                columnStyles={['font-medium text-foreground', 'font-mono text-[11px] text-muted-foreground']}
              />
            </section>
          )}
        </div>

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

        {cheatsheet.performance_checklist && (
          <section id="performance-checklist" className="space-y-3 scroll-mt-24">
            <h2>Performance Checklist</h2>
            <DataTable
              headers={['Optimization Area', 'Recommendations']}
              rows={cheatsheet.performance_checklist.map(item => [item.area, item.recommendations])}
              columnStyles={['font-medium text-foreground', undefined]}
            />
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
