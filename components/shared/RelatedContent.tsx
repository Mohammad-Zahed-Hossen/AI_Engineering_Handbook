import Link from 'next/link';
import { getContentName, getContentPath } from '@/lib/data';
import { ContentRef } from '@/types/meta';
import ContentTypeBadge from './ContentTypeBadge';

interface RelatedContentProps {
  items: ContentRef[];
}

export default function RelatedContent({ items }: RelatedContentProps) {
  if (!items.length) return null;

  return (
    <section className="border-t border-border pt-4 select-none">
      <h2 className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        Related Content
      </h2>
      <div className="flex flex-wrap gap-1.5">
        {items.map(item => {
          const name = getContentName(item.type, item.id);
          const href = getContentPath(item.type, item.id);
          const content = (
            <>
              <ContentTypeBadge type={item.type} className="px-1 py-0 text-[8px]" />
              {name}
            </>
          );

          if (!href) {
            return (
              <span
                key={`${item.type}-${item.id}`}
                className="inline-flex items-center gap-1 rounded border border-border bg-muted px-2 py-1 text-[10px] text-muted-foreground"
              >
                {content}
              </span>
            );
          }

          return (
            <Link
              key={`${item.type}-${item.id}`}
              href={href}
              className="inline-flex items-center gap-1 rounded border border-border bg-muted/40 px-2 py-1 text-[10px] font-medium text-foreground hover:bg-muted hover:border-foreground/20 transition-colors"
            >
              {content}
            </Link>
          );
        })}
      </div>
    </section>
  );
}
