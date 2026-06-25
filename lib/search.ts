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

  // Index individual functions from packages
  getAllPackages().forEach(pkg => {
    pkg.sections.forEach(section => {
      section.functions.forEach(fn => {
        results.push({
          type: 'function',
          id: `${pkg.id}::${fn.fn.replace(/[^a-z0-9]/gi, '-').toLowerCase()}`,
          name: fn.fn,
          summary: fn.purpose,
          href: `/packages/${pkg.id}#${section.name.toLowerCase().replace(/\s+/g, '-')}`,
          updated_at: pkg.updated_at,
          category: pkg.name,
          fn_signature: fn.fn,
          fn_section: section.name,
          fn_package_id: pkg.id,
        });
      });
    });
  });

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

  // Development-only size check to catch index bloat
  if (process.env.NODE_ENV === 'development') {
    const indexSize = Buffer.byteLength(JSON.stringify(results), 'utf8');
    console.log(`[search] Index contains ${results.length} entries, ~${Math.round(indexSize / 1024)}KB`);
  }

  return results;
}
