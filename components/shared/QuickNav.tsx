'use client';

import { cn } from '@/lib/utils';

interface QuickNavItem {
  id: string;
  label: string;
}

interface QuickNavProps {
  items: QuickNavItem[];
  className?: string;
}

export default function QuickNav({ items, className }: QuickNavProps) {
  if (items.length === 0) return null;

  return (
    <nav 
      aria-label="Quick navigation" 
      className={cn("flex flex-wrap gap-1.5 sm:gap-2", className)}
    >
      {items.map((item) => (
        <a
          key={item.id}
          href={`#${item.id}`}
          className={cn(
            "inline-flex items-center rounded-full border border-border bg-muted/40 px-3 py-1.5",
            "text-[10px] font-medium text-foreground",
            "hover:bg-muted hover:border-foreground/20 transition-colors",
            "touch-target-inline select-none"
          )}
        >
          {item.label}
        </a>
      ))}
    </nav>
  );
}