/**
 * Related Search - Extension of the search engine
 * 
 * This module provides functionality to find related search results based on:
 * - Shared keywords
 * - Same category/type
 * - Concept group membership
 * - Related workflows/cheatsheets references
 */

import { SearchResult } from '../search-types';

/**
 * Find related results based on a given search result
 * 
 * @param result - The base result to find related items for
 * @param allResults - The full search index to search within
 * @param limit - Maximum number of related results to return
 * @returns Array of related search results, sorted by relevance
 */
export function findRelatedResults(
  result: SearchResult,
  allResults: SearchResult[],
  limit: number = 5
): SearchResult[] {
  if (!result || !allResults || allResults.length === 0) {
    return [];
  }

  const scored = allResults
    .filter(r => r.id !== result.id) // Exclude the result itself
    .map(r => ({
      result: r,
      score: calculateRelatedScore(result, r)
    }))
    .filter(item => item.score > 0) // Only include results with some relevance
    .sort((a, b) => b.score - a.score) // Sort by score descending
    .slice(0, limit) // Take top N results
    .map(item => item.result);

  return scored;
}

/**
 * Calculate a relatedness score between two search results
 * 
 * Scoring factors:
 * - Same type/category: +2
 * - Shared keywords: +1 per shared keyword
 * - Same parent_name: +1.5
 * - Related workflows/cheatsheets: +1 per match
 * 
 * @param base - The base result
 * @param candidate - The candidate result to score against base
 * @returns Relatedness score (higher = more related)
 */
function calculateRelatedScore(base: SearchResult, candidate: SearchResult): number {
  let score = 0;

  // Same type (e.g., both are models, both are workflows)
  if (base.type === candidate.type) {
    score += 2;
  }

  // Same category (e.g., both are ML models)
  if (base.category && candidate.category && base.category === candidate.category) {
    score += 2;
  }

  // Shared keywords
  if (base.keywords && candidate.keywords) {
    const sharedKeywords = base.keywords.filter(k => 
      candidate.keywords?.includes(k)
    );
    score += sharedKeywords.length * 1;
  }

  // Same parent (e.g., both from NumPy package)
  if (base.parent_name && candidate.parent_name && base.parent_name === candidate.parent_name) {
    score += 1.5;
  }

  // Check for related workflows/cheatsheets (if available in the data structure)
  // This would require extending the SearchResult type to include these references
  // For now, we'll skip this as it's not in the current schema

  return score;
}

/**
 * Find results by concept group
 * 
 * @param concept - The concept name to search for
 * @param conceptGroups - The concept groups mapping
 * @param allResults - The full search index
 * @returns Array of results belonging to the concept group
 */
export function findByConceptGroup(
  concept: string,
  conceptGroups: Record<string, string[]>,
  allResults: SearchResult[]
): SearchResult[] {
  const memberIds = conceptGroups[concept.toLowerCase()];
  
  if (!memberIds || memberIds.length === 0) {
    return [];
  }

  return allResults.filter(result => 
    memberIds.includes(result.id) || 
    memberIds.includes(result.name.toLowerCase())
  );
}

/**
 * Get related concepts for a given result based on its keywords and category
 * 
 * @param result - The search result
 * @param conceptGroups - The concept groups mapping
 * @returns Array of concept names that this result belongs to
 */
export function getResultConcepts(
  result: SearchResult,
  conceptGroups: Record<string, string[]>
): string[] {
  const concepts: string[] = [];

  for (const [conceptName, memberIds] of Object.entries(conceptGroups)) {
    if (memberIds.includes(result.id) || memberIds.includes(result.name.toLowerCase())) {
      concepts.push(conceptName);
    }
  }

  return concepts;
}
