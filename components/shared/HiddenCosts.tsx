import { AlertCircle } from 'lucide-react';
import { DecisionOption } from '@/types/decision-guide';

interface HiddenCostsProps {
  options: DecisionOption[];
}

export default function HiddenCosts({ options }: HiddenCostsProps) {
  if (!options || options.length === 0) return null;

  // Check if any option has hidden costs
  const hasHiddenCosts = options.some(opt => opt.hidden_costs && opt.hidden_costs.length > 0);
  if (!hasHiddenCosts) return null;

  return (
    <section id="hidden-costs" className="space-y-3 scroll-mt-24">
      <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
        <AlertCircle className="w-5 h-5 text-blue-500" />
        Hidden Costs
      </h2>
      
      <div className="space-y-3">
        {options.map((option, idx) => {
          if (!option.hidden_costs || option.hidden_costs.length === 0) return null;
          
          return (
            <div key={option.id} className="rounded-lg border border-border bg-card p-4">
              <h3 className="text-sm font-semibold text-foreground mb-2">{option.name}</h3>
              <ul className="space-y-1">
                {option.hidden_costs.map((cost, costIdx) => (
                  <li key={costIdx} className="text-xs text-muted-foreground pl-3 relative before:content-['⚠'] before:absolute before:left-0 before:text-amber-500">
                    {cost}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
}