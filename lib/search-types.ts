import Fuse from 'fuse.js';

export type SearchResult = {
  type: 'package' | 'model' | 'workflow' | 'cheatsheet' | 'registry' | 'function';
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
  code_context?: string;
  code_tokens?: string[];
  keywords?: string[];
  parent_name?: string;
  // Phase 5 additions - aliases for alternative search terms
  aliases?: string[];
};

export function createFuse(data: SearchResult[]) {
  return new Fuse(data, {
    keys: [
      { name: 'name', weight: 0.25 },
      { name: 'mental_trigger', weight: 0.20 },
      { name: 'keywords', weight: 0.15 },
      { name: 'code_context', weight: 0.15 },
      { name: 'code_tokens', weight: 0.15 },
      { name: 'summary', weight: 0.10 },
      { name: 'fn_signature', weight: 0.08 },
      { name: 'id', weight: 0.05 },
      { name: 'category', weight: 0.02 },
      { name: 'parent_name', weight: 0.02 },
    ],
    threshold: 0.25,
    minMatchCharLength: 2,
    includeScore: true,
    includeMatches: true,
  });
}
