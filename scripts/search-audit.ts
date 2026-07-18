import { createSearchEngine } from '../lib/search/engine';
import { buildSearchIndex } from '../lib/search';

// Build the search index and engine
const index = buildSearchIndex();
const engine = createSearchEngine(index);

// Test queries
const testQueries = [
  'rag',
  'pytorch',
  'randomforestclassifier',
  'cuda oom',
  'torch.nn.linear',
  'checkpointing',
  'fit()',
  'sklearn',
  'numpy reshape',
  'lora',
  'qlora',
  'batch inference',
  'vector database',
  'cross validation',
];

console.log('=== AENS Search Quality Audit ===\n');
console.log(`Index size: ${index.length} entries\n`);

testQueries.forEach(query => {
  console.log(`\n--- Query: "${query}" ---`);
  const results = engine.search(query, 5);
  results.forEach((r, i) => {
    console.log(`  ${i + 1}. [${r.type}] ${r.name} (${r.href})`);
  });
});

// Check for duplicate search_ids (internal unique identifiers)
  const searchIds = index.map(d => d.search_id || d.id);
  const duplicateSearchIds = searchIds.filter((id, idx) => searchIds.indexOf(id) !== idx);
  if (duplicateSearchIds.length > 0) {
    console.log('\n\nWARNING: Duplicate search_ids found:', [...new Set(duplicateSearchIds)]);
  }

// Check for missing required fields
const missingFields = index.filter(d => !d.name || !d.href || !d.type);
if (missingFields.length > 0) {
  console.log('\n\nWARNING: Entries missing required fields:', missingFields.map(d => d.id));
}

// Check index quality
console.log('\n\n=== Index Quality Summary ===');
const typeCounts = index.reduce((acc, d) => {
  acc[d.type] = (acc[d.type] || 0) + 1;
  return acc;
}, {} as Record<string, number>);
console.log('Entries by type:', typeCounts);

// Check for entries with error_messages
const withErrorMessages = index.filter(d => d.error_messages && d.error_messages.length > 0);
console.log(`Entries with error_messages: ${withErrorMessages.length}`);

// Check for entries with diagnostic_commands
const withDiagnosticCommands = index.filter(d => d.diagnostic_commands && d.diagnostic_commands.length > 0);
console.log(`Entries with diagnostic_commands: ${withDiagnosticCommands.length}`);

// Check for entries with confidence
const withConfidence = index.filter(d => d.confidence);
console.log(`Entries with confidence: ${withConfidence.length}`);

// Check for entries with related_count
const withRelatedCount = index.filter(d => d.related_count && d.related_count > 0);
console.log(`Entries with related_count: ${withRelatedCount.length}`);