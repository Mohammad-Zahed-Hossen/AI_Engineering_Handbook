'use client';

import { RegistryModel } from '@/lib/schemas/registry';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { RegistryBadge, ProviderBadge, StatusBadge, LicenseBadge, RuntimeBadge, QuantizationBadge, ContextBadge } from './RegistryBadge';
import { ExternalLink, Check, X } from 'lucide-react';

interface RegistryCardProps {
  model: RegistryModel;
}

export default function RegistryCard({ model }: RegistryCardProps) {
  const {
    name,
    identity,
    architecture,
    specifications,
    formats,
    ecosystem,
    references,
    related_models,
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
  const contextWindow = specifications?.context_window || capabilities?.context_window;

  // Get hardware requirements
  const minGpu = hardware?.minimum_gpu_memory;
  const recGpu = hardware?.recommended_gpu_memory;
  const minRam = hardware?.minimum_ram;

  // Get deployment info
  const recommendedRuntime = deployment?.recommended_runtime;
  const quantizations = deployment?.quantizations || [];
  const productionReady = engineering_snapshot?.production_ready;
  const bestFor = engineering_snapshot?.best_for || [];
  const avoidFor = engineering_snapshot?.avoid_for || [];

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

  // Hardware summary for quick scanning
  const hardwareSummary = minGpu 
    ? `Min: ${minGpu >= 1000 ? `${(minGpu / 1000).toFixed(0)}GB` : `${minGpu}MB`} GPU`
    : '';

  // Group references by category
  const referencesByCategory = references.reduce((acc, ref) => {
    if (!acc[ref.category]) acc[ref.category] = [];
    acc[ref.category].push(ref);
    return acc;
  }, {} as Record<string, typeof references>);

  // Get ecosystem badges
  const ecosystemBadges = Object.entries(ecosystem || {})
    .filter(([, val]) => val?.supported)
    .map(([key]) => key);

  return (
    <Card size="sm" className="flex flex-col h-full">
      {/* Top: Model name, provider, status, production badge */}
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

        {/* Production Status */}
        {productionReady !== undefined && (
          <div className="flex items-center gap-1 mb-2">
            {productionReady ? (
              <RegistryBadge variant="success" size="xs" className="font-mono">
                <Check className="h-2.5 w-2.5" />
                Production
              </RegistryBadge>
            ) : (
              <RegistryBadge variant="destructive" size="xs" className="font-mono">
                <X className="h-2.5 w-2.5" />
                Experimental
              </RegistryBadge>
            )}
          </div>
        )}

        {/* Hardware Summary */}
        {hardwareSummary && (
          <div className="text-[10px] text-muted-foreground mb-2 font-mono">
            {hardwareSummary}
            {recGpu && ` • Rec: ${recGpu >= 1000 ? `${(recGpu / 1000).toFixed(0)}GB` : `${recGpu}MB`} GPU`}
          </div>
        )}

        {/* Architecture Type Badge */}
        {architecture?.architecture_type && (
          <div className="flex flex-wrap items-center gap-1 mb-2">
            <RegistryBadge variant="info" size="xs" className="font-mono">
              {architecture.architecture_type}
            </RegistryBadge>
            {architecture.transformer_type && (
              <RegistryBadge variant="muted" size="xs" className="font-mono">
                {architecture.transformer_type}
              </RegistryBadge>
            )}
          </div>
        )}

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
          
          {specifications?.parameter_count && (
            <>
              <div className="text-muted-foreground">Params</div>
              <div className="text-foreground font-mono text-right">{(specifications.parameter_count / 1000).toFixed(0)}B</div>
            </>
          )}
          
          {recommendedRuntime && (
            <>
              <div className="text-muted-foreground">Runtime</div>
              <div className="text-right"><RuntimeBadge runtime={recommendedRuntime} /></div>
            </>
          )}
        </div>
      </div>

      {/* Middle: Organized Sections */}
      <CardContent className="py-2 px-3.5 space-y-2">
        {/* Engineering Snapshot */}
        {(bestFor.length > 0 || avoidFor.length > 0 || engineering_snapshot?.deployment_complexity) && (
          <div className="space-y-1">
            <div className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider">Engineering Snapshot</div>
            {bestFor.length > 0 && (
              <div className="flex flex-wrap items-center gap-1">
                <span className="text-[9px] text-muted-foreground">Best:</span>
                {bestFor.slice(0, 3).map((use) => (
                  <RegistryBadge key={use} variant="outline" size="xs" className="font-mono">
                    {use}
                  </RegistryBadge>
                ))}
                {bestFor.length > 3 && (
                  <span className="text-[9px] text-muted-foreground">+{bestFor.length - 3}</span>
                )}
              </div>
            )}
            {avoidFor.length > 0 && (
              <div className="flex flex-wrap items-center gap-1">
                <span className="text-[9px] text-muted-foreground">Avoid:</span>
                {avoidFor.slice(0, 3).map((use) => (
                  <RegistryBadge key={use} variant="outline" size="xs" className="font-mono">
                    {use}
                  </RegistryBadge>
                ))}
              </div>
            )}
            {engineering_snapshot?.deployment_complexity && (
              <div className="text-[10px] text-muted-foreground">
                Complexity: <span className="text-foreground font-mono">{engineering_snapshot.deployment_complexity}</span>
              </div>
            )}
          </div>
        )}

        {/* Technical Specifications */}
        {(specifications?.parameter_count || specifications?.context_window || architecture?.tokenizer || architecture?.architecture_type || architecture?.attention_mechanism) && (
          <div className="space-y-1">
            <div className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider">Technical Specs</div>
            <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[10px]">
              {specifications?.parameter_count && (
                <>
                  <div className="text-muted-foreground">Parameters</div>
                  <div className="text-foreground font-mono text-right">{(specifications.parameter_count / 1000).toFixed(0)}B</div>
                </>
              )}
              {specifications?.context_window && (
                <>
                  <div className="text-muted-foreground">Context</div>
                  <div className="text-foreground font-mono text-right">{specifications.context_window >= 1000 ? `${(specifications.context_window / 1000).toFixed(0)}K` : `${specifications.context_window}`}</div>
                </>
              )}
              {architecture?.tokenizer && (
                <>
                  <div className="text-muted-foreground">Tokenizer</div>
                  <div className="text-foreground font-mono text-right">{architecture.tokenizer}</div>
                </>
              )}
              {architecture?.architecture_type && (
                <>
                  <div className="text-muted-foreground">Architecture</div>
                  <div className="text-foreground font-mono text-right">{architecture.architecture_type}</div>
                </>
              )}
              {architecture?.attention_mechanism && (
                <>
                  <div className="text-muted-foreground">Attention</div>
                  <div className="text-foreground font-mono text-right">{architecture.attention_mechanism}</div>
                </>
              )}
            </div>
            {formats && Object.keys(formats).some(k => formats[k as keyof typeof formats]) && (
              <div className="flex flex-wrap items-center gap-1 mt-1">
                {Object.entries(formats)
                  .filter(([, val]) => val)
                  .map(([key]) => (
                    <RegistryBadge key={key} variant="muted" size="xs" className="font-mono">
                      {key.toUpperCase()}
                    </RegistryBadge>
                  ))}
              </div>
            )}
          </div>
        )}

        {/* Deployment */}
        {(recommendedRuntime || quantizations.length > 0) && (
          <div className="space-y-1">
            <div className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider">Deployment</div>
            {recommendedRuntime && (
              <div className="flex items-center gap-1">
                <span className="text-[9px] text-muted-foreground">Runtime:</span>
                <RuntimeBadge runtime={recommendedRuntime} />
              </div>
            )}
            {quantizations.length > 0 && (
              <div className="flex flex-wrap items-center gap-1">
                <span className="text-[9px] text-muted-foreground">Quant:</span>
                {quantizations.slice(0, 4).map((q) => (
                  <QuantizationBadge key={q} quantization={q} />
                ))}
                {quantizations.length > 4 && (
                  <span className="text-[9px] text-muted-foreground">+{quantizations.length - 4}</span>
                )}
              </div>
            )}
          </div>
        )}

        {/* Hardware */}
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

        {/* Ecosystem */}
        {ecosystemBadges.length > 0 && (
          <div className="space-y-1">
            <div className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider">Ecosystem</div>
            <div className="flex flex-wrap items-center gap-1">
              {ecosystemBadges.map((eco) => (
                <RegistryBadge key={eco} variant="secondary" size="xs" className="font-mono">
                  {eco}
                </RegistryBadge>
              ))}
            </div>
          </div>
        )}

        {/* References */}
        {references.length > 0 && (
          <div className="space-y-1">
            <div className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider">References</div>
            <div className="flex flex-col gap-1">
              {Object.entries(referencesByCategory).slice(0, 3).map(([category, refs]) => (
                <div key={category} className="text-[10px]">
                  <span className="text-muted-foreground capitalize">{category}:</span>{' '}
                  {refs.slice(0, 2).map((ref, idx) => (
                    <a
                      key={idx}
                      href={ref.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {ref.title}{idx < refs.length - 1 ? ', ' : ''}
                    </a>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Related Models */}
        {related_models.length > 0 && (
          <div className="space-y-1">
            <div className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider">Related</div>
            <div className="flex flex-wrap items-center gap-1">
              {related_models.slice(0, 4).map((rel) => (
                <RegistryBadge key={rel.id} variant="outline" size="xs" className="font-mono">
                  {rel.id}
                </RegistryBadge>
              ))}
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
                {dl.official && <span className="text-emerald-600">●</span>}
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