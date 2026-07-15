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
      "rounded-lg border border-emerald-500/20 bg-emerald-500/5 overflow-hidden",
      className
    )}>
      <div className="px-4 py-2.5 border-b border-emerald-500/20 bg-emerald-500/10">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <h4 className="text-xs font-semibold text-foreground">{title}</h4>
        </div>
      </div>
      <div className="p-4">
        <p className="text-xs text-muted-foreground leading-relaxed">{explanation}</p>
      </div>
    </div>
  );
}