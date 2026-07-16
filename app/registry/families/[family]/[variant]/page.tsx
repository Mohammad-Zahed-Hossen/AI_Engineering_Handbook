import { notFound } from 'next/navigation';
import { getAllRegistryFamilyIds, getRegistryFamily, getRegistryVariantIds, getRegistryVariant } from '@/lib/data';
import ContentPageLayout from '@/components/shared/ContentPageLayout';
import { RegistryBadge, LicenseBadge, RuntimeBadge, QuantizationBadge, ContextBadge } from '@/components/registry/RegistryBadge';
import { ExternalLink, Check, X } from 'lucide-react';
import { formatSize, formatParameterCount, formatContextWindow, formatMemory } from '@/lib/format-registry';

/**
 * Pre-generates variant params for static rendering.
 */
export async function generateStaticParams() {
  const families = getAllRegistryFamilyIds();
  const params: { family: string; variant: string }[] = [];
  
  for (const family of families) {
    const variantIds = getRegistryVariantIds(family);
    for (const variant of variantIds) {
      params.push({ family, variant });
    }
  }
  
  return params;
}

interface PageProps {
  params: Promise<{ family: string; variant: string }>;
}

export default async function RegistryVariantPage({ params }: PageProps) {
  const { family, variant } = await params;

  let familyData;
  let variantData;
  
  try {
    familyData = getRegistryFamily(family);
    variantData = getRegistryVariant(family, variant);
  } catch {
    notFound();
  }

  // Merge family and variant data (variant inherits from family)
  const capabilities = variantData.capabilities || familyData.capabilities;
  const licenseInfo = variantData.license_info || familyData.license_info;
  const engineeringSnapshot = variantData.engineering_snapshot || familyData.engineering_snapshot;

  // Get capability badges
  const capabilityBadges = [
    { key: 'instruction_tuned', label: 'Instruction' },
    { key: 'reasoning', label: 'Reasoning' },
    { key: 'vision', label: 'Vision' },
    { key: 'multilingual', label: 'Multilingual' },
    { key: 'tool_calling', label: 'Tool' },
    { key: 'function_calling', label: 'Function' },
    { key: 'thinking_model', label: 'Thinking' },
  ].filter(({ key }) => capabilities?.[key as keyof typeof capabilities] === true);

  // Get context window
  const contextWindow = variantData.specifications?.context_window || capabilities?.context_window;

  // Get hardware requirements
  const minGpu = variantData.hardware?.minimum_gpu_memory;
  const recGpu = variantData.hardware?.recommended_gpu_memory;
  const minRam = variantData.hardware?.minimum_ram;

  // Get deployment info
  const recommendedRuntime = variantData.deployment?.recommended_runtime;
  const quantizations = variantData.deployment?.quantizations || [];
  const productionReady = engineeringSnapshot?.production_ready;

  return (
    <ContentPageLayout
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Registry', href: '/registry' },
        { label: familyData.name, href: `/registry/families/${family}` },
        { label: variantData.name },
      ]}
    >
      <div className="space-y-6">
        {/* Variant Header */}
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h1 className="text-2xl font-bold text-foreground tracking-tight">
              {variantData.name}
            </h1>
            <div className="flex items-center gap-1.5 shrink-0">
              <RegistryBadge variant="info" size="xs" className="font-mono">
                {familyData.provider}
              </RegistryBadge>
              {productionReady !== undefined && (
                productionReady ? (
                  <RegistryBadge variant="success" size="xs" className="font-mono">
                    <Check className="h-2.5 w-2.5" />
                    Production
                  </RegistryBadge>
                ) : (
                  <RegistryBadge variant="destructive" size="xs" className="font-mono">
                    <X className="h-2.5 w-2.5" />
                    Experimental
                  </RegistryBadge>
                )
              )}
            </div>
          </div>
          <p className="text-xs text-muted-foreground max-w-2xl leading-relaxed">
            {variantData.description}
          </p>
        </div>

        {/* Key Specs Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <div className="bg-card border border-border rounded-lg p-3">
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Size</div>
            <div className="text-sm font-bold text-foreground font-mono">
              {formatSize(variantData.size_mb)}
            </div>
          </div>
          {variantData.specifications?.parameter_count && (
            <div className="bg-card border border-border rounded-lg p-3">
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Parameters</div>
              <div className="text-sm font-bold text-foreground font-mono">
                {formatParameterCount(variantData.specifications.parameter_count)}
              </div>
            </div>
          )}
          {contextWindow && (
            <div className="bg-card border border-border rounded-lg p-3">
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Context</div>
              <div className="text-sm font-bold text-foreground font-mono">
                {formatContextWindow(contextWindow)}
              </div>
            </div>
          )}
          {licenseInfo && (
            <div className="bg-card border border-border rounded-lg p-3">
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider">License</div>
              <div className="text-sm font-medium">
                <LicenseBadge license={licenseInfo.name} commercial={licenseInfo.commercial_use} />
              </div>
            </div>
          )}
        </div>

        {/* Capabilities */}
        {capabilityBadges.length > 0 && (
          <div className="space-y-2">
            <h2 className="text-sm font-semibold text-foreground">Capabilities</h2>
            <div className="flex flex-wrap items-center gap-1">
              {capabilityBadges.map(({ key, label }) => (
                <RegistryBadge key={key} variant="default" size="xs" className="font-mono">
                  {label}
                </RegistryBadge>
              ))}
              {contextWindow && <ContextBadge contextWindow={contextWindow} />}
            </div>
          </div>
        )}

        {/* Hardware Requirements */}
        {(minGpu || recGpu || minRam) && (
          <div className="space-y-2">
            <h2 className="text-sm font-semibold text-foreground">Hardware Requirements</h2>
            <div className="flex flex-wrap items-center gap-1.5">
              {minGpu && (
                <RegistryBadge variant="outline" size="xs" className="font-mono">
                  Min: {formatMemory(minGpu)} GPU
                </RegistryBadge>
              )}
              {recGpu && (
                <RegistryBadge variant="outline" size="xs" className="font-mono">
                  Rec: {formatMemory(recGpu)} GPU
                </RegistryBadge>
              )}
              {minRam && (
                <RegistryBadge variant="outline" size="xs" className="font-mono">
                  RAM: {formatMemory(minRam)}
                </RegistryBadge>
              )}
            </div>
          </div>
        )}

        {/* Deployment Options */}
        {recommendedRuntime && (
          <div className="space-y-2">
            <h2 className="text-sm font-semibold text-foreground">Deployment</h2>
            <div className="space-y-2">
              <div className="text-xs">
                <span className="text-muted-foreground">Recommended Runtime:</span>{' '}
                <RuntimeBadge runtime={recommendedRuntime} />
              </div>
              {quantizations.length > 0 && (
                <div className="flex flex-wrap items-center gap-1">
                  <span className="text-xs text-muted-foreground">Quantizations:</span>
                  {quantizations.slice(0, 6).map((q) => (
                    <QuantizationBadge key={q} quantization={q} />
                  ))}
                  {quantizations.length > 6 && (
                    <span className="text-[10px] text-muted-foreground">+{quantizations.length - 6}</span>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Downloads */}
        {variantData.downloads.length > 0 && (
          <div className="space-y-2">
            <h2 className="text-sm font-semibold text-foreground">Download Links</h2>
            <div className="flex flex-wrap gap-1.5">
              {variantData.downloads.map((dl, idx) => (
                <a
                  key={idx}
                  href={dl.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-2 py-1 text-[10px] font-medium rounded border border-border bg-secondary text-secondary-foreground hover:bg-muted transition-colors"
                >
                  {dl.platform}
                  {dl.official && <span className="text-emerald-600">●</span>}
                  <ExternalLink className="h-2.5 w-2.5" />
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Engineering Snapshot */}
        {engineeringSnapshot && (
          <div className="space-y-2">
            <h2 className="text-sm font-semibold text-foreground">Engineering Notes</h2>
            <div className="space-y-2">
              {engineeringSnapshot.best_for.length > 0 && (
                <div>
                  <span className="text-xs text-muted-foreground">Best for:</span>
                  <div className="flex flex-wrap items-center gap-1 mt-1">
                    {engineeringSnapshot.best_for.map((use) => (
                      <RegistryBadge key={use} variant="outline" size="xs" className="font-mono">
                        {use}
                      </RegistryBadge>
                    ))}
                  </div>
                </div>
              )}
              {engineeringSnapshot.avoid_for.length > 0 && (
                <div>
                  <span className="text-xs text-muted-foreground">Avoid for:</span>
                  <div className="flex flex-wrap items-center gap-1 mt-1">
                    {engineeringSnapshot.avoid_for.map((use) => (
                      <RegistryBadge key={use} variant="outline" size="xs" className="font-mono">
                        {use}
                      </RegistryBadge>
                    ))}
                  </div>
                </div>
              )}
              {engineeringSnapshot.deployment_complexity && (
                <div className="text-xs">
                  <span className="text-muted-foreground">Complexity:</span>{' '}
                  <span className="text-foreground font-mono">{engineeringSnapshot.deployment_complexity}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Related Models */}
        {familyData.related_models.length > 0 && (
          <div className="space-y-2">
            <h2 className="text-sm font-semibold text-foreground">Related Models</h2>
            <div className="flex flex-wrap items-center gap-1">
              {familyData.related_models.map((rel) => (
                <RegistryBadge key={rel.id} variant="outline" size="xs" className="font-mono">
                  {rel.id}
                </RegistryBadge>
              ))}
            </div>
          </div>
        )}
      </div>
    </ContentPageLayout>
  );
}