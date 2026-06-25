import { z } from 'zod';
import { BaseMetaSchema, ContentRefSchema } from './meta';

export const RegistryTaskSchema = z.enum([
  'embedding',
  'reranker',
  'vision',
  'speech',
  'llm',
  'multimodal',
  'ocr',
]);
export type RegistryTask = z.infer<typeof RegistryTaskSchema>;

export const ModelStatusSchema = z.enum(['active', 'experimental', 'deprecated']);
export type ModelStatus = z.infer<typeof ModelStatusSchema>;

export const RegistryModelSchema = BaseMetaSchema.extend({
  id: z.string(),
  model_id: z.string(),
  task: RegistryTaskSchema,
  language: z.string(),
  dimension: z.number().optional(),
  use_case: z.string(),
  size_mb: z.number(),
  status: ModelStatusSchema,
  notes: z.string(),
  quick_start: z.string(),
  alternatives: z.array(ContentRefSchema),
  last_verified: z.string(),
});
