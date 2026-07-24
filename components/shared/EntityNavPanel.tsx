'use client';

import Link from 'next/link';
import { Book, Workflow, FileText, Brain, Bug, SplitSquareVertical, Lightbulb, Archive } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { EntityLink } from '@/lib/relationships';

const TYPE_ICONS: Record<string, React.ReactNode> = {
  package: <Archive className="w-3.5 h-3.5" />,
  cheatsheet: <Book className="w-3.5 h-3.5" />,
  workflow: <Workflow className="w-3.5 h-3.5" />,
  pattern: <FileText className="w-3.5 h-3.5" />,
  model: <Brain className="w-3.5 h-3.5" />,
  debug_guide: <Bug className="w-3.5 h-3.5" />,
  decision_guide: <SplitSquareVertical className="w-3.5 h-3.5" />,
  principle: <Lightbulb className="w-3.5 h-3.5" />,
};

interface EntityNavPanelProps {
  currentType: string;
  currentId: string;
  links: EntityLink[];
}

export default function EntityNavPanel({ currentType, links }: EntityNavPanelProps) {
  const validLinks = links.filter(l => l.href !== null);
  if (validLinks.length === 0) return null;

  return (
    <section className="border-t border-border pt-6 select-none">
      <h2 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">
        Cross-Entity Navigation
      </h2>
      <div className="flex flex-wrap gap-2">
        {validLinks.map(link => (
          <Link
            key={link.type}
            href={link.href!}
            className={cn(
              'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium transition-colors border',
              link.type === currentType
                ? 'bg-primary/10 text-primary border-primary/20 cursor-default pointer-events-none'
                : 'bg-muted/30 text-muted-foreground border-border hover:bg-muted hover:text-foreground hover:border-foreground/20'
            )}
            aria-label={`Open ${link.label}`}
          >
            {TYPE_ICONS[link.type]}
            <span>{link.label}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
