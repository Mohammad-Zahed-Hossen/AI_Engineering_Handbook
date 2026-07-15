import { ArrowRight } from 'lucide-react';
import { MigrationStep } from '@/types/decision-guide';

interface MigrationPathProps {
  steps: MigrationStep[];
}

export default function MigrationPath({ steps }: MigrationPathProps) {
  if (!steps || steps.length === 0) return null;

  return (
    <section id="migration-path" className="space-y-3 scroll-mt-24">
      <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
        <ArrowRight className="w-5 h-5 text-blue-500" />
        Migration Path
      </h2>
      
      <div className="space-y-2">
        {steps.map((step, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <div className="flex-1 rounded-lg border border-border bg-card p-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">{step.step}</span>
                {idx < steps.length - 1 && (
                  <ArrowRight className="w-4 h-4 text-muted-foreground" />
                )}
              </div>
              {step.description && (
                <p className="text-xs text-muted-foreground mt-1">{step.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}