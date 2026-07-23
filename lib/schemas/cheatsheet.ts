import { z } from 'zod';
import { BaseMetaSchema } from './base';

export const CheatsheetEntrySchema = z.object({
  problem: z.string(),
  trigger: z.string(),
  snippet: z.string(),
  minimal_notes: z.string(),
  common_bug: z.string(),
  docs_url: z.string().url(),
  language: z.enum(['python', 'bash', 'sh', 'sql', 'yaml', 'json', 'docker', 'javascript', 'js', 'typescript', 'ts', 'text']).optional(),
});

export const CheatsheetSchema = BaseMetaSchema.extend({
  // Cheatsheet-specific fields
  name: z.string(),
  entries: z.array(CheatsheetEntrySchema).max(250, "Cheatsheet cannot have more than 250 entries"),
  
  // Reference back to package (per spec, cheatsheets must link back to package)
  package_reference: z.string().optional(),
  
  // Quick reference tables for structured lookup data
  quick_references: z.array(z.object({
    title: z.string(),
    headers: z.array(z.string()),
    rows: z.array(z.array(z.string())),
    monoColumns: z.array(z.number()).optional(),
  })).optional(),
});
