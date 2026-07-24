import fs from 'node:fs';
import path from 'node:path';
import type { SearchResult } from '@/lib/search-types';
import {
  getAllPackages,
  getAllModels,
  getAllWorkflows,
  getAllCheatsheetIds,
  getCheatsheet,
  getAllRegistryFamilies,
  getRegistryVariantsByFamily,
  getAllPatterns,
  getAllDebugGuides,
  getAllDecisionGuides,
  getAllPrinciples,
  getModelCategories
} from '@/lib/data';
import { tokenizeCodeField } from './tokenizer';

/**
 * Interface for modular search indexers.
 * Each indexer implementation registers its resource type and provides indexing items.
 */
export interface SearchIndexer {
  resourceType: string;
  getIndexEntries(): SearchResult[];
}

// Utility functions
function extractKeywordsFromProse(text: string): string[] {
  if (!text) return [];
  const stopWords = new Set(['i', 'need', 'a', 'to', 'the', 'is', 'for', 'or', 'when', 'you', 'and', 'in', 'on', 'at', 'with', 'by', 'from', 'of', 'that', 'this', 'it', 'as', 'be', 'are', 'will', 'can', 'not', 'an', 'if']);
  const words = text.toLowerCase().match(/\b[a-z]{3,}\b/g) || [];
  return [...new Set(words.filter(w => !stopWords.has(w)))];
}

function combineText(...values: Array<string | undefined>): string {
  return values.filter(Boolean).join(' ').trim();
}

function collectQuickTableText(table: { title: string; headers: string[]; rows: string[][] }): string {
  return [table.title, ...table.headers, ...table.rows.flat()].join(' ');
}

// ── Resource Indexer Implementations ──────────────────────────

export class PackageIndexer implements SearchIndexer {
  resourceType = 'package';
  getIndexEntries(): SearchResult[] {
    const results: SearchResult[] = [];

    getAllPackages().forEach(p => {
      const relatedCount = (p.related_content || []).length;
      const gotchasText = (p.tasks || []).flatMap(t => t.gotchas || []).join(' ');
      const gotchasKeywords = extractKeywordsFromProse(gotchasText);
      const gotchasArray = (p.tasks || []).flatMap(t => t.gotchas || []);

      results.push({
        type: 'package',
        id: p.id,
        search_id: `package:${p.id}`,
        name: p.name,
        title: p.title || p.name,
        summary: p.summary || p.description,
        href: `/packages/${p.id}`,
        updated_at: p.updated_at,
        confidence: p.confidence,
        engineering_maturity: p.engineering_maturity,
        canonical_status: p.canonical_status,
        related_count: relatedCount > 0 ? relatedCount : undefined,
        keywords: gotchasKeywords.length > 0 ? gotchasKeywords : undefined,
        gotchas: gotchasArray.length > 0 ? gotchasArray : undefined,
        source_type: 'package',
      });

      // Index package tasks
      p.tasks.forEach(task => {
        const anchor = task.task.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/gi, '');
        const proseText = combineText(task.mental_trigger, task.use_when, task.syntax);
        const proseKeywords = extractKeywordsFromProse(proseText);
        const codeContext = tokenizeCodeField(task.syntax || '');
        const codeTokens = codeContext.split(/\s+/).filter(Boolean);
        const equivalentKeywords = (task.visualization_equivalents || []).flatMap(eq => [eq.package, eq.task, eq.reason]);
        const keywords = [...new Set([...proseKeywords, ...codeTokens, ...equivalentKeywords])];

        results.push({
          type: 'function',
          id: `${p.id}::${task.task.replace(/[^a-z0-9]/gi, '-').toLowerCase()}`,
          search_id: `package-task:${p.id}:${task.task.replace(/[^a-z0-9]/gi, '-').toLowerCase()}`,
          name: task.task,
          title: task.task,
          summary: task.mental_trigger || task.syntax,
          href: `/packages/${p.id}#${anchor}`,
          updated_at: p.updated_at,
          category: p.name,
          fn_signature: task.task,
          fn_package_id: p.id,
          api_signature: task.syntax || task.task,
          mental_trigger: task.mental_trigger,
          code_context: codeContext,
          code_tokens: codeTokens.length > 0 ? codeTokens : undefined,
          keywords: keywords.length > 0 ? keywords : undefined,
          parent_name: p.name,
          source_type: 'package',
        });
      });
    });

    return results;
  }
}

export class CheatsheetIndexer implements SearchIndexer {
  resourceType = 'cheatsheet';
  getIndexEntries(): SearchResult[] {
    const results: SearchResult[] = [];

    getAllCheatsheetIds().forEach(id => {
      const cs = getCheatsheet(id);

      results.push({
        type: 'cheatsheet',
        id: cs.id,
        search_id: `cheatsheet:${cs.id}`,
        name: cs.name || cs.title,
        title: cs.title || cs.name,
        summary: cs.entries.map(e => e.problem).slice(0, 4).join(', '),
        updated_at: cs.updated_at,
        href: `/cheatsheets/${cs.id}`,
        parent_name: cs.name || cs.title,
        source_type: 'cheatsheet',
      });

      // Entries
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
          search_id: `cheatsheet-entry:${cs.id}:${idx}`,
          name: entry.problem,
          title: entry.problem,
          summary: entry.trigger || entry.problem,
          href: `/cheatsheets/${cs.id}#${entryAnchor}`,
          updated_at: cs.updated_at,
          category: cs.name || cs.title,
          api_signature: entry.snippet || entry.problem,
          mental_trigger: entry.trigger,
          code_context: codeContext,
          code_tokens: codeTokens.length > 0 ? codeTokens : undefined,
          keywords: keywords.length > 0 ? keywords : undefined,
          parent_name: cs.name || cs.title,
          source_type: 'cheatsheet',
        });
      });

      // Quick reference tables
      const quickRefTables = [...(cs.quick_reference_tables || []), ...(cs.quick_references || [])]
        .filter((table, index, list) => {
          const signature = JSON.stringify([table.title, table.headers, table.rows]);
          return index === list.findIndex(candidate => JSON.stringify([candidate.title, candidate.headers, candidate.rows]) === signature);
        });

      quickRefTables.forEach((table, idx) => {
        const searchText = collectQuickTableText(table);
        const tableTokens = [...new Set([
          table.title,
          ...(table.headers || []),
          ...(table.rows || []).flat(),
        ])];
        const keywords = [...new Set([...extractKeywordsFromProse(searchText), ...tableTokens])];

        results.push({
          type: 'quick_reference',
          id: `${cs.id}::quick-table-${idx}`,
          search_id: `quick-reference:${cs.id}:${idx}`,
          name: table.title,
          title: table.title,
          summary: table.headers.join(' · '),
          href: `/cheatsheets/${cs.id}`,
          updated_at: cs.updated_at,
          category: cs.name || cs.title,
          parent_name: cs.name || cs.title,
          keywords: keywords.length > 0 ? keywords : undefined,
          search_tokens: tableTokens,
          code_context: searchText,
          api_signature: searchText,
          source_type: 'cheatsheet',
        });
      });

      // Common errors
      (cs.common_errors || []).forEach((error, idx) => {
        const searchText = [error.error, error.cause, error.solution].join(' ');
        const keywords = extractKeywordsFromProse(searchText);
        results.push({
          type: 'checklist',
          id: `${cs.id}::common-error-${idx}`,
          search_id: `common-error:${cs.id}:${idx}`,
          name: error.error,
          title: error.error,
          summary: error.cause,
          href: `/cheatsheets/${cs.id}`,
          updated_at: cs.updated_at,
          category: cs.name || cs.title,
          parent_name: cs.name || cs.title,
          keywords: keywords.length > 0 ? keywords : undefined,
          search_tokens: [error.error, error.cause, error.solution],
          source_type: 'cheatsheet',
        });
      });

      // Checklists
      [...(cs.performance_checklist || []).map(item => ({ checklist: item, bucket: 'performance' as const })), ...(cs.production_checklist || []).map(item => ({ checklist: item, bucket: 'production' as const }))]
        .forEach((entry, idx) => {
          const checklistItem = entry.checklist;
          const checklistTitle = typeof checklistItem === 'string'
            ? checklistItem
            : checklistItem.title || checklistItem.area || checklistItem.purpose || `Checklist Item ${idx + 1}`;
          const checklistText = typeof checklistItem === 'string'
            ? checklistItem
            : [checklistItem.title, checklistItem.area, checklistItem.purpose, checklistItem.recommendations, ...(checklistItem.items || []), ...(checklistItem.notes || [])].filter(Boolean).join(' ');
          const keywords = extractKeywordsFromProse(checklistText);

          results.push({
            type: 'checklist',
            id: `${cs.id}::${entry.bucket}-checklist-${idx}`,
            search_id: `${entry.bucket}-checklist:${cs.id}:${idx}`,
            name: checklistTitle,
            title: checklistTitle,
            summary: checklistText,
            href: `/cheatsheets/${cs.id}`,
            updated_at: cs.updated_at,
            category: cs.name || cs.title,
            parent_name: cs.name || cs.title,
            keywords: keywords.length > 0 ? keywords : undefined,
            search_tokens: typeof checklistItem === 'string'
              ? [checklistItem]
              : [checklistItem.title, checklistItem.area, checklistItem.purpose, checklistItem.recommendations, ...(checklistItem.items || []), ...(checklistItem.notes || [])].filter(Boolean) as string[],
            source_type: 'cheatsheet',
          });
        });
    });

    return results;
  }
}

export class WorkflowIndexer implements SearchIndexer {
  resourceType = 'workflow';
  getIndexEntries(): SearchResult[] {
    const results: SearchResult[] = [];

    getAllWorkflows().forEach(w => {
      const stepNames = w.steps.map(s => s.name);
      const stepTools = w.steps.flatMap(s => s.tools);
      const keywords = extractKeywordsFromProse(w.overview || '');
      const relatedCount = [
        ...(w.related_patterns || []),
        ...(w.related_models || []),
        ...(w.related_packages || []),
        ...(w.related_debug_guides || []),
      ].length;

      results.push({
        type: 'workflow',
        id: w.id,
        search_id: `workflow:${w.id}`,
        name: w.name || w.title,
        title: w.title || w.name,
        summary: w.overview,
        category: w.category,
        updated_at: w.updated_at,
        href: `/workflows/${w.id}`,
        keywords: keywords.length > 0 ? keywords : undefined,
        related_count: relatedCount > 0 ? relatedCount : undefined,
        code_tokens: [...stepNames, ...stepTools],
      });
    });

    return results;
  }
}

export class PatternIndexer implements SearchIndexer {
  resourceType = 'pattern';
  getIndexEntries(): SearchResult[] {
    const results: SearchResult[] = [];

    getAllPatterns().forEach(p => {
      const decisionSummaryText = combineText(
        ...(p.decision_summary?.when_to_use || []),
        ...(p.decision_summary?.dont_use || []),
        p.decision_summary?.tradeoff
      );
      const antiPatternsText = (p.anti_patterns || []).map(entry => typeof entry === 'string' ? entry : `${entry.wrong} ${entry.impact} ${entry.fix}`).join(' ');
      const tradeoffsText = (p.tradeoffs || []).map(t => `${t.dimension} ${t.effect}`).join(' ');

      const proseText = combineText(p.description, p.concept, p.applicability, decisionSummaryText, antiPatternsText, tradeoffsText);
      const keywords = extractKeywordsFromProse(proseText);
      const relatedCount = [
        ...(p.related_workflows || []),
        ...(p.related_models || []),
        ...(p.related_packages || []),
        ...(p.related_principles || []),
        ...(p.related_debug_guides || []),
      ].length;

      results.push({
        type: 'pattern',
        id: p.id,
        search_id: `pattern:${p.id}`,
        name: p.title || p.id,
        title: p.title,
        summary: p.description,
        concept: p.concept,
        applicability: p.applicability,
        category: p.category,
        href: `/patterns/${p.id}`,
        updated_at: p.updated_at,
        keywords: keywords.length > 0 ? keywords : undefined,
        tags: p.tags,
        aliases: p.aliases,
        search_tokens: p.search_tokens,
        related_count: relatedCount > 0 ? relatedCount : undefined,
      });
    });

    return results;
  }
}

export class ModelIndexer implements SearchIndexer {
  resourceType = 'model';
  getIndexEntries(): SearchResult[] {
    const results: SearchResult[] = [];

    (['ml', 'dl', 'llm'] as const).forEach(cat => {
      const categoriesMeta = getModelCategories(cat);
      Object.entries(categoriesMeta).forEach(([sub, meta]: [string, {
        label: string;
        description: string;
        comparison_columns: string[];
        decision_flow?: Array<{ question: string; if_yes: string; if_no: string }>;
        linked_decision_guide?: string | null;
      }]) => {
        results.push({
          type: 'model',
          id: `compare-${cat}-${sub}`,
          search_id: `model-compare:${cat}:${sub}`,
          name: `${meta.label || sub} Comparison Matrix`,
          title: `${meta.label || sub} Comparison Matrix`,
          summary: meta.description || `Compare and select the best model from the ${meta.label || sub} category.`,
          href: `/models/${cat}/compare/${sub}`,
          updated_at: '2026-07-08',
          category: cat,
          keywords: [sub, 'comparison', 'matrix', 'decision', 'tree', 'selection', cat],
          decision_flow: meta.decision_flow,
        });
      });

      getAllModels(cat).forEach(m => {
        const prose = [
          m.decisionsummary.summary,
          ...m.decisionsummary.bestusecases,
          ...m.decisionsummary.avoidwhen,
          ...m.decisionsummary.strengths,
          ...m.decisionsummary.limitations,
        ].join(' ');
        const keywords = extractKeywordsFromProse(prose);

        results.push({
          type: 'model',
          id: m.id,
          search_id: `model:${m.id}`,
          name: m.name || m.title,
          title: m.title || m.name,
          summary: m.decisionsummary.summary,
          href: `/models/${cat}/${m.id}`,
          updated_at: m.updated_at,
          category: cat,
          problem_types: [...m.problem_types],
          keywords: keywords.length > 0 ? keywords : undefined,
        });
      });
    });

    return results;
  }
}

export class DecisionGuideIndexer implements SearchIndexer {
  resourceType = 'decision_guide';
  getIndexEntries(): SearchResult[] {
    const results: SearchResult[] = [];

    getAllDecisionGuides().forEach(dg => {
      const keywords = extractKeywordsFromProse(dg.description || '');
      const relatedCount = [
        ...(dg.related_workflows || []),
        ...(dg.related_models || []),
        ...(dg.related_packages || []),
      ].length;

      results.push({
        type: 'decision_guide',
        id: dg.id,
        search_id: `decision-guide:${dg.id}`,
        name: dg.title || dg.id,
        title: dg.title,
        summary: dg.description,
        href: `/decision-guides/${dg.id}`,
        updated_at: dg.updated_at,
        keywords: keywords.length > 0 ? keywords : undefined,
        tags: dg.tags,
        aliases: dg.aliases,
        search_tokens: dg.search_tokens,
        related_count: relatedCount > 0 ? relatedCount : undefined,
      });
    });

    return results;
  }
}

export class DebugGuideIndexer implements SearchIndexer {
  resourceType = 'debug_guide';
  getIndexEntries(): SearchResult[] {
    const results: SearchResult[] = [];

    getAllDebugGuides().forEach(dg => {
      const keywords = extractKeywordsFromProse(dg.description || '');
      const errorMessages = (dg.symptoms || []).map(s => s.error_message).filter((msg): msg is string => Boolean(msg));
      const diagnosticCommands = (dg.diagnostic_commands || []).map(c => c.command).filter((cmd): cmd is string => Boolean(cmd));
      const quickChecks = (dg.quick_identification || []).map(c => c.check).filter((check): check is string => Boolean(check));
      const rootCauses = (dg.root_causes || []).map(rc => rc.cause).filter((cause): cause is string => Boolean(cause));
      const symptomsDescriptions = (dg.symptoms || []).map(s => s.description).filter((desc): desc is string => Boolean(desc));

      const allKeywords = [...new Set([
        ...keywords,
        ...errorMessages.flatMap(msg => msg.toLowerCase().split(/[^a-z0-9]+/).filter(w => w.length >= 3)),
        ...diagnosticCommands.flatMap(cmd => cmd.toLowerCase().split(/[^a-z0-9]+/).filter(w => w.length >= 2)),
        ...rootCauses.flatMap(cause => cause.toLowerCase().split(/[^a-z0-9]+/).filter(w => w.length >= 3)),
        ...symptomsDescriptions.flatMap(desc => desc.toLowerCase().split(/[^a-z0-9]+/).filter(w => w.length >= 3)),
      ])];

      const relatedCount = [
        ...(dg.related_packages || []),
        ...(dg.related_workflows || []),
        ...(dg.related_patterns || []),
        ...(dg.related_models || []),
        ...(dg.related_registry || []),
      ].length;

      results.push({
        type: 'debug_guide',
        id: dg.id,
        search_id: `debug-guide:${dg.id}`,
        name: dg.title || dg.id,
        title: dg.title,
        summary: dg.description,
        href: `/debug-guides/${dg.id}`,
        updated_at: dg.updated_at,
        keywords: allKeywords.length > 0 ? allKeywords : undefined,
        tags: dg.tags,
        aliases: dg.aliases,
        search_tokens: dg.search_tokens,
        error_messages: errorMessages.length > 0 ? errorMessages : undefined,
        diagnostic_commands: diagnosticCommands.length > 0 ? diagnosticCommands : undefined,
        quick_checks: quickChecks.length > 0 ? quickChecks : undefined,
        confidence: dg.confidence,
        engineering_maturity: dg.engineering_maturity,
        canonical_status: dg.canonical_status,
        difficulty: dg.difficulty,
        related_count: relatedCount > 0 ? relatedCount : undefined,
        root_causes: rootCauses.length > 0 ? rootCauses : undefined,
        symptoms: symptomsDescriptions.length > 0 ? symptomsDescriptions : undefined,
      });
    });

    return results;
  }
}

export class PrincipleIndexer implements SearchIndexer {
  resourceType = 'principle';
  getIndexEntries(): SearchResult[] {
    const results: SearchResult[] = [];

    getAllPrinciples().forEach(p => {
      const keywords = extractKeywordsFromProse(p.description || '');
      const relatedCount = [
        ...(p.referenced_by_patterns || []),
        ...(p.referenced_by_models || []),
        ...(p.referenced_by_workflows || []),
      ].length;

      results.push({
        type: 'principle',
        id: p.id,
        search_id: `principle:${p.id}`,
        name: p.title || p.id,
        title: p.title,
        summary: p.description,
        href: `/principles/${p.id}`,
        updated_at: p.updated_at,
        keywords: keywords.length > 0 ? keywords : undefined,
        tags: p.tags,
        aliases: p.aliases,
        search_tokens: p.search_tokens,
        related_count: relatedCount > 0 ? relatedCount : undefined,
      });
    });

    return results;
  }
}

export class RegistryIndexer implements SearchIndexer {
  resourceType = 'registry';
  getIndexEntries(): SearchResult[] {
    const results: SearchResult[] = [];

    getAllRegistryFamilies().forEach(family => {
      const familyKeywords = extractKeywordsFromProse(family.description || '');
      const allKeywords = [...new Set([...familyKeywords, ...(family.keywords || []), ...(family.aliases || [])])];

      results.push({
        type: 'registry',
        id: family.id,
        search_id: `registry-family:${family.id}`,
        name: family.name,
        title: family.name,
        summary: family.description,
        href: `/registry/families/${family.id}`,
        updated_at: family.updated_at,
        category: 'families',
        keywords: allKeywords.length > 0 ? allKeywords : undefined,
        tags: family.tags,
        aliases: family.aliases,
        search_tokens: family.search_tokens,
        production_ready: family.engineering_snapshot?.production_ready,
        commercial_use: family.license_info?.commercial_use,
        modality: family.modality,
        capabilities: family.capabilities,
      });

      const variants = getRegistryVariantsByFamily(family.id);
      variants.forEach(variant => {
        const variantKeywords = extractKeywordsFromProse(variant.description || '');
        const variantAllKeywords = [...new Set([...variantKeywords, ...(variant.keywords || []), ...(variant.aliases || [])])];

        results.push({
          type: 'registry',
          id: `${family.id}/${variant.id}`,
          search_id: `registry-variant:${family.id}:${variant.id}`,
          name: variant.name,
          title: variant.name,
          summary: variant.description,
          href: `/registry/families/${family.id}/${variant.id}`,
          updated_at: variant.updated_at,
          category: 'variants',
          family: family.id,
          keywords: variantAllKeywords.length > 0 ? variantAllKeywords : undefined,
          tags: variant.tags,
          aliases: variant.aliases,
          search_tokens: variant.search_tokens,
          parameter_count: variant.specifications?.parameter_count,
          context_window: variant.specifications?.context_window,
          min_gpu_memory: variant.hardware?.minimum_gpu_memory,
          production_ready: variant.engineering_snapshot?.production_ready,
          commercial_use: variant.license_info?.commercial_use,
          modality: family.modality,
          capabilities: variant.capabilities || family.capabilities,
        });
      });
    });

    return results;
  }
}

export class ProblemIndexer implements SearchIndexer {
  resourceType = 'problem';
  getIndexEntries(): SearchResult[] {
    const results: SearchResult[] = [];

    const taxonomyPath = path.join(process.cwd(), 'data', 'problem-index', 'taxonomy.json');
    if (!fs.existsSync(taxonomyPath)) return results;

    const raw = fs.readFileSync(taxonomyPath, 'utf-8');
    const taxonomy = JSON.parse(raw);

    for (const [categoryName, data] of Object.entries(taxonomy)) {
      const catObj = data as { description?: string; problems?: Array<{ id: string; name: string; description: string; aliases?: string[]; keywords?: string[]; search_tokens?: string[] }> };
      if (catObj && Array.isArray(catObj.problems)) {
        for (const problem of catObj.problems) {
          const proseText = combineText(problem.description, ...(problem.aliases || []), ...(problem.keywords || []));
          const keywords = extractKeywordsFromProse(proseText);

          results.push({
            type: 'function', // map problems to searchable function/entry UI type
            id: `problem::${problem.id}`,
            search_id: `problem:${problem.id}`,
            name: problem.name || problem.id,
            title: problem.name,
            summary: problem.description,
            href: `/problem-index#${problem.id}`,
            updated_at: '2026-07-24',
            category: categoryName,
            keywords: keywords.length > 0 ? keywords : undefined,
            aliases: problem.aliases,
            search_tokens: problem.search_tokens,
            parent_name: categoryName,
          });
        }
      }
    }

    return results;
  }
}

// ── SearchIndexerRegistry ─────────────────────────────────────

export class SearchIndexerRegistry {
  private static indexers: Map<string, SearchIndexer> = new Map();

  public static register(indexer: SearchIndexer): void {
    this.indexers.set(indexer.resourceType, indexer);
  }

  public static getIndexers(): SearchIndexer[] {
    return Array.from(this.indexers.values());
  }

  public static buildAllIndexEntries(): SearchResult[] {
    const results: SearchResult[] = [];
    for (const indexer of this.indexers.values()) {
      results.push(...indexer.getIndexEntries());
    }
    return results;
  }
}

// Register default providers
SearchIndexerRegistry.register(new PackageIndexer());
SearchIndexerRegistry.register(new CheatsheetIndexer());
SearchIndexerRegistry.register(new WorkflowIndexer());
SearchIndexerRegistry.register(new PatternIndexer());
SearchIndexerRegistry.register(new ModelIndexer());
SearchIndexerRegistry.register(new DecisionGuideIndexer());
SearchIndexerRegistry.register(new DebugGuideIndexer());
SearchIndexerRegistry.register(new PrincipleIndexer());
SearchIndexerRegistry.register(new RegistryIndexer());
SearchIndexerRegistry.register(new ProblemIndexer());
