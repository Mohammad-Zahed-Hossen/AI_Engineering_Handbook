import { cache } from 'react';
import { SearchResult } from '@/lib/search-types';
import { createSearchEngine } from '@/lib/search/engine';
import { SearchIndexerRegistry } from '@/lib/search/indexer-registry';

export type { SearchResult } from '@/lib/search-types';
export { createFuse } from '@/lib/search-types';
export { SearchIndexerRegistry, type SearchIndexer } from '@/lib/search/indexer-registry';

export const buildSearchIndex = cache(function buildSearchIndex(): SearchResult[] {
  const results = SearchIndexerRegistry.buildAllIndexEntries();

  if (process.env.NODE_ENV === 'development') {
    const indexSize = Buffer.byteLength(JSON.stringify(results), 'utf8');
    console.log(`[search] Index contains ${results.length} entries, ~${Math.round(indexSize / 1024)}KB`);
  }

  return results;
});

export const buildSearchEngine = cache(function buildSearchEngine() {
  return createSearchEngine(buildSearchIndex());
});
