import { Lightbulb, AlertTriangle } from 'lucide-react';

interface DecisionSummaryProps {
  whenToUse: string[];
  dontUse: string[];
  tradeoff?: string;
}

export default function DecisionSummary({ whenToUse, dontUse, tradeoff }: DecisionSummaryProps) {
  return (
    <div className="space-y-4">
      {whenToUse && whenToUse.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-emerald-500" />
            When to Use
          </h3>
          <ul className="mt-2 space-y-1">
            {whenToUse.map((item, idx) => (
              <li key={idx} className="text-sm text-muted-foreground pl-5 relative before:content-['✓'] before:absolute before:left-0 before:text-emerald-500">
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {dontUse && dontUse.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            When Not to Use
          </h3>
          <ul className="mt-2 space-y-1">
            {dontUse.map((item, idx) => (
              <li key={idx} className="text-sm text-muted-foreground pl-5 relative before:content-['✗'] before:absolute before:left-0 before:text-red-500">
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {tradeoff && (
        <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
            Tradeoff
          </span>
          <p className="text-sm text-muted-foreground mt-1">{tradeoff}</p>
        </div>
      )}
    </div>
  );
}