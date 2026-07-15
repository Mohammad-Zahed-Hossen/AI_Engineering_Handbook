import { cn } from '@/lib/utils';
import { AlertTriangle } from 'lucide-react';

interface ViolationWarningCardProps {
  violation: string;
  symptoms: string;
  whyItHappens: string;
  className?: string;
}

export default function ViolationWarningCard({ 
  violation, 
  symptoms, 
  whyItHappens,
  className 
}: ViolationWarningCardProps) {
  return (
    <div className={cn(
      "rounded-lg border border-red-500/20 bg-red-500/5 p-4 space-y-3",
      className
    )}>
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
        <div className="space-y-1 flex-1">
          <h4 className="text-xs font-semibold text-foreground">{violation}</h4>
        </div>
      </div>
      
      <div className="pl-7 space-y-2">
        <div>
          <span className="text-[10px] font-semibold text-red-600 dark:text-red-400 uppercase tracking-wider">Symptoms</span>
          <p className="text-xs text-muted-foreground mt-0.5">{symptoms}</p>
        </div>
        
        <div>
          <span className="text-[10px] font-semibold text-red-600 dark:text-red-400 uppercase tracking-wider">Why It Happens</span>
          <p className="text-xs text-muted-foreground mt-0.5">{whyItHappens}</p>
        </div>
      </div>
    </div>
  );
}