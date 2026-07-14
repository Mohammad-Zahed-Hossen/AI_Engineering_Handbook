import { Check, TrendingUp, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VariationData {
  name: string;
  description: string;
  use_when?: string;
  benefit?: string;
  tradeoff?: string;
}

interface VariationCardProps {
  variation: VariationData;
  className?: string;
}

export default function VariationCard({ variation, className }: VariationCardProps) {
  const hasEnhancedFields = variation.use_when || variation.benefit || variation.tradeoff;

  if (!hasEnhancedFields) {
    // Legacy simple format
    return (
      <div className={cn('rounded-lg border border-border bg-card p-4 space-y-1', className)}>
        <h3 className="text-sm font-medium text-foreground">{variation.name}</h3>
        <p className="text-xs text-muted-foreground">{variation.description}</p>
      </div>
    );
  }

  // Enhanced format
  return (
    <div className={cn('rounded-lg border border-border bg-card p-4 space-y-3', className)}>
      {/* Header */}
      <div className="space-y-1">
        <h3 className="text-sm font-medium text-foreground">{variation.name}</h3>
        <p className="text-xs text-muted-foreground">{variation.description}</p>
      </div>

      {/* Enhanced Fields */}
      <div className="space-y-2 pt-2 border-t border-border">
        {/* Use When */}
        {variation.use_when && (
          <div className="flex items-start gap-2">
            <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase">
                Use when
              </p>
              <p className="text-xs text-foreground">{variation.use_when}</p>
            </div>
          </div>
        )}

        {/* Benefit */}
        {variation.benefit && (
          <div className="flex items-start gap-2">
            <TrendingUp className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase">
                Benefit
              </p>
              <p className="text-xs text-foreground">{variation.benefit}</p>
            </div>
          </div>
        )}

        {/* Tradeoff */}
        {variation.tradeoff && (
          <div className="flex items-start gap-2">
            <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase">
                Tradeoff
              </p>
              <p className="text-xs text-foreground">{variation.tradeoff}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
