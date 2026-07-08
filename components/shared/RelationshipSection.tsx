'use client';

import Link from 'next/link';
import type { ResolvedRelationship } from '@/lib/relationships';
import { getRelationshipSectionLabel } from '@/lib/relationships';

interface RelationshipSectionProps {
  relationships: ResolvedRelationship[];
}

export default function RelationshipSection({ relationships }: RelationshipSectionProps) {
  if (!relationships.length) return null;

  const grouped = relationships.reduce<Record<string, ResolvedRelationship[]>>((acc, relationship) => {
    const sectionType = relationship.type ?? 'equivalent';
    acc[sectionType] ??= [];
    acc[sectionType].push(relationship);
    return acc;
  }, {});

  return (
    <div className="rounded-lg border border-border bg-card p-4 space-y-4">
      <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5 select-none">
        <span className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-border bg-background text-[9px] font-mono">↗</span>
        Related APIs & Alternatives
      </h4>
      <div className="space-y-4">
        {Object.entries(grouped).map(([type, items]) => (
          <div key={type} className="space-y-2">
            <div className="text-[11px] font-semibold text-foreground/80">{getRelationshipSectionLabel(type)}</div>
            <div className="flex flex-wrap gap-2">
              {items.map(relationship => (
                <Link
                  key={`${relationship.package}-${relationship.target ?? relationship.task}`}
                  href={relationship.href}
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/40 px-2.5 py-1 text-xs text-foreground transition-colors hover:bg-muted"
                >
                  <span className="font-mono">{relationship.target ?? relationship.task}</span>
                  <span className="text-[10px] uppercase tracking-wide text-muted-foreground">{relationship.packageName}</span>
                </Link>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              {items.map(item => item.reason).join(' • ')}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
