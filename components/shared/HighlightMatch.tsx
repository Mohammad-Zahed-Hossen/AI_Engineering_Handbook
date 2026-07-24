'use client';

import React from 'react';

interface HighlightMatchProps {
  text?: string | null;
  match?: string | null;
  className?: string;
  highlightClassName?: string;
}

/**
 * Lightweight presentational component to highlight matching search query substrings
 * in short strings (titles, names, labels). Zero business logic, purely visual.
 */
export default function HighlightMatch({
  text,
  match,
  className = '',
  highlightClassName = 'bg-amber-500/20 text-amber-900 dark:text-amber-200 font-medium rounded-sm px-0.5',
}: HighlightMatchProps) {
  if (!text) return null;
  if (!match || !match.trim()) {
    return <span className={className}>{text}</span>;
  }

  const query = match.trim();
  // Escape special regex characters in query
  const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escapedQuery})`, 'gi');
  const parts = text.split(regex);

  return (
    <span className={className}>
      {parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <mark key={i} className={highlightClassName}>
            {part}
          </mark>
        ) : (
          <React.Fragment key={i}>{part}</React.Fragment>
        )
      )}
    </span>
  );
}
