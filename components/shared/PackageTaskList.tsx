'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  ChevronRight, 
  CheckCircle2, 
  XCircle, 
  Sliders, 
  FileText, 
  AlertTriangle, 
  ExternalLink, 
  Link2
} from 'lucide-react';
import type { PackageTask } from '@/types/package';
import ExpandableText from '@/components/shared/ExpandableText';
import VisualizationEquivalents from '@/components/shared/VisualizationEquivalents';
import type { VisualizationEquivalent } from '@/types/package';
import CollapsibleRow from './CollapsibleRow';
import QuickCommandPalette from './QuickCommandPalette';

interface ResolvedRef { id: string; href: string; name: string }

interface ResolvedTask extends PackageTask {
  related_workflow_links: ResolvedRef[];
  related_cheatsheet_links: ResolvedRef[];
  visualization_equivalents: VisualizationEquivalent[];
  syntaxBlock?: React.ReactNode;
  exampleBlock?: React.ReactNode;
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

interface TaskForSearch {
  task: string;
  mental_trigger?: string;
  syntax: string;
  important_params?: string[];
  gotchas?: string[];
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

  const handleTaskSelect = (idx: number) => {
    setExpandedTasks(prev => {
      const next = new Set(prev);
      next.add(idx);
      return next;
    });
    
    setTimeout(() => {
      const taskAnchor = slugify(tasks[idx].task);
      document.getElementById(taskAnchor)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
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

  // Prepare tasks for search
  const tasksForSearch: TaskForSearch[] = tasks.map(task => ({
    task: task.task,
    mental_trigger: task.mental_trigger,
    syntax: task.syntax,
    important_params: task.important_params,
    gotchas: task.gotchas,
  }));

  return (
    <div className="space-y-4" aria-label={`${packageName} tasks`}>
      {/* Quick Command Palette */}
      <QuickCommandPalette tasks={tasksForSearch} onTaskSelect={handleTaskSelect} />

      {/* Progress indicator */}
      <div className="flex items-center gap-3 text-xs text-muted-foreground select-none">
        <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full bg-primary transition-[width] duration-300"
            style={{ width: `${tasks.length > 0 ? (expandedTasks.size / tasks.length) * 100 : 0}%` }}
          />
        </div>
        <span className="shrink-0 font-mono text-[10px]">
          {expandedTasks.size} / {tasks.length} tasks viewed
        </span>
      </div>

      {tasks.map((task, idx) => {
        const taskAnchor = slugify(task.task);
        const isExpanded = expandedTasks.has(idx);
        const notes = parseDecisionNotes(task.decision_notes || '');
        const visualizationEquivalents = task.visualization_equivalents ?? [];

        return (
          <CollapsibleRow
            key={`${task.task}-${idx}`}
            id={taskAnchor}
            label={
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
            }
            teaser={
              <div className="mt-1 text-xs text-muted-foreground leading-relaxed italic flex items-start sm:items-center gap-1">
                <span className="text-primary/70 shrink-0 font-medium not-italic text-[10px] uppercase tracking-wider select-none">Trigger:</span>
                <span className="line-clamp-2 sm:line-clamp-none">"{task.mental_trigger}"</span>
              </div>
            }
            icon={
              <span className="shrink-0 mt-0.5 flex h-6 w-6 items-center justify-center rounded-lg border border-border bg-background text-[10px] font-mono font-bold text-muted-foreground select-none">
                {idx + 1}
              </span>
            }
            open={isExpanded}
            onToggle={() => toggleTask(idx)}
            enableHashDeepLink={true}
            align="start"
            headerClassName="px-4 py-3.5 border-b border-border bg-muted/10 hover:bg-muted/20"
            contentClassName="p-0 border-t-0 bg-card"
          >
            {isExpanded && (
              <div className="mobile-card-padding space-y-5">
                {/* Mental Trigger - Prominent at top */}
                {task.mental_trigger && (
                  <div className="border-l-2 border-primary pl-3">
                    <p className="text-xs text-foreground italic leading-relaxed">
                      {task.mental_trigger}
                    </p>
                  </div>
                )}

                {/* Syntax & Example - Side by side on desktop */}
                <div className="grid gap-3 md:grid-cols-2">
                  <div>
                    <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                      <Sliders className="w-3.5 h-3.5" />
                      Syntax
                    </h4>
                    <div className="text-xs">{task.syntaxBlock}</div>
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5" />
                      Example
                    </h4>
                    <div className="text-xs">{task.exampleBlock}</div>
                  </div>
                </div>

                {/* Parameters - as chips */}
                {task.important_params && task.important_params.length > 0 && (
                  <div>
                    <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5">
                      Parameters
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {task.important_params.map((param, paramIdx) => (
                        <code
                          key={paramIdx}
                          className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-muted text-foreground border border-border select-all"
                        >
                          {param.replace(/\.$/, '')}
                        </code>
                      ))}
                    </div>
                  </div>
                )}

                {/* Decision Notes - Use/Avoid */}
                {(task.use_when || task.avoid_when) && (
                  <div className="grid gap-3 md:grid-cols-2">
                    {task.use_when && (
                      <div>
                        <h4 className="flex items-center gap-1.5 font-semibold text-emerald-700 dark:text-emerald-400 mb-1.5 text-[10px]">
                          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                          When to Use
                        </h4>
                        <ExpandableText
                          maxLines={3}
                          cacheKey={`pkg-${packageName}-${taskAnchor}-use`}
                          fadeClass="from-background to-transparent"
                        >
                          <p className="text-muted-foreground leading-relaxed text-xs">{task.use_when}</p>
                        </ExpandableText>
                      </div>
                    )}
                    {task.avoid_when && (
                      <div>
                        <h4 className="flex items-center gap-1.5 font-semibold text-rose-700 dark:text-rose-400 mb-1.5 text-[10px]">
                          <XCircle className="w-3.5 h-3.5 shrink-0" />
                          Avoid When
                        </h4>
                        <ExpandableText
                          maxLines={3}
                          cacheKey={`pkg-${packageName}-${taskAnchor}-avoid`}
                          fadeClass="from-background to-transparent"
                        >
                          <p className="text-muted-foreground leading-relaxed text-xs">{task.avoid_when}</p>
                        </ExpandableText>
                      </div>
                    )}
                  </div>
                )}

                {/* Gotchas - Safety & Pitfalls */}
                {(notes.commonMistakes || (task.gotchas && task.gotchas.length > 0)) && (
                  <div>
                    <h4 className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 mb-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                      Safety & Pitfalls
                    </h4>
                    <div className="text-xs space-y-2">
                      {notes.commonMistakes && (
                        <p className="text-amber-800/80 dark:text-amber-300/80">
                          {notes.commonMistakes}
                        </p>
                      )}
                      {task.gotchas && task.gotchas.length > 0 && (
                        <ul className="list-disc pl-4 space-y-1 text-amber-800/80 dark:text-amber-300/80">
                          {task.gotchas.map((gotcha, gotchaIdx) => (
                            <li key={gotchaIdx}>{gotcha}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                )}

                {/* Related Resources */}
                <div>
                  <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <Link2 className="w-3.5 h-3.5" />
                    Related Resources
                  </h4>
                  
                  <div className="space-y-2.5">
                    {/* Visualization Equivalents */}
                    <VisualizationEquivalents equivalents={visualizationEquivalents} currentPackageId={packageName} />

                    {/* Related APIs */}
                    {notes.relatedApis.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
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
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-primary/5 text-primary hover:bg-primary/10 border border-primary/10 transition-all"
                              >
                                <span>{apiName}</span>
                                <span className="text-[9px] uppercase tracking-wide opacity-75">(Local)</span>
                              </a>
                            );
                          }

                          return (
                            <span
                              key={apiIdx}
                              className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-muted text-muted-foreground border border-border select-all"
                            >
                              {apiName}
                            </span>
                          );
                        })}
                      </div>
                    )}

                    {/* Official Docs */}
                    {task.official_docs && (
                      <a
                        href={task.official_docs}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] font-semibold text-primary bg-primary/5 hover:bg-primary/10 border border-primary/10 transition-colors w-fit cursor-pointer select-none touch-target"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        Official API Documentation
                      </a>
                    )}

                    {/* Connected Guides */}
                    {(task.related_workflow_links.length > 0 || task.related_cheatsheet_links.length > 0) && (
                      <div className="flex flex-col gap-1.5">
                        {task.related_workflow_links.map(ref => (
                          <Link
                            key={ref.id}
                            href={ref.href}
                            className="inline-flex items-center justify-between rounded-lg border border-border bg-muted/30 hover:bg-muted px-2.5 py-1.5 text-[10px] text-foreground transition-colors cursor-pointer touch-target"
                          >
                            <span className="font-medium">{ref.name}</span>
                            <ChevronRight className="w-3 h-3 text-muted-foreground" />
                          </Link>
                        ))}
                        {task.related_cheatsheet_links.map(ref => (
                          <Link
                            key={ref.id}
                            href={ref.href}
                            className="inline-flex items-center justify-between rounded-lg border border-border bg-muted/30 hover:bg-muted px-2.5 py-1.5 text-[10px] text-foreground transition-colors cursor-pointer touch-target"
                          >
                            <span className="font-medium">{ref.name}</span>
                            <ChevronRight className="w-3 h-3 text-muted-foreground" />
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </CollapsibleRow>
        );
      })}
    </div>
  );
}