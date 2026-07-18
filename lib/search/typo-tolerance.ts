/**
 * Typo Tolerance Module
 * 
 * Implements Levenshtein distance-based typo correction for search queries.
 * Provides "Did you mean?" suggestions and query correction.
 */

/**
 * Calculate Levenshtein distance between two strings
 * Used for detecting typos in search queries
 */
export function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];
  
  // Initialize matrix
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }
  
  // Fill matrix
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }
  
  return matrix[b.length][a.length];
}

/**
 * Check if a string is a likely typo of another string
 * Uses edit distance threshold based on string length
 */
export function isLikelyTypo(input: string, candidate: string): boolean {
  if (input.length < 2) return false;
  if (input === candidate) return false;
  
  const distance = levenshteinDistance(input, candidate);
  
  // Threshold: distance <= 2 for queries >= 4 characters
  // For shorter queries, be more lenient
  const threshold = input.length >= 4 ? 2 : 1;
  
  return distance <= threshold;
}

/**
 * Find similar terms in a list of candidates
 * Returns top N matches sorted by edit distance
 */
export function findSimilarTerms(
  input: string,
  candidates: string[],
  limit: number = 5
): Array<{ term: string; distance: number }> {
  return candidates
    .map(candidate => ({
      term: candidate,
      distance: levenshteinDistance(input, candidate)
    }))
    .filter(item => item.distance > 0 && item.distance <= 2)
    .sort((a, b) => a.distance - b.distance)
    .slice(0, limit);
}

/**
 * Common spelling mistakes map for developer terms
 */
const COMMON_MISSPELLINGS: Record<string, string> = {
  'teh': 'the',
  'recieve': 'receive',
  'seperate': 'separate',
  'definately': 'definitely',
  'occured': 'occurred',
  'accomodate': 'accommodate',
  'begining': 'beginning',
  'calender': 'calendar',
  'neccessary': 'necessary',
  'occassion': 'occasion',
  'publically': 'publicly',
  'recomend': 'recommend',
  'sucessful': 'successful',
  'tommorow': 'tomorrow',
  'tounge': 'tongue',
  'wierd': 'weird',
  'writting': 'writing',
};

/**
 * Developer-specific typing mistakes
 */
const DEVELOPER_TYPOS: Record<string, string> = {
  'rn': 'nn',
  'inear': 'linear',
  'linalg': 'linear algebra',
  'arrray': 'array',
  'aray': 'array',
  'dictionry': 'dictionary',
  'dictonary': 'dictionary',
  'fucntion': 'function',
  'funciton': 'function',
  'methd': 'method',
  'mthod': 'method',
  'clss': 'class',
  'pacakge': 'package',
  'pakage': 'package',
  'libary': 'library',
  'libabry': 'library',
  'modul': 'module',
  'modlue': 'module',
  'improt': 'import',
  'imoprt': 'import',
  'expor': 'export',
  'exprot': 'export',
};

/**
 * Check for common misspellings and return correction if found
 */
export function checkCommonMisspelling(input: string): string | null {
  const lower = input.toLowerCase();
  return COMMON_MISSPELLINGS[lower] || DEVELOPER_TYPOS[lower] || null;
}

/**
 * Generate typo corrections for a query
 * Returns corrected query and suggestions
 */
export function generateTypoCorrections(
  query: string,
  allTokens: string[]
): {
  correctedQuery: string | null;
  suggestions: string[];
} {
  const tokens = query.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
  const suggestions: string[] = [];
  let correctedQuery: string | null = null;
  
  const correctedTokens = tokens.map(token => {
    // Check common misspellings first
    const commonFix = checkCommonMisspelling(token);
    if (commonFix) {
      return commonFix;
    }
    
    // Find similar terms in the index
    const similar = findSimilarTerms(token, allTokens, 3);
    if (similar.length > 0 && similar[0].distance <= 1) {
      suggestions.push(similar[0].term);
      return similar[0].term;
    }
    
    return token;
  });
  
  // If we have corrections, build corrected query
  if (suggestions.length > 0 || correctedTokens.some((t, i) => t !== tokens[i])) {
    correctedQuery = correctedTokens.join(' ');
  }
  
  return { correctedQuery, suggestions };
}