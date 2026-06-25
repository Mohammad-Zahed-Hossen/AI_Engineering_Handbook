import { notFound } from 'next/navigation';
import { getRegistryTasks, getRegistryByTask, getContentName, getContentPath } from '@/lib/data';
import StatusBadge from '@/components/shared/StatusBadge';
import { CodeBlock } from '@/components/shared/CodeBlock';
import { validateRegistryTask } from '@/lib/route-params';
import Link from 'next/link';

/**
 * Pre-generates tasks for the model registry paths.
 * Invoked statically during next build.
 */
export async function generateStaticParams() {
  return getRegistryTasks().map((task) => ({ task }));
}

interface PageProps {
  params: Promise<{ task: string }>;
}

export default async function RegistryTaskPage({ params }: PageProps) {
  const { task } = await params;

  const validTask = validateRegistryTask(task);
  if (!validTask) {
    notFound();
  }

  let models;
  try {
    models = getRegistryByTask(validTask);
  } catch (e) {
    if ((e as NodeJS.ErrnoException).code === 'ENOENT') {
      notFound();
    } else {
      throw e;
    }
  }

  const titles: Record<string, string> = {
    embedding: 'Embedding Models Registry',
    reranker: 'Reranker Models Registry',
    vision: 'Vision Models Registry',
    speech: 'Speech/ASR Models Registry',
    llm: 'Large Language Models Registry',
    multimodal: 'Multimodal Models Registry',
    ocr: 'OCR Models Registry',
  };

  const hasDimension = models.some((m) => m.dimension !== undefined);

  return (
    <div className="space-y-6">
      {/* Registry Header */}
      <div className="bg-card text-card-foreground border border-border p-5 rounded-lg shadow-sm select-none">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold tracking-tight text-foreground font-sans">
            {titles[validTask] || `${validTask} Registry`}
          </h1>
          <span className="bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 px-2 py-0.5 rounded text-[9px] font-semibold font-mono uppercase">
            {validTask}
          </span>
        </div>
        <p className="text-xs text-muted-foreground mt-2 max-w-2xl leading-relaxed">
          Comparison specifications, sizes, status flags, and quick instantiation commands for {validTask} model checkpoints.
        </p>
      </div>

      {/* Main Table */}
      <div className="bg-card text-card-foreground border border-border rounded-lg shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-border bg-muted/30 select-none">
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider font-sans">
            {validTask.toUpperCase()} MODEL CHECKPOINTS
          </h2>
        </div>
        {models.length === 0 ? (
          <div className="p-8 text-center text-xs text-muted-foreground select-none">
            No registry entries loaded for this task.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border text-left">
              <thead className="bg-muted/40 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider select-none font-sans">
                <tr>
                  <th className="px-4 py-2 w-[15%]">Model ID</th>
                  <th className="px-4 py-2 text-center w-[5%]">Lang</th>
                  {hasDimension && <th className="px-4 py-2 text-center w-[8%]">Dimension</th>}
                  <th className="px-4 py-2 text-center w-[8%]">Size</th>
                  <th className="px-4 py-2 text-center w-[10%]">Status</th>
                  <th className="px-4 py-2 w-[18%]">Use Case</th>
                  <th className="px-4 py-2 w-[22%]">Quick Start</th>
                  <th className="px-4 py-2 w-[14%]">Alternatives</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-[11px] font-mono align-top">
                {models.map((m) => (
                  <tr key={m.id} className="hover:bg-muted/10">
                    <td className="px-4 py-2.5 font-semibold text-foreground select-all font-mono">
                      <div>{m.model_id}</div>
                      {(() => {
                        const officialDocs = m.sources.find(
                          url => !url.includes('arxiv.org') && !url.includes('biorxiv.org') && !url.includes('researchgate.net') && !url.includes('doi.org')
                        );
                        if (officialDocs) {
                          return (
                            <a
                              href={officialDocs}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[9px] text-indigo-500 hover:underline block mt-1 font-sans font-semibold"
                            >
                              Docs &rarr;
                            </a>
                          );
                        }
                        return null;
                      })()}
                    </td>
                    <td className="px-4 py-2.5 text-center uppercase text-muted-foreground">
                      {m.language}
                    </td>
                    {hasDimension && (
                      <td className="px-4 py-2.5 text-center text-muted-foreground font-semibold">
                        {m.dimension !== undefined ? m.dimension : 'N/A'}
                      </td>
                    )}
                    <td className="px-4 py-2.5 text-center text-muted-foreground whitespace-nowrap">
                      {m.size_mb.toLocaleString()} MB
                    </td>
                    <td className="px-4 py-2.5 text-center">
                      <StatusBadge status={m.status} />
                    </td>
                    <td className="px-4 py-2.5 text-muted-foreground font-sans leading-relaxed">
                      {m.use_case}
                    </td>
                    <td className="px-4 py-2">
                      <CodeBlock code={m.quick_start} language="python" />
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="flex flex-wrap gap-1">
                        {m.alternatives && m.alternatives.length > 0 ? (
                          m.alternatives.map((alt) => {
                            const name = getContentName(alt.type, alt.id);
                            const path = getContentPath(alt.type, alt.id);

                            if (path) {
                              return (
                                <Link
                                  key={alt.id}
                                  href={path}
                                  className="px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 text-[9px] hover:underline"
                                >
                                  {name}
                                </Link>
                              );
                            }
                            return (
                              <span
                                key={alt.id}
                                className="px-1.5 py-0.5 rounded bg-secondary text-secondary-foreground border border-border text-[9px]"
                              >
                                {name}
                              </span>
                            );
                          })
                        ) : (
                          <span className="text-muted-foreground/60 text-[9px] font-sans">None</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
