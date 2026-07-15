import { CheckCircle, GitFork } from 'lucide-react';
import { DecisionGuide } from '@/types/decision-guide';

interface DecisionGuideSummaryProps {
  guide: DecisionGuide;
}

export default function DecisionGuideSummary({ guide }: DecisionGuideSummaryProps) {
  if (!guide.default_recommendation && !guide.one_sentence_summary) return null;

  return (
    <section id="decision-summary" className="space-y-3 scroll-mt-24">
      <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
        <CheckCircle className="w-5 h-5 text-blue-500" />
        Decision Summary
      </h2>
      
      <div className="space-y-3">
        {/* Default Recommendation */}
        {guide.default_recommendation && (
          <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 block mb-1">
                  Default Recommendation
                </span>
                <p className="text-sm text-foreground font-medium">{guide.default_recommendation}</p>
              </div>
            </div>
          </div>
        )}

        {/* One Sentence Summary */}
        {guide.one_sentence_summary && (
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground italic">{guide.one_sentence_summary}</p>
          </div>
        )}

        {/* Choose When / Avoid When */}
        {(guide.choose_when || guide.avoid_when) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {guide.choose_when && (
              <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 block mb-1">
                  Choose When
                </span>
                <p className="text-xs text-muted-foreground">{guide.choose_when}</p>
              </div>
            )}
            {guide.avoid_when && (
              <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-red-700 dark:text-red-400 block mb-1">
                  Avoid When
                </span>
                <p className="text-xs text-muted-foreground">{guide.avoid_when}</p>
              </div>
            )}
          </div>
        )}

        {/* Hybrid Recommendation */}
        {guide.hybrid_recommendation && (
          <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-4">
            <div className="flex items-start gap-3">
              <GitFork className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 block mb-1">
                  Hybrid Recommendation
                </span>
                <p className="text-sm text-foreground">{guide.hybrid_recommendation}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}