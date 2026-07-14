import { ArrowDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DecisionFlowStep {
  question: string;
  if_yes: string;
  if_no: string;
}

interface DecisionFlowProps {
  steps?: DecisionFlowStep[];
  className?: string;
}

export default function DecisionFlow({ steps = [], className }: DecisionFlowProps) {
  if (steps.length === 0) {
    return null;
  }

  return (
    <div className={cn('rounded-lg border border-border bg-card p-4', className)}>
      <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-4">
        Decision Flow
      </h3>
      <div className="space-y-4">
        {steps.map((step, idx) => (
          <div key={idx} className="space-y-2">
            {/* Question Box */}
            <div className="rounded-md border border-border bg-muted/30 px-3 py-2">
              <p className="text-xs font-medium text-foreground">{step.question}</p>
            </div>

            {/* Branches */}
            <div className="grid grid-cols-2 gap-2 ml-4">
              {/* YES Branch */}
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 shrink-0">
                  YES
                </span>
                <ArrowDown className="w-3 h-3 text-muted-foreground shrink-0" />
                <span className="text-xs text-muted-foreground">{step.if_yes}</span>
              </div>

              {/* NO Branch */}
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold text-red-600 dark:text-red-400 shrink-0">
                  NO
                </span>
                <ArrowDown className="w-3 h-3 text-muted-foreground shrink-0" />
                <span className="text-xs text-muted-foreground">{step.if_no}</span>
              </div>
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
