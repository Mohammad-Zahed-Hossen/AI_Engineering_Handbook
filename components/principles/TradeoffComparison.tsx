import { cn } from '@/lib/utils';
import { BarChart3 } from 'lucide-react';

interface TradeoffComparisonProps {
  benefits: string[];
  costs: string[];
  className?: string;
}

export default function TradeoffComparison({ 
  benefits, 
  costs, 
  className 
}: TradeoffComparisonProps) {
  if (benefits.length === 0 && costs.length === 0) {
    return null;
  }

  return (
    <div className={cn(
      "rounded-lg border border-border bg-card overflow-hidden",
      className
    )}>
      <div className="px-4 py-3 border-b border-border bg-muted/30">
        <h3 className="text-xs font-semibold text-foreground flex items-center gap-1.5">
          <BarChart3 className="w-3.5 h-3.5" />
          Tradeoffs
        </h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border">
        <div className="p-4">
          <h4 className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-2">
            Benefits
          </h4>
          {benefits.length > 0 ? (
            <ul className="space-y-1.5">
              {benefits.map((benefit, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-emerald-500 mt-0.5">+</span>
                  <span className="text-xs text-muted-foreground">{benefit}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-muted-foreground/60 italic">No specific benefits listed</p>
          )}
        </div>
        <div className="p-4">
          <h4 className="text-[10px] font-semibold text-red-600 dark:text-red-400 uppercase tracking-wider mb-2">
            Costs
          </h4>
          {costs.length > 0 ? (
            <ul className="space-y-1.5">
              {costs.map((cost, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-red-500 mt-0.5">-</span>
                  <span className="text-xs text-muted-foreground">{cost}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-muted-foreground/60 italic">No specific costs listed</p>
          )}
        </div>
      </div>
    </div>
  );
}