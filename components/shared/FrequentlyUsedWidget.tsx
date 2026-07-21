'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Flame, ExternalLink, BarChart3, TrendingUp } from 'lucide-react';
import { getFrequentlyUsed } from '@/lib/dashboard-state';
import ContentTypeBadge from './ContentTypeBadge';
import { formatTimeAgo } from '@/lib/format-time';

function getVisitBarColor(visits: number): string {
  if (visits >= 10) return 'bg-orange-500';
  if (visits >= 5) return 'bg-amber-500';
  return 'bg-yellow-500';
}

export default function FrequentlyUsedWidget() {
  const frequentlyUsed = getFrequentlyUsed(5);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  const maxVisits = frequentlyUsed.length > 0 ? Math.max(...frequentlyUsed.map(i => i.visitCount), 1) : 1;

  return (
    <section className="rounded-xl border border-border bg-card mobile-card-padding space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 select-none">
          <div className="p-1 rounded bg-orange-500/10 border border-orange-500/20">
            <Flame className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-foreground">Frequently Used</h2>
            {frequentlyUsed.length > 0 && (
              <p className="text-[9px] text-muted-foreground">Most visited references</p>
            )}
          </div>
        </div>
        {frequentlyUsed.length > 0 && (
          <span className="text-[10px] font-mono font-bold text-orange-600 dark:text-orange-400 bg-orange-500/10 px-1.5 py-0.5 rounded select-none">
            Top {frequentlyUsed.length}
          </span>
        )}
      </div>

      {frequentlyUsed.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border/60 p-4 text-center select-none">
          <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-muted/50 mb-2">
            <BarChart3 className="w-4 h-4 text-muted-foreground" />
          </div>
          <p className="text-xs text-muted-foreground">
            No usage data yet. Visit content pages and they'll appear here for quick access.
          </p>
        </div>
      ) : (
        <div className="grid gap-2 grid-cols-1 sm:grid-cols-2">
          {frequentlyUsed.map((item) => {
            const visitPercent = Math.max((item.visitCount / maxVisits) * 100, 2);
            return (
              <Link
                key={item.href}
                href={item.href}
                className="block rounded-lg border border-border bg-card mobile-card-padding hover:border-orange-500/20 hover:bg-orange-500/[0.03] transition-all"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <span className="text-xs font-semibold text-foreground truncate block">
                      {item.name}
                    </span>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center gap-1">
                        <TrendingUp className="w-2.5 h-2.5 text-muted-foreground" />
                        <span className="text-[9px] font-mono text-muted-foreground">
                          {item.visitCount} visit{item.visitCount !== 1 ? 's' : ''}
                        </span>
                      </div>
                      <span className="text-[9px] font-mono text-muted-foreground">
                        · {formatTimeAgo(item.timestamp)}
                      </span>
                    </div>
                    {/* Visit frequency mini bar */}
                    <div className="mt-1.5 w-full h-1 rounded-full bg-muted/40 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${getVisitBarColor(item.visitCount)} transition-all duration-500`}
                        style={{ width: `${visitPercent}%` }}
                      />
                    </div>
                  </div>
                  <ContentTypeBadge type={item.type} className="px-1.5 py-0 text-[8px] shrink-0" />
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}