import { ValidationRule, ValidationContext, ValidationIssue } from './base.js';

export class MetadataConsistencyRule implements ValidationRule {
  meta = {
    id: 'KQV018',
    category: 'ownership',
    severity: 'high' as const,
    autofix: false,
    docs: '/docs/kqv/rules/metadata-consistency.md'
  };

  name = 'Metadata Cross-Field Consistency';
  description = 'Verifies ISO date formatting, date chronological ordering (created_at <= updated_at), and valid governance enum values.';

  async validate(context: ValidationContext): Promise<ValidationIssue[]> {
    const issues: ValidationIssue[] = [];
    const { graph } = context;

    const VALID_CANONICAL_STATUS = new Set(['canonical', 'reference', 'generated']);
    const VALID_LIFECYCLE = new Set(['draft', 'verified', 'stable', 'deprecated', 'archived']);
    const VALID_STABILITY = new Set(['stable', 'semi_stable', 'volatile']);
    const VALID_CONFIDENCE = new Set(['verified', 'production_proven', 'community_accepted', 'experimental', 'research']);
    const VALID_MATURITY = new Set(['research', 'experimental', 'emerging', 'production_ready', 'legacy']);

    for (const node of graph.getAllNodes()) {
      if (node.type === 'problem') continue;
      const data = node.data as Record<string, unknown> | null;
      if (!data) continue;

      // 1. Date format & chronological ordering check
      const createdAtRaw = typeof data.created_at === 'string' ? data.created_at : (typeof data.createdat === 'string' ? data.createdat : undefined);
      const updatedAtRaw = typeof data.updated_at === 'string' ? data.updated_at : (typeof data.updatedat === 'string' ? data.updatedat : undefined);

      let createdTime: number | undefined;
      let updatedTime: number | undefined;

      if (createdAtRaw) {
        const time = Date.parse(createdAtRaw);
        if (isNaN(time)) {
          issues.push({
            code: 'KQV018',
            ruleId: 'invalid-created-at-date',
            category: this.meta.category,
            severity: 'high',
            filePath: node.filePath,
            message: `Invalid created_at date format: '${createdAtRaw}'. Expected valid ISO date.`,
            suggestedFix: 'Format date as YYYY-MM-DD or ISO 8601.',
            priority: 8
          });
        } else {
          createdTime = time;
        }
      }

      if (updatedAtRaw) {
        const time = Date.parse(updatedAtRaw);
        if (isNaN(time)) {
          issues.push({
            code: 'KQV018',
            ruleId: 'invalid-updated-at-date',
            category: this.meta.category,
            severity: 'high',
            filePath: node.filePath,
            message: `Invalid updated_at date format: '${updatedAtRaw}'. Expected valid ISO date.`,
            suggestedFix: 'Format date as YYYY-MM-DD or ISO 8601.',
            priority: 8
          });
        } else {
          updatedTime = time;
        }
      }

      if (createdTime !== undefined && updatedTime !== undefined) {
        if (createdTime > updatedTime) {
          issues.push({
            code: 'KQV018',
            ruleId: 'chronological-date-inversion',
            category: this.meta.category,
            severity: 'high',
            filePath: node.filePath,
            message: `Chronological date inversion: created_at (${createdAtRaw}) is after updated_at (${updatedAtRaw}).`,
            suggestedFix: 'Ensure created_at date is before or equal to updated_at date.',
            priority: 8
          });
        }
      }

      // 2. Governance Enum Values check
      if (data.canonical_status && typeof data.canonical_status === 'string' && !VALID_CANONICAL_STATUS.has(data.canonical_status)) {
        issues.push({
          code: 'KQV018',
          ruleId: 'invalid-canonical-status',
          category: this.meta.category,
          severity: 'high',
          filePath: node.filePath,
          message: `Invalid canonical_status: '${data.canonical_status}'. Allowed values: ${Array.from(VALID_CANONICAL_STATUS).join(', ')}.`,
          suggestedFix: 'Set canonical_status to a valid enum option.',
          priority: 8
        });
      }

      if (data.lifecycle && typeof data.lifecycle === 'string' && !VALID_LIFECYCLE.has(data.lifecycle)) {
        issues.push({
          code: 'KQV018',
          ruleId: 'invalid-lifecycle-state',
          category: this.meta.category,
          severity: 'high',
          filePath: node.filePath,
          message: `Invalid lifecycle state: '${data.lifecycle}'. Allowed values: ${Array.from(VALID_LIFECYCLE).join(', ')}.`,
          suggestedFix: 'Set lifecycle state to a valid enum option.',
          priority: 8
        });
      }

      if (data.stability && typeof data.stability === 'string' && !VALID_STABILITY.has(data.stability)) {
        issues.push({
          code: 'KQV018',
          ruleId: 'invalid-stability-level',
          category: this.meta.category,
          severity: 'high',
          filePath: node.filePath,
          message: `Invalid stability level: '${data.stability}'. Allowed values: ${Array.from(VALID_STABILITY).join(', ')}.`,
          suggestedFix: 'Set stability level to a valid enum option.',
          priority: 8
        });
      }

      if (data.confidence && typeof data.confidence === 'string' && !VALID_CONFIDENCE.has(data.confidence)) {
        issues.push({
          code: 'KQV018',
          ruleId: 'invalid-confidence-level',
          category: this.meta.category,
          severity: 'high',
          filePath: node.filePath,
          message: `Invalid confidence level: '${data.confidence}'. Allowed values: ${Array.from(VALID_CONFIDENCE).join(', ')}.`,
          suggestedFix: 'Set confidence level to a valid enum option.',
          priority: 8
        });
      }

      if (data.engineering_maturity && typeof data.engineering_maturity === 'string' && !VALID_MATURITY.has(data.engineering_maturity)) {
        issues.push({
          code: 'KQV018',
          ruleId: 'invalid-engineering-maturity',
          category: this.meta.category,
          severity: 'high',
          filePath: node.filePath,
          message: `Invalid engineering maturity: '${data.engineering_maturity}'. Allowed values: ${Array.from(VALID_MATURITY).join(', ')}.`,
          suggestedFix: 'Set engineering_maturity to a valid enum option.',
          priority: 8
        });
      }
    }

    return issues;
  }
}
