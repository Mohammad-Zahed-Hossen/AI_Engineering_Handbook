import { GitBranch } from 'lucide-react';
import { ConstraintRecommendation } from '@/types/decision-guide';

interface ConstraintRecommendationsProps {
  recommendations: ConstraintRecommendation[];
}

export default function ConstraintRecommendations({ recommendations }: ConstraintRecommendationsProps) {
  if (!recommendations || recommendations.length === 0) return null;

  return (
    <section id="constraint-recommendations" className="space-y-3 scroll-mt-24">
      <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
        <GitBranch className="w-5 h-5 text-blue-500" />
        Constraint Based Recommendations
      </h2>
      
      <div className="space-y-2">
        {recommendations.map((rec, idx) => (
          <div key={idx} className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-start gap-3">
              <div className="flex-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                  IF
                </span>
                <p className="text-sm text-foreground font-medium mb-2">{rec.condition}</p>
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                  RECOMMENDATION
                </span>
                <p className="text-sm text-primary font-medium mb-1">{rec.recommended_option}</p>
                <p className="text-xs text-muted-foreground">{rec.reason}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}