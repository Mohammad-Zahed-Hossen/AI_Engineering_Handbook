import { cache } from 'react';
import {
  getAllPackages,
  getAllModels,
  getAllWorkflows,
  getAllCheatsheetIds,
  getCheatsheet,
  getRegistryTasks,
  getRegistryByTask
} from './data';
import { SearchResult } from '@/lib/search-types';
import { tokenizeCodeField } from '@/lib/search/tokenizer';
import { createSearchEngine } from '@/lib/search/engine';

export type { SearchResult } from '@/lib/search-types';
export { createFuse } from '@/lib/search-types';

// Helper function to extract keywords from prose fields
function extractKeywordsFromProse(text: string): string[] {
  if (!text) return [];
  const stopWords = new Set(['i', 'need', 'a', 'to', 'the', 'is', 'for', 'or', 'when', 'you', 'and', 'in', 'on', 'at', 'with', 'by', 'from', 'of', 'that', 'this', 'it', 'as', 'be', 'are', 'will', 'can', 'not', 'an', 'if']);
  const words = text.toLowerCase().match(/\b[a-z]{3,}\b/g) || [];
  return [...new Set(words.filter(w => !stopWords.has(w)))];
}

function combineText(...values: Array<string | undefined>): string {
  return values.filter(Boolean).join(' ').trim();
}

export const buildSearchIndex = cache(function buildSearchIndex(): SearchResult[] {
  const results: SearchResult[] = [];

  getAllPackages().forEach(p => results.push({
    type: 'package',
    id: p.id,
    name: p.name,
    summary: p.summary,
    href: `/packages/${p.id}`,
    updated_at: p.updated_at,
  }));

  // Index package tasks as searchable entries with enriched fields
  getAllPackages().forEach(pkg => {
    pkg.tasks.forEach(task => {
      const anchor = task.task.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/gi, '');
      const proseText = combineText(task.mental_trigger, task.use_when, task.syntax);
      const proseKeywords = extractKeywordsFromProse(proseText);
      const codeContext = tokenizeCodeField(task.syntax || '');
      const codeTokens = codeContext.split(/\s+/).filter(Boolean);
      const keywords = [...new Set([...proseKeywords, ...codeTokens])];

      results.push({
        type: 'function',
        id: `${pkg.id}::${task.task.replace(/[^a-z0-9]/gi, '-').toLowerCase()}`,
        name: task.task,
        summary: task.mental_trigger || task.syntax,
        href: `/packages/${pkg.id}#${anchor}`,
        updated_at: pkg.updated_at,
        category: pkg.name,
        fn_signature: task.task,
        fn_package_id: pkg.id,
        // Phase 1 additions
        mental_trigger: task.mental_trigger,
        code_context: codeContext,
        code_tokens: codeTokens.length > 0 ? codeTokens : undefined,
        keywords: keywords.length > 0 ? keywords : undefined,
        parent_name: pkg.name,
      });
    });
  });

  (['ml', 'dl', 'llm'] as const).forEach(cat => {
    getAllModels(cat).forEach(m => {
      const keywords = extractKeywordsFromProse(m.use_when || '' + ' ' + m.pros?.join(' ') || '' + ' ' + m.cons?.join(' ') || '');
      results.push({
        type: 'model',
        id: m.id,
        name: m.name,
        summary: m.summary,
        href: `/models/${cat}/${m.id}`,
        updated_at: m.updated_at,
        category: cat,
        problem_types: [...m.problem_types],
        // Phase 1 additions
        keywords: keywords.length > 0 ? keywords : undefined,
      });
    });
  });

  getAllWorkflows().forEach(w => {
    const stepNames = w.steps.map(s => s.name);
    const stepTools = w.steps.flatMap(s => s.tools);
    const keywords = extractKeywordsFromProse(w.overview || '');
    
    results.push({
      type: 'workflow',
      id: w.id,
      name: w.name,
      summary: w.overview,
      category: w.category,
      updated_at: w.updated_at,
      href: `/workflows/${w.id}`,
      // Phase 1 additions
      keywords: keywords.length > 0 ? keywords : undefined,
      // Store step names and tools in keywords for now until we add dedicated fields
      code_tokens: [...stepNames, ...stepTools],
    });
  });

  getRegistryTasks().forEach(task => {
    getRegistryByTask(task).forEach(entry => {
      results.push({
        type: 'registry',
        id: entry.id,
        name: entry.id,
        summary: `${task} model`,
        href: `/registry/${task}`,
        updated_at: '',
        category: task,
      });
    });
  });

  // Index cheatsheet entries individually with enriched fields
  getAllCheatsheetIds().forEach(id => {
    const cs = getCheatsheet(id);
    // Add cheatsheet-level entry
    results.push({
      type: 'cheatsheet',
      id: cs.id,
      name: cs.name,
      summary: cs.entries.map(entry => entry.problem).slice(0, 4).join(', '),
      updated_at: cs.updated_at,
      href: `/cheatsheets/${cs.id}`,
      parent_name: cs.name,
    });

    // Add individual entry-level results
    cs.entries.forEach((entry, idx) => {
      const entryAnchor = entry.problem.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/gi, '');
      const proseText = combineText(entry.trigger, entry.minimal_notes, entry.common_bug);
      const proseKeywords = extractKeywordsFromProse(proseText);
      const codeContext = tokenizeCodeField(entry.snippet || '');
      const codeTokens = codeContext.split(/\s+/).filter(Boolean);
      const keywords = [...new Set([...proseKeywords, ...codeTokens])];

      results.push({
        type: 'function',
        id: `${cs.id}::entry-${idx}`,
        name: entry.problem,
        summary: entry.trigger || entry.problem,
        href: `/cheatsheets/${cs.id}#${entryAnchor}`,
        updated_at: cs.updated_at,
        category: cs.name,
        // Phase 1 additions
        mental_trigger: entry.trigger,
        code_context: codeContext,
        code_tokens: codeTokens.length > 0 ? codeTokens : undefined,
        keywords: keywords.length > 0 ? keywords : undefined,
        parent_name: cs.name,
      });
    });
  });

  // Development-only size check to catch index bloat
  if (process.env.NODE_ENV === 'development') {
    const indexSize = Buffer.byteLength(JSON.stringify(results), 'utf8');
    console.log(`[search] Index contains ${results.length} entries, ~${Math.round(indexSize / 1024)}KB`);
  }

  return results;
});

export const buildSearchEngine = cache(function buildSearchEngine() {
  return createSearchEngine(buildSearchIndex());
});
