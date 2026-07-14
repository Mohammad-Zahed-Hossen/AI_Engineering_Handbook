'use client';

import { useState, useRef, useLayoutEffect } from 'react';
import { cn } from '@/lib/utils';
import { Check, Copy, Terminal, ChevronDown, WrapText, Sun, Moon, Code2, FileCode, Cpu, Database, Globe } from 'lucide-react';

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
  // null means use default CSS wrapping behavior: wrap on mobile, scroll on desktop.
  // true/false represents explicit manual toggle overrides by the user.
  const [wrapped, setWrapped] = useState<boolean | null>(null);
  const [isDarkTheme, setIsDarkTheme] = useState(true);
  const toggleButtonRef = useRef<HTMLButtonElement>(null);

  // Get theme from localStorage or system preference
  const [isMounted, setIsMounted] = useState(false);
  useLayoutEffect(() => {
    setIsMounted(true);
  }, []);

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
    ? "bg-zinc-950 border-zinc-800"
    : "bg-white border-zinc-200";
  const headerClasses = isDarkTheme
    ? "border-zinc-800 bg-zinc-900/50 text-zinc-500"
    : "border-zinc-200 bg-zinc-50 text-zinc-600";
  const buttonBaseClasses = isDarkTheme
    ? "text-zinc-400 bg-zinc-900 hover:text-zinc-200"
    : "text-zinc-500 bg-white hover:text-zinc-700";
  const codeContainerClasses = isDarkTheme
    ? "from-zinc-950 to-transparent"
    : "from-white to-transparent";

  return (
    <div className={cn("relative rounded-md border my-2 font-mono", themeClasses)}>
      {/* Header bar: filename or language */}
      <div className={cn("flex items-center justify-between px-3 py-1.5 border-b select-none", headerClasses)}>
        <div className="flex items-center gap-1.5 text-[10px]">
          {getLanguageIcon(language)}
          <span className="font-sans font-medium uppercase tracking-wider">
            {filename || languageLabel}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          {/* Line count badge */}
          <span className="text-[9px] font-mono text-muted-foreground bg-muted/50 px-1.5 py-0.5 rounded">
            {linesCount} lines
          </span>
          {/* Theme toggle button - now visible on mobile */}
          <button
            onClick={() => setIsDarkTheme(!isDarkTheme)}
            aria-label="Toggle theme"
            className={cn(
              "flex items-center justify-center w-6 h-6 rounded transition-all duration-200 cursor-pointer select-none",
              isDarkTheme
                ? "text-zinc-400 bg-zinc-900 hover:text-zinc-200"
                : "text-zinc-500 bg-white hover:text-zinc-700"
            )}
          >
            {isDarkTheme ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          </button>
          {/* Wrap toggle button - now visible on mobile */}
          <button
            onClick={() => setWrapped(prev => prev === true ? false : true)}
            aria-label="Toggle line wrap"
            aria-pressed={wrapped === true}
            className={cn(
              "flex items-center justify-center w-6 h-6 rounded transition-all duration-200 cursor-pointer select-none",
              wrapped === true
                ? "text-emerald-400 bg-emerald-500/10"
                : buttonBaseClasses
            )}
          >
            <WrapText className="w-3.5 h-3.5" />
          </button>
          {/* Copy button - now visible on mobile */}
          <button
            onClick={handleCopy}
            className={cn(
              "flex items-center justify-center w-6 h-6 rounded transition-all duration-200 cursor-pointer select-none",
              copied
                ? "text-emerald-400 bg-emerald-500/10"
                : isDarkTheme
                  ? "text-zinc-400 bg-zinc-900 hover:text-zinc-200"
                  : "text-zinc-500 bg-white hover:text-zinc-700"
            )}
            aria-label="Copy code"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Code body */}
      <div className={cn("relative", shouldCollapse && !isExpanded && "max-h-[200px] overflow-hidden")}>
        <div 
          className={cn(
            "text-[11px] leading-relaxed scrollbar-thin select-text",
            wrapped === null
              ? "max-md:whitespace-pre-wrap max-md:break-words md:overflow-x-auto md:whitespace-pre md:break-normal"
              : wrapped
                ? "whitespace-pre-wrap break-words"
                : "overflow-x-auto whitespace-pre break-normal",
            showLineNumbers ? "pl-2 pr-4 py-3 show-line-numbers" : "p-4"
          )}
          dangerouslySetInnerHTML={{ __html: displayHtml }}
        />
        {/* Vertical bottom fade for collapsed state */}
        {shouldCollapse && !isExpanded && (
          <div className={cn("absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t pointer-events-none", codeContainerClasses)} />
        )}
        {/* Horizontal-scroll fade on mobile - only when not wrapped */}
        {wrapped === false && (
          <div
            className={cn("pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l md:hidden z-10", codeContainerClasses)}
            aria-hidden="true"
          />
        )}
      </div>

      {/* Expand button for collapsed code */}
      {shouldCollapse && (
        <button
          ref={toggleButtonRef}
          onClick={() => setIsExpanded(!isExpanded)}
          aria-expanded={isExpanded}
          className={cn(
            "w-full py-2 text-[10px] font-sans font-semibold uppercase tracking-wider transition-colors cursor-pointer select-none border-t",
            isDarkTheme
              ? "text-zinc-400 hover:text-zinc-200 border-zinc-800 bg-zinc-900/50"
              : "text-zinc-500 hover:text-zinc-700 border-zinc-200 bg-zinc-50"
          )}
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
    </div>
  );
}
