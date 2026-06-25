import { cn } from '@/lib/utils';
import { formatContentType } from '@/lib/resources';

interface ContentTypeBadgeProps {
  type: 'model' | 'package' | 'workflow' | 'cheatsheet' | string;
  className?: string;
}

export default function ContentTypeBadge({ type, className }: ContentTypeBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded border border-border bg-secondary px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-secondary-foreground',
        className
      )}
    >
      {formatContentType(type)}
    </span>
  );
}
