'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { BookOpen, Clock, X, RotateCcw } from 'lucide-react';
import {
  getContinueReading,
  dismissContinueReadingItem,
  clearContinueReading,
  type ContinueReadingItem,
} from '@/lib/session-tracking';
import ContentTypeBadge from './ContentTypeBadge';
import { formatTimeAgo } from '@/lib/format-time';

function getProgressColor(percent: number): string {
  if (percent >= 80) return 'bg-green-500';
  if (percent >= 50) return 'bg-blue-500';
  if (percent >= 25) return 'bg-amber-500';
  return 'bg-muted-foreground/40';
}

function getProgressTextColor(percent: number): string {
  if (percent >= 80) return 'text-green-600 dark:text-green-400';
  if (percent >= 50) return 'text-blue-600 dark:text-blue-400';
  if (percent >= 25) return 'text-amber-600 dark:text-amber-400';
  return 'text-muted-foreground';
}

export default function ContinueLearningWidget() {
  const [continueItems, setContinueItems] = useState<ContinueReadingItem[]>(() => getContinueReading());

  const handleDismiss = (href: string) => {
    dismissContinueReadingItem(href);
    setContinueItems(prev => prev.filter(i => i.href !== href));
  };

  const handleClear = () => {
    clearContinueReading();
    setContinueItems([]);
  };

  if (continueItems.length === 0) {
    return (
      <section className="rounded-xl border border-border bg-card mobile-card-padding space-y-3">
        <div className="flex items-center gap-1.5 select-none">
          <BookOpen className="w-4.5 h-4.5 text-primary" />
          <h2 className="text-sm font-bold text-foreground">Continue Learning</h2>
        </div>
        <div className="rounded-lg border border-dashed border-border/60 p-4 text-center select-none">
          <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-muted/50 mb-2">
            <BookOpen className="w-4 h-4 text-muted-foreground" />
          </div>
          <p className="text-xs text-muted-foreground">
            No content in progress yet. Start exploring to see your reading sessions here.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-xl border border-border bg-card mobile-card-padding space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 select-none">
          <div className="p-1 rounded bg-blue-500/10 border border-blue-500/20">
            <BookOpen className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-foreground">Continue Learning</h2>
            <p className="text-[9px] text-muted-foreground">{continueItems.length} active sessions</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {continueItems.length > 0 && (
            <button
              onClick={handleClear}
              className="text-[10px] text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 px-2 py-1 rounded hover:bg-muted/40 cursor-pointer"
              aria-label="Clear all reading sessions"
            >
              <RotateCcw className="w-3 h-3" />
              Clear all
            </button>
          )}
        </div>
      </div>

      <div className="grid gap-2 grid-cols-1 sm:grid-cols-2">
        {continueItems.map((item) => {
          const progressPercent = item.scrollPercent ?? 0;
          return (
            <div key={item.href} className="relative group">
              <Link
                href={`${item.href}?scrollTo=${item.scrollY ?? 0}`}
                className="block rounded-lg border border-blue-500/15 bg-blue-500/[0.03] mobile-card-padding hover:border-blue-500/35 hover:bg-blue-500/[0.06] transition-all"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2 min-w-0 flex-1">
                    <div className="p-1 rounded bg-blue-500/10 shrink-0 mt-0.5">
                      <BookOpen className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-xs font-bold text-foreground leading-snug block truncate">
                        {item.name}
                      </span>
                      <div className="flex items-center gap-2 mt-1.5">
                        <ContentTypeBadge type={item.type} className="px-1.5 py-0 text-[8px] shrink-0" />
                        <div className="flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5 text-muted-foreground" />
                          <span className="text-[9px] font-mono text-muted-foreground">
                            {formatTimeAgo(item.timestamp)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-2.5 flex items-center gap-2">
                  <div className="flex-1 h-1.5 rounded-full bg-muted/40 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${getProgressColor(progressPercent)} transition-all duration-500`}
                      style={{ width: `${Math.max(progressPercent, 2)}%` }}
                    />
                  </div>
                  <span className={`text-[9px] font-mono font-bold shrink-0 ${getProgressTextColor(progressPercent)}`}>
                    {progressPercent.toFixed(0)}%
                  </span>
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
          );
        })}
      </div>
    </section>
  );
}