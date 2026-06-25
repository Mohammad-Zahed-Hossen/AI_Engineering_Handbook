import ContentTypeBadge from './ContentTypeBadge';
import { cn } from '@/lib/utils';

interface MetadataBadgesProps {
  type: 'model' | 'package' | 'workflow' | 'cheatsheet';
  updatedAt: string;
  problemTypes?: string[];
  category?: string;
  version?: string;
  className?: string;
}

export default function MetadataBadges({
  type,
  updatedAt,
  problemTypes,
  category,
  version,
  className,
}: MetadataBadgesProps) {
  return (
    <div className={cn('flex flex-wrap items-center gap-2 select-none', className)}>
      <ContentTypeBadge type={type} />
      {category && (
        <span className="rounded border border-border bg-muted px-2 py-0.5 text-[10px] font-mono uppercase text-muted-foreground">
          {category}
        </span>
      )}
      {version && (
        <span className="rounded border border-border bg-muted px-2 py-0.5 text-[10px] font-mono text-muted-foreground">
          v{version}
        </span>
      )}
      {updatedAt && (
        <span className="rounded border border-border bg-muted px-2 py-0.5 text-[10px] font-mono text-muted-foreground">
          Updated {updatedAt}
        </span>
      )}
      {problemTypes?.map(pt => (
        <span
          key={pt}
          className="rounded border border-border bg-muted px-2 py-0.5 text-[10px] font-mono capitalize text-muted-foreground"
        >
          {pt}
        </span>
      ))}
    </div>
  );
}
