'use client';

import { Hardware, Deployment, EngineeringSnapshot, Formats } from '@/types/registry';
import { RegistryBadge } from './RegistryBadge';
import { formatSize, formatMemory } from '@/lib/format-registry';
import { AlertTriangle, X, Cpu, HardDrive, Zap } from 'lucide-react';

interface DeploymentSummaryCardProps {
  hardware?: Hardware;
  deployment?: Deployment;
  engineeringSnapshot?: EngineeringSnapshot;
  formats?: Formats;
}

/**
 * Deployment Summary Card for Registry variant pages.
 * Answers: Can I deploy it? How? What do I need?
 * Merges hardware, deployment, and engineering knowledge into one dense card.
 */
export default function DeploymentSummaryCard({
  hardware,
  deployment,
  engineeringSnapshot,
  formats,
}: DeploymentSummaryCardProps) {
  const hasAny = hardware || deployment || engineeringSnapshot || formats;
  
  if (!hasAny) return null;

  const productionReady = engineeringSnapshot?.production_ready;
  const complexity = engineeringSnapshot?.deployment_complexity;
  const recommendedRuntime = deployment?.recommended_runtime;
  const recommendedQuantization = deployment?.recommended_quantization;

  // Get format badges
  const formatBadges = formats ? [
    { key: 'safetensors', label: 'Safetensors' },
    { key: 'gguf', label: 'GGUF' },
    { key: 'awq', label: 'AWQ' },
    { key: 'gptq', label: 'GPTQ' },
    { key: 'exl2', label: 'EXL2' },
    { key: 'mlx', label: 'MLX' },
    { key: 'onnx', label: 'ONNX' },
    { key: 'tensorrt', label: 'TensorRT' },
  ].filter(({ key }) => formats[key as keyof typeof formats] === true) : [];

  return (
    <div className="space-y-3">
      <h2 className="text-sm font-semibold text-foreground">Deployment Summary</h2>
      
      <div className="grid gap-2">
        {/* Status & Runtime Row */}
        <div className="flex flex-wrap items-center gap-2">
          {productionReady !== undefined && (
            <RegistryBadge 
              variant={productionReady ? 'success' : 'destructive'} 
              size="xs" 
              className="font-mono"
            >
              {productionReady ? 'Production Ready' : 'Experimental'}
            </RegistryBadge>
          )}
          {complexity && (
            <RegistryBadge variant="outline" size="xs" className="font-mono">
              Complexity: {complexity}
            </RegistryBadge>
          )}
          {recommendedRuntime && (
            <RegistryBadge variant="secondary" size="xs" className="font-mono">
              Runtime: {recommendedRuntime}
            </RegistryBadge>
          )}
          {recommendedQuantization && (
            <RegistryBadge variant="info" size="xs" className="font-mono">
              Quant: {recommendedQuantization}
            </RegistryBadge>
          )}
        </div>

        {/* Hardware Requirements */}
        {(hardware?.minimum_gpu_memory || hardware?.recommended_gpu_memory || hardware?.minimum_ram) && (
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs">
              <Cpu className="h-3 w-3 text-muted-foreground" />
              <span className="text-muted-foreground font-semibold uppercase tracking-wider">Hardware</span>
            </div>
            <div className="flex flex-wrap items-center gap-1.5 pl-4">
              {hardware?.minimum_gpu_memory && (
                <RegistryBadge variant="outline" size="xs" className="font-mono">
                  Min GPU: {formatMemory(hardware.minimum_gpu_memory)}
                </RegistryBadge>
              )}
              {hardware?.recommended_gpu_memory && (
                <RegistryBadge variant="outline" size="xs" className="font-mono">
                  Rec GPU: {formatMemory(hardware.recommended_gpu_memory)}
                </RegistryBadge>
              )}
              {hardware?.minimum_ram && (
                <RegistryBadge variant="outline" size="xs" className="font-mono">
                  RAM: {formatMemory(hardware.minimum_ram)}
                </RegistryBadge>
              )}
              {hardware?.disk_space && (
                <RegistryBadge variant="outline" size="xs" className="font-mono">
                  Disk: {formatSize(hardware.disk_space)}
                </RegistryBadge>
              )}
            </div>
          </div>
        )}

        {/* Formats */}
        {formatBadges.length > 0 && (
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs">
              <HardDrive className="h-3 w-3 text-muted-foreground" />
              <span className="text-muted-foreground font-semibold uppercase tracking-wider">Formats</span>
            </div>
            <div className="flex flex-wrap items-center gap-1 pl-4">
              {formatBadges.map(({ key, label }) => (
                <RegistryBadge key={key} variant="muted" size="xs" className="font-mono">
                  {label}
                </RegistryBadge>
              ))}
            </div>
          </div>
        )}

        {/* Deployment Risks - if present */}
        {engineeringSnapshot?.deployment_risks && engineeringSnapshot.deployment_risks.length > 0 && (
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs">
              <AlertTriangle className="h-3 w-3 text-amber-600" />
              <span className="text-amber-600 font-semibold uppercase tracking-wider">Risks</span>
            </div>
            <ul className="space-y-0.5 pl-4">
              {engineeringSnapshot.deployment_risks.map((risk, idx) => (
                <li key={idx} className="text-xs text-foreground">
                  • {risk}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Failure Modes - if present */}
        {engineeringSnapshot?.failure_modes && engineeringSnapshot.failure_modes.length > 0 && (
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs">
              <X className="h-3 w-3 text-rose-600" />
              <span className="text-rose-600 font-semibold uppercase tracking-wider">Failure Modes</span>
            </div>
            <ul className="space-y-0.5 pl-4">
              {engineeringSnapshot.failure_modes.map((mode, idx) => (
                <li key={idx} className="text-xs text-foreground">
                  • {mode}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Hidden Costs - if present */}
        {engineeringSnapshot?.hidden_costs && engineeringSnapshot.hidden_costs.length > 0 && (
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs">
              <Zap className="h-3 w-3 text-amber-600" />
              <span className="text-amber-600 font-semibold uppercase tracking-wider">Hidden Costs</span>
            </div>
            <ul className="space-y-0.5 pl-4">
              {engineeringSnapshot.hidden_costs.map((cost, idx) => (
                <li key={idx} className="text-xs text-foreground">
                  • {cost}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}