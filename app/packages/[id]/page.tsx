import { notFound } from 'next/navigation';
import { getAllPackageIds, getPackage } from '@/lib/data';
import { CodeBlock } from '@/components/shared/CodeBlock';
import SectionCard from '@/components/shared/SectionCard';
import ContentPageLayout from '@/components/shared/ContentPageLayout';
import MetadataBadges from '@/components/shared/MetadataBadges';
import OfficialResources from '@/components/shared/OfficialResources';
import AlternativesList from '@/components/shared/AlternativesList';

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

      <section id="setup" className="space-y-3 scroll-mt-6">
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

      <section id="summary" className="scroll-mt-6">
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
            <div id={section.name.toLowerCase().replace(/\s+/g, '-')} className="space-y-4 scroll-mt-6">
              <div className="rounded-lg border border-border overflow-x-auto bg-card">
                <table className="min-w-full divide-y divide-border text-left text-sm">
                  <thead className="bg-muted/40 text-[10px] font-semibold text-muted-foreground uppercase">
                    <tr>
                      <th className="px-4 py-2">Function</th>
                      <th className="px-4 py-2">Purpose</th>
                      <th className="px-4 py-2">Example</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {section.functions.map((fn, idx) => (
                      <tr key={idx} className="hover:bg-muted/10">
                        <td className="px-4 py-2 font-mono text-primary align-top">{fn.fn}</td>
                        <td className="px-4 py-2 text-muted-foreground align-top">{fn.purpose}</td>
                        <td className="px-4 py-2 align-top">
                          <CodeBlock code={fn.example} language="python" />
                        </td>
                      </tr>
                    ))}
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

      <AlternativesList alternatives={pkg.alternatives} title="Alternative Packages" />
    </ContentPageLayout>
  );
}
