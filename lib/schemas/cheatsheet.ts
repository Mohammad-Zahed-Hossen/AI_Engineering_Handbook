import { z } from 'zod';
import { BaseMetaSchema } from './meta';

export const CheatsheetEntrySchema = z.object({
  problem: z.string(),
  trigger: z.string(),
  snippet: z.string(),
  minimal_notes: z.string(),
  common_bug: z.string(),
  docs_url: z.string().url(),
});

export const CheatsheetSchema = BaseMetaSchema.extend({
  id: z.string(),
  name: z.string(),
  entries: z.array(CheatsheetEntrySchema),
});
