'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Clock, X } from 'lucide-react';
import { getRecentKnowledge, type RecentItem, clearRecentKnowledge } from '@/lib/session-tracking';
import ContentTypeBadge from './ContentTypeBadge';

function formatTimeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return `${Math.floor(seconds / 604800)}w ago`;
}

export default function RecentKnowledgeSection() {
  // Initialize to [] (SSR-safe). Hydrate from localStorage after mount.
  const [items, setItems] = useState<RecentItem[]>([]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setItems(getRecentKnowledge());
  }, []);

  const handleClear = () => {
    clearRecentKnowledge();
    setItems([]);
  };

  if (items.length === 0) return null;

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-foreground">Recent Knowledge</h2>
        <button
          onClick={handleClear}
          className="text-[10px] text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
        >
          <X className="w-3 h-3" />
          Clear
        </button>
      </div>
      <div className="grid gap-2 grid-cols-2 md:grid-cols-3">
        {items.slice(0, 6).map((item, idx) => (
          <Link
            key={`${item.href}-${idx}`}
            href={item.href}
            className="rounded-lg border border-border bg-card px-3 py-2 hover:border-foreground/20 hover:bg-muted/30 active:bg-muted/50 transition-colors"
          >
            <div className="flex items-start justify-between gap-2 mb-1">
              <span className="text-sm font-medium text-foreground leading-snug truncate min-w-0">{item.name}</span>
              <ContentTypeBadge type={item.type as never} className="px-1.5 py-0 text-[8px] shrink-0" />
            </div>
            <p className="text-[10px] font-mono text-muted-foreground flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatTimeAgo(item.timestamp)}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
