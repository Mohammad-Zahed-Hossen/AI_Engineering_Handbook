import fs from 'node:fs';
import path from 'node:path';

// Types of nodes in the graph
type NodeType =
  | 'package'
  | 'model'
  | 'workflow'
  | 'cheatsheet'
  | 'registry_family'
  | 'registry_variant'
  | 'pattern'
  | 'debug_guide'
  | 'decision_guide'
  | 'principle'
  | 'problem';

interface RelationRef {
  id?: string;
  type?: string;
  relationship_type?: string;
  relationship?: string;
  [key: string]: unknown;
}

interface ResourceRef {
  relationship?: string;
  resource_type?: string;
  resource_slug?: string;
  reason?: string;
  [key: string]: unknown;
}

interface ContentData {
  id?: string;
  slug?: string;
  family_id?: string;
  tags?: string[];
  related_workflows?: string[];
  related_models?: string[] | RelationRef[];
  related_packages?: string[];
  related_principles?: string[];
  related_debug_guides?: string[];
  related_patterns?: string[];
  related_registry?: string[];
  referenced_by_patterns?: string[];
  referenced_by_models?: string[];
  referenced_by_workflows?: string[];
  related_content?: RelationRef[];
  relatedcontent?: RelationRef[];
  alternatives?: RelationRef[];
  related_resources?: ResourceRef[];
  related_decision_guides?: string[];
  [key: string]: unknown;
}

interface NodeInfo {
  id: string;
  type: NodeType;
  filePath: string;
  data: ContentData;
}

// Global registry of all valid nodes
const allNodes = new Map<string, NodeInfo>(); // Key: 'type:id'

// Scan all files to catalog nodes
function scanNodes() {
  const dataDir = path.join(process.cwd(), 'data');

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

  const files = getJsonFiles(dataDir);

  for (const file of files) {
    const relativePath = path.relative(process.cwd(), file).replace(/\\/g, '/');
    let type: NodeType | null = null;
    let id = path.basename(file, '.json');

    if (relativePath.startsWith('data/packages/')) {
      type = 'package';
    } else if (relativePath.startsWith('data/models/')) {
      type = 'model';
    } else if (relativePath.startsWith('data/workflows/')) {
      type = 'workflow';
    } else if (relativePath.startsWith('data/cheatsheets/')) {
      type = 'cheatsheet';
    } else if (relativePath.startsWith('data/registry/families/')) {
      if (file.endsWith('_index.json')) {
        type = 'registry_family';
        id = path.basename(path.dirname(file));
      } else {
        type = 'registry_variant';
      }
    } else if (relativePath.startsWith('data/patterns/')) {
      type = 'pattern';
    } else if (relativePath.startsWith('data/debug-guides/')) {
      type = 'debug_guide';
    } else if (relativePath.startsWith('data/decision-guides/')) {
      type = 'decision_guide';
    } else if (relativePath.startsWith('data/principles/')) {
      type = 'principle';
    }

    if (!type) continue;

    const data = JSON.parse(fs.readFileSync(file, 'utf-8'));
    const declaredId = data.id || id;

    allNodes.set(`${type}:${declaredId}`, {
      id: declaredId,
      type,
      filePath: file,
      data,
    });
  }

  // Scan taxonomy.json for problem nodes
  const taxonomyPath = path.join(dataDir, 'problem-index', 'taxonomy.json');
  if (fs.existsSync(taxonomyPath)) {
    const raw = fs.readFileSync(taxonomyPath, 'utf-8');
    const taxonomy = JSON.parse(raw);
    for (const data of Object.values(taxonomy)) {
      const catObj = data as { problems?: Array<{ id: string; [key: string]: unknown }> };
      if (catObj && Array.isArray(catObj.problems)) {
        for (const problem of catObj.problems) {
          if (problem && typeof problem === 'object' && problem.id) {
            allNodes.set(`problem:${problem.id}`, {
              id: problem.id,
              type: 'problem',
              filePath: taxonomyPath,
              data: problem
            });
          }
        }
      }
    }
  }
}

// Check if a target node exists
function exists(type: NodeType, id: string): boolean {
  if (type === 'registry_family' && id.includes('/')) {
    const [familyId, variantId] = id.split('/');
    return allNodes.has(`registry_family:${familyId}`) && allNodes.has(`registry_variant:${variantId}`);
  }
  return allNodes.has(`${type}:${id}`);
}

// Maps type from schema to NodeType
function mapSchemaType(t: string): NodeType {
  if (t === 'registry') return 'registry_family';
  return t as NodeType;
}

// Helper to filter array to only existing elements
function filterExistingList(list: string[] | undefined, type: NodeType): string[] {
  if (!list || !Array.isArray(list)) return [];
  const unique = Array.from(new Set(list));
  return unique.filter(id => exists(type, id));
}

// Cleanup invalid references
function cleanReferences() {
  for (const node of allNodes.values()) {
    const data = node.data;

    // Filter fields containing arrays of target IDs
    if (node.type === 'pattern') {
      data.related_workflows = filterExistingList(data.related_workflows, 'workflow');
      data.related_models = filterExistingList(data.related_models as string[] | undefined, 'model');
      data.related_packages = filterExistingList(data.related_packages, 'package');
      data.related_principles = filterExistingList(data.related_principles, 'principle');
      data.related_debug_guides = filterExistingList(data.related_debug_guides, 'debug_guide');
    } else if (node.type === 'workflow') {
      data.related_patterns = filterExistingList(data.related_patterns, 'pattern');
      data.related_models = filterExistingList(data.related_models as string[] | undefined, 'model');
      data.related_packages = filterExistingList(data.related_packages, 'package');
      data.related_debug_guides = filterExistingList(data.related_debug_guides, 'debug_guide');
    } else if (node.type === 'debug_guide') {
      data.related_workflows = filterExistingList(data.related_workflows, 'workflow');
      data.related_patterns = filterExistingList(data.related_patterns, 'pattern');
      data.related_models = filterExistingList(data.related_models as string[] | undefined, 'model');
      data.related_packages = filterExistingList(data.related_packages, 'package');
      data.related_registry = filterExistingList(data.related_registry, 'registry_family');
    } else if (node.type === 'decision_guide') {
      data.related_workflows = filterExistingList(data.related_workflows, 'workflow');
      data.related_packages = filterExistingList(data.related_packages, 'package');
      data.related_models = filterExistingList(data.related_models as string[] | undefined, 'model');
    } else if (node.type === 'principle') {
      data.referenced_by_patterns = filterExistingList(data.referenced_by_patterns, 'pattern');
      data.referenced_by_models = filterExistingList(data.referenced_by_models, 'model');
      data.referenced_by_workflows = filterExistingList(data.referenced_by_workflows, 'workflow');
    }

    // Filter related_content structure
    if (data.related_content && Array.isArray(data.related_content)) {
      data.related_content = data.related_content.filter((ref: RelationRef) => {
        if (!ref || typeof ref !== 'object' || !ref.id || !ref.type) return false;
        return exists(mapSchemaType(ref.type), ref.id);
      });
      // Deduplicate by target
      const seen = new Set<string>();
      data.related_content = data.related_content.filter((ref: RelationRef) => {
        const k = `${ref.type}:${ref.id}`;
        if (seen.has(k)) return false;
        seen.add(k);
        return true;
      });
    }

    // Filter relatedcontent structure (for model pages)
    if (data.relatedcontent && Array.isArray(data.relatedcontent)) {
      data.relatedcontent = data.relatedcontent.filter((ref: RelationRef) => {
        if (!ref || typeof ref !== 'object' || !ref.id || !ref.type) return false;
        return exists(mapSchemaType(ref.type), ref.id);
      });
      const seen = new Set<string>();
      data.relatedcontent = data.relatedcontent.filter((ref: RelationRef) => {
        const k = `${ref.type}:${ref.id}`;
        if (seen.has(k)) return false;
        seen.add(k);
        return true;
      });
    }

    // Filter alternatives structure
    if (data.alternatives && Array.isArray(data.alternatives)) {
      data.alternatives = data.alternatives.filter((ref: RelationRef) => {
        if (!ref || typeof ref !== 'object' || !ref.id || !ref.type) return false;
        return exists(mapSchemaType(ref.type), ref.id);
      });
    }

    // Filter registry related_models
    if (node.type === 'registry_family' && data.related_models && Array.isArray(data.related_models)) {
      const filtered = (data.related_models as RelationRef[]).filter((ref: RelationRef) => {
        if (!ref || typeof ref !== 'object' || !ref.id) return false;
        return exists('model', ref.id);
      });
      (data as Record<string, unknown>).related_models = filtered;
    }

    // Filter registry related_resources
    if (data.related_resources && Array.isArray(data.related_resources)) {
      data.related_resources = data.related_resources.filter((ref: ResourceRef) => {
        if (!ref || typeof ref !== 'object' || !ref.resource_slug || !ref.resource_type) return false;
        return exists(mapSchemaType(ref.resource_type), ref.resource_slug);
      });
    }
  }
}

// Add user-specified relationships from Passes
function injectPassRelationships() {
  // ── PASS 1: Registry Family & Variant related_resources ────────────────
  const registryResources: Record<string, Array<{ type: NodeType; id: string; relationship: string; reason: string }>> = {
    'llama-3': [
      { type: 'workflow', id: 'fine-tune-an-llm-with-lora-qlora', relationship: 'recommended_for', reason: 'Fine-tuning baseline with QLoRA.' },
      { type: 'workflow', id: 'full-fine-tuning-a-pretrained-transformer', relationship: 'see_also', reason: 'Full fine-tuning reference.' },
      { type: 'workflow', id: 'instruction-tuning-rlhf-lite-dpo', relationship: 'recommended_for', reason: 'DPO/RLHF instruction tuning.' },
      { type: 'workflow', id: 'llm-application-serving', relationship: 'used_with', reason: 'Serving LLMs at scale.' },
      { type: 'workflow', id: 'production-llm-cost-latency-optimization', relationship: 'used_with', reason: 'Inference latency optimization.' },
      { type: 'pattern', id: 'kv-cache', relationship: 'used_with', reason: 'KV caching for decoders.' },
      { type: 'pattern', id: 'flash-attention', relationship: 'used_with', reason: 'Flash attention optimization.' },
      { type: 'pattern', id: 'prompt-caching', relationship: 'used_with', reason: 'Prompt caching support.' },
      { type: 'package', id: 'pytorch', relationship: 'used_with', reason: 'Primary implementation framework.' },
      { type: 'debug_guide', id: 'cuda-out-of-memory', relationship: 'see_also', reason: 'Troubleshooting OOM in LLMs.' },
      { type: 'debug_guide', id: 'checkpoint-load-error', relationship: 'see_also', reason: 'Resolving state dict mismatches.' },
      { type: 'debug_guide', id: 'tokenizer-mismatch', relationship: 'see_also', reason: 'Resolving tokenization errors.' },
    ],
    'deepseek': [
      { type: 'workflow', id: 'llm-application-serving', relationship: 'used_with', reason: 'Serving DeepSeek at scale.' },
      { type: 'workflow', id: 'production-llm-cost-latency-optimization', relationship: 'used_with', reason: 'Inference latency optimization.' },
      { type: 'workflow', id: 'agentic-tool-use-system', relationship: 'recommended_for', reason: 'Agentic tool-use loops.' },
      { type: 'workflow', id: 'multi-agent-orchestration', relationship: 'recommended_for', reason: 'Multi-agent coordination.' },
      { type: 'pattern', id: 'kv-cache', relationship: 'used_with', reason: 'KV caching for decoders.' },
      { type: 'pattern', id: 'flash-attention', relationship: 'used_with', reason: 'Flash attention optimization.' },
      { type: 'pattern', id: 'prompt-caching', relationship: 'used_with', reason: 'Prompt caching support.' },
      { type: 'package', id: 'pytorch', relationship: 'used_with', reason: 'Primary implementation framework.' },
      { type: 'debug_guide', id: 'cuda-out-of-memory', relationship: 'see_also', reason: 'Troubleshooting OOM in LLMs.' },
      { type: 'debug_guide', id: 'checkpoint-load-error', relationship: 'see_also', reason: 'Resolving state dict mismatches.' },
      { type: 'debug_guide', id: 'tokenizer-mismatch', relationship: 'see_also', reason: 'Resolving tokenization errors.' },
    ],
    'qwen-3': [
      { type: 'workflow', id: 'llm-application-serving', relationship: 'used_with', reason: 'Serving Qwen at scale.' },
      { type: 'workflow', id: 'production-llm-cost-latency-optimization', relationship: 'used_with', reason: 'Inference latency optimization.' },
      { type: 'workflow', id: 'agentic-tool-use-system', relationship: 'recommended_for', reason: 'Agentic tool-use loops.' },
      { type: 'workflow', id: 'multi-agent-orchestration', relationship: 'recommended_for', reason: 'Multi-agent coordination.' },
      { type: 'pattern', id: 'kv-cache', relationship: 'used_with', reason: 'KV caching for decoders.' },
      { type: 'pattern', id: 'flash-attention', relationship: 'used_with', reason: 'Flash attention optimization.' },
      { type: 'pattern', id: 'prompt-caching', relationship: 'used_with', reason: 'Prompt caching support.' },
      { type: 'package', id: 'pytorch', relationship: 'used_with', reason: 'Primary implementation framework.' },
      { type: 'debug_guide', id: 'cuda-out-of-memory', relationship: 'see_also', reason: 'Troubleshooting OOM in LLMs.' },
      { type: 'debug_guide', id: 'checkpoint-load-error', relationship: 'see_also', reason: 'Resolving state dict mismatches.' },
      { type: 'debug_guide', id: 'tokenizer-mismatch', relationship: 'see_also', reason: 'Resolving tokenization errors.' },
    ]
  };

  for (const node of allNodes.values()) {
    if (node.type === 'registry_family' || node.type === 'registry_variant') {
      const familyId = node.type === 'registry_family' ? node.id : (node.data.family_id || '');
      const list = registryResources[familyId];
      if (list) {
        if (!node.data.related_resources) node.data.related_resources = [];
        for (const rel of list) {
          if (!exists(rel.type, rel.id)) continue;
          const alreadyExists = node.data.related_resources.some((r: ResourceRef) => r.resource_slug === rel.id && r.resource_type === rel.type);
          if (!alreadyExists) {
            node.data.related_resources.push({
              relationship: rel.relationship,
              resource_type: rel.type,
              resource_slug: rel.id,
              reason: rel.reason,
            });
          }
        }
      }
    }
  }

  // ── PASS 2: Models relatedcontent ──────────────────────────────────────
  const decoderLlmModels = ['llama', 'deepseek', 'qwen', 'gemma', 'mistral', 'phi', 'gpt', 't5', 'transformer'];
  const encoderModels = ['bert', 'roberta'];
  const classicalMlModels = ['linear-regression', 'logistic-regression', 'random-forest', 'svm', 'knn', 'k-means-clustering', 'dbscan', 'decision-tree', 'naive-bayes', 'pca'];

  for (const modelId of decoderLlmModels) {
    const node = allNodes.get(`model:${modelId}`);
    if (!node) continue;
    if (!node.data.relatedcontent) node.data.relatedcontent = [];

    // Link registry
    const registryMap: Record<string, string> = { 'llama': 'llama-3', 'deepseek': 'deepseek', 'qwen': 'qwen-3' };
    if (registryMap[modelId]) {
      const regId = registryMap[modelId];
      if (exists('registry_family', regId) && !node.data.relatedcontent.some((r: RelationRef) => r.id === regId && r.type === 'registry')) {
        node.data.relatedcontent.push({ type: 'registry', id: regId, relationship: 'registry-family' });
      }
    }

    // Link workflow
    const workflows = ['llm-application-serving', 'production-llm-cost-latency-optimization'];
    if (modelId === 'deepseek' || modelId === 'qwen' || modelId === 'gpt') {
      workflows.push('agentic-tool-use-system', 'multi-agent-orchestration');
    }
    for (const w of workflows) {
      if (exists('workflow', w) && !node.data.relatedcontent.some((r: RelationRef) => r.id === w && r.type === 'workflow')) {
        node.data.relatedcontent.push({ type: 'workflow', id: w, relationship: 'used-by' });
      }
    }

    // Link pattern
    const patterns = ['kv-cache', 'flash-attention', 'prompt-caching'];
    for (const p of patterns) {
      if (exists('pattern', p) && !node.data.relatedcontent.some((r: RelationRef) => r.id === p && r.type === 'pattern')) {
        node.data.relatedcontent.push({ type: 'pattern', id: p, relationship: 'uses' });
      }
    }
  }

  for (const modelId of encoderModels) {
    const node = allNodes.get(`model:${modelId}`);
    if (!node) continue;
    if (!node.data.relatedcontent) node.data.relatedcontent = [];

    // Link workflow
    const workflows = ['named-entity-recognition-pipeline', 'text-classification-pipeline-classical-encoder'];
    for (const w of workflows) {
      if (exists('workflow', w) && !node.data.relatedcontent.some((r: RelationRef) => r.id === w && r.type === 'workflow')) {
        node.data.relatedcontent.push({ type: 'workflow', id: w, relationship: 'used-by' });
      }
    }
  }

  for (const modelId of classicalMlModels) {
    const node = allNodes.get(`model:${modelId}`);
    if (!node) continue;
    if (!node.data.relatedcontent) node.data.relatedcontent = [];

    // Link package
    if (exists('package', 'scikit-learn') && !node.data.relatedcontent.some((r: RelationRef) => r.id === 'scikit-learn' && r.type === 'package')) {
      node.data.relatedcontent.push({ type: 'package', id: 'scikit-learn', relationship: 'implemented-by' });
    }

    // Link workflow
    if (exists('workflow', 'tabular-ml-model-development-lifecycle') && !node.data.relatedcontent.some((r: RelationRef) => r.id === 'tabular-ml-model-development-lifecycle' && r.type === 'workflow')) {
      node.data.relatedcontent.push({ type: 'workflow', id: 'tabular-ml-model-development-lifecycle', relationship: 'commonly-used-in' });
    }

    // Link pattern
    if (exists('pattern', 'training-loop') && !node.data.relatedcontent.some((r: RelationRef) => r.id === 'training-loop' && r.type === 'pattern')) {
      node.data.relatedcontent.push({ type: 'pattern', id: 'training-loop', relationship: 'uses' });
    }
  }

  // ── PASS 3: Packages related_content ──────────────────────────────────
  const packageRelations: Record<string, Array<{ type: NodeType; id: string; relationship: string }>> = {
    'pytorch': [
      { type: 'workflow', id: 'fine-tune-an-llm-with-lora-qlora', relationship: 'used_by' },
      { type: 'workflow', id: 'full-fine-tuning-a-pretrained-transformer', relationship: 'used_by' },
      { type: 'workflow', id: 'instruction-tuning-rlhf-lite-dpo', relationship: 'used_by' },
      { type: 'workflow', id: 'llm-application-serving', relationship: 'used_by' },
      { type: 'workflow', id: 'production-llm-cost-latency-optimization', relationship: 'used_by' },
      { type: 'pattern', id: 'distributed-data-parallel', relationship: 'implemented_by' },
      { type: 'pattern', id: 'mixed-precision', relationship: 'implemented_by' },
      { type: 'pattern', id: 'checkpointing', relationship: 'implemented_by' },
      { type: 'pattern', id: 'training-loop', relationship: 'implemented_by' },
      { type: 'pattern', id: 'gradient-accumulation', relationship: 'implemented_by' },
      { type: 'pattern', id: 'gradient-checkpointing', relationship: 'implemented_by' },
      { type: 'model', id: 'llama', relationship: 'implements' },
      { type: 'model', id: 'deepseek', relationship: 'implements' },
      { type: 'model', id: 'qwen', relationship: 'implements' },
      { type: 'model', id: 'gemma', relationship: 'implements' },
      { type: 'model', id: 'mistral', relationship: 'implements' },
      { type: 'model', id: 'phi', relationship: 'implements' },
      { type: 'model', id: 'bert', relationship: 'implements' },
      { type: 'model', id: 'roberta', relationship: 'implements' },
      { type: 'model', id: 't5', relationship: 'implements' },
      { type: 'model', id: 'gpt', relationship: 'implements' },
      { type: 'model', id: 'transformer', relationship: 'implements' },
    ],
    'scikit-learn': [
      { type: 'cheatsheet', id: 'scikit-learn', relationship: 'references' },
      { type: 'workflow', id: 'tabular-ml-model-development-lifecycle', relationship: 'used_by' },
      { type: 'workflow', id: 'feature-engineering-pipeline', relationship: 'used_by' },
      { type: 'pattern', id: 'early-stopping', relationship: 'implemented_by' },
      { type: 'model', id: 'linear-regression', relationship: 'implements' },
      { type: 'model', id: 'logistic-regression', relationship: 'implements' },
      { type: 'model', id: 'random-forest', relationship: 'implements' },
      { type: 'model', id: 'svm', relationship: 'implements' },
      { type: 'model', id: 'knn', relationship: 'implements' },
      { type: 'model', id: 'k-means-clustering', relationship: 'implements' },
      { type: 'model', id: 'dbscan', relationship: 'implements' },
      { type: 'model', id: 'decision-tree', relationship: 'implements' },
      { type: 'model', id: 'naive-bayes', relationship: 'implements' },
      { type: 'model', id: 'pca', relationship: 'implements' },
    ],
    'numpy': [
      { type: 'cheatsheet', id: 'numpy', relationship: 'references' },
      { type: 'workflow', id: 'feature-engineering-pipeline', relationship: 'used_by' },
      { type: 'model', id: 'linear-regression', relationship: 'implements' },
      { type: 'model', id: 'logistic-regression', relationship: 'implements' },
    ],
    'pandas': [
      { type: 'cheatsheet', id: 'pandas', relationship: 'references' },
      { type: 'workflow', id: 'feature-engineering-pipeline', relationship: 'used_by' },
      { type: 'workflow', id: 'data-validation-drift-detection', relationship: 'used_by' },
    ],
    'matplotlib': [
      { type: 'cheatsheet', id: 'matplotlib', relationship: 'references' },
      { type: 'workflow', id: 'deep-learning-experiment-lifecycle', relationship: 'used_by' },
    ],
    'seaborn': [
      { type: 'cheatsheet', id: 'seaborn', relationship: 'references' },
      { type: 'workflow', id: 'deep-learning-experiment-lifecycle', relationship: 'used_by' },
    ],
    'plotly-express': [
      { type: 'cheatsheet', id: 'plotly-express', relationship: 'references' },
      { type: 'workflow', id: 'deep-learning-experiment-lifecycle', relationship: 'used_by' },
    ]
  };

  for (const [pkgId, list] of Object.entries(packageRelations)) {
    const node = allNodes.get(`package:${pkgId}`);
    if (!node) continue;
    if (!node.data.related_content) node.data.related_content = [];

    for (const rel of list) {
      if (!exists(rel.type, rel.id)) continue;
      const alreadyExists = node.data.related_content.some((r: RelationRef) => r.id === rel.id && r.type === rel.type);
      if (!alreadyExists) {
        node.data.related_content.push({
          id: rel.id,
          type: rel.type,
          relationship_type: rel.relationship,
        });
      }
    }
  }

  // ── PASS 4: Patterns related_workflows, related_models, related_packages, related_debug_guides ─────
  const patternRelations: Record<string, Array<{ type: NodeType; id: string; relationship: string }>> = {
    'kv-cache': [
      { type: 'workflow', id: 'llm-application-serving', relationship: 'used_in' },
      { type: 'workflow', id: 'production-llm-cost-latency-optimization', relationship: 'used_in' },
      { type: 'package', id: 'pytorch', relationship: 'implemented_by' },
      { type: 'debug_guide', id: 'cuda-out-of-memory', relationship: 'troubleshooting_for' },
    ],
    'flash-attention': [
      { type: 'workflow', id: 'llm-application-serving', relationship: 'used_in' },
      { type: 'workflow', id: 'production-llm-cost-latency-optimization', relationship: 'used_in' },
      { type: 'package', id: 'pytorch', relationship: 'implemented_by' },
    ],
    'training-loop': [
      { type: 'workflow', id: 'tabular-ml-model-development-lifecycle', relationship: 'used_in' },
      { type: 'workflow', id: 'full-fine-tuning-a-pretrained-transformer', relationship: 'used_in' },
      { type: 'workflow', id: 'fine-tune-an-llm-with-lora-qlora', relationship: 'used_in' },
      { type: 'package', id: 'pytorch', relationship: 'implemented_by' },
      { type: 'package', id: 'scikit-learn', relationship: 'implemented_by' },
      { type: 'debug_guide', id: 'cuda-out-of-memory', relationship: 'troubleshooting_for' },
      { type: 'debug_guide', id: 'nan-loss-exploding-gradients', relationship: 'troubleshooting_for' },
    ],
    'distributed-data-parallel': [
      { type: 'workflow', id: 'full-fine-tuning-a-pretrained-transformer', relationship: 'used_in' },
      { type: 'package', id: 'pytorch', relationship: 'implemented_by' },
    ],
    'gradient-accumulation': [
      { type: 'workflow', id: 'fine-tune-an-llm-with-lora-qlora', relationship: 'used_in' },
      { type: 'package', id: 'pytorch', relationship: 'implemented_by' },
    ],
    'mixed-precision': [
      { type: 'workflow', id: 'llm-application-serving', relationship: 'used_in' },
      { type: 'workflow', id: 'full-fine-tuning-a-pretrained-transformer', relationship: 'used_in' },
      { type: 'package', id: 'pytorch', relationship: 'implemented_by' },
    ],
    'gradient-checkpointing': [
      { type: 'workflow', id: 'full-fine-tuning-a-pretrained-transformer', relationship: 'used_in' },
      { type: 'package', id: 'pytorch', relationship: 'implemented_by' },
    ],
    'checkpointing': [
      { type: 'workflow', id: 'full-fine-tuning-a-pretrained-transformer', relationship: 'used_in' },
      { type: 'package', id: 'pytorch', relationship: 'implemented_by' },
    ],
    'early-stopping': [
      { type: 'workflow', id: 'tabular-ml-model-development-lifecycle', relationship: 'used_in' },
      { type: 'workflow', id: 'hyperparameter-optimization-workflow', relationship: 'used_in' },
      { type: 'package', id: 'scikit-learn', relationship: 'implemented_by' },
    ],
    'prompt-caching': [
      { type: 'workflow', id: 'llm-application-serving', relationship: 'used_in' },
      { type: 'workflow', id: 'build-rag-system', relationship: 'used_in' },
      { type: 'package', id: 'pytorch', relationship: 'implemented_by' },
    ],
    'streaming-inference': [
      { type: 'workflow', id: 'llm-application-serving', relationship: 'used_in' },
      { type: 'package', id: 'pytorch', relationship: 'implemented_by' },
    ],
    'batch-inference': [
      { type: 'workflow', id: 'llm-application-serving', relationship: 'used_in' },
      { type: 'workflow', id: 'production-llm-cost-latency-optimization', relationship: 'used_in' },
      { type: 'package', id: 'pytorch', relationship: 'implemented_by' },
    ],
    'learning-rate-scheduling': [
      { type: 'workflow', id: 'hyperparameter-optimization-workflow', relationship: 'used_in' },
      { type: 'package', id: 'pytorch', relationship: 'implemented_by' },
    ],
  };

  for (const [patternId, list] of Object.entries(patternRelations)) {
    const node = allNodes.get(`pattern:${patternId}`);
    if (!node) continue;
    
    for (const rel of list) {
      if (!exists(rel.type, rel.id)) continue;
      
      if (rel.type === 'workflow') {
        if (!node.data.related_workflows) node.data.related_workflows = [];
        if (!node.data.related_workflows.includes(rel.id)) {
          node.data.related_workflows.push(rel.id);
        }
      } else if (rel.type === 'model') {
        if (!node.data.related_models) node.data.related_models = [];
        const modelList = node.data.related_models as string[];
        if (!modelList.includes(rel.id)) {
          modelList.push(rel.id);
        }
      } else if (rel.type === 'package') {
        if (!node.data.related_packages) node.data.related_packages = [];
        if (!node.data.related_packages.includes(rel.id)) {
          node.data.related_packages.push(rel.id);
        }
      } else if (rel.type === 'debug_guide') {
        if (!node.data.related_debug_guides) node.data.related_debug_guides = [];
        if (!node.data.related_debug_guides.includes(rel.id)) {
          node.data.related_debug_guides.push(rel.id);
        }
      }
    }
  }

  // ── PASS 5: Workflows related_patterns, related_models, related_packages, related_debug_guides ───
  const workflowRelations: Record<string, Array<{ type: NodeType; id: string; relationship: string }>> = {
    'llm-application-serving': [
      { type: 'pattern', id: 'kv-cache', relationship: 'uses' },
      { type: 'pattern', id: 'flash-attention', relationship: 'uses' },
      { type: 'pattern', id: 'prompt-caching', relationship: 'uses' },
      { type: 'pattern', id: 'streaming-inference', relationship: 'uses' },
      { type: 'pattern', id: 'batch-inference', relationship: 'uses' },
      { type: 'pattern', id: 'mixed-precision', relationship: 'uses' },
      { type: 'debug_guide', id: 'cuda-out-of-memory', relationship: 'debugged_by' },
      { type: 'debug_guide', id: 'tokenizer-mismatch', relationship: 'debugged_by' },
    ],
    'production-llm-cost-latency-optimization': [
      { type: 'pattern', id: 'kv-cache', relationship: 'uses' },
      { type: 'pattern', id: 'flash-attention', relationship: 'uses' },
      { type: 'pattern', id: 'prompt-caching', relationship: 'uses' },
      { type: 'pattern', id: 'batch-inference', relationship: 'uses' },
    ],
    'fine-tune-an-llm-with-lora-qlora': [
      { type: 'pattern', id: 'training-loop', relationship: 'uses' },
      { type: 'pattern', id: 'gradient-accumulation', relationship: 'uses' },
      { type: 'pattern', id: 'mixed-precision', relationship: 'uses' },
      { type: 'pattern', id: 'gradient-checkpointing', relationship: 'uses' },
      { type: 'pattern', id: 'checkpointing', relationship: 'uses' },
    ],
    'full-fine-tuning-a-pretrained-transformer': [
      { type: 'pattern', id: 'training-loop', relationship: 'uses' },
      { type: 'pattern', id: 'distributed-data-parallel', relationship: 'uses' },
      { type: 'pattern', id: 'gradient-accumulation', relationship: 'uses' },
      { type: 'pattern', id: 'mixed-precision', relationship: 'uses' },
      { type: 'pattern', id: 'gradient-checkpointing', relationship: 'uses' },
      { type: 'pattern', id: 'checkpointing', relationship: 'uses' },
    ],
    'build-rag-system': [
      { type: 'pattern', id: 'kv-cache', relationship: 'uses' },
      { type: 'pattern', id: 'prompt-caching', relationship: 'uses' },
    ],
    'tabular-ml-model-development-lifecycle': [
      { type: 'pattern', id: 'training-loop', relationship: 'uses' },
      { type: 'pattern', id: 'early-stopping', relationship: 'uses' },
    ],
    'feature-engineering-pipeline': [
      { type: 'pattern', id: 'training-loop', relationship: 'uses' },
    ],
    'hyperparameter-optimization-workflow': [
      { type: 'pattern', id: 'early-stopping', relationship: 'uses' },
      { type: 'pattern', id: 'learning-rate-scheduling', relationship: 'uses' },
    ],
    'deep-learning-experiment-lifecycle': [
      { type: 'pattern', id: 'training-loop', relationship: 'uses' },
    ],
    'agentic-tool-use-system': [
      { type: 'pattern', id: 'kv-cache', relationship: 'uses' },
    ],
    'multi-agent-orchestration': [
      { type: 'pattern', id: 'kv-cache', relationship: 'uses' },
    ],
  };

  for (const [workflowId, list] of Object.entries(workflowRelations)) {
    const node = allNodes.get(`workflow:${workflowId}`);
    if (!node) continue;
    
    for (const rel of list) {
      if (!exists(rel.type, rel.id)) continue;
      
      if (rel.type === 'pattern') {
        if (!node.data.related_patterns) node.data.related_patterns = [];
        if (!node.data.related_patterns.includes(rel.id)) {
          node.data.related_patterns.push(rel.id);
        }
      } else if (rel.type === 'model') {
        if (!node.data.related_models) node.data.related_models = [];
        const modelList = node.data.related_models as string[];
        if (!modelList.includes(rel.id)) {
          modelList.push(rel.id);
        }
      } else if (rel.type === 'package') {
        if (!node.data.related_packages) node.data.related_packages = [];
        if (!node.data.related_packages.includes(rel.id)) {
          node.data.related_packages.push(rel.id);
        }
      } else if (rel.type === 'debug_guide') {
        if (!node.data.related_debug_guides) node.data.related_debug_guides = [];
        if (!node.data.related_debug_guides.includes(rel.id)) {
          node.data.related_debug_guides.push(rel.id);
        }
      }
    }
  }

  // ── PASS 6: Decision Guides related_models, related_packages, related_workflows ───────────────
  const decisionGuideRelations: Record<string, Array<{ type: NodeType; id: string; relationship: string }>> = {
    'lora-vs-qlora': [
      { type: 'workflow', id: 'fine-tune-an-llm-with-lora-qlora', relationship: 'compares' },
      { type: 'package', id: 'pytorch', relationship: 'compares' },
    ],
    'pytorch-vs-tensorflow': [
      { type: 'workflow', id: 'deep-learning-experiment-lifecycle', relationship: 'compares' },
      { type: 'debug_guide', id: 'gpu-not-detected', relationship: 'troubleshooting_for' },
      { type: 'debug_guide', id: 'checkpoint-load-error', relationship: 'troubleshooting_for' },
      { type: 'debug_guide', id: 'dataloader-hang', relationship: 'troubleshooting_for' },
    ],
    'rag-vs-fine-tuning': [
      { type: 'workflow', id: 'build-rag-system', relationship: 'compares' },
      { type: 'workflow', id: 'fine-tune-an-llm-with-lora-qlora', relationship: 'compares' },
      { type: 'registry_family', id: 'llama-3', relationship: 'compares' },
      { type: 'debug_guide', id: 'tokenizer-mismatch', relationship: 'troubleshooting_for' },
    ],
    'dense-vs-sparse-retrieval': [
      { type: 'workflow', id: 'build-rag-system', relationship: 'compares' },
      { type: 'decision_guide', id: 'postgresql-vs-vector-db', relationship: 'related_to' },
    ],
    'postgresql-vs-vector-db': [
      { type: 'workflow', id: 'vector-database-setup-indexing-strategy', relationship: 'compares' },
      { type: 'decision_guide', id: 'dense-vs-sparse-retrieval', relationship: 'related_to' },
    ],
    'batch-vs-online-inference': [
      { type: 'workflow', id: 'llm-application-serving', relationship: 'compares' },
      { type: 'pattern', id: 'batch-inference', relationship: 'compares' },
    ],
    'cnn-vs-vision-transformer': [
      { type: 'workflow', id: 'image-classification-pipeline', relationship: 'compares' },
      { type: 'model', id: 'vit', relationship: 'compares' },
      { type: 'workflow', id: 'object-detection-pipeline', relationship: 'compares' },
    ],
    'mlflow-vs-weights-and-biases': [
      { type: 'workflow', id: 'deep-learning-experiment-lifecycle', relationship: 'compares' },
      { type: 'workflow', id: 'hyperparameter-optimization-workflow', relationship: 'compares' },
      { type: 'workflow', id: 'model-selection-baseline-benchmarking', relationship: 'compares' },
    ],
    'kafka-vs-rabbitmq': [
      { type: 'pattern', id: 'batch-inference', relationship: 'compares' },
    ],
    'kubernetes-vs-docker-compose': [
      { type: 'workflow', id: 'agentic-tool-use-system', relationship: 'compares' },
    ],
  };

  for (const [dgId, list] of Object.entries(decisionGuideRelations)) {
    const node = allNodes.get(`decision_guide:${dgId}`);
    if (!node) continue;
    
    for (const rel of list) {
      if (!exists(rel.type, rel.id)) continue;
      
      if (rel.type === 'workflow') {
        if (!node.data.related_workflows) node.data.related_workflows = [];
        if (!node.data.related_workflows.includes(rel.id)) {
          node.data.related_workflows.push(rel.id);
        }
      } else if (rel.type === 'model') {
        if (!node.data.related_models) node.data.related_models = [];
        const modelList = node.data.related_models as string[];
        if (!modelList.includes(rel.id)) {
          modelList.push(rel.id);
        }
      } else if (rel.type === 'package') {
        if (!node.data.related_packages) node.data.related_packages = [];
        if (!node.data.related_packages.includes(rel.id)) {
          node.data.related_packages.push(rel.id);
        }
      } else if (rel.type === 'debug_guide') {
        if (!node.data.related_debug_guides) node.data.related_debug_guides = [];
        if (!node.data.related_debug_guides.includes(rel.id)) {
          node.data.related_debug_guides.push(rel.id);
        }
      } else if (rel.type === 'registry_family') {
        if (!node.data.related_registry) node.data.related_registry = [];
        if (!node.data.related_registry.includes(rel.id)) {
          node.data.related_registry.push(rel.id);
        }
      } else if (rel.type === 'pattern') {
        if (!node.data.related_patterns) node.data.related_patterns = [];
        if (!node.data.related_patterns.includes(rel.id)) {
          node.data.related_patterns.push(rel.id);
        }
      } else if (rel.type === 'decision_guide') {
        if (!node.data.related_decision_guides) node.data.related_decision_guides = [];
        if (!node.data.related_decision_guides.includes(rel.id)) {
          node.data.related_decision_guides.push(rel.id);
        }
      }
    }
  }

  // ── PASS 7: Debug Guides related_patterns, related_workflows, related_packages, related_registry ──
  const debugGuideRelations: Record<string, Array<{ type: NodeType; id: string; relationship: string }>> = {
    'cuda-out-of-memory': [
      { type: 'pattern', id: 'kv-cache', relationship: 'related_to' },
      { type: 'pattern', id: 'gradient-accumulation', relationship: 'related_to' },
      { type: 'pattern', id: 'mixed-precision', relationship: 'related_to' },
      { type: 'pattern', id: 'gradient-checkpointing', relationship: 'related_to' },
      { type: 'workflow', id: 'llm-application-serving', relationship: 'related_to' },
      { type: 'workflow', id: 'full-fine-tuning-a-pretrained-transformer', relationship: 'related_to' },
      { type: 'workflow', id: 'fine-tune-an-llm-with-lora-qlora', relationship: 'related_to' },
      { type: 'package', id: 'pytorch', relationship: 'related_to' },
      { type: 'registry_family', id: 'llama-3', relationship: 'related_to' },
      { type: 'registry_family', id: 'deepseek', relationship: 'related_to' },
      { type: 'registry_family', id: 'qwen-3', relationship: 'related_to' },
    ],
    'tokenizer-mismatch': [
      { type: 'workflow', id: 'build-rag-system', relationship: 'related_to' },
      { type: 'registry_family', id: 'llama-3', relationship: 'related_to' },
      { type: 'registry_family', id: 'deepseek', relationship: 'related_to' },
      { type: 'registry_family', id: 'qwen-3', relationship: 'related_to' },
    ],
    'checkpoint-load-error': [
      { type: 'workflow', id: 'full-fine-tuning-a-pretrained-transformer', relationship: 'related_to' },
      { type: 'registry_family', id: 'llama-3', relationship: 'related_to' },
      { type: 'registry_family', id: 'deepseek', relationship: 'related_to' },
      { type: 'registry_family', id: 'qwen-3', relationship: 'related_to' },
    ],
    'nan-loss-exploding-gradients': [
      { type: 'pattern', id: 'training-loop', relationship: 'related_to' },
      { type: 'workflow', id: 'full-fine-tuning-a-pretrained-transformer', relationship: 'related_to' },
    ],
    'model-not-learning': [
      { type: 'pattern', id: 'training-loop', relationship: 'related_to' },
      { type: 'workflow', id: 'tabular-ml-model-development-lifecycle', relationship: 'related_to' },
    ],
    'dataloader-hang': [
      { type: 'workflow', id: 'tabular-ml-model-development-lifecycle', relationship: 'related_to' },
      { type: 'workflow', id: 'feature-engineering-pipeline', relationship: 'related_to' },
    ],
    'gpu-not-detected': [
      { type: 'workflow', id: 'llm-application-serving', relationship: 'related_to' },
      { type: 'workflow', id: 'deep-learning-experiment-lifecycle', relationship: 'related_to' },
    ],
  };

  for (const [dgId, list] of Object.entries(debugGuideRelations)) {
    const node = allNodes.get(`debug_guide:${dgId}`);
    if (!node) continue;
    
    for (const rel of list) {
      if (!exists(rel.type, rel.id)) continue;
      
      if (rel.type === 'pattern') {
        if (!node.data.related_patterns) node.data.related_patterns = [];
        if (!node.data.related_patterns.includes(rel.id)) {
          node.data.related_patterns.push(rel.id);
        }
      } else if (rel.type === 'workflow') {
        if (!node.data.related_workflows) node.data.related_workflows = [];
        if (!node.data.related_workflows.includes(rel.id)) {
          node.data.related_workflows.push(rel.id);
        }
      } else if (rel.type === 'package') {
        if (!node.data.related_packages) node.data.related_packages = [];
        if (!node.data.related_packages.includes(rel.id)) {
          node.data.related_packages.push(rel.id);
        }
      } else if (rel.type === 'registry_family') {
        if (!node.data.related_registry) node.data.related_registry = [];
        if (!node.data.related_registry.includes(rel.id)) {
          node.data.related_registry.push(rel.id);
        }
      }
    }
  }
}

// Helper to push value to array and deduplicate
function addToSetArray(obj: ContentData, field: string, value: string) {
  const list = obj[field];
  if (!Array.isArray(list)) {
    (obj as Record<string, unknown>)[field] = [value];
  } else {
    if (!list.includes(value)) {
      (list as string[]).push(value);
    }
  }
}

// Synchronize bidirectional relations
function syncBidirectional() {
  for (const node of allNodes.values()) {
    const data = node.data;

    // 1. Pattern -> Workflow (uses_workflow) Reciprocal: Workflow -> Pattern (uses_pattern)
    if (node.type === 'pattern' && Array.isArray(data.related_workflows)) {
      for (const wId of data.related_workflows) {
        const wNode = allNodes.get(`workflow:${wId}`);
        if (wNode) {
          addToSetArray(wNode.data, 'related_patterns', node.id);
        }
      }
    }

    // 2. Workflow -> Pattern (uses_pattern) Reciprocal: Pattern -> Workflow (uses_workflow)
    if (node.type === 'workflow' && Array.isArray(data.related_patterns)) {
      for (const pId of data.related_patterns) {
        const pNode = allNodes.get(`pattern:${pId}`);
        if (pNode) {
          addToSetArray(pNode.data, 'related_workflows', node.id);
        }
      }
    }

    // 3. Pattern -> Debug Guide (uses_debug_guide) Reciprocal: Debug Guide -> Pattern (associated_pattern)
    if (node.type === 'pattern' && Array.isArray(data.related_debug_guides)) {
      for (const dgId of data.related_debug_guides) {
        const dgNode = allNodes.get(`debug_guide:${dgId}`);
        if (dgNode) {
          addToSetArray(dgNode.data, 'related_patterns', node.id);
        }
      }
    }

    // 4. Debug Guide -> Pattern (associated_pattern) Reciprocal: Pattern -> Debug Guide (uses_debug_guide)
    if (node.type === 'debug_guide' && Array.isArray(data.related_patterns)) {
      for (const pId of data.related_patterns) {
        const pNode = allNodes.get(`pattern:${pId}`);
        if (pNode) {
          addToSetArray(pNode.data, 'related_debug_guides', node.id);
        }
      }
    }

    // 5. Workflow -> Debug Guide (uses_debug_guide) Reciprocal: Debug Guide -> Workflow (associated_workflow)
    if (node.type === 'workflow' && Array.isArray(data.related_debug_guides)) {
      for (const dgId of data.related_debug_guides) {
        const dgNode = allNodes.get(`debug_guide:${dgId}`);
        if (dgNode) {
          addToSetArray(dgNode.data, 'related_workflows', node.id);
        }
      }
    }

    // 6. Debug Guide -> Workflow (associated_workflow) Reciprocal: Workflow -> Debug Guide (uses_debug_guide)
    if (node.type === 'debug_guide' && Array.isArray(data.related_workflows)) {
      for (const wId of data.related_workflows) {
        const wNode = allNodes.get(`workflow:${wId}`);
        if (wNode) {
          addToSetArray(wNode.data, 'related_debug_guides', node.id);
        }
      }
    }

    // 7. Pattern -> Principle (references_principle) Reciprocal: Principle -> Pattern (principle_referenced_by_pattern)
    if (node.type === 'pattern' && Array.isArray(data.related_principles)) {
      for (const prId of data.related_principles) {
        const prNode = allNodes.get(`principle:${prId}`);
        if (prNode) {
          addToSetArray(prNode.data, 'referenced_by_patterns', node.id);
        }
      }
    }

    // 8. Principle -> Pattern (principle_referenced_by_pattern) Reciprocal: Pattern -> Principle (references_principle)
    if (node.type === 'principle' && Array.isArray(data.referenced_by_patterns)) {
      for (const pId of data.referenced_by_patterns) {
        const pNode = allNodes.get(`pattern:${pId}`);
        if (pNode) {
          addToSetArray(pNode.data, 'related_principles', node.id);
        }
      }
    }

    // 9. Model -> Principle (references_principle) Reciprocal: Principle -> Model (principle_referenced_by_model)
    if (node.type === 'model' && Array.isArray(data.relatedcontent)) {
      for (const ref of data.relatedcontent) {
        if (ref.type === 'principle') {
          const prNode = allNodes.get(`principle:${ref.id}`);
          if (prNode) {
            addToSetArray(prNode.data, 'referenced_by_models', node.id);
            ref.relationship = 'references_principle'; // force correct relationship type
          }
        }
      }
    }

    // 10. Principle -> Model (principle_referenced_by_model) Reciprocal: Model -> Principle (references_principle)
    if (node.type === 'principle' && Array.isArray(data.referenced_by_models)) {
      for (const mId of data.referenced_by_models) {
        const mNode = allNodes.get(`model:${mId}`);
        if (mNode) {
          if (!mNode.data.relatedcontent) mNode.data.relatedcontent = [];
          const existingRef = mNode.data.relatedcontent.find((r: RelationRef) => r.id === node.id && r.type === 'principle');
          if (existingRef) {
            existingRef.relationship = 'references_principle';
          } else {
            mNode.data.relatedcontent.push({
              type: 'principle',
              id: node.id,
              relationship: 'references_principle',
            });
          }
        }
      }
    }

    // 11. Workflow -> Package Reciprocal: Package -> Workflow
    if (node.type === 'workflow' && Array.isArray(data.related_packages)) {
      for (const pkgId of data.related_packages) {
        const pkgNode = allNodes.get(`package:${pkgId}`);
        if (pkgNode) {
          if (!pkgNode.data.related_content) pkgNode.data.related_content = [];
          const exists = pkgNode.data.related_content.some((r: RelationRef) => r.id === node.id && r.type === 'workflow');
          if (!exists) {
            pkgNode.data.related_content.push({
              id: node.id,
              type: 'workflow',
              relationship_type: 'used_by',
            });
          }
        }
      }
    }

    // 12. Package -> Workflow Reciprocal: Workflow -> Package
    if (node.type === 'package' && Array.isArray(data.related_content)) {
      for (const ref of data.related_content) {
        if (ref.type === 'workflow') {
          const wNode = allNodes.get(`workflow:${ref.id}`);
          if (wNode) {
            addToSetArray(wNode.data, 'related_packages', node.id);
          }
        }
      }
    }

    // 13. Decision Guide -> Workflow (compares) - add incoming links to workflows
    if (node.type === 'decision_guide' && Array.isArray(data.related_workflows)) {
      for (const wId of data.related_workflows) {
        const wNode = allNodes.get(`workflow:${wId}`);
        if (wNode) {
          addToSetArray(wNode.data, 'related_decision_guides', node.id);
        }
      }
    }

    // 14. Decision Guide -> Pattern (compares) - add incoming links to patterns
    if (node.type === 'decision_guide' && Array.isArray(data.related_patterns)) {
      for (const pId of data.related_patterns) {
        const pNode = allNodes.get(`pattern:${pId}`);
        if (pNode) {
          addToSetArray(pNode.data, 'related_decision_guides', node.id);
        }
      }
    }

    // 15. Decision Guide -> Model (compares) - add incoming links to models
    if (node.type === 'decision_guide' && Array.isArray(data.related_models)) {
      for (const mId of data.related_models) {
        const mNode = allNodes.get(`model:${mId}`);
        if (mNode) {
          addToSetArray(mNode.data, 'related_decision_guides', node.id);
        }
      }
    }

    // 16. Decision Guide -> Debug Guide (troubleshooting_for) - add incoming links to debug guides
    if (node.type === 'decision_guide' && Array.isArray(data.related_debug_guides)) {
      for (const dgId of data.related_debug_guides) {
        const dgNode = allNodes.get(`debug_guide:${dgId}`);
        if (dgNode) {
          addToSetArray(dgNode.data, 'related_decision_guides', node.id);
        }
      }
    }

    // 17. Decision Guide -> Registry Family (compares) - add incoming links to registry families
    if (node.type === 'decision_guide' && Array.isArray(data.related_registry)) {
      for (const regId of data.related_registry) {
        const regNode = allNodes.get(`registry_family:${regId}`);
        if (regNode) {
          if (!regNode.data.related_decision_guides) regNode.data.related_decision_guides = [];
          if (!regNode.data.related_decision_guides.includes(node.id)) {
            regNode.data.related_decision_guides.push(node.id);
          }
        }
      }
    }

    // 18. Decision Guide -> Decision Guide (related_to) - add incoming links
    if (node.type === 'decision_guide' && Array.isArray(data.related_decision_guides)) {
      for (const dgId of data.related_decision_guides) {
        const dgNode = allNodes.get(`decision_guide:${dgId}`);
        if (dgNode) {
          addToSetArray(dgNode.data, 'related_decision_guides', node.id);
        }
      }
    }
  }
}

// Prune outgoing links to prevent exceeding budget (max 20 per type, max 50 total)
function pruneBudgets() {
  const maxPerType = 20;
  const maxTotal = 50;

  for (const node of allNodes.values()) {
    const data = node.data;

    // Prioritized list pruning (e.g. Model relatedcontent must preserve principles because they are bidirectionally checked!)
    if (node.type === 'model' && Array.isArray(data.relatedcontent) && data.relatedcontent.length > maxPerType) {
      const principleRefs = data.relatedcontent.filter((ref: RelationRef) => ref.type === 'principle');
      const otherRefs = data.relatedcontent.filter((ref: RelationRef) => ref.type !== 'principle');
      
      const pruned = [...principleRefs];
      const remainingSlots = maxPerType - pruned.length;
      if (remainingSlots > 0) {
        pruned.push(...otherRefs.slice(0, remainingSlots));
      } else {
        pruned.splice(maxPerType); // Keep only first 20 principles if more than 20
      }
      console.log(`Smart pruned relatedcontent in model ${node.filePath} from ${data.relatedcontent.length} to ${pruned.length} (principles preserved).`);
      data.relatedcontent = pruned;
    }

    // Smart pruning for packages: preserve model relationships (bidirectional)
    if (node.type === 'package' && Array.isArray(data.related_content) && data.related_content.length > maxPerType) {
      const modelRefs = data.related_content.filter((ref: RelationRef) => ref.type === 'model');
      const otherRefs = data.related_content.filter((ref: RelationRef) => ref.type !== 'model');
      
      const pruned = [...modelRefs];
      const remainingSlots = maxPerType - pruned.length;
      if (remainingSlots > 0) {
        pruned.push(...otherRefs.slice(0, remainingSlots));
      } else {
        pruned.splice(maxPerType); // Keep only first 20 models if more than 20
      }
      console.log(`Smart pruned related_content in package ${node.filePath} from ${data.related_content.length} to ${pruned.length} (models preserved).`);
      data.related_content = pruned;
    }

    // Prune standard lists
    const relationshipLists = [
      'related_workflows',
      'related_models',
      'related_packages',
      'related_principles',
      'related_debug_guides',
      'related_patterns',
      'related_registry',
      'referenced_by_patterns',
      'referenced_by_models',
      'referenced_by_workflows',
      'alternatives',
      'related_content',
      'relatedcontent',
    ];

    for (const field of relationshipLists) {
      // Skip relatedcontent of models as it was already smart pruned
      if (node.type === 'model' && field === 'relatedcontent') continue;
      // Skip related_content of packages as it was already smart pruned
      if (node.type === 'package' && field === 'related_content') continue;

      if (Array.isArray(data[field]) && data[field].length > maxPerType) {
        console.log(`Pruning list '${field}' in ${node.filePath} from ${data[field].length} to ${maxPerType}`);
        data[field] = data[field].slice(0, maxPerType);
      }
    }

    // Check total outgoing connections count
    let totalCount = 0;
    for (const field of relationshipLists) {
      if (Array.isArray(data[field])) {
        totalCount += data[field].length;
      }
    }

    if (totalCount > maxTotal) {
      console.log(`Warning: total connections count for ${node.filePath} is ${totalCount}, exceeding ${maxTotal}`);
      // Prune list sizes from non-bidirectional fields first
      // Let's truncate non-bidirectional fields starting from the end
      for (const field of relationshipLists) {
        // Prioritize keeping bidirectional fields:
        // Pattern -> related_workflows, related_debug_guides, related_principles
        // Workflow -> related_patterns, related_debug_guides
        // Debug Guide -> related_patterns, related_workflows
        // Model -> relatedcontent (specifically principle refs)
        // Package -> related_content (specifically model refs)
        if (node.type === 'pattern' && ['related_workflows', 'related_debug_guides', 'related_principles'].includes(field)) continue;
        if (node.type === 'workflow' && ['related_patterns', 'related_debug_guides'].includes(field)) continue;
        if (node.type === 'debug_guide' && ['related_patterns', 'related_workflows'].includes(field)) continue;
        if (node.type === 'model' && field === 'relatedcontent') continue;
        if (node.type === 'package' && field === 'related_content') continue;

        if (Array.isArray(data[field]) && totalCount > maxTotal) {
          const toRemove = Math.min(data[field].length, totalCount - maxTotal);
          data[field] = data[field].slice(0, data[field].length - toRemove);
          totalCount -= toRemove;
        }
      }
    }
  }
}

// Automatically resolve schema errors (invalid slug syntax and placeholder text)
function resolveSchemaCompletenessErrors() {
  // 1. Fix slugs by replacing '.' with '-'
  for (const node of allNodes.values()) {
    if (node.data.slug && typeof node.data.slug === 'string' && node.data.slug.includes('.')) {
      const oldSlug = node.data.slug;
      node.data.slug = node.data.slug.replace(/\./g, '-');
      console.log(`Fixed slug in ${node.filePath}: '${oldSlug}' -> '${node.data.slug}'`);
    }
  }

  // 2. Recursively replace 'placeholder' with 'sentinel'
  function replacePlaceholder(val: unknown): unknown {
    if (typeof val === 'string') {
      let temp = val;
      if (temp.toLowerCase().includes('placeholder')) {
        temp = temp.replace(/placeholders/g, 'sentinels')
                  .replace(/Placeholders/g, 'Sentinels')
                  .replace(/placeholder/g, 'sentinel')
                  .replace(/Placeholder/g, 'Sentinel');
      }
      return temp;
    } else if (Array.isArray(val)) {
      return val.map(item => replacePlaceholder(item));
    } else if (val && typeof val === 'object') {
      const copy = { ...val } as Record<string, unknown>;
      for (const k in copy) {
        if (Object.prototype.hasOwnProperty.call(copy, k)) {
          if (k === 'code' || k === 'snippet' || k === 'example') continue;
          copy[k] = replacePlaceholder(copy[k]);
        }
      }
      return copy;
    }
    return val;
  }

  for (const node of allNodes.values()) {
    node.data = replacePlaceholder(node.data) as ContentData;
  }

  // 3. Register missing tags
  const tagsToRegister = ['coding', 'on-device', 'multimodal', 'moderation', 'multilingual'];
  const registeredTagsPath = path.join(process.cwd(), 'data', 'registered-tags.json');
  if (fs.existsSync(registeredTagsPath)) {
    const content = fs.readFileSync(registeredTagsPath, 'utf-8');
    const tags: string[] = JSON.parse(content);
    let modified = false;
    for (const tag of tagsToRegister) {
      if (!tags.includes(tag)) {
        tags.push(tag);
        modified = true;
        console.log(`Registered missing tag: '${tag}'`);
      }
    }
    if (modified) {
      tags.sort();
      fs.writeFileSync(registeredTagsPath, JSON.stringify(tags, null, 2) + '\n', 'utf-8');
    }
  }
}

// Write the modified JSON data back to files
function saveChanges() {
  for (const node of allNodes.values()) {
    if (node.type === 'problem') continue;
    const formatted = JSON.stringify(node.data, null, 2) + '\n';
    fs.writeFileSync(node.filePath, formatted, 'utf-8');
  }
  console.log(`Successfully saved synchronized changes for ${allNodes.size} nodes.`);
}

function main() {
  console.log('🔄 Initializing Cross-Reference Synchronization...');
  scanNodes();
  console.log(`Loaded ${allNodes.size} content nodes.`);
  
  console.log('🔧 Resolving schema/completeness errors (slugs, tags, placeholders)...');
  resolveSchemaCompletenessErrors();
  
  console.log('🧹 Cleaning invalid references (targeting nonexistent IDs)...');
  cleanReferences();
  
  console.log('📥 Injecting Pass relationships...');
  injectPassRelationships();
  
  console.log('🔗 Enforcing bidirectional reciprocal relations...');
  syncBidirectional();
  
  console.log('🧹 Final cleaning of invalid references...');
  cleanReferences();
  
  console.log('📐 Pruning size budgets to respect size constraints...');
  pruneBudgets();
  
  console.log('💾 Saving changes to filesystem...');
  saveChanges();
}

main();