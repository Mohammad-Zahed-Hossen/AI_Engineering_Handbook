import { z } from 'zod';
import { BaseMetaSchema } from './base';

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

export const RegistryCategorySchema = z.enum([
  'models',
  'datasets',
  'benchmarks',
  'services',
  'leaderboards',
  'mcp_servers',
  'repos',
]);
export type RegistryCategory = z.infer<typeof RegistryCategorySchema>;

// Structured missing model reference for graph completeness
export const MissingModelRefSchema = z.object({
  type: z.literal('missing'),
  id: z.string(),
  reason: z.string().optional(),
});
export type MissingModelRef = z.infer<typeof MissingModelRefSchema>;

// Link field supports both string paths and structured missing references
export const RegistryModelSchema = BaseMetaSchema.extend({
  // Registry-specific fields
  task: RegistryTaskSchema,
  category: RegistryCategorySchema,
  size_mb: z.number(),
  link: z.union([z.string(), MissingModelRefSchema]),
  
  // Deployment metadata (per spec, registry stores metadata only)
  hardware_requirements: z.string().optional(),
  download_location: z.string().url().optional(),
  license: z.string().optional(),
  supported_tasks: z.array(z.string()).default([]),
  version_compatibility: z.array(z.string()).default([]),
  
  // Reference to official resources
  official_resources: z.array(z.string().url()).default([]),
});
