import { cn } from '@/lib/utils';

interface DataTableProps {
  headers: string[];
  rows: React.ReactNode[][];
  monoColumns?: number[]; // column indices that should render font-mono font-semibold text-foreground
  columnStyles?: (string | undefined)[]; // custom className per column index
}

export default function DataTable({ headers, rows, monoColumns = [], columnStyles }: DataTableProps) {
  return (
<div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-left border-collapse text-xs content-table">
        <thead className="bg-muted/40 font-semibold text-foreground border-b border-border">
          <tr>{headers.map((h, i) => <th key={i} className="p-3">{h}</th>)}</tr>
        </thead>
        <tbody className="divide-y divide-border">
          {rows.map((row, ri) => (
            <tr key={ri} className="hover:bg-muted/10">
              {row.map((cell, ci) => (
                <td key={ci} className={cn('p-3', columnStyles?.[ci] || (monoColumns.includes(ci) ? 'font-mono font-semibold text-foreground' : 'text-muted-foreground'))}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
