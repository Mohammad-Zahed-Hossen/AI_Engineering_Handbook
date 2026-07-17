import fs from 'node:fs';
import path from 'node:path';
import {
  PackageSchema,
  ModelSchema,
  RegistryFamilySchema,
  RegistryVariantSchema,
  WorkflowSchema,
  CheatsheetSchema,
  PatternSchema,
  DebugGuideSchema,
  DecisionGuideSchema,
  PrincipleSchema,
} from '../schemas/index.js';

export interface GraphNode {
  id: string;         // e.g. 'numpy'
  type: string;       // e.g. 'package' | 'model' | 'workflow' | 'cheatsheet' | 'registry_family' | 'registry_variant' | 'pattern' | 'debug_guide' | 'decision_guide' | 'principle'
  filePath: string;
  data: unknown;      // Parsed json data
  isValid: boolean;   // True if zod schema parsed successfully
}

export interface GraphEdge {
  sourceId: string;
  sourceType: string;
  targetId: string;
  targetType: string;
  relationshipType: string;
}

export class KnowledgeGraph {
  nodes = new Map<string, GraphNode>();               // Key: 'type:id'
  edges: GraphEdge[] = [];
  outgoing = new Map<string, GraphEdge[]>();          // Key: 'type:id'
  incoming = new Map<string, GraphEdge[]>();          // Key: 'type:id'
  
  slugToNode = new Map<string, GraphNode>();          // Key: slug
  tagToNodes = new Map<string, string[]>();           // Key: tag -> Array of 'type:id'
  aliasToNodes = new Map<string, string[]>();         // Key: alias -> Array of 'type:id'
  urlToNodes = new Map<string, string[]>();           // Key: URL -> Array of 'type:id'

  addNode(node: GraphNode) {
    const key = `${node.type}:${node.id}`;
    this.nodes.set(key, node);
    
    if (node.data && typeof node.data === 'object') {
      const obj = node.data as {
        slug?: unknown;
        tags?: unknown[];
        aliases?: unknown[];
        sources?: unknown[];
        github_repo?: unknown;
        references?: unknown[];
      };
      
      // Map slug
      if (obj.slug && typeof obj.slug === 'string') {
        this.slugToNode.set(obj.slug, node);
      }
      
      // Map tags
      if (Array.isArray(obj.tags)) {
        for (const tag of obj.tags) {
          if (typeof tag === 'string') {
            const list = this.tagToNodes.get(tag) || [];
            list.push(key);
            this.tagToNodes.set(tag, list);
          }
        }
      }
      
      // Map aliases
      if (Array.isArray(obj.aliases)) {
        for (const alias of obj.aliases) {
          if (typeof alias === 'string') {
            const list = this.aliasToNodes.get(alias) || [];
            list.push(key);
            this.aliasToNodes.set(alias, list);
          }
        }
      }

      // Map URLs (from sources or references)
      const urls: string[] = [];
      if (Array.isArray(obj.sources)) {
        for (const src of obj.sources) {
          if (typeof src === 'string') {
            urls.push(src);
          } else if (src && typeof src === 'object' && 'url' in src) {
            const s = src as Record<string, unknown>;
            if (typeof s.url === 'string') {
              urls.push(s.url);
            }
          }
        }
      }
      if (obj.github_repo && typeof obj.github_repo === 'string') {
        urls.push(obj.github_repo);
      }
      
      // Registry reference list checks
      if (Array.isArray(obj.references)) {
        for (const ref of obj.references) {
          if (ref && typeof ref === 'object' && 'url' in ref) {
            const r = ref as Record<string, unknown>;
            if (typeof r.url === 'string') {
              urls.push(r.url);
            }
          }
        }
      }

      for (const url of urls) {
        const list = this.urlToNodes.get(url) || [];
        if (!list.includes(key)) {
          list.push(key);
          this.urlToNodes.set(url, list);
        }
      }
    }
  }

  addEdge(edge: GraphEdge) {
    this.edges.push(edge);
    
    const sourceKey = `${edge.sourceType}:${edge.sourceId}`;
    const targetKey = `${edge.targetType}:${edge.targetId}`;
    
    const outList = this.outgoing.get(sourceKey) || [];
    outList.push(edge);
    this.outgoing.set(sourceKey, outList);
    
    const inList = this.incoming.get(targetKey) || [];
    inList.push(edge);
    this.incoming.set(targetKey, inList);
  }
}

// Scans directory for JSON files, excluding files starting with '_' (except _index.json)
function getJsonFiles(dir: string): string[] {
  let results: string[] = [];
  if (!fs.existsSync(dir)) return results;
  
  for (const file of fs.readdirSync(dir)) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      results = results.concat(getJsonFiles(filePath));
    } else if (file.endsWith('.json') && (file === '_index.json' || !file.startsWith('_'))) {
      results.push(filePath);
    }
  }
  return results;
}

export function detectContentType(normalizedPath: string, isIndexFile: boolean): string | null {
  if (normalizedPath.startsWith('data/packages/')) return 'package';
  if (normalizedPath.startsWith('data/models/')) return 'model';
  if (normalizedPath.startsWith('data/workflows/')) return 'workflow';
  if (normalizedPath.startsWith('data/cheatsheets/')) return 'cheatsheet';
  if (normalizedPath.startsWith('data/registry/families/')) {
    return isIndexFile ? 'registry_family' : 'registry_variant';
  }
  if (normalizedPath.startsWith('data/registry/')) return 'registry_family'; // Legacy, maps as family
  if (normalizedPath.startsWith('data/patterns/')) return 'pattern';
  if (normalizedPath.startsWith('data/debug-guides/')) return 'debug_guide';
  if (normalizedPath.startsWith('data/decision-guides/')) return 'decision_guide';
  if (normalizedPath.startsWith('data/principles/')) return 'principle';
  return null;
}

export function getZodSchema(contentType: string): import('zod').ZodTypeAny | null {
  switch (contentType) {
    case 'package': return PackageSchema;
    case 'model': return ModelSchema;
    case 'workflow': return WorkflowSchema;
    case 'cheatsheet': return CheatsheetSchema;
    case 'registry_family': return RegistryFamilySchema;
    case 'registry_variant': return RegistryVariantSchema;
    case 'pattern': return PatternSchema;
    case 'debug_guide': return DebugGuideSchema;
    case 'decision_guide': return DecisionGuideSchema;
    case 'principle': return PrincipleSchema;
    default: return null;
  }
}

export async function buildValidationContext(): Promise<{
  graph: KnowledgeGraph;
  registeredTags: Set<string>;
  registeredAliases: Set<string>;
  errors: string[];
}> {
  const graph = new KnowledgeGraph();
  const errors: string[] = [];
  
  // Load official tags/aliases
  let registeredTags = new Set<string>();
  let registeredAliases = new Set<string>();
  
  const registeredTagsPath = path.join(process.cwd(), 'data', 'registered-tags.json');
  const registeredAliasesPath = path.join(process.cwd(), 'data', 'registered-aliases.json');
  
  if (fs.existsSync(registeredTagsPath)) {
    try {
      const content = fs.readFileSync(registeredTagsPath, 'utf-8');
      registeredTags = new Set(JSON.parse(content));
    } catch (e) {
      errors.push(`Failed to parse data/registered-tags.json: ${(e as Error).message}`);
    }
  }
  if (fs.existsSync(registeredAliasesPath)) {
    try {
      const content = fs.readFileSync(registeredAliasesPath, 'utf-8');
      registeredAliases = new Set(JSON.parse(content));
    } catch (e) {
      errors.push(`Failed to parse data/registered-aliases.json: ${(e as Error).message}`);
    }
  }
  
  const dataDir = path.join(process.cwd(), 'data');
  const files = getJsonFiles(dataDir);
  
  // First pass: scan all nodes
  for (const file of files) {
    const relativePath = path.relative(process.cwd(), file);
    const normalizedPath = relativePath.replace(/\\/g, '/');
    const isIndexFile = file.endsWith('_index.json');
    
    const contentType = detectContentType(normalizedPath, isIndexFile);
    if (!contentType) continue; // Skip configuration/navigation files
    
    let rawContent: string;
    let data: unknown;
    try {
      rawContent = fs.readFileSync(file, 'utf-8');
      data = JSON.parse(rawContent);
    } catch (e) {
      errors.push(`JSON parse error in '${normalizedPath}': ${(e as Error).message}`);
      continue;
    }
    
    const parsedData = data as Record<string, unknown> | null;
    const baseName = path.basename(file, '.json');
    // Expected ID is directory name for _index.json files (families), filename otherwise
    const expectedId = baseName === '_index'
      ? path.basename(path.dirname(file))
      : baseName;
      
    const declaredId = (parsedData && typeof parsedData.id === 'string' ? parsedData.id : '') || expectedId;
    
    // Check if valid schema parsed
    const schema = getZodSchema(contentType);
    let isValid = false;
    if (schema) {
      const result = schema.safeParse(data);
      isValid = result.success;
    }
    
    graph.addNode({
      id: declaredId,
      type: contentType,
      filePath: normalizedPath,
      data,
      isValid
    });
  }
  
  // Second pass: construct directed graph edges
  for (const node of graph.nodes.values()) {
    if (!node.data || typeof node.data !== 'object') continue;
    const obj = node.data as Record<string, unknown>;
    
    // Related Content (standard field)
    let relatedContentList: unknown[] = [];
    if (node.type === 'model') {
      relatedContentList = (obj.relatedcontent as unknown[]) || [];
    } else {
      relatedContentList = (obj.related_content as unknown[]) || [];
    }
    
    if (Array.isArray(relatedContentList)) {
      for (const ref of relatedContentList) {
        if (ref && typeof ref === 'object' && 'id' in ref && 'type' in ref) {
          const r = ref as Record<string, unknown>;
          if (typeof r.id === 'string' && typeof r.type === 'string') {
            graph.addEdge({
              sourceId: node.id,
              sourceType: node.type,
              targetId: r.id,
              targetType: mapConfigRefType(r.type),
              relationshipType: (r.relationship as string) || (r.relationship_type as string) || 'related_to'
            });
          }
        }
      }
    }
    
    // Alternatives (standard package/pattern/guide field)
    if (node.type !== 'model' && Array.isArray(obj.alternatives)) {
      for (const alt of obj.alternatives) {
        if (alt && typeof alt === 'object' && 'id' in alt && 'type' in alt) {
          const a = alt as Record<string, unknown>;
          if (typeof a.id === 'string' && typeof a.type === 'string') {
            graph.addEdge({
              sourceId: node.id,
              sourceType: node.type,
              targetId: a.id,
              targetType: mapConfigRefType(a.type),
              relationshipType: (a.relationship_type as string) || 'alternative_to'
            });
          }
        }
      }
    }
    
    // Type-specific relationship fields
    const relationshipMappings: Array<{ field: string; expectedType: string; relName: string }> = [];
    
    if (node.type === 'pattern') {
      relationshipMappings.push(
        { field: 'related_workflows', expectedType: 'workflow', relName: 'uses_workflow' },
        { field: 'related_models', expectedType: 'model', relName: 'uses_model' },
        { field: 'related_packages', expectedType: 'package', relName: 'uses_package' },
        { field: 'related_principles', expectedType: 'principle', relName: 'references_principle' },
        { field: 'related_debug_guides', expectedType: 'debug_guide', relName: 'uses_debug_guide' },
        { field: 'related_decision_guides', expectedType: 'decision_guide', relName: 'uses_decision_guide' }
      );
    } else if (node.type === 'workflow') {
      relationshipMappings.push(
        { field: 'related_patterns', expectedType: 'pattern', relName: 'uses_pattern' },
        { field: 'related_models', expectedType: 'model', relName: 'uses_model' },
        { field: 'related_packages', expectedType: 'package', relName: 'uses_package' },
        { field: 'related_debug_guides', expectedType: 'debug_guide', relName: 'uses_debug_guide' },
        { field: 'related_decision_guides', expectedType: 'decision_guide', relName: 'uses_decision_guide' }
      );
    } else if (node.type === 'debug_guide') {
      relationshipMappings.push(
        { field: 'related_workflows', expectedType: 'workflow', relName: 'associated_workflow' },
        { field: 'related_patterns', expectedType: 'pattern', relName: 'associated_pattern' },
        { field: 'related_models', expectedType: 'model', relName: 'associated_model' },
        { field: 'related_packages', expectedType: 'package', relName: 'associated_package' },
        { field: 'related_registry', expectedType: 'registry_family', relName: 'associated_registry' },
        { field: 'related_decision_guides', expectedType: 'decision_guide', relName: 'associated_decision_guide' }
      );
    } else if (node.type === 'decision_guide') {
      relationshipMappings.push(
        { field: 'related_workflows', expectedType: 'workflow', relName: 'decides_workflow' },
        { field: 'related_models', expectedType: 'model', relName: 'decides_model' },
        { field: 'related_packages', expectedType: 'package', relName: 'decides_package' },
        { field: 'related_patterns', expectedType: 'pattern', relName: 'decides_pattern' },
        { field: 'related_debug_guides', expectedType: 'debug_guide', relName: 'troubleshooting_for' },
        { field: 'related_registry', expectedType: 'registry_family', relName: 'decides_registry' },
        { field: 'related_decision_guides', expectedType: 'decision_guide', relName: 'related_to' }
      );
    } else if (node.type === 'principle') {
      relationshipMappings.push(
        { field: 'referenced_by_patterns', expectedType: 'pattern', relName: 'principle_referenced_by_pattern' },
        { field: 'referenced_by_models', expectedType: 'model', relName: 'principle_referenced_by_model' },
        { field: 'referenced_by_workflows', expectedType: 'workflow', relName: 'principle_referenced_by_workflow' }
      );
    } else if (node.type === 'registry_family' || node.type === 'registry_variant') {
      // Registry uses related_models structure
      const relatedModels = obj.related_models;
      if (Array.isArray(relatedModels)) {
        for (const rel of relatedModels) {
          if (rel && typeof rel === 'object' && 'id' in rel) {
            const r = rel as Record<string, unknown>;
            if (typeof r.id === 'string') {
              graph.addEdge({
                sourceId: node.id,
                sourceType: node.type,
                targetId: r.id,
                targetType: 'model', // registry references model pages
                relationshipType: (r.relationship as string) || (r.relationship_type as string) || 'related_to'
              });
            }
          }
        }
      }

      const relatedResources = obj.related_resources;
      if (Array.isArray(relatedResources)) {
        for (const rel of relatedResources) {
          if (rel && typeof rel === 'object' && 'resource_slug' in rel && 'resource_type' in rel) {
            const r = rel as Record<string, unknown>;
            if (typeof r.resource_slug === 'string' && typeof r.resource_type === 'string') {
              graph.addEdge({
                sourceId: node.id,
                sourceType: node.type,
                targetId: r.resource_slug,
                targetType: mapConfigRefType(r.resource_type),
                relationshipType: (r.relationship as string) || 'related_to'
              });
            }
          }
        }
      }
    }
    
    for (const mapping of relationshipMappings) {
      const relatedIds = obj[mapping.field];
      if (Array.isArray(relatedIds)) {
        for (const id of relatedIds) {
          if (typeof id === 'string') {
            graph.addEdge({
              sourceId: node.id,
              sourceType: node.type,
              targetId: id,
              targetType: mapping.expectedType,
              relationshipType: mapping.relName
            });
          }
        }
      }
    }

    // Add implicit edge from Registry Variant to parent Registry Family
    if (node.type === 'registry_variant') {
      // Find parent family ID from directory layout: data/registry/families/<family_id>/<variant_id>.json
      const parts = node.filePath.split('/');
      if (parts.length >= 4) {
        const familyId = parts[parts.length - 2];
        graph.addEdge({
          sourceId: node.id,
          sourceType: node.type,
          targetId: familyId,
          targetType: 'registry_family',
          relationshipType: 'variant_of'
        });
      }
    }
  }
  
  return {
    graph,
    registeredTags,
    registeredAliases,
    errors
  };
}

// Maps reference schema type names to graph node type names
function mapConfigRefType(refType: string): string {
  if (refType === 'registry') return 'registry_family';
  return refType;
}