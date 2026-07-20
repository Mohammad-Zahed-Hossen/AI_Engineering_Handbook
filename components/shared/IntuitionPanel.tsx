import { cn } from '@/lib/utils';
import { Lightbulb } from 'lucide-react';
import { ProseClient } from './Prose';

interface IntuitionPanelProps {
  content: string;
  className?: string;
}

// IntuitionPanel replaces Mermaid-based MentalModelDisplay
// It presents conceptual understanding through layered explanation
// rather than diagrammatic representation
export default function IntuitionPanel({
  content,
  className,
}: IntuitionPanelProps) {
  return (
    <div
      className={cn(
        'rounded-lg border-2 border-purple-500/30 bg-gradient-to-br from-purple-500/10 to-card overflow-hidden',
        className
      )}
    >
      <div className="px-4 py-3 border-b border-purple-500/20 bg-purple-500/10">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          <h3 className="text-xs font-semibold text-foreground">Mental Model</h3>
        </div>
      </div>
      <div className="p-4">
        <div className="text-xs text-muted-foreground leading-relaxed">
          <ProseClient content={content} />
        </div>
      </div>
    </div>
  );
}