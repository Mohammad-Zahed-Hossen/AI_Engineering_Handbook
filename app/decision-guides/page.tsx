import Link from 'next/link';
import { getAllDecisionGuides } from '@/lib/data';

export default function DecisionGuidesPage() {
  const decisionGuides = getAllDecisionGuides();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight text-foreground">Decision Guides</h1>
      <div className="space-y-3">
        {decisionGuides.map(dg => (
          <Link
            key={dg.id}
            href={`/decision-guides/${dg.id}`}
            className="block rounded-lg border border-border bg-card p-4 hover:border-foreground/20 hover:bg-muted/30 transition-colors"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <h2 className="text-sm font-medium text-foreground">{dg.title || dg.id}</h2>
                <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                  {dg.description}
                </p>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-muted-foreground">
                {dg.category}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}