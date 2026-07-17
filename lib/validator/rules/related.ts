import { ValidationRule, ValidationContext, ValidationIssue } from './base.js';

export class RelatedRule implements ValidationRule {
  meta = {
    id: 'KQV007',
    category: 'navigation',
    severity: 'medium' as const,
    autofix: false,
    docs: '/docs/kqv/rules/related.md'
  };

  name = 'Related Resources Auditing';
  description = 'Validates relationship quantities, checks budgets, flags duplicate links or self-references, and warns on isolated pages with few links.';

  async validate(context: ValidationContext): Promise<ValidationIssue[]> {
    const issues: ValidationIssue[] = [];
    const { graph, config } = context;

    const maxPerType = config.size_budgets?.max_relationships_per_type || 20;
    const maxTotal = config.size_budgets?.max_total_relationships || 50;

    for (const [key, node] of graph.nodes.entries()) {
      if (node.type === 'problem') continue;
      const obj = node.data as Record<string, unknown>;
      if (!obj || typeof obj !== 'object') continue;

      const outEdges = graph.outgoing.get(key) || [];
      const outCount = outEdges.length;

      // 1. Self-Reference detection (Page links to itself)
      const selfRefs = outEdges.filter(e => e.targetId === node.id && e.targetType === node.type);
      if (selfRefs.length > 0) {
        issues.push({
          code: 'KQV008',
          ruleId: 'self-reference',
          category: this.meta.category,
          severity: 'high',
          filePath: node.filePath,
          message: `Self-referential link: page links to itself.`,
          suggestedFix: 'Remove self-referencing entries from relationship arrays.',
          priority: 8
        });
      }

      // 2. Duplicate Outgoing Reference detection
      const seenEdges = new Set<string>();
      for (const edge of outEdges) {
        const edgeKey = `${edge.targetType}:${edge.targetId}:${edge.relationshipType}`;
        if (seenEdges.has(edgeKey)) {
          issues.push({
            code: 'KQV008',
            ruleId: 'duplicate-relationship',
            category: this.meta.category,
            severity: 'high',
            filePath: node.filePath,
            message: `Duplicate relationship link to '${edge.targetType}:${edge.targetId}' via '${edge.relationshipType}'.`,
            suggestedFix: 'Deduplicate links inside relationship fields.',
            priority: 7
          });
        } else {
          seenEdges.add(edgeKey);
        }
      }

      // 3. Size Budget verification
      // Check per-type budgets in raw JSON fields
      const relationshipFields = [
        'related_workflows',
        'related_models',
        'related_packages',
        'related_principles',
        'related_debug_guides',
        'related_patterns',
        'related_registry',
        'referenced_by_patterns',
        'referenced_by_models',
        'referenced_by_workflows',
        'alternatives',
        'related_content',
        'relatedcontent'
      ];

      for (const field of relationshipFields) {
        const list = obj[field];
        if (Array.isArray(list) && list.length > maxPerType) {
          issues.push({
            code: 'KQV007',
            ruleId: 'relationship-budget-exceeded',
            category: this.meta.category,
            severity: 'medium',
            filePath: node.filePath,
            message: `Field '${field}' contains ${list.length} relationships, exceeding the maximum budget limit of ${maxPerType}.`,
            suggestedFix: `Reduce the number of connections or structure them into hierarchy categories.`,
            priority: 4
          });
        }
      }

      if (outCount > maxTotal) {
        issues.push({
          code: 'KQV007',
          ruleId: 'total-relationships-budget-exceeded',
          category: this.meta.category,
          severity: 'medium',
          filePath: node.filePath,
          message: `Page has ${outCount} total connections, exceeding the maximum permitted limit of ${maxTotal}.`,
          suggestedFix: `Refactor page to remove less relevant links.`,
          priority: 5
        });
      }

      // 4. Low Navigation Warnings
      // Only warn for major handbook articles
      if (node.type !== 'registry_variant' && node.type !== 'cheatsheet' && outCount === 0) {
        issues.push({
          code: 'KQV002', // Let's report it under missing related resources category
          ruleId: 'missing-related-resources',
          category: this.meta.category,
          severity: 'low',
          filePath: node.filePath,
          message: `Zero outgoing links: this page has no related content or navigation links.`,
          suggestedFix: 'Add relevant reference entries inside `related_content` list.',
          priority: 3
        });
      }
    }

    return issues;
  }
}
