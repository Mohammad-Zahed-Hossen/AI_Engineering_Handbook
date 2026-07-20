'use client';

import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChecklistItemProps {
  check: string;
  description?: string;
  checked?: boolean;
  onToggle?: () => void;
  className?: string;
}

export default function ChecklistItem({
  check,
  description,
  checked = false,
  onToggle,
  className,
}: ChecklistItemProps) {
  const isInteractive = onToggle !== undefined;

  const Container = isInteractive ? 'button' : 'div';

  return (
    <Container
      onClick={isInteractive ? onToggle : undefined}
      className={cn(
        'flex items-start gap-2 w-full text-left',
        isInteractive && 'hover:bg-muted/30 rounded transition-colors touch-target',
        className
      )}
    >
      <span
        className={cn(
          'shrink-0 w-4 h-4 flex items-center justify-center rounded border text-[10px] font-bold mt-0.5 transition-colors',
          checked
            ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-600'
            : 'border-border bg-muted'
        )}
      >
        {checked && <Check className="w-3 h-3" />}
      </span>
      <div className="flex-1 min-w-0">
        <span
          className={cn(
            'text-sm',
            checked ? 'text-muted-foreground line-through' : 'text-foreground'
          )}
        >
          {check}
        </span>
        {description && (
          <span className="block text-xs text-muted-foreground mt-0.5">{description}</span>
        )}
      </div>
    </Container>
  );
}