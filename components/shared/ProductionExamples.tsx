import { Building2 } from 'lucide-react';
import { ProductionExample } from '@/types/decision-guide';

interface ProductionExamplesProps {
  examples: ProductionExample[];
}

export default function ProductionExamples({ examples }: ProductionExamplesProps) {
  if (!examples || examples.length === 0) return null;

  return (
    <section id="production-examples" className="space-y-3 scroll-mt-24">
      <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
        <Building2 className="w-5 h-5 text-blue-500" />
        Production Examples
      </h2>
      
      <div className="space-y-2">
        {examples.map((example, idx) => (
          <div key={idx} className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-primary">
                  {example.system}
                </span>
                <p className="text-xs text-muted-foreground mt-1">{example.why}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}