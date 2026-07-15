import { Prose } from '@/components/shared/Prose';
import { cn } from '@/lib/utils';
import { Brain } from 'lucide-react';

interface MentalModelDisplayProps {
  content: string;
  className?: string;
}

export default function MentalModelDisplay({ 
  content, 
  className 
}: MentalModelDisplayProps) {
  return (
    <div className={cn(
      "rounded-lg border border-purple-500/20 bg-purple-500/5 p-4",
      className
    )}>
      <div className="flex items-center gap-2 mb-3">
        <Brain className="w-4 h-4 text-purple-600 dark:text-purple-400" />
        <h3 className="text-xs font-semibold text-foreground">Mental Model</h3>
      </div>
      <div className="rounded-md border border-border bg-card p-3">
        <Prose content={content} className="text-xs text-muted-foreground" />
      </div>
    </div>
  );
}