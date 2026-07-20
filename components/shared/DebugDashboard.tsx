import { AlertCircle, AlertTriangle, CheckCircle2, Clock, Zap, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import ContentTypeBadge from './ContentTypeBadge';

interface DebugOverview {
  severity?: 'critical' | 'high' | 'medium' | 'low';
  frequency?: 'common' | 'occasional' | 'rare';
  typical_stage?: 'development' | 'testing' | 'production' | 'any';
  estimated_fix_time?: string;
  production_impact?: 'severe' | 'moderate' | 'minimal' | 'none';
}

interface DebugDashboardProps {
  title: string;
  category: string;
  overview?: DebugOverview;
  hasQuickIdentification?: boolean;
  className?: string;
}

const getSeverityConfig = (severity: string | undefined) => {
  switch (severity) {
    case 'critical':
      return { icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-500/10', label: 'Critical' };
    case 'high':
      return { icon: AlertTriangle, color: 'text-orange-500', bg: 'bg-orange-500/10', label: 'High' };
    case 'medium':
      return { icon: AlertTriangle, color: 'text-yellow-500', bg: 'bg-yellow-500/10', label: 'Medium' };
    case 'low':
      return { icon: CheckCircle2, color: 'text-blue-500', bg: 'bg-blue-500/10', label: 'Low' };
    default:
      return { icon: AlertCircle, color: 'text-muted-foreground', bg: 'bg-muted', label: 'Unknown' };
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

export default function DebugDashboard({
  title,
  overview,
  hasQuickIdentification = false,
  className,
}: DebugDashboardProps) {
  const { severity, frequency, estimated_fix_time, production_impact } = overview || {};
  const severityConfig = getSeverityConfig(severity);
  const SeverityIcon = severityConfig.icon;
  const impactConfig = getImpactConfig(production_impact);

  return (
    <div className={cn('space-y-4', className)}>
      {/* Main Title with Category */}
      <div className="flex items-start gap-2 flex-wrap">
        <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground flex-1 min-w-0">
          {title}
        </h1>
        <ContentTypeBadge type="debug_guide" className="shrink-0" />
      </div>

      {/* Key Metrics Grid - Mobile First */}
      <div className="grid grid-cols-2 min-[360px]:grid-cols-3 sm:grid-cols-5 gap-2">
        {/* Severity */}
        {severity && (
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <SeverityIcon className={cn('w-3.5 h-3.5', severityConfig.color)} />
              <span className="text-[10px] font-medium text-muted-foreground">Severity</span>
            </div>
            <span className={cn('text-xs font-semibold capitalize', severityConfig.color)}>
              {severityConfig.label}
            </span>
          </div>
        )}

        {/* Fix Time */}
        {estimated_fix_time && (
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-[10px] font-medium text-muted-foreground">Fix Time</span>
            </div>
            <span className="text-xs font-semibold text-foreground">
              {estimated_fix_time}
            </span>
          </div>
        )}

        {/* Production Impact */}
        {production_impact && (
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-[10px] font-medium text-muted-foreground">Impact</span>
            </div>
            <span className={cn('text-xs font-semibold', impactConfig.color)}>
              {impactConfig.label}
            </span>
          </div>
        )}

        {/* Quick Check Available */}
        {hasQuickIdentification && (
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <Search className="w-3.5 h-3.5 text-blue-500" />
              <span className="text-[10px] font-medium text-muted-foreground">Quick Check</span>
            </div>
            <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
              Available
            </span>
          </div>
        )}

        {/* Frequency */}
        {frequency && (
          <div className="space-y-1">
            <span className="text-[10px] font-medium text-muted-foreground">Frequency</span>
            <span className="text-xs font-semibold capitalize text-foreground">
              {frequency}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}