'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { ExternalLink, Check, X, GitFork } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DebugDecisionTree {
  question?: string;
  yes?: DebugDecisionTree;
  no?: DebugDecisionTree;
  result?: string;
  solution_index?: number;
}

interface DecisionWizardProps {
  tree?: DebugDecisionTree;
}

// Find the next node based on answer
function getNextNode(
  currentNode: DebugDecisionTree,
  answer: 'yes' | 'no'
): DebugDecisionTree | null {
  if (answer === 'yes' && currentNode.yes) {
    return currentNode.yes;
  }
  if (answer === 'no' && currentNode.no) {
    return currentNode.no;
  }
  return null;
}

// Check if node is terminal (has result)
function isTerminal(node: DebugDecisionTree): boolean {
  return !!node.result && !node.question;
}

export default function DecisionWizard({ tree }: DecisionWizardProps) {
  // Use useMemo to derive initial state - this avoids setState in effects
  const initialNode = useMemo(() => tree || null, [tree]);
  
  const [currentNode, setCurrentNode] = useState<DebugDecisionTree | null>(initialNode);
  const [path, setPath] = useState<number[]>([]);
  const [history, setHistory] = useState<Array<{ node: DebugDecisionTree; path: number[] }>>([]);
  const contentRef = useRef<HTMLDivElement>(null);

  // Handle hash deep-linking
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash === 'decision-tree') {
        // Expand the wizard when hash matches
        const element = contentRef.current;
        if (element) {
          const beforeMatchHandler = () => {
            // Trigger any necessary expansion
          };
          element.addEventListener('beforematch', beforeMatchHandler as unknown as EventListener);
        }
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleAnswer = useCallback((answer: 'yes' | 'no') => {
    if (!currentNode) return;

    const nextNode = getNextNode(currentNode, answer);
    
    if (nextNode) {
      setHistory(prev => [...prev, { node: currentNode, path: [...path] }]);
      setPath(prev => [...prev, answer === 'yes' ? 0 : 1]);
      setCurrentNode(nextNode);
    }
  }, [currentNode, path]);

  const handleReset = useCallback(() => {
    setCurrentNode(initialNode);
    setPath([]);
    setHistory([]);
  }, [initialNode]);

  const handleBack = useCallback(() => {
    if (history.length === 0) return;
    
    const prev = history[history.length - 1];
    setHistory(h => h.slice(0, -1));
    setPath(p => p.slice(0, -1));
    setCurrentNode(prev.node);
  }, [history]);

  // Get current question or result
  const currentQuestion = currentNode?.question;
  const currentResult = currentNode?.result;
  const isTerminalNode = currentNode ? isTerminal(currentNode) : false;
  const canGoBack = history.length > 0;

  // Return null if no tree is provided
  if (!tree) return null;

  return (
    <section id="decision-tree" className="space-y-3 scroll-mt-24">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <GitFork className="w-5 h-5 text-blue-500" />
          Decision Tree
        </h2>
        {canGoBack && (
          <button
            onClick={handleBack}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Back
          </button>
        )}
      </div>

      <div ref={contentRef} className="space-y-3">
        {/* Breadcrumb Path */}
        {path.length > 0 && (
          <div className="flex items-center gap-1 text-[10px] font-mono text-muted-foreground overflow-x-auto pb-1">
            <span>Start</span>
            {path.map((answer, idx) => (
              <div key={idx} className="flex items-center gap-1">
                <span className={cn(
                  answer === 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
                )}>
                  {answer === 0 ? 'Yes' : 'No'}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Question Card */}
        {currentQuestion && !isTerminalNode && (
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-sm text-foreground mb-3">{currentQuestion}</p>
            <div className="flex gap-2">
              <button
                onClick={() => handleAnswer('yes')}
                className={cn(
                  'flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded text-xs font-medium',
                  'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/20 transition-colors touch-target'
                )}
              >
                <Check className="w-3.5 h-3.5" />
                Yes
              </button>
              <button
                onClick={() => handleAnswer('no')}
                className={cn(
                  'flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded text-xs font-medium',
                  'bg-red-500/10 text-red-700 dark:text-red-400 hover:bg-red-500/20 transition-colors touch-target'
                )}
              >
                <X className="w-3.5 h-3.5" />
                No
              </button>
            </div>
          </div>
        )}

        {/* Result Card */}
        {isTerminalNode && currentResult && (
          <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-4">
            <div className="flex items-start gap-2">
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{currentResult}</p>
                {currentNode?.solution_index !== undefined && (
                  <a
                    href={`#solution-${currentNode.solution_index}`}
                    className="mt-2 inline-flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:underline"
                    aria-label={`Jump to solution ${currentNode.solution_index + 1}`}
                  >
                    <ExternalLink className="w-3 h-3" />
                    View Solution
                  </a>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Reset Button */}
        {isTerminalNode && (
          <button
            onClick={handleReset}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Start Over
          </button>
        )}
      </div>
    </section>
  );
}