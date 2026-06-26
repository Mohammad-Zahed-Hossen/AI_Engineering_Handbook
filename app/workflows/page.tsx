import Link from 'next/link';
import { getAllWorkflows } from '@/lib/data';

export default function WorkflowsPage() {
  const workflows = getAllWorkflows();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-foreground">Workflows</h1>
      <div className="space-y-3">
        {workflows.map(wf => (
          <Link
            key={wf.id}
            href={`/workflows/${wf.id}`}
            className="block rounded-lg border border-border bg-card p-4 hover:border-foreground/20 hover:bg-muted/30 transition-colors"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <h2 className="text-lg font-medium text-foreground">{wf.name}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{wf.overview}</p>
              </div>
              <span className="shrink-0 text-xs font-mono text-muted-foreground">{wf.category}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
