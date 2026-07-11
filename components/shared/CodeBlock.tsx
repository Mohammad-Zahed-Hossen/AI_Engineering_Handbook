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

  // Generate full highlighted HTML once
  try {
    fullHighlighted = await codeToHtml(code, {
      lang: highlightedLang,
      theme: 'github-dark',
    });
  } catch (err) {
    console.error('Shiki highlighting error (full):', err);
    fullHighlighted = `<pre><code>${escapeHtml(code)}</code></pre>`;
  }

  // Generate collapsed view by truncating the already-highlighted HTML
  if (shouldCollapse) {
    collapsedHighlighted = truncateHighlightedHtml(fullHighlighted, MAX_COLLAPSED_LINES);
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

/**
 * Truncates Shiki-highlighted HTML to the first N line spans.
 * Shiki wraps each source line in <span class="line">...</span>.
 * This extracts only the first N line spans while preserving the wrapper structure.
 */
function truncateHighlightedHtml(html: string, maxLines: number): string {
  // Find the opening <pre> and <code> tags
  const preMatch = html.match(/<pre[^>]*>/i);
  const codeMatch = html.match(/<code[^>]*>/i);
  
  if (!preMatch || !codeMatch) {
    // Fallback if structure is unexpected
    return html;
  }

  const codeStart = html.indexOf(codeMatch[0]) + codeMatch[0].length;
  const codeEnd = html.lastIndexOf('</code>');

  if (codeStart >= codeEnd) {
    return html;
  }

  // Extract the inner content between <code> and </code>
  const innerContent = html.slice(codeStart, codeEnd);
  
  // Split by line spans - Shiki uses <span class="line"> for each line
  const lineSpanRegex = /<span class="line"[^>]*>[\s\S]*?<\/span>/g;
  const lineSpans = innerContent.match(lineSpanRegex);
  
  if (!lineSpans || lineSpans.length <= maxLines) {
    // If we can't parse line spans or there aren't enough to truncate, return full
    return html;
  }

  // Take only the first N line spans
  const truncatedLines = lineSpans.slice(0, maxLines).join('');
  
  // Reconstruct the HTML with truncated content
  const preTag = preMatch[0];
  const codeTag = codeMatch[0];
  
  return `${preTag}${codeTag}${truncatedLines}</code></pre>`;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
