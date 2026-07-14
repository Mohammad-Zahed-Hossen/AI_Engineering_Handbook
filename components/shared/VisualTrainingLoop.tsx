import { ArrowDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TrainingLoopStep {
  label: string;
  description?: string;
}

interface VisualTrainingLoopProps {
  steps?: TrainingLoopStep[];
  className?: string;
}

export default function VisualTrainingLoop({ steps = [], className }: VisualTrainingLoopProps) {
  if (steps.length === 0) {
    return null;
  }

  return (
    <div className={cn('rounded-lg border border-border bg-card p-4', className)}>
      <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-4">
        Training Loop
      </h3>
      <div className="space-y-3">
        {steps.map((step, idx) => (
          <div key={idx} className="space-y-2">
            {/* Step Box */}
            <div className="rounded-md border border-border bg-muted/30 px-3 py-2">
              <p className="text-xs font-medium text-foreground">{step.label}</p>
              {step.description && (
                <p className="text-[10px] text-muted-foreground mt-1">{step.description}</p>
              )}
            </div>

            {/* Arrow to next step */}
            {idx < steps.length - 1 && (
              <div className="flex justify-center">
                <ArrowDown className="w-4 h-4 text-muted-foreground" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
