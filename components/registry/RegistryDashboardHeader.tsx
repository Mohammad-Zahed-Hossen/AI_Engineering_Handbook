'use client';

import { RegistryModel } from '@/lib/schemas/registry';
import { RegistryBadge } from './RegistryBadge';

interface RegistryDashboardHeaderProps {
  models: RegistryModel[];
  taskLabel: string;
}

export default function RegistryDashboardHeader({ models, taskLabel }: RegistryDashboardHeaderProps) {
  // Compute statistics dynamically from loaded data
  const totalModels = models.length;
  
  // Get unique families
  const families = new Set<string>();
  models.forEach(m => {
    if (m.identity?.family) families.add(m.identity.family);
  });
  const totalFamilies = families.size;
  
  // Get unique providers
  const providers = new Set<string>();
  models.forEach(m => {
    if (m.identity?.provider) providers.add(m.identity.provider);
  });
  const totalProviders = providers.size;
  
  // Count production-ready
  const productionReady = models.filter(m => m.engineering_snapshot?.production_ready === true).length;
  
  // Count commercial-friendly
  const commercialFriendly = models.filter(m => 
    m.license_info?.commercial_use === true || 
    (m.license && !m.license_info?.commercial_use && m.license.toLowerCase().includes('apache'))
  ).length;
  
  // Get last updated date
  const lastUpdated = models
    .map(m => m.updated_at)
    .sort()
    .reverse()[0] || '—';

  return (
    <div className="space-y-4">
      {/* Title and Description */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-foreground tracking-tight">
          {taskLabel} Registry
        </h1>
        <p className="text-xs text-muted-foreground max-w-2xl leading-relaxed">
          Deployment metadata and download locations for {taskLabel.toLowerCase()} models.
          Find hardware requirements, supported runtimes, and commercial usage information.
        </p>
      </div>

      {/* Statistics Dashboard */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
        <div className="bg-card border border-border rounded-lg p-3">
          <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Models</div>
          <div className="text-lg font-bold text-foreground font-mono">{totalModels}</div>
        </div>
        <div className="bg-card border border-border rounded-lg p-3">
          <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Families</div>
          <div className="text-lg font-bold text-foreground font-mono">{totalFamilies}</div>
        </div>
        <div className="bg-card border border-border rounded-lg p-3">
          <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Providers</div>
          <div className="text-lg font-bold text-foreground font-mono">{totalProviders}</div>
        </div>
        <div className="bg-card border border-border rounded-lg p-3">
          <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Production</div>
          <div className="text-lg font-bold text-emerald-600 font-mono">{productionReady}</div>
        </div>
        <div className="bg-card border border-border rounded-lg p-3">
          <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Commercial</div>
          <div className="text-lg font-bold text-indigo-600 font-mono">{commercialFriendly}</div>
        </div>
      </div>

      {/* Last Updated */}
      <div className="text-[10px] text-muted-foreground">
        Last updated: {lastUpdated}
      </div>
    </div>
  );
}