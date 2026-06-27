'use client';

import { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { CodeBlock } from '@/components/shared/CodeBlock';
import type { CheatsheetEntry } from '@/types/cheatsheet';

interface CheatsheetEntryProps {
  entry: CheatsheetEntry;
  idx: number;
  id: string;
}

export default function CheatsheetEntry({ entry, idx, id }: CheatsheetEntryProps) {
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const expandFromHash = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash === id) {
        setExpanded(true);
        setTimeout(() => {
          document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    };

    expandFromHash();
    window.addEventListener('hashchange', expandFromHash);
    return () => window.removeEventListener('hashchange', expandFromHash);
  }, [id]);

  return (
    <section
      id={id}
      className="scroll-mt-24 rounded-lg border border-border bg-card overflow-hidden"
    >
      {/* Clickable header — always visible */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-4 py-3 border-b border-border bg-muted/20 flex items-start gap-3 text-left cursor-pointer hover:bg-muted/30 transition-colors"
        aria-expanded={expanded}
      >
        <span className="shrink-0 mt-0.5 flex h-5 w-5 items-center justify-center rounded border border-border bg-background text-[9px] font-mono font-semibold text-muted-foreground select-none">
          {idx + 1}
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground leading-snug">
            {entry.problem}
          </p>
          {entry.trigger && (
            <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed line-clamp-2">
              <span className="font-medium text-foreground/70">When: </span>
              {entry.trigger}
            </p>
          )}
        </div>
        {expanded
          ? <ChevronDown className="w-4 h-4 shrink-0 mt-0.5 text-muted-foreground" />
          : <ChevronRight className="w-4 h-4 shrink-0 mt-0.5 text-muted-foreground" />
        }
      </button>

      {/* Collapsible body */}
      {expanded && (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] divide-y lg:divide-y-0 lg:divide-x divide-border">
          {/* Left: Trigger + Notes + Bug */}
          <div className="p-4 space-y-3">
            {entry.trigger && (
              <div>
                <span className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground block mb-1">
                  When to use
                </span>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {entry.trigger}
                </p>
              </div>
            )}
            {entry.minimal_notes && (
              <div>
                <span className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground block mb-1">
                  Note
                </span>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {entry.minimal_notes}
                </p>
              </div>
            )}
            {entry.common_bug && (
              <div className="rounded border-l-2 border-amber-500 bg-amber-500/5 px-3 py-2">
                <span className="text-[9px] font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400 block mb-1">
                  Common bug
                </span>
                <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
                  {entry.common_bug}
                </p>
              </div>
            )}
            {entry.docs_url && (
              <a
                href={entry.docs_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] text-primary hover:underline block"
              >
                Docs ↗
              </a>
            )}
          </div>

          {/* Right: Code snippet */}
          <div className="p-4">
            <span className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground block mb-2">
              Snippet
            </span>
            <CodeBlock code={entry.snippet} language="python" />
          </div>
        </div>
      )}
    </section>
  );
}
