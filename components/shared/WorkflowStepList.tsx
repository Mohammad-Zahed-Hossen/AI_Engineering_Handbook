'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronRight, Code, AlertCircle, Package } from 'lucide-react';
import Link from 'next/link';
import { WorkflowStep } from '@/types/workflow';
import ContentTypeBadge from './ContentTypeBadge';
import { parseLabeledClauses } from '@/lib/text/parseLabeledClauses';
import { parseStructuredWhat } from '@/lib/text/parseStructuredWhat';
import { ProseClient, ProseInline } from './Prose';
import { BadgeRow } from './BadgeRow';
import { CodeBlockInteractive } from './CodeBlockInteractive';

interface CollapsibleSectionProps {
  title: string;
  icon?: React.ReactNode;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

function CollapsibleSection({ title, icon, defaultOpen = false, children }: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 text-xs font-medium text-foreground cursor-pointer select-none min-h-[44px] min-w-[44px]"
        aria-expanded={isOpen}
      >
        {isOpen ? (
          <ChevronDown className="w-3 h-3" />
        ) : (
          <ChevronRight className="w-3 h-3" />
        )}
        {icon}
        {title}
      </button>
      {isOpen && (
        <div className="mt-2 pl-4 border-l border-border">
          {children}
        </div>
      )}
    </div>
  );
}

// Structured What component - renders parsed workflow step description
function StructuredWhat({ what }: { what: string }) {
  const structured = parseStructuredWhat(what);
  
  if (!structured) {
    // Fallback to plain prose rendering
    return (
      <ProseClient content={what} className="text-sm text-muted-foreground leading-relaxed" />
    );
  }

  return (
    <div className="space-y-4">
      {/* Main description - leading paragraph with better typography */}
      {structured.description && (
        <p className="text-sm text-foreground leading-relaxed">
          {structured.description}
        </p>
      )}
      
      {/* Structured sections - definition-row style with better spacing */}
      {structured.sections.length > 0 && (
        <div className="space-y-3">
          {structured.sections.map((section, idx) => (
            <div key={idx} className="flex flex-col gap-1">
              <span className="text-[10px] font-semibold uppercase text-muted-foreground tracking-wide">
                {section.label.replace(':', '')}
              </span>
              <div className="text-xs text-foreground leading-relaxed">
                {section.text.includes('\n') ? (
                  // Multi-line content: render as nested list
                  <ul className="space-y-1">
                    {section.text.split('\n').map((line, lineIdx) => (
                      <li key={lineIdx} className="flex items-start gap-1">
                        <span className="select-none">•</span>
                        <span className="flex-1">
                          <ProseInline content={line.trim()} />
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  // Single-line content: render inline
                  <ProseInline content={section.text} />
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

interface WorkflowStepItemProps {
  s: WorkflowStep;
  idx: number;
  totalSteps: number;
  isOpen: boolean;
  toggleStep: (idx: number) => void;
  renderAllUses: (uses: Record<string, string[]>) => React.ReactNode;
  relatedExample?: { name: string; related_step?: number };
  relatedExampleIndex?: number;
}

function WorkflowStepItem({
  s,
  idx,
  totalSteps,
  isOpen,
  toggleStep,
  renderAllUses,
  relatedExample,
  relatedExampleIndex
}: WorkflowStepItemProps) {
  const hasUses = s.uses && Object.values(s.uses).some(ids => Array.isArray(ids) && ids.length > 0);
  const hasCode = !!s.code;
  const hasFailures = s.failure_points.length > 0;
  const stepBodyRef = useRef<HTMLDivElement>(null);

  // Attach onBeforeMatch handler imperatively
  useEffect(() => {
    const element = stepBodyRef.current;
    if (element && !isOpen) {
      const handleBeforeMatch = () => toggleStep(idx);
      element.addEventListener('beforematch', handleBeforeMatch as unknown as EventListener);
      return () => element.removeEventListener('beforematch', handleBeforeMatch as unknown as EventListener);
    }
  }, [isOpen, idx, toggleStep]);

  return (
    <li
      id={`step-${s.step}`}
      className="relative"
    >
      {/* Step header — clean, no card styling */}
      <button
        onClick={() => toggleStep(idx)}
        className="w-full flex items-start gap-3 px-0 py-3 text-left hover:opacity-80 transition-opacity cursor-pointer"
        aria-expanded={isOpen}
        aria-controls={`step-${s.step}-content`}
      >
        {/* Step number with timeline connector */}
        <div className="flex flex-col items-center shrink-0">
          <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full font-mono font-bold text-sm sm:text-base bg-primary/10 text-primary border border-primary/20">
            {s.step}
          </div>
          {/* Timeline connector - only show if not last step */}
          {idx < totalSteps - 1 && (
            <div className="w-px h-6 sm:h-8 bg-border mt-2" />
          )}
        </div>
        
        <div className="flex-1 min-w-0 pt-1">
          <h3 className="text-sm sm:text-base font-semibold text-foreground leading-tight">
            {s.name}
          </h3>
          {/* Tool badges in header - compact */}
          {s.tools.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1.5">
              {s.tools.map(t => (
                <span
                  key={t}
                  className="text-[10px] font-mono text-muted-foreground"
                >
                  {t}{s.tools.indexOf(t) < s.tools.length - 1 ? ' ·' : ''}
                </span>
              ))}
            </div>
          )}
        </div>
        
        <div className="shrink-0 pt-1">
          {isOpen
            ? <ChevronDown className="w-4 h-4 text-muted-foreground" />
            : <ChevronRight className="w-4 h-4 text-muted-foreground" />
          }
        </div>
      </button>

      {/* Step body — clean reading surface */}
      <div
        ref={stepBodyRef}
        id={`step-${s.step}-content`}
        className="ml-11 space-y-4 [content-visibility:auto]"
        hidden={isOpen ? undefined : ('until-found' as unknown as boolean)}
      >
        {/* What/Explanation - main content with structured rendering */}
        <StructuredWhat what={s.what} />

        {/* Key Decision - compact, collapsible */}
        <CollapsibleSection title="Key Decision" defaultOpen={false}>
          <ProseClient content={s.decision} className="text-xs text-muted-foreground leading-relaxed" />
        </CollapsibleSection>

        {/* Code - collapsed by default if large */}
        {hasCode && s.highlightedCodeData && (
          <CollapsibleSection 
            title="Code" 
            icon={<Code className="w-3 h-3" />}
            defaultOpen={!s.highlightedCodeData.shouldCollapse}
          >
            <CodeBlockInteractive
              code={s.code!}
              language={s.language || 'python'}
              filename={s.name}
              showLineNumbers={false}
              fullHighlightedDark={s.highlightedCodeData.fullHighlightedDark}
              fullHighlightedLight={s.highlightedCodeData.fullHighlightedLight}
              collapsedHighlightedDark={s.highlightedCodeData.collapsedHighlightedDark}
              collapsedHighlightedLight={s.highlightedCodeData.collapsedHighlightedLight}
              shouldCollapse={s.highlightedCodeData.shouldCollapse}
              linesCount={s.highlightedCodeData.linesCount}
              maxCollapsedLines={s.highlightedCodeData.maxCollapsedLines}
            />
          </CollapsibleSection>
        )}

        {/* Metadata row - Input/Output/Packages/Models */}
        {hasUses && (
          <CollapsibleSection 
            title="Resources" 
            icon={<Package className="w-3 h-3" />}
            defaultOpen={false}
          >
            <div className="flex flex-wrap gap-1.5 items-center text-xs">
              <span className="text-[10px] font-semibold uppercase text-muted-foreground mr-1 select-none">Uses:</span>
              {renderAllUses(s.uses as Record<string, string[]>)}
            </div>
          </CollapsibleSection>
        )}

        {/* Failure Points - collapsed by default */}
        {hasFailures && (
          <CollapsibleSection 
            title="Watch Out" 
            icon={<AlertCircle className="w-3 h-3" />}
            defaultOpen={false}
          >
            <ul className="space-y-2">
              {s.failure_points.map((fp, fpIdx) => {
                const clauses = parseLabeledClauses(fp, ['Failure:', 'Trigger:', 'Downstream Effect:', 'Detection:']);
                
                if (clauses) {
                  return (
                    <li key={fpIdx} className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed space-y-0.5">
                      {clauses.map((clause, cIdx) => (
                        <div key={cIdx}>
                          <span className="font-semibold text-[10px] uppercase">{clause.label}</span>
                          <span className="ml-1"><ProseInline content={clause.text} /></span>
                        </div>
                      ))}
                    </li>
                  );
                }
                
                return (
                  <li key={fpIdx} className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
                    <ProseInline content={fp} />
                  </li>
                );
              })}
            </ul>
          </CollapsibleSection>
        )}

        {/* Related Example link */}
        {relatedExample && relatedExampleIndex !== undefined && (
          <div className="pt-1">
            <Link
              href={`#example-${relatedExampleIndex}`}
              className="inline-flex items-center gap-1 text-[10px] font-medium text-primary hover:underline"
            >
              View worked example →
            </Link>
          </div>
        )}
      </div>
    </li>
  );
}

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
    setExpandedSteps(new Set());
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

    const allBadges = Object.entries(uses).flatMap(([key, ids]) => {
      const type = typeMap[key] || (key.endsWith('s') ? key.slice(0, -1) : key);
      return renderUses(type, ids);
    }).filter(Boolean);

    return <BadgeRow defaultVisible={3}>{allBadges}</BadgeRow>;
  };

  return (
    <>
      {/* Expand/Collapse controls - subtle text links */}
      <div className="flex gap-2 mb-1">
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
          Collapse
        </button>
      </div>
      
      {/* Pipeline-style step list */}
      <ol className="space-y-0">
        {steps.map((s, idx) => {
          const isOpen = expandedSteps.has(idx);
          const relatedExample = workedExamples?.find(ex => ex.related_step === s.step);
          const relatedExampleIndex = workedExamples?.findIndex(ex => ex.related_step === s.step);

          return (
            <WorkflowStepItem
              key={s.step}
              s={s}
              idx={idx}
              totalSteps={steps.length}
              isOpen={isOpen}
              toggleStep={toggleStep}
              renderAllUses={renderAllUses}
              relatedExample={relatedExample}
              relatedExampleIndex={relatedExampleIndex}
            />
          );
        })}
      </ol>
    </>
  );
}