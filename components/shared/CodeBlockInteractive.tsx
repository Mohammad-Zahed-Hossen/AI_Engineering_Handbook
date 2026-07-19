'use client';

import { useState, useRef, useLayoutEffect } from 'react';
import { cn } from '@/lib/utils';
import { Check, Copy, Terminal, ChevronDown, Sun, Moon, Code2, FileCode, Database, Globe } from 'lucide-react';

interface CodeBlockInteractiveProps {
  code: string;
  language: string;
  filename?: string;
  showLineNumbers: boolean;
  fullHighlightedDark: string;
  fullHighlightedLight: string;
  collapsedHighlightedDark: string;
  collapsedHighlightedLight: string;
  shouldCollapse: boolean;
  linesCount: number;
  maxCollapsedLines: number;
}

export function CodeBlockInteractive({
  code,
  language,
  filename,
  showLineNumbers,
  fullHighlightedDark,
  fullHighlightedLight,
  collapsedHighlightedDark,
  collapsedHighlightedLight,
  shouldCollapse,
  linesCount,
  maxCollapsedLines,
}: CodeBlockInteractiveProps) {
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(true);
  const toggleButtonRef = useRef<HTMLButtonElement>(null);

  // Calculate max height based on maxCollapsedLines (approx 1.5rem per line)
  const maxCollapsedHeight = `${maxCollapsedLines * 1.5 + 0.5}rem`;

  // Language icon mapping
  const getLanguageIcon = (lang: string) => {
    const normalized = lang.toLowerCase();
    switch (normalized) {
      case 'python':
      case 'py':
        return <Code2 className="w-3.5 h-3.5" />;
      case 'bash':
      case 'sh':
        return <Terminal className="w-3.5 h-3.5" />;
      case 'typescript':
      case 'ts':
      case 'javascript':
      case 'js':
        return <FileCode className="w-3.5 h-3.5" />;
      case 'sql':
        return <Database className="w-3.5 h-3.5" />;
      case 'html':
      case 'css':
        return <Globe className="w-3.5 h-3.5" />;
      default:
        return <Code2 className="w-3.5 h-3.5" />;
    }
  };

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
  const displayHtml = shouldCollapse && !isExpanded 
    ? (isDarkTheme ? collapsedHighlightedDark : collapsedHighlightedLight)
    : (isDarkTheme ? fullHighlightedDark : fullHighlightedLight);

  const themeClasses = isDarkTheme
    ? "bg-zinc-950/95 border-zinc-800/80 backdrop-blur-sm"
    : "bg-white border-zinc-200";
  const headerClasses = isDarkTheme
    ? "border-zinc-800/60 bg-zinc-900/40 text-zinc-400"
    : "border-zinc-200 bg-zinc-50/80 text-zinc-500";
  const buttonBaseClasses = isDarkTheme
    ? "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 active:bg-zinc-800/70"
    : "text-zinc-500 hover:text-zinc-700 hover:bg-zinc-100 active:bg-zinc-200";
  const codeContainerClasses = isDarkTheme
    ? "from-zinc-950 via-zinc-950/95 to-transparent"
    : "from-white via-white to-transparent";

  return (
    <div className={cn("relative rounded-lg border my-3 font-mono shadow-sm overflow-hidden", themeClasses)}>
      {/* Header bar: filename or language */}
      <div className={cn("flex items-center justify-between px-3 py-2 border-b select-none", headerClasses)}>
        <div className="flex items-center gap-2 min-w-0">
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {getLanguageIcon(language)}
            <span className="font-sans font-semibold uppercase tracking-wide text-[10px] sm:text-[11px]">
              {filename || languageLabel}
            </span>
          </div>
          {/* Line count badge - hidden on very small screens, shown on larger mobile */}
          <span className="hidden sm:inline-flex text-[9px] font-mono text-muted-foreground bg-muted/50 px-1.5 py-0.5 rounded flex-shrink-0">
            {linesCount} lines
          </span>
        </div>
        <div className="flex items-center gap-1">
           {/* Theme toggle button */}
           <button
             onClick={() => setIsDarkTheme(!isDarkTheme)}
             aria-label="Toggle theme"
             className={cn(
               "flex items-center justify-center w-11 h-11 rounded-lg transition-all duration-150 cursor-pointer select-none",
               buttonBaseClasses
             )}
           >
             {isDarkTheme ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
           </button>
           {/* Copy button */}
           <button
             onClick={handleCopy}
             className={cn(
               "flex items-center justify-center w-11 h-11 rounded-lg transition-all duration-150 cursor-pointer select-none",
               copied
                 ? "text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20"
                 : buttonBaseClasses
             )}
             aria-label="Copy code"
           >
             {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
           </button>
        </div>
      </div>

      {/* Code body */}
      <div className={cn("relative", shouldCollapse && !isExpanded && `max-h-[${maxCollapsedHeight}] overflow-hidden`)}>
        <div 
          className={cn(
              "text-[13px] sm:text-[14px] leading-relaxed select-text overflow-x-auto whitespace-pre",
              "scrollbar-thin scrollbar-thumb-zinc-400/30 hover:scrollbar-thumb-zinc-400/50 scrollbar-track-transparent",
              "scrollbar-w-1.5 scrollbar-h-1.5",
              showLineNumbers ? "pl-3 pr-4 py-3 show-line-numbers" : "px-4 py-3"
          )}
          dangerouslySetInnerHTML={{ __html: displayHtml }}
        />
        {/* Vertical bottom fade for collapsed state */}
        {shouldCollapse && !isExpanded && (
          <div className={cn("absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t pointer-events-none", codeContainerClasses)} />
        )}
      </div>

      {/* Expand button for collapsed code */}
      {shouldCollapse && (
        <button
          ref={toggleButtonRef}
          onClick={() => setIsExpanded(!isExpanded)}
          aria-expanded={isExpanded}
          className={cn(
            "w-full py-3 px-4 text-[11px] font-sans font-medium uppercase tracking-wide transition-all duration-200 cursor-pointer select-none border-t flex items-center justify-center gap-2",
            isDarkTheme
              ? "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/30 border-zinc-800/60 bg-zinc-900/30"
              : "text-zinc-500 hover:text-zinc-700 hover:bg-zinc-100 border-zinc-200 bg-zinc-50/80"
          )}
        >
          {isExpanded ? (
            <>
              <ChevronDown className="w-4 h-4 transition-transform duration-200 rotate-180" />
              Show Less
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4 transition-transform duration-200" />
              Show More
            </>
          )}
        </button>
      )}
    </div>
  );
}