import Link from 'next/link';
import { getContentName, getContentPath } from '@/lib/data';
import { ContentRef } from '@/types/meta';
import ContentTypeBadge from './ContentTypeBadge';

interface RelatedContentProps {
  items: ContentRef[];
}

const RELATIONSHIP_LABELS: Record<string, string> = {
  // Pattern relations
  related_workflows: 'Applied In Workflows',
  related_models: 'Related Models',
  related_packages: 'Implemented in Packages',
  related_principles: 'Governed by Principles',
  related_debug_guides: 'Related Debug Guides',
  
  // Principle relations
  referenced_by_patterns: 'Referenced by Patterns',
  referenced_by_models: 'Referenced by Models',
  referenced_by_workflows: 'Referenced by Workflows',
  
  // Debug Guide relations
  related_patterns: 'Related Patterns',
  related_registry: 'Model Registries',
};

function getGroupLabel(relType: string | undefined, contentType: string): string {
  if (relType && RELATIONSHIP_LABELS[relType]) {
    return RELATIONSHIP_LABELS[relType];
  }
  // Fallback to capitalized content type plural
  let plural = `${contentType.charAt(0).toUpperCase()}${contentType.slice(1)}s`;
  if (contentType === 'debug_guide') plural = 'Debug Guides';
  else if (contentType === 'decision_guide') plural = 'Decision Guides';
  else if (contentType === 'cheatsheet') plural = 'Cheatsheets';
  return `Related ${plural}`;
}

export default function RelatedContent({ items }: RelatedContentProps) {
  if (!items.length) return null;

  // Group items by relationship label
  const groups: Record<string, ContentRef[]> = {};
  
  items.forEach(item => {
    const label = getGroupLabel(item.relationship_type, item.type);
    if (!groups[label]) {
      groups[label] = [];
    }
    groups[label].push(item);
  });

  return (
    <section className="border-t border-border pt-6 select-none space-y-4">
      <h2 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        Related Content
      </h2>
      <div className="space-y-4">
        {Object.entries(groups).map(([groupTitle, groupItems]) => (
          <div key={groupTitle} className="space-y-2">
            <h3 className="text-xs font-semibold text-muted-foreground/80">{groupTitle}</h3>
            <div className="flex flex-wrap gap-1.5">
              {groupItems.map(item => {
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
          </div>
        ))}
      </div>
    </section>
  );
}
