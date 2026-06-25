import {
  getAllPackages,
  getAllModels,
  getAllWorkflows,
  getAllCheatsheetIds,
  getCheatsheet,
  getRegistryTasks,
  getRegistryByTask
} from './data';
import { SearchResult } from './search-types';
import type { RegistryTask } from '@/lib/schemas/registry';

export type { SearchResult } from './search-types';
export { createFuse } from './search-types';

export function buildSearchIndex(): SearchResult[] {
  const results: SearchResult[] = [];

  getAllPackages().forEach(p => results.push({
    type: 'package',
    id: p.id,
    name: p.name,
    summary: p.summary,
    href: `/packages/${p.id}`,
    updated_at: p.updated_at,
  }));

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

  getAllWorkflows().forEach(w => results.push({
    type: 'workflow',
    id: w.id,
    name: w.name,
    summary: w.overview,
    category: w.category,
    updated_at: w.updated_at,
    href: `/workflows/${w.id}`,
  }));

  getRegistryTasks().forEach(task => {
    getRegistryByTask(task).forEach(entry => {
      results.push({
        type: 'registry',
        id: entry.id,
        name: entry.model_id,
        summary: entry.use_case,
        href: `/registry/${task}`,
        updated_at: entry.updated_at,
        category: task,
      });
    });
  });

  getAllCheatsheetIds().forEach(id => {
    const cs = getCheatsheet(id);
    results.push({
      type: 'cheatsheet',
      id: cs.id,
      name: cs.name,
      summary: cs.groups.map(g => g.group).slice(0, 4).join(', '),
      updated_at: cs.updated_at,
      href: `/cheatsheets/${cs.id}`,
    });
  });

  return results;
}
