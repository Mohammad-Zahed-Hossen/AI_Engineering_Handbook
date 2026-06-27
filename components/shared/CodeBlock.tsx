'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Check, Copy, Terminal } from 'lucide-react';

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
  showLineNumbers?: boolean;
}

export function CodeBlock({ code, language = 'python', filename, showLineNumbers = false }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const lines = code.split('\n');
  const lineCount = lines.length;
  const lineNumberWidth = lineCount >= 100 ? 3 : lineCount >= 10 ? 2 : 1;

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
      <pre className={cn(
        "overflow-x-auto text-[11px] text-zinc-200 leading-relaxed scrollbar-thin",
        showLineNumbers ? "pl-2 pr-4 py-3" : "p-4"
      )}>
        <code className={language ? `language-${language}` : ''}>
          {showLineNumbers ? (
            <table className="border-collapse">
              <tbody>
                {lines.map((line, i) => (
                  <tr key={i}>
                    <td className="text-right pr-3 select-none text-zinc-600 text-[10px]" style={{ minWidth: `${lineNumberWidth + 1}ch` }}>
                      {i + 1}
                    </td>
                    <td className="whitespace-pre">
                      {line || ' '}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            code
          )}
        </code>
      </pre>

      {/* Overflow fade on mobile */}
      <div
        className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-zinc-950 to-transparent md:hidden z-10"
        aria-hidden="true"
      />

      {/* Mobile copy button at bottom */}
      <button
        onClick={handleCopy}
        className={cn(
          "md:hidden w-full border-t border-zinc-800 py-2 text-[10px] flex items-center justify-center gap-1.5",
          "font-sans font-semibold uppercase tracking-wider transition-none",
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
