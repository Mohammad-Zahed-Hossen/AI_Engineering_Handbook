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
};

export function createFuse(data: SearchResult[]) {
  return new Fuse(data, {
    keys: [
      { name: 'name', weight: 0.4 },
      { name: 'summary', weight: 0.3 },
      { name: 'fn_signature', weight: 0.15 },
      { name: 'id', weight: 0.1 },
      { name: 'category', weight: 0.05 },
    ],
    threshold: 0.25,
    minMatchCharLength: 2,
    includeScore: true,
    includeMatches: true,
  });
}
