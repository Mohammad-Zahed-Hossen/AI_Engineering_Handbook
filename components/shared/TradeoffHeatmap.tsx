import { BarChart3 } from 'lucide-react';
import { TradeoffEntry } from '@/types/decision-guide';

interface TradeoffHeatmapProps {
  tradesoffs: TradeoffEntry[];
}

const getRatingColor = (rating: number) => {
  if (rating >= 4) return 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-400';
  if (rating >= 3) return 'bg-amber-500/20 text-amber-700 dark:text-amber-400';
  return 'bg-red-500/20 text-red-700 dark:text-red-400';
};

const getBarColor = (rating: number) => {
  if (rating >= 4) return 'bg-emerald-500';
  if (rating >= 3) return 'bg-amber-500';
  return 'bg-red-500';
};

export default function TradeoffHeatmap({ tradesoffs }: TradeoffHeatmapProps) {
  if (!tradesoffs || tradesoffs.length === 0) return null;

  // Get all option names from the first entry
  const optionNames = tradesoffs.length > 0 ? Object.keys(tradesoffs[0].ratings) : [];

  return (
    <section id="tradeoff-analysis" className="space-y-3 scroll-mt-24">
      <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
        <BarChart3 className="w-5 h-5 text-blue-500" />
        Tradeoff Analysis
      </h2>
      
      <div className="space-y-2">
        {tradesoffs.map((entry, idx) => {
          const ratings = entry.ratings as Record<string, number>;
          return (
            <div key={idx} className="rounded-lg border border-border bg-card p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">{entry.criterion}</span>
                <div className="flex items-center gap-2 text-xs">
                  {optionNames.map((optionName) => {
                    const rating = ratings[optionName] || 0;
                    return (
                      <span key={optionName} className={getRatingColor(rating)}>
                        {optionName}: {rating}/5
                      </span>
                    );
                  })}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {optionNames.map((optionName) => {
                  const rating = ratings[optionName] || 0;
                  return (
                    <div key={optionName} className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${getBarColor(rating)}`} 
                        style={{ width: `${rating * 20}%` }} 
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}