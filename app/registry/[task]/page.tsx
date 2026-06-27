import { notFound } from 'next/navigation';
import { getRegistryTasks, getRegistryByTask } from '@/lib/data';
import { validateRegistryTask } from '@/lib/route-params';

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
          Lightweight navigation index for {validTask} model checkpoints with size information.
        </p>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3">
        {models.length === 0 ? (
          <div className="p-8 text-center text-xs text-muted-foreground select-none">
            No registry entries loaded for this task.
          </div>
        ) : (
          models.map((m) => (
            <div
              key={m.id}
              className="rounded-lg border border-border bg-card p-4"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="text-sm font-semibold text-foreground font-mono select-all">
                  {m.id}
                </span>
                <span className="shrink-0 text-[9px] font-mono px-1.5 py-0.5 rounded border border-border bg-muted text-muted-foreground uppercase">
                  {m.task}
                </span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs text-muted-foreground">
                  {m.size_mb.toLocaleString()} MB
                </span>
                {typeof m.link === 'string' ? (
                  <a
                    href={m.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-indigo-500 hover:underline font-semibold"
                  >
                    View &rarr;
                  </a>
                ) : (
                  <span className="text-muted-foreground/60 text-[9px]">
                    Missing: {m.link.reason || 'N/A'}
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block bg-card text-card-foreground border border-border rounded-lg shadow-sm overflow-hidden">
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
                  <th className="px-4 py-2 w-[30%]">Model ID</th>
                  <th className="px-4 py-2 text-center w-[20%]">Task</th>
                  <th className="px-4 py-2 text-center w-[20%]">Size (MB)</th>
                  <th className="px-4 py-2 w-[30%]">Link</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-[11px] font-mono align-top">
                {models.map((m) => (
                  <tr key={m.id} className="hover:bg-muted/10">
                    <td className="px-4 py-2.5 font-semibold text-foreground select-all font-mono">
                      {m.id}
                    </td>
                    <td className="px-4 py-2.5 text-center uppercase text-muted-foreground">
                      {m.task}
                    </td>
                    <td className="px-4 py-2.5 text-center text-muted-foreground whitespace-nowrap">
                      {m.size_mb.toLocaleString()} MB
                    </td>
                    <td className="px-4 py-2.5">
                      {typeof m.link === 'string' ? (
                        <a
                          href={m.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] text-indigo-500 hover:underline font-sans font-semibold"
                        >
                          View &rarr;
                        </a>
                      ) : (
                        <span className="text-muted-foreground/60 text-[9px] font-sans">
                          Missing: {m.link.reason || 'N/A'}
                        </span>
                      )}
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
