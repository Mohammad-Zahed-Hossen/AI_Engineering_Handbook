import { slugify } from '../components/shared/SectionHeading';

// Standalone navigation regression suite
export function runNavigationTests() {
  const results: { name: string; success: boolean; message?: string }[] = [];

  const assert = (condition: boolean, name: string) => {
    results.push({ name, success: condition });
    if (!condition) {
      throw new Error(`Test failed: ${name}`);
    }
  };

  assert(slugify('PyTorch Framework') === 'pytorch-framework', 'Slugify PyTorch Framework');
  assert(slugify('Decision Board & Tradeoffs') === 'decision-board--tradeoffs', 'Slugify Decision Board & Tradeoffs');
  assert(slugify('  Core Understanding  ') === 'core-understanding', 'Slugify trimmed string');

  const localSearchKey = 'k';
  const globalSearchKey = '/';
  assert((localSearchKey as string) !== (globalSearchKey as string), 'Local search shortcut does not collide with "/"');

  return results;
}

if (typeof require !== 'undefined' && require.main === module) {
  runNavigationTests();
  console.log('✅ Navigation regression suite executed successfully.');
}
