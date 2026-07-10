'use client';

import CollapsibleRow from './CollapsibleRow';

interface DebugSolution {
  solution: string;
  steps: string[];
  verification?: string;
}

interface DebugSolutionListProps {
  solutions: DebugSolution[];
}

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
