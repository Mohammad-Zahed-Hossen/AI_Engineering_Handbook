import { z } from 'zod';
import { BaseMetaSchema, ContentRefSchema } from './meta';

export const ModelCategorySchema = z.enum(['ml', 'dl', 'llm']);
export type ModelCategory = z.infer<typeof ModelCategorySchema>;

export const ProblemTypeSchema = z.enum([
  'classification',
  'regression',
  'clustering',
  'generation',
  'embedding',
  'detection',
  'segmentation',
]);
export type ProblemType = z.infer<typeof ProblemTypeSchema>;

export const SpeedRatingSchema = z.enum(['fast', 'medium', 'slow']);
export type SpeedRating = z.infer<typeof SpeedRatingSchema>;

export const SizeRatingSchema = z.enum(['low', 'medium', 'high']);
export type SizeRating = z.infer<typeof SizeRatingSchema>;

export const InterpretabilityRatingSchema = z.enum(['high', 'medium', 'low']);
export type InterpretabilityRating = z.infer<typeof InterpretabilityRatingSchema>;

export const HyperParameterSchema = z.object({
  name: z.string(),
  default: z.union([z.string(), z.number(), z.null()]),
  note: z.string(),
});

export const ModelSchema = BaseMetaSchema.extend({
  id: z.string(),
  name: z.string(),
  category: ModelCategorySchema,
  problem_types: z.array(ProblemTypeSchema),
  summary: z.string(),
  use_when: z.string(),
  avoid_when: z.string(),
  pros: z.array(z.string()),
  cons: z.array(z.string()),
  key_hyperparams: z.array(HyperParameterSchema),
  training_speed: SpeedRatingSchema,
  inference_speed: SpeedRatingSchema,
  memory_usage: SizeRatingSchema,
  interpretability: InterpretabilityRatingSchema,
  quick_start: z.string(),
  alternatives: z.array(ContentRefSchema),
});
