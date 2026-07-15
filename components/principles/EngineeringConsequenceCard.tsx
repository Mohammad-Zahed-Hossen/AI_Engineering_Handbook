import { cn } from '@/lib/utils';
import { CheckCircle2 } from 'lucide-react';

interface EngineeringConsequenceCardProps {
  title: string;
  explanation: string;
  className?: string;
}

export default function EngineeringConsequenceCard({ 
  title, 
  explanation, 
  className 
}: EngineeringConsequenceCardProps) {
  return (
    <div className={cn(
      "rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-4",
      className
    )}>
      <div className="flex items-start gap-3">
        <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="text-xs font-semibold text-foreground">{title}</h4>
          <p className="text-xs text-muted-foreground leading-relaxed">{explanation}</p>
        </div>
      </div>
    </div>
  );
}