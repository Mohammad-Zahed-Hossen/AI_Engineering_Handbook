'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  ChevronDown, 
  ChevronRight, 
  CheckCircle2, 
  XCircle, 
  Sliders, 
  FileText, 
  AlertTriangle, 
  ExternalLink, 
  Link2 
} from 'lucide-react';
import { CodeBlock } from '@/components/shared/CodeBlock';
import type { PackageTask } from '@/types/package';
import ExpandableText from '@/components/shared/ExpandableText';
import VisualizationEquivalents from '@/components/shared/VisualizationEquivalents';
import type { VisualizationEquivalent } from '@/types/package';

interface ResolvedRef { id: string; href: string; name: string }

interface ResolvedTask extends PackageTask {
  related_workflow_links: ResolvedRef[];
  related_cheatsheet_links: ResolvedRef[];
  visualization_equivalents: VisualizationEquivalent[];
}

interface PackageTaskListProps {
  tasks: ResolvedTask[];
  packageName: string;
  language?: string;
}

interface ParsedDecisionNotes {
  category: string;
  module: string;
  returnValue: string;
  expectedOutput: string;
  performance: string;
  commonMistakes: string;
  relatedApis: string[];
}

function slugify(value: string) {
  return value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

function parseDecisionNotes(notes: string): ParsedDecisionNotes {
  const result: ParsedDecisionNotes = {
    category: '',
    module: '',
    returnValue: '',
    expectedOutput: '',
    performance: '',
    commonMistakes: '',
    relatedApis: [],
  };

  if (!notes) return result;

  const lines = notes.split('\n');
  lines.forEach(line => {
    const trimmed = line.trim();
    const colonIdx = trimmed.indexOf(':');
    if (colonIdx === -1) return;

    const key = trimmed.slice(0, colonIdx).trim().toLowerCase();
    const value = trimmed.slice(colonIdx + 1).trim();

    if (key.includes('category')) {
      result.category = value;
    } else if (key.includes('module')) {
      result.module = value;
    } else if (key.includes('return value') || key === 'return') {
      result.returnValue = value;
    } else if (key.includes('expected output') || key.includes('output')) {
      result.expectedOutput = value;
    } else if (key.includes('performance')) {
      result.performance = value;
    } else if (key.includes('common mistakes') || key.includes('mistakes')) {
      result.commonMistakes = value;
    } else if (key.includes('related apis') || key.includes('related')) {
      result.relatedApis = value
        .split(',')
        .map(item => item.trim().replace(/\.$/, '').replace(/^`|`$/g, '').trim())
        .filter(Boolean);
    }
  });

  return result;
}

function getNormalizedApiName(name: string): string {
  const clean = name.trim().replace(/^`|`$/g, '');
  const parts = clean.split('.');
  const lastPart = parts[parts.length - 1].toLowerCase();
  const firstPart = parts[0]?.toLowerCase() || '';

  // Handle Matplotlib-specific aliases (cla/clf equivalents)
  if (lastPart === 'clear') {
    if (firstPart === 'axes' || firstPart === 'ax') {
      return 'cla';
    }
    if (firstPart === 'figure' || firstPart === 'fig') {
      return 'clf';
    }
  }

  return lastPart;
}

function getNormalizedSyntaxFunc(syntax: string): string {
  const funcName = syntax.split('(')[0].trim();
  const parts = funcName.split('.');
  const lastPart = parts[parts.length - 1].toLowerCase();
  
  if (lastPart === 'cla') return 'cla';
  if (lastPart === 'clf') return 'clf';
  
  return lastPart;
}

export default function PackageTaskList({ tasks, packageName, language = 'python' }: PackageTaskListProps) {
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
        const notes = parseDecisionNotes(task.decision_notes || '');
        const visualizationEquivalents = task.visualization_equivalents ?? [];

        return (
          <section
            key={`${task.task}-${idx}`}
            id={taskAnchor}
            className="scroll-mt-24 rounded-lg border border-border bg-card overflow-hidden"
          >
            <button
              onClick={() => toggleTask(idx)}
              className="w-full px-4 py-3.5 border-b border-border bg-muted/10 flex items-start gap-3 text-left cursor-pointer hover:bg-muted/20 transition-all select-none"
              aria-expanded={isExpanded}
            >
              <span className="shrink-0 mt-0.5 flex h-6 w-6 items-center justify-center rounded-lg border border-border bg-background text-[10px] font-mono font-bold text-muted-foreground select-none">
                {idx + 1}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <span className="text-sm font-bold text-foreground leading-snug">
                    {task.task}
                  </span>
                  {notes.category && (
                    <span className="inline-block rounded-full bg-primary/10 text-primary px-2.5 py-0.5 text-[9px] font-semibold tracking-wide uppercase">
                      {notes.category}
                    </span>
                  )}
                  {notes.module && (
                    <span className="inline-block rounded bg-muted text-muted-foreground px-1.5 py-0.5 text-[9px] font-mono font-medium">
                      {notes.module}
                    </span>
                  )}
                </div>
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed italic flex items-start sm:items-center gap-1">
                  <span className="text-primary/70 shrink-0 font-medium not-italic text-[10px] uppercase tracking-wider select-none">Trigger:</span>
                  <span className="line-clamp-2 sm:line-clamp-none">&quot;{task.mental_trigger}&quot;</span>
                </p>
              </div>
              {isExpanded
                ? <ChevronDown className="w-4 h-4 shrink-0 mt-1 text-muted-foreground" />
                : <ChevronRight className="w-4 h-4 shrink-0 mt-1 text-muted-foreground" />
              }
            </button>

            {isExpanded && (
              <div className="p-4 space-y-6">
                {/* 1. Technical Workbench: Syntax & Example */}
                <div className="grid gap-4 lg:grid-cols-[1.1fr_1fr]">
                  <div className="rounded-lg border border-border bg-muted/5 dark:bg-muted/[0.01] p-4 min-w-0 flex flex-col justify-between">
                    <div>
                      <h4 className="mb-2 text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5 select-none">
                        <Sliders className="w-3.5 h-3.5 text-muted-foreground" />
                        Syntax Definition
                      </h4>
                      <div className="text-xs">
                        <CodeBlock code={task.syntax} language={language} />
                      </div>
                    </div>
                  </div>
                  <div className="rounded-lg border border-border bg-muted/5 dark:bg-muted/[0.01] p-4 min-w-0">
                    <h4 className="mb-2 text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5 select-none">
                      <FileText className="w-3.5 h-3.5 text-muted-foreground" />
                      Code Example
                    </h4>
                    <div className="text-xs">
                      <CodeBlock code={task.example} language={language} />
                    </div>
                  </div>
                </div>

                {/* 2. Usage Decisions (When to Use & Avoid When) */}
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 dark:bg-emerald-500/[0.01] p-4 text-sm flex flex-col justify-between">
                    <div>
                      <h4 className="flex items-center gap-1.5 font-semibold text-emerald-700 dark:text-emerald-400 mb-2.5">
                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                        When to Use
                      </h4>
                      <ExpandableText
                        maxLines={3}
                        cacheKey={`pkg-${packageName}-${taskAnchor}-use`}
                        fadeClass="from-emerald-500/5 dark:from-emerald-500/[0.01] to-transparent"
                      >
                        <p className="text-muted-foreground leading-relaxed text-xs">{task.use_when}</p>
                      </ExpandableText>
                    </div>
                  </div>
                  <div className="rounded-lg border border-rose-500/20 bg-rose-500/5 dark:bg-rose-500/[0.01] p-4 text-sm flex flex-col justify-between">
                    <div>
                      <h4 className="flex items-center gap-1.5 font-semibold text-rose-700 dark:text-rose-400 mb-2.5">
                        <XCircle className="w-4 h-4 shrink-0" />
                        Avoid When
                      </h4>
                      <ExpandableText
                        maxLines={3}
                        cacheKey={`pkg-${packageName}-${taskAnchor}-avoid`}
                        fadeClass="from-rose-500/5 dark:from-rose-500/[0.01] to-transparent"
                      >
                        <p className="text-muted-foreground leading-relaxed text-xs">{task.avoid_when}</p>
                      </ExpandableText>
                    </div>
                  </div>
                </div>

                {/* 3. Signature & Behavior */}
                <div className="rounded-lg border border-border bg-card p-4 space-y-4">
                  <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5 select-none">
                    <Sliders className="w-3.5 h-3.5 text-muted-foreground" />
                    Signature & Output
                  </h4>
                  <div className="grid gap-4 sm:grid-cols-2 text-xs">
                    <div className="space-y-2">
                      <span className="font-semibold text-foreground/80 block">Key Parameters</span>
                      {task.important_params && task.important_params.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5">
                          {task.important_params.map((param, paramIdx) => (
                            <code
                              key={paramIdx}
                              className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-muted text-foreground border border-border select-all hover:bg-muted/80 transition-colors"
                            >
                              {param.replace(/\.$/, '')}
                            </code>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted-foreground italic">None specified</p>
                      )}
                    </div>

                    <div className="space-y-2.5">
                      <span className="font-semibold text-foreground/80 block">Expected Result</span>
                      <div className="space-y-2 bg-muted/30 rounded-lg p-3 border border-border/40">
                        {notes.returnValue || notes.expectedOutput ? (
                          <>
                            {notes.returnValue && (
                              <div className="flex items-baseline gap-2">
                                <span className="text-muted-foreground font-medium shrink-0">Returns:</span>
                                <code className="text-primary font-mono font-semibold text-[11px] bg-primary/5 px-1 py-0.5 rounded border border-primary/10">
                                  {notes.returnValue}
                                </code>
                              </div>
                            )}
                            {notes.expectedOutput && (
                              <div className="text-muted-foreground leading-relaxed">
                                <span className="font-medium text-foreground/70">Behavior:</span> {notes.expectedOutput}
                              </div>
                            )}
                          </>
                        ) : (
                          <p className="text-muted-foreground italic">None specified</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {notes.performance && (
                    <div className="text-xs bg-blue-500/5 dark:bg-blue-500/[0.01] border border-blue-500/10 rounded-lg p-3 text-muted-foreground flex gap-2">
                      <span className="text-blue-500 shrink-0 mt-0.5 text-xs font-semibold uppercase tracking-wider">Performance:</span>
                      <div className="leading-relaxed">{notes.performance}</div>
                    </div>
                  )}
                </div>

                {/* 4. Safety & Pitfalls */}
                {(notes.commonMistakes || (task.gotchas && task.gotchas.length > 0)) && (
                  <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 dark:bg-amber-500/[0.01] p-4 space-y-3.5">
                    <h4 className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 select-none">
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      Safety & Pitfalls
                    </h4>
                    <div className="text-xs space-y-3">
                      {notes.commonMistakes && (
                        <div className="space-y-1 bg-amber-500/[0.03] rounded-lg p-3 border border-amber-500/10">
                          <span className="font-semibold text-amber-800 dark:text-amber-300 block">Common Mistakes to Avoid:</span>
                          <p className="text-amber-900/80 dark:text-amber-200/80 leading-relaxed">
                            {notes.commonMistakes}
                          </p>
                        </div>
                      )}
                      {task.gotchas && task.gotchas.length > 0 && (
                        <div className="space-y-1.5 pl-3">
                          <span className="font-semibold text-amber-800 dark:text-amber-300 block -ml-3">Technical Gotchas:</span>
                          <ul className="list-disc pl-4 space-y-1 text-amber-900/80 dark:text-amber-200/80 leading-relaxed">
                            {task.gotchas.map((gotcha, gotchaIdx) => (
                              <li key={gotchaIdx}>{gotcha}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 5. Ecosystem & Connections */}
                <div className="rounded-lg border border-border bg-card p-4 space-y-4">
                  <VisualizationEquivalents equivalents={visualizationEquivalents} currentPackageId={packageName} />

                  {visualizationEquivalents.length > 0 && ['matplotlib', 'seaborn', 'plotly-express'].includes(packageName.toLowerCase()) && (
                    <div className="border-b border-border/50 pb-1" />
                  )}

                  <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5 select-none">
                    <Link2 className="w-3.5 h-3.5 text-muted-foreground" />
                    Ecosystem & Next Steps
                  </h4>
                  
                  <div className="grid gap-4 sm:grid-cols-2 text-xs">
                    {/* Left: Related APIs */}
                    <div className="space-y-3">
                      <div>
                        <span className="font-semibold text-foreground/80 block mb-2">Related APIs & Alternatives</span>
                        {notes.relatedApis.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {notes.relatedApis.map((apiName, apiIdx) => {
                              const matchedTask = tasks.find(t => {
                                const normApi = getNormalizedApiName(apiName);
                                const normSyntax = getNormalizedSyntaxFunc(t.syntax);
                                return normApi === normSyntax;
                              });

                              if (matchedTask) {
                                const targetAnchor = slugify(matchedTask.task);
                                return (
                                  <a
                                    key={apiIdx}
                                    href={`#${targetAnchor}`}
                                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono font-semibold bg-primary/5 text-primary hover:bg-primary/10 border border-primary/10 hover:border-primary/20 transition-all"
                                  >
                                    <span>{apiName}</span>
                                    <span className="text-[9px] uppercase tracking-wide opacity-75">(Local)</span>
                                  </a>
                                );
                              }

                              return (
                                <span
                                  key={apiIdx}
                                  className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-mono font-medium bg-muted text-muted-foreground border border-border select-all"
                                >
                                  {apiName}
                                </span>
                              );
                            })}
                          </div>
                        ) : (
                          <span className="text-muted-foreground italic">None specified</span>
                        )}
                      </div>

                      {task.official_docs && (
                        <div className="pt-1">
                          <a
                              href={task.official_docs}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-primary bg-primary/5 hover:bg-primary/10 border border-primary/10 transition-colors w-fit cursor-pointer select-none"
                            >
                            <ExternalLink className="w-3.5 h-3.5" />
                            Official API Documentation
                          </a>
                        </div>
                      )}
                    </div>

                    {/* Right: Handbook content references */}
                    <div className="space-y-3 border-t sm:border-t-0 sm:border-l border-border pt-3 sm:pt-0 sm:pl-4">
                      <div>
                        <span className="font-semibold text-foreground/80 block mb-2">Connected Guides</span>
                        {(task.related_workflow_links.length > 0 || task.related_cheatsheet_links.length > 0) ? (
                          <div className="flex flex-col gap-2">
                            {task.related_workflow_links.map(ref => (
                              <Link
                                key={ref.id}
                                href={ref.href}
                                className="inline-flex items-center justify-between rounded-lg border border-border bg-muted/30 hover:bg-muted px-3 py-2 text-xs text-foreground transition-colors cursor-pointer"
                              >
                                <span className="font-medium">{ref.name}</span>
                                <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
                              </Link>
                            ))}
                            {task.related_cheatsheet_links.map(ref => (
                              <Link
                                key={ref.id}
                                href={ref.href}
                                className="inline-flex items-center justify-between rounded-lg border border-border bg-muted/30 hover:bg-muted px-3 py-2 text-xs text-foreground transition-colors cursor-pointer"
                              >
                                <span className="font-medium">{ref.name}</span>
                                <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
                              </Link>
                            ))}
                          </div>
                        ) : (
                          <span className="text-muted-foreground italic">No linked workflows or cheatsheets</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}

