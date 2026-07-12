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
  
  // Find all outermost `<span class="line"` blocks using a depth-counter walk
  const lineSpans: string[] = [];
  let currentIndex = 0;
  
  while (currentIndex < innerContent.length && lineSpans.length < maxLines) {
    // Find the next line span opening tag
    const lineStartMatch = innerContent.slice(currentIndex).match(/<span class="line"[^>]*>/);
    if (!lineStartMatch || lineStartMatch.index === undefined) {
      break;
    }
    
    const lineStartPos = currentIndex + lineStartMatch.index;
    const startTag = lineStartMatch[0];
    
    // Walk character by character from after the line start tag to find the matching close tag
    let depth = 1;
    let scanIndex = lineStartPos + startTag.length;
    let foundEnd = false;
    
    while (scanIndex < innerContent.length) {
      if (innerContent.startsWith('</span>', scanIndex)) {
        depth--;
        scanIndex += 7; // Length of </span>
        if (depth === 0) {
          foundEnd = true;
          break;
        }
      } else if (innerContent.startsWith('<span', scanIndex)) {
        depth++;
        scanIndex += 5; // Length of <span
      } else {
        scanIndex++;
      }
    }
    
    if (foundEnd) {
      const lineSpanText = innerContent.slice(lineStartPos, scanIndex);
      lineSpans.push(lineSpanText);
      currentIndex = scanIndex;
    } else {
      // If we couldn't find a matching close tag, break and fallback
      break;
    }
  }

  if (lineSpans.length === 0) {
    return html;
  }

  // Take only the first N line spans
  const truncatedLines = lineSpans.join('');
  
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
