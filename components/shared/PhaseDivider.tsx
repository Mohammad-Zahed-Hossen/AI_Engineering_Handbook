'use client';

import { cn } from '@/lib/utils';

interface PhaseDividerProps {
  label: string;
  className?: string;
}

export default function PhaseDivider({ label, className }: PhaseDividerProps) {
  return (
    <div className={cn('flex items-center gap-3 py-4 select-none', className)}>
      <div className="flex-1 border-t border-border" />
      <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">
        {label}
      </span>
      <div className="flex-1 border-t border-border" />
    </div>
  );
}