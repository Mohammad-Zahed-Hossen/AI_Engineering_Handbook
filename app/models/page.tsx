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
              <h3 className="text-sm font-medium text-foreground">{m.name}</h3>
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
              <h3 className="text-sm font-medium text-foreground">{m.name}</h3>
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
              <h3 className="text-sm font-medium text-foreground">{m.name}</h3>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
