'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Flame, ExternalLink } from 'lucide-react';
import { getFrequentlyUsed } from '@/lib/dashboard-state';
import ContentTypeBadge from './ContentTypeBadge';
import { formatTimeAgo } from '@/lib/format-time';

export default function FrequentlyUsedWidget() {
  const frequentlyUsed = getFrequentlyUsed(5);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;
  if (frequentlyUsed.length === 0) return null;

  return (
    <section className="rounded-xl border border-border bg-card mobile-card-padding space-y-3">
      <div className="flex items-center gap-1.5 select-none">
        <Flame className="w-4.5 h-4.5 text-primary" />
        <h2 className="text-sm font-bold text-foreground">Frequently Used</h2>
      </div>

      <div className="grid gap-2 grid-cols-1 sm:grid-cols-2">
        {frequentlyUsed.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="block rounded-lg border border-border bg-card mobile-card-padding hover:border-foreground/20 hover:bg-muted/30 transition-all"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <span className="text-xs font-semibold text-foreground truncate block">
                  {item.name}
                </span>
                <p className="text-[9px] font-mono text-muted-foreground flex items-center gap-1 mt-1">
                  <ExternalLink className="w-3 h-3" />
                  {item.visitCount} visit{item.visitCount !== 1 ? 's' : ''} · {formatTimeAgo(item.timestamp)}
                </p>
              </div>
              <ContentTypeBadge type={item.type} className="px-1.5 py-0 text-[8px] shrink-0" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}