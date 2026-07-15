import { Server, Clock, Wrench, TrendingUp, AlertTriangle } from 'lucide-react';
import { DecisionOption } from '@/types/decision-guide';

interface DecisionOptionGridProps {
  options: DecisionOption[];
}

export default function DecisionOptionGrid({ options }: DecisionOptionGridProps) {
  if (!options || options.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {options.map((option, index) => (
        <div
          key={option.id}
          className="rounded-lg border border-border bg-card p-4 space-y-3"
        >
          {/* Option Header */}
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-sm font-semibold text-foreground">{option.name}</h3>
            <span className="shrink-0 px-2 py-0.5 rounded bg-primary/10 text-primary text-[10px] font-mono font-bold">
              {index + 1}
            </span>
          </div>

          {/* Best For */}
          <div className="rounded bg-emerald-500/5 border border-emerald-500/20 p-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 block mb-1">
              Best For
            </span>
            <p className="text-xs text-muted-foreground">{option.best_for}</p>
          </div>

          {/* Avoid When */}
          <div className="rounded bg-red-500/5 border border-red-500/20 p-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-red-700 dark:text-red-400 block mb-1">
              Avoid When
            </span>
            <p className="text-xs text-muted-foreground">{option.avoid_when}</p>
          </div>

          {/* Strengths */}
          {option.strengths && option.strengths.length > 0 && (
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                Strengths
              </span>
              <ul className="space-y-1">
                {option.strengths.map((strength, idx) => (
                  <li key={idx} className="text-xs text-muted-foreground pl-3 relative before:content-['✓'] before:absolute before:left-0 before:text-emerald-500">
                    {strength}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Weaknesses */}
          {option.weaknesses && option.weaknesses.length > 0 && (
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                Weaknesses
              </span>
              <ul className="space-y-1">
                {option.weaknesses.map((weakness, idx) => (
                  <li key={idx} className="text-xs text-muted-foreground pl-3 relative before:content-['✗'] before:absolute before:left-0 before:text-red-500">
                    {weakness}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Deep Dive Fields */}
          {option.infrastructure_required && option.infrastructure_required.length > 0 && (
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1 mb-1">
                <Server className="w-3 h-3" />
                Infrastructure Required
              </span>
              <ul className="space-y-1">
                {option.infrastructure_required.map((infra, idx) => (
                  <li key={idx} className="text-xs text-muted-foreground pl-3 relative before:content-['•'] before:absolute before:left-0">
                    {infra}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {option.operational_cost && (
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1 mb-1">
                <Clock className="w-3 h-3" />
                Operational Cost
              </span>
              <p className="text-xs text-muted-foreground">{option.operational_cost}</p>
            </div>
          )}

          {option.maintenance_cost && (
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1 mb-1">
                <Wrench className="w-3 h-3" />
                Maintenance Cost
              </span>
              <p className="text-xs text-muted-foreground">{option.maintenance_cost}</p>
            </div>
          )}

          {option.scaling_complexity && (
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1 mb-1">
                <TrendingUp className="w-3 h-3" />
                Scaling Complexity
              </span>
              <span className="text-xs text-muted-foreground">{option.scaling_complexity}</span>
            </div>
          )}

          {option.failure_modes && option.failure_modes.length > 0 && (
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1 mb-1">
                <AlertTriangle className="w-3 h-3" />
                Failure Modes
              </span>
              <ul className="space-y-1">
                {option.failure_modes.map((mode, idx) => (
                  <li key={idx} className="text-xs text-muted-foreground pl-3 relative before:content-['•'] before:absolute before:left-0">
                    {mode}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}