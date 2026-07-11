import Link from 'next/link';
import { getAllDebugGuides } from '@/lib/data';

export default function DebugGuidesPage() {
  const debugGuides = getAllDebugGuides();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-foreground">Debug Guides</h1>
      <div className="space-y-3">
        {debugGuides.map(dg => (
          <Link
            key={dg.id}
            href={`/debug-guides/${dg.id}`}
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