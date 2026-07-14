import { X, ArrowDown, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AntiPatternData {
  wrong?: string;
  impact?: string;
  fix?: string;
}

interface AntiPatternCardProps {
  antiPattern: string | AntiPatternData;
  className?: string;
}

export default function AntiPatternCard({ antiPattern, className }: AntiPatternCardProps) {
  const isStructured = typeof antiPattern === 'object';

  if (!isStructured) {
    // Legacy string format
    return (
      <div className={cn('rounded-lg border border-red-500/20 bg-red-500/5 p-4', className)}>
        <p className="text-sm text-red-700 dark:text-red-400">{antiPattern}</p>
      </div>
    );
  }

  // New structured format
  return (
    <div className={cn('rounded-lg border border-red-500/20 bg-red-500/5 p-4 space-y-3', className)}>
      {/* Wrong */}
      {antiPattern.wrong && (
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5">
            <X className="w-3.5 h-3.5 text-red-500" />
            <span className="text-xs font-semibold text-red-700 dark:text-red-400 uppercase">
              Wrong
            </span>
          </div>
          <p className="text-xs text-red-700 dark:text-red-400 ml-5">{antiPattern.wrong}</p>
        </div>
      )}

      {/* Arrow */}
      {antiPattern.wrong && antiPattern.impact && (
        <div className="flex justify-center">
          <ArrowDown className="w-3 h-3 text-red-500/50" />
        </div>
      )}

      {/* Impact */}
      {antiPattern.impact && (
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-red-700 dark:text-red-400 uppercase">
              Impact
            </span>
          </div>
          <p className="text-xs text-red-700 dark:text-red-400 ml-5">{antiPattern.impact}</p>
        </div>
      )}

      {/* Arrow */}
      {antiPattern.impact && antiPattern.fix && (
        <div className="flex justify-center">
          <ArrowDown className="w-3 h-3 text-red-500/50" />
        </div>
      )}

      {/* Fix */}
      {antiPattern.fix && (
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
            <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 uppercase">
              Fix
            </span>
          </div>
          <p className="text-xs text-emerald-700 dark:text-emerald-400 ml-5">{antiPattern.fix}</p>
        </div>
      )}
    </div>
  );
}
