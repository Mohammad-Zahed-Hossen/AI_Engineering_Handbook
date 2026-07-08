'use client';

import { useState } from 'react';
import { categorizeSources } from '@/lib/resources';
import { 
  FileText, 
  BookOpen, 
  ExternalLink, 
  Globe,
  Link2,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface OfficialResourcesProps {
  sources: string[];
  githubRepo?: string;
}

interface ResourceInfo {
  title: string;
  subtitle?: string;
}

// ===== URL PARSING STRATEGY =====

type Parser = (url: URL) => ResourceInfo | null;

const parsers: Parser[] = [
  // NumPy documentation
  (url) => {
    if (url.hostname === 'numpy.org' && url.pathname.includes('/reference/generated/')) {
      const match = url.pathname.match(/generated\/(numpy\.\w+)\.html/);
      if (match) {
        const func = match[1];
        // Convert numpy.array to np.array
        const shortName = func.replace('numpy.', 'np.');
        return { title: shortName, subtitle: 'API Reference' };
      }
    }
    if (url.hostname === 'numpy.org' && url.pathname.includes('/user/')) {
      const match = url.pathname.match(/user\/([\w.-]+)\.html/);
      if (match) {
        return { title: toTitleCase(match[1].replace(/-/g, ' ')), subtitle: 'Guide' };
      }
    }
    if (url.hostname === 'numpy.org' && url.pathname === '/doc/stable/reference/') {
      return { title: 'NumPy Reference', subtitle: 'Documentation' };
    }
    return null;
  },

  // Pandas documentation
  (url) => {
    if (url.hostname === 'pandas.pydata.org' || url.hostname === 'pandas.pydata.org') {
      // API reference: pandas.DataFrame.groupby.html
      const apiMatch = url.pathname.match(/reference\/api\/(pandas\.[\w.]+)\.html/);
      if (apiMatch) {
        const api = apiMatch[1];
        // Shorten common patterns
        const shortName = api
          .replace('pandas.DataFrame.', 'DataFrame.')
          .replace('pandas.Series.', 'Series.')
          .replace('pandas.', '');
        return { title: shortName, subtitle: 'API Reference' };
      }
      
      // Reference sections: reference/frame.html
      const refMatch = url.pathname.match(/reference\/(\w+)\.html/);
      if (refMatch) {
        const section = refMatch[1];
        const titles: Record<string, string> = {
          frame: 'DataFrame API',
          series: 'Series API',
          groupby: 'GroupBy API',
          io: 'Input/Output',
          indexing: 'Indexing',
          window: 'Window Operations',
        };
        return { title: titles[section] || toTitleCase(section), subtitle: 'Reference' };
      }
      
      // Main docs
      if (url.pathname === '/docs/' || url.pathname === '/docs/reference/index.html') {
        return { title: 'Pandas Documentation', subtitle: 'Documentation' };
      }
    }
    return null;
  },

  // PyTorch documentation
  (url) => {
    if (url.hostname === 'pytorch.org' && url.pathname.includes('/docs/')) {
      // torch.nn.Linear, torch.optim.Adam, etc.
      const match = url.pathname.match(/docs\/stable\/generated\/([\w.]+)\.html/);
      if (match) {
        return { title: match[1], subtitle: 'API Reference' };
      }
    }
    return null;
  },

  // Scikit-learn documentation
  (url) => {
    if (url.hostname === 'scikit-learn.org') {
      const match = url.pathname.match(/modules\/generated\/sklearn\.([\w.]+)\.html/);
      if (match) {
        const className = match[1];
        // sklearn.preprocessing.StandardScaler -> StandardScaler
        const shortName = className.split('.').pop() || className;
        return { title: shortName, subtitle: 'API Reference' };
      }
    }
    return null;
  },

  // HuggingFace models
  (url) => {
    if (url.hostname === 'huggingface.co') {
      const match = url.pathname.match(/\/models\/([^\/]+)/);
      if (match) {
        return { title: match[1], subtitle: 'Model Card' };
      }
    }
    return null;
  },

  // GitHub repositories
  (url) => {
    if (url.hostname === 'github.com') {
      const match = url.pathname.match(/\/([^\/]+)\/([^\/]+)/);
      if (match) {
        return { title: `${match[1]}/${match[2]}`, subtitle: 'Repository' };
      }
    }
    return null;
  },

  // Python documentation
  (url) => {
    if (url.hostname === 'docs.python.org') {
      const match = url.pathname.match(/\/3\/library\/([\w.]+)\.html/);
      if (match) {
        const moduleName = match[1];
        return { title: moduleName, subtitle: 'Module' };
      }
      if (url.pathname.includes('/3/')) {
        const match = url.pathname.match(/\/3\/([\w-]+)\//);
        if (match) {
          return { title: toTitleCase(match[1].replace(/-/g, ' ')), subtitle: 'Documentation' };
        }
      }
    }
    return null;
  },

  // ArXiv papers
  (url) => {
    if (url.hostname === 'arxiv.org' || url.hostname.includes('arxiv')) {
      const match = url.pathname.match(/(\d{4}\.\d{4,5})/);
      if (match) {
        return { title: `arXiv:${match[1]}`, subtitle: 'Research Paper' };
      }
    }
    return null;
  },

  // Matplotlib documentation
  (url) => {
    if (url.hostname === 'matplotlib.org') {
      const match = url.pathname.match(/stable\/api\/(_\w+\.html)/);
      if (match) {
        return { title: match[1].replace('.html', ''), subtitle: 'API Reference' };
      }
      if (url.pathname.includes('/stable/')) {
        const match = url.pathname.match(/stable\/([\w-]+)\.html/);
        if (match) {
          return { title: toTitleCase(match[1].replace(/-/g, ' ')), subtitle: 'Guide' };
        }
      }
    }
    return null;
  },

  // Zenodo records
  (url) => {
    if (url.hostname === 'zenodo.org') {
      const match = url.pathname.match(/record\/(\d+)/);
      if (match) {
        return { title: `Zenodo Record ${match[1]}`, subtitle: 'Research Paper' };
      }
    }
    return null;
  },

  // MDPI journals
  (url) => {
    if (url.hostname === 'www.mdpi.com') {
      const match = url.pathname.match(/\/(\d+)\/(\d+)\//);
      if (match) {
        return { title: `MDPI Article`, subtitle: 'Research Paper' };
      }
    }
    return null;
  },

  // Frontiers journals
  (url) => {
    if (url.hostname === 'www.frontiersin.org') {
      const match = url.pathname.match(/articles\/10\.\d+\/([\w.]+)/);
      if (match) {
        return { title: 'Frontiers Article', subtitle: 'Research Paper' };
      }
    }
    return null;
  },

  // TensorFlow documentation
  (url) => {
    if (url.hostname === 'www.tensorflow.org' && url.pathname.includes('/api/')) {
      const match = url.pathname.match(/api\/python\/([\w/]+)\.html/);
      if (match) {
        const path = match[1];
        const shortName = path.split('/').pop() || path;
        return { title: shortName, subtitle: 'API Reference' };
      }
    }
    return null;
  },

  // Keras documentation
  (url) => {
    if (url.hostname === 'keras.io' && url.pathname.includes('/api/')) {
      const match = url.pathname.match(/api\/([\w-]+)/);
      if (match) {
        return { title: toTitleCase(match[1].replace(/-/g, ' ')), subtitle: 'API Reference' };
      }
    }
    return null;
  },
];

// Helper: Convert string to Title Case
function toTitleCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[_-]/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase());
}

// Main parser function
function parseResourceUrl(url: string, category: string): ResourceInfo {
  try {
    const urlObj = new URL(url);
    
    // Try each parser
    for (const parser of parsers) {
      const result = parser(urlObj);
      if (result) return result;
    }
    
    // Fallback based on category
    if (category === 'modelCards') {
      const pathParts = urlObj.pathname.split('/').filter(Boolean);
      if (pathParts.length >= 2) {
        return { title: pathParts.slice(-2).join(' / ') };
      }
      return { title: urlObj.hostname };
    }
    
    if (category === 'papers') {
      return { title: 'Research Paper' };
    }
    
    // Final fallback: hostname
    return { title: urlObj.hostname };
  } catch {
    return { title: url };
  }
}

interface ResourceCategoryProps {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  urls: string[];
  category: string;
}

function ResourceCategory({ icon, iconBg, title, urls, category }: ResourceCategoryProps) {
  const [expanded, setExpanded] = useState(false);
  const showMore = urls.length > 3;
  const visibleUrls = expanded ? urls : urls.slice(0, 3);

  return (
    <div className="flex items-start gap-3 p-3 rounded-lg bg-background border border-border hover:border-primary/30 transition-colors">
      <div className={`shrink-0 flex h-9 w-9 items-center justify-center rounded-lg ${iconBg}`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
          {title}
        </h3>
        <ul className="space-y-1.5">
          {visibleUrls.map(url => {
            const info = parseResourceUrl(url, category);
            return (
              <li key={url}>
                <a 
                  href={url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="group block"
                >
                  <div className="flex items-center gap-2 text-xs text-foreground hover:text-primary transition-colors">
                    <span className="truncate font-medium">{info.title}</span>
                    <ExternalLink className="w-3 h-3 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  {info.subtitle && (
                    <div className="text-[10px] text-muted-foreground mt-0.5">
                      {info.subtitle}
                    </div>
                  )}
                </a>
              </li>
            );
          })}
        </ul>
        {showMore && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="mt-2 text-[10px] font-medium text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
          >
            {expanded ? (
              <>
                <ChevronUp className="w-3 h-3" />
                Show less
              </>
            ) : (
              <>
                <ChevronDown className="w-3 h-3" />
                See more ({urls.length - 3})
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

export default function OfficialResources({ sources, githubRepo }: OfficialResourcesProps) {
  const categorized = categorizeSources(sources);
  const hasContent =
    categorized.documentation.length > 0 ||
    categorized.papers.length > 0 ||
    categorized.modelCards.length > 0 ||
    categorized.external.length > 0 ||
    !!githubRepo;

  if (!hasContent) return null;

  return (
    <section className="rounded-xl border border-border bg-card/50 backdrop-blur-sm overflow-hidden">
      <div className="px-4 py-3 border-b border-border bg-muted/30">
        <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-primary" />
          Official Resources
        </h2>
      </div>
      
      <div className="p-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* GitHub */}
        {githubRepo && (() => {
          const info = parseResourceUrl(githubRepo, 'external');
          return (
            <div className="flex items-start gap-3 p-3 rounded-lg bg-background border border-border hover:border-primary/30 transition-colors">
              <div className="shrink-0 flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Link2 className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                  Source Code
                </h3>
                <a 
                  href={githubRepo} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="group block"
                >
                  <div className="flex items-center gap-2 text-xs text-foreground hover:text-primary transition-colors">
                    <span className="truncate font-medium">{info.title}</span>
                    <ExternalLink className="w-3 h-3 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  {info.subtitle && (
                    <div className="text-[10px] text-muted-foreground mt-0.5">
                      {info.subtitle}
                    </div>
                  )}
                </a>
              </div>
            </div>
          );
        })()}

        {/* Documentation */}
        {categorized.documentation.length > 0 && (
          <ResourceCategory
            icon={<FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
            iconBg="bg-blue-500/10"
            title="Documentation"
            urls={categorized.documentation}
            category="documentation"
          />
        )}

        {/* Model Cards */}
        {categorized.modelCards.length > 0 && (
          <ResourceCategory
            icon={<BookOpen className="w-4 h-4 text-purple-600 dark:text-purple-400" />}
            iconBg="bg-purple-500/10"
            title="Model Cards"
            urls={categorized.modelCards}
            category="modelCards"
          />
        )}

        {/* Papers */}
        {categorized.papers.length > 0 && (
          <ResourceCategory
            icon={<FileText className="w-4 h-4 text-amber-600 dark:text-amber-400" />}
            iconBg="bg-amber-500/10"
            title="Research Papers"
            urls={categorized.papers}
            category="papers"
          />
        )}

        {/* External References */}
        {categorized.external.length > 0 && (
          <ResourceCategory
            icon={<Globe className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />}
            iconBg="bg-emerald-500/10"
            title="External References"
            urls={categorized.external}
            category="external"
          />
        )}
      </div>
    </section>
  );
}
