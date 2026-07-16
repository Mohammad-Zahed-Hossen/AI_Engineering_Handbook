'use client';

import { RuntimeMatrixEntry } from '@/types/registry';
import { RegistryBadge } from './RegistryBadge';

interface RuntimeMatrixProps {
  runtimeMatrix: RuntimeMatrixEntry[];
}

const priorityVariants: Record<string, 'success' | 'secondary' | 'outline' | 'default'> = {
  recommended: 'success',
  supported: 'secondary',
  community: 'outline',
  experimental: 'default',
};

/**
 * Runtime Matrix component for Registry family pages.
 * Displays normalized runtime compatibility with supports/features.
 */
export default function RuntimeMatrix({ runtimeMatrix }: RuntimeMatrixProps) {
  if (!runtimeMatrix || runtimeMatrix.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-foreground">Runtime Compatibility</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-xs border border-border rounded-lg">
          <thead className="bg-muted/30">
            <tr>
              <th className="text-left p-2 font-mono text-[10px] text-muted-foreground uppercase tracking-wider">
                Runtime
              </th>
              <th className="text-left p-2 font-mono text-[10px] text-muted-foreground uppercase tracking-wider">
                Priority
              </th>
              <th className="text-left p-2 font-mono text-[10px] text-muted-foreground uppercase tracking-wider">
                Supports
              </th>
              <th className="text-left p-2 font-mono text-[10px] text-muted-foreground uppercase tracking-wider">
                Notes
              </th>
            </tr>
          </thead>
          <tbody>
            {runtimeMatrix.map((entry) => (
              <tr key={entry.runtime} className="border-t border-border">
                <td className="p-2 font-mono">
                  {entry.runtime}
                  {entry.official && <span className="text-emerald-600 ml-1">●</span>}
                </td>
                <td className="p-2">
                  <RegistryBadge 
                    variant={priorityVariants[entry.priority] || 'default'} 
                    size="xs" 
                    className="font-mono"
                  >
                    {entry.priority}
                  </RegistryBadge>
                </td>
                <td className="p-2">
                  <div className="flex flex-wrap items-center gap-1">
                    {entry.supports.map((feature) => (
                      <RegistryBadge key={feature} variant="outline" size="xs" className="font-mono">
                        {feature}
                      </RegistryBadge>
                    ))}
                  </div>
                </td>
                <td className="p-2 text-muted-foreground max-w-xs truncate">
                  {entry.notes || '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}