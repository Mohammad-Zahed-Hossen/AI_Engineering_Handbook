'use client';

import Link from 'next/link';
import { ArrowRight, Compass } from 'lucide-react';

interface RecommendedNextSectionProps {
  items: Array<{ name: string; slug: string | null }>;
  category: string;
}

export default function RecommendedNextSection({ items, category }: RecommendedNextSectionProps) {
  // Filter only items that successfully resolved to a slug
  const validItems = items.filter((item): item is { name: string; slug: string } => item.slug !== null);

  if (validItems.length === 0) return null;

  return (
    <section className="mt-8 rounded-xl border border-border bg-card p-5 space-y-4 shadow-sm select-none">
      <div className="flex items-center gap-2 border-b border-border pb-3">
        <Compass className="w-4.5 h-4.5 text-primary" />
        <h2 className="text-sm font-bold text-foreground font-sans m-0">Recommended Next Steps</h2>
      </div>
      <p className="text-xs text-muted-foreground leading-relaxed">
        To continue your learning path, we recommend exploring these related concepts:
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        {validItems.map(item => (
          <Link
            key={item.slug}
            href={`/models/${category}/${item.slug}`}
            className="group flex items-center justify-between p-3.5 rounded-lg border border-border bg-muted/20 hover:border-primary/30 hover:bg-muted/40 transition-all duration-200"
          >
            <div className="flex flex-col min-w-0 pr-2">
              <span className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                {item.name}
              </span>
              <span className="text-[10px] text-muted-foreground mt-0.5">
                Explore model overview and guide
              </span>
            </div>
            <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" />
          </Link>
        ))}
      </div>
    </section>
  );
}
