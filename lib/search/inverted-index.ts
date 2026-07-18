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

  for (const value of [doc.name, doc.id, doc.mental_trigger, doc.code_context, doc.api_signature, doc.summary, doc.category, doc.fn_signature, doc.parent_name]) {
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

  // Phase 1 additions - error message indexing
  if (doc.error_messages) {
    doc.error_messages.forEach(msg => {
      const normalized = normalizeToken(msg);
      if (normalized) tokens.add(normalized);
    });
  }

  // Phase 1 additions - CLI command search
  if (doc.diagnostic_commands) {
    doc.diagnostic_commands.forEach(cmd => {
      // Extract command name and flags
      const parts = cmd.split(/[^a-z0-9-]+/i);
      parts.forEach(part => {
        const normalized = normalizeToken(part);
        if (normalized && normalized.length >= 2) tokens.add(normalized);
      });
    });
  }

  // Phase 1 additions - quick check indexing
  if (doc.quick_checks) {
    doc.quick_checks.forEach(check => {
      const normalized = normalizeToken(check);
      if (normalized) tokens.add(normalized);
    });
  }

  // Phase 2 additions - gotchas indexing from packages
  if (doc.gotchas) {
    doc.gotchas.forEach((gotcha: string) => {
      const parts = gotcha.split(/[^a-z0-9]+/);
      parts.forEach((part: string) => {
        const normalized = normalizeToken(part);
        if (normalized && normalized.length >= 3) tokens.add(normalized);
      });
    });
  }

  // Phase 2 additions - root causes indexing
  if (doc.root_causes) {
    doc.root_causes.forEach((cause: string) => {
      const parts = cause.split(/[^a-z0-9]+/);
      parts.forEach((part: string) => {
        const normalized = normalizeToken(part);
        if (normalized && normalized.length >= 3) tokens.add(normalized);
      });
    });
  }

  // Phase 2 additions - symptoms indexing
  if (doc.symptoms) {
    doc.symptoms.forEach((symptom: string) => {
      const parts = symptom.split(/[^a-z0-9]+/);
      parts.forEach((part: string) => {
        const normalized = normalizeToken(part);
        if (normalized && normalized.length >= 3) tokens.add(normalized);
      });
    });
  }

  // Phase 2 additions - decision flow indexing
  if (doc.decision_flow) {
    doc.decision_flow.forEach((flow: { question?: string; if_yes?: string; if_no?: string }) => {
      const parts = flow.question?.split(/[^a-z0-9]+/) || [];
      parts.forEach((part: string) => {
        const normalized = normalizeToken(part);
        if (normalized && normalized.length >= 3) tokens.add(normalized);
      });
    });
  }

  return Array.from(tokens);
}

export function buildInvertedIndex(docs: SearchResult[]): InvertedIndex {
  const tokenMap = new Map<string, Set<string>>();
  const docMap = new Map<string, SearchResult>();

  docs.forEach(doc => {
    // Use search_id for internal indexing if available, otherwise use id
    const indexKey = doc.search_id || doc.id;
    docMap.set(indexKey, doc);
    collectTokens(doc).forEach(token => {
      const bucket = tokenMap.get(token) ?? new Set<string>();
      bucket.add(indexKey);
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

  // Normalize query tokens once to avoid repeated normalization
  const normalizedTokens = queryTokens
    .map(token => normalizeToken(token))
    .filter((token): token is string => Boolean(token));

  // Remove duplicates to avoid processing the same token multiple times
  const uniqueTokens = [...new Set(normalizedTokens)];

  uniqueTokens.forEach(normalized => {
    // Check for exact matches first
    const exactDocs = index.tokenMap.get(normalized);
    if (exactDocs) {
      exactDocs.forEach(docId => {
        const current = results.get(docId) ?? { matchedTokenCount: 0, totalQueryTokens };
        current.matchedTokenCount += 1;
        results.set(docId, current);
      });
    }

    // Check for prefix matches (only if no exact match found for efficiency)
    // This reduces unnecessary iterations when exact matches exist
    if (!exactDocs || exactDocs.size === 0) {
      for (const [existingToken, docIds] of index.tokenMap.entries()) {
        if (existingToken.startsWith(normalized) && existingToken !== normalized) {
          docIds.forEach(docId => {
            const current = results.get(docId) ?? { matchedTokenCount: 0, totalQueryTokens };
            current.matchedTokenCount += 0.7;
            results.set(docId, current);
          });
        }
      }
    }
  });

  return Array.from(results.entries())
    .map(([id, value]) => ({ id, ...value }))
    .sort((a, b) => b.matchedTokenCount - a.matchedTokenCount);
}
