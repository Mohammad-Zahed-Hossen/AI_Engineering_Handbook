'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronRight } from 'lucide-react';
import type { Package } from '@/types/package';

interface PackageListClientProps {
  packages: Package[];
}

export default function PackageListClient({ packages }: PackageListClientProps) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const toggleExpand = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    setExpandedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div className="space-y-3">
      {packages.map(pkg => {
        const isExpanded = expandedIds.has(pkg.id);
        return (
          <Link
            key={pkg.id}
            href={`/packages/${pkg.id}`}
            className="group block rounded-lg border border-border bg-card hover:border-foreground/20 hover:bg-muted/30 transition-colors touch-target"
          >
            <div className="p-4 flex items-center justify-between gap-3">
              <div className="flex-1 min-w-0">
                <h2 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                  {pkg.name}
                </h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] font-mono text-muted-foreground">v{pkg.version}</span>
                  <span className="text-[10px] font-mono text-muted-foreground/70">
                    {pkg.tasks.length} {pkg.tasks.length === 1 ? 'task' : 'tasks'}
                  </span>
                </div>
              </div>
              <button
                onClick={(e) => toggleExpand(pkg.id, e)}
                className="shrink-0 p-1.5 rounded hover:bg-muted/50 transition-colors touch-target-sm"
                aria-label={isExpanded ? 'Collapse description' : 'Expand description'}
              >
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                )}
              </button>
            </div>
            {isExpanded && (
              <div className="px-4 pb-4 pt-0 border-t border-border/50 mt-2">
                <p className="text-xs text-muted-foreground leading-relaxed pt-2">{pkg.summary}</p>
              </div>
            )}
          </Link>
        );
      })}
    </div>
  );
}