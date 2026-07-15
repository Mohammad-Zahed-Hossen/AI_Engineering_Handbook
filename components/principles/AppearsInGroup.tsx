import { cn } from '@/lib/utils';
import { Layers } from 'lucide-react';

interface AppearsInGroupProps {
  domain: string;
  examples: string[];
  className?: string;
}

export default function AppearsInGroup({ 
  domain, 
  examples, 
  className 
}: AppearsInGroupProps) {
  return (
    <div className={cn(
      "rounded-lg border border-blue-500/20 bg-blue-500/5 overflow-hidden",
      className
    )}>
      <div className="px-4 py-2.5 border-b border-blue-500/20 bg-blue-500/10">
        <div className="flex items-center gap-2">
          <Layers className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          <h4 className="text-xs font-semibold text-foreground">{domain}</h4>
        </div>
      </div>
      <div className="p-4">
        <ul className="flex flex-wrap gap-1.5">
          {examples.map((example, idx) => (
            <li
              key={idx}
              className="inline-flex items-center rounded border border-border bg-muted px-2 py-0.5 text-[10px] text-muted-foreground"
            >
              {example}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}