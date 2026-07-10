import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { cn } from '@/lib/utils';

interface ProseProps {
  content: string;
  className?: string;
}

const normalizeContent = (text: string): string => {
  if (!text) return text;
  // Replace literal '\n' (backslash followed by n) with real newlines,
  // except when it is part of a recognized LaTeX command starting with \n
  return text.replace(/\\n(?!abla|exists|eg|eq|geq|leq|subseteq|supseteq|parallel|u\b|earrow|i\b|otin\b|ewline)/g, '\n');
};

export function Prose({ content, className }: ProseProps) {
  return (
    <div className={cn('content-prose', className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
      >
        {normalizeContent(content)}
      </ReactMarkdown>
    </div>
  );
}

export function ProseInline({ content, className }: ProseProps) {
  return (
    <span className={cn(className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          // Override paragraph to render as span for inline use
          p: ({ children }) => <>{children}</>,
        }}
      >
        {normalizeContent(content)}
      </ReactMarkdown>
    </span>
  );
}
