/**
 * Snippet Generation Module
 * 
 * Generates context-aware snippets with highlighted matches for search results.
 */

import type { SearchResult } from '@/lib/search-types';

/**
 * Generate a snippet from text with context around a matched term
 */
export function generateSnippet(
  text: string,
  query: string,
  maxLength: number = 150
): string {
  if (!text || !query) return text.substring(0, maxLength);
  
  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase();
  const queryIndex = lowerText.indexOf(lowerQuery);
  
  if (queryIndex === -1) {
    return text.substring(0, maxLength);
  }
  
  // Calculate snippet boundaries
  const start = Math.max(0, queryIndex - 50);
  const end = Math.min(text.length, queryIndex + maxLength - 50);
  
  let snippet = text.substring(start, end);
  
  // Add ellipsis if needed
  if (start > 0) snippet = '...' + snippet;
  if (end < text.length) snippet = snippet + '...';
  
  return snippet;
}

/**
 * Highlight matched terms in text
 */
export function highlightMatches(
  text: string,
  query: string
): string {
  if (!text || !query) return text;
  
  const terms = query.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
  let highlighted = text;
  
  terms.forEach(term => {
    const regex = new RegExp(`(${escapeRegExp(term)})`, 'gi');
    highlighted = highlighted.replace(regex, '<mark>$1</mark>');
  });
  
  return highlighted;
}

/**
 * Escape special regex characters
 */
function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Get matched fields for a search result
 */
export function getMatchedFields(
  result: SearchResult,
  query: string
): string[] {
  const matchedFields: string[] = [];
  const lowerQuery = query.toLowerCase();
  
  if (result.name?.toLowerCase().includes(lowerQuery)) {
    matchedFields.push('name');
  }
  if (result.summary?.toLowerCase().includes(lowerQuery)) {
    matchedFields.push('summary');
  }
  if (result.mental_trigger?.toLowerCase().includes(lowerQuery)) {
    matchedFields.push('mental_trigger');
  }
  if (result.code_context?.toLowerCase().includes(lowerQuery)) {
    matchedFields.push('code_context');
  }
  if (result.keywords?.some(k => k.toLowerCase().includes(lowerQuery))) {
    matchedFields.push('keywords');
  }
  if (result.error_messages?.some(m => m.toLowerCase().includes(lowerQuery))) {
    matchedFields.push('error_messages');
  }
  if (result.diagnostic_commands?.some(c => c.toLowerCase().includes(lowerQuery))) {
    matchedFields.push('diagnostic_commands');
  }
  
  return matchedFields;
}

/**
 * Generate relevance explanation for a result
 */
export function generateRelevanceExplanation(
  result: SearchResult,
  query: string
): string {
  const matchedFields = getMatchedFields(result, query);
  const explanations: string[] = [];
  
  if (matchedFields.includes('name')) {
    explanations.push('Matched in name (exact)');
  }
  if (matchedFields.includes('mental_trigger')) {
    explanations.push('Matched in mental trigger');
  }
  if (matchedFields.includes('error_messages')) {
    explanations.push('Matched in error message');
  }
  if (matchedFields.includes('code_context')) {
    explanations.push('Matched in code context');
  }
  if (matchedFields.includes('keywords')) {
    explanations.push('Matched in keywords');
  }
  
  // Add quality signals
  if (result.confidence === 'production_proven') {
    explanations.push('Production-proven content');
  }
  if (result.engineering_maturity === 'production_ready') {
    explanations.push('Production-ready');
  }
  if (result.canonical_status === 'canonical') {
    explanations.push('Canonical source');
  }
  
  return explanations.join(' • ');
}