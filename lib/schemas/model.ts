import { z } from 'zod';
import { BaseMetaSchema, ContentRefSchema } from './base';

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

export const ModelSubcategorySchema = z.enum([
  // Classical ML
  'regression',
  'classification',
  'clustering',
  'dimensionality_reduction',
  'anomaly_detection',
  'ensemble_learning',
  // DL architecture primitives
  'convolutional',
  'recurrent_sequence',
  'transformer_encoder',
  'transformer_decoder',
  'generative_adversarial',
  'diffusion',
  'graph_neural_network',
  // Vision specializations
  'vision_backbone',
  'vision_detection',
  'vision_segmentation',
  // LLM architecture families
  'foundation_llm',
  'instruction_tuned_llm',
  'multimodal_llm',
  'small_efficient_llm',
  'embedding_llm',
  // Applied domains
  'time_series',
  'recommendation',
  'reinforcement_learning',
]);
export type ModelSubcategory = z.infer<typeof ModelSubcategorySchema>;

export const ModelSchema = BaseMetaSchema.extend({
  // Model-specific fields
  category: ModelCategorySchema,
  subcategory: ModelSubcategorySchema,
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
  related_workflows: z.array(z.string()),
  decision_notes: z.string().optional(),
  competitors: z.array(ContentRefSchema).optional(),
  
  // Cost and Latency (structured metadata)
  cost_notes: z.string().optional(), // Cost per token, compute requirements, pricing model
  latency_notes: z.string().optional(), // Latency per request, throughput characteristics
  
  // Observability (structured metadata)
  observability_notes: z.string().optional(), // Metrics, logging, tracing conventions
  
  // Research background
  research_background: z.string().optional(),
  computational_requirements: z.string().optional(),
});
