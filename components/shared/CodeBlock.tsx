'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

interface CodeBlockProps {
  code: string;
  language?: string;
}

export function CodeBlock({ code, language = 'python' }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="relative rounded-md bg-zinc-950 border border-zinc-800 my-2 select-text font-mono overflow-hidden">
      {/* Copy Trigger */}
      <button
        onClick={handleCopy}
        className={cn(
          "absolute top-2 right-2 hidden md:block text-[9px] font-sans font-semibold uppercase tracking-wider px-2 py-0.5 rounded border transition-none cursor-pointer select-none",
          copied 
            ? "text-emerald-400 border-emerald-500/30 bg-emerald-500/10" 
            : "text-zinc-400 border-zinc-700 bg-zinc-900 hover:text-zinc-200 hover:border-zinc-500"
        )}
      >
        {copied ? 'Copied' : 'Copy'}
      </button>

      {/* Syntax Code slot */}
      <pre className="overflow-x-auto p-4 pt-8 text-[11px] text-zinc-200 leading-relaxed scrollbar-thin">
        <code className={language ? `language-${language}` : ''}>{code}</code>
      </pre>
      <div
        className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-zinc-950 to-transparent md:hidden"
        aria-hidden="true"
      />
      <button
        onClick={handleCopy}
        className={cn(
          "md:hidden w-full border-t border-zinc-800 py-1.5 text-[10px]",
          "font-sans font-semibold uppercase tracking-wider transition-none",
          "select-none cursor-pointer",
          copied
            ? "text-emerald-400 bg-emerald-500/10"
            : "text-zinc-400 bg-zinc-900 hover:text-zinc-200"
        )}
      >
        {copied ? '✓ Copied' : 'Copy'}
      </button>
    </div>
  );
}
