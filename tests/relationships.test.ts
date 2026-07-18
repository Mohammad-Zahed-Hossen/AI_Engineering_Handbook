import test from 'node:test';
import assert from 'node:assert/strict';
import { resolvePackageRelationship, getRelationshipSearchKeywords } from '../lib/relationships.ts';
import { getRelatedContent } from '../lib/data.ts';

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
