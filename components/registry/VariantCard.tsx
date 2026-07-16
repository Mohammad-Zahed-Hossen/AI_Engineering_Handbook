'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { QuantizationBadge } from './RegistryBadge';
import { RegistryVariant } from '@/types/registry';
import { formatSize, formatParameterCount, formatContextWindow, truncateList } from '@/lib/format-registry';

interface VariantCardProps {
  variant: RegistryVariant;
  familyId: string;
}

/**
 * Card component for displaying a model variant within a family page.
 * Shows variant name, size, parameters, context window, and runtime info.
 */
export default function VariantCard({ variant, familyId }: VariantCardProps) {
  const {
    id,
    name,
    size_mb,
    specifications,
    deployment,
  } = variant;

  const contextWindow = specifications?.context_window;
  const recommendedRuntime = deployment?.recommended_runtime;
  const { visible: quantizations, remaining: quantRemaining } = truncateList(deployment?.quantizations || [], 4);

  return (
    <Link
      href={`/registry/families/${familyId}/${id}`}
      className="block"
    >
      <Card className="hover:border-foreground/20 hover:bg-muted/30 transition-colors cursor-pointer">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs font-mono">
            {name}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 space-y-2">
          <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[10px]">
            <div className="text-muted-foreground">Size</div>
            <div className="text-foreground font-mono text-right">
              {formatSize(size_mb)}
            </div>
            {specifications?.parameter_count && (
              <>
                <div className="text-muted-foreground">Params</div>
                <div className="text-foreground font-mono text-right">
                  {formatParameterCount(specifications.parameter_count)}
                </div>
              </>
            )}
            {contextWindow && (
              <>
                <div className="text-muted-foreground">Context</div>
                <div className="text-foreground font-mono text-right">
                  {formatContextWindow(contextWindow)}
                </div>
              </>
            )}
          </div>
          {recommendedRuntime && (
            <div className="text-[10px]">
              <span className="text-muted-foreground">Runtime:</span>{' '}
              <span className="text-foreground font-mono">
                {recommendedRuntime}
              </span>
            </div>
          )}
          {quantizations.length > 0 && (
            <div className="flex flex-wrap items-center gap-1">
              <span className="text-[10px] text-muted-foreground">Quant:</span>
              {quantizations.map((q) => (
                <QuantizationBadge key={q} quantization={q} />
              ))}
              {quantRemaining > 0 && (
                <span className="text-[10px] text-muted-foreground">+{quantRemaining}</span>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}