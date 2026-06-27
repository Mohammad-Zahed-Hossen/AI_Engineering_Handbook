import { SearchResult, createFuse } from '@/lib/search-types';
import { buildInvertedIndex, queryInvertedIndex, type InvertedIndex } from '@/lib/search/inverted-index';
import { expandQuery } from '@/lib/search/synonym-expander';

// Usage in page components:
// import { buildSearchEngine } from '@/lib/search';
// const engine = buildSearchEngine();
// <SearchBox index={[]} engine={engine} />

export interface SearchEngine {
  search(query: string, limit?: number): SearchResult[];
}

export function createSearchEngine(docs: SearchResult[]): SearchEngine {
  const invertedIndex: InvertedIndex = buildInvertedIndex(docs);
  const fuse = createFuse(docs);

  return {
    search(query: string, limit = 8): SearchResult[] {
      const trimmed = query.trim();
      if (!trimmed) return [];

      const lowerQuery = trimmed.toLowerCase();

      const { expandedTokens, conceptGroupIds } = expandQuery(trimmed);
      const expandedQueryTokens: string[] = expandedTokens
        .map((token: string) => token.toLowerCase())
        .flatMap((token: string) => token.split(/[^a-z0-9]+/))
        .filter((token: string) => token.length >= 2);

      const tokenMatches = queryInvertedIndex(invertedIndex, expandedQueryTokens);
      const tokenScores = new Map<string, number>();

      tokenMatches.forEach(match => {
        const doc = invertedIndex.docMap.get(match.id);
        let score = Math.min((match.matchedTokenCount / Math.max(match.totalQueryTokens, 1)) * 0.95, 0.95);

        // Boost exact name matches heavily
        if (doc) {
          const nameLower = doc.name.toLowerCase();
          if (nameLower === lowerQuery) {
            score = Math.max(score, 1.0);
          } else if (nameLower.startsWith(lowerQuery + ' ')) {
            score = Math.max(score, 0.98);
          } else if (nameLower.includes(lowerQuery)) {
            score = Math.max(score, 0.90);
          }

          // Boost exact summary matches
          const summaryLower = (doc.summary || '').toLowerCase();
          if (summaryLower.includes(lowerQuery)) {
            score = Math.max(score, 0.85);
          }
        }

        tokenScores.set(match.id, score);
      });

      conceptGroupIds.forEach(id => {
        tokenScores.set(id, Math.max(tokenScores.get(id) ?? 0, 0.96));
      });

      const fuseResults = fuse.search(trimmed, { limit: limit * 2 });
      fuseResults.forEach(result => {
        const docId = result.item.id;
        const fuzzyScore = Math.min((1 - (result.score ?? 0.5)) * 0.45, 0.45);
        const currentScore = tokenScores.get(docId) ?? 0;
        tokenScores.set(docId, Math.max(currentScore, fuzzyScore));
      });

      return Array.from(tokenScores.entries())
        .map(([id, score]) => ({ doc: invertedIndex.docMap.get(id), score }))
        .filter((entry): entry is { doc: SearchResult; score: number } => Boolean(entry.doc))
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
        .map(entry => entry.doc);
    },
  };
}
