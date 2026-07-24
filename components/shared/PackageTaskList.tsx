'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { 
  CheckCircle2, 
  XCircle, 
  Sliders, 
  FileText, 
  AlertTriangle, 
  ExternalLink, 
  Link2
} from 'lucide-react';
import type { PackageTask } from '@/types/package';
import type { CanonicalRelationship } from '@/lib/relationships/types';
import ExpandableText from '@/components/shared/ExpandableText';
import VisualizationEquivalents from '@/components/shared/VisualizationEquivalents';
import type { VisualizationEquivalent } from '@/types/package';
import CollapsibleRow from './CollapsibleRow';
import ContentCommandPalette from './ContentCommandPalette';

interface ResolvedTask extends PackageTask {
  related_workflow_links: CanonicalRelationship[];
  related_cheatsheet_links: CanonicalRelationship[];
  related_model_links: CanonicalRelationship[];
  related_pattern_links: CanonicalRelationship[];
  related_decision_guide_links: CanonicalRelationship[];
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

type LegacyPackageTask = PackageTask & {
  important_parameters?: string[];
};

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

function getImportantParameters(task: PackageTask): string[] | undefined {
  const legacyTask = task as LegacyPackageTask;
  return task.important_params ?? legacyTask.important_parameters;
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

interface ParsedParameter {
  name: string;
  typeOrDefault?: string;
  description?: string;
}

function parseParameterString(paramStr: string): ParsedParameter {
  if (!paramStr) return { name: '' };
  
  let clean = paramStr.trim();
  if (clean.endsWith('.')) {
    clean = clean.slice(0, -1).trim();
  }

  // Pattern 1: `param_name (type/default): description` or `param_name (type/default) — description`
  const typedMatch = clean.match(/^(`?[a-zA-Z0-9_*.]+(?:\[.*?\])?`?)\s*\(([^)]+)\)\s*(?:[:—–]|\s-\s)\s*(.+)$/);
  if (typedMatch) {
    return {
      name: typedMatch[1].replace(/^`|`$/g, '').trim(),
      typeOrDefault: typedMatch[2].trim(),
      description: typedMatch[3].trim()
    };
  }

  // Pattern 2: `param_name: description` or `param_name — description` or `param_name - description`
  const descMatch = clean.match(/^(`?[a-zA-Z0-9_*.]+(?:\[.*?\])?`?)\s*(?:[:—–]|\s-\s)\s*(.+)$/);
  if (descMatch) {
    return {
      name: descMatch[1].replace(/^`|`$/g, '').trim(),
      description: descMatch[2].trim()
    };
  }

  // Pattern 3: `param_name (type/default)`
  const typeOnlyMatch = clean.match(/^(`?[a-zA-Z0-9_*.]+(?:\[.*?\])?`?)\s*\(([^)]+)\)$/);
  if (typeOnlyMatch) {
    return {
      name: typeOnlyMatch[1].replace(/^`|`$/g, '').trim(),
      typeOrDefault: typeOnlyMatch[2].trim()
    };
  }

  // Pattern 4: Simple parameter name
  return {
    name: clean.replace(/^`|`$/g, '')
  };
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

  const handleTaskSelect = useCallback((task: ResolvedTask) => {
    const idx = tasks.findIndex(t => t.task === task.task);
    if (idx < 0) return;
    
    setExpandedTasks(prev => {
      const next = new Set(prev);
      next.add(idx);
      return next;
    });
    
    setTimeout(() => {
      const taskAnchor = slugify(task.task);
      document.getElementById(taskAnchor)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }, [tasks]);

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

  // Search text for package tasks (combines all searchable fields)
  const getSearchText = useCallback((task: ResolvedTask): string => {
    const rawParams = getImportantParameters(task);
    return [
      task.task,
      task.mental_trigger,
      task.syntax,
      Array.isArray(rawParams) ? rawParams.join(' ') : '',
      task.gotchas?.join(' '),
    ].filter(Boolean).join(' ');
  }, []);

  return (
      <div className="space-y-3" aria-label={`${packageName} tasks`}>
        {/* Content Command Palette */}
        <ContentCommandPalette
          items={tasks}
          getLabel={(task) => task.task}
          getDescription={(task) => task.mental_trigger}
          searchText={getSearchText}
          onSelect={handleTaskSelect}
          placeholder="Search tasks, syntax, parameters..."
        />

        {/* Progress indicator - more compact */}
        <div className="flex items-center gap-2 text-[10px] text-muted-foreground select-none">
          <div className="flex-1 h-1 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-primary transition-[width] duration-300"
              style={{ width: `${tasks.length > 0 ? (expandedTasks.size / tasks.length) * 100 : 0}%` }}
            />
          </div>
          <span className="shrink-0 font-mono">
            {expandedTasks.size}/{tasks.length}
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
                <span className="line-clamp-2 sm:line-clamp-none">&ldquo;{task.mental_trigger}&rdquo;</span>
              </div>
            }
            icon={
              <span className="shrink-0 mt-0.5 flex h-6 w-6 items-center justify-center rounded-lg border border-border bg-background text-[10px] font-mono font-bold text-muted-foreground select-none">
                {idx + 1}
              </span>
            }
            open={isExpanded}
            onToggle={() => toggleTask(idx)}
            enableHashDeepLink={false}
            align="start"
            headerClassName="px-3.5 py-2.5 sm:px-4 sm:py-3 border-b border-border bg-muted/10 hover:bg-muted/20"
            contentClassName="p-3 sm:p-4 space-y-3.5"
            >
            {isExpanded && (
              <div className="space-y-3.5">
                {/* Mental Trigger - Prominent at top */}
                {task.mental_trigger && (
                  <div className="border-l-2 border-primary pl-2.5">
                    <p className="text-xs text-foreground italic leading-snug">
                      {task.mental_trigger}
                    </p>
                  </div>
                )}

                {/* Syntax & Example - Side by side on desktop */}
                <div className="grid gap-2.5 md:grid-cols-2">
                  <div className="min-w-0">
                    <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1 flex items-center gap-1">
                      <Sliders className="w-3 h-3" />
                      Syntax
                    </h4>
                    <div className="text-[11px] overflow-x-auto">{task.syntaxBlock}</div>
                  </div>
                  {task.example && task.example.trim().length > 0 && (
                    <div className="min-w-0">
                      <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1 flex items-center gap-1">
                        <FileText className="w-3 h-3" />
                        Example
                      </h4>
                      <div className="text-[11px] overflow-x-auto">{task.exampleBlock}</div>
                    </div>
                  )}
                </div>

                {/* Parameters - key-value cards / structured view */}
                {(() => {
                  const rawParams = getImportantParameters(task);
                  if (!rawParams || !Array.isArray(rawParams) || rawParams.length === 0) return null;

                  const parsed = rawParams.map(parseParameterString);
                  const hasAnyDescription = parsed.some(p => p.description || p.typeOrDefault);

                  return (
                    <div>
                      <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5 flex items-center gap-1">
                        <Sliders className="w-3 h-3 text-primary/70 shrink-0" />
                        Parameters
                      </h4>

                      {hasAnyDescription ? (
                        <div className="grid gap-1.5 sm:grid-cols-1">
                          {parsed.map((param, paramIdx) => (
                            <div
                              key={paramIdx}
                              className="flex flex-col sm:flex-row sm:items-baseline gap-1.5 sm:gap-2.5 p-2 rounded-lg bg-muted/20 dark:bg-muted/10 border border-border/60 hover:border-border transition-colors text-[11px]"
                            >
                              <div className="flex flex-wrap items-center gap-1.5 shrink-0">
                                <code className="font-mono font-bold text-primary bg-primary/10 dark:bg-primary/15 px-1.5 py-0.5 rounded text-[10px] border border-primary/20 select-all">
                                  {param.name}
                                </code>
                                {param.typeOrDefault && (
                                  <span className="text-[9px] font-mono text-muted-foreground/80 bg-muted px-1.5 py-0.2 rounded border border-border/50">
                                    {param.typeOrDefault}
                                  </span>
                                )}
                              </div>

                              {param.description && (
                                <span className="text-muted-foreground leading-snug text-[11px] flex-1">
                                  {param.description}
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-1.5">
                          {parsed.map((param, paramIdx) => (
                            <code
                              key={paramIdx}
                              className="px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold bg-muted/50 hover:bg-muted text-foreground border border-border/80 transition-colors select-all"
                            >
                              {param.name}
                            </code>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })()}

                {/* Decision Notes - Use/Avoid */}
                {(Boolean(task.use_when?.trim()) || Boolean(task.avoid_when?.trim())) && (
                  <div className="grid gap-2.5 md:grid-cols-2">
                    {Boolean(task.use_when?.trim()) && (
                      <div>
                        <h4 className="flex items-center gap-1 font-semibold text-emerald-700 dark:text-emerald-400 mb-1 text-[10px]">
                          <CheckCircle2 className="w-3 h-3 shrink-0" />
                          When to Use
                        </h4>
                        <ExpandableText
                          maxLines={3}
                          cacheKey={`pkg-${packageName}-${taskAnchor}-use`}
                          fadeClass="from-background to-transparent"
                        >
                          <p className="text-muted-foreground leading-snug text-[11px]">{task.use_when}</p>
                        </ExpandableText>
                      </div>
                    )}
                    {Boolean(task.avoid_when?.trim()) && (
                      <div>
                        <h4 className="flex items-center gap-1 font-semibold text-rose-700 dark:text-rose-400 mb-1 text-[10px]">
                          <XCircle className="w-3 h-3 shrink-0" />
                          Avoid When
                        </h4>
                        <ExpandableText
                          maxLines={3}
                          cacheKey={`pkg-${packageName}-${taskAnchor}-avoid`}
                          fadeClass="from-background to-transparent"
                        >
                          <p className="text-muted-foreground leading-snug text-[11px]">{task.avoid_when}</p>
                        </ExpandableText>
                      </div>
                    )}
                  </div>
                )}

                {/* Gotchas - Safety & Pitfalls */}
                {(notes.commonMistakes || (task.gotchas && task.gotchas.length > 0)) && (
                  <div>
                    <h4 className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 mb-1">
                      <AlertTriangle className="w-3 h-3 shrink-0" />
                      Safety & Pitfalls
                    </h4>
                    <div className="text-[11px] space-y-1.5">
                      {notes.commonMistakes && (
                        <p className="text-amber-800/80 dark:text-amber-300/80">
                          {notes.commonMistakes}
                        </p>
                      )}
                      {task.gotchas && task.gotchas.length > 0 && (
                        <ul className="list-disc pl-3.5 space-y-0.5 text-amber-800/80 dark:text-amber-300/80">
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
                  <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1 flex items-center gap-1">
                    <Link2 className="w-3 h-3" />
                    Related Resources
                  </h4>
                  
                  <div className="space-y-2">
                    {/* Visualization Equivalents */}
                    <VisualizationEquivalents equivalents={visualizationEquivalents} currentPackageId={packageName} />

                    {/* Related APIs */}
                    {notes.relatedApis.length > 0 && (
                      <div className="flex flex-wrap gap-1">
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
                                className="inline-flex items-center gap-1 px-1.5 py-0 rounded-full text-[9px] font-mono font-semibold bg-primary/5 text-primary hover:bg-primary/10 border border-primary/10 transition-all"
                              >
                                <span>{apiName}</span>
                                <span className="text-[8px] uppercase tracking-wide opacity-75">(Local)</span>
                              </a>
                            );
                          }

                          return (
                            <span
                              key={apiIdx}
                              className="inline-flex items-center px-1.5 py-0 rounded-full text-[9px] font-mono font-medium bg-muted text-muted-foreground border border-border select-all"
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
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-semibold text-primary bg-primary/5 hover:bg-primary/10 border border-primary/10 transition-colors w-fit cursor-pointer select-none touch-target"
                      >
                        <ExternalLink className="w-3 h-3" />
                        Official API Documentation
                      </a>
                    )}

                    {/* Connected Guides - Relationship Chips */}
                    <div className="flex flex-wrap gap-1.5">
                      {task.related_model_links.map(ref => (
                        <Link
                          key={`model-${ref.id}`}
                          href={ref.href}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-medium bg-purple-500/5 text-purple-600 dark:text-purple-400 hover:bg-purple-500/10 border border-purple-500/10 transition-colors"
                        >
                          {ref.title}
                        </Link>
                      ))}
                      {task.related_pattern_links.map(ref => (
                        <Link
                          key={`pattern-${ref.id}`}
                          href={ref.href}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-medium bg-amber-500/5 text-amber-600 dark:text-amber-400 hover:bg-amber-500/10 border border-amber-500/10 transition-colors"
                        >
                          {ref.title}
                        </Link>
                      ))}
                      {task.related_workflow_links.map(ref => (
                        <Link
                          key={`workflow-${ref.id}`}
                          href={ref.href}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-medium bg-indigo-500/5 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/10 border border-indigo-500/10 transition-colors"
                        >
                          {ref.title}
                        </Link>
                      ))}
                      {task.related_cheatsheet_links.map(ref => (
                        <Link
                          key={`cheatsheet-${ref.id}`}
                          href={ref.href}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-medium bg-primary/5 text-primary hover:bg-primary/10 border border-primary/10 transition-colors"
                        >
                          {ref.title}
                        </Link>
                      ))}
                      {task.related_decision_guide_links.map(ref => (
                        <Link
                          key={`decision-guide-${ref.id}`}
                          href={ref.href}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-medium bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 border border-emerald-500/10 transition-colors"
                        >
                          {ref.title}
                        </Link>
                      ))}
                    </div>
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