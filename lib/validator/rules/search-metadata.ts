import { ValidationRule, ValidationContext, ValidationIssue } from './base.js';
import { buildSearchIndex } from '../../search.js';

export class SearchMetadataRule implements ValidationRule {
  meta = {
    id: 'KQV015',
    category: 'search',
    severity: 'high' as const,
    autofix: false,
    docs: '/docs/kqv/rules/search-metadata.md'
  };

  name = 'Search Metadata Integrity';
  description = 'Verifies that all generated search index items contain unique IDs, valid href targets, non-empty titles, and proper parent references.';

  async validate(context: ValidationContext): Promise<ValidationIssue[]> {
    const issues: ValidationIssue[] = [];
    const { graph } = context;

    let searchItems;
    try {
      searchItems = buildSearchIndex();
    } catch (e) {
      issues.push({
        code: 'KQV015',
        ruleId: this.meta.id,
        category: this.meta.category,
        severity: 'critical',
        filePath: 'lib/search.ts',
        message: `Failed to build search index: ${(e as Error).message}`,
        priority: 10
      });
      return issues;
    }

    const seenSearchIds = new Map<string, string>();

    for (const item of searchItems) {
      const searchKey = item.search_id || item.id;

      // 1. Unique Search ID check
      if (seenSearchIds.has(searchKey)) {
        issues.push({
          code: 'KQV015',
          ruleId: 'duplicate-search-id',
          category: this.meta.category,
          severity: 'high',
          filePath: 'public/search-index.json',
          message: `Duplicate search ID detected in search index: '${searchKey}'. Previously seen for ${seenSearchIds.get(searchKey)}.`,
          suggestedFix: 'Ensure all search entries generate unique search_id values.',
          priority: 8
        });
      } else {
        seenSearchIds.set(searchKey, item.name || item.id);
      }

      // 2. Non-empty Title / Name check
      if (!item.name || !item.name.trim()) {
        issues.push({
          code: 'KQV015',
          ruleId: 'missing-search-title',
          category: this.meta.category,
          severity: 'high',
          filePath: 'public/search-index.json',
          message: `Search item '${searchKey}' is missing a valid name or title.`,
          suggestedFix: 'Ensure all indexers output a non-empty name property.',
          priority: 7
        });
      }

      // 3. Valid Href check
      if (!item.href || !item.href.startsWith('/')) {
        issues.push({
          code: 'KQV015',
          ruleId: 'invalid-search-href',
          category: this.meta.category,
          severity: 'high',
          filePath: 'public/search-index.json',
          message: `Search item '${searchKey}' has invalid href: '${item.href}'.`,
          suggestedFix: 'Ensure href starts with a valid absolute path template (e.g. /packages/numpy).',
          priority: 7
        });
      }

      // 4. Orphaned Search Href Target check (page path exist check)
      const pathOnly = item.href.split('#')[0];
      const pathSegments = pathOnly.split('/').filter(Boolean);
      if (pathSegments.length >= 2) {
        const rootDir = pathSegments[0]; // e.g. packages, cheatsheets, models, workflows, patterns
        const entityId = pathSegments[pathSegments.length - 1];

        // Map root directory to node type
        let nodeType = rootDir.replace(/s$/, ''); // e.g. package, cheatsheet, workflow, pattern, model, principle
        if (rootDir === 'debug-guides') nodeType = 'debug_guide';
        if (rootDir === 'decision-guides') nodeType = 'decision_guide';

        if (graph.nodes.size > 0 && ['package', 'cheatsheet', 'workflow', 'pattern', 'model', 'debug_guide', 'decision_guide', 'principle'].includes(nodeType)) {
          const targetKey = `${nodeType}:${entityId}`;
          if (!graph.nodes.has(targetKey) && !item.id.startsWith('compare-') && !item.id.startsWith('problem::')) {
            issues.push({
              code: 'KQV015',
              ruleId: 'orphaned-search-target',
              category: this.meta.category,
              severity: 'high',
              filePath: 'public/search-index.json',
              message: `Search item '${searchKey}' points to non-existent page target '${pathOnly}' (${targetKey}).`,
              suggestedFix: 'Fix href or remove obsolete search index entry.',
              priority: 7
            });
          }
        }
      }

      // 5. Child entry parent_name check
      if ((item.type === 'function' || item.type === 'quick_reference' || item.type === 'checklist') && item.source_type === 'cheatsheet') {
        if (!item.parent_name) {
          issues.push({
            code: 'KQV015',
            ruleId: 'missing-parent-name',
            category: this.meta.category,
            severity: 'medium',
            filePath: 'public/search-index.json',
            message: `Cheatsheet child search item '${searchKey}' is missing parent_name metadata.`,
            suggestedFix: 'Set parent_name to the parent cheatsheet name during indexing.',
            priority: 5
          });
        }
      }
    }

    return issues;
  }
}
