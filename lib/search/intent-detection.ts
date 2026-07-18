/**
 * Intent Detection Module
 * 
 * Detects user search intent and provides type-based prioritization.
 * Supports: Package, Workflow, Problem, Model, Pattern, Cheatsheet, Debug Guide, Registry, Decision Guide, Principle
 */

import type { SearchResult } from '@/lib/search-types';

/**
 * Intent categories with their detection patterns
 */
export type SearchIntent = 
  | 'package'
  | 'workflow'
  | 'problem'
  | 'model'
  | 'pattern'
  | 'cheatsheet'
  | 'debug_guide'
  | 'registry'
  | 'decision_guide'
  | 'principle'
  | 'unknown';

/**
 * Intent detection patterns
 */
const INTENT_PATTERNS: Record<SearchIntent, {
  keywords: string[];
  boost: number;
  priority: number;
}> = {
  // Code/API related queries
  package: {
    keywords: ['import', 'pip install', 'np.', 'torch.', 'tf.', 'pd.', 'sklearn.', 'from', 'module', 'library', 'api', 'numpy', 'pytorch', 'pandas', 'torch'],
    boost: 0.40,
    priority: 1,
  },
  
  // How-to/process queries
  workflow: {
    keywords: ['how to', 'pipeline', 'deploy', 'build', 'setup', 'configure', 'install', 'run', 'start', 'create', 'rag', 'batch', 'inference', 'workflow'],
    boost: 0.40,
    priority: 2,
  },
  
  // Error/debug queries (highest priority)
  problem: {
    keywords: ['error', 'bug', 'crash', 'not working', 'fix', 'issue', 'fail', 'exception', 'oom', 'memory', 'cuda'],
    boost: 0.50,
    priority: 0,
  },
  
  // Model/architecture queries
  model: {
    keywords: ['architecture', 'transformer', 'classifier', 'regression', 'model', 'llm', 'gpt', 'bert', 'cnn', 'rnn', 'vit'],
    boost: 0.35,
    priority: 3,
  },
  
  // Pattern/best practice queries
  pattern: {
    keywords: ['best practice', 'pattern', 'when to use', 'how to', 'approach', 'strategy', 'technique', 'method'],
    boost: 0.25,
    priority: 4,
  },
  
  // Cheatsheet/syntax queries
  cheatsheet: {
    keywords: ['syntax', 'api', 'quick reference', 'cheat', 'snippet', 'code', 'example'],
    boost: 0.25,
    priority: 5,
  },
  
  // Debug guide queries (high priority for error terms)
  debug_guide: {
    keywords: ['debug', 'troubleshoot', 'oom', 'memory', 'crash', 'error', 'bug', 'fix', 'cuda', 'gpu'],
    boost: 0.50,
    priority: 0,
  },
  
  // Registry/model search queries
  registry: {
    keywords: ['download', 'model name', '70b', 'parameters', 'params', 'billion', 'quantized', 'gguf', 'safetensors'],
    boost: 0.35,
    priority: 6,
  },
  
  // Decision/comparison queries
  decision_guide: {
    keywords: ['choose', 'compare', 'vs', 'or', 'which', 'better', 'alternative', 'selection', 'decision'],
    boost: 0.25,
    priority: 7,
  },
  
  // Concept/theory queries
  principle: {
    keywords: ['why', 'principle', 'theory', 'concept', 'explanation', 'reason', 'understand'],
    boost: 0.20,
    priority: 8,
  },
  
  unknown: {
    keywords: [],
    boost: 0,
    priority: 99,
  },
};

/**
 * Type priority matrix for cross-type ranking
 */
const TYPE_PRIORITY_MATRIX: Record<SearchIntent, SearchResult['type'][]> = {
  problem: ['debug_guide', 'pattern', 'workflow', 'cheatsheet', 'package', 'model', 'registry', 'decision_guide', 'principle'],
  debug_guide: ['debug_guide', 'pattern', 'workflow', 'cheatsheet', 'package', 'model', 'registry', 'decision_guide', 'principle'],
  workflow: ['workflow', 'pattern', 'cheatsheet', 'package', 'model', 'registry', 'debug_guide', 'decision_guide', 'principle'],
  package: ['package', 'cheatsheet', 'function', 'workflow', 'model', 'registry', 'pattern', 'debug_guide', 'decision_guide', 'principle'],
  model: ['model', 'registry', 'pattern', 'workflow', 'package', 'cheatsheet', 'debug_guide', 'decision_guide', 'principle'],
  pattern: ['pattern', 'workflow', 'cheatsheet', 'package', 'model', 'registry', 'debug_guide', 'decision_guide', 'principle'],
  cheatsheet: ['cheatsheet', 'package', 'function', 'workflow', 'model', 'registry', 'pattern', 'debug_guide', 'decision_guide', 'principle'],
  registry: ['registry', 'model', 'workflow', 'package', 'cheatsheet', 'pattern', 'debug_guide', 'decision_guide', 'principle'],
  decision_guide: ['decision_guide', 'model', 'pattern', 'workflow', 'package', 'cheatsheet', 'registry', 'debug_guide', 'principle'],
  principle: ['principle', 'pattern', 'model', 'workflow', 'package', 'cheatsheet', 'registry', 'debug_guide', 'decision_guide'],
  unknown: ['package', 'model', 'workflow', 'cheatsheet', 'registry', 'pattern', 'debug_guide', 'decision_guide', 'principle'],
};

/**
 * Detect search intent from query
 */
export function detectIntent(query: string): {
  primaryIntent: SearchIntent;
  detectedKeywords: string[];
  confidence: number;
} {
  const normalizedQuery = query.toLowerCase();
  
  let bestIntent: SearchIntent = 'unknown';
  let bestScore = 0;
  const detectedKeywords: string[] = [];
  
  for (const [intent, config] of Object.entries(INTENT_PATTERNS)) {
    if (intent === 'unknown') continue;
    
    let score = 0;
    for (const keyword of config.keywords) {
      if (normalizedQuery.includes(keyword)) {
        score += 1;
        detectedKeywords.push(keyword);
      }
    }
    
    if (score > bestScore) {
      bestScore = score;
      bestIntent = intent as SearchIntent;
    }
  }
  
  // Calculate confidence (0-1)
  const confidence = Math.min(bestScore / 2, 1);
  
  return {
    primaryIntent: bestIntent,
    detectedKeywords,
    confidence,
  };
}

/**
 * Get type priority order based on detected intent
 */
export function getTypePriorityOrder(intent: SearchIntent): SearchResult['type'][] {
  return TYPE_PRIORITY_MATRIX[intent] || TYPE_PRIORITY_MATRIX.unknown;
}

/**
 * Calculate intent-based boost for a result
 * Strengthened to ensure type-based prioritization works correctly
 */
export function calculateIntentBoost(
  result: SearchResult,
  intent: SearchIntent
): number {
  if (intent === 'unknown') return 0;
  
  const config = INTENT_PATTERNS[intent];
  if (!config) return 0;
  
  // If result type matches intent exactly, apply strong boost
  if (result.type === intent) {
    return config.boost;
  }
  
  // Special case: problem intent should prioritize debug guides
  if (intent === 'problem' && result.type === 'debug_guide') {
    return config.boost;
  }
  
  // For package intent, prioritize packages over cheatsheets
  if (intent === 'package') {
    if (result.type === 'package') {
      return 0.35; // Strong boost for packages
    }
    if (result.type === 'function' && result.source_type === 'package') {
      return 0.30; // Boost package functions
    }
    if (result.type === 'cheatsheet') {
      return 0.10; // Lower boost for cheatsheets on package queries
    }
  }
  
  // For workflow intent, prioritize workflows
  if (intent === 'workflow') {
    if (result.type === 'workflow') {
      return 0.35; // Strong boost for workflows
    }
    if (result.type === 'pattern') {
      return 0.20; // Moderate boost for patterns
    }
  }
  
  // For debug_guide intent, prioritize debug guides
  if (intent === 'debug_guide') {
    if (result.type === 'debug_guide') {
      return config.boost;
    }
    if (['pattern', 'workflow'].includes(result.type)) {
      return config.boost * 0.5;
    }
  }
  
  // For decision_guide intent, prioritize decision guides
  if (intent === 'decision_guide') {
    if (result.type === 'decision_guide') {
      return 0.30;
    }
    if (result.type === 'model') {
      return 0.20; // Models are relevant for decisions
    }
  }
  
  // For model intent, prioritize models
  if (intent === 'model') {
    if (result.type === 'model') {
      return 0.30;
    }
    if (result.type === 'registry') {
      return 0.25; // Registry entries are model-related
    }
  }
  
  return 0;
}

/**
 * Get intent-based type priority (lower = higher priority)
 */
export function getIntentPriority(intent: SearchIntent, resultType: SearchResult['type']): number {
  const priorityOrder = getTypePriorityOrder(intent);
  const index = priorityOrder.indexOf(resultType);
  return index === -1 ? 99 : index;
}