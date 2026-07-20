import Link from 'next/link';
import { getContentName, getContentPath } from '@/lib/data';
import { ContentRef } from '@/types/meta';
import ContentTypeBadge from './ContentTypeBadge';
import { Workflow, Book, FileText, Brain, Bug } from 'lucide-react';

interface RelatedContentProps {
  items: ContentRef[];
}

// Define the order and labels for specific content types
const CONTENT_TYPE_ORDER: Array<{ type: string; label: string; icon: React.ReactNode }> = [
  { type: 'workflow', label: 'Related Workflows', icon: <Workflow className="w-3.5 h-3.5" /> },
  { type: 'cheatsheet', label: 'Related Cheatsheets', icon: <Book className="w-3.5 h-3.5" /> },
  { type: 'pattern', label: 'Related Patterns', icon: <FileText className="w-3.5 h-3.5" /> },
  { type: 'model', label: 'Related Models', icon: <Brain className="w-3.5 h-3.5" /> },
  { type: 'debug_guide', label: 'Related Debug Guides', icon: <Bug className="w-3.5 h-3.5" /> },
];

function getGroupLabel(relType: string | undefined, contentType: string): string {
  // For package pages, we want to show specific relationship types
  if (relType && relType in RELATIONSHIP_LABELS) {
    return RELATIONSHIP_LABELS[relType];
  }
  // Fallback to capitalized content type plural
  let plural = `${contentType.charAt(0).toUpperCase()}${contentType.slice(1)}s`;
  if (contentType === 'debug_guide') plural = 'Debug Guides';
  else if (contentType === 'decision_guide') plural = 'Decision Guides';
  else if (contentType === 'cheatsheet') plural = 'Cheatsheets';
  return `Related ${plural}`;
}

const RELATIONSHIP_LABELS: Record<string, string> = {
  // Pattern relations
  related_workflows: 'Related Workflows',
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

export default function RelatedContent({ items }: RelatedContentProps) {
  if (!items.length) return null;

  // Group items by content type for consistent ordering
  const groups: Record<string, { label: string; icon: React.ReactNode; items: ContentRef[] }> = {};
  
  // Initialize groups in the desired order
  CONTENT_TYPE_ORDER.forEach(({ type, label, icon }) => {
    const typeItems = items.filter(item => item.type === type);
    if (typeItems.length > 0) {
      groups[type] = { label, icon, items: typeItems };
    }
  });

  // Add any remaining items that don't match our predefined types
  items.forEach(item => {
    if (!groups[item.type]) {
      const label = getGroupLabel(item.relationship_type, item.type);
      groups[item.type] = { label, icon: null, items: [item] };
    }
  });

  return (
    <section className="border-t border-border pt-6 select-none space-y-4">
      <h2 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        Related Content
      </h2>
      <div className="space-y-4">
        {Object.entries(groups).map(([type, { label, icon, items }]) => (
          <div key={type} className="space-y-2">
            <h3 className="text-xs font-semibold text-muted-foreground/80 flex items-center gap-1.5">
              {icon}
              {label}
            </h3>
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
          </div>
        ))}
      </div>
    </section>
  );
}