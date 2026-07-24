import { cn } from '@/lib/utils';
import { ReactNode } from 'react';
import SectionHeading from './SectionHeading';

interface SectionCardProps {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'insight' | 'warning' | 'action';
  collapsible?: boolean;
  defaultOpen?: boolean;
  id?: string;
  subtitle?: string;
  badge?: string;
}

// Shared primitive for section containers
// Supports both simple usage (title + children) and extended usage (subtitle, badge)
export default function SectionCard({
  title,
  icon,
  children,
  className,
  variant = 'default',
  id,
  subtitle,
  badge,
}: SectionCardProps) {
  const variantStyles = {
    default: 'border-border bg-card',
    insight: 'border-emerald-500/20 bg-emerald-500/5',
    warning: 'border-red-500/20 bg-red-500/5',
    action: 'border-2 border-amber-500/30 bg-amber-500/10',
  };

  return (
    <div
      id={id}
      className={cn(
        'rounded-lg border overflow-hidden scroll-mt-24',
        variantStyles[variant],
        className
      )}
    >
      <div className="px-4 py-2.5 border-b border-border/50 bg-muted/30 flex items-center justify-between">
        <div>
          <SectionHeading
            id={id}
            title={title}
            level={3}
            className="text-xs font-semibold text-foreground flex items-center gap-2"
          >
            {icon}
          </SectionHeading>
          {subtitle && (
            <p className="text-[10px] text-muted-foreground mt-0.5">{subtitle}</p>
          )}
        </div>
        {badge && (
          <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded text-muted-foreground font-mono">
            {badge}
          </span>
        )}
      </div>
      <div className="p-4">
        {children}
      </div>
    </div>
  );
}