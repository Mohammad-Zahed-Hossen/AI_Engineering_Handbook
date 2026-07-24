'use client';

import { useState, useCallback } from 'react';
import CheatsheetEntry from '@/components/shared/CheatsheetEntry';
import { CodeBlockClient } from '@/components/shared/CodeBlockClient';
import ContentCommandPalette from '@/components/shared/ContentCommandPalette';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import type { CanonicalRelationship } from '@/lib/relationships/types';

interface ResolvedCheatsheetEntry {
  problem: string;
  trigger: string;
  snippet: string;
  minimal_notes: string;
  common_bug: string;
  docs_url: string;
  anchorId: string;
  language?: 'python' | 'bash' | 'sh' | 'sql' | 'yaml' | 'json' | 'docker' | 'javascript' | 'js' | 'typescript' | 'ts' | 'text';
  related_packages: string[];
  related_workflows: string[];
  related_patterns: string[];
  related_decision_guides: string[];
  related_apis: string[];
  related_package_links: CanonicalRelationship[];
  related_workflow_links: CanonicalRelationship[];
  related_pattern_links: CanonicalRelationship[];
  related_decision_guide_links: CanonicalRelationship[];
}

interface CheatsheetEntryListProps {
  entries: ResolvedCheatsheetEntry[];
}

function slugify(value: string) {
  return value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

export default function CheatsheetEntryList({ entries }: CheatsheetEntryListProps) {
  const [expandedEntries, setExpandedEntries] = useState<Set<number>>(new Set());

  const toggleEntry = (idx: number) => {
    setExpandedEntries(prev => {
      const next = new Set(prev);
      if (next.has(idx)) {
        next.delete(idx);
      } else {
        next.add(idx);
      }
      return next;
    });
  };

  const handleEntrySelect = useCallback((entry: ResolvedCheatsheetEntry) => {
    const idx = entries.findIndex(e => e.problem === entry.problem);
    if (idx < 0) return;
    
    setExpandedEntries(prev => {
      const next = new Set(prev);
      next.add(idx);
      return next;
    });
    
    setTimeout(() => {
      const entryAnchor = entry.anchorId || `entry-${slugify(entry.problem)}`;
      document.getElementById(entryAnchor)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }, [entries]);

  // Search text for cheatsheet entries (combines all searchable fields)
  const getSearchText = useCallback((entry: ResolvedCheatsheetEntry): string => {
    return [
      entry.problem,
      entry.trigger,
      entry.minimal_notes,
      entry.common_bug,
      entry.snippet,
    ].filter(Boolean).join(' ');
  }, []);

  return (
    <div className="space-y-4">
      {/* Content Command Palette */}
      <ContentCommandPalette
        items={entries}
        getLabel={(entry) => entry.problem}
        getDescription={(entry) => entry.trigger}
        searchText={getSearchText}
        onSelect={handleEntrySelect}
        placeholder="Search entries by problem or trigger..."
      />

      <p className="text-xs text-muted-foreground">
        Tap any entry to expand
      </p>

      <div className="space-y-3">
        {entries.map((entry, idx) => (
          <CheatsheetEntry
            key={entry.anchorId || `${slugify(entry.problem)}-${idx}`}
            entry={entry}
            idx={idx}
            id={entry.anchorId || `entry-${slugify(entry.problem)}`}
            codeBlock={<CodeBlockClient code={entry.snippet} language={entry.language || 'python'} />}
            open={expandedEntries.has(idx)}
            onToggle={() => toggleEntry(idx)}
            relationships={
              <>
                {entry.related_package_links?.length > 0 && (
                  <div className="border-t border-border pt-2 mt-2">
                    <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Related Package APIs</h4>
                    <div className="flex flex-wrap gap-1">
                      {entry.related_package_links.map((ref) => (
                        <Link
                          key={ref.id}
                          href={ref.href}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-medium bg-primary/5 text-primary hover:bg-primary/10 border border-primary/10 transition-colors"
                        >
                          {ref.title}
                          <ChevronRight className="w-2.5 h-2.5" />
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
                {entry.related_workflow_links?.length > 0 && (
                  <div className="border-t border-border pt-2 mt-2">
                    <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Related Workflows</h4>
                    <div className="flex flex-wrap gap-1">
                      {entry.related_workflow_links.map((ref) => (
                        <Link
                          key={ref.id}
                          href={ref.href}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-medium bg-indigo-500/5 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/10 border border-indigo-500/10 transition-colors"
                        >
                          {ref.title}
                          <ChevronRight className="w-2.5 h-2.5" />
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
                {entry.related_pattern_links?.length > 0 && (
                  <div className="border-t border-border pt-2 mt-2">
                    <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Related Patterns</h4>
                    <div className="flex flex-wrap gap-1">
                      {entry.related_pattern_links.map((ref) => (
                        <Link
                          key={ref.id}
                          href={ref.href}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-medium bg-amber-500/5 text-amber-600 dark:text-amber-400 hover:bg-amber-500/10 border border-amber-500/10 transition-colors"
                        >
                          {ref.title}
                          <ChevronRight className="w-2.5 h-2.5" />
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
                {entry.related_decision_guide_links?.length > 0 && (
                  <div className="border-t border-border pt-2 mt-2">
                    <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Related Decision Guides</h4>
                    <div className="flex flex-wrap gap-1">
                      {entry.related_decision_guide_links.map((ref) => (
                        <Link
                          key={ref.id}
                          href={ref.href}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-medium bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 border border-emerald-500/10 transition-colors"
                        >
                          {ref.title}
                          <ChevronRight className="w-2.5 h-2.5" />
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </>
            }
          />
        ))}
      </div>
    </div>
  );
}
