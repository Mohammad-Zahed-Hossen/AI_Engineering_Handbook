/**
 * Search Ranking Module
 * 
 * Implements advanced ranking strategies including:
 * - Freshness scoring (recently updated content ranks higher)
 * - Confidence scoring (production-proven content ranks higher)
 * - Engineering maturity scoring
 * - Canonical status boosting
 * - Relationship-based boosting
 */

import type { SearchResult } from '@/lib/search-types';
import type { SearchIntent } from './intent-detection';

/**
 * Calculate freshness boost based on updated_at date
 * - Updated within 30 days: +0.15
 * - Updated within 90 days: +0.10
 * - Updated within 180 days: +0.05
 * - Older: 0
 */
export function calculateFreshnessBoost(updatedAt: string): number {
  if (!updatedAt) return 0;
  
  const updated = new Date(updatedAt);
  const now = new Date();
  const daysDiff = Math.floor((now.getTime() - updated.getTime()) / (1000 * 60 * 60 * 24));
  
  if (daysDiff <= 30) return 0.15;
  if (daysDiff <= 90) return 0.10;
  if (daysDiff <= 180) return 0.05;
  return 0;
}

/**
 * Calculate confidence boost based on confidence level
 * - production_proven: +0.15
 * - verified: +0.10
 * - community_accepted: +0.05
 * - experimental: -0.05
 * - research: -0.10
 */
export function calculateConfidenceBoost(confidence?: string): number {
  if (!confidence) return 0;
  
  switch (confidence) {
    case 'production_proven':
      return 0.15;
    case 'verified':
      return 0.10;
    case 'community_accepted':
      return 0.05;
    case 'experimental':
      return -0.05;
    case 'research':
      return -0.10;
    default:
      return 0;
  }
}

/**
 * Calculate engineering maturity boost
 * - production_ready: +0.15
 * - emerging: +0.05
 * - experimental: -0.05
 * - research: -0.10
 */
export function calculateMaturityBoost(maturity?: string): number {
  if (!maturity) return 0;
  
  switch (maturity) {
    case 'production_ready':
      return 0.15;
    case 'emerging':
      return 0.05;
    case 'experimental':
      return -0.05;
    case 'research':
      return -0.10;
    default:
      return 0;
  }
}

/**
 * Calculate canonical status boost
 * - canonical: +0.10
 * - reference: +0.05
 * - generated: 0
 */
export function calculateCanonicalBoost(status?: string): number {
  if (!status) return 0;
  
  switch (status) {
    case 'canonical':
      return 0.10;
    case 'reference':
      return 0.05;
    default:
      return 0;
  }
}

/**
 * Calculate relationship boost based on related content count
 * - Content with relatedcontent links: +0.05
 * - Content referenced by 3+ other items: +0.10
 * - Content referenced by 5+ other items: +0.15
 * - Content in same concept group: +0.08
 */
export function calculateRelationshipBoost(
  result: SearchResult,
  relatedCount: number
): number {
  if (relatedCount >= 5) return 0.15;
  if (relatedCount >= 3) return 0.10;
  if (relatedCount >= 1) return 0.05;
  return 0;
}

/**
 * Calculate popularity boost based on view count
 * - Boost score by log(views + 1) / 10
 * - Decay by age: popularity * (0.9 ^ months_old)
 */
export function calculatePopularityBoost(
  viewCount: number,
  monthsOld: number
): number {
  if (!viewCount || viewCount <= 0) return 0;
  
  const baseBoost = Math.log(viewCount + 1) / 10;
  const decay = Math.pow(0.9, monthsOld);
  
  return baseBoost * decay;
}

/**
 * Calculate difficulty-aware boost
 * - beginner: +0.05 for short queries
 * - advanced: +0.05 for long, specific queries
 * - expert: +0.10 for technical queries
 */
export function calculateDifficultyBoost(
  queryLength: number,
  isTechnical: boolean,
  difficulty?: string
): number {
  if (!difficulty) return 0;
  
  switch (difficulty) {
    case 'beginner':
      return queryLength < 20 ? 0.05 : 0;
    case 'advanced':
      return queryLength >= 20 ? 0.05 : 0;
    case 'expert':
      return isTechnical ? 0.10 : 0;
    default:
      return 0;
  }
}

/**
 * Calculate problem-first boost for debug guides
 * - Debug guides with matching error messages: +0.25
 * - Patterns with matching when_to_use: +0.20
 * - Workflows with matching overview: +0.15
 */
export function calculateProblemFirstBoost(
  result: SearchResult,
  query: string,
  intent: SearchIntent
): number {
  if (intent !== 'problem' && intent !== 'debug_guide') return 0;
  
  const lowerQuery = query.toLowerCase();
  
  // For debug guides, check if query matches error-related terms
  if (result.type === 'debug_guide') {
    if (lowerQuery.includes('oom') || lowerQuery.includes('memory') || 
        lowerQuery.includes('cuda') || lowerQuery.includes('error')) {
      return 0.25;
    }
  }
  
  // For patterns, check if query matches when_to_use context
  if (result.type === 'pattern' && result.applicability) {
    if (result.applicability.toLowerCase().includes(lowerQuery)) {
      return 0.20;
    }
  }
  
  // For workflows, check if query matches overview
  if (result.type === 'workflow') {
    if (result.summary?.toLowerCase().includes(lowerQuery)) {
      return 0.15;
    }
  }
  
  return 0;
}

/**
 * Combined ranking function that applies all boosts
 */
export function calculateRankingScore(
  baseScore: number,
  result: SearchResult,
  options: {
    intent: SearchIntent;
    intentBoost: number;
    relatedCount?: number;
    query: string;
    isTechnical?: boolean;
  }
): number {
  let score = baseScore;
  
  // Apply intent boost
  score += options.intentBoost;
  
  // For technical queries, reduce quality boosts for non-function types
  // This prevents packages from outranking functions for queries like "fit()"
  const isTechnical = options.isTechnical || false;
  const qualityBoostMultiplier = (result.type === 'function') ? 1.0 : (isTechnical ? 0.3 : 1.0);
  
  // Apply freshness boost
  score += calculateFreshnessBoost(result.updated_at) * qualityBoostMultiplier;
  
  // Apply confidence boost
  score += calculateConfidenceBoost(
    result.confidence || result.engineering_maturity
  ) * qualityBoostMultiplier;
  
  // Apply canonical boost
  score += calculateCanonicalBoost(result.canonical_status) * qualityBoostMultiplier;
  
  // Apply relationship boost
  if (result.related_count !== undefined) {
    score += calculateRelationshipBoost(result, result.related_count) * qualityBoostMultiplier;
  }
  
  // Apply problem-first boost
  score += calculateProblemFirstBoost(result, options.query, options.intent);
  
  // Apply difficulty boost
  score += calculateDifficultyBoost(
    options.query.length,
    isTechnical,
    result.difficulty
  );
  
  return Math.min(score, 1.0); // Cap at 1.0
}

/**
 * Check if query is technical (contains code-like patterns)
 */
export function isTechnicalQuery(query: string): boolean {
  const technicalPatterns = [
    /\./,           // Dot notation (np.array)
    /::/,           // C++ style (::)
    /\(\)/,         // Function calls
    /\[/,           // Array indexing
    /-/,            // CLI flags
    /--/,           // CLI long flags
    /torch\./,      // PyTorch
    /np\./,         // NumPy
    /pd\./,         // Pandas
    /sklearn\./,     // sklearn
    /import\s/,     // Python import
    /def\s/,        // Python function
    /class\s/,      // Python class
    // Also detect function/method names that are commonly used in ML
    /\b(fit|predict|transform|score|predict_proba|partial_fit)\b/,
  ];
  
  return technicalPatterns.some(pattern => pattern.test(query));
}
