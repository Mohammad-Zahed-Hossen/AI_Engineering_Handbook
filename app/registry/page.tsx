import Link from 'next/link';
import { getAllRegistryFamilies } from '@/lib/data';
import RegistryFamilyView from '@/components/registry/RegistryFamilyView';

export default function RegistryPage() {
  const families = getAllRegistryFamilies();

  // If no families exist, show empty state
  if (families.length === 0) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold text-foreground">Model Registry</h1>
        <p className="text-sm text-muted-foreground">
          No registry entries have been added yet.
        </p>
        <Link href="/" className="text-xs text-foreground hover:underline">
          ← Back to home
        </Link>
      </div>
    );
  }

  // Show the family-based view
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-foreground tracking-tight">
          Model Registry
        </h1>
        <p className="text-xs text-muted-foreground max-w-2xl leading-relaxed">
          Deployment metadata and download locations for AI models.
          Find hardware requirements, supported runtimes, and commercial usage information.
        </p>
      </div>

      {/* Statistics Dashboard */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        <div className="bg-card border border-border rounded-lg p-3">
          <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Families</div>
          <div className="text-lg font-bold text-foreground font-mono">{families.length}</div>
        </div>
        <div className="bg-card border border-border rounded-lg p-3">
          <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Providers</div>
          <div className="text-lg font-bold text-foreground font-mono">
            {new Set(families.map(f => f.provider)).size}
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-3">
          <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Production</div>
          <div className="text-lg font-bold text-emerald-600 font-mono">
            {families.filter(f => f.engineering_snapshot?.production_ready).length}
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-3">
          <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Commercial</div>
          <div className="text-lg font-bold text-indigo-600 font-mono">
            {families.filter(f => f.license_info?.commercial_use).length}
          </div>
        </div>
      </div>

      {/* Family Grid with Client-side Filtering */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Model Families</h2>
        <RegistryFamilyView families={families} />
      </div>
    </div>
  );
}
