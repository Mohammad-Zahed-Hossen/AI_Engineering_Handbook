'use client';

import { PerformanceDimension } from '@/types/registry';
import { RegistryBadge } from './RegistryBadge';

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
  if (!dimensions || dimensions.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      <h2 className="text-lg font-semibold text-foreground">Performance Profile</h2>
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
  );
}