'use client';

import { cn } from '@/lib/utils';

interface WorkflowStep {
  id: string;
  label: string;
  completed?: boolean;
}

interface WorkflowProgressProps {
  steps: WorkflowStep[];
  currentStepId?: string;
  className?: string;
}

export default function WorkflowProgress({
  steps,
  currentStepId,
  className,
}: WorkflowProgressProps) {
  const currentStepIndex = steps.findIndex(step => step.id === currentStepId);

  return (
    <div className={cn('w-full', className)}>
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isActive = index === currentStepIndex;
          const isCompleted = index < currentStepIndex;
          
          return (
            <div key={step.id} className="flex items-center">
              {/* Step indicator */}
              <div className="flex flex-col items-center">
                <div className={cn(
                  'w-2 h-2 rounded-full border-2 transition-colors',
                  isCompleted || step.completed
                    ? 'bg-primary border-primary'
                    : isActive
                    ? 'border-primary'
                    : 'border-border'
                )} />
                <span className={cn(
                  'text-[10px] mt-1 text-center max-w-[60px] truncate',
                  isActive ? 'text-foreground font-medium' : 'text-muted-foreground'
                )}>
                  {step.label}
                </span>
              </div>
              
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className={cn(
                  'flex-1 h-px mx-2',
                  index < currentStepIndex ? 'bg-primary' : 'bg-border'
                )} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}