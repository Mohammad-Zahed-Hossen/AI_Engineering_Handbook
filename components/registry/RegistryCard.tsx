'use client';

import { RegistryModel } from '@/lib/schemas/registry';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { RegistryBadge, ProviderBadge, StatusBadge, LicenseBadge, RuntimeBadge, QuantizationBadge, ContextBadge, CapabilityBadge } from './RegistryBadge';
import { ExternalLink } from 'lucide-react';

interface RegistryCardProps {
  model: RegistryModel;
}

export default function RegistryCard({ model }: RegistryCardProps) {
  const {
    id,
    name,
    identity,
    capabilities,
    deployment,
    hardware,
    downloads,
    license_info,
    status,
    engineering_snapshot,
    size_mb,
  } = model;

  // Get provider from identity or fallback
  const provider = identity?.provider || 'Unknown';
  
  // Get license info
  const licenseName = license_info?.name || model.license || 'Unknown';
  const commercialUse = license_info?.commercial_use;

  // Get context window
  const contextWindow = capabilities?.context_window;

  // Get hardware requirements
  const minGpu = hardware?.minimum_gpu_memory;
  const recGpu = hardware?.recommended_gpu_memory;
  const minRam = hardware?.minimum_ram;

  // Get deployment info
  const recommendedRuntime = deployment?.recommended_runtime;
  const quantizations = deployment?.quantizations || [];
  const productionReady = engineering_snapshot?.production_ready;

  // Get capabilities for badges
  const capabilityBadges = [
    { key: 'instruction_tuned', label: 'Instruction' },
    { key: 'reasoning', label: 'Reasoning' },
    { key: 'vision', label: 'Vision' },
    { key: 'multilingual', label: 'Multilingual' },
    { key: 'tool_calling', label: 'Tool' },
    { key: 'function_calling', label: 'Function' },
    { key: 'thinking_model', label: 'Thinking' },
  ].filter(({ key }) => capabilities?.[key as keyof typeof capabilities] === true);

  // Get downloads (prefer new downloads array, fallback to legacy link)
  const downloadList = downloads.length > 0 
    ? downloads 
    : model.link 
      ? [{ platform: 'HuggingFace', url: model.link as string, official: true }] 
      : [];

  return (
    <Card size="sm" className="flex flex-col h-full">
      {/* Top: Model name, provider, status, task */}
      <div className="px-3.5 pt-3.5 pb-2">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-xs font-semibold text-foreground font-mono leading-tight">
            {identity?.family && identity?.variant 
              ? `${identity.family} ${identity.variant}${identity.checkpoint ? ` ${identity.checkpoint}` : ''}`
              : name}
          </h3>
          <div className="flex items-center gap-1.5 shrink-0">
            <ProviderBadge provider={provider} />
            <StatusBadge status={status?.maintenance_status} />
          </div>
        </div>

        {/* Capability badges */}
        {capabilityBadges.length > 0 && (
          <div className="flex flex-wrap items-center gap-1 mb-2">
            {capabilityBadges.map(({ key, label }) => (
              <RegistryBadge key={key} variant="default" size="xs" className="font-mono">
                {label}
              </RegistryBadge>
            ))}
            {contextWindow && <ContextBadge contextWindow={contextWindow} />}
          </div>
        )}

        {/* Key specs */}
        <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[10px]">
          <div className="text-muted-foreground">Size</div>
          <div className="text-foreground font-mono text-right">{size_mb ? `${(size_mb / 1000).toFixed(1)} GB` : '—'}</div>
          
          <div className="text-muted-foreground">License</div>
          <div className="text-right"><LicenseBadge license={licenseName} commercial={commercialUse} /></div>
          
          {recommendedRuntime && (
            <>
              <div className="text-muted-foreground">Runtime</div>
              <div className="text-right"><RuntimeBadge runtime={recommendedRuntime} /></div>
            </>
          )}
        </div>
      </div>

      {/* Middle: Hardware & Deployment */}
      <CardContent className="py-2 px-3.5 space-y-2">
        {/* Hardware Block */}
        {(minGpu || recGpu || minRam) && (
          <div className="space-y-1">
            <div className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider">Hardware</div>
            <div className="flex flex-wrap items-center gap-1.5">
              {minGpu && (
                <RegistryBadge variant="outline" size="xs" className="font-mono">
                  Min: {minGpu >= 1000 ? `${(minGpu / 1000).toFixed(0)}GB` : `${minGpu}MB`}
                </RegistryBadge>
              )}
              {recGpu && (
                <RegistryBadge variant="outline" size="xs" className="font-mono">
                  Rec: {recGpu >= 1000 ? `${(recGpu / 1000).toFixed(0)}GB` : `${recGpu}MB`}
                </RegistryBadge>
              )}
              {minRam && (
                <RegistryBadge variant="outline" size="xs" className="font-mono">
                  RAM: {minRam >= 1000 ? `${(minRam / 1000).toFixed(0)}GB` : `${minRam}MB`}
                </RegistryBadge>
              )}
            </div>
          </div>
        )}

        {/* Deployment Block */}
        {quantizations.length > 0 && (
          <div className="space-y-1">
            <div className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider">Quantizations</div>
            <div className="flex flex-wrap items-center gap-1">
              {quantizations.slice(0, 4).map((q) => (
                <QuantizationBadge key={q} quantization={q} />
              ))}
              {quantizations.length > 4 && (
                <span className="text-[9px] text-muted-foreground">+{quantizations.length - 4}</span>
              )}
            </div>
          </div>
        )}

        {/* Engineering Snapshot */}
        {engineering_snapshot && (
          <div className="space-y-1">
            <div className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider">Deployment</div>
            <div className="text-[10px] text-foreground">
              {productionReady !== undefined && (
                <span className={productionReady ? 'text-emerald-600' : 'text-rose-600'}>
                  {productionReady ? 'Production Ready' : 'Not Production Ready'}
                </span>
              )}
              {engineering_snapshot.deployment_complexity && (
                <span className="text-muted-foreground"> • {engineering_snapshot.deployment_complexity}</span>
              )}
            </div>
          </div>
        )}
      </CardContent>

      {/* Bottom: Download buttons */}
      <CardFooter className="px-3.5 py-2 flex flex-col items-start gap-2">
        {downloadList.length > 0 ? (
          <div className="flex flex-wrap gap-1.5 w-full">
            {downloadList.slice(0, 3).map((dl, idx) => (
              <a
                key={idx}
                href={dl.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 min-w-[80px] inline-flex items-center justify-center gap-1 px-2 py-1 text-[10px] font-medium rounded border border-border bg-secondary text-secondary-foreground hover:bg-muted transition-colors"
              >
                {dl.platform}
                <ExternalLink className="h-2.5 w-2.5" />
              </a>
            ))}
            {downloadList.length > 3 && (
              <span className="text-[9px] text-muted-foreground self-center">
                +{downloadList.length - 3} more
              </span>
            )}
          </div>
        ) : (
          <span className="text-[10px] text-muted-foreground">No download links</span>
        )}
      </CardFooter>
    </Card>
  );
}