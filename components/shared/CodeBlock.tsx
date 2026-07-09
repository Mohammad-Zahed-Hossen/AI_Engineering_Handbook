'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Check, Copy, Terminal, ChevronDown } from 'lucide-react';
import { codeToHtml } from 'shiki';

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
  showLineNumbers?: boolean;
}

export function CodeBlock({ code, language = 'python', filename, showLineNumbers = false }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const [highlightedCode, setHighlightedCode] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const MAX_COLLAPSED_LINES = 20;

  const lines = code.split('\n');
  const shouldCollapse = lines.length > MAX_COLLAPSED_LINES;
  const displayLines = shouldCollapse && !isExpanded ? lines.slice(0, MAX_COLLAPSED_LINES) : lines;
  const displayCode = displayLines.join('\n');

  useEffect(() => {
    codeToHtml(displayCode, {
      lang: language,
      theme: 'github-dark'
    }).then(html => {
      setHighlightedCode(html);
    }).catch(err => {
      console.error('Shiki highlighting error:', err);
      setHighlightedCode(`<pre><code>${escapeHtml(displayCode)}</code></pre>`);
    });
  }, [displayCode, language]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const lineCount = lines.length;
  const lineNumberWidth = lineCount >= 100 ? 3 : lineCount >= 10 ? 2 : 1;

  const escapeHtml = (text: string) => {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  };

  const languageLabel = language === 'bash' || language === 'sh' ? 'BASH' : language?.toUpperCase() || 'CODE';

  return (
    <div className="relative rounded-md bg-zinc-950 border border-zinc-800 my-2 font-mono">
      {/* Header bar: filename or language */}
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-zinc-800 bg-zinc-900/50 select-none">
        <div className="flex items-center gap-1.5 text-[10px] text-zinc-500">
          <Terminal className="w-3 h-3" />
          <span className="font-sans font-medium uppercase tracking-wider">
            {filename || languageLabel}
          </span>
        </div>
        {/* Desktop copy button in header */}
        <button
          onClick={handleCopy}
          className={cn(
            "hidden md:flex items-center gap-1 text-[9px] font-sans font-semibold uppercase tracking-wider px-2 py-0.5 rounded border transition-none cursor-pointer select-none",
            copied
              ? "text-emerald-400 border-emerald-500/30 bg-emerald-500/10"
              : "text-zinc-400 border-zinc-700 bg-zinc-900 hover:text-zinc-200 hover:border-zinc-500"
          )}
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

      {/* Code body */}
      <div className={cn(
        "relative",
        shouldCollapse && !isExpanded && "max-h-[300px] overflow-hidden"
      )}>
        <div 
          className={cn(
            "overflow-x-auto text-[11px] leading-relaxed scrollbar-thin",
            showLineNumbers ? "pl-2 pr-4 py-3" : "p-4"
          )}
          dangerouslySetInnerHTML={{ __html: highlightedCode || `<pre><code>${escapeHtml(displayCode)}</code></pre>` }}
        />
        {shouldCollapse && !isExpanded && (
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-zinc-950 to-transparent pointer-events-none" />
        )}
      </div>

      {/* Expand button for collapsed code */}
      {shouldCollapse && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full py-2 text-[10px] font-sans font-semibold uppercase tracking-wider text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer select-none border-t border-zinc-800 bg-zinc-900/50"
        >
          {isExpanded ? (
            <>
              <ChevronDown className="w-3 h-3 inline mr-1 rotate-180" />
              Show Less
            </>
          ) : (
            <>
              <ChevronDown className="w-3 h-3 inline mr-1" />
              Show {lines.length - MAX_COLLAPSED_LINES} More Lines
            </>
          )}
        </button>
      )}

      {/* Mobile copy button at bottom */}
      <button
        onClick={handleCopy}
        className={cn(
          "md:hidden w-full border-t border-zinc-800 py-2 text-[10px] flex items-center justify-center gap-1.5",
          "font-sans font-semibold uppercase tracking-wider transition-colors",
          "select-none cursor-pointer",
          copied
            ? "text-emerald-400 bg-emerald-500/10"
            : "text-zinc-400 bg-zinc-900 hover:text-zinc-200"
        )}
      >
        {copied ? (
          <>
            <Check className="w-3.5 h-3.5" />
            ✓ Copied
          </>
        ) : (
          <>
            <Copy className="w-3.5 h-3.5" />
            Copy
          </>
        )}
      </button>
    </div>
  );
}
