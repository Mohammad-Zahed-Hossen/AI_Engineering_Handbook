import Fuse from 'fuse.js';

export type SearchResult = {
  type: 'package' | 'model' | 'workflow' | 'cheatsheet' | 'quick_reference' | 'checklist' | 'registry' | 'function' | 'pattern' | 'debug_guide' | 'decision_guide' | 'principle';
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
  // API signature for code query matching (e.g., "torch.nn.Linear", "RandomForestClassifier.fit()")
  api_signature?: string;
  // Internal unique ID for search index (prevents collisions while preserving original id for routing)
  search_id?: string;
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
  // Phase 1 additions - error message and CLI command search
  error_messages?: string[];
  diagnostic_commands?: string[];
  quick_checks?: string[];
  // Phase 1 additions - confidence and maturity fields
  confidence?: string;
  engineering_maturity?: string;
  canonical_status?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  // Phase 2 additions - relationship count
  related_count?: number;
  // Source type to distinguish between package functions and cheatsheet entries
  source_type?: 'package' | 'cheatsheet';
  // Phase 2 additions - extended metadata fields for better indexing
  gotchas?: string[];
  root_causes?: string[];
  symptoms?: string[];
  decision_flow?: Array<{ question?: string; if_yes?: string; if_no?: string }>;
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
      // Phase 1 additions - error message and CLI command search
      { name: 'error_messages', weight: 0.15 },
      { name: 'diagnostic_commands', weight: 0.12 },
      { name: 'quick_checks', weight: 0.10 },
    ],
    threshold: 0.25,
    minMatchCharLength: 2,
    includeScore: true,
    includeMatches: true,
  });
}