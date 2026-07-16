import { ValidationRule, ValidationContext, ValidationIssue } from './base.js';

export class EmptyRule implements ValidationRule {
  meta = {
    id: 'KQV009',
    category: 'completeness',
    severity: 'high' as const,
    autofix: false,
    docs: '/docs/kqv/rules/empty.md'
  };

  name = 'Empty and Placeholder Check';
  description = 'Scans the entire page content recursively to detect empty arrays, empty objects, and placeholder strings (e.g., TODO, Coming Soon, TBD, Lorem Ipsum).';

  async validate(context: ValidationContext): Promise<ValidationIssue[]> {
    const issues: ValidationIssue[] = [];
    const { graph } = context;

    const PLACEHOLDER_SUBSTRINGS = [
      'placeholder',
      'todo',
      'tbd',
      'coming soon',
      'lorem ipsum',
      '# instantiate model here',
      'use when you need a',
      'avoid when resources are highly constrained',
      'well established architecture',
      'requires modern hardware'
    ];

    function checkValue(val: unknown, filePath: string, fieldPath: string): void {
      if (typeof val === 'string') {
        const lowerVal = val.toLowerCase();
        for (const sub of PLACEHOLDER_SUBSTRINGS) {
          if (lowerVal.includes(sub)) {
            issues.push({
              code: 'KQV009',
              ruleId: 'placeholder-found',
              category: 'completeness',
              severity: 'high',
              filePath,
              message: `Placeholder text found in field '${fieldPath}': "${val.substring(0, 100)}"`,
              suggestedFix: 'Replace draft placeholders with actual technical engineering details.',
              priority: 7
            });
            break;
          }
        }
      } else if (Array.isArray(val)) {
        if (val.length === 0) {
          // Certain array fields shouldn't be empty
          const criticalFields = ['symptoms', 'solutions', 'steps', 'examples', 'tradeoffs', 'options', 'sources'];
          const fieldName = fieldPath.split('.').pop() || '';
          if (criticalFields.includes(fieldName)) {
            issues.push({
              code: 'KQV009',
              ruleId: 'empty-array-field',
              category: 'completeness',
              severity: 'high',
              filePath,
              message: `Required content field '${fieldPath}' is empty.`,
              suggestedFix: `Add entries to populate this content list.`,
              priority: 7
            });
          }
        } else {
          val.forEach((item, idx) => checkValue(item, filePath, `${fieldPath}[${idx}]`));
        }
      } else if (val && typeof val === 'object') {
        const obj = val as Record<string, unknown>;
        for (const key in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, key)) {
            // Skip checking code blocks for double escaped characters or raw syntax where todo might be a comment
            if (key === 'code' || key === 'snippet' || key === 'example') continue;
            checkValue(obj[key], filePath, fieldPath ? `${fieldPath}.${key}` : key);
          }
        }
      }
    }

    for (const node of graph.nodes.values()) {
      if (!node.data) continue;
      checkValue(node.data, node.filePath, '');
    }

    return issues;
  }
}
