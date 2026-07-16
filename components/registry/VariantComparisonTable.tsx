'use client';

import { RegistryVariant } from '@/types/registry';
import { RegistryBadge, LicenseBadge, RuntimeBadge } from './RegistryBadge';
import { formatSize, formatParameterCount, formatContextWindow, formatMemory } from '@/lib/format-registry';

interface VariantComparisonTableProps {
  variants: RegistryVariant[];
}

/**
 * Comparison table component for displaying multiple variants side-by-side.
 * Useful for quickly comparing hardware requirements, specs, and capabilities.
 */
export default function VariantComparisonTable({ variants }: VariantComparisonTableProps) {
  if (variants.length === 0) return null;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs border border-border rounded-lg">
        <thead className="bg-muted/30">
          <tr>
            <th className="text-left p-2 font-mono text-[10px] text-muted-foreground uppercase tracking-wider">
              Variant
            </th>
            <th className="text-left p-2 font-mono text-[10px] text-muted-foreground uppercase tracking-wider">
              Size
            </th>
            <th className="text-left p-2 font-mono text-[10px] text-muted-foreground uppercase tracking-wider">
              Parameters
            </th>
            <th className="text-left p-2 font-mono text-[10px] text-muted-foreground uppercase tracking-wider">
              Context
            </th>
            <th className="text-left p-2 font-mono text-[10px] text-muted-foreground uppercase tracking-wider">
              Min GPU
            </th>
            <th className="text-left p-2 font-mono text-[10px] text-muted-foreground uppercase tracking-wider">
              Runtime
            </th>
            <th className="text-left p-2 font-mono text-[10px] text-muted-foreground uppercase tracking-wider">
              License
            </th>
            <th className="text-left p-2 font-mono text-[10px] text-muted-foreground uppercase tracking-wider">
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          {variants.map((variant) => {
            const contextWindow = variant.specifications?.context_window;
            const minGpu = variant.hardware?.minimum_gpu_memory;
            const recommendedRuntime = variant.deployment?.recommended_runtime;
            const productionReady = variant.engineering_snapshot?.production_ready;

            return (
              <tr key={variant.id} className="border-t border-border">
                <td className="p-2 font-mono">
                  {variant.name}
                </td>
                <td className="p-2 font-mono">
                  {formatSize(variant.size_mb)}
                </td>
                <td className="p-2 font-mono">
                  {formatParameterCount(variant.specifications?.parameter_count)}
                </td>
                <td className="p-2 font-mono">
                  {formatContextWindow(contextWindow)}
                </td>
                <td className="p-2 font-mono">
                  {formatMemory(minGpu)}
                </td>
                <td className="p-2">
                  {recommendedRuntime ? <RuntimeBadge runtime={recommendedRuntime} /> : '—'}
                </td>
                <td className="p-2">
                  {variant.license_info ? (
                    <LicenseBadge 
                      license={variant.license_info.name} 
                      commercial={variant.license_info.commercial_use} 
                    />
                  ) : '—'}
                </td>
                <td className="p-2">
                  {productionReady !== undefined ? (
                    productionReady ? (
                      <RegistryBadge variant="success" size="xs" className="font-mono">
                        Production
                      </RegistryBadge>
                    ) : (
                      <RegistryBadge variant="destructive" size="xs" className="font-mono">
                        Experimental
                      </RegistryBadge>
                    )
                  ) : '—'}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
