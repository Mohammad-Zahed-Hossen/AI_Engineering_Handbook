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

const MAX_VISIBLE_PROBLEM_TYPES = 3;

export default function MetadataBadges({
  type,
  updatedAt,
  problemTypes,
  category,
  version,
  className,
}: MetadataBadgesProps) {
  const visibleProblemTypes = problemTypes?.slice(0, MAX_VISIBLE_PROBLEM_TYPES) ?? [];
  const hiddenProblemTypeCount = (problemTypes?.length ?? 0) - visibleProblemTypes.length;

  return (
    <div className={cn('flex flex-wrap items-center gap-2 select-none', className)}>
      <ContentTypeBadge type={type} />
      {/* `category` is intentionally not rendered here when it duplicates the breadcrumb path
          (e.g. Models > ml). Pass it only for contexts where no breadcrumb conveys it. */}
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
      {visibleProblemTypes.map(pt => (
        <span
          key={pt}
          className="rounded border border-border bg-muted px-2 py-0.5 text-[10px] font-mono capitalize text-muted-foreground"
        >
          {pt}
        </span>
      ))}
      {hiddenProblemTypeCount > 0 && (
        <span
          className="rounded border border-border bg-muted px-2 py-0.5 text-[10px] font-mono text-muted-foreground"
          title={problemTypes?.slice(MAX_VISIBLE_PROBLEM_TYPES).join(', ')}
        >
          +{hiddenProblemTypeCount} more
        </span>
      )}
    </div>
  );
}
