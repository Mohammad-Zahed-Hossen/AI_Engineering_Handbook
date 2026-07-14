import { GitBranch } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface RelatedPatternGraphProps {
  patternId: string;
  relatedPatterns: Array<{ id: string; type: string; relationship_type?: string }>;
  className?: string;
}

export default function RelatedPatternGraph({ patternId, relatedPatterns, className }: RelatedPatternGraphProps) {
  // Filter only pattern-related items
  const patternRelations = relatedPatterns.filter(r => r.type === 'pattern');

  if (patternRelations.length === 0) {
    return null;
  }

  return (
    <div className={cn('rounded-lg border border-border bg-card p-4', className)}>
      <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-4 flex items-center gap-1.5">
        <GitBranch className="w-3.5 h-3.5" />
        Related Patterns
      </h3>
      
      <div className="space-y-2">
        {/* Root Pattern */}
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-foreground" />
          <span className="text-xs font-medium text-foreground">{patternId.replace(/-/g, ' ')}</span>
        </div>

        {/* Branch Lines */}
        <div className="ml-1 space-y-1">
          {patternRelations.map((relation, idx) => (
            <div key={relation.id} className="flex items-center gap-2">
              {/* Branch connector */}
              <div className="flex items-center">
                <div className="w-3 h-px bg-border" />
                <div className="w-2 h-2 rounded-full bg-muted-foreground" />
              </div>
              
              {/* Pattern link */}
              <Link
                href={`/patterns/${relation.id}`}
                className="text-xs text-muted-foreground hover:text-foreground hover:underline transition-colors"
              >
                {relation.id.replace(/-/g, ' ')}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
