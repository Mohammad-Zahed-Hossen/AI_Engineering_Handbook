import Fuse from 'fuse.js';
import { 
  getAllPackages, 
  getAllModels, 
  getAllWorkflows, 
  getAllCheatsheetIds, 
  getCheatsheet 
} from './data';

export type SearchResult = {
  type: 'package' | 'model' | 'workflow' | 'cheatsheet';
  id: string;
  name: string;
  summary: string;
  href: string;
  updated_at: string;
  category?: string;
  problem_types?: string[];
};

export function buildSearchIndex(): SearchResult[] {
  const results: SearchResult[] = [];

  // Packages
  getAllPackages().forEach(p => results.push({
    type: 'package',
    id: p.id,
    name: p.name,
    summary: p.summary,
    href: `/packages/${p.id}`,
    updated_at: p.updated_at,
  }));

  // Models
  (['ml', 'dl', 'llm'] as const).forEach(cat => {
    getAllModels(cat).forEach(m => results.push({
      type: 'model',
      id: m.id,
      name: m.name,
      summary: m.summary,
      href: `/models/${cat}/${m.id}`,
      updated_at: m.updated_at,
      category: cat,
      problem_types: [...m.problem_types],
    }));
  });

  // Workflows
  getAllWorkflows().forEach(w => results.push({
    type: 'workflow',
    id: w.id,
    name: w.name,
    summary: w.overview,
    category: w.category,
    updated_at: w.updated_at,
    href: `/workflows/${w.id}`,
  }));

  // Cheatsheets
  getAllCheatsheetIds().forEach(id => {
    const cs = getCheatsheet(id);
    results.push({
      type: 'cheatsheet',
      id: cs.id,
      name: cs.name,
      summary: `${cs.name} syntax cheatsheet reference.`,
      updated_at: cs.updated_at,
      href: `/cheatsheets/${cs.id}`,
    });
  });

  return results;
}

export function createFuse(data: SearchResult[]) {
  return new Fuse(data, {
    keys: ['name', 'summary', 'problem_types'],
    threshold: 0.3,
  });
}