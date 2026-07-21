'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Compass, ExternalLink } from 'lucide-react';
import ContentTypeBadge from './ContentTypeBadge';

// This will be populated by the parent component
interface RecommendationsWidgetProps {
  recommendations?: Array<{ id: string; type: string; name: string; href: string | null }>;
}

export default function RecommendationsWidget({ recommendations = [] }: RecommendationsWidgetProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;
  if (recommendations.length === 0) return null;

  return (
    <section className="rounded-xl border border-border bg-card mobile-card-padding space-y-3">
      <div className="flex items-center gap-1.5 select-none">
        <Compass className="w-4.5 h-4.5 text-primary" />
        <h2 className="text-sm font-bold text-foreground">Recommended for You</h2>
      </div>

      <div className="grid gap-2 grid-cols-1 sm:grid-cols-2">
        {recommendations.map((item) => (
          <Link
            key={item.id}
            href={item.href || '#'}
            className="block rounded-lg border border-border bg-card mobile-card-padding hover:border-foreground/20 hover:bg-muted/30 transition-all"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <span className="text-xs font-semibold text-foreground truncate block">
                  {item.name}
                </span>
                <p className="text-[9px] font-mono text-muted-foreground flex items-center gap-1 mt-1">
                  <ExternalLink className="w-3 h-3" />
                  Based on your reading
                </p>
              </div>
              <ContentTypeBadge type={item.type as 'package' | 'model' | 'workflow' | 'cheatsheet' | 'pattern' | 'debug_guide' | 'decision_guide' | 'principle' | 'registry'} className="px-1.5 py-0 text-[8px] shrink-0" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}