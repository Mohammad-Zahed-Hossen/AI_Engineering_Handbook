import { notFound } from 'next/navigation';
import { getAllRegistryFamilyIds, getRegistryFamily, getRegistryVariantIds, getRegistryVariant } from '@/lib/data';
import ContentPageLayout from '@/components/shared/ContentPageLayout';
import { RegistryBadge, LicenseBadge, ContextBadge } from '@/components/registry/RegistryBadge';
import { Check, X } from 'lucide-react';
import { formatSize, formatParameterCount, formatContextWindow } from '@/lib/format-registry';
import DeploymentSummaryCard from '@/components/registry/DeploymentSummaryCard';
import QuickLinksCard from '@/components/registry/QuickLinksCard';
import EngineeringContinuation from '@/components/registry/EngineeringContinuation';

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

  return (
    <ContentPageLayout
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Registry', href: '/registry' },
        { label: familyData.name, href: `/registry/families/${family}` },
        { label: variantData.name },
      ]}
    >
      <div className="overflow-x-hidden space-y-6">
        {/* Variant Header */}
        <div className="space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight break-words">
              {variantData.name}
            </h1>
            <div className="flex flex-wrap items-center gap-1.5">
              <RegistryBadge variant="info" size="xs" className="font-mono whitespace-nowrap">
                {familyData.provider}
              </RegistryBadge>
              {engineeringSnapshot?.production_ready !== undefined && (
                engineeringSnapshot.production_ready ? (
                  <RegistryBadge variant="success" size="xs" className="font-mono whitespace-nowrap">
                    <Check className="h-2.5 w-2.5" />
                    Production
                  </RegistryBadge>
                ) : (
                  <RegistryBadge variant="destructive" size="xs" className="font-mono whitespace-nowrap">
                    <X className="h-2.5 w-2.5" />
                    Experimental
                  </RegistryBadge>
                )
              )}
            </div>
          </div>
          <p className="text-xs text-muted-foreground max-w-full md:max-w-2xl leading-relaxed">
            {variantData.description}
          </p>
        </div>

        {/* Key Specs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
          <div className="bg-card border border-border rounded-lg p-3">
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider break-words">Size</div>
            <div className="text-sm font-bold text-foreground font-mono min-w-0 break-all">
              {formatSize(variantData.size_mb)}
            </div>
          </div>
          {variantData.specifications?.parameter_count && (
            <div className="bg-card border border-border rounded-lg p-3">
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider break-words">Parameters</div>
              <div className="text-sm font-bold text-foreground font-mono min-w-0 break-all">
                {formatParameterCount(variantData.specifications.parameter_count)}
              </div>
            </div>
          )}
          {contextWindow && (
            <div className="bg-card border border-border rounded-lg p-3">
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider break-words">Context</div>
              <div className="text-sm font-bold text-foreground font-mono min-w-0 break-all">
                {formatContextWindow(contextWindow)}
              </div>
            </div>
          )}
          {licenseInfo && (
            <div className="bg-card border border-border rounded-lg p-3">
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider break-words">License</div>
              <div className="text-sm font-medium min-w-0">
                <LicenseBadge license={licenseInfo.name} commercial={licenseInfo.commercial_use} />
              </div>
            </div>
          )}
        </div>

        {/* Capabilities */}
        {capabilityBadges.length > 0 && (
          <div className="space-y-2">
            <h2 className="text-xs sm:text-sm font-semibold text-foreground">Capabilities</h2>
            <div className="flex flex-wrap items-center gap-1.5">
              {capabilityBadges.map(({ key, label }) => (
                <RegistryBadge key={key} variant="default" size="xs" className="font-mono whitespace-nowrap">
                  {label}
                </RegistryBadge>
              ))}
              {contextWindow && <ContextBadge contextWindow={contextWindow} />}
            </div>
          </div>
        )}

        {/* Deployment Summary - Merged hardware, deployment, and engineering knowledge */}
        <DeploymentSummaryCard
          hardware={variantData.hardware}
          deployment={variantData.deployment}
          engineeringSnapshot={engineeringSnapshot}
          formats={variantData.formats || familyData.formats}
        />

        {/* Related Models */}
        {familyData.related_models.length > 0 && (
          <div className="space-y-2">
            <h2 className="text-xs sm:text-sm font-semibold text-foreground">Related Models</h2>
            <div className="flex flex-wrap items-center gap-1.5">
              {familyData.related_models.map((rel) => (
                <RegistryBadge key={rel.id} variant="outline" size="xs" className="font-mono whitespace-nowrap">
                  {rel.id}
                </RegistryBadge>
              ))}
            </div>
          </div>
        )}

        {/* Engineering Continuation - Answers: What should I do next? */}
        {familyData.related_resources && familyData.related_resources.length > 0 && (
          <EngineeringContinuation resources={familyData.related_resources} />
        )}

        {/* Quick Links - Downloads and Documentation */}
        <QuickLinksCard
          downloads={variantData.downloads}
          references={familyData.references}
        />
      </div>
    </ContentPageLayout>
  );
}
