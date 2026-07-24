'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import ContentTypeBadge from './ContentTypeBadge';
import { Workflow, Book, FileText, Brain, Bug, SplitSquareVertical, Lightbulb, Archive, Code, Database } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface KnowledgeGraphNode {
  id: string;
  type: string;
  name: string;
  href: string | null;
}

const TYPE_ICONS: Record<string, React.ReactNode> = {
  workflow: <Workflow className="w-3.5 h-3.5" />,
  cheatsheet: <Book className="w-3.5 h-3.5" />,
  pattern: <FileText className="w-3.5 h-3.5" />,
  model: <Brain className="w-3.5 h-3.5" />,
  debug_guide: <Bug className="w-3.5 h-3.5" />,
  decision_guide: <SplitSquareVertical className="w-3.5 h-3.5" />,
  principle: <Lightbulb className="w-3.5 h-3.5" />,
  package: <Archive className="w-3.5 h-3.5" />,
  package_task: <Code className="w-3.5 h-3.5" />,
  registry: <Database className="w-3.5 h-3.5" />,
};

const GROUP_ORDER = [
  'workflow',
  'cheatsheet',
  'pattern',
  'model',
  'debug_guide',
  'decision_guide',
  'principle',
  'package',
  'package_task',
  'registry',
];

interface KnowledgeGraphPanelClientProps {
  nodes: KnowledgeGraphNode[];
}

export default function KnowledgeGraphPanelClient({ nodes }: KnowledgeGraphPanelClientProps) {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const grouped = useMemo(() => {
    const map = new Map<string, KnowledgeGraphNode[]>();
    nodes.forEach(item => {
      if (!item.href) return; // Broken IDs -> hidden
      const list = map.get(item.type) || [];
      list.push(item);
      map.set(item.type, list);
    });

    const knownGroups = GROUP_ORDER.map(type => ({ type, items: map.get(type) || [] })).filter(g => g.items.length > 0);
    const extraTypes = Array.from(map.keys()).filter(t => !GROUP_ORDER.includes(t));
    const extraGroups = extraTypes.map(type => ({ type, items: map.get(type) || [] })).filter(g => g.items.length > 0);

    return [...knownGroups, ...extraGroups];
  }, [nodes]);

  const hoveredItem = useMemo(() => {
    if (!hoveredNode) return null;
    return nodes.find(n => `${n.type}:${n.id}` === hoveredNode) ?? null;
  }, [hoveredNode, nodes]);

  if (grouped.length === 0) return null;

  return (
    <section className="border-t border-border pt-6 select-none">
      <h2 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">
        Knowledge Graph
      </h2>
      <div className="flex flex-wrap gap-4">
        {grouped.map(group => (
          <div key={group.type} className="flex-1 min-w-[140px]">
            <h3 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 flex items-center gap-1">
              {TYPE_ICONS[group.type] || <FileText className="w-3.5 h-3.5" />}
              {group.type.replace('_', ' ')}s
            </h3>
            <div className="flex flex-wrap gap-1">
              {group.items.map(item => {
                const nodeId = `${item.type}:${item.id}`;
                const isHovered = hoveredNode === nodeId;

                if (!item.href) {
                  return null; // Broken IDs -> hidden
                }

                return (
                  <Link
                    key={nodeId}
                    href={item.href}
                    onMouseEnter={() => setHoveredNode(nodeId)}
                    onMouseLeave={() => setHoveredNode(null)}
                    onFocus={() => setHoveredNode(nodeId)}
                    onBlur={() => setHoveredNode(null)}
                    className={cn(
                      'inline-flex items-center gap-1 rounded border px-2 py-1 text-[10px] font-medium transition-colors',
                      isHovered
                        ? 'bg-primary/10 text-primary border-primary/20'
                        : 'bg-muted/40 text-foreground border-border hover:bg-muted hover:border-foreground/20'
                    )}
                    aria-describedby={isHovered ? `graph-preview-${nodeId}` : undefined}
                  >
                    <ContentTypeBadge type={item.type} className="px-1 py-0 text-[8px]" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Tooltip */}
      {hoveredNode && (
        <div
          id={`graph-preview-${hoveredNode}`}
          role="tooltip"
          className="fixed z-50 min-w-[180px] max-w-[260px] p-3 rounded-lg bg-popover border border-border shadow-lg text-left pointer-events-none"
          style={{
            top: 'auto',
            left: 'auto',
          }}
        >
          <div className="text-xs font-semibold text-foreground">
            {hoveredItem?.name || hoveredNode.split(':')[1]}
          </div>
          <div className="text-[10px] text-muted-foreground mt-0.5">Click to navigate</div>
        </div>
      )}
    </section>
  );
}
