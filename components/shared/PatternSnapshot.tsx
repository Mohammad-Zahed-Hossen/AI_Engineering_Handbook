import { Target, AlertCircle, Layers, Cpu, LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PatternSnapshotProps {
  primaryGoal?: string;
  primaryConstraint?: string;
  effectiveBatch?: string;
  typicalUsage?: string;
  className?: string;
}

export default function PatternSnapshot({
  primaryGoal,
  primaryConstraint,
  effectiveBatch,
  typicalUsage,
  className,
}: PatternSnapshotProps) {
  if (!primaryGoal && !primaryConstraint && !effectiveBatch && !typicalUsage) {
    return null;
  }

  const items = [
    primaryGoal ? { icon: Target, label: 'Primary Goal', value: primaryGoal } : null,
    primaryConstraint ? { icon: AlertCircle, label: 'Primary Constraint', value: primaryConstraint } : null,
    effectiveBatch ? { icon: Layers, label: 'Effective Batch', value: effectiveBatch } : null,
    typicalUsage ? { icon: Cpu, label: 'Typical Usage', value: typicalUsage } : null,
  ].filter((item): item is { icon: LucideIcon; label: string; value: string } => item !== null);

  return (
    <div className={cn('rounded-lg border border-border bg-card p-4', className)}>
      <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-3">
        Pattern Snapshot
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {items.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="flex items-start gap-2">
              <Icon className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <p className="text-[10px] font-medium text-muted-foreground uppercase">
                  {item.label}
                </p>
                <p className="text-xs text-foreground">{item.value}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
