import path from 'node:path';
import { ValidationRule, ValidationContext, ValidationIssue } from './base.js';

export class ParentReferenceRule implements ValidationRule {
  meta = {
    id: 'KQV016',
    category: 'completeness',
    severity: 'critical' as const,
    autofix: false,
    docs: '/docs/kqv/rules/parent-ref.md'
  };

  name = 'Parent Reference Integrity';
  description = 'Verifies that every parent-child reference across packages, cheatsheets, workflows, models, registry families, and problems resolves to a valid existing entity.';

  async validate(context: ValidationContext): Promise<ValidationIssue[]> {
    const issues: ValidationIssue[] = [];
    const { graph } = context;

    for (const node of graph.getAllNodes()) {
      const data = node.data as Record<string, unknown> | null;
      if (!data) continue;

      // 1. Cheatsheet -> Package reference check
      if (node.type === 'cheatsheet') {
        const pkgRef = data.package_reference as string | undefined;
        if (pkgRef) {
          const pkgKey = `package:${pkgRef}`;
          const isDirectMatch = graph.nodes.has(pkgKey);
          const isPrefixMatch = graph.nodes.has(`package:${pkgRef}-express`) || graph.nodes.has(`package:${pkgRef}-go`);

          if (!isDirectMatch && !isPrefixMatch) {
            issues.push({
              code: 'KQV016',
              ruleId: 'broken-package-reference',
              category: this.meta.category,
              severity: 'high',
              filePath: node.filePath,
              message: `Cheatsheet '${node.id}' references package '${pkgRef}' which is not in packages registry.`,
              suggestedFix: `Update package_reference in '${node.id}.json' to point to an existing package ID under data/packages/.`,
              priority: 8
            });
          }
        }
      }

      // 2. Registry Variant -> Registry Family reference check
      if (node.type === 'registry_variant') {
        let familyId = data.family as string | undefined;
        if (!familyId) {
          // Extract from relative directory path (e.g. data/registry/families/deepseek/r1.json)
          const dirName = path.basename(path.dirname(node.filePath));
          if (dirName && dirName !== 'families') {
            familyId = dirName;
          }
        }

        if (familyId) {
          const familyKey = `registry_family:${familyId}`;
          if (!graph.nodes.has(familyKey)) {
            issues.push({
              code: 'KQV016',
              ruleId: 'broken-registry-family',
              category: this.meta.category,
              severity: 'high',
              filePath: node.filePath,
              message: `Registry variant '${node.id}' references nonexistent parent family '${familyId}'.`,
              suggestedFix: `Check family ID spelling in '${node.filePath}'.`,
              priority: 8
            });
          }
        }
      }

      // 3. Model -> Category / Directory check
      if (node.type === 'model') {
        const relPath = node.filePath.replace(/\\/g, '/');
        const categoryMatch = relPath.match(/\/models\/(ml|dl|llm)\//);
        if (!categoryMatch) {
          issues.push({
            code: 'KQV016',
            ruleId: 'invalid-model-category',
            category: this.meta.category,
            severity: 'high',
            filePath: node.filePath,
            message: `Model '${node.id}' is not placed under a valid parent category directory (ml, dl, or llm).`,
            suggestedFix: 'Move model file into data/models/ml, data/models/dl, or data/models/llm.',
            priority: 8
          });
        }
      }

      // 4. Package Tasks -> Parent Package check
      if (node.type === 'package' && Array.isArray(data.tasks)) {
        data.tasks.forEach((task, idx) => {
          if (task && typeof task === 'object') {
            const t = task as Record<string, unknown>;
            if (!t.task || typeof t.task !== 'string' || !t.task.trim()) {
              issues.push({
                code: 'KQV016',
                ruleId: 'invalid-package-task-parent',
                category: this.meta.category,
                severity: 'high',
                filePath: node.filePath,
                message: `Package '${node.id}' task at index ${idx} is missing a valid task name.`,
                suggestedFix: 'Provide a valid "task" string name.',
                priority: 8
              });
            }
          }
        });
      }

      // 5. Cheatsheet Entries -> Parent Cheatsheet check
      if (node.type === 'cheatsheet' && Array.isArray(data.entries)) {
        data.entries.forEach((entry, idx) => {
          if (entry && typeof entry === 'object') {
            const e = entry as Record<string, unknown>;
            if (!e.problem || typeof e.problem !== 'string' || !e.problem.trim()) {
              issues.push({
                code: 'KQV016',
                ruleId: 'invalid-cheatsheet-entry-parent',
                category: this.meta.category,
                severity: 'high',
                filePath: node.filePath,
                message: `Cheatsheet '${node.id}' entry at index ${idx} is missing a valid problem title.`,
                suggestedFix: 'Provide a valid "problem" string name.',
                priority: 8
              });
            }
          }
        });
      }

      // 6. Workflow Steps -> Parent Workflow check
      if (node.type === 'workflow' && Array.isArray(data.steps)) {
        data.steps.forEach((step, idx) => {
          if (step && typeof step === 'object') {
            const s = step as Record<string, unknown>;
            if (!s.name || typeof s.name !== 'string' || !s.name.trim()) {
              issues.push({
                code: 'KQV016',
                ruleId: 'invalid-workflow-step-parent',
                category: this.meta.category,
                severity: 'high',
                filePath: node.filePath,
                message: `Workflow '${node.id}' step at index ${idx} is missing a valid step name.`,
                suggestedFix: 'Provide a valid step "name" string.',
                priority: 8
              });
            }
          }
        });
      }
    }

    return issues;
  }
}
