import { getAllPackages } from '@/lib/data';
import PackageListClient from './PackageListClient';

export default function PackagesPage() {
  const packages = getAllPackages();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-foreground">Packages</h1>
      <PackageListClient packages={packages} />
    </div>
  );
}
