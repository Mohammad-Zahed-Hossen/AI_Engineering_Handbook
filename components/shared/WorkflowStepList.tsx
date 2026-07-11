'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { WorkflowStep } from '@/types/workflow';
import ContentTypeBadge from './ContentTypeBadge';
import { parseLabeledClauses } from '@/lib/text/parseLabeledClauses';

interface WorkflowStepListProps {
  steps: WorkflowStep[];
  resolvedLinks?: Record<string, Record<string, { name: string; href: string | null }>>;
  workedExamples?: Array<{ name: string; related_step?: number }>;
}

export default function WorkflowStepList({ steps, resolvedLinks, workedExamples }: WorkflowStepListProps) {
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

  const expandAll = () => {
    setExpandedSteps(new Set(steps.map((_, idx) => idx)));
  };

  const collapseAll = () => {
    setExpandedSteps(new Set([0])); // Keep Step 1 open by default
  };

  const renderUses = (type: string, ids: string[] | undefined) => {
    if (!ids || ids.length === 0) return null;
    return ids.map(id => {
      const link = resolvedLinks?.[type]?.[id];
      if (!link) return null;

      const content = (
        <>
          <ContentTypeBadge type={type} className="px-1 py-0 text-[8px] h-3.5 leading-none shrink-0" />
          <span className="truncate">{link.name}</span>
        </>
      );

      if (!link.href) {
        return (
          <span
            key={`${type}-${id}`}
            className="inline-flex items-center gap-1 rounded border border-border bg-muted px-1.5 py-0.5 text-[9px] text-muted-foreground select-none"
          >
            {content}
          </span>
        );
      }

      return (
        <Link
          key={`${type}-${id}`}
          href={link.href}
          className="inline-flex items-center gap-1 rounded border border-border bg-muted/40 px-1.5 py-0.5 text-[9px] font-medium text-foreground hover:bg-muted hover:border-foreground/20 transition-colors select-none"
        >
          {content}
        </Link>
      );
    });
  };

  const renderAllUses = (uses: Record<string, string[]>) => {
    const typeMap: Record<string, string> = {
      packages: 'package',
      models: 'model',
      cheatsheets: 'cheatsheet',
      patterns: 'pattern',
      debug_guides: 'debug_guide',
      decision_guides: 'decision_guide',
      principles: 'principle',
    };

    return Object.entries(uses).map(([key, ids]) => {
      const type = typeMap[key] || (key.endsWith('s') ? key.slice(0, -1) : key);
      return renderUses(type, ids);
    });
  };

  return (
    <>
      <div className="flex gap-2 mb-2">
        <button
          onClick={expandAll}
          className="text-[10px] font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          Expand All
        </button>
        <span className="text-muted-foreground">/</span>
        <button
          onClick={collapseAll}
          className="text-[10px] font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          Collapse All
        </button>
      </div>
      <ol id="steps" className="space-y-2 scroll-mt-24">
      {steps.map((s, idx) => {
        const isOpen = expandedSteps.has(idx);
        const hasUses = s.uses && Object.values(s.uses).some(ids => Array.isArray(ids) && ids.length > 0);
        const relatedExample = workedExamples?.find(ex => ex.related_step === s.step);
        const stepBodyRef = useRef<HTMLDivElement>(null);

        // Attach onBeforeMatch handler imperatively
        useEffect(() => {
          const element = stepBodyRef.current;
          if (element && !isOpen) {
            const handleBeforeMatch = () => toggleStep(idx);
            element.addEventListener('beforematch', handleBeforeMatch as any);
            return () => element.removeEventListener('beforematch', handleBeforeMatch as any);
          }
        }, [isOpen, idx]);

        return (
          <li
            key={s.step}
            id={`step-${s.step}`}
            className="rounded-lg border border-border bg-card overflow-hidden"
          >
            {/* Step header — always visible, clickable */}
            <button
              onClick={() => toggleStep(idx)}
              className="w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-muted/20 transition-colors cursor-pointer"
              aria-expanded={isOpen}
              aria-controls={`step-${s.step}-content`}
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
            <div
              ref={stepBodyRef}
              id={`step-${s.step}-content`}
              className="px-4 pb-4 pt-1 space-y-3 border-t border-border [content-visibility:auto]"
              {...(!isOpen ? { hidden: 'until-found' as any } : {})}
            >
              <p className="text-sm text-muted-foreground">{s.what}</p>

              {hasUses && (
                <div className="flex flex-wrap gap-1.5 items-center text-xs">
                  <span className="text-[10px] font-semibold uppercase text-muted-foreground mr-1 select-none">Uses:</span>
                  {renderAllUses(s.uses as any)}
                </div>
              )}

              <div className="rounded border border-border bg-muted/30 p-3 text-sm">
                <span className="text-[10px] font-semibold uppercase text-muted-foreground block mb-1">
                  Key Decision
                </span>
                {s.decision}
              </div>

              {s.failure_points.length > 0 && (
                <div className="rounded border-l-2 border-rose-500 bg-rose-500/5 px-3 py-2">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-rose-700 dark:text-rose-400 block mb-1.5">
                    Watch Out
                  </span>
                  <ul className="space-y-1">
                    {s.failure_points.map((fp, fpIdx) => {
                      const clauses = parseLabeledClauses(fp, ['Failure:', 'Trigger:', 'Downstream Effect:', 'Detection:']);
                      
                      if (clauses) {
                        // Render structured clauses
                        return (
                          <li key={fpIdx} className="text-xs text-rose-800 dark:text-rose-300 leading-relaxed space-y-0.5">
                            {clauses.map((clause, cIdx) => (
                              <div key={cIdx}>
                                <span className="font-semibold text-[10px] uppercase">{clause.label}</span>
                                <span className="ml-1">{clause.text}</span>
                              </div>
                            ))}
                          </li>
                        );
                      }
                      
                      // Fallback to plain text
                      return (
                        <li key={fpIdx} className="text-xs text-rose-800 dark:text-rose-300 leading-relaxed">
                          {fp}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}

              {relatedExample && (
                <Link
                  href="#worked-examples"
                  className="inline-flex items-center gap-1 text-[10px] font-medium text-primary hover:underline"
                >
                  View worked example →
                </Link>
              )}
            </div>
          </li>
        );
      })}
    </ol>
    </>
  );
}
