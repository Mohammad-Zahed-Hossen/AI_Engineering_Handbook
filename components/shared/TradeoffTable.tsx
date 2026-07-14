import { cn } from '@/lib/utils';
import { BarChart3 } from 'lucide-react';

interface TradeoffDimension {
  dimension: string;
  effect: string;
}

interface TradeoffTableProps {
  tradeoffs?: TradeoffDimension[];
  className?: string;
}

// Map effect symbols to descriptive text and visual indicators
const getEffectInfo = (effect: string) => {
  const effectMap: Record<string, { label: string; color: string; description: string }> = {
    '↑↑↑': { label: 'Significant Increase', color: 'text-emerald-600', description: 'Large positive impact' },
    '↑↑': { label: 'Moderate Increase', color: 'text-emerald-500', description: 'Medium positive impact' },
    '↑': { label: 'Slight Increase', color: 'text-emerald-400', description: 'Small positive impact' },
    '↓↓↓': { label: 'Significant Decrease', color: 'text-red-600', description: 'Large negative impact' },
    '↓↓': { label: 'Moderate Decrease', color: 'text-red-500', description: 'Medium negative impact' },
    '↓': { label: 'Slight Decrease', color: 'text-red-400', description: 'Small negative impact' },
    'Depends': { label: 'Context Dependent', color: 'text-amber-600', description: 'Varies by use case' },
  };
  return effectMap[effect] || { label: effect, color: 'text-muted-foreground', description: effect };
};

export default function TradeoffTable({ tradeoffs = [], className }: TradeoffTableProps) {
  if (tradeoffs.length === 0) {
    return null;
  }

  return (
    <div className={cn('rounded-lg border border-border bg-card overflow-hidden', className)}>
      <div className="px-4 py-3 border-b border-border bg-muted/30">
        <h3 className="text-xs font-semibold text-foreground flex items-center gap-1.5">
          <BarChart3 className="w-3.5 h-3.5" />
          Tradeoff Analysis
        </h3>
      </div>
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-border bg-muted/50">
            <th className="text-left font-semibold text-foreground px-4 py-2 uppercase tracking-wider">
              Dimension
            </th>
            <th className="text-left font-semibold text-foreground px-4 py-2 uppercase tracking-wider">
              Effect
            </th>
          </tr>
        </thead>
        <tbody>
          {tradeoffs.map((tradeoff, idx) => {
            const effectInfo = getEffectInfo(tradeoff.effect);
            return (
              <tr key={idx} className="border-b border-border last:border-b-0">
                <td className="px-4 py-2.5 text-muted-foreground font-medium">
                  {tradeoff.dimension}
                </td>
                <td className="px-4 py-2.5">
                  <span className={cn('font-medium', effectInfo.color)} title={effectInfo.description}>
                    {effectInfo.label}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}