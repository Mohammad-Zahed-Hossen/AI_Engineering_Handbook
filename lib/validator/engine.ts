import { ValidationContext, ValidationIssue, ValidationRule } from './rules/base.js';
import { SchemaValidationRule } from './rules/schema.js';
import { ParentReferenceRule } from './rules/parent-ref.js';
import { CrossRefRule } from './rules/cross-ref.js';
import { RelatedRule } from './rules/related.js';
import { EmptyRule } from './rules/empty.js';
import { OrphanRule } from './rules/orphans.js';
import { RegistryRule } from './rules/registry.js';
import { MetadataConsistencyRule } from './rules/metadata-consistency.js';
import { SearchMetadataRule } from './rules/search-metadata.js';
import { URLFormatRule } from './rules/url-format.js';

export class RuleEngine {
  private rules: ValidationRule[] = [];

  constructor() {
    this.registerDefaultRules();
  }

  registerRule(rule: ValidationRule) {
    this.rules.push(rule);
  }

  private registerDefaultRules() {
    // Registered in strict execution order:
    // 1. Schema
    this.registerRule(new SchemaValidationRule());
    // 2. Parent References
    this.registerRule(new ParentReferenceRule());
    // 3. Relationships & Cross-references
    this.registerRule(new CrossRefRule());
    this.registerRule(new RelatedRule());
    // 4. Content Completeness & Registry
    this.registerRule(new EmptyRule());
    this.registerRule(new OrphanRule());
    this.registerRule(new RegistryRule());
    // 5. Metadata Consistency
    this.registerRule(new MetadataConsistencyRule());
    // 6. Search Metadata Integrity
    this.registerRule(new SearchMetadataRule());
    // 7. URL Format Verification
    this.registerRule(new URLFormatRule());
  }

  async run(context: ValidationContext, categoryFilter?: string): Promise<ValidationIssue[]> {
    const activeRules = categoryFilter
      ? this.rules.filter(rule => rule.meta.category.toLowerCase() === categoryFilter.toLowerCase())
      : this.rules;

    const allIssues: ValidationIssue[] = [];

    // Run rules sequentially according to execution pipeline order
    for (const rule of activeRules) {
      try {
        const issues = await rule.validate(context);
        allIssues.push(...issues);
      } catch (e) {
        allIssues.push({
          code: 'KQV_INTERNAL_ERR',
          ruleId: rule.meta.id,
          category: rule.meta.category,
          severity: 'critical' as const,
          filePath: 'N/A',
          message: `Rule engine execution crash inside '${rule.name}': ${(e as Error).message}`,
          priority: 10
        });
      }
    }

    return allIssues;
  }

  getRegisteredRules(): readonly ValidationRule[] {
    return this.rules;
  }
}
