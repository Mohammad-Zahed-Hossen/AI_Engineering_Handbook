import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface CalloutProps {
  children: ReactNode;
  className?: string;
  variant?: 'insight' | 'warning' | 'action' | 'info';
}

// Callout component for emphasized inline content
// Used for Engineering Heuristic and other key takeaways
export default function Callout({
  children,
  className,
  variant = 'insight',
}: CalloutProps) {
  const variantStyles = {
    insight: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300',
    warning: 'border-red-500/30 bg-red-500/10 text-red-800 dark:text-red-300',
    action: 'border-amber-500/30 bg-amber-500/10 text-amber-800 dark:text-amber-300',
    info: 'border-blue-500/30 bg-blue-500/10 text-blue-800 dark:text-blue-300',
  };

  return (
    <div
      className={cn(
        'rounded-lg border-2 px-4 py-3',
        variantStyles[variant],
        className
      )}
    >
      {children}
    </div>
  );
}