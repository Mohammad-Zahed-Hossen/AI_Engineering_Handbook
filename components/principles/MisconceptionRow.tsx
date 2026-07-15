import { cn } from '@/lib/utils';
import { AlertCircle } from 'lucide-react';

interface MisconceptionRowProps {
  myth: string;
  reality: string;
  className?: string;
}

export default function MisconceptionRow({ 
  myth, 
  reality, 
  className 
}: MisconceptionRowProps) {
  return (
    <div className={cn(
      "rounded-lg border border-amber-500/20 bg-amber-500/5 overflow-hidden",
      className
    )}>
      <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border">
        <div className="p-4 space-y-2">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span className="text-[10px] font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider">Myth</span>
          </div>
          <p className="text-xs text-muted-foreground">{myth}</p>
        </div>
        <div className="p-4 space-y-2">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span className="text-[10px] font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider">Reality</span>
          </div>
          <p className="text-xs text-muted-foreground">{reality}</p>
        </div>
      </div>
    </div>
  );
}