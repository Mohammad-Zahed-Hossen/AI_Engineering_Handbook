import { cache } from 'react';
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

  getAllPackages().forEach(p => {
    // Calculate related content count for relationship boosting
    const relatedCount = [
      ...(p.related_content || []),
    ].length;
    
    // Index gotchas for error message search (from tasks)
    const gotchasText = (p.tasks || []).flatMap(t => t.gotchas || []).join(' ');
    const gotchasKeywords = extractKeywordsFromProse(gotchasText);
    const gotchasArray = (p.tasks || []).flatMap(t => t.gotchas || []);
    
    results.push({
      type: 'package',
      id: p.id,
      search_id: `package:${p.id}`,
      name: p.name,
      summary: p.summary,
      href: `/packages/${p.id}`,
      updated_at: p.updated_at,
      // Phase 1 additions - quality signals
      confidence: p.confidence,
      engineering_maturity: p.engineering_maturity,
      canonical_status: p.canonical_status,
      // Phase 2 additions - relationship count
      related_count: relatedCount > 0 ? relatedCount : undefined,
      // Index gotchas for error message search
      keywords: gotchasKeywords.length > 0 ? gotchasKeywords : undefined,
      // Phase 2 additions - gotchas array for direct indexing
      gotchas: gotchasArray.length > 0 ? gotchasArray : undefined,
    });
  });

  // Index package tasks as searchable entries with enriched fields
  getAllPackages().forEach(pkg => {
    pkg.tasks.forEach(task => {
      const anchor = task.task.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/gi, '');
      const proseText = combineText(task.mental_trigger, task.use_when, task.syntax);
      const proseKeywords = extractKeywordsFromProse(proseText);
      const codeContext = tokenizeCodeField(task.syntax || '');
      const codeTokens = codeContext.split(/\s+/).filter(Boolean);
      const equivalentKeywords = (task.visualization_equivalents || []).flatMap(eq => [eq.package, eq.task, eq.reason]);
      const keywords = [...new Set([...proseKeywords, ...codeTokens, ...equivalentKeywords])];

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
         // API signature for code query matching
         api_signature: task.syntax || task.task,
         // Phase 1 additions
         mental_trigger: task.mental_trigger,
         code_context: codeContext,
         code_tokens: codeTokens.length > 0 ? codeTokens : undefined,
         keywords: keywords.length > 0 ? keywords : undefined,
         parent_name: pkg.name,
         // Source type to distinguish package functions from cheatsheet entries
         source_type: 'package',
        });
     });
   });
   
   (['ml', 'dl', 'llm'] as const).forEach(cat => {
    // Add subcategory comparison pages to search results
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
        name: `${meta.label || sub} Comparison Matrix`,
        summary: meta.description || `Compare and select the best model from the ${meta.label || sub} category.`,
        href: `/models/${cat}/compare/${sub}`,
        updated_at: '2026-07-08',
        category: cat,
        keywords: [sub, 'comparison', 'matrix', 'decision', 'tree', 'selection', cat],
        // Phase 2 additions - decision flow indexing
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
        name: m.name || m.title,
        summary: m.decisionsummary.summary,
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
    
    // Calculate related content count for relationship boosting
    const relatedCount = [
      ...(w.related_patterns || []),
      ...(w.related_models || []),
      ...(w.related_packages || []),
      ...(w.related_debug_guides || []),
    ].length;

    results.push({
      type: 'workflow',
      id: w.id,
      name: w.name || w.title,
      summary: w.overview,
      category: w.category,
      updated_at: w.updated_at,
      href: `/workflows/${w.id}`,
      // Phase 1 additions
      keywords: keywords.length > 0 ? keywords : undefined,
      // Phase 2 additions - relationship count
      related_count: relatedCount > 0 ? relatedCount : undefined,
      // Store step names and tools in keywords for now until we add dedicated fields
      code_tokens: [...stepNames, ...stepTools],
    });
  });

  // Index registry families and variants with enriched search fields
  getAllRegistryFamilies().forEach(family => {
    // Index family - use search_id to avoid collision with packages
    const familyKeywords = extractKeywordsFromProse(family.description || '');
    const allKeywords = [...new Set([...familyKeywords, ...family.keywords || [], ...family.aliases || []])];
    
     results.push({
       type: 'registry',
       id: family.id,
       search_id: `registry-family:${family.id}`,
       name: family.name,
       summary: family.description,
       href: `/registry/families/${family.id}`,
       updated_at: family.updated_at,
       category: 'families',
       // Phase 5 additions - structured fields for faceted search
       keywords: allKeywords.length > 0 ? allKeywords : undefined,
       tags: family.tags,
       aliases: family.aliases,
       search_tokens: family.search_tokens,
       // Additional structured fields
       production_ready: family.engineering_snapshot?.production_ready,
       commercial_use: family.license_info?.commercial_use,
       modality: family.modality,
       capabilities: family.capabilities,
     });

    // Index variants
    const variants = getRegistryVariantsByFamily(family.id);
    variants.forEach(variant => {
      const variantKeywords = extractKeywordsFromProse(variant.description || '');
      const variantAllKeywords = [...new Set([...variantKeywords, ...variant.keywords || [], ...variant.aliases || []])];
      
      results.push({
        type: 'registry',
        id: `${family.id}/${variant.id}`,
        name: variant.name,
        summary: variant.description,
        href: `/registry/families/${family.id}/${variant.id}`,
        updated_at: variant.updated_at,
        category: 'variants',
        family: family.id,
        // Phase 5 additions - structured fields for faceted search
        keywords: variantAllKeywords.length > 0 ? variantAllKeywords : undefined,
        tags: variant.tags,
        aliases: variant.aliases,
        search_tokens: variant.search_tokens,
        // Additional structured fields
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

  // Index cheatsheet entries individually with enriched fields
  getAllCheatsheetIds().forEach(id => {
    const cs = getCheatsheet(id);
    // Add cheatsheet-level entry - use original id for routing, search_id for internal indexing
    // to avoid collision with packages that have the same id
    results.push({
      type: 'cheatsheet',
      id: cs.id,
      search_id: `cheatsheet:${cs.id}`,
      name: cs.name || cs.title,
      summary: cs.entries.map(entry => entry.problem).slice(0, 4).join(', '),
      updated_at: cs.updated_at,
      href: `/cheatsheets/${cs.id}`,
      parent_name: cs.name || cs.title,
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
        category: cs.name || cs.title,
        // API signature for code query matching
        api_signature: entry.snippet || entry.problem,
        // Phase 1 additions
        mental_trigger: entry.trigger,
        code_context: codeContext,
        code_tokens: codeTokens.length > 0 ? codeTokens : undefined,
        keywords: keywords.length > 0 ? keywords : undefined,
        parent_name: cs.name || cs.title,
        // Source type to distinguish package functions from cheatsheet entries
        source_type: 'cheatsheet',
      });
    });
  });
   
  // Index patterns with enriched search fields
  getAllPatterns().forEach(p => {
    const decisionSummaryText = combineText(
      ...(p.decision_summary?.when_to_use || []),
      ...(p.decision_summary?.dont_use || []),
      p.decision_summary?.tradeoff
    );
    
    const antiPatternsText = (p.anti_patterns || []).map(entry => {
      if (typeof entry === 'string') {
        return entry;
      }
      return `${entry.wrong} ${entry.impact} ${entry.fix}`;
    }).join(' ');
    
    const tradeoffsText = (p.tradeoffs || []).map(t => `${t.dimension} ${t.effect}`).join(' ');
    
    const proseText = combineText(
      p.description,
      p.concept,
      p.applicability,
      decisionSummaryText,
      antiPatternsText,
      tradeoffsText
    );
    const keywords = extractKeywordsFromProse(proseText);
    
    // Calculate related content count for relationship boosting
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
      // Phase 2 additions - relationship count
      related_count: relatedCount > 0 ? relatedCount : undefined,
    });
  });

  // Index debug guides with enriched search fields including error messages
  getAllDebugGuides().forEach(dg => {
    const keywords = extractKeywordsFromProse(dg.description || '');
    
    // Extract error messages from symptoms for direct search
    const errorMessages = (dg.symptoms || [])
      .map(s => s.error_message)
      .filter((msg): msg is string => Boolean(msg));
    
    // Extract diagnostic commands for CLI search
    const diagnosticCommands = (dg.diagnostic_commands || [])
      .map(c => c.command)
      .filter((cmd): cmd is string => Boolean(cmd));
    
    // Extract quick identification checks
    const quickChecks = (dg.quick_identification || [])
      .map(c => c.check)
      .filter((check): check is string => Boolean(check));
    
    // Extract root causes for additional search context
    const rootCauses = (dg.root_causes || [])
      .map(rc => rc.cause)
      .filter((cause): cause is string => Boolean(cause));
    
    // Extract symptoms descriptions for additional search context
    const symptomsDescriptions = (dg.symptoms || [])
      .map(s => s.description)
      .filter((desc): desc is string => Boolean(desc));
    
    const allKeywords = [...new Set([
      ...keywords,
      ...errorMessages.flatMap(msg => msg.toLowerCase().split(/[^a-z0-9]+/).filter(w => w.length >= 3)),
      ...diagnosticCommands.flatMap(cmd => cmd.toLowerCase().split(/[^a-z0-9]+/).filter(w => w.length >= 2)),
      ...rootCauses.flatMap(cause => cause.toLowerCase().split(/[^a-z0-9]+/).filter(w => w.length >= 3)),
      ...symptomsDescriptions.flatMap(desc => desc.toLowerCase().split(/[^a-z0-9]+/).filter(w => w.length >= 3)),
    ])];
    
    // Calculate related content count for relationship boosting
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
      name: dg.title || dg.id,
      title: dg.title,
      summary: dg.description,
      href: `/debug-guides/${dg.id}`,
      updated_at: dg.updated_at,
      // Phase 1 additions - error message indexing
      keywords: allKeywords.length > 0 ? allKeywords : undefined,
      tags: dg.tags,
      aliases: dg.aliases,
      search_tokens: dg.search_tokens,
      // Phase 1 additions - CLI command search
      error_messages: errorMessages.length > 0 ? errorMessages : undefined,
      diagnostic_commands: diagnosticCommands.length > 0 ? diagnosticCommands : undefined,
      quick_checks: quickChecks.length > 0 ? quickChecks : undefined,
      // Phase 1 additions - quality signals
      confidence: dg.confidence,
      engineering_maturity: dg.engineering_maturity,
      canonical_status: dg.canonical_status,
      difficulty: dg.difficulty,
      // Phase 2 additions - relationship count
      related_count: relatedCount > 0 ? relatedCount : undefined,
      // Phase 2 additions - root causes and symptoms arrays for direct indexing
      root_causes: rootCauses.length > 0 ? rootCauses : undefined,
      symptoms: symptomsDescriptions.length > 0 ? symptomsDescriptions : undefined,
    });
  });

  // Index decision guides with enriched search fields
  getAllDecisionGuides().forEach(dg => {
    const keywords = extractKeywordsFromProse(dg.description || '');
    
    // Calculate related content count for relationship boosting
    const relatedCount = [
      ...(dg.related_workflows || []),
      ...(dg.related_models || []),
      ...(dg.related_packages || []),
    ].length;
    
    results.push({
      type: 'decision_guide',
      id: dg.id,
      name: dg.title || dg.id,
      title: dg.title,
      summary: dg.description,
      href: `/decision-guides/${dg.id}`,
      updated_at: dg.updated_at,
      // Phase 7 additions
      keywords: keywords.length > 0 ? keywords : undefined,
      tags: dg.tags,
      aliases: dg.aliases,
      search_tokens: dg.search_tokens,
      // Phase 2 additions - relationship count
      related_count: relatedCount > 0 ? relatedCount : undefined,
    });
  });

  // Index principles with enriched search fields
  getAllPrinciples().forEach(p => {
    const keywords = extractKeywordsFromProse(p.description || '');
    
    // Calculate related content count for relationship boosting
    const relatedCount = [
      ...(p.referenced_by_patterns || []),
      ...(p.referenced_by_models || []),
      ...(p.referenced_by_workflows || []),
    ].length;
    
    results.push({
      type: 'principle',
      id: p.id,
      name: p.title || p.id,
      title: p.title,
      summary: p.description,
      href: `/principles/${p.id}`,
      updated_at: p.updated_at,
      // Phase 7 additions
      keywords: keywords.length > 0 ? keywords : undefined,
      tags: p.tags,
      aliases: p.aliases,
      search_tokens: p.search_tokens,
      // Phase 2 additions - relationship count
      related_count: relatedCount > 0 ? relatedCount : undefined,
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
