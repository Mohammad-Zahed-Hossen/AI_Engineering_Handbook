'use client';

import { Copy, Check, Package, Terminal, Code2, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatRelativeTime } from '@/lib/format-date';
import { useState } from 'react';

interface PackageSnapshotProps {
  name: string;
  version?: string;
  install?: string;
  importAs?: string;
  language?: string;
  taskCount: number;
  updatedAt?: string;
}

export default function PackageSnapshot({
  name,
  version,
  install,
  importAs,
  language = 'python',
  taskCount,
  updatedAt,
}: PackageSnapshotProps) {
  const [copiedInstall, setCopiedInstall] = useState(false);
  const [copiedImport, setCopiedImport] = useState(false);

  const handleCopyInstall = async () => {
    if (!install) return;
    try {
      await navigator.clipboard.writeText(install);
      setCopiedInstall(true);
      setTimeout(() => setCopiedInstall(false), 2000);
    } catch (err) {
      console.error('Failed to copy install command:', err);
    }
  };

  const handleCopyImport = async () => {
    if (!importAs) return;
    try {
      await navigator.clipboard.writeText(importAs);
      setCopiedImport(true);
      setTimeout(() => setCopiedImport(false), 2000);
    } catch (err) {
      console.error('Failed to copy import statement:', err);
    }
  };

  const getLanguageLabel = (lang: string) => {
    const labels: Record<string, string> = {
      python: 'Python',
      typescript: 'TypeScript',
      javascript: 'JavaScript',
      r: 'R',
      julia: 'Julia',
    };
    return labels[lang.toLowerCase()] || lang;
  };

  return (
    <div className="rounded-lg border border-border bg-card p-4 space-y-3">
      {/* Header row: Package identity */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1.5">
          <Package className="w-4 h-4 text-primary" />
          <span className="text-sm font-semibold text-foreground">{name}</span>
        </div>
        {version && (
          <span className="text-[10px] font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
            v{version}
          </span>
        )}
        <span className="text-[10px] font-mono text-muted-foreground bg-muted/50 px-1.5 py-0.5 rounded">
          {getLanguageLabel(language)}
        </span>
        <span className="text-[10px] font-mono text-muted-foreground bg-muted/50 px-1.5 py-0.5 rounded">
          {taskCount} {taskCount === 1 ? 'task' : 'tasks'}
        </span>
        {updatedAt && (
          <span className="text-[10px] font-mono text-muted-foreground flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {formatRelativeTime(updatedAt)}
          </span>
        )}
      </div>

      {/* Install command */}
      {install && (
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            <Terminal className="w-3.5 h-3.5" />
            Install
          </div>
          <code className="flex-1 text-[11px] font-mono bg-muted/50 px-2 py-1 rounded text-foreground truncate">
            {install}
          </code>
          <button
            onClick={handleCopyInstall}
            className={cn(
              "flex items-center justify-center h-8 w-8 rounded-lg transition-colors touch-target",
              copiedInstall
                ? "text-emerald-600 bg-emerald-500/10"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
            aria-label="Copy install command"
          >
            {copiedInstall ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      )}

      {/* Import statement */}
      {importAs && (
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            <Code2 className="w-3.5 h-3.5" />
            Import
          </div>
          <code className="flex-1 text-[11px] font-mono bg-muted/50 px-2 py-1 rounded text-foreground truncate">
            {importAs}
          </code>
          <button
            onClick={handleCopyImport}
            className={cn(
              "flex items-center justify-center h-8 w-8 rounded-lg transition-colors touch-target",
              copiedImport
                ? "text-emerald-600 bg-emerald-500/10"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
            aria-label="Copy import statement"
          >
            {copiedImport ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      )}
    </div>
  );
}