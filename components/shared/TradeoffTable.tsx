import { cn } from '@/lib/utils';

interface TradeoffDimension {
  dimension: string;
  effect: string;
}

interface TradeoffTableProps {
  tradeoffs?: TradeoffDimension[];
  className?: string;
}

export default function TradeoffTable({ tradeoffs = [], className }: TradeoffTableProps) {
  if (tradeoffs.length === 0) {
    return null;
  }

  return (
    <div className={cn('rounded-lg border border-border bg-card overflow-hidden', className)}>
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-border bg-muted/50">
            <th className="text-left font-semibold text-foreground px-4 py-2.5 uppercase tracking-wider">
              Dimension
            </th>
            <th className="text-left font-semibold text-foreground px-4 py-2.5 uppercase tracking-wider">
              Effect
            </th>
          </tr>
        </thead>
        <tbody>
          {tradeoffs.map((tradeoff, idx) => (
            <tr key={idx} className="border-b border-border last:border-b-0">
              <td className="px-4 py-2.5 text-muted-foreground font-medium">
                {tradeoff.dimension}
              </td>
              <td className="px-4 py-2.5 text-foreground">
                {tradeoff.effect}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
