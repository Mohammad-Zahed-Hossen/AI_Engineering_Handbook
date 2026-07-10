'use client';

import { useState, useRef, useLayoutEffect } from 'react';
import { cn } from '@/lib/utils';
import { Check, Copy, Terminal, ChevronDown } from 'lucide-react';

interface CodeBlockInteractiveProps {
  code: string;
  language: string;
  filename?: string;
  showLineNumbers: boolean;
  fullHighlighted: string;
  collapsedHighlighted: string;
  shouldCollapse: boolean;
  linesCount: number;
  maxCollapsedLines: number;
}

export function CodeBlockInteractive({
  code,
  language,
  filename,
  showLineNumbers,
  fullHighlighted,
  collapsedHighlighted,
  shouldCollapse,
  linesCount,
  maxCollapsedLines,
}: CodeBlockInteractiveProps) {
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const toggleButtonRef = useRef<HTMLButtonElement>(null);

  // Scroll position compensation to prevent jump on collapse
  useLayoutEffect(() => {
    if (!toggleButtonRef.current) return;
    
    const button = toggleButtonRef.current;
    const beforeTop = button.getBoundingClientRect().top;
    
    return () => {
      const afterTop = button.getBoundingClientRect().top;
      const delta = afterTop - beforeTop;
      if (delta !== 0) {
        window.scrollBy({ top: delta, behavior: 'instant' });
      }
    };
  }, [isExpanded]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const languageLabel = language === 'bash' || language === 'sh' ? 'BASH' : language?.toUpperCase() || 'CODE';
  const displayHtml = shouldCollapse && !isExpanded ? collapsedHighlighted : fullHighlighted;

  return (
    <div className="relative rounded-md bg-zinc-950 border border-zinc-800 my-2 font-mono">
      {/* Header bar: filename or language */}
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-zinc-800 bg-zinc-900/50 select-none">
        <div className="flex items-center gap-1.5 text-[10px] text-zinc-500">
          <Terminal className="w-3.5 h-3.5" />
          <span className="font-sans font-medium uppercase tracking-wider">
            {filename || languageLabel}
          </span>
        </div>
        {/* Desktop copy button in header - smooth transitions */}
        <button
          onClick={handleCopy}
          className={cn(
            "hidden md:flex items-center gap-1 text-[9px] font-sans font-semibold uppercase tracking-wider px-2 py-0.5 rounded border transition-all duration-200 cursor-pointer select-none",
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
      <div className="relative">
        <div 
          className={cn(
            "overflow-x-auto text-[11px] leading-relaxed scrollbar-thin select-text",
            showLineNumbers ? "pl-2 pr-4 py-3 show-line-numbers" : "p-4"
          )}
          dangerouslySetInnerHTML={{ __html: displayHtml }}
        />
        {/* Vertical bottom fade for collapsed state */}
        {shouldCollapse && !isExpanded && (
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-zinc-950 to-transparent pointer-events-none" />
        )}
        {/* Horizontal-scroll fade on mobile */}
        <div
          className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-zinc-950 to-transparent md:hidden z-10"
          aria-hidden="true"
        />
      </div>

      {/* Expand button for collapsed code */}
      {shouldCollapse && (
        <button
          ref={toggleButtonRef}
          onClick={() => setIsExpanded(!isExpanded)}
          aria-expanded={isExpanded}
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
              Show {linesCount - maxCollapsedLines} More Lines
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
