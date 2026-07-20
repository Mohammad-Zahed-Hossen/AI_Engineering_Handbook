'use client';

import { useState } from 'react';
import { ChevronDown, Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ProseClient } from './Prose';

interface DebugRootCause {
  cause: string;
  probability?: 'high' | 'medium' | 'low';
  explanation?: string;
  recognition_clues?: string[];
  typical_environment?: string;
}

interface RootCauseCardProps {
  cause: DebugRootCause;
  defaultExpanded?: boolean;
  className?: string;
}

const getProbabilityConfig = (probability: string | undefined) => {
  switch (probability) {
    case 'high':
      return { label: 'High', color: 'text-red-700 dark:text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20' };
    case 'medium':
      return { label: 'Medium', color: 'text-yellow-700 dark:text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20' };
    case 'low':
      return { label: 'Low', color: 'text-blue-700 dark:text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' };
    default:
      return { label: 'Medium', color: 'text-muted-foreground', bg: 'bg-muted', border: 'border-border' };
  }
};

export default function RootCauseCard({
  cause,
  defaultExpanded = false,
  className,
}: RootCauseCardProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const { cause: causeText, probability, explanation, recognition_clues, typical_environment } = cause;
  const config = getProbabilityConfig(probability);
  const hasDetails = explanation || recognition_clues?.length || typical_environment;

  return (
    <div className={cn('rounded-lg border border-border bg-card overflow-hidden', className)}>
      {/* Header - Always visible */}
      <button
        onClick={() => hasDetails && setExpanded(!expanded)}
        className={cn(
          'w-full flex items-center justify-between p-3 text-left',
          hasDetails ? 'cursor-pointer hover:bg-muted/30 transition-colors touch-target' : 'cursor-default'
        )}
        disabled={!hasDetails}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium text-foreground">{causeText}</span>
            <span className={cn(
              'shrink-0 px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase',
              config.color,
              config.bg
            )}>
              {probability} likelihood
            </span>
          </div>
          {/* Show first recognition clue as teaser if collapsed */}
          {!expanded && recognition_clues && recognition_clues.length > 0 && (
            <p className="text-xs text-muted-foreground mt-1 truncate">
              {recognition_clues[0]}
            </p>
          )}
        </div>
        {hasDetails && (
          <ChevronDown className={cn(
            'w-4 h-4 text-muted-foreground transition-transform',
            expanded ? 'rotate-180' : ''
          )} />
        )}
      </button>

      {/* Expandable Details */}
      {hasDetails && (
        <div
          className={cn(
            'overflow-hidden transition-all duration-200',
            expanded ? 'max-h-96' : 'max-h-0'
          )}
        >
          <div className="p-3 pt-0 space-y-3 border-t border-border">
            {explanation && (
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Explanation
                </span>
                <ProseClient content={explanation} className="text-xs text-muted-foreground mt-1" />
              </div>
            )}
            {recognition_clues && recognition_clues.length > 0 && (
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                  <Lightbulb className="w-3 h-3" />
                  Recognition Clues
                </span>
                <ul className="mt-1 space-y-0.5">
                  {recognition_clues.map((clue, idx) => (
                    <li key={idx} className="text-xs text-muted-foreground">
                      • {clue}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {typical_environment && (
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Typical Environment
                </span>
                <p className="text-xs text-muted-foreground mt-0.5">{typical_environment}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}