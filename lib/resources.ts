export interface CategorizedSources {
  documentation: string[];
  papers: string[];
  modelCards: string[];
  external: string[];
}

const PAPER_HOSTS = ['arxiv.org', 'biorxiv.org', 'researchgate.net', 'doi.org', 'papers.nips.cc', 'openreview.net'];
const MODEL_CARD_HOSTS = ['huggingface.co', 'modelscope.cn'];

function hostOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return '';
  }
}

export function categorizeSources(sources: string[]): CategorizedSources {
  const result: CategorizedSources = {
    documentation: [],
    papers: [],
    modelCards: [],
    external: [],
  };

  for (const url of sources) {
    const host = hostOf(url);
    if (PAPER_HOSTS.some(h => host.includes(h) || url.includes(h))) {
      result.papers.push(url);
    } else if (MODEL_CARD_HOSTS.some(h => host.includes(h))) {
      result.modelCards.push(url);
    } else if (
      host.includes('readthedocs.io') ||
      host.includes('docs.') ||
      host.endsWith('.dev') ||
      host.includes('pytorch.org') ||
      host.includes('scikit-learn.org') ||
      host.includes('matplotlib.org') ||
      host.includes('platform.openai.com') ||
      host.includes('docs.cohere.com') ||
      host.includes('tesseract-ocr.github.io') ||
      host.includes('jaided.ai') ||
      host.includes('docs.dask.org') ||
      host.includes('docs.pola.rs') ||
      host.includes('llama.meta.com')
    ) {
      result.documentation.push(url);
    } else {
      result.external.push(url);
    }
  }

  return result;
}

export function formatContentType(type: string): string {
  const labels: Record<string, string> = {
    model: 'Model',
    package: 'Package',
    workflow: 'Workflow',
    cheatsheet: 'Cheatsheet',
    quick_reference: 'Quick Table',
    checklist: 'Checklist',
    registry: 'Registry',
    debug_guide: 'Debug Guide',
    pattern: 'Pattern',
    principle: 'Principle',
    decision_guide: 'Decision Guide',
    tool: 'Tool',
  };
  return labels[type] ?? type;
}

// ===== URL PARSING STRATEGY =====

interface ResourceInfo {
  title: string;
  subtitle?: string;
}

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
export function toTitleCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[_-]/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase());
}

// Main parser function
export function parseResourceUrl(url: string, category: string): ResourceInfo {
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
