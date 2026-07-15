'use client';

import CollapsibleRow from './CollapsibleRow';

interface DebugSolution {
  solution: string;
  steps: string[];
  quick_fix?: string;
  permanent_fix?: string;
  tradeoffs?: string[];
  performance_impact?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  works_for?: string[];
  verification?: string;
}

interface DebugSolutionListProps {
  solutions: DebugSolution[];
}

const getDifficultyBadgeClass = (difficulty: string | undefined) => {
  switch (difficulty) {
    case 'easy':
      return 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400';
    case 'medium':
      return 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400';
    case 'hard':
      return 'bg-red-500/10 text-red-700 dark:text-red-400';
    default:
      return 'bg-muted text-muted-foreground';
  }
};

export default function DebugSolutionList({ solutions }: DebugSolutionListProps) {
  if (!solutions || solutions.length === 0) return null;

  return (
    <div className="space-y-3">
      {solutions.map((solution, index) => (
        <CollapsibleRow
          key={`${solution.solution}-${index}`}
          id={`solution-${index}`}
          label={solution.solution}
          teaser={`${solution.steps.length} step${solution.steps.length !== 1 ? 's' : ''}`}
          icon={
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-[10px] font-bold font-mono">
              {index + 1}
            </span>
          }
          enableHashDeepLink
        >
          <div className="space-y-4">
            {/* Quick Fix / Permanent Fix */}
            {(solution.quick_fix || solution.permanent_fix) && (
              <div className="space-y-2">
                {solution.quick_fix && (
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Quick Fix</span>
                    <p className="text-sm text-foreground mt-0.5">{solution.quick_fix}</p>
                  </div>
                )}
                {solution.permanent_fix && (
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Permanent Fix</span>
                    <p className="text-sm text-foreground mt-0.5">{solution.permanent_fix}</p>
                  </div>
                )}
              </div>
            )}

            {/* Steps */}
            <div>
              <h3 className="text-xs font-semibold text-foreground mb-2">Steps</h3>
              <ol className="space-y-2">
                {solution.steps.map((step, stepIndex) => (
                  <li key={stepIndex} className="flex gap-3 text-sm text-muted-foreground">
                    <span className="shrink-0 w-5 h-5 flex items-center justify-center rounded bg-muted text-[10px] font-mono font-bold text-foreground">
                      {stepIndex + 1}
                    </span>
                    <span className="flex-1 leading-relaxed">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Tradeoffs */}
            {solution.tradeoffs && solution.tradeoffs.length > 0 && (
              <div className="rounded bg-amber-500/5 border border-amber-500/20 p-3">
                <h3 className="text-xs font-semibold text-amber-700 dark:text-amber-400 mb-1">Tradeoffs</h3>
                <ul className="space-y-1">
                  {solution.tradeoffs.map((tradeoff, tIdx) => (
                    <li key={tIdx} className="text-xs text-muted-foreground">
                      • {tradeoff}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Performance Impact */}
            {solution.performance_impact && (
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Performance Impact</span>
                <p className="text-sm text-muted-foreground mt-0.5">{solution.performance_impact}</p>
              </div>
            )}

            {/* Works For */}
            {solution.works_for && solution.works_for.length > 0 && (
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Works For</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {solution.works_for.map((item, wIdx) => (
                    <span key={wIdx} className="rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Verification */}
            {solution.verification && (
              <div className="rounded bg-emerald-500/5 border border-emerald-500/20 p-3">
                <h3 className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 mb-1">Verification</h3>
                <p className="text-sm text-muted-foreground">{solution.verification}</p>
              </div>
            )}
          </div>
        </CollapsibleRow>
      ))}
    </div>
  );
}