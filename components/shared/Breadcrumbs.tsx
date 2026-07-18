import Link from 'next/link';
import { cn } from '@/lib/utils';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export default function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className={cn('min-w-0 overflow-x-auto scrollbar-hide text-xs text-muted-foreground font-sans select-none -mx-1 px-1', className)}>
      <ol className="flex min-w-0 items-center gap-2 whitespace-nowrap">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className={cn('flex min-w-0 items-center gap-1.5', isLast && 'flex-1')}>
              {index > 0 && <span className="text-border">/</span>}
              {item.href && !isLast ? (
                <Link href={item.href} className="flex min-h-11 items-center hover:text-foreground transition-colors">
                  {item.label}
                </Link>
              ) : (
                <span className={cn('min-w-0 truncate', isLast && 'text-foreground font-medium')}>{item.label}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
