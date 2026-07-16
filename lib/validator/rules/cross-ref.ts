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
      const targetKey = `${edge.targetType}:${edge.targetId}`;

      // Special case: Registry Family / Variant links (e.g. 'llama-3/3-3-70b')
      if (edge.targetType === 'registry_family' && edge.targetId.includes('/')) {
        const [familyId, variantId] = edge.targetId.split('/');
        const familyKey = `registry_family:${familyId}`;
        const variantKey = `registry_variant:${variantId}`;
        
        const hasFamily = graph.nodes.has(familyKey);
        const hasVariant = graph.nodes.has(variantKey);
        
        if (hasFamily && hasVariant) {
          // Check if variant belongs to the family (implicit edges are added in context.ts)
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
        targetNodeExists = graph.nodes.has(targetKey);
      }

      if (!targetNodeExists) {
        const sourceKey = `${edge.sourceType}:${edge.sourceId}`;
        const sourceNode = graph.nodes.get(sourceKey);
        
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

    return issues;
  }
}
