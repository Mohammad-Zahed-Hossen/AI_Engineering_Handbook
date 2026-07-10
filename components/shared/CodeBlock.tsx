import { codeToHtml } from 'shiki';
import { CodeBlockInteractive } from './CodeBlockInteractive';

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
  showLineNumbers?: boolean;
}

export async function CodeBlock({
  code,
  language = 'python',
  filename,
  showLineNumbers = false
}: CodeBlockProps) {
  const lines = code.split('\n');
  const MAX_COLLAPSED_LINES = 20;
  const shouldCollapse = lines.length > MAX_COLLAPSED_LINES;

  let fullHighlighted = '';
  let collapsedHighlighted = '';

  const normalizeLang = (lang: string) => {
    const l = lang.toLowerCase();
    if (l === 'py') return 'python';
    if (l === 'sh' || l === 'bash') return 'bash';
    return l;
  };

  const highlightedLang = normalizeLang(language);

  // Generate full highlighted HTML
  try {
    fullHighlighted = await codeToHtml(code, {
      lang: highlightedLang,
      theme: 'github-dark',
    });
  } catch (err) {
    console.error('Shiki highlighting error (full):', err);
    fullHighlighted = `<pre><code>${escapeHtml(code)}</code></pre>`;
  }

  // Generate collapsed highlighted HTML if needed
  if (shouldCollapse) {
    const displayLines = lines.slice(0, MAX_COLLAPSED_LINES);
    const displayCode = displayLines.join('\n');
    try {
      collapsedHighlighted = await codeToHtml(displayCode, {
        lang: highlightedLang,
        theme: 'github-dark',
      });
    } catch (err) {
      console.error('Shiki highlighting error (collapsed):', err);
      collapsedHighlighted = `<pre><code>${escapeHtml(displayCode)}</code></pre>`;
    }
  }

  return (
    <CodeBlockInteractive
      code={code}
      language={language}
      filename={filename}
      showLineNumbers={showLineNumbers}
      fullHighlighted={fullHighlighted}
      collapsedHighlighted={collapsedHighlighted}
      shouldCollapse={shouldCollapse}
      linesCount={lines.length}
      maxCollapsedLines={MAX_COLLAPSED_LINES}
    />
  );
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
