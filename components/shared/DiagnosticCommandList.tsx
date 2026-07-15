'use client';

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DiagnosticCommand {
  purpose: string;
  command: string;
  expected_output?: string;
  interpretation?: string;
}

interface DiagnosticCommandListProps {
  commands: DiagnosticCommand[];
  className?: string;
}

export default function DiagnosticCommandList({ commands, className }: DiagnosticCommandListProps) {
  if (!commands || commands.length === 0) return null;

  return (
    <div className={cn('space-y-3', className)}>
      {commands.map((cmd, idx) => (
        <DiagnosticCommandItem key={idx} cmd={cmd} />
      ))}
    </div>
  );
}

function DiagnosticCommandItem({ cmd }: { cmd: DiagnosticCommand }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(cmd.command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-lg border border-border bg-card p-4 space-y-3">
      <div>
        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Purpose</span>
        <p className="text-sm text-foreground mt-0.5">{cmd.purpose}</p>
      </div>
      <div>
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Command</span>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground transition-colors"
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
          <code className="text-foreground">{cmd.command}</code>
        </pre>
      </div>
      {cmd.expected_output && (
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Expected Output</span>
          <pre className="text-xs font-mono bg-muted/50 border border-border rounded p-2 mt-1 overflow-x-auto">
            <code className="text-foreground">{cmd.expected_output}</code>
          </pre>
        </div>
      )}
      {cmd.interpretation && (
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Interpretation</span>
          <p className="text-sm text-muted-foreground mt-0.5">{cmd.interpretation}</p>
        </div>
      )}
    </div>
  );
}
