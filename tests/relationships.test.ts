import test from 'node:test';
import assert from 'node:assert/strict';
import { resolvePackageRelationship, getRelationshipSearchKeywords } from '../lib/relationships.ts';
import { getRelatedContent, resolveGraphNodes } from '../lib/data.ts';
import { createRelationshipRegistry } from '../lib/relationships/relationshipRegistry.ts';
import { createDefaultRelationshipResolvers } from '../lib/relationships/resolveRelationship.ts';
import { normalizeRelationshipList } from '../lib/relationships/normalizeRelationships.ts';

interface TestPackageTask {
  task: string;
  resource_id?: string;
}

interface TestPackage {
  id: string;
  name: string;
  tasks: TestPackageTask[];
}

const packages: TestPackage[] = [
  {
    id: 'matplotlib',
    name: 'Matplotlib',
    tasks: [
      {
        task: 'Draw Histogram',
        resource_id: 'histogram',
      },
      {
        task: 'Create Scatter Plot',
        resource_id: 'scatter',
      },
    ],
  },
  {
    id: 'seaborn',
    name: 'Seaborn',
    tasks: [
      {
        task: 'Create Histogram',
        resource_id: 'histogram',
      },
    ],
  },
];

test('resolvePackageRelationship builds a navigable cross-package link', () => {
  const resolved = resolvePackageRelationship(
    {
      package: 'seaborn',
      task: 'Create Histogram',
      reason: 'Statistical wrapper over Matplotlib histogram.',
    },
    'matplotlib',
    packages
  );

  assert.equal(resolved?.href, '/packages/seaborn#create-histogram');
  assert.equal(resolved?.targetLabel, 'Create Histogram');
  assert.equal(resolved?.packageName, 'Seaborn');
});

test('relationship search keywords include task and reason terms', () => {
  const keywords = getRelationshipSearchKeywords([
    {
      package: 'seaborn',
      task: 'Create Histogram',
      reason: 'Interactive histogram wrapper.',
    },
  ]);

  assert.ok(keywords.includes('histogram'));
  assert.ok(keywords.includes('interactive'));
  assert.ok(keywords.includes('wrapper'));
});

test('getRelatedContent returns an array for cheatsheets without package alternatives', () => {
  const related = getRelatedContent('cheatsheet', 'scikit-learn');

  assert.ok(Array.isArray(related));
  assert.ok(related.length >= 0);
});

test('normalizeRelationshipList deduplicates, filters unknown ids, and preserves order', () => {
  const knownContent = new Map([
    ['package:numpy', { id: 'numpy', title: 'NumPy', slug: 'numpy', href: '/packages/numpy', type: 'package' as const }],
    ['package:pandas', { id: 'pandas', title: 'Pandas', slug: 'pandas', href: '/packages/pandas', type: 'package' as const }],
    ['workflow:train', { id: 'train', title: 'Train Workflow', slug: 'train', href: '/workflows/train', type: 'workflow' as const }],
  ]);

  const relationships = normalizeRelationshipList(
    ['numpy', 'missing', 'numpy', 'pandas'],
    'related_packages',
    {
      resolveContent: (type, id) => knownContent.get(`${type}:${id}`) ?? null,
      resolvePackageTask: () => null,
    }
  );

  assert.deepEqual(relationships.map(item => item.id), ['numpy', 'pandas']);
  assert.deepEqual(relationships.map(item => item.title), ['NumPy', 'Pandas']);
});

test('normalizeRelationshipList resolves package task aliases through the shared registry', () => {
  const registry = createRelationshipRegistry([
    {
      id: 'matplotlib',
      name: 'Matplotlib',
      tasks: [
        { task: 'Draw Histogram', resource_id: 'histogram' },
        { task: 'Create Scatter Plot', resource_id: 'scatter' },
      ],
    },
  ]);

  const resolvers = createDefaultRelationshipResolvers(registry, () => null);
  const relationships = normalizeRelationshipList(['histogram', 'histogram'], 'related_package_tasks', resolvers, { packageId: 'matplotlib' });

  assert.equal(relationships.length, 1);
  assert.equal(relationships[0].id, 'histogram');
  assert.equal(relationships[0].title, 'Draw Histogram');
  assert.equal(relationships[0].href, '/packages/matplotlib#draw-histogram');
  assert.equal(relationships[0].type, 'package_task');
});

test('resolveGraphNodes converts relationships into fully navigable nodes, hiding broken IDs and merging duplicates while preserving order', () => {
  const inputItems = [
    { type: 'package' as const, id: 'numpy' },
    { type: 'package' as const, id: 'broken_package_id' },
    { type: 'package' as const, id: 'numpy' }, // Duplicate
    { type: 'package' as const, id: 'pandas' },
    'histogram', // Task alias in matplotlib
  ];

  const nodes = resolveGraphNodes(inputItems, 'package', 'pytorch');

  // All resolved nodes must have a non-null href (navigable)
  nodes.forEach(node => {
    assert.ok(node.href && node.href.length > 0, `Node ${node.id} must have a valid href`);
    assert.ok(node.name && node.name.length > 0, `Node ${node.id} must have a valid name`);
  });

  // Broken package ID must be hidden
  assert.equal(nodes.some(n => n.id === 'broken_package_id'), false);

  // Duplicates must be merged
  const numpyNodes = nodes.filter(n => n.id === 'numpy');
  assert.equal(numpyNodes.length, 1);

  // Order preserved: numpy before pandas
  const numpyIndex = nodes.findIndex(n => n.id === 'numpy');
  const pandasIndex = nodes.findIndex(n => n.id === 'pandas');
  assert.ok(numpyIndex < pandasIndex, 'Original ordering must be preserved');
});
