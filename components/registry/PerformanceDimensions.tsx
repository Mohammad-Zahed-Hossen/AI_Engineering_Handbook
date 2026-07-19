'use client';

import { PerformanceDimension } from '@/types/registry';
import { RegistryBadge } from './RegistryBadge';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface PerformanceDimensionsProps {
  dimensions: PerformanceDimension[];
}

const ratingVariants: Record<string, 'success' | 'default' | 'warning' | 'destructive'> = {
  excellent: 'success',
  good: 'default',
  fair: 'warning',
  poor: 'destructive',
};

/**
 * Performance Dimensions component for Registry family pages.
 * Displays extensible performance ratings for various model capabilities.
 */
export default function PerformanceDimensions({ dimensions }: PerformanceDimensionsProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!dimensions || dimensions.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full md:hidden"
      >
        <h2 className="text-base font-semibold text-foreground">Performance Profile</h2>
        <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
      </button>
      <h2 className="hidden md:block text-base md:text-lg font-semibold text-foreground">Performance Profile</h2>
      
      <div className={`${isExpanded ? 'block' : 'hidden'} md:block`}>
        <div className="flex flex-wrap items-center gap-1.5">
          {dimensions.map((dim) => (
            <RegistryBadge 
              key={dim.dimension} 
              variant={ratingVariants[dim.rating] || 'default'} 
              size="xs" 
              className="font-mono"
              title={dim.notes}
            >
              {dim.dimension}: {dim.rating}
            </RegistryBadge>
          ))}
        </div>
      </div>
    </div>
  );
}