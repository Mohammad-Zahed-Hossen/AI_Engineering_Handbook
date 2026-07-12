'use client';

import { useState } from 'react';
import ContentTypeBadge from './ContentTypeBadge';
import { cn } from '@/lib/utils';
import { formatRelativeTime } from '@/lib/format-date';
import { CheckCircle2, Clock } from 'lucide-react';

interface MetadataBadgesProps {
  type: 'model' | 'package' | 'workflow' | 'cheatsheet' | 'debug_guide' | 'pattern' | 'principle' | 'decision_guide';
  updatedAt: string;
  lastVerified?: string;
  problemTypes?: string[];
  category?: string;
  version?: string;
  difficulty?: string;
  domain?: string;
  engineeringArea?: string;
  className?: string;
}

const MAX_VISIBLE_PROBLEM_TYPES = 3;

export default function MetadataBadges({
  type,
  updatedAt,
  lastVerified,
  problemTypes,
  category,
  version,
  difficulty,
  domain,
  engineeringArea,
  className,
}: MetadataBadgesProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const hasFreshness = !!(updatedAt || lastVerified);
  const hasApplicability = !!(problemTypes && problemTypes.length > 0);
  const hasMetadata = !!(difficulty || domain || engineeringArea);

  const displayProblemTypes = problemTypes
    ? (isExpanded ? problemTypes : problemTypes.slice(0, MAX_VISIBLE_PROBLEM_TYPES))
    : [];
  const hiddenProblemTypeCount = problemTypes
    ? Math.max(0, problemTypes.length - MAX_VISIBLE_PROBLEM_TYPES)
    : 0;

  return (
    <div className={cn('flex flex-wrap items-center gap-x-4 gap-y-2 select-none', className)}>
      {/* Identity Group */}
      <div className="flex items-center gap-1.5 flex-wrap">
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
      </div>

      {/* Divider */}
      {hasFreshness && (
        <div className="hidden sm:block w-px h-3.5 bg-border shrink-0" aria-hidden="true" />
      )}

      {/* Freshness Group */}
      {hasFreshness && (
        <div className="flex items-center gap-1.5 flex-wrap">
          {updatedAt && (
            <span 
              className="rounded border border-border bg-muted px-2 py-0.5 text-[10px] font-mono text-muted-foreground flex items-center gap-1"
              title={`Updated: ${updatedAt}`}
            >
              <Clock className="w-3 h-3 text-muted-foreground" />
              Updated {formatRelativeTime(updatedAt)}
            </span>
          )}
          {lastVerified && (
            <span 
              className="rounded border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-mono text-emerald-700 dark:text-emerald-400 flex items-center gap-1"
              title={`Verified: ${lastVerified}`}
            >
              <CheckCircle2 className="w-3 h-3" />
              Verified {formatRelativeTime(lastVerified)}
            </span>
          )}
        </div>
      )}

      {/* Divider */}
      {hasApplicability && (
        <div className="hidden sm:block w-px h-3.5 bg-border shrink-0" aria-hidden="true" />
      )}

      {/* Applicability Group */}
      {hasApplicability && (
        <div className="flex items-center gap-1.5 flex-wrap">
          {displayProblemTypes.map(pt => (
            <span
              key={pt}
              className="rounded border border-border bg-muted px-2 py-0.5 text-[10px] font-mono capitalize text-muted-foreground"
            >
              {pt}
            </span>
          ))}
          {hiddenProblemTypeCount > 0 && !isExpanded && (
            <button
              onClick={() => setIsExpanded(true)}
              className="rounded border border-border bg-muted px-2 py-0.5 text-[10px] font-mono text-muted-foreground hover:bg-muted/80 active:bg-muted hover:text-foreground transition-colors cursor-pointer"
              aria-expanded={false}
              aria-label={`Show ${hiddenProblemTypeCount} more problem types`}
            >
              +{hiddenProblemTypeCount} more
            </button>
          )}
          {isExpanded && problemTypes && problemTypes.length > MAX_VISIBLE_PROBLEM_TYPES && (
            <button
              onClick={() => setIsExpanded(false)}
              className="rounded border border-border bg-muted px-2 py-0.5 text-[10px] font-mono text-muted-foreground hover:bg-muted/80 active:bg-muted hover:text-foreground transition-colors cursor-pointer"
              aria-expanded={true}
              aria-label="Show fewer problem types"
            >
              Show less
            </button>
          )}
        </div>
      )}

      {/* Divider */}
      {hasMetadata && (
        <div className="hidden sm:block w-px h-3.5 bg-border shrink-0" aria-hidden="true" />
      )}

      {/* Metadata Group */}
      {hasMetadata && (
        <div className="flex items-center gap-1.5 flex-wrap">
          {difficulty && (
            <span className="rounded border border-border bg-muted px-2 py-0.5 text-[10px] font-mono capitalize text-muted-foreground">
              {difficulty}
            </span>
          )}
          {domain && (
            <span className="rounded border border-border bg-muted px-2 py-0.5 text-[10px] font-mono capitalize text-muted-foreground">
              {domain}
            </span>
          )}
          {engineeringArea && (
            <span className="rounded border border-border bg-muted px-2 py-0.5 text-[10px] font-mono capitalize text-muted-foreground">
              {engineeringArea}
            </span>
          )}
        </div>
      )}
    </div>
  );
}