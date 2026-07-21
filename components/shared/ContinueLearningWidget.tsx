'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { BookOpen, Clock, X, BarChart3 } from 'lucide-react';
import {
  getContinueReading,
  dismissContinueReadingItem,
  clearContinueReading,
  type ContinueReadingItem,
} from '@/lib/session-tracking';
import ContentTypeBadge from './ContentTypeBadge';
import { formatTimeAgo } from '@/lib/format-time';

export default function ContinueLearningWidget() {
  const [continueItems, setContinueItems] = useState<ContinueReadingItem[]>(() => getContinueReading());
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
  }, []);

  const handleDismiss = (href: string) => {
    dismissContinueReadingItem(href);
    setContinueItems(prev => prev.filter(i => i.href !== href));
  };

  const handleClear = () => {
    clearContinueReading();
    setContinueItems([]);
  };

  if (!isMounted) return null;
  if (continueItems.length === 0) return null;

  return (
    <section className="rounded-xl border border-border bg-card mobile-card-padding space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 select-none">
          <BookOpen className="w-4.5 h-4.5 text-primary" />
          <h2 className="text-sm font-bold text-foreground">Continue Learning</h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-muted-foreground select-none">
            {continueItems.length} active
          </span>
          {continueItems.length > 0 && (
            <button
              onClick={handleClear}
              className="text-[10px] text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 cursor-pointer"
              aria-label="Clear all reading sessions"
            >
              <X className="w-3 h-3" />
              Clear
            </button>
          )}
        </div>
      </div>

      <div className="grid gap-2 grid-cols-1 sm:grid-cols-2">
        {continueItems.map((item) => (
          <div key={item.href} className="relative group">
            <Link
              href={`${item.href}?scrollTo=${item.scrollY ?? 0}`}
              className="block rounded-lg border border-primary/20 bg-primary/5 mobile-card-padding hover:border-primary/45 hover:bg-primary/10 transition-all"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2 min-w-0 flex-1">
                  <BookOpen className="w-3.5 h-3.5 min-[360px]:w-4 min-[360px]:h-4 text-primary mt-0.5 shrink-0" />
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-foreground leading-snug block truncate">
                      {item.name}
                    </span>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center gap-1">
                        <BarChart3 className="w-3 h-3 text-muted-foreground" />
                        <span className="text-[9px] font-mono text-muted-foreground">
                          {(item.scrollPercent ?? 0).toFixed(0)}% read
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-muted-foreground" />
                        <span className="text-[9px] font-mono text-muted-foreground">
                          {formatTimeAgo(item.timestamp)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <ContentTypeBadge type={item.type} className="px-1.5 py-0 text-[8px] shrink-0" />
              </div>
            </Link>
            <button
              onClick={(e) => {
                e.preventDefault();
                handleDismiss(item.href);
              }}
              className="absolute top-1.5 right-1.5 p-1 rounded bg-transparent opacity-0 group-hover:opacity-100 hover:bg-muted/50 transition-all cursor-pointer"
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