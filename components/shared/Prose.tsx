import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { cn } from '@/lib/utils';
import { codeToHtml } from 'shiki';

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

// Normalize language for Shiki
const normalizeLang = (lang: string | undefined): string => {
  if (!lang) return 'python';
  const l = lang.toLowerCase();
  if (l === 'py') return 'python';
  if (l === 'sh' || l === 'bash') return 'bash';
  return l;
};

// Escape HTML special characters
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&')
    .replace(/</g, '<')
    .replace(/>/g, '>')
    .replace(/"/g, '"')
    .replace(/'/g, '&#039;');
}

// Highlight code using Shiki (server-side)
async function highlightCode(code: string, language: string | undefined): Promise<string> {
  const normalizedLang = normalizeLang(language);
  try {
    return await codeToHtml(code, {
      lang: normalizedLang,
      theme: 'github-dark',
    });
  } catch (err) {
    console.error('Shiki highlighting error:', err);
    // Fallback to escaped code
    return `<pre><code>${escapeHtml(code)}</code></pre>`;
  }
}

export async function Prose({ content, className }: ProseProps) {
  return (
    <div className={cn('content-prose', className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          table: ({ children }) => (
            <div className="overflow-x-auto rounded-lg border border-border">
              <table className="w-full text-left border-collapse text-xs">{children}</table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-muted/40 font-semibold text-foreground border-b border-border">{children}</thead>
          ),
          tbody: ({ children }) => (
            <tbody className="divide-y divide-border">{children}</tbody>
          ),
          th: ({ children }) => <th className="p-3">{children}</th>,
          td: ({ children }) => <td className="p-3 text-muted-foreground">{children}</td>,
          pre: async ({ children }) => {
            // ReactMarkdown passes the code element as children
            // We need to extract the code text and language from the code element
            const child = children as React.ReactElement & { props?: { children?: string; className?: string } };
            if (child?.type === 'code' && typeof child.props?.children === 'string') {
              const codeText = child.props.children;
              const language = child.props.className?.replace('language-', '') || undefined;
              const highlighted = await highlightCode(codeText, language);
              return (
                <div
                  className="rounded-md border border-border my-2 font-mono bg-card dark:bg-zinc-950 overflow-x-auto"
                  dangerouslySetInnerHTML={{ __html: highlighted }}
                />
              );
            }
            return <pre>{children}</pre>;
          },
          code: ({ className, children }) => {
            // Inline code - let the default styling handle it
            // The :not(pre) > code CSS rule in globals.css handles inline code styling
            return <code className={className}>{children}</code>;
          },
        }}
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

// Synchronous version for Client Components (no Shiki highlighting)
export function ProseClient({ content, className }: ProseProps) {
  return (
    <div className={cn('content-prose', className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          table: ({ children }) => (
            <div className="overflow-x-auto rounded-lg border border-border">
              <table className="w-full text-left border-collapse text-xs">{children}</table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-muted/40 font-semibold text-foreground border-b border-border">{children}</thead>
          ),
          tbody: ({ children }) => (
            <tbody className="divide-y divide-border">{children}</tbody>
          ),
          th: ({ children }) => <th className="p-3">{children}</th>,
          td: ({ children }) => <td className="p-3 text-muted-foreground">{children}</td>,
          pre: ({ children }) => {
            // For client components, render code blocks without syntax highlighting
            const child = children as React.ReactElement & { props?: { children?: string; className?: string } };
            if (child?.type === 'code' && typeof child.props?.children === 'string') {
              const codeText = child.props.children;
              const language = child.props.className?.replace('language-', '') || undefined;
              return (
                <div className="rounded-md border border-border my-2 font-mono bg-card dark:bg-zinc-950 overflow-x-auto">
                  <pre className="text-xs font-mono p-3 m-0 whitespace-pre">
                    <code className={`language-${language || 'text'}`}>{codeText}</code>
                  </pre>
                </div>
              );
            }
            return <pre>{children}</pre>;
          },
          code: ({ className, children }) => {
            // Inline code - let the default styling handle it
            return <code className={className}>{children}</code>;
          },
        }}
      >
        {normalizeContent(content)}
      </ReactMarkdown>
    </div>
  );
}