import { ValidationRule, ValidationContext, ValidationIssue } from './base.js';

export class CrossRefRule implements ValidationRule {
  meta = {
    id: 'KQV004',
    category: 'navigation',
    severity: 'critical' as const,
    autofix: false,
    docs: '/docs/kqv/rules/cross-ref.md'
  };

  name = 'Cross Reference Integration';
  description = 'Ensures all references to other pages, packages, models, and registry files exist and verify bidirectional link constraints.';

  async validate(context: ValidationContext): Promise<ValidationIssue[]> {
    const issues: ValidationIssue[] = [];
    const { graph, config } = context;

    // 1. Validate Reference Integrity
    for (const edge of graph.edges) {
      let targetNodeExists = false;

      // Special case: Prerequisite checking
      if (edge.targetType === 'prerequisite') {
        const possibleTypes = ['package', 'workflow', 'model', 'pattern', 'debug_guide', 'registry_family', 'problem'];
        targetNodeExists = possibleTypes.some(type => graph.nodes.has(`${type}:${edge.targetId}`));
      } else if (edge.targetType === 'registry_family' && edge.targetId.includes('/')) {
        // Special case: Registry Family / Variant links (e.g. 'llama-3/3-3-70b')
        const [familyId, variantId] = edge.targetId.split('/');
        const familyKey = `registry_family:${familyId}`;
        const variantKey = `registry_variant:${variantId}`;
        
        const hasFamily = graph.nodes.has(familyKey);
        const hasVariant = graph.nodes.has(variantKey);
        
        if (hasFamily && hasVariant) {
          const variantBelongsToFamily = graph.edges.some(e => 
            e.sourceId === variantId &&
            e.sourceType === 'registry_variant' &&
            e.targetId === familyId &&
            e.targetType === 'registry_family' &&
            e.relationshipType === 'variant_of'
          );
          targetNodeExists = variantBelongsToFamily;
        }
      } else {
        const targetKey = `${edge.targetType}:${edge.targetId}`;
        targetNodeExists = graph.nodes.has(targetKey);
      }

      if (!targetNodeExists) {
        const sourceKey = `${edge.sourceType}:${edge.sourceId}`;
        const sourceNode = graph.nodes.get(sourceKey);
        
        if (edge.sourceType === 'problem') {
          issues.push({
            code: 'KQV004',
            ruleId: this.meta.id,
            category: this.meta.category,
            severity: 'critical',
            filePath: sourceNode ? sourceNode.filePath : 'data/problem-index/taxonomy.json',
            message: `Problem "${edge.sourceId}"\nInvalid ${edge.targetType.replace('_', ' ')} reference:\n${edge.targetId}\nExpected an existing ${edge.targetType.replace('_', ' ')} ID.`,
            suggestedFix: `Check if ID spelling is correct or make sure the target file exists under 'data/' folder.`,
            priority: 10,
            relatedPages: []
          });
        } else {
          issues.push({
            code: 'KQV004',
            ruleId: this.meta.id,
            category: this.meta.category,
            severity: 'critical',
            filePath: sourceNode ? sourceNode.filePath : 'Unknown source file',
            message: `Broken reference: ID '${edge.targetId}' (type '${edge.targetType}') not found. Target type requested as relationship type '${edge.relationshipType}'.`,
            suggestedFix: `Check if ID spelling is correct or make sure the target file exists under 'data/' folder.`,
            priority: 10,
            relatedPages: []
          });
        }
      }
    }

    // 2. Bidirectional Relationship Validation
    if (config.validation_rules.require_bidirectional_relationships) {
      // Define pairs of reciprocal relationship types
      // Key: relationshipType -> Value: Array of { sourceRole, targetRole, reciprocalType }
      const reciprocalPairs: Record<string, { reciprocalType: string; expectedTargetType?: string }> = {
        'uses_workflow': { reciprocalType: 'uses_pattern', expectedTargetType: 'workflow' },
        'uses_pattern': { reciprocalType: 'uses_workflow', expectedTargetType: 'pattern' },
        
        'uses_debug_guide': { reciprocalType: 'associated_pattern', expectedTargetType: 'debug_guide' },
        'associated_pattern': { reciprocalType: 'uses_debug_guide', expectedTargetType: 'pattern' },
        
        'associated_workflow': { reciprocalType: 'uses_debug_guide', expectedTargetType: 'workflow' },
        
        'references_principle': { reciprocalType: 'principle_referenced_by_pattern', expectedTargetType: 'principle' },
        'principle_referenced_by_pattern': { reciprocalType: 'references_principle', expectedTargetType: 'pattern' },
        
        'principle_referenced_by_model': { reciprocalType: 'references_principle', expectedTargetType: 'model' }
      };

      for (const edge of graph.edges) {
        if (edge.sourceType === 'problem') continue;
        const pairInfo = reciprocalPairs[edge.relationshipType];
        if (!pairInfo) continue; // Skip types without bidirectional checks

        const sourceKey = `${edge.sourceType}:${edge.sourceId}`;
        const targetKey = `${edge.targetType}:${edge.targetId}`;

        // Ensure the target node actually exists before verifying reciprocal
        if (!graph.nodes.has(targetKey)) continue;

        let expectedReciprocalType = pairInfo.reciprocalType;
        if (edge.relationshipType === 'uses_debug_guide') {
          if (edge.sourceType === 'workflow') {
            expectedReciprocalType = 'associated_workflow';
          } else if (edge.sourceType === 'pattern') {
            expectedReciprocalType = 'associated_pattern';
          }
        } else if (edge.relationshipType === 'references_principle') {
          if (edge.sourceType === 'model') {
            expectedReciprocalType = 'principle_referenced_by_model';
          } else if (edge.sourceType === 'pattern') {
            expectedReciprocalType = 'principle_referenced_by_pattern';
          }
        }

        // Check if there is a matching reciprocal edge
        const targetOutgoingEdges = graph.outgoing.get(targetKey) || [];
        const hasReciprocal = targetOutgoingEdges.some(targetEdge => 
          targetEdge.targetId === edge.sourceId &&
          targetEdge.targetType === edge.sourceType &&
          targetEdge.relationshipType === expectedReciprocalType
        );

        if (!hasReciprocal) {
          const sourceNode = graph.nodes.get(sourceKey);
          issues.push({
            code: 'KQV005',
            ruleId: 'bidirectional-violation',
            category: this.meta.category,
            severity: 'high',
            filePath: sourceNode ? sourceNode.filePath : 'Unknown source file',
            message: `Relationship integrity violation: '${sourceKey}' links to '${targetKey}' via '${edge.relationshipType}', but reciprocal link '${pairInfo.reciprocalType}' back is missing.`,
            suggestedFix: `Add reciprocal relationship in target page '${edge.targetType}/${edge.targetId}' matching relationship type '${pairInfo.reciprocalType}'.`,
            priority: 8,
            relatedPages: [targetKey]
          });
        }
      }
    }

    // 3. Problem Index Duplicate and Circular Validation
    const fs = await import('node:fs');
    const path = await import('node:path');
    const taxonomyPath = path.join(process.cwd(), 'data', 'problem-index', 'taxonomy.json');
    if (fs.existsSync(taxonomyPath)) {
      try {
        const taxonomy = JSON.parse(fs.readFileSync(taxonomyPath, 'utf-8'));
        const seenProblemIds = new Set<string>();
        
        for (const categoryData of Object.values(taxonomy)) {
          const catObj = categoryData as { problems?: Array<{ id: string; [key: string]: unknown }> };
          if (catObj && Array.isArray(catObj.problems)) {
            for (const problem of catObj.problems) {
              if (problem && typeof problem === 'object' && problem.id) {
                // Check duplicate problem IDs in the taxonomy file
                if (seenProblemIds.has(problem.id)) {
                  issues.push({
                    code: 'KQV004',
                    ruleId: this.meta.id,
                    category: this.meta.category,
                    severity: 'critical',
                    filePath: 'data/problem-index/taxonomy.json',
                    message: `Duplicate problem ID detected in taxonomy.json: "${problem.id}"`,
                    suggestedFix: `Ensure all problem IDs are unique in taxonomy.json.`,
                    priority: 9,
                    relatedPages: []
                  });
                }
                seenProblemIds.add(problem.id);

                // Check duplicate references within internal arrays
                const fieldsToCheck = [
                  'related_workflows', 'related_decision_guides', 'related_models', 
                  'related_patterns', 'related_packages', 'related_debug_guides', 
                  'related_registry', 'related_problems', 'requires'
                ];
                for (const field of fieldsToCheck) {
                  const list = problem[field];
                  if (Array.isArray(list)) {
                    const seenRefs = new Set<string>();
                    for (const refId of list) {
                      if (seenRefs.has(refId)) {
                        issues.push({
                          code: 'KQV004',
                          ruleId: this.meta.id,
                          category: this.meta.category,
                          severity: 'critical',
                          filePath: 'data/problem-index/taxonomy.json',
                          message: `Problem "${problem.id}"\nDuplicate reference ID found in field "${field}":\n${refId}`,
                          suggestedFix: `Remove the duplicate ID from the array in taxonomy.json.`,
                          priority: 9,
                          relatedPages: []
                        });
                      }
                      seenRefs.add(refId);
                    }
                  }
                }
              }
            }
          }
        }
      } catch {
        // Handled by context loader
      }
    }

    // 4. Circular Reference Detection between problems
    const problemNodes = Array.from(graph.nodes.values()).filter(n => n.type === 'problem');
    const visited = new Set<string>();
    const recStack = new Set<string>();
    const pathTrace: string[] = [];

    const dfs = (nodeId: string): string[] | null => {
      visited.add(nodeId);
      recStack.add(nodeId);
      pathTrace.push(nodeId);

      const problemKey = `problem:${nodeId}`;
      const outgoing = graph.outgoing.get(problemKey) || [];
      for (const edge of outgoing) {
        if (edge.targetType === 'problem') {
          const targetId = edge.targetId;
          if (!visited.has(targetId)) {
            const cycle = dfs(targetId);
            if (cycle) return cycle;
          } else if (recStack.has(targetId)) {
            return [...pathTrace, targetId];
          }
        }
      }

      recStack.delete(nodeId);
      pathTrace.pop();
      return null;
    };

    for (const node of problemNodes) {
      if (!visited.has(node.id)) {
        const cycle = dfs(node.id);
        if (cycle) {
          issues.push({
            code: 'KQV004',
            ruleId: this.meta.id,
            category: this.meta.category,
            severity: 'medium',
            filePath: 'data/problem-index/taxonomy.json',
            message: `Circular reference detected between problems: ${cycle.join(' -> ')}`,
            suggestedFix: `Remove circular dependencies between problems in taxonomy.json.`,
            priority: 5,
            relatedPages: cycle.map(id => `problem:${id}`)
          });
        }
      }
    }

    return issues;
  }
}
