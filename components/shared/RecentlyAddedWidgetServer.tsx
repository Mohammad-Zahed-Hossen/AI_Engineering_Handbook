import Link from 'next/link';
import { Plus, ExternalLink } from 'lucide-react';
import { getRecentlyAdded } from '@/lib/data';
import ContentTypeBadge from './ContentTypeBadge';
import { formatRelativeTime } from '@/lib/format-date';

export default function RecentlyAddedWidgetServer() {
  const recentlyAdded = getRecentlyAdded(5);

  if (recentlyAdded.length === 0) return null;

  return (
    <section className="rounded-xl border border-border bg-card mobile-card-padding space-y-3">
      <div className="flex items-center gap-1.5 select-none">
        <Plus className="w-4.5 h-4.5 text-primary" />
        <h2 className="text-sm font-bold text-foreground">Recently Added</h2>
      </div>

      <div className="grid gap-2 grid-cols-1 sm:grid-cols-2">
        {recentlyAdded.map((item) => {
          const href = item.type === 'model'
            ? `/models/${item.category}/${item.id}`
            : item.type === 'package'
            ? `/packages/${item.id}`
            : item.type === 'workflow'
            ? `/workflows/${item.id}`
            : item.type === 'cheatsheet'
            ? `/cheatsheets/${item.id}`
            : item.type === 'pattern'
            ? `/patterns/${item.id}`
            : item.type === 'debug_guide'
            ? `/debug-guides/${item.id}`
            : item.type === 'decision_guide'
            ? `/decision-guides/${item.id}`
            : item.type === 'principle'
            ? `/principles/${item.id}`
            : `/registry/families/${item.id}`;

          return (
            <Link
              key={`${item.type}-${item.id}`}
              href={href}
              className="block rounded-lg border border-border bg-card mobile-card-padding hover:border-foreground/20 hover:bg-muted/30 transition-all"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <span className="text-xs font-semibold text-foreground truncate block">
                    {item.name}
                  </span>
                  <p className="text-[9px] font-mono text-muted-foreground flex items-center gap-1 mt-1">
                    <ExternalLink className="w-3 h-3" />
                    {formatRelativeTime(item.updated_at)}
                  </p>
                </div>
                <ContentTypeBadge type={item.type} className="px-1.5 py-0 text-[8px] shrink-0" />
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}