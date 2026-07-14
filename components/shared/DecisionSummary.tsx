import { Check, X, ArrowUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DecisionSummaryProps {
  whenToUse?: string[];
  dontUse?: string[];
  tradeoff?: string;
  className?: string;
}

export default function DecisionSummary({
  whenToUse = [],
  dontUse = [],
  tradeoff,
  className,
}: DecisionSummaryProps) {
  if (whenToUse.length === 0 && dontUse.length === 0 && !tradeoff) {
    return null;
  }

  return (
    <div className={cn('rounded-lg border border-border bg-muted/30 p-4 space-y-4', className)}>
      {/* WHEN TO USE */}
      {whenToUse.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">
            When to Use
          </h3>
          <ul className="space-y-1">
            {whenToUse.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs text-muted-foreground">
                <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* DON'T USE */}
      {dontUse.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">
            Don't Use
          </h3>
          <ul className="space-y-1">
            {dontUse.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs text-muted-foreground">
                <X className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* TRADEOFF */}
      {tradeoff && (
        <div className="space-y-2">
          <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider flex items-center gap-1.5">
            <ArrowUpDown className="w-3.5 h-3.5" />
            Tradeoff
          </h3>
          <p className="text-xs text-muted-foreground">{tradeoff}</p>
        </div>
      )}
    </div>
  );
}
