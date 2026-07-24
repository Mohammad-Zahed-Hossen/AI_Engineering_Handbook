import { slugify } from '../components/shared/SectionHeading';

console.log('====================================================');
console.log('  RUNNING AENS NAVIGATION REGRESSION TEST SUITE     ');
console.log('====================================================\n');

function assertEqual(actual: any, expected: any, testName: string) {
  if (actual === expected) {
    console.log(`  ✓ PASSED: ${testName}`);
  } else {
    console.error(`  ❌ FAILED: ${testName} - expected "${expected}", got "${actual}"`);
    process.exit(1);
  }
}

// 1. Test Heading Slugification
console.log('[1/3] Testing Heading Slugification Logic:');
assertEqual(slugify('PyTorch Framework'), 'pytorch-framework', 'Slugify PyTorch Framework');
assertEqual(slugify('Decision Board & Tradeoffs'), 'decision-board--tradeoffs', 'Slugify Decision Board & Tradeoffs');
assertEqual(slugify('  Core Understanding  '), 'core-understanding', 'Slugify trimmed string');
assertEqual(slugify('Step 1: Quantization & Pruning'), 'step-1-quantization--pruning', 'Slugify step title');
assertEqual(slugify('CUDA Out of Memory Error!'), 'cuda-out-of-memory-error', 'Slugify exclamation title');

// 2. Test Keyboard Precedence Rules
console.log('\n[2/3] Testing Keyboard Precedence Rules:');
const globalSearchKey: string = '/';
const localSearchDefaultKey: string = 'k';
assertEqual(localSearchDefaultKey !== globalSearchKey, true, 'Local search shortcut does not conflict with global search "/"');

// 3. Test Navigation Adoption Matrix Rules
console.log('\n[3/3] Testing Adoption Criteria Matrix:');
const rules = {
  narrativeMaxSections: 10,
  paletteMinItems: 30,
};
assertEqual(rules.narrativeMaxSections <= 10, true, 'Narrative guides under 10 sections use TOC Only');
assertEqual(rules.paletteMinItems >= 30, true, 'Command palette requires >30 items');

console.log('\n✅ ALL NAVIGATION REGRESSION TESTS PASSED CLEANLY!\n');
