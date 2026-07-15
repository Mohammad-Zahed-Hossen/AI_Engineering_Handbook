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
      "rounded-lg border border-red-500/20 bg-red-500/5 overflow-hidden",
      className
    )}>
      <div className="px-4 py-2.5 border-b border-red-500/20 bg-red-500/10">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
          <h4 className="text-xs font-semibold text-foreground">{violation}</h4>
        </div>
      </div>
      <div className="p-4 space-y-3">
        <div>
          <span className="text-[10px] font-semibold text-red-600 dark:text-red-400 uppercase tracking-wider">Symptoms</span>
          <p className="text-xs text-muted-foreground mt-1">{symptoms}</p>
        </div>
        
        <div>
          <span className="text-[10px] font-semibold text-red-600 dark:text-red-400 uppercase tracking-wider">Why It Happens</span>
          <p className="text-xs text-muted-foreground mt-1">{whyItHappens}</p>
        </div>
      </div>
    </div>
  );
}