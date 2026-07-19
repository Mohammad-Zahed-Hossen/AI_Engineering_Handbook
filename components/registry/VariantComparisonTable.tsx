'use client';

import { RegistryVariant } from '@/types/registry';
import { RegistryBadge, LicenseBadge, RuntimeBadge } from './RegistryBadge';
import { formatSize, formatParameterCount, formatContextWindow, formatMemory } from '@/lib/format-registry';

interface VariantComparisonTableProps {
  variants: RegistryVariant[];
}

/**
 * Comparison table component for displaying multiple variants side-by-side.
 * Mobile: Stacked cards for better readability on small screens.
 * Desktop: Table for quick comparison across variants.
 */
export default function VariantComparisonTable({ variants }: VariantComparisonTableProps) {
  if (variants.length === 0) return null;

  return (
    <>
      {/* Mobile: Stacked cards */}
      <div className="md:hidden space-y-3">
        {variants.map((variant) => {
          const contextWindow = variant.specifications?.context_window;
          const minGpu = variant.hardware?.minimum_gpu_memory;
          const recommendedRuntime = variant.deployment?.recommended_runtime;
          const productionReady = variant.engineering_snapshot?.production_ready;

          return (
            <div key={variant.id} className="bg-card border border-border rounded-lg p-3 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-foreground font-mono">{variant.name}</h3>
                {productionReady !== undefined ? (
                  productionReady ? (
                    <RegistryBadge variant="success" size="xs" className="font-mono whitespace-nowrap">
                      Production
                    </RegistryBadge>
                  ) : (
                    <RegistryBadge variant="destructive" size="xs" className="font-mono whitespace-nowrap">
                      Experimental
                    </RegistryBadge>
                  )
                ) : null}
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-muted-foreground">Size:</span>{' '}
                  <span className="font-mono">{formatSize(variant.size_mb)}</span>
                </div>
                {variant.specifications?.parameter_count && (
                  <div>
                    <span className="text-muted-foreground">Params:</span>{' '}
                    <span className="font-mono">{formatParameterCount(variant.specifications.parameter_count)}</span>
                  </div>
                )}
                {contextWindow && (
                  <div>
                    <span className="text-muted-foreground">Context:</span>{' '}
                    <span className="font-mono">{formatContextWindow(contextWindow)}</span>
                  </div>
                )}
                {minGpu && (
                  <div>
                    <span className="text-muted-foreground">Min GPU:</span>{' '}
                    <span className="font-mono">{formatMemory(minGpu)}</span>
                  </div>
                )}
                {recommendedRuntime && (
                  <div>
                    <span className="text-muted-foreground">Runtime:</span>{' '}
                    <RuntimeBadge runtime={recommendedRuntime} />
                  </div>
                )}
                {variant.license_info && (
                  <div>
                    <span className="text-muted-foreground">License:</span>{' '}
                    <LicenseBadge 
                      license={variant.license_info.name} 
                      commercial={variant.license_info.commercial_use} 
                    />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop: Table */}
      <div className="hidden md:block overflow-x-auto">
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
    </>
  );
}
