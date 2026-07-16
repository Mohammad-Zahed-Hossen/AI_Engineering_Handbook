import path from 'node:path';
import { ValidationRule, ValidationContext, ValidationIssue } from './base.js';

export class RegistryRule implements ValidationRule {
  meta = {
    id: 'KQV012',
    category: 'registry',
    severity: 'high' as const,
    autofix: false,
    docs: '/docs/kqv/rules/registry.md'
  };

  name = 'Registry Integrity';
  description = 'Ensures every model registry family directory contains variant files, and checks family/variant field alignments.';

  async validate(context: ValidationContext): Promise<ValidationIssue[]> {
    const issues: ValidationIssue[] = [];
    const { graph } = context;

    // Group variants by family
    const familyToVariantsMap = new Map<string, string[]>(); // familyId -> variantIds[]

    for (const node of graph.nodes.values()) {
      if (node.type === 'registry_variant') {
        const data = node.data as { family_id?: string } | undefined;
        const familyId = data?.family_id;
        if (familyId) {
          const list = familyToVariantsMap.get(familyId) || [];
          list.push(node.id);
          familyToVariantsMap.set(familyId, list);
        }
      }
    }

    for (const node of graph.nodes.values()) {
      if (node.type === 'registry_family') {
        const variants = familyToVariantsMap.get(node.id) || [];
        
        // 1. Family without variants detection
        if (variants.length === 0) {
          issues.push({
            code: 'KQV012',
            ruleId: this.meta.id,
            category: this.meta.category,
            severity: 'high',
            filePath: node.filePath,
            message: `Registry Family '${node.id}' has no variants. At least one variant JSON must be defined in the family directory.`,
            suggestedFix: `Create a variant JSON file (e.g. '8b.json') inside the registry family directory: '${path.dirname(node.filePath)}/'.`,
            priority: 8
          });
        }
      }

      if (node.type === 'registry_variant') {
        const data = node.data as { family_id?: string; downloads?: unknown[] } | undefined;
        const familyId = data?.family_id;
        
        // 2. Variant ID inconsistency detection
        if (!familyId) {
          issues.push({
            code: 'KQV013',
            ruleId: 'registry-variant-missing-family-id',
            category: this.meta.category,
            severity: 'high',
            filePath: node.filePath,
            message: `Registry variant is missing the required 'family_id' property.`,
            suggestedFix: `Add '"family_id": "${path.basename(path.dirname(node.filePath))}"' to the variant data.`,
            priority: 9
          });
          continue;
        }

        const familyKey = `registry_family:${familyId}`;
        const familyNode = graph.nodes.get(familyKey);

        if (!familyNode) {
          issues.push({
            code: 'KQV013',
            ruleId: 'registry-variant-broken-family-reference',
            category: this.meta.category,
            severity: 'critical',
            filePath: node.filePath,
            message: `Registry variant references family ID '${familyId}', but that family index does not exist.`,
            suggestedFix: `Verify that family folder exists under 'data/registry/families/${familyId}' and contains an '_index.json' file.`,
            priority: 10
          });
          continue;
        }

        // Verify folder structure matches family_id
        const expectedFamilyDirName = path.basename(path.dirname(node.filePath));
        if (familyId !== expectedFamilyDirName) {
          issues.push({
            code: 'KQV013',
            ruleId: 'registry-variant-folder-mismatch',
            category: this.meta.category,
            severity: 'high',
            filePath: node.filePath,
            message: `Registry variant is located in folder '${expectedFamilyDirName}' but declares 'family_id' as '${familyId}'.`,
            suggestedFix: `Move variant file to the correct directory or update the 'family_id' property.`,
            priority: 9
          });
        }

        // Verify downloads existence
        if (!data?.downloads || !Array.isArray(data.downloads) || data.downloads.length === 0) {
          issues.push({
            code: 'KQV013',
            ruleId: 'registry-variant-missing-downloads',
            category: this.meta.category,
            severity: 'high',
            filePath: node.filePath,
            message: `Registry variant is missing official download links (e.g. HuggingFace, Ollama URLs).`,
            suggestedFix: `Add a 'downloads' array with platform and url info inside the variant data.`,
            priority: 8
          });
        }
      }
    }

    return issues;
  }
}
