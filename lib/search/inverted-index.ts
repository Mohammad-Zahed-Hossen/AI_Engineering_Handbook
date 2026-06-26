import type { SearchResult } from '@/lib/search-types';

const STOP_WORDS = new Set([
  'i', 'a', 'an', 'the', 'is', 'are', 'was', 'for', 'to', 'in', 'of', 'and', 'or', 'not', 'on', 'at', 'by', 'be', 'it', 'do', 'if', 'my', 'me', 'we', 'you', 'he', 'she', 'they', 'this', 'that', 'with', 'from', 'into', 'any', 'all', 'need', 'want', 'when', 'where', 'how', 'what', 'which', 'have', 'has', 'can', 'will', 'use', 'used', 'using',
]);

export interface InvertedIndex {
  tokenMap: Map<string, Set<string>>;
  docMap: Map<string, SearchResult>;
}

function normalizeToken(token: string): string {
  return token.toLowerCase().trim();
}

function collectTokens(doc: SearchResult): string[] {
  const tokens = new Set<string>();

  for (const value of [doc.name, doc.id, doc.mental_trigger, doc.code_context, doc.summary, doc.category, doc.fn_signature, doc.parent_name]) {
    if (!value) continue;

    if (value === doc.id) {
      value.split(/[-:]+/).forEach(part => {
        const normalized = normalizeToken(part);
        if (normalized) tokens.add(normalized);
      });
      continue;
    }

    const parts = value.includes(' ') || value.includes('.') || value.includes('_') || value.includes('-')
      ? value.split(/[^a-z0-9]+/)
      : [value];

    parts.forEach(part => {
      const normalized = normalizeToken(part);
      if (!normalized) return;
      if (part === doc.summary || part === doc.mental_trigger) {
        if (!STOP_WORDS.has(normalized)) tokens.add(normalized);
        return;
      }
      tokens.add(normalized);
    });
  }

  if (doc.keywords) {
    doc.keywords.forEach(keyword => {
      const normalized = normalizeToken(keyword);
      if (normalized) tokens.add(normalized);
    });
  }

  if (doc.code_tokens) {
    doc.code_tokens.forEach(token => {
      const normalized = normalizeToken(token);
      if (normalized) tokens.add(normalized);
    });
  }

  return Array.from(tokens);
}

export function buildInvertedIndex(docs: SearchResult[]): InvertedIndex {
  const tokenMap = new Map<string, Set<string>>();
  const docMap = new Map<string, SearchResult>();

  docs.forEach(doc => {
    docMap.set(doc.id, doc);
    collectTokens(doc).forEach(token => {
      const bucket = tokenMap.get(token) ?? new Set<string>();
      bucket.add(doc.id);
      tokenMap.set(token, bucket);
    });
  });

  return { tokenMap, docMap };
}

export function queryInvertedIndex(
  index: InvertedIndex,
  queryTokens: string[],
): Array<{ id: string; matchedTokenCount: number; totalQueryTokens: number }> {
  const results = new Map<string, { matchedTokenCount: number; totalQueryTokens: number }>();
  const totalQueryTokens = Math.max(queryTokens.length, 1);

  queryTokens.forEach(token => {
    const normalized = normalizeToken(token);
    if (!normalized) return;

    const exactDocs = index.tokenMap.get(normalized);
    if (exactDocs) {
      exactDocs.forEach(docId => {
        const current = results.get(docId) ?? { matchedTokenCount: 0, totalQueryTokens };
        current.matchedTokenCount += 1;
        results.set(docId, current);
      });
    }

    for (const [existingToken, docIds] of index.tokenMap.entries()) {
      if (existingToken.startsWith(normalized) && existingToken !== normalized) {
        docIds.forEach(docId => {
          const current = results.get(docId) ?? { matchedTokenCount: 0, totalQueryTokens };
          current.matchedTokenCount += 0.7;
          results.set(docId, current);
        });
      }
    }
  });

  return Array.from(results.entries())
    .map(([id, value]) => ({ id, ...value }))
    .sort((a, b) => b.matchedTokenCount - a.matchedTokenCount);
}
