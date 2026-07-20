import { getAllPackages } from '@/lib/data';
import PackageListClient from './PackageListClient';

export default function PackagesPage() {
  const packages = getAllPackages();

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Packages</h1>
        <p className="text-xs text-muted-foreground leading-relaxed max-w-2xl">
          A comprehensive catalog of Python and other language packages for AI engineering.
          Search, filter, and explore package documentation, tasks, and quick setup guides.
        </p>
      </div>
      <PackageListClient packages={packages} />
    </div>
  );
}
