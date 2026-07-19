import { Table as TableIcon } from 'lucide-react';
import { DecisionMatrixEntry } from '@/types/decision-guide';

interface DecisionMatrixProps {
  matrix: DecisionMatrixEntry[];
}

const importanceColors: Record<string, string> = {
  critical: 'bg-red-500/10 text-red-700 dark:text-red-400',
  high: 'bg-amber-500/10 text-amber-700 dark:text-amber-400',
  medium: 'bg-blue-500/10 text-blue-700 dark:text-blue-400',
  low: 'bg-muted text-muted-foreground',
};

export default function DecisionMatrix({ matrix }: DecisionMatrixProps) {
  if (!matrix || matrix.length === 0) return null;

  return (
    <section id="decision-matrix" className="space-y-3 scroll-mt-24">
      <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
        <TableIcon className="w-5 h-5 text-blue-500" />
        Decision Matrix
      </h2>
      
      <div className="rounded-lg border border-border bg-card overflow-x-auto">
        <table className="w-full text-sm content-table">
          <thead className="bg-muted/40 font-semibold text-foreground border-b border-border">
            <tr>
              <th className="px-4 py-3 text-left">Criterion</th>
              <th className="px-4 py-3 text-left">Importance</th>
              <th className="px-4 py-3 text-left">Winner</th>
              <th className="px-4 py-3 text-left">Reason</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {matrix.map((entry, idx) => (
              <tr key={idx} className="border-t border-border last:border-0">
                <td className="px-4 py-3 font-medium text-foreground">
                  {entry.criterion}
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${importanceColors[entry.importance]}`}>
                    {entry.importance}
                  </span>
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {entry.winner}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {entry.reason}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}