import { z } from 'zod';
import { BaseMetaSchema } from './base';

export const CheatsheetEntrySchema = z.object({
  problem: z.string(),
  trigger: z.string(),
  snippet: z.string(),
  minimal_notes: z.string(),
  common_bug: z.string(),
  docs_url: z.string().url(),
});

export const CheatsheetSchema = BaseMetaSchema.extend({
  // Cheatsheet-specific fields
  name: z.string(),
  entries: z.array(CheatsheetEntrySchema).max(130, "Cheatsheet cannot have more than 130 entries"),
  
  // Reference back to package (per spec, cheatsheets must link back to package)
  package_reference: z.string().optional(),

  // Additional sections to preserve all markdown knowledge losslessly
  common_plot_types: z.array(z.object({
    api: z.string(),
    purpose: z.string(),
    most_important_parameters: z.string()
  })).optional(),
  
  marker_reference: z.array(z.object({
    marker: z.string(),
    meaning: z.string()
  })).optional(),
  
  line_styles: z.array(z.object({
    style: z.string(),
    meaning: z.string()
  })).optional(),
  
  named_colors: z.array(z.object({
    color: z.string(),
    typical_use: z.string()
  })).optional(),
  
  recommended_colormaps: z.array(z.object({
    type: z.string(),
    colormaps: z.string()
  })).optional(),
  
  rcparams_quick_reference: z.array(z.object({
    setting: z.string(),
    use: z.string()
  })).optional(),
  
  savefig_parameters: z.array(z.object({
    parameter: z.string(),
    purpose: z.string()
  })).optional(),
  
  figure_layout_options: z.array(z.object({
    api: z.string(),
    purpose: z.string(),
    best_for: z.string()
  })).optional(),
  
  pyplot_vs_object_oriented_api: z.array(z.object({
    api: z.string(),
    advantages: z.string(),
    limitations: z.string(),
    recommended_use_cases: z.string()
  })).optional(),
  
  performance_checklist: z.array(z.object({
    area: z.string(),
    recommendations: z.string()
  })).optional(),
  
  common_errors: z.array(z.object({
    error: z.string(),
    cause: z.string(),
    solution: z.string()
  })).optional(),
  
  production_checklist: z.array(z.string()).optional(),
  quick_references: z.array(z.object({
    title: z.string(),
    headers: z.array(z.string()),
    rows: z.array(z.array(z.string())),
  })).optional(),
});
