import { ValidationContext, ValidationIssue, ValidationRule } from './rules/base.js';
import { SchemaValidationRule } from './rules/schema.js';
import { CrossRefRule } from './rules/cross-ref.js';
import { OrphanRule } from './rules/orphans.js';
import { RelatedRule } from './rules/related.js';
import { EmptyRule } from './rules/empty.js';
import { RegistryRule } from './rules/registry.js';

export class RuleEngine {
  private rules: ValidationRule[] = [];

  constructor() {
    this.registerDefaultRules();
  }

  registerRule(rule: ValidationRule) {
    this.rules.push(rule);
  }

  private registerDefaultRules() {
    this.registerRule(new SchemaValidationRule());
    this.registerRule(new CrossRefRule());
    this.registerRule(new OrphanRule());
    this.registerRule(new RelatedRule());
    this.registerRule(new EmptyRule());
    this.registerRule(new RegistryRule());
  }

  async run(context: ValidationContext, categoryFilter?: string): Promise<ValidationIssue[]> {
    const activeRules = categoryFilter
      ? this.rules.filter(rule => rule.meta.category.toLowerCase() === categoryFilter.toLowerCase())
      : this.rules;

    const allIssues: ValidationIssue[] = [];

    // Run rules concurrently since they are read-only
    const runPromises = activeRules.map(async rule => {
      try {
        const issues = await rule.validate(context);
        return issues;
      } catch (e) {
        // Fallback error logging if rule execution crashes
        return [{
          code: 'KQV_INTERNAL_ERR',
          ruleId: rule.meta.id,
          category: rule.meta.category,
          severity: 'critical' as const,
          filePath: 'N/A',
          message: `Rule engine execution crash inside '${rule.name}': ${(e as Error).message}`,
          priority: 10
        }];
      }
    });

    const results = await Promise.all(runPromises);
    for (const issues of results) {
      allIssues.push(...issues);
    }

    return allIssues;
  }

  getRegisteredRules(): readonly ValidationRule[] {
    return this.rules;
  }
}
