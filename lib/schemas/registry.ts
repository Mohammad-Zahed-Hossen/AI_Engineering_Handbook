import { z } from 'zod';

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

// Structured missing model reference for graph completeness
export const MissingModelRefSchema = z.object({
  type: z.literal('missing'),
  id: z.string(),
  reason: z.string().optional(),
});
export type MissingModelRef = z.infer<typeof MissingModelRefSchema>;

// Link field supports both string paths and structured missing references
export const RegistryModelSchema = z.object({
  id: z.string(),
  task: RegistryTaskSchema,
  size_mb: z.number(),
  link: z.union([z.string(), MissingModelRefSchema]),
});
