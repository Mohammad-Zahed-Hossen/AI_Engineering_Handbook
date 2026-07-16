import Fuse from 'fuse.js';

export type SearchResult = {
  type: 'package' | 'model' | 'workflow' | 'cheatsheet' | 'registry' | 'function' | 'pattern' | 'debug_guide' | 'decision_guide' | 'principle';
  id: string;
  name: string;
  summary: string;
  href: string;
  updated_at: string;
  category?: string;
  problem_types?: string[];
  fn_signature?: string;
  fn_section?: string;
  fn_package_id?: string;
  // Phase 1 additions - optional fields for deep indexing
  mental_trigger?: string;
  concept?: string;
  applicability?: string;
  code_context?: string;
  code_tokens?: string[];
  keywords?: string[];
  parent_name?: string;
  // Phase 5 additions - aliases for alternative search terms
  aliases?: string[];
  // Phase 7 additions - title field for new content types
  title?: string;
  // Phase 7 additions - tags field for new content types
  tags?: string[];
  // Phase 7 additions - search_tokens field for new content types
  search_tokens?: string[];
  // Phase 5 additions - structured fields for faceted search
  family?: string;
  parameter_count?: number;
  context_window?: number;
  min_gpu_memory?: number;
  production_ready?: boolean;
  commercial_use?: boolean;
  modality?: 'llm' | 'embedding' | 'reranker' | 'vision' | 'speech' | 'multimodal';
  capabilities?: {
    instruction_tuned?: boolean;
    reasoning?: boolean;
    vision?: boolean;
    multilingual?: boolean;
    tool_calling?: boolean;
    function_calling?: boolean;
    thinking_model?: boolean;
  };
};

export function createFuse(data: SearchResult[]) {
  return new Fuse(data, {
    keys: [
      { name: 'name', weight: 0.20 },
      { name: 'title', weight: 0.20 },
      { name: 'mental_trigger', weight: 0.15 },
      { name: 'concept', weight: 0.15 },
      { name: 'applicability', weight: 0.15 },
      { name: 'keywords', weight: 0.12 },
      { name: 'search_tokens', weight: 0.12 },
      { name: 'tags', weight: 0.10 },
      { name: 'aliases', weight: 0.08 },
      { name: 'code_context', weight: 0.10 },
      { name: 'code_tokens', weight: 0.10 },
      { name: 'summary', weight: 0.08 },
      { name: 'fn_signature', weight: 0.05 },
      { name: 'id', weight: 0.03 },
      { name: 'category', weight: 0.02 },
      { name: 'parent_name', weight: 0.02 },
    ],
    threshold: 0.25,
    minMatchCharLength: 2,
    includeScore: true,
    includeMatches: true,
  });
}
