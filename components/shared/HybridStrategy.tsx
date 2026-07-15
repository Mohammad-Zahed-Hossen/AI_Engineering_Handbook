import { GitMerge } from 'lucide-react';
import type { HybridStrategy } from '@/types/decision-guide';
import { Prose } from './Prose';

interface HybridStrategyProps {
  strategy?: HybridStrategy;
}

export default function HybridStrategyComponent({ strategy }: HybridStrategyProps) {
  if (!strategy) return null;

  return (
    <section id="hybrid-strategy" className="space-y-3 scroll-mt-24">
      <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
        <GitMerge className="w-5 h-5 text-blue-500" />
        Hybrid Strategy
      </h2>
      
      <div className="space-y-3">
        {strategy.when_both_wins && (
          <div className="rounded-lg border border-border bg-card p-4">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
              When Both Wins
            </span>
            <p className="text-sm text-muted-foreground">{strategy.when_both_wins}</p>
          </div>
        )}

        {strategy.architecture_overview && (
          <div className="rounded-lg border border-border bg-card p-4">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
              Architecture Overview
            </span>
            <Prose content={strategy.architecture_overview} className="text-sm text-muted-foreground" />
          </div>
        )}

        {strategy.benefits && strategy.benefits.length > 0 && (
          <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-4">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 block mb-2">
              Benefits
            </span>
            <ul className="space-y-1">
              {strategy.benefits.map((benefit, idx) => (
                <li key={idx} className="text-xs text-muted-foreground pl-3 relative before:content-['✓'] before:absolute before:left-0 before:text-emerald-500">
                  {benefit}
                </li>
              ))}
            </ul>
          </div>
        )}

        {strategy.costs && strategy.costs.length > 0 && (
          <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-4">
            <span className="text-[10px] font-bold uppercase tracking-wider text-red-700 dark:text-red-400 block mb-2">
              Costs
            </span>
            <ul className="space-y-1">
              {strategy.costs.map((cost, idx) => (
                <li key={idx} className="text-xs text-muted-foreground pl-3 relative before:content-['✗'] before:absolute before:left-0 before:text-red-500">
                  {cost}
                </li>
              ))}
            </ul>
          </div>
        )}

        {strategy.tradeoffs && strategy.tradeoffs.length > 0 && (
          <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-4">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 block mb-2">
              Tradeoffs
            </span>
            <ul className="space-y-1">
              {strategy.tradeoffs.map((tradeoff, idx) => (
                <li key={idx} className="text-xs text-muted-foreground pl-3 relative before:content-['•'] before:absolute before:left-0 before:text-amber-500">
                  {tradeoff}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}