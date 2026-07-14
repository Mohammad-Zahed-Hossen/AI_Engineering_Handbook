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
  confidence?: string;
  engineeringMaturity?: string;
  lifecycle?: string;
  stability?: string;
  className?: string;
  simplified?: boolean;
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
  confidence,
  engineeringMaturity,
  lifecycle,
  stability,
  className,
  simplified = false,
}: MetadataBadgesProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const hasFreshness = !!(updatedAt || lastVerified);
  const hasApplicability = !!(problemTypes && problemTypes.length > 0);
  const hasMetadata = !!(difficulty || domain || engineeringArea);
  const hasMaturity = !!(confidence || engineeringMaturity || lifecycle || stability);

  // Determine badge color based on maturity values
  const getMaturityBadgeClass = (field: string, value: string): string => {
    const isProductionReady = value === 'production_ready' || value === 'production_proven';
    const isExperimental = value === 'experimental' || value === 'research';
    const isDeprecated = value === 'deprecated' || value === 'archived';
    
    if (isProductionReady) {
      return 'rounded border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-mono text-emerald-700 dark:text-emerald-400';
    }
    if (isExperimental) {
      return 'rounded border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 text-[10px] font-mono text-amber-700 dark:text-amber-400';
    }
    if (isDeprecated) {
      return 'rounded border border-red-500/20 bg-red-500/10 px-2 py-0.5 text-[10px] font-mono text-red-700 dark:text-red-400';
    }
    return 'rounded border border-border bg-muted px-2 py-0.5 text-[10px] font-mono text-muted-foreground';
  };

  const displayProblemTypes = problemTypes
    ? (isExpanded ? problemTypes : problemTypes.slice(0, MAX_VISIBLE_PROBLEM_TYPES))
    : [];
  const hiddenProblemTypeCount = problemTypes
    ? Math.max(0, problemTypes.length - MAX_VISIBLE_PROBLEM_TYPES)
    : 0;

  // In simplified mode, only show essential badges by default
  const showEssentialOnly = simplified && !isExpanded;
  const hasAdditionalInfo = hasFreshness || (hasMetadata && (domain || engineeringArea));

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
      {hasMaturity && (
        <div className="hidden sm:block w-px h-3.5 bg-border shrink-0" aria-hidden="true" />
      )}

      {/* Maturity Group - Always show in simplified mode */}
      {hasMaturity && (
        <div className="flex items-center gap-1.5 flex-wrap">
          {confidence && (
            <span className={getMaturityBadgeClass('confidence', confidence)}>
              {confidence}
            </span>
          )}
          {engineeringMaturity && (
            <span className={getMaturityBadgeClass('engineeringMaturity', engineeringMaturity)}>
              {engineeringMaturity}
            </span>
          )}
          {lifecycle && (
            <span className={getMaturityBadgeClass('lifecycle', lifecycle)}>
              {lifecycle}
            </span>
          )}
          {stability && (
            <span className={getMaturityBadgeClass('stability', stability)}>
              {stability}
            </span>
          )}
        </div>
      )}

      {/* Divider */}
      {hasMetadata && (
        <div className="hidden sm:block w-px h-3.5 bg-border shrink-0" aria-hidden="true" />
      )}

      {/* Metadata Group - Only show difficulty in simplified mode */}
      {hasMetadata && (
        <div className="flex items-center gap-1.5 flex-wrap">
          {difficulty && (
            <span className="rounded border border-border bg-muted px-2 py-0.5 text-[10px] font-mono capitalize text-muted-foreground">
              {difficulty}
            </span>
          )}
          {!showEssentialOnly && domain && (
            <span className="rounded border border-border bg-muted px-2 py-0.5 text-[10px] font-mono capitalize text-muted-foreground">
              {domain}
            </span>
          )}
          {!showEssentialOnly && engineeringArea && (
            <span className="rounded border border-border bg-muted px-2 py-0.5 text-[10px] font-mono capitalize text-muted-foreground">
              {engineeringArea}
            </span>
          )}
        </div>
      )}

      {/* Divider */}
      {!showEssentialOnly && hasFreshness && (
        <div className="hidden sm:block w-px h-3.5 bg-border shrink-0" aria-hidden="true" />
      )}

      {/* Freshness Group - Only show in expanded mode */}
      {!showEssentialOnly && hasFreshness && (
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
      {!showEssentialOnly && hasApplicability && (
        <div className="hidden sm:block w-px h-3.5 bg-border shrink-0" aria-hidden="true" />
      )}

      {/* Applicability Group - Only show in expanded mode */}
      {!showEssentialOnly && hasApplicability && (
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

      {/* Simplified Mode: More Info Toggle */}
      {simplified && hasAdditionalInfo && (
        <>
          <div className="hidden sm:block w-px h-3.5 bg-border shrink-0" aria-hidden="true" />
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="rounded border border-border bg-muted px-2 py-0.5 text-[10px] font-mono text-muted-foreground hover:bg-muted/80 active:bg-muted hover:text-foreground transition-colors cursor-pointer"
            aria-expanded={isExpanded}
          >
            {isExpanded ? 'Show less' : 'More info'}
          </button>
        </>
      )}
    </div>
  );
}