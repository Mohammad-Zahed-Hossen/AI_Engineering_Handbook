import { GitFork } from 'lucide-react';
import { DecisionTreeEntry } from '@/types/decision-guide';

interface DecisionTreeProps {
  tree: DecisionTreeEntry[];
}

export default function DecisionTree({ tree }: DecisionTreeProps) {
  if (!tree || tree.length === 0) return null;

  return (
    <section id="decision-tree" className="space-y-3 scroll-mt-24">
      <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
        <GitFork className="w-5 h-5 text-blue-500" />
        Decision Tree
      </h2>
      
      <div className="space-y-2">
        {tree.map((entry, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <div className="flex-1 rounded-lg border border-border bg-card p-3">
              <p className="text-sm text-foreground">{entry.question}</p>
            </div>
            {entry.outcome && (
              <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-3 py-2">
                <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400">
                  → {entry.outcome}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}