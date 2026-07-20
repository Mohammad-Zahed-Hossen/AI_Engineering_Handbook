'use client';

import { useState, useCallback } from 'react';
import CheatsheetEntry from '@/components/shared/CheatsheetEntry';
import { CodeBlockClient } from '@/components/shared/CodeBlockClient';
import ContentCommandPalette from '@/components/shared/ContentCommandPalette';
import type { CheatsheetEntry as CheatsheetEntryType } from '@/types/cheatsheet';

interface CheatsheetEntryListProps {
  entries: CheatsheetEntryType[];
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

  const handleEntrySelect = useCallback((entry: CheatsheetEntryType) => {
    const idx = entries.findIndex(e => e.problem === entry.problem);
    if (idx < 0) return;
    
    setExpandedEntries(prev => {
      const next = new Set(prev);
      next.add(idx);
      return next;
    });
    
    setTimeout(() => {
      const entryAnchor = `entry-${idx}`;
      document.getElementById(entryAnchor)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }, [entries]);

  // Search text for cheatsheet entries (combines all searchable fields)
  const getSearchText = useCallback((entry: CheatsheetEntryType): string => {
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
            key={idx}
            entry={entry}
            idx={idx}
            id={`entry-${idx}`}
            codeBlock={<CodeBlockClient code={entry.snippet} language={entry.language || 'python'} />}
            open={expandedEntries.has(idx)}
            onToggle={() => toggleEntry(idx)}
          />
        ))}
      </div>
    </div>
  );
}