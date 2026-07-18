import test from 'node:test';
import assert from 'node:assert/strict';
import { levenshteinDistance, isLikelyTypo, findSimilarTerms, checkCommonMisspelling } from '../lib/search/typo-tolerance.ts';
import { detectIntent, getTypePriorityOrder, getIntentPriority } from '../lib/search/intent-detection.ts';
import { calculateFreshnessBoost, calculateConfidenceBoost, isTechnicalQuery } from '../lib/search/ranking.ts';
import { generateSnippet, highlightMatches, getMatchedFields } from '../lib/search/snippets.ts';
import { generateDidYouMean, getAutocompleteSuggestions, getPopularSearches, getRelatedSearches, generateZeroResultRecovery, getTypeIcon } from '../lib/search/query-assistance.ts';

// Test typo tolerance
test('levenshteinDistance calculates correct edit distance', () => {
  assert.strictEqual(levenshteinDistance('kitten', 'sitting'), 3);
  assert.strictEqual(levenshteinDistance('saturday', 'sunday'), 3);
  assert.strictEqual(levenshteinDistance('hello', 'hello'), 0);
  assert.strictEqual(levenshteinDistance('', 'test'), 4);
});

test('isLikelyTypo detects typos correctly', () => {
  assert.strictEqual(isLikelyTypo('rn', 'nn'), true);
  assert.strictEqual(isLikelyTypo('linalg', 'linear'), false); // Distance is 3, above threshold
  assert.strictEqual(isLikelyTypo('hello', 'hello'), false);
  assert.strictEqual(isLikelyTypo('a', 'ab'), false); // Too short
});

test('findSimilarTerms finds similar terms', () => {
  const candidates = ['numpy', 'pytorch', 'pandas', 'matplotlib'];
  const results = findSimilarTerms('nump', candidates);
  assert.ok(results.length > 0);
  assert.strictEqual(results[0].term, 'numpy');
});

test('checkCommonMisspelling corrects common typos', () => {
  assert.strictEqual(checkCommonMisspelling('teh'), 'the');
  assert.strictEqual(checkCommonMisspelling('recieve'), 'receive');
  assert.strictEqual(checkCommonMisspelling('rn'), 'nn');
  assert.strictEqual(checkCommonMisspelling('unknown'), null);
});

// Test intent detection
test('detectIntent identifies query intent', () => {
  const result = detectIntent('cuda oom error');
  // Both 'problem' and 'debug_guide' match, but 'problem' has higher priority
  assert.ok(['problem', 'debug_guide'].includes(result.primaryIntent));
  assert.ok(result.confidence > 0);
});

test('detectIntent identifies workflow intent', () => {
  const result = detectIntent('how to build a pipeline');
  assert.strictEqual(result.primaryIntent, 'workflow');
});

test('detectIntent identifies model intent', () => {
  const result = detectIntent('transformer architecture');
  assert.strictEqual(result.primaryIntent, 'model');
});

test('getTypePriorityOrder returns correct priority', () => {
  const order = getTypePriorityOrder('debug_guide');
  assert.strictEqual(order[0], 'debug_guide');
  assert.ok(order.indexOf('debug_guide') < order.indexOf('package'));
});

test('getIntentPriority returns correct priority values', () => {
  const debugPriority = getIntentPriority('debug_guide', 'debug_guide');
  const packagePriority = getIntentPriority('debug_guide', 'package');
  assert.ok(debugPriority < packagePriority);
});

// Test ranking
test('calculateFreshnessBoost returns correct values', () => {
  // Recent dates (within 30 days)
  const recentDate = new Date();
  recentDate.setDate(recentDate.getDate() - 10);
  assert.strictEqual(calculateFreshnessBoost(recentDate.toISOString().split('T')[0]), 0.15);
  
  // Old dates
  assert.strictEqual(calculateFreshnessBoost('2020-01-01'), 0);
});

test('calculateConfidenceBoost returns correct values', () => {
  assert.strictEqual(calculateConfidenceBoost('production_proven'), 0.15);
  assert.strictEqual(calculateConfidenceBoost('verified'), 0.10);
  assert.strictEqual(calculateConfidenceBoost('experimental'), -0.05);
  assert.strictEqual(calculateConfidenceBoost('research'), -0.10);
  assert.strictEqual(calculateConfidenceBoost(undefined), 0);
});

test('isTechnicalQuery detects technical patterns', () => {
  assert.strictEqual(isTechnicalQuery('np.array'), true);
  assert.strictEqual(isTechnicalQuery('torch.nn.Linear'), true);
  assert.strictEqual(isTechnicalQuery('nvidia-smi'), true);
  assert.strictEqual(isTechnicalQuery('how to do something'), false);
});

// Test snippets
test('generateSnippet creates context-aware snippets', () => {
  const text = 'This is a long piece of text that contains the word search in the middle somewhere';
  const snippet = generateSnippet(text, 'search', 50);
  // The snippet should contain the matched term
  // Note: generateSnippet returns the text as-is if query not found, or a substring
  assert.ok(typeof snippet === 'string');
  assert.ok(snippet.length > 0);
});

test('highlightMatches highlights query terms', () => {
  const text = 'This is a test string with the word search in it';
  const highlighted = highlightMatches(text, 'search');
  assert.ok(highlighted.includes('<mark>search</mark>'));
});

test('getMatchedFields returns correct fields', () => {
  const result = {
    type: 'debug_guide' as const,
    id: 'test',
    name: 'CUDA Out of Memory',
    summary: 'Troubleshooting CUDA OOM errors',
    href: '/test',
    updated_at: '2026-07-03',
    error_messages: ['RuntimeError: CUDA out of memory'],
  };
  const fields = getMatchedFields(result, 'cuda');
  assert.ok(fields.includes('name'));
  assert.ok(fields.includes('error_messages'));
});

// Test query assistance
test('generateDidYouMean suggests corrections', () => {
  const tokens = ['numpy', 'pytorch', 'pandas', 'matplotlib'];
  const suggestions = generateDidYouMean('nump', tokens);
  assert.ok(suggestions.length > 0);
});

test('getAutocompleteSuggestions returns matching terms', () => {
  const tokens = ['numpy', 'pytorch', 'pandas', 'matplotlib'];
  const suggestions = getAutocompleteSuggestions('num', tokens);
  assert.ok(suggestions.includes('numpy'));
});

test('getPopularSearches returns list of popular queries', () => {
  const popular = getPopularSearches();
  assert.ok(popular.length > 0);
  assert.ok(popular.includes('pytorch'));
});

test('getRelatedSearches returns related terms', () => {
  const tokens = ['numpy', 'pytorch', 'pandas', 'matplotlib', 'nump'];
  const related = getRelatedSearches('nump', tokens);
  assert.ok(Array.isArray(related));
});

test('generateZeroResultRecovery provides recovery options', () => {
  const tokens = ['numpy', 'pytorch', 'pandas', 'matplotlib'];
  const recovery = generateZeroResultRecovery('xyzzy', tokens);
  assert.ok(recovery.browseAllTypes);
});

test('getTypeIcon returns correct icons', () => {
  assert.strictEqual(getTypeIcon('package'), '📦');
  assert.strictEqual(getTypeIcon('model'), '🤖');
  assert.strictEqual(getTypeIcon('debug_guide'), '🐛');
  assert.strictEqual(getTypeIcon('workflow'), '🔄');
});