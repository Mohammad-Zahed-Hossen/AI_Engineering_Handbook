'use client';

import { cn } from '@/lib/utils';

interface ChecklistItem {
  check: string;
  description?: string;
}

interface DebugChecklistProps {
  items: ChecklistItem[];
  className?: string;
}

export default function DebugChecklist({ items, className }: DebugChecklistProps) {
  if (!items || items.length === 0) return null;

  return (
    <div className={cn('space-y-2', className)}>
      {items.map((item, idx) => (
        <div key={idx} className="flex items-start gap-2">
          <span className="shrink-0 w-4 h-4 flex items-center justify-center rounded border border-border bg-muted text-[10px] font-mono text-muted-foreground mt-0.5">
            □
          </span>
          <div className="flex-1 min-w-0">
            <span className="text-sm text-foreground">{item.check}</span>
            {item.description && (
              <span className="block text-xs text-muted-foreground mt-0.5">{item.description}</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}