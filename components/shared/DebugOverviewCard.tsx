'use client';

import { AlertCircle, AlertTriangle, CheckCircle2, Clock, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DebugOverviewCardProps {
  overview?: {
    severity?: 'critical' | 'high' | 'medium' | 'low';
    frequency?: 'common' | 'occasional' | 'rare';
    typical_stage?: 'development' | 'testing' | 'production' | 'any';
    estimated_fix_time?: string;
    production_impact?: 'severe' | 'moderate' | 'minimal' | 'none';
  };
  className?: string;
}

const getSeverityConfig = (severity: string | undefined) => {
  switch (severity) {
    case 'critical':
      return { icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/20' };
    case 'high':
      return { icon: AlertTriangle, color: 'text-orange-500', bg: 'bg-orange-500/10', border: 'border-orange-500/20' };
    case 'medium':
      return { icon: AlertTriangle, color: 'text-yellow-500', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20' };
    case 'low':
      return { icon: CheckCircle2, color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20' };
    default:
      return { icon: AlertCircle, color: 'text-muted-foreground', bg: 'bg-muted', border: 'border-border' };
  }
};

const getFrequencyConfig = (frequency: string | undefined) => {
  switch (frequency) {
    case 'common':
      return { label: 'Common', color: 'text-red-700 dark:text-red-400' };
    case 'occasional':
      return { label: 'Occasional', color: 'text-yellow-700 dark:text-yellow-400' };
    case 'rare':
      return { label: 'Rare', color: 'text-blue-700 dark:text-blue-400' };
    default:
      return { label: 'Unknown', color: 'text-muted-foreground' };
  }
};

const getImpactConfig = (impact: string | undefined) => {
  switch (impact) {
    case 'severe':
      return { label: 'Severe', color: 'text-red-700 dark:text-red-400' };
    case 'moderate':
      return { label: 'Moderate', color: 'text-yellow-700 dark:text-yellow-400' };
    case 'minimal':
      return { label: 'Minimal', color: 'text-emerald-700 dark:text-emerald-400' };
    case 'none':
      return { label: 'None', color: 'text-muted-foreground' };
    default:
      return { label: 'Unknown', color: 'text-muted-foreground' };
  }
};

export default function DebugOverviewCard({ overview, className }: DebugOverviewCardProps) {
  if (!overview) return null;

  const { severity, frequency, typical_stage, estimated_fix_time, production_impact } = overview;
  const severityConfig = getSeverityConfig(severity);
  const SeverityIcon = severityConfig.icon;
  const frequencyConfig = getFrequencyConfig(frequency);
  const impactConfig = getImpactConfig(production_impact);

  return (
    <div className={cn('rounded-lg border border-border bg-card p-4', className)}>
      <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
        Overview
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {severity && (
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <SeverityIcon className={cn('w-4 h-4', severityConfig.color)} />
              <span className="text-[10px] font-medium text-muted-foreground">Severity</span>
            </div>
            <span className={cn('text-xs font-semibold capitalize', severityConfig.color)}>
              {severity}
            </span>
          </div>
        )}
        {frequency && (
          <div className="space-y-1">
            <span className="text-[10px] font-medium text-muted-foreground">Frequency</span>
            <span className={cn('text-xs font-semibold', frequencyConfig.color)}>
              {frequencyConfig.label}
            </span>
          </div>
        )}
        {typical_stage && (
          <div className="space-y-1">
            <span className="text-[10px] font-medium text-muted-foreground">Typical Stage</span>
            <span className="text-xs font-semibold capitalize text-foreground">
              {typical_stage}
            </span>
          </div>
        )}
        {estimated_fix_time && (
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="text-[10px] font-medium text-muted-foreground">Est. Fix Time</span>
            </div>
            <span className="text-xs font-semibold text-foreground">
              {estimated_fix_time}
            </span>
          </div>
        )}
        {production_impact && (
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-muted-foreground" />
              <span className="text-[10px] font-medium text-muted-foreground">Prod. Impact</span>
            </div>
            <span className={cn('text-xs font-semibold', impactConfig.color)}>
              {impactConfig.label}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}