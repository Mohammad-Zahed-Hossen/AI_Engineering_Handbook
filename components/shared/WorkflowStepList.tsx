'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { WorkflowStep } from '@/types/workflow';

interface WorkflowStepListProps {
  steps: WorkflowStep[];
}

export default function WorkflowStepList({ steps }: WorkflowStepListProps) {
  // Step 1 (index 0) is open by default
  const [expandedSteps, setExpandedSteps] = useState<Set<number>>(new Set([0]));

  const toggleStep = (idx: number) => {
    setExpandedSteps(prev => {
      const next = new Set(prev);
      if (next.has(idx)) {
        next.delete(idx);
      } else {
        next.add(idx);
      }
      return next;
    });
  };

  return (
    <ol id="steps" className="space-y-2 scroll-mt-24">
      {steps.map((s, idx) => {
        const isOpen = expandedSteps.has(idx);
        return (
          <li
            key={s.step}
            className="rounded-lg border border-border bg-card overflow-hidden"
          >
            {/* Step header — always visible, clickable */}
            <button
              onClick={() => toggleStep(idx)}
              className="w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-muted/20 transition-colors"
              aria-expanded={isOpen}
            >
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border bg-muted text-xs font-mono font-semibold mt-0.5">
                {s.step}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground leading-snug">
                  {s.name}
                </p>
                {/* Tool badges always visible in header */}
                {s.tools.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {s.tools.map(t => (
                      <span
                        key={t}
                        className="rounded border border-border bg-muted px-1.5 py-0.5 text-[9px] font-mono text-muted-foreground"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              {isOpen
                ? <ChevronDown className="w-4 h-4 shrink-0 mt-1 text-muted-foreground" />
                : <ChevronRight className="w-4 h-4 shrink-0 mt-1 text-muted-foreground" />
              }
            </button>

            {/* Step body — collapsible */}
            {isOpen && (
              <div className="px-4 pb-4 pt-1 space-y-3 border-t border-border">
                <p className="text-sm text-muted-foreground">{s.what}</p>

                <div className="rounded border border-border bg-muted/30 p-3 text-sm">
                  <span className="text-[10px] font-semibold uppercase text-muted-foreground block mb-1">
                    Key Decision
                  </span>
                  {s.decision}
                </div>

                {s.failure_points.length > 0 && (
                  <div className="rounded border-l-2 border-amber-500 bg-amber-500/5 px-3 py-2">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400 block mb-1.5">
                      Watch Out
                    </span>
                    <ul className="space-y-1">
                      {s.failure_points.map((fp, fpIdx) => (
                        <li key={fpIdx} className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
                          {fp}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </li>
        );
      })}
    </ol>
  );
}
