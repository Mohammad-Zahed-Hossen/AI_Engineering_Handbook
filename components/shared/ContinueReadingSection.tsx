'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { BookOpen, X } from 'lucide-react';
import { getContinueReading, dismissContinueReadingItem, type ContinueReadingItem, clearContinueReading } from '@/lib/session-tracking';
import ContentTypeBadge from './ContentTypeBadge';

function formatTimeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return `${Math.floor(seconds / 604800)}w ago`;
}

export default function ContinueReadingSection() {
  // Initialize to empty array (SSR-safe). Hydrate from localStorage after mount.
  const [items, setItems] = useState<ContinueReadingItem[]>([]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setItems(getContinueReading());
  }, []);

  const handleDismiss = (href: string) => {
    dismissContinueReadingItem(href);
    setItems(items.filter(i => i.href !== href));
  };

  const handleClearAll = () => {
    clearContinueReading();
    setItems([]);
  };

  // items.length === 0 means not yet mounted or nothing stored. Both render nothing.
  if (items.length === 0) return null;

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-foreground">Continue Reading</h2>
        <button
          onClick={handleClearAll}
          className="text-[10px] text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
        >
          <X className="w-3 h-3" />
          Clear all
        </button>
      </div>
      <div className="space-y-2">
        {items.map(item => (
          <div key={item.href} className="relative">
            <Link
              href={`${item.href}?scrollTo=${item.scrollY ?? 0}`}
              className="block rounded-lg border border-primary/20 bg-primary/5 p-4 hover:border-primary/40 hover:bg-primary/10 active:bg-primary/15 transition-colors"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2">
                  <BookOpen className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  <div>
                    <span className="text-sm font-semibold text-foreground">{item.name}</span>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      {(item.scrollPercent ?? 0).toFixed(0)}% through · {formatTimeAgo(item.timestamp)}
                    </p>
                  </div>
                </div>
                <ContentTypeBadge type={item.type as never} className="px-1.5 py-0 text-[8px] shrink-0" />
              </div>
            </Link>
            <button
              onClick={(e) => {
                e.preventDefault();
                handleDismiss(item.href);
              }}
              className="absolute top-2 right-2 p-1 rounded hover:bg-muted/50 transition-colors"
              aria-label={`Dismiss ${item.name}`}
            >
              <X className="w-3 h-3 text-muted-foreground hover:text-foreground" />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
