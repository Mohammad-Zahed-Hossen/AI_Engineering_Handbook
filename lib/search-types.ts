import Fuse from 'fuse.js';

export type SearchResult = {
  type: 'package' | 'model' | 'workflow' | 'cheatsheet' | 'registry';
  id: string;
  name: string;
  summary: string;
  href: string;
  updated_at: string;
  category?: string;
  problem_types?: string[];
};

export function createFuse(data: SearchResult[]) {
  return new Fuse(data, {
    keys: ['name', 'summary', 'id', 'type', 'category', 'problem_types'],
    threshold: 0.25,
    minMatchCharLength: 2,
    includeScore: true,
  });
}
