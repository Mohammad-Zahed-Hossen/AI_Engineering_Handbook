import Link from 'next/link';
import { getAllPackages } from '@/lib/data';

export default function PackagesPage() {
  const packages = getAllPackages();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-foreground">Packages</h1>
      <div className="space-y-3">
        {packages.map(pkg => (
          <Link
            key={pkg.id}
            href={`/packages/${pkg.id}`}
            className="block rounded-lg border border-border bg-card p-4 hover:border-foreground/20 hover:bg-muted/30 transition-colors"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <h2 className="text-lg font-medium text-foreground">{pkg.name}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{pkg.summary}</p>
              </div>
              <span className="shrink-0 text-xs font-mono text-muted-foreground">v{pkg.version}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
