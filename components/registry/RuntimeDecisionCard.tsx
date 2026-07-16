'use client';

import { RuntimeMatrixEntry } from '@/types/registry';
import { RegistryBadge } from './RegistryBadge';

interface RuntimeDecisionCardProps {
  runtimeMatrix: RuntimeMatrixEntry[];
  recommendedRuntime?: string;
}

const priorityConfig: Record<string, { variant: 'success' | 'secondary' | 'outline' | 'default', label: string }> = {
  recommended: { variant: 'success', label: 'Recommended' },
  supported: { variant: 'secondary', label: 'Supported' },
  community: { variant: 'outline', label: 'Community' },
  experimental: { variant: 'default', label: 'Experimental' },
};

/**
 * Runtime Decision Card for Registry family pages.
 * Answers: Why this runtime? When not to use it? Which alternative?
 * Transforms RuntimeMatrix from specification table to decision support.
 */
export default function RuntimeDecisionCard({
  runtimeMatrix,
  recommendedRuntime,
}: RuntimeDecisionCardProps) {
  if (!runtimeMatrix || runtimeMatrix.length === 0) return null;

  // Sort by priority (recommended first)
  const sorted = [...runtimeMatrix].sort((a, b) => {
    const priorityOrder = { recommended: 0, supported: 1, community: 2, experimental: 3 };
    return (priorityOrder[a.priority] || 4) - (priorityOrder[b.priority] || 4);
  });

  return (
    <div className="space-y-3">
      <h2 className="text-sm font-semibold text-foreground">Runtime Decision</h2>
      
      <div className="grid gap-2">
        {sorted.map((entry) => {
          const config = priorityConfig[entry.priority] || priorityConfig.supported;
          const isRecommended = entry.runtime === recommendedRuntime;
          
          return (
            <div key={entry.runtime} className="border border-border rounded-lg p-2.5">
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-mono font-medium text-foreground">
                      {entry.runtime}
                    </span>
                    {isRecommended && (
                      <RegistryBadge variant="success" size="xs" className="font-mono">
                        Primary
                      </RegistryBadge>
                    )}
                  </div>
                  
                  {entry.notes && (
                    <p className="text-xs text-muted-foreground pl-0.5">
                      {entry.notes}
                    </p>
                  )}
                  
                  {entry.supports.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1 pl-0.5">
                      {entry.supports.map((feature) => (
                        <RegistryBadge key={feature} variant="muted" size="xs" className="font-mono">
                          {feature}
                        </RegistryBadge>
                      ))}
                    </div>
                  )}
                </div>
                
                <RegistryBadge variant={config.variant} size="xs" className="font-mono shrink-0">
                  {config.label}
                </RegistryBadge>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}