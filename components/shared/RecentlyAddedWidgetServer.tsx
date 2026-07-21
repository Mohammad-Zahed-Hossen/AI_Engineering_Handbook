import Link from 'next/link';
import { Plus, ExternalLink, ArrowRight, Sparkles, Clock } from 'lucide-react';
import { getRecentlyAdded, getContentHref, getSummaryForItem } from '@/lib/data';
import ContentTypeBadge from './ContentTypeBadge';
import { formatRelativeTime } from '@/lib/format-date';

function getTypeIcon(type: string): string {
  const icons: Record<string, string> = {
    package: '📦',
    model: '🧠',
    workflow: '🔄',
    cheatsheet: '📝',
    pattern: '🧩',
    debug_guide: '🐛',
    decision_guide: '🔀',
    principle: '💡',
    registry: '🗄️',
  };
  return icons[type] || '📄';
}

export default function RecentlyAddedWidgetServer() {
  const recentlyAdded = getRecentlyAdded(5);

  if (recentlyAdded.length === 0) return null;

  return (
    <section className="rounded-xl border border-border bg-card mobile-card-padding space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 select-none">
          <div className="p-1 rounded bg-teal-500/10 border border-teal-500/20">
            <Sparkles className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-foreground">Recently Added</h2>
            <p className="text-[9px] text-muted-foreground">Latest additions to the handbook</p>
          </div>
        </div>
      </div>

      <div className="grid gap-2 grid-cols-1 sm:grid-cols-2">
        {recentlyAdded.map((item) => {
          const href = getContentHref(
            item.type as 'package' | 'model' | 'workflow' | 'cheatsheet' | 'pattern' | 'debug_guide' | 'decision_guide' | 'principle' | 'registry',
            item.id,
            item.category
          );

          return href ? (
            <Link
              key={`${item.type}-${item.id}`}
              href={href}
              className="group rounded-lg border border-border bg-card mobile-card-padding hover:border-teal-500/20 hover:bg-teal-500/[0.03] transition-all"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <ContentTypeBadge type={item.type} className="px-1.5 py-0 text-[8px] shrink-0" />
                    <span className="text-[9px] font-mono text-muted-foreground flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5" />
                      {formatRelativeTime(item.updated_at)}
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-foreground truncate block mt-1 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                    {item.name}
                  </span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all shrink-0 mt-1" />
              </div>
            </Link>
          ) : null;
        })}
      </div>
    </section>
  );
}