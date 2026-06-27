import Link from 'next/link';
import { getAllModels } from '@/lib/data';
import { ModelCategory } from '@/types/model';

export default function ModelsPage() {
  const mlModels = getAllModels('ml' as ModelCategory);
  const dlModels = getAllModels('dl' as ModelCategory);
  const llmModels = getAllModels('llm' as ModelCategory);

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold text-foreground">Models</h1>

      <section className="space-y-3">
        <h2 className="text-xl font-medium text-foreground">ML Models</h2>
        <div className="space-y-2">
          {mlModels.map(m => (
            <Link
              key={m.id}
              href={`/models/ml/${m.id}`}
              className="block rounded-lg border border-border bg-card p-3 hover:border-foreground/20 hover:bg-muted/30 transition-colors"
            >
              <div className="flex items-start justify-between gap-2 mb-1">
                <h3 className="text-sm font-medium text-foreground">{m.name}</h3>
                <span className={[
                  "shrink-0 text-[9px] font-mono px-1 rounded capitalize",
                  m.inference_speed === 'fast' ? 'text-emerald-500' :
                  m.inference_speed === 'medium' ? 'text-amber-500' : 'text-rose-500'
                ].join(' ')}>
                  {m.inference_speed}
                </span>
              </div>
              {m.use_when && (
                <p className="text-[10px] text-muted-foreground line-clamp-1 leading-relaxed mb-1.5">
                  {m.use_when}
                </p>
              )}
              <div className="flex flex-wrap gap-1">
                {m.problem_types.map(pt => (
                  <span
                    key={pt}
                    className="px-1 py-0 rounded bg-secondary border border-border text-[8px] font-mono capitalize text-muted-foreground"
                  >
                    {pt}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-medium text-foreground">DL Models</h2>
        <div className="space-y-2">
          {dlModels.map(m => (
            <Link
              key={m.id}
              href={`/models/dl/${m.id}`}
              className="block rounded-lg border border-border bg-card p-3 hover:border-foreground/20 hover:bg-muted/30 transition-colors"
            >
              <div className="flex items-start justify-between gap-2 mb-1">
                <h3 className="text-sm font-medium text-foreground">{m.name}</h3>
                <span className={[
                  "shrink-0 text-[9px] font-mono px-1 rounded capitalize",
                  m.inference_speed === 'fast' ? 'text-emerald-500' :
                  m.inference_speed === 'medium' ? 'text-amber-500' : 'text-rose-500'
                ].join(' ')}>
                  {m.inference_speed}
                </span>
              </div>
              {m.use_when && (
                <p className="text-[10px] text-muted-foreground line-clamp-1 leading-relaxed mb-1.5">
                  {m.use_when}
                </p>
              )}
              <div className="flex flex-wrap gap-1">
                {m.problem_types.map(pt => (
                  <span
                    key={pt}
                    className="px-1 py-0 rounded bg-secondary border border-border text-[8px] font-mono capitalize text-muted-foreground"
                  >
                    {pt}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-medium text-foreground">LLM Models</h2>
        <div className="space-y-2">
          {llmModels.map(m => (
            <Link
              key={m.id}
              href={`/models/llm/${m.id}`}
              className="block rounded-lg border border-border bg-card p-3 hover:border-foreground/20 hover:bg-muted/30 transition-colors"
            >
              <div className="flex items-start justify-between gap-2 mb-1">
                <h3 className="text-sm font-medium text-foreground">{m.name}</h3>
                <span className={[
                  "shrink-0 text-[9px] font-mono px-1 rounded capitalize",
                  m.inference_speed === 'fast' ? 'text-emerald-500' :
                  m.inference_speed === 'medium' ? 'text-amber-500' : 'text-rose-500'
                ].join(' ')}>
                  {m.inference_speed}
                </span>
              </div>
              {m.use_when && (
                <p className="text-[10px] text-muted-foreground line-clamp-1 leading-relaxed mb-1.5">
                  {m.use_when}
                </p>
              )}
              <div className="flex flex-wrap gap-1">
                {m.problem_types.map(pt => (
                  <span
                    key={pt}
                    className="px-1 py-0 rounded bg-secondary border border-border text-[8px] font-mono capitalize text-muted-foreground"
                  >
                    {pt}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
