import path from 'node:path';
import { ValidationRule, ValidationContext, ValidationIssue } from './base.js';
import { getZodSchema } from '../context.js';

export class SchemaValidationRule implements ValidationRule {
  meta = {
    id: 'KQV001',
    category: 'schema',
    severity: 'critical' as const,
    autofix: false,
    docs: '/docs/kqv/rules/schema.md'
  };

  name = 'Schema Validation';
  description = 'Verifies that files conform to their Zod schema, slugs are well-formed, filenames match declared IDs, and tags/aliases are officially registered.';

  async validate(context: ValidationContext): Promise<ValidationIssue[]> {
    const issues: ValidationIssue[] = [];
    const { graph, config, registeredTags, registeredAliases } = context;

    const SLUG_REGEX = /^[a-z0-9][a-z0-9-]*[a-z0-9]$|^[a-z0-9]$/;

    for (const node of graph.nodes.values()) {
      const obj = node.data as { slug?: string; tags?: unknown[]; aliases?: unknown[] } | null;
      if (!obj || typeof obj !== 'object') {
        issues.push({
          code: 'KQV001',
          ruleId: this.meta.id,
          category: this.meta.category,
          severity: 'critical',
          filePath: node.filePath,
          message: 'File content is not a valid JSON object.',
          priority: 10
        });
        continue;
      }

      // 1. Zod Schema Verification
      if (!node.isValid) {
        const schema = getZodSchema(node.type);
        if (schema) {
          const parseResult = schema.safeParse(obj);
          if (!parseResult.success) {
            for (const issue of parseResult.error.issues) {
              const fieldPath = issue.path.join('.') || '(root)';
              issues.push({
                code: 'KQV001',
                ruleId: this.meta.id,
                category: this.meta.category,
                severity: 'critical',
                filePath: node.filePath,
                message: `Zod schema check failed on field '${fieldPath}': ${issue.message}`,
                suggestedFix: 'Fix the field type, structure, or content matching the Zod specification.',
                priority: 10
              });
            }
          }
        }
      }

      // 2. Filename ID Match check
      const baseName = path.basename(node.filePath, '.json');
      const expectedId = baseName === '_index'
        ? path.basename(path.dirname(node.filePath))
        : baseName;

      if (node.id !== expectedId) {
        issues.push({
          code: 'KQV002',
          ruleId: 'filename-mismatch',
          category: this.meta.category,
          severity: 'high',
          filePath: node.filePath,
          message: `Filename/ID mismatch: filename expected ID to be '${expectedId}', but declared id is '${node.id}'`,
          suggestedFix: `Change declared "id" to "${expectedId}" or rename the JSON file.`,
          priority: 9
        });
      }

      // 3. Slug Format check
      if (obj.slug && typeof obj.slug === 'string') {
        if (!SLUG_REGEX.test(obj.slug)) {
          issues.push({
            code: 'KQV003',
            ruleId: 'invalid-slug',
            category: this.meta.category,
            severity: 'high',
            filePath: node.filePath,
            message: `Invalid slug layout: '${obj.slug}'. Must match /^[a-z0-9][a-z0-9-]*[a-z0-9]$|^[a-z0-9]$/`,
            suggestedFix: `Update slug to match alphanumeric lowercase format (e.g. "${node.id}").`,
            priority: 8
          });
        }
      }

      // 4. Registered Tags check
      if (!config.validation_rules.allow_unregistered_tags && Array.isArray(obj.tags)) {
        for (const tag of obj.tags) {
          if (typeof tag === 'string' && !registeredTags.has(tag)) {
            issues.push({
              code: 'KQV010',
              ruleId: 'unregistered-tag',
              category: this.meta.category,
              severity: 'high',
              filePath: node.filePath,
              message: `Unregistered tag found: '${tag}'. Tags must be defined in data/registered-tags.json.`,
              suggestedFix: `Add '${tag}' to 'data/registered-tags.json' or use a registered tag.`,
              priority: 7
            });
          }
        }
      }

      // 5. Registered Aliases check
      if (!config.validation_rules.allow_unregistered_aliases && Array.isArray(obj.aliases)) {
        for (const alias of obj.aliases) {
          if (typeof alias === 'string' && !registeredAliases.has(alias)) {
            issues.push({
              code: 'KQV011',
              ruleId: 'unregistered-alias',
              category: this.meta.category,
              severity: 'high',
              filePath: node.filePath,
              message: `Unregistered alias found: '${alias}'. Aliases must be defined in data/registered-aliases.json.`,
              suggestedFix: `Add '${alias}' to 'data/registered-aliases.json' or use a registered alias.`,
              priority: 7
            });
          }
        }
      }
    }

    return issues;
  }
}
