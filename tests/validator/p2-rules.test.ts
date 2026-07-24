import test from 'node:test';
import assert from 'node:assert/strict';
import { RuleEngine } from '../../lib/validator/engine.js';
import { SearchMetadataRule } from '../../lib/validator/rules/search-metadata.js';
import { URLFormatRule } from '../../lib/validator/rules/url-format.js';
import { MetadataConsistencyRule } from '../../lib/validator/rules/metadata-consistency.js';
import { KnowledgeGraph } from '../../lib/validator/context.js';
import { AENSConfig } from '../../lib/config/loader.js';

function createMockGraph(): KnowledgeGraph {
  const graph = new KnowledgeGraph();
  return graph;
}

function createMockConfig(): AENSConfig {
  return {
    version: '2.0',
    content_types: ['package', 'cheatsheet', 'workflow', 'pattern', 'model', 'principle'],
    schema_version_mapping: { '2.0': 'schema/v2' },
    size_budgets: {
      package_max_common_tasks: 10,
      workflow_max_steps: 20,
      cheatsheet_max_entries: 50,
      max_relationships_per_type: 100,
      max_total_relationships: 500
    },
    stability_tiers: {
      stable: { review_cadence_days: 90, verification_required: true },
      semi_stable: { review_cadence_days: 30, verification_required: false },
      volatile: { review_cadence_days: 7, verification_required: false }
    },
    validation_rules: {
      require_bidirectional_relationships: true,
      allow_unregistered_tags: false,
      allow_unregistered_aliases: false
    },
    registry_asset_types: ['package', 'cheatsheet', 'workflow', 'pattern', 'model']
  };
}

test('RuleEngine includes Phase P2 rules in ordered pipeline', () => {
  const engine = new RuleEngine();
  const rules = engine.getRegisteredRules();

  const ruleIds = rules.map(r => r.meta.id);
  assert.ok(ruleIds.includes('KQV015'), 'SearchMetadataRule KQV015 registered');
  assert.ok(ruleIds.includes('KQV016'), 'ParentReferenceRule KQV016 registered');
  assert.ok(ruleIds.includes('KQV017'), 'URLFormatRule KQV017 registered');
  assert.ok(ruleIds.includes('KQV018'), 'MetadataConsistencyRule KQV018 registered');
});

test('SearchMetadataRule validates search metadata items', async () => {
  const rule = new SearchMetadataRule();
  const mockContext = {
    graph: createMockGraph(),
    config: createMockConfig(),
    registeredTags: new Set<string>(),
    registeredAliases: new Set<string>()
  };

  const issues = await rule.validate(mockContext);
  assert.ok(Array.isArray(issues));
  const duplicateIdIssues = issues.filter(i => i.ruleId === 'duplicate-search-id');
  assert.equal(duplicateIdIssues.length, 0, 'No duplicate search IDs in generated index');
});

test('URLFormatRule flags invalid URL schemes', async () => {
  const rule = new URLFormatRule();
  const mockNode = {
    id: 'test',
    type: 'package',
    filePath: 'data/packages/test.json',
    data: {
      official_docs: 'ftp://invalid-scheme.com'
    },
    isValid: true
  };

  const mockGraph = createMockGraph();
  mockGraph.addNode(mockNode);
  
  const mockContext = {
    graph: mockGraph,
    config: createMockConfig(),
    registeredTags: new Set<string>(),
    registeredAliases: new Set<string>()
  };

  const issues = await rule.validate(mockContext);
  assert.ok(issues.some(i => i.ruleId === 'invalid-url-scheme'), 'Flags invalid URL scheme ftp://');
});

test('MetadataConsistencyRule checks ISO date format and order', async () => {
  const rule = new MetadataConsistencyRule();
  const mockNode = {
    id: 'test',
    type: 'package',
    filePath: 'data/packages/test.json',
    data: {
      created_at: '2026-08-01',
      updated_at: '2026-07-01'
    },
    isValid: true
  };

  const mockGraph = createMockGraph();
  mockGraph.addNode(mockNode);
  
  const mockContext = {
    graph: mockGraph,
    config: createMockConfig(),
    registeredTags: new Set<string>(),
    registeredAliases: new Set<string>()
  };

  const issues = await rule.validate(mockContext);
  assert.ok(issues.some(i => i.ruleId === 'chronological-date-inversion'), 'Flags chronological date inversion');
});
