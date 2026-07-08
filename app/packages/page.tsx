import Link from 'next/link';
import { getAllPackages } from '@/lib/data';
import ExpandableText from '@/components/shared/ExpandableText';

export default function PackagesPage() {
  const packages = getAllPackages();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-foreground">Packages</h1>
      <div className="space-y-3">
        {packages.map(pkg => (
          <div
            key={pkg.id}
            className="rounded-lg border border-border bg-card p-4 hover:border-foreground/20 transition-colors flex items-start justify-between gap-4"
          >
            <div className="flex-1 min-w-0">
              <Link href={`/packages/${pkg.id}`} className="group inline-block">
                <h2 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                  {pkg.name}
                </h2>
              </Link>
              <ExpandableText
                maxLines={2}
                cacheKey={`pkg-list-summary-${pkg.id}`}
                fadeClass="from-card to-transparent"
                className="mt-1.5"
              >
                <p className="text-sm text-muted-foreground leading-relaxed">{pkg.summary}</p>
              </ExpandableText>
            </div>
            <div className="shrink-0 flex flex-col items-end gap-1 pt-1 select-none">
              <span className="text-xs font-mono text-muted-foreground">v{pkg.version}</span>
              <span className="text-[10px] font-mono text-muted-foreground/70">
                {pkg.tasks.length} {pkg.tasks.length === 1 ? 'task' : 'tasks'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
