import { codeToHtml } from 'shiki';
import { CodeBlockInteractive } from './CodeBlockInteractive';

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
  showLineNumbers?: boolean;
}

export async function highlightCodeSnippet(code: string, language: string = 'text') {
  const lines = code.split('\n');
  const MAX_COLLAPSED_LINES = 7;
  const shouldCollapse = lines.length > MAX_COLLAPSED_LINES;
  
  // For text/plain, don't collapse
  const isPlainText = language === 'text' || language === 'plain';
  const shouldActuallyCollapse = shouldCollapse && !isPlainText;
  
  let fullHighlightedDark = '';
  let fullHighlightedLight = '';
  let collapsedHighlightedDark = '';
  let collapsedHighlightedLight = '';
  
  const normalizeLang = (lang: string) => {
    const l = lang.toLowerCase();
    if (l === 'py') return 'python';
    if (l === 'sh' || l === 'bash') return 'bash';
    return l;
  };
  
  const highlightedLang = normalizeLang(language);
  
  // Generate full highlighted HTML for both themes
  try {
    fullHighlightedDark = await codeToHtml(code, {
      lang: highlightedLang,
      theme: 'github-dark',
    });
  } catch (err) {
    console.error('Shiki highlighting error (dark):', err);
    fullHighlightedDark = `<pre><code>${escapeHtml(code)}</code></pre>`;
  }
  
  try {
    fullHighlightedLight = await codeToHtml(code, {
      lang: highlightedLang,
      theme: 'github-light',
    });
  } catch (err) {
    console.error('Shiki highlighting error (light):', err);
    fullHighlightedLight = `<pre><code>${escapeHtml(code)}</code></pre>`;
  }
  
  // Generate collapsed view by truncating the source code before highlighting
  if (shouldCollapse) {
    const collapsedCode = lines.slice(0, MAX_COLLAPSED_LINES).join('\n');
    
    try {
      collapsedHighlightedDark = await codeToHtml(collapsedCode, {
        lang: highlightedLang,
        theme: 'github-dark',
      });
    } catch (err) {
      console.error('Shiki highlighting error (collapsed dark):', err);
      collapsedHighlightedDark = `<pre><code>${escapeHtml(collapsedCode)}</code></pre>`;
    }
    
    try {
      collapsedHighlightedLight = await codeToHtml(collapsedCode, {
        lang: highlightedLang,
        theme: 'github-light',
      });
    } catch (err) {
      console.error('Shiki highlighting error (collapsed light):', err);
      collapsedHighlightedLight = `<pre><code>${escapeHtml(collapsedCode)}</code></pre>`;
    }
  }
  
  return {
    fullHighlightedDark,
    fullHighlightedLight,
    collapsedHighlightedDark,
    collapsedHighlightedLight,
    shouldCollapse: shouldActuallyCollapse,
    linesCount: lines.length,
    maxCollapsedLines: MAX_COLLAPSED_LINES,
  };
}

export async function CodeBlock({
  code,
  language = 'python',
  filename,
  showLineNumbers = false
}: CodeBlockProps) {
  const {
    fullHighlightedDark,
    fullHighlightedLight,
    collapsedHighlightedDark,
    collapsedHighlightedLight,
    shouldCollapse,
    linesCount,
    maxCollapsedLines,
  } = await highlightCodeSnippet(code, language);
  
  return (
    <CodeBlockInteractive
      code={code}
      language={language}
      filename={filename}
      showLineNumbers={showLineNumbers}
      fullHighlightedDark={fullHighlightedDark}
      fullHighlightedLight={fullHighlightedLight}
      collapsedHighlightedDark={collapsedHighlightedDark}
      collapsedHighlightedLight={collapsedHighlightedLight}
      shouldCollapse={shouldCollapse}
      linesCount={linesCount}
      maxCollapsedLines={maxCollapsedLines}
    />
  );
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&')
    .replace(/</g, '<')
    .replace(/>/g, '>')
    .replace(/"/g, '"')
    .replace(/'/g, '&#039;');
}