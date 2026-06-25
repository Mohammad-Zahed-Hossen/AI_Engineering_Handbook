import Link from 'next/link';
import { getContentName, getContentPath } from '@/lib/data';
import { ContentRef } from '@/types/meta';
import ContentTypeBadge from './ContentTypeBadge';

interface AlternativesListProps {
  alternatives: ContentRef[];
  title?: string;
}

export default function AlternativesList({
  alternatives,
  title = 'Alternatives',
}: AlternativesListProps) {
  if (!alternatives.length) return null;

  return (
    <section className="border-t border-border pt-4 select-none">
      <h2 className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </h2>
      <div className="flex flex-wrap gap-1.5">
        {alternatives.map(alt => {
          const name = getContentName(alt.type, alt.id);
          const href = getContentPath(alt.type, alt.id);

          if (href) {
            return (
              <Link
                key={`${alt.type}-${alt.id}`}
                href={href}
                className="inline-flex items-center gap-1 rounded border border-border bg-muted/40 px-2 py-1 text-[10px] font-medium text-foreground hover:bg-muted hover:border-foreground/20 transition-colors"
              >
                <ContentTypeBadge type={alt.type} className="px-1 py-0 text-[8px]" />
                {name}
              </Link>
            );
          }

          return (
            <span
              key={`${alt.type}-${alt.id}`}
              className="inline-flex items-center gap-1 rounded border border-border bg-muted px-2 py-1 text-[10px] text-muted-foreground"
            >
              <ContentTypeBadge type={alt.type} className="px-1 py-0 text-[8px]" />
              {name}
            </span>
          );
        })}
      </div>
    </section>
  );
}
