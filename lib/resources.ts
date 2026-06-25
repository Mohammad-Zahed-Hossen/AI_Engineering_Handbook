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
  };
  return labels[type] ?? type;
}
