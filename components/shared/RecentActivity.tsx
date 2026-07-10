'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { History, BookOpen, Clock, X } from 'lucide-react';
import {
  getContinueReading,
  getRecentKnowledge,
  dismissContinueReadingItem,
  clearContinueReading,
  clearRecentKnowledge,
  type ContinueReadingItem,
  type RecentItem,
} from '@/lib/session-tracking';
import ContentTypeBadge from './ContentTypeBadge';
import { formatTimeAgo } from '@/lib/format-time';

export default function RecentActivity() {
  const [continueItems, setContinueItems] = useState<ContinueReadingItem[]>([]);
  const [recentItems, setRecentItems] = useState<RecentItem[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setContinueItems(getContinueReading());
    setRecentItems(getRecentKnowledge());
    setIsMounted(true);
  }, []);

  const handleDismissContinue = (href: string) => {
    dismissContinueReadingItem(href);
    setContinueItems(prev => prev.filter(i => i.href !== href));
  };

  const handleClearContinue = () => {
    clearContinueReading();
    setContinueItems([]);
  };

  const handleClearRecent = () => {
    clearRecentKnowledge();
    setRecentItems([]);
  };

  if (!isMounted) return null;
  if (continueItems.length === 0 && recentItems.length === 0) return null;

  return (
    <section className="rounded-xl border border-border bg-card p-5 space-y-4 shadow-sm">
      <div className="flex items-center gap-2 border-b border-border pb-3 select-none">
        <History className="w-4.5 h-4.5 text-primary" />
        <h2 className="text-sm font-bold text-foreground font-sans m-0">Continue Learning</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 divide-y md:divide-y-0 md:divide-x divide-border">
        {/* Left Column: Continue Reading */}
        <div className="pb-4 md:pb-0 md:pr-6 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold text-foreground font-sans m-0">Continue Reading</h3>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                Resume where you left off (mid-way through a guide).
              </p>
            </div>
            {continueItems.length > 0 && (
              <button
                onClick={handleClearContinue}
                className="text-[10px] text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 cursor-pointer"
                aria-label="Clear all reading sessions"
              >
                <X className="w-3 h-3" />
                Clear all
              </button>
            )}
          </div>

          {continueItems.length > 0 ? (
            <div className="space-y-2">
              {continueItems.map(item => (
                <div key={item.href} className="relative group">
                  <Link
                    href={`${item.href}?scrollTo=${item.scrollY ?? 0}`}
                    className="block rounded-lg border border-primary/20 bg-primary/5 p-4 hover:border-primary/45 hover:bg-primary/10 active:bg-primary/15 transition-all duration-200"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2.5">
                        <BookOpen className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                        <div>
                          <span className="text-xs font-bold text-foreground leading-snug">{item.name}</span>
                          <p className="text-[10px] text-muted-foreground mt-1">
                            {(item.scrollPercent ?? 0).toFixed(0)}% read · {formatTimeAgo(item.timestamp)}
                          </p>
                        </div>
                      </div>
                      <ContentTypeBadge type={item.type} className="px-1.5 py-0 text-[8px] shrink-0" />
                    </div>
                  </Link>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleDismissContinue(item.href);
                    }}
                    className="absolute top-2 right-2 p-1 rounded bg-transparent opacity-0 group-hover:opacity-100 hover:bg-muted/50 transition-all cursor-pointer"
                    aria-label={`Dismiss ${item.name}`}
                  >
                    <X className="w-3 h-3 text-muted-foreground hover:text-foreground" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-border p-6 text-center select-none">
              <p className="text-xs text-muted-foreground">
                No active reading sessions. Spend 45s or more reading a page to resume it here.
              </p>
            </div>
          )}
        </div>

        {/* Right Column: Recently Viewed */}
        <div className="pt-4 md:pt-0 md:pl-6 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold text-foreground font-sans m-0">Recently Viewed</h3>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                Quickly access content you&apos;ve opened recently.
              </p>
            </div>
            {recentItems.length > 0 && (
              <button
                onClick={handleClearRecent}
                className="text-[10px] text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 cursor-pointer"
                aria-label="Clear recently viewed history"
              >
                <X className="w-3 h-3" />
                Clear
              </button>
            )}
          </div>

          {recentItems.length > 0 ? (
            <div className="grid gap-2 grid-cols-1 sm:grid-cols-2">
              {recentItems.slice(0, 6).map((item, idx) => (
                <Link
                  key={`${item.href}-${idx}`}
                  href={item.href}
                  className="rounded-lg border border-border bg-card px-3 py-2.5 hover:border-foreground/20 hover:bg-muted/30 active:bg-muted/50 transition-all duration-200 flex flex-col justify-between"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-xs font-semibold text-foreground leading-snug truncate min-w-0" title={item.name}>
                      {item.name}
                    </span>
                    <ContentTypeBadge type={item.type} className="px-1.5 py-0 text-[8px] shrink-0" />
                  </div>
                  <p className="text-[9px] font-mono text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3 text-muted-foreground" />
                    {formatTimeAgo(item.timestamp)}
                  </p>
                </Link>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-border p-6 text-center select-none">
              <p className="text-xs text-muted-foreground">
                No recently viewed pages.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
