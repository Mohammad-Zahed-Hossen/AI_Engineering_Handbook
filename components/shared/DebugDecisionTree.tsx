'use client';

import { GitFork, ArrowRight, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DebugDecisionTree {
  question?: string;
  yes?: DebugDecisionTree;
  no?: DebugDecisionTree;
  result?: string;
  solution_index?: number;
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
        <ArrowRight className="w-3 h-3 text-emerald-500" />
        <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400">
          {node.result}
        </span>
        {node.solution_index !== undefined && (
          <a
            href={`#solution-${node.solution_index}`}
            className="ml-2 text-[10px] text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-0.5"
            aria-label={`Jump to solution ${node.solution_index + 1}`}
          >
            <ExternalLink className="w-3 h-3" />
            Solution
          </a>
        )}
      </div>
    );
  }

  return (
    <div className={cn('space-y-2', level > 0 && 'ml-4 border-l-2 border-dashed border-border pl-4')}>
      <div className="flex items-start gap-2">
        <div className="flex-1 rounded-lg border border-border bg-card p-3">
          <p className="text-sm text-foreground">{node.question}</p>
        </div>
      </div>
      
      {node.result && (
        <div className="flex items-center gap-2 ml-6">
          <ArrowRight className="w-3 h-3 text-emerald-500" />
          <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400">
            {node.result}
          </span>
          {node.solution_index !== undefined && (
            <a
              href={`#solution-${node.solution_index}`}
              className="ml-2 text-[10px] text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-0.5"
              aria-label={`Jump to solution ${node.solution_index + 1}`}
            >
              <ExternalLink className="w-3 h-3" />
              Solution
            </a>
          )}
        </div>
      )}
      
      {node.yes && (
        <div className="flex items-start gap-2 ml-6">
          <span className="text-[10px] font-mono font-semibold text-emerald-700 dark:text-emerald-400 shrink-0">Yes:</span>
          <TreeNode node={node.yes} level={level + 1} />
        </div>
      )}
      
      {node.no && (
        <div className="flex items-start gap-2 ml-6">
          <span className="text-[10px] font-mono font-semibold text-red-700 dark:text-red-400 shrink-0">No:</span>
          <TreeNode node={node.no} level={level + 1} />
        </div>
      )}
    </div>
  );
}

export default function DebugDecisionTree({ tree }: DebugDecisionTreeProps) {
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
