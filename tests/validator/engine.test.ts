import test from 'node:test';
import assert from 'node:assert/strict';
import { RuleEngine } from '../../lib/validator/engine.ts';
import { KnowledgeGraph } from '../../lib/validator/context.ts';
import { generateReport } from '../../lib/validator/report.ts';

test('RuleEngine registers default Phase 2 rules', () => {
  const engine = new RuleEngine();
  const rules = engine.getRegisteredRules();
  
  assert.ok(rules.length >= 6);
  const ruleIds = rules.map(r => r.meta.id);
  assert.ok(ruleIds.includes('KQV001')); // Schema
  assert.ok(ruleIds.includes('KQV004')); // CrossRef
  assert.ok(ruleIds.includes('KQV006')); // Orphan
  assert.ok(ruleIds.includes('KQV007')); // Related
  assert.ok(ruleIds.includes('KQV009')); // Empty
  assert.ok(ruleIds.includes('KQV012')); // Registry
});

test('RuleEngine filters rules by category name', async () => {
  const engine = new RuleEngine();
  const graph = new KnowledgeGraph();
  
  const context = {
    graph,
    config: {
      version: '2.0',
      content_types: [],
      schema_version_mapping: {},
      size_budgets: {
        package_max_common_tasks: 10,
        workflow_max_steps: 10,
        cheatsheet_max_entries: 10,
        max_relationships_per_type: 10,
        max_total_relationships: 10
      },
      stability_tiers: {
        stable: { review_cadence_days: 90, verification_required: true },
        semi_stable: { review_cadence_days: 90, verification_required: true },
        volatile: { review_cadence_days: 90, verification_required: false }
      },
      validation_rules: {
        require_bidirectional_relationships: true,
        allow_unregistered_tags: false,
        allow_unregistered_aliases: false
      },
      registry_asset_types: []
    },
    registeredTags: new Set<string>(),
    registeredAliases: new Set<string>()
  };

  // Run with 'schema' category filter only
  const issues = await engine.run(context, 'schema');
  
  // Verify all returned issues belong to the 'schema' category
  for (const issue of issues) {
    assert.equal(issue.category, 'schema');
  }
});

test('generateReport calculates metrics accurately', () => {
  const graph = new KnowledgeGraph();
  graph.addNode({
    id: 'test-node-1',
    type: 'package',
    filePath: 'data/packages/test-node-1.json',
    data: {},
    isValid: true
  });
  
  const mockIssues = [
    {
      code: 'KQV004',
      ruleId: 'cross-ref',
      category: 'navigation',
      severity: 'critical' as const,
      filePath: 'data/packages/test-node-1.json',
      message: 'Broken reference test',
      priority: 10
    },
    {
      code: 'KQV009',
      ruleId: 'empty-check',
      category: 'completeness',
      severity: 'high' as const,
      filePath: 'data/packages/test-node-1.json',
      message: 'Placeholder test',
      priority: 7
    }
  ];

  const report = generateReport(mockIssues, graph);
  
  assert.equal(report.stats.totalFiles, 1);
  assert.equal(report.stats.errors, 2);
  assert.equal(report.stats.brokenLinks, 1);
  assert.equal(report.stats.placeholders, 1);
  
  // Check that sorting works (priority 10 should be before priority 7)
  assert.equal(report.issues[0].code, 'KQV004');
  assert.equal(report.issues[1].code, 'KQV009');
});
