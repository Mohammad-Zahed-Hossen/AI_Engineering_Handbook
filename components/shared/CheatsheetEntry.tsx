'use client';

import { useState } from 'react';
import { 
  CheckCircle2, 
  Info, 
  AlertTriangle, 
  ExternalLink, 
  Code 
} from 'lucide-react';
import type { CheatsheetEntry } from '@/types/cheatsheet';
import ExpandableText from '@/components/shared/ExpandableText';
import CollapsibleRow from './CollapsibleRow';

interface CheatsheetEntryProps {
  entry: CheatsheetEntry;
  idx: number;
  id: string;
  codeBlock?: React.ReactNode;
  open?: boolean;
  onToggle?: () => void;
}

export default function CheatsheetEntry({ entry, idx, id, codeBlock, open, onToggle }: CheatsheetEntryProps) {
  const [localExpanded, setLocalExpanded] = useState(false);
  const isControlled = open !== undefined;
  const isExpanded = isControlled ? open : localExpanded;

  const handleToggle = () => {
    if (isControlled && onToggle) {
      onToggle();
    } else {
      setLocalExpanded(prev => !prev);
    }
  };

  const label = (
    <span className="text-sm font-bold text-foreground leading-snug">
      {entry.problem}
    </span>
  );

  const teaser = entry.trigger ? (
    <div className="mt-1 text-xs text-muted-foreground leading-relaxed italic flex items-start sm:items-center gap-1">
      <span className="text-primary/70 shrink-0 font-medium not-italic text-[10px] uppercase tracking-wider select-none">When:</span>
      <span className="line-clamp-2 sm:line-clamp-none">"{entry.trigger}"</span>
    </div>
  ) : undefined;

  const icon = (
    <span className="shrink-0 mt-0.5 flex h-6 w-6 items-center justify-center rounded-lg border border-border bg-background text-[10px] font-mono font-bold text-muted-foreground select-none">
      {idx + 1}
    </span>
  );

  return (
    <CollapsibleRow
      id={id}
      label={label}
      teaser={teaser}
      icon={icon}
      open={isExpanded}
      onToggle={handleToggle}
      enableHashDeepLink={true}
      align="start"
      headerClassName="px-4 py-3.5 border-b border-border bg-muted/10 hover:bg-muted/20"
      contentClassName="p-0 border-t-0 bg-card"
    >
      {isExpanded && (
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr]">
          {/* Left: Trigger + Notes + Bug */}
          <div className="p-4 space-y-4">
            {/* When to use */}
            {entry.trigger && (
              <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 dark:bg-emerald-500/[0.01] p-3 text-xs">
                <h4 className="flex items-center gap-1.5 font-bold text-emerald-700 dark:text-emerald-400 mb-1.5 select-none uppercase tracking-wider text-[10px]">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  When to use
                </h4>
                <ExpandableText
                  maxLines={3}
                  cacheKey={`cheatsheet-${id}-trigger`}
                  fadeClass="from-emerald-500/5 dark:from-emerald-500/[0.01] to-transparent"
                >
                  <p className="text-muted-foreground leading-relaxed">
                    {entry.trigger}
                  </p>
                </ExpandableText>
              </div>
            )}

            {/* Note */}
            {entry.minimal_notes && (
              <div className="rounded-lg border border-border bg-muted/5 dark:bg-muted/[0.01] p-3 text-xs">
                <h4 className="flex items-center gap-1.5 font-bold text-foreground mb-1.5 select-none uppercase tracking-wider text-[10px]">
                  <Info className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                  Developer Notes
                </h4>
                <ExpandableText
                  maxLines={3}
                  cacheKey={`cheatsheet-${id}-notes`}
                >
                  <p className="text-muted-foreground leading-relaxed">
                    {entry.minimal_notes}
                  </p>
                </ExpandableText>
              </div>
            )}

            {/* Common bug */}
            {entry.common_bug && (
              <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 dark:bg-amber-500/[0.01] p-3 text-xs">
                <h4 className="flex items-center gap-1.5 font-bold text-amber-700 dark:text-amber-400 mb-1.5 select-none uppercase tracking-wider text-[10px]">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  Common Pitfalls & Bugs
                </h4>
                <ExpandableText
                  maxLines={3}
                  cacheKey={`cheatsheet-${id}-bug`}
                  fadeClass="from-amber-500/5 dark:from-amber-500/[0.01] to-transparent"
                >
                  <p className="text-amber-900/80 dark:text-amber-200/80 leading-relaxed">
                    {entry.common_bug}
                  </p>
                </ExpandableText>
              </div>
            )}

            {/* Documentation URL */}
            {entry.docs_url && (
              <div className="pt-1">
                <a
                  href={entry.docs_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-primary bg-primary/5 hover:bg-primary/10 border border-primary/10 transition-colors w-fit cursor-pointer select-none"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Official API Reference Documentation
                </a>
              </div>
            )}
          </div>

          {/* Right: Code snippet */}
          <div className="p-4 border-t lg:border-t-0 lg:border-l border-border bg-muted/5 dark:bg-muted/[0.005]">
            <h4 className="mb-2 text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5 select-none">
              <Code className="w-3.5 h-3.5 text-muted-foreground" />
              Code Snippet
            </h4>
            <div className="text-xs">
              {codeBlock}
            </div>
          </div>
        </div>
      )}
    </CollapsibleRow>
  );
}