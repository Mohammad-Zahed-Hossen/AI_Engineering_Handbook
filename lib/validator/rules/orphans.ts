import { ValidationRule, ValidationContext, ValidationIssue } from './base.js';

export class OrphanRule implements ValidationRule {
  meta = {
    id: 'KQV006',
    category: 'navigation',
    severity: 'medium' as const,
    autofix: false,
    docs: '/docs/kqv/rules/orphans.md'
  };

  name = 'Orphan Detection';
  description = 'Detects content pages that are never referenced by any other page in the knowledge graph, and suggests links based on shared tag overlaps.';

  async validate(context: ValidationContext): Promise<ValidationIssue[]> {
    const issues: ValidationIssue[] = [];
    const { graph } = context;

    // We check for orphans on major pages. Registry variants are skipped because they are dynamically resolved under their family parent
    const trackableOrphanTypes = new Set([
      'package',
      'model',
      'workflow',
      'cheatsheet',
      'registry_family',
      'pattern',
      'debug_guide',
      'decision_guide',
      'principle'
    ]);

    for (const [key, node] of graph.nodes.entries()) {
      if (!trackableOrphanTypes.has(node.type)) continue;

      const inEdges = graph.incoming.get(key) || [];
      
      // If no incoming edges point to this page, it is an orphan
      if (inEdges.length === 0) {
        // Find suggested parents/related pages based on tag overlaps
        const suggestedParents: string[] = [];
        const orphanData = node.data as { tags?: string[] } | undefined;
        const orphanTags = new Set(orphanData?.tags || []);

        if (orphanTags.size > 0) {
          const matches: Array<{ key: string; overlap: number }> = [];

          for (const [otherKey, otherNode] of graph.nodes.entries()) {
            if (otherKey === key || !trackableOrphanTypes.has(otherNode.type)) continue;
            
            const otherData = otherNode.data as { tags?: string[] } | undefined;
            const otherTags = otherData?.tags || [];
            let overlapCount = 0;
            for (const tag of otherTags) {
              if (orphanTags.has(tag)) overlapCount++;
            }

            if (overlapCount > 0) {
              matches.push({ key: otherKey, overlap: overlapCount });
            }
          }

          // Sort matches by tag overlap descending
          matches.sort((a, b) => b.overlap - a.overlap);
          
          // Get top 3
          suggestedParents.push(...matches.slice(0, 3).map(m => {
            const n = graph.nodes.get(m.key);
            return n ? `${n.type}/${n.id}` : m.key;
          }));
        }

        const fixMsg = suggestedParents.length > 0
          ? `Add a reference link pointing to this page from: ${suggestedParents.join(', ')}.`
          : 'Reference this page in related workflows, patterns, or packages.';

        issues.push({
          code: 'KQV006',
          ruleId: this.meta.id,
          category: this.meta.category,
          severity: this.meta.severity,
          filePath: node.filePath,
          message: `Orphaned page: No other pages link to this ${node.type} page.`,
          suggestedFix: fixMsg,
          priority: 5,
          relatedPages: suggestedParents
        });
      }
    }

    return issues;
  }
}
