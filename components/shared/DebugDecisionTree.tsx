'use client';

import { GitFork } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DebugDecisionTree {
  question?: string;
  yes?: DebugDecisionTree;
  no?: DebugDecisionTree;
  result?: string;
}

interface DebugDecisionTreeProps {
  tree?: DebugDecisionTree;
  className?: string;
}

function TreeNode({ node, level = 0 }: { node: DebugDecisionTree; level?: number }) {
  // Terminal node - only has result
  if (node.result && !node.question) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400">
          → {node.result}
        </span>
      </div>
    );
  }

  return (
    <div className={cn('space-y-2', level > 0 && 'ml-4 border-l border-border pl-4')}>
      <div className="flex items-start gap-2">
        <div className="flex-1 rounded-lg border border-border bg-card p-3">
          <p className="text-sm text-foreground">{node.question}</p>
        </div>
      </div>
      
      {node.result && (
        <div className="flex items-center gap-2 ml-6">
          <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400">
            → {node.result}
          </span>
        </div>
      )}
      
      {node.yes && (
        <div className="flex items-center gap-2 ml-6">
          <span className="text-[10px] font-mono font-semibold text-muted-foreground">Yes:</span>
          <TreeNode node={node.yes} level={level + 1} />
        </div>
      )}
      
      {node.no && (
        <div className="flex items-center gap-2 ml-6">
          <span className="text-[10px] font-mono font-semibold text-muted-foreground">No:</span>
          <TreeNode node={node.no} level={level + 1} />
        </div>
      )}
    </div>
  );
}

export default function DebugDecisionTree({ tree, className }: DebugDecisionTreeProps) {
  if (!tree) return null;

  return (
    <section id="decision-tree" className="space-y-3 scroll-mt-24">
      <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
        <GitFork className="w-5 h-5 text-blue-500" />
        Decision Tree
      </h2>
      <TreeNode node={tree} />
    </section>
  );
}