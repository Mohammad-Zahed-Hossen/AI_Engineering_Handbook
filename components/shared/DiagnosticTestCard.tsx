'use client';

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DiagnosticTest {
  purpose: string;
  test: string;
  command?: string;
  expected_result?: string;
  interpretation?: string;
  next_action?: string;
}

interface DiagnosticTestCardProps {
  test: DiagnosticTest;
  className?: string;
}

export default function DiagnosticTestCard({ test, className }: DiagnosticTestCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (test.command) {
      navigator.clipboard.writeText(test.command);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className={cn('rounded-lg border border-border bg-card overflow-hidden', className)}>
      {/* Purpose - Most important, always visible */}
      <div className="p-3 border-b border-border bg-muted/20">
        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          Purpose
        </span>
        <p className="text-sm text-foreground mt-0.5 font-medium">{test.purpose}</p>
      </div>

      {/* Test Description */}
      <div className="p-3 border-b border-border/50">
        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          Test
        </span>
        <p className="text-sm text-foreground mt-0.5">{test.test}</p>
      </div>

      {/* Command - with copy button */}
      {test.command && (
        <div className="p-3 border-b border-border/50">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Command
            </span>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground transition-colors touch-target-inline"
              aria-label="Copy command to clipboard"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  Copy
                </>
              )}
            </button>
          </div>
          <pre className="text-xs font-mono bg-muted/50 border border-border rounded p-2 mt-1 overflow-x-auto">
            <code className="text-foreground">{test.command}</code>
          </pre>
        </div>
      )}

      {/* Expected Result */}
      {test.expected_result && (
        <div className="p-3 border-b border-border/50">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Expected Result
          </span>
          <p className="text-sm text-muted-foreground mt-0.5">{test.expected_result}</p>
        </div>
      )}

      {/* Interpretation */}
      {test.interpretation && (
        <div className="p-3 border-b border-border/50">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Interpretation
          </span>
          <p className="text-sm text-muted-foreground mt-0.5">{test.interpretation}</p>
        </div>
      )}

      {/* Next Action - Highlighted */}
      {test.next_action && (
        <div className="p-3 bg-blue-500/5 border-t border-blue-500/20">
          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400">
            Next Action
          </span>
          <p className="text-sm text-foreground mt-0.5 font-medium">{test.next_action}</p>
        </div>
      )}
    </div>
  );
}
