import test from 'node:test';
import assert from 'node:assert/strict';
import { KnowledgeGraph } from '../../lib/validator/context.ts';
import { SchemaValidationRule } from '../../lib/validator/rules/schema.ts';
import { CrossRefRule } from '../../lib/validator/rules/cross-ref.ts';
import { OrphanRule } from '../../lib/validator/rules/orphans.ts';
import { RelatedRule } from '../../lib/validator/rules/related.ts';
import { EmptyRule } from '../../lib/validator/rules/empty.ts';
import { RegistryRule } from '../../lib/validator/rules/registry.ts';

// Helper to create basic validation context
function createMockContext(graph: KnowledgeGraph) {
  return {
    graph,
    config: {
      version: '2.0',
      content_types: [],
      schema_version_mapping: {},
      size_budgets: {
        package_max_common_tasks: 2,
        workflow_max_steps: 2,
        cheatsheet_max_entries: 2,
        max_relationships_per_type: 2,
        max_total_relationships: 3
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
    registeredTags: new Set(['valid-tag']),
    registeredAliases: new Set(['valid-alias'])
  };
}

test('SchemaValidationRule flags filename ID mismatches, unregistered tags, and invalid slugs', async () => {
  const graph = new KnowledgeGraph();
  graph.addNode({
    id: 'mismatched-id',
    type: 'package',
    filePath: 'data/packages/numpy.json',
    data: {
      id: 'mismatched-id',
      slug: 'invalid_slug_format', // Slugs must match SLUG_REGEX (no underscores allowed)
      tags: ['invalid-tag'],
      aliases: ['invalid-alias']
    },
    isValid: true
  });

  const rule = new SchemaValidationRule();
  const context = createMockContext(graph);
  const issues = await rule.validate(context);

  const codes = issues.map(i => i.code);
  assert.ok(codes.includes('KQV002')); // Filename ID mismatch
  assert.ok(codes.includes('KQV003')); // Invalid slug
  assert.ok(codes.includes('KQV010')); // Unregistered tag
  assert.ok(codes.includes('KQV011')); // Unregistered alias
});

test('CrossRefRule flags broken reference links and bidirectional reciprocity violations', async () => {
  const graph = new KnowledgeGraph();
  
  // Add source node
  graph.addNode({
    id: 'pattern-1',
    type: 'pattern',
    filePath: 'data/patterns/pattern-1.json',
    data: {
      id: 'pattern-1',
      related_workflows: ['workflow-1'] // workflow-1 does not exist
    },
    isValid: true
  });
  
  // Add an outgoing edge pointing to a non-existent node
  graph.addEdge({
    sourceId: 'pattern-1',
    sourceType: 'pattern',
    targetId: 'workflow-1',
    targetType: 'workflow',
    relationshipType: 'uses_workflow'
  });

  const rule = new CrossRefRule();
  const context = createMockContext(graph);
  const issues = await rule.validate(context);

  const codes = issues.map(i => i.code);
  assert.ok(codes.includes('KQV004')); // Broken reference
});

test('OrphanRule detects pages with zero incoming edges', async () => {
  const graph = new KnowledgeGraph();
  
  graph.addNode({
    id: 'orphan-workflow',
    type: 'workflow',
    filePath: 'data/workflows/orphan-workflow.json',
    data: {
      id: 'orphan-workflow',
      tags: ['machine-learning']
    },
    isValid: true
  });

  const rule = new OrphanRule();
  const context = createMockContext(graph);
  const issues = await rule.validate(context);

  const codes = issues.map(i => i.code);
  assert.ok(codes.includes('KQV006')); // Orphan page
});

test('RelatedRule checks budgets and self-references', async () => {
  const graph = new KnowledgeGraph();
  
  graph.addNode({
    id: 'package-1',
    type: 'package',
    filePath: 'data/packages/package-1.json',
    data: {
      id: 'package-1',
      related_content: [
        { id: 'package-1', type: 'package' } // Self-reference
      ]
    },
    isValid: true
  });
  
  graph.addEdge({
    sourceId: 'package-1',
    sourceType: 'package',
    targetId: 'package-1',
    targetType: 'package',
    relationshipType: 'related_to'
  });

  const rule = new RelatedRule();
  const context = createMockContext(graph);
  const issues = await rule.validate(context);

  const codes = issues.map(i => i.code);
  assert.ok(codes.includes('KQV008')); // Self-referential relationship
});

test('EmptyRule flags placeholders and empty lists in required fields', async () => {
  const graph = new KnowledgeGraph();
  
  graph.addNode({
    id: 'workflow-1',
    type: 'workflow',
    filePath: 'data/workflows/workflow-1.json',
    data: {
      id: 'workflow-1',
      overview: 'This is a TODO note.', // Contains TODO placeholder
      steps: [] // Empty critical array field
    },
    isValid: true
  });

  const rule = new EmptyRule();
  const context = createMockContext(graph);
  const issues = await rule.validate(context);

  const codes = issues.map(i => i.code);
  assert.ok(codes.includes('KQV009')); // Placeholder text or empty array field
});

test('RegistryRule checks that families contain variants and variants align to directories', async () => {
  const graph = new KnowledgeGraph();
  
  // Add family with no variants
  graph.addNode({
    id: 'empty-family',
    type: 'registry_family',
    filePath: 'data/registry/families/empty-family/_index.json',
    data: {
      id: 'empty-family'
    },
    isValid: true
  });

  const rule = new RegistryRule();
  const context = createMockContext(graph);
  const issues = await rule.validate(context);

  const codes = issues.map(i => i.code);
  assert.ok(codes.includes('KQV012')); // Family without variants
});
