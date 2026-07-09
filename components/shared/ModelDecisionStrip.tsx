import { Activity, CheckCircle2, Shield, Flame, Gauge, Info, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ModelDecisionStripProps {
  interpretability?: string;
  stability?: string;
  confidence?: string;
  engineeringMaturity?: string;
  difficulty?: string;
}

function getDifficultyStyles(difficulty: string) {
  const d = difficulty.toLowerCase();
  if (d === 'easy') {
    return {
      bg: 'bg-emerald-500/10 dark:bg-emerald-950/20',
      text: 'text-emerald-700 dark:text-emerald-400',
      border: 'border-emerald-500/20 dark:border-emerald-500/30',
      icon: <Gauge className="w-3.5 h-3.5" />,
    };
  }
  if (d === 'intermediate') {
    return {
      bg: 'bg-amber-500/10 dark:bg-amber-950/20',
      text: 'text-amber-700 dark:text-amber-400',
      border: 'border-amber-500/20 dark:border-amber-500/30',
      icon: <Gauge className="w-3.5 h-3.5" />,
    };
  }
  return {
    bg: 'bg-rose-500/10 dark:bg-rose-950/20',
    text: 'text-rose-700 dark:text-rose-400',
    border: 'border-rose-500/20 dark:border-rose-500/30',
    icon: <Gauge className="w-3.5 h-3.5" />,
  };
}

function getStabilityStyles(stability: string) {
  const s = stability.toLowerCase();
  if (s === 'stable') {
    return {
      bg: 'bg-emerald-500/10 dark:bg-emerald-950/20',
      text: 'text-emerald-700 dark:text-emerald-400',
      border: 'border-emerald-500/20 dark:border-emerald-500/30',
      icon: <Activity className="w-3.5 h-3.5" />,
    };
  }
  return {
    bg: 'bg-rose-500/10 dark:bg-rose-950/20',
    text: 'text-rose-700 dark:text-rose-400',
    border: 'border-rose-500/20 dark:border-rose-500/30',
    icon: <Flame className="w-3.5 h-3.5" />,
  };
}

function getConfidenceStyles(confidence: string) {
  const c = confidence.toLowerCase();
  if (c === 'verified') {
    return {
      bg: 'bg-indigo-500/10 dark:bg-indigo-950/20',
      text: 'text-indigo-700 dark:text-indigo-400',
      border: 'border-indigo-500/20 dark:border-indigo-500/30',
      icon: <CheckCircle2 className="w-3.5 h-3.5" />,
    };
  }
  return {
    bg: 'bg-zinc-500/10 dark:bg-zinc-950/20',
    text: 'text-zinc-700 dark:text-zinc-400',
    border: 'border-zinc-500/20 dark:border-zinc-500/30',
    icon: <Info className="w-3.5 h-3.5" />,
  };
}

function getMaturityStyles(maturity: string) {
  const m = maturity.toLowerCase();
  if (m === 'production' || m === 'battle-tested') {
    return {
      bg: 'bg-cyan-500/10 dark:bg-cyan-950/20',
      text: 'text-cyan-700 dark:text-cyan-400',
      border: 'border-cyan-500/20 dark:border-cyan-500/30',
      icon: <Shield className="w-3.5 h-3.5" />,
    };
  }
  return {
    bg: 'bg-amber-500/10 dark:bg-amber-950/20',
    text: 'text-amber-700 dark:text-amber-400',
    border: 'border-amber-500/20 dark:border-amber-500/30',
    icon: <Info className="w-3.5 h-3.5" />,
  };
}

export default function ModelDecisionStrip({
  interpretability,
  stability,
  confidence,
  engineeringMaturity,
  difficulty,
}: ModelDecisionStripProps) {
  const pills = [
    stability && { label: 'Stability', value: stability, styles: getStabilityStyles(stability) },
    confidence && { label: 'Confidence', value: confidence, styles: getConfidenceStyles(confidence) },
    engineeringMaturity && { label: 'Maturity', value: engineeringMaturity, styles: getMaturityStyles(engineeringMaturity) },
    difficulty && { label: 'Difficulty', value: difficulty, styles: getDifficultyStyles(difficulty) },
  ].filter(Boolean) as Array<{ label: string; value: string; styles: ReturnType<typeof getDifficultyStyles> }>;

  return (
    <div className="space-y-3 select-none">
      {/* Metrics Row */}
      {pills.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          {pills.map((pill) => (
            <div
              key={pill.label}
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10.5px] font-sans font-medium uppercase tracking-wide shadow-sm",
                pill.styles.bg,
                pill.styles.text,
                pill.styles.border
              )}
            >
              {pill.styles.icon}
              <span>
                {pill.label}: <span className="font-bold">{pill.value}</span>
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Separate Interpretability Profile Callout */}
      {interpretability && (
        <div className="rounded-lg border border-border/80 bg-muted/20 hover:bg-muted/30 transition-colors p-3 flex items-start gap-3">
          <Eye className="w-4 h-4 text-primary shrink-0 mt-0.5" />
          <div className="space-y-0.5 text-xs font-sans">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
              Interpretability & Explainability Profile
            </span>
            <p className="text-foreground leading-relaxed font-sans font-medium">
              {interpretability}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

