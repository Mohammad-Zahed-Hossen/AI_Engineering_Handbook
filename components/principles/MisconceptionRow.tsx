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
      <div className="px-4 py-2.5 border-b border-amber-500/20 bg-amber-500/10">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
          <h4 className="text-xs font-semibold text-foreground">Misconception</h4>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border">
        <div className="p-4 space-y-2 bg-red-500/5 md:bg-transparent">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
            <span className="text-[10px] font-semibold text-red-600 dark:text-red-400 uppercase tracking-wider">Myth</span>
          </div>
          <p className="text-xs text-muted-foreground">{myth}</p>
        </div>
        <div className="p-4 space-y-2 bg-emerald-500/5 md:bg-transparent">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Reality</span>
          </div>
          <p className="text-xs text-muted-foreground">{reality}</p>
        </div>
      </div>
    </div>
  );
}