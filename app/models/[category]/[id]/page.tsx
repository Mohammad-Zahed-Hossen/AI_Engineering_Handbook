import { notFound } from 'next/navigation';
import { getModelIds, getModel, getContentName, getContentPath } from '@/lib/data';
import { ModelCategory } from '@/types/model';
import { CodeBlock } from '@/components/shared/CodeBlock';
import Link from 'next/link';
import { validateModelCategory } from '@/lib/route-params';

/**
 * Pre-generates parameters for all category-id model pairs.
 * Invoked statically during next build. Reads lists from meta indices.
 */
export async function generateStaticParams() {
  const categories: ModelCategory[] = ['ml', 'dl', 'llm'];
  const params: { category: string; id: string }[] = [];

  for (const category of categories) {
    try {
      const ids = getModelIds(category);
      for (const id of ids) {
        params.push({ category, id });
      }
    } catch (e) {
      console.error(`[generateStaticParams] Failed to load category '${category}':`, e);
      throw e;
    }
  }

  return params;
}

interface PageProps {
  params: Promise<{ category: string; id: string }>;
}

export default async function ModelDetailPage({ params }: PageProps) {
  const { category, id } = await params;

  // Validate the model category segment
  const validCategory = validateModelCategory(category);
  if (!validCategory) {
    notFound();
  }

  let model;
  try {
    model = getModel(validCategory, id);
  } catch (e) {
    if ((e as NodeJS.ErrnoException).code === 'ENOENT') {
      notFound();
    } else {
      throw e;
    }
  }

  if (!model) {
    notFound();
  }

  const officialDocs = model.sources.find(
    url => !url.includes('arxiv.org') && !url.includes('biorxiv.org') && !url.includes('researchgate.net') && !url.includes('doi.org')
  );
  const researchPaper = model.sources.find(
    url => url.includes('arxiv.org') || url.includes('biorxiv.org') || url.includes('researchgate.net') || url.includes('doi.org')
  );

  return (
    <div className="max-w-3xl mx-auto space-y-8 select-text">
      {/* SECTION 1: Header */}
      <header className="border-b border-border pb-4">
        <h1 className="text-2xl font-bold tracking-tight text-foreground font-sans">
          {model.name}
        </h1>
        <div className="flex flex-wrap items-center gap-2 mt-2 select-none">
          <span className="bg-primary text-primary-foreground text-[10px] font-semibold font-mono uppercase px-2 py-0.5 rounded">
            {model.category}
          </span>
          {model.problem_types.map((pt) => (
            <span
              key={pt}
              className="bg-secondary text-secondary-foreground border border-border text-[10px] font-mono capitalize px-2 py-0.5 rounded"
            >
              {pt}
            </span>
          ))}
        </div>
      </header>

      {/* SECTION 2: Summary */}
      <section className="text-xs leading-relaxed text-muted-foreground max-w-2xl font-sans">
        {model.summary}
      </section>

      {/* SECTION 2.5: Official Resources */}
      {(officialDocs || researchPaper || model.github_repo) && (
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
            {model.github_repo && (
              <a
                href={model.github_repo}
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

      {/* SECTION 3: Decision Guide */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 select-none">
        <div className="border border-border p-4 rounded bg-card">
          <h3 className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-2 font-sans">
            Use When
          </h3>
          <p className="text-[11px] leading-relaxed text-muted-foreground font-sans">
            {model.use_when}
          </p>
        </div>
        <div className="border border-border p-4 rounded bg-card">
          <h3 className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider mb-2 font-sans">
            Avoid When
          </h3>
          <p className="text-[11px] leading-relaxed text-muted-foreground font-sans">
            {model.avoid_when}
          </p>
        </div>
      </section>

      {/* SECTION 4: Pros vs Cons */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border border-border p-4 rounded bg-card">
          <h3 className="text-xs font-bold text-foreground uppercase tracking-wider mb-2 font-sans select-none">
            Pros
          </h3>
          <ul className="list-disc pl-4 space-y-1 text-[11px] text-muted-foreground leading-relaxed font-sans">
            {model.pros.map((pro, idx) => (
              <li key={idx}>{pro}</li>
            ))}
          </ul>
        </div>
        <div className="border border-border p-4 rounded bg-card">
          <h3 className="text-xs font-bold text-foreground uppercase tracking-wider mb-2 font-sans select-none">
            Cons
          </h3>
          <ul className="list-disc pl-4 space-y-1 text-[11px] text-muted-foreground leading-relaxed font-sans">
            {model.cons.map((con, idx) => (
              <li key={idx}>{con}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* SECTION 5: Performance Overview */}
      <section className="border border-border p-4 rounded bg-card select-none space-y-3">
        <h3 className="text-xs font-bold text-foreground uppercase tracking-wider font-sans">
          Performance Overview
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="bg-secondary/40 p-2 rounded border border-border/60">
            <span className="text-[9px] uppercase font-bold text-muted-foreground block mb-1">
              Training Speed
            </span>
            <span className="text-xs font-mono font-semibold capitalize text-foreground">
              {model.training_speed}
            </span>
          </div>
          <div className="bg-secondary/40 p-2 rounded border border-border/60">
            <span className="text-[9px] uppercase font-bold text-muted-foreground block mb-1">
              Inference Speed
            </span>
            <span className="text-xs font-mono font-semibold capitalize text-foreground">
              {model.inference_speed}
            </span>
          </div>
          <div className="bg-secondary/40 p-2 rounded border border-border/60">
            <span className="text-[9px] uppercase font-bold text-muted-foreground block mb-1">
              Memory Usage
            </span>
            <span className="text-xs font-mono font-semibold capitalize text-foreground">
              {model.memory_usage}
            </span>
          </div>
          <div className="bg-secondary/40 p-2 rounded border border-border/60">
            <span className="text-[9px] uppercase font-bold text-muted-foreground block mb-1">
              Interpretability
            </span>
            <span className="text-xs font-mono font-semibold capitalize text-foreground">
              {model.interpretability}
            </span>
          </div>
        </div>
      </section>

      {/* SECTION 6: Key Hyperparameters */}
      {model.key_hyperparams && model.key_hyperparams.length > 0 && (
        <section className="space-y-2">
          <h3 className="text-xs font-bold text-foreground uppercase tracking-wider font-sans select-none">
            Key Hyperparameters
          </h3>
          <div className="border border-border rounded overflow-x-auto bg-card">
            <table className="min-w-full divide-y divide-border text-left">
              <thead className="bg-muted/40 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider select-none font-sans">
                <tr>
                  <th className="px-4 py-2 w-1/4">Name</th>
                  <th className="px-4 py-2 w-1/4">Default</th>
                  <th className="px-4 py-2">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-[11px] font-sans">
                {model.key_hyperparams.map((hp) => (
                  <tr key={hp.name} className="hover:bg-muted/10">
                    <td className="px-4 py-2.5 font-mono text-indigo-500 font-semibold">
                      {hp.name}
                    </td>
                    <td className="px-4 py-2.5 font-mono font-medium text-foreground">
                      {hp.default === null ? 'null' : String(hp.default)}
                    </td>
                    <td className="px-4 py-2.5 text-muted-foreground leading-relaxed">
                      {hp.note}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* SECTION 7: Quick Start */}
      <section className="space-y-2">
        <h3 className="text-xs font-bold text-foreground uppercase tracking-wider font-sans select-none">
          Quick Start
        </h3>
        <CodeBlock code={model.quick_start} language="python" />
      </section>

      {/* SECTION 8: Alternatives */}
      {model.alternatives && model.alternatives.length > 0 && (
        <section className="border-t border-border pt-4 select-none">
          <h3 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block mb-2 font-sans">
            Alternative Models
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {model.alternatives.map((alt) => {
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
    </div>
  );
}
