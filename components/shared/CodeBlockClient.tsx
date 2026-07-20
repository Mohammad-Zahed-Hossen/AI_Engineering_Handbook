'use client';

import { useEffect, useState } from 'react';
import { CodeBlockInteractive } from './CodeBlockInteractive';
import { highlightCodeSnippet } from './CodeBlock';

interface CodeBlockClientProps {
  code: string;
  language?: string;
  filename?: string;
  showLineNumbers?: boolean;
}

export function CodeBlockClient({
  code,
  language = 'python',
  filename,
  showLineNumbers = false
}: CodeBlockClientProps) {
  const [highlightedData, setHighlightedData] = useState<{
    fullHighlightedDark: string;
    fullHighlightedLight: string;
    collapsedHighlightedDark: string;
    collapsedHighlightedLight: string;
    shouldCollapse: boolean;
    linesCount: number;
    maxCollapsedLines: number;
  } | null>(null);

  useEffect(() => {
    highlightCodeSnippet(code, language).then(setHighlightedData);
  }, [code, language]);

  if (!highlightedData) {
    return (
      <div className="relative rounded-lg border my-2 font-mono shadow-sm overflow-hidden bg-zinc-950/95 border-zinc-800/80">
        <div className="flex items-center justify-between px-3 py-2 border-b border-zinc-800/60 bg-zinc-900/40">
          <div className="flex items-center gap-1.5">
            <span className="font-sans font-semibold uppercase tracking-wide text-[10px] text-zinc-400">
              {language?.toUpperCase() || 'CODE'}
            </span>
          </div>
        </div>
        <div className="p-4 text-xs text-zinc-400">Loading...</div>
      </div>
    );
  }

  return (
    <CodeBlockInteractive
      code={code}
      language={language}
      filename={filename}
      showLineNumbers={showLineNumbers}
      fullHighlightedDark={highlightedData.fullHighlightedDark}
      fullHighlightedLight={highlightedData.fullHighlightedLight}
      collapsedHighlightedDark={highlightedData.collapsedHighlightedDark}
      collapsedHighlightedLight={highlightedData.collapsedHighlightedLight}
      shouldCollapse={highlightedData.shouldCollapse}
      linesCount={highlightedData.linesCount}
      maxCollapsedLines={highlightedData.maxCollapsedLines}
    />
  );
}
