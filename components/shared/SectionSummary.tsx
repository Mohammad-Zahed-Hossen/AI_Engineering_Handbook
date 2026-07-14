'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Lightbulb } from 'lucide-react';

interface SectionSummaryProps {
  points: string[];
  className?: string;
  icon?: React.ReactNode;
}

export default function SectionSummary({ points, className, icon }: SectionSummaryProps) {
  if (!points || points.length === 0) return null;

  return (
    <div className={cn('mb-3 p-3 rounded-lg bg-muted/50 border border-border/50', className)}>
      <div className="flex items-center gap-2 mb-2">
        {icon || <Lightbulb className="w-4 h-4 text-yellow-500" />}
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Key Points</span>
      </div>
      <ul className="space-y-1">
        {points.map((point, idx) => (
          <li key={idx} className="text-xs text-muted-foreground flex items-start gap-2">
            <span className="text-muted-foreground/50 mt-0.5">•</span>
            <span>{point}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
