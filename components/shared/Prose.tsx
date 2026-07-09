import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { cn } from '@/lib/utils';

interface ProseProps {
  content: string;
  className?: string;
}

export function Prose({ content, className }: ProseProps) {
  return (
    <div className={cn('content-prose', className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
      >
        {content}
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
        {content}
      </ReactMarkdown>
    </span>
  );
}
