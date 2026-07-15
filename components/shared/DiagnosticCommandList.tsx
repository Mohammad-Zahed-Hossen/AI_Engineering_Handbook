'use client';

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
        <div key={idx} className="rounded-lg border border-border bg-card p-4 space-y-3">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Purpose</span>
            <p className="text-sm text-foreground mt-0.5">{cmd.purpose}</p>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Command</span>
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
      ))}
    </div>
  );
}