/**
 * Query Assistance Module
 * 
 * Provides "Did you mean?" suggestions, autocomplete, and zero-result recovery.
 */

import type { SearchResult } from '@/lib/search-types';
import { findSimilarTerms, checkCommonMisspelling } from './typo-tolerance.ts';

/**
 * Generate "Did you mean?" suggestions for zero-result queries
 */
export function generateDidYouMean(
  query: string,
  allTokens: string[]
): string[] {
  const suggestions: string[] = [];
  
  // Check for common misspellings
  const commonFix = checkCommonMisspelling(query);
  if (commonFix) {
    suggestions.push(commonFix);
  }
  
  // Find similar terms
  const similar = findSimilarTerms(query, allTokens, 3);
  similar.forEach(item => {
    if (!suggestions.includes(item.term)) {
      suggestions.push(item.term);
    }
  });
  
  return suggestions.slice(0, 3);
}

/**
 * Get autocomplete suggestions based on partial query
 */
export function getAutocompleteSuggestions(
  partialQuery: string,
  allTokens: string[]
): string[] {
  if (partialQuery.length < 2) return [];
  
  const lowerPartial = partialQuery.toLowerCase();
  
  return allTokens
    .filter(token => token.toLowerCase().startsWith(lowerPartial))
    .sort((a, b) => a.length - b.length)
    .slice(0, 10);
}

/**
 * Get popular search suggestions (placeholder for build-time computed data)
 */
export function getPopularSearches(): string[] {
  // In a real implementation, this would be loaded from search-index.json
  // which would be generated at build time from analytics
  return [
    'pytorch',
    'numpy',
    'rag',
    'cuda oom',
    'transformer',
    'fine-tuning',
    'checkpointing',
    'gradient accumulation',
  ];
}

/**
 * Get related search queries based on current query
 */
export function getRelatedSearches(
  query: string,
  allTokens: string[]
): string[] {
  const related: string[] = [];
  const lowerQuery = query.toLowerCase();
  
  // Simple related query logic - find tokens that share common prefixes
  const queryTokens = lowerQuery.split(/[^a-z0-9]+/).filter(Boolean);
  
  queryTokens.forEach(token => {
    // Find tokens that start with the same prefix
    const prefixMatches = allTokens
      .filter(t => t.toLowerCase().startsWith(token.substring(0, 3)))
      .filter(t => t.toLowerCase() !== token)
      .slice(0, 3);
    
    prefixMatches.forEach(match => {
      if (!related.includes(match) && !query.toLowerCase().includes(match.toLowerCase())) {
        related.push(match);
      }
    });
  });
  
  return related.slice(0, 5);
}

/**
 * Generate zero-result recovery response
 */
export function generateZeroResultRecovery(
  query: string,
  allTokens: string[]
): {
  didYouMean?: string;
  trySearchingFor?: string[];
  browseAllTypes?: string[];
} {
  const result: {
    didYouMean?: string;
    trySearchingFor?: string[];
    browseAllTypes?: string[];
  } = {};
  
  // Check for typo corrections
  const typoResult = generateDidYouMean(query, allTokens);
  if (typoResult.length > 0) {
    result.didYouMean = typoResult[0];
  }
  
  // Suggest related searches
  const related = getRelatedSearches(query, allTokens);
  if (related.length > 0) {
    result.trySearchingFor = related;
  }
  
  // Suggest browsing all types
  result.browseAllTypes = ['packages', 'models', 'workflows', 'patterns', 'debug-guides'];
  
  return result;
}

/**
 * Get type icon for autocomplete suggestions
 */
export function getTypeIcon(type: SearchResult['type']): string {
  const icons: Record<SearchResult['type'], string> = {
    package: '📦',
    model: '🤖',
    workflow: '🔄',
    cheatsheet: '📋',
    registry: '📊',
    function: '🔧',
    pattern: '🔷',
    debug_guide: '🐛',
    decision_guide: '⚖️',
    principle: '📜',
  };
  return icons[type] || '📄';
}