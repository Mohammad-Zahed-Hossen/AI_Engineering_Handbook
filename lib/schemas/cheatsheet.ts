import { z } from 'zod';
import { BaseMetaSchema } from './meta';

export const CheatsheetItemSchema = z.object({
  fn: z.string(),
  purpose: z.string(),
});

export const CheatsheetGroupSchema = z.object({
  group: z.string(),
  items: z.array(CheatsheetItemSchema),
});

export const CheatsheetSchema = BaseMetaSchema.extend({
  id: z.string(),
  name: z.string(),
  groups: z.array(CheatsheetGroupSchema),
});
