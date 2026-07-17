import Link from 'next/link';
import { getAllWorkflows } from '@/lib/data';

export default function WorkflowsPage() {
  const workflows = getAllWorkflows();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight text-foreground">Workflows</h1>
      <div className="space-y-2">
        {workflows.map(wf => (
          <Link
            key={wf.id}
            href={`/workflows/${wf.id}`}
            className="block rounded-lg border border-border bg-card p-3 hover:border-foreground/20 hover:bg-muted/30 transition-colors"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex-1 min-w-0">
                <h2 className="text-sm font-medium text-foreground">{wf.name}</h2>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] font-mono text-muted-foreground">{wf.category}</span>
                  <span className="text-[10px] font-mono text-muted-foreground/70">
                    {wf.steps.length} {wf.steps.length === 1 ? 'step' : 'steps'}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}