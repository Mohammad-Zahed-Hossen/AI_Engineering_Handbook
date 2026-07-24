import { z } from 'zod';
import { BaseMetaSchema } from './base';

export const QuickReferenceTableSchema = z.object({
  title: z.string(),
  headers: z.array(z.string()),
  rows: z.array(z.array(z.string())),
  monoColumns: z.array(z.number()).optional(),
});

export const CommonErrorSchema = z.object({
  error: z.string(),
  cause: z.string(),
  solution: z.string(),
});

export const PerformanceChecklistObjectSchema = z.object({
  title: z.string().optional(),
  area: z.string().optional(),
  purpose: z.string().optional(),
  items: z.array(z.string()).optional(),
  recommendations: z.string().optional(),
  notes: z.array(z.string()).optional(),
});

export const ProductionChecklistItemSchema = z.union([
  z.string(),
  PerformanceChecklistObjectSchema,
]);

export const CheatsheetEntrySchema = z.object({
  problem: z.string(),
  trigger: z.string(),
  snippet: z.string(),
  minimal_notes: z.string(),
  common_bug: z.string(),
  docs_url: z.string().url(),
  language: z.enum(['python', 'bash', 'sh', 'sql', 'yaml', 'json', 'docker', 'javascript', 'js', 'typescript', 'ts', 'text']).optional(),
  // Relationship fields for cross-linking
  related_packages: z.array(z.string()).optional().default([]),
  related_workflows: z.array(z.string()).optional().default([]),
  related_patterns: z.array(z.string()).optional().default([]),
  related_decision_guides: z.array(z.string()).optional().default([]),
  related_apis: z.array(z.string()).optional().default([]),
});

export const CheatsheetSchema = BaseMetaSchema.extend({
  // Cheatsheet-specific fields
  name: z.string(),
  entries: z.array(CheatsheetEntrySchema).max(250, "Cheatsheet cannot have more than 250 entries"),

  quick_reference_tables: z.array(QuickReferenceTableSchema).optional().default([]),
  
  // Reference back to package (per spec, cheatsheets must link back to package)
  package_reference: z.string().optional(),

  common_errors: z.array(CommonErrorSchema).optional().default([]),
  performance_checklist: z.array(ProductionChecklistItemSchema).optional().default([]),
  production_checklist: z.array(ProductionChecklistItemSchema).optional().default([]),
  
  // Quick reference tables for structured lookup data
  quick_references: z.array(z.object({
    title: z.string(),
    headers: z.array(z.string()),
    rows: z.array(z.array(z.string())),
    monoColumns: z.array(z.number()).optional(),
  })).optional(),
});
