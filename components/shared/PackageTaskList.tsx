'use client';

import { useEffect, useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { CodeBlock } from '@/components/shared/CodeBlock';
import type { Package } from '@/types/package';

interface PackageTaskListProps {
  tasks: Package['tasks'];
  packageName: string;
}

function slugify(value: string) {
  return value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

export default function PackageTaskList({ tasks, packageName }: PackageTaskListProps) {
  const [expandedTasks, setExpandedTasks] = useState<Set<number>>(new Set());

  const toggleTask = (idx: number) => {
    setExpandedTasks(prev => {
      const next = new Set(prev);
      if (next.has(idx)) {
        next.delete(idx);
      } else {
        next.add(idx);
      }
      return next;
    });
  };

  useEffect(() => {
    const expandFromHash = () => {
      const hash = window.location.hash.replace('#', '');
      if (!hash) return;

      const idx = tasks.findIndex(task => slugify(task.task) === hash);
      if (idx < 0) return;

      setExpandedTasks(prev => {
        const next = new Set(prev);
        next.add(idx);
        return next;
      });

      setTimeout(() => {
        document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    };

    expandFromHash();
    window.addEventListener('hashchange', expandFromHash);
    return () => window.removeEventListener('hashchange', expandFromHash);
  }, [tasks]);

  return (
    <div className="space-y-4" aria-label={`${packageName} tasks`}>
      {/* Progress indicator */}
      <div className="flex items-center gap-3 text-xs text-muted-foreground select-none">
        <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full bg-primary transition-[width] duration-300"
            style={{ width: `${tasks.length > 0 ? (expandedTasks.size / tasks.length) * 100 : 0}%` }}
          />
        </div>
        <span className="shrink-0 font-mono text-[10px]">
          {expandedTasks.size} / {tasks.length} explored
        </span>
      </div>

      {tasks.map((task, idx) => {
        const taskAnchor = slugify(task.task);
        const isExpanded = expandedTasks.has(idx);

        return (
          <section
            key={task.task}
            id={taskAnchor}
            className="scroll-mt-24 rounded-lg border border-border bg-card overflow-hidden"
          >
            <button
              onClick={() => toggleTask(idx)}
              className="w-full px-4 py-3 border-b border-border bg-muted/20 flex items-start gap-3 text-left cursor-pointer hover:bg-muted/30 transition-colors"
              aria-expanded={isExpanded}
            >
              <span className="shrink-0 mt-0.5 flex h-5 w-5 items-center justify-center rounded border border-border bg-background text-[9px] font-mono font-semibold text-muted-foreground select-none">
                {idx + 1}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground leading-snug">
                  {task.task}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">
                  <span className="font-medium text-foreground/70">When: </span>
                  {task.mental_trigger}
                </p>
              </div>
              {isExpanded
                ? <ChevronDown className="w-4 h-4 shrink-0 mt-0.5 text-muted-foreground" />
                : <ChevronRight className="w-4 h-4 shrink-0 mt-0.5 text-muted-foreground" />
              }
            </button>

            {isExpanded && (
              <div className="p-4 space-y-4">
                <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
                  <div className="rounded-lg border border-border bg-card p-4">
                    <h3 className="mb-2 text-sm font-semibold">Syntax</h3>
                    <CodeBlock code={task.syntax} language="python" />
                  </div>
                  <div className="rounded-lg border border-border bg-card p-4">
                    <h3 className="mb-2 text-sm font-semibold">Example</h3>
                    <CodeBlock code={task.example} language="python" />
                  </div>
                </div>

                <div className="grid gap-4 lg:grid-cols-3 text-sm">
                  <div>
                    <h4 className="text-[11px] font-semibold uppercase text-muted-foreground mb-1">Important parameters</h4>
                    <ul className="list-disc pl-4 space-y-1 text-muted-foreground">
                      {task.important_params.map((param, paramIdx) => (
                        <li key={paramIdx}>{param}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-[11px] font-semibold uppercase text-muted-foreground mb-1">When to use</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">{task.use_when}</p>
                  </div>
                  <div>
                    <h4 className="text-[11px] font-semibold uppercase text-muted-foreground mb-1">Avoid when</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">{task.avoid_when}</p>
                  </div>
                </div>

                {task.decision_notes && (
                  <div className="rounded-lg border border-border bg-card p-4 text-sm text-muted-foreground">
                    <h4 className="text-[11px] font-semibold uppercase mb-1">Decision notes</h4>
                    <p>{task.decision_notes}</p>
                  </div>
                )}

                {task.gotchas.length > 0 && (
                  <div className="border-l-2 border-amber-500 bg-amber-500/5 p-3 rounded-r text-sm text-amber-800 dark:text-amber-300">
                    <h3 className="text-[10px] font-semibold uppercase mb-1">Gotchas</h3>
                    <ul className="list-disc pl-4 space-y-1">
                      {task.gotchas.map((gotcha, gotchaIdx) => (
                        <li key={gotchaIdx}>{gotcha}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="grid gap-4 lg:grid-cols-2 text-sm">
                  <div>
                    <h4 className="text-[11px] font-semibold uppercase text-muted-foreground mb-1">Official docs</h4>
                    <a
                      href={task.official_docs}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline"
                    >
                      {task.official_docs}
                    </a>
                  </div>
                  {(task.related_workflows.length > 0 || task.related_cheatsheets.length > 0) && (
                    <div>
                      <h4 className="text-[11px] font-semibold uppercase text-muted-foreground mb-1">Related content</h4>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        {task.related_workflows.length > 0 && (
                          <p>Workflows: {task.related_workflows.join(', ')}</p>
                        )}
                        {task.related_cheatsheets.length > 0 && (
                          <p>Cheatsheets: {task.related_cheatsheets.join(', ')}</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}
