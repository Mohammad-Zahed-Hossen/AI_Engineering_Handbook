import { z } from 'zod';
import { BaseMetaSchema } from './base';

/**
 * Pattern Schema
 * 
 * Patterns capture reusable engineering knowledge that survives technology changes.
 * They are tool-agnostic, implementation-independent, and concept-focused.
 * 
 * DECISION RULE: Pattern vs Principle
 * If the concept requires code or a library to demonstrate, it's a Pattern.
 * If it's provable/derivable independent of any implementation, it's a Principle.
 * 
 * Examples: Early stopping is a Pattern (requires implementation details).
 * Gradient descent is a Principle (mathematically derivable).
 * 
 * Specification: AENS Knowledge Layer Specification v1.0, Section 11
 */

export const PatternCategorySchema = z.enum([
  // Data
  'eda',
  'data_validation',
  'data_cleaning',
  'dataset_split',
  'feature_engineering',
  'feature_scaling',
  'feature_selection',
  // Training
  'training_loop',
  'validation_loop',
  'checkpointing',
  'resume_training',
  'early_stopping',
  'gradient_accumulation',
  'mixed_precision',
  // Optimization
  'hyperparameter_search',
  'cross_validation',
  'learning_rate_scheduling',
  'regularization',
  'class_balancing',
  'knowledge_distillation',
  // Inference
  'batch_inference',
  'streaming_inference',
  'online_inference',
  'kv_cache',
  'speculative_decoding',
  'prompt_caching',
  // Deployment
  'canary_deployment',
  'shadow_deployment',
  'blue_green_deployment',
  'autoscaling',
  'monitoring',
  'rollback',
]);
export type PatternCategory = z.infer<typeof PatternCategorySchema>;

export const VariationSchema = z.object({
  name: z.string(),
  description: z.string(),
  use_when: z.string().optional(),
  benefit: z.string().optional(),
  tradeoff: z.string().optional(),
});
export type Variation = z.infer<typeof VariationSchema>;

export const AntiPatternSchema = z.object({
  wrong: z.string(),
  impact: z.string(),
  fix: z.string(),
});
export type AntiPattern = z.infer<typeof AntiPatternSchema>;

export const DecisionFlowStepSchema = z.object({
  question: z.string(),
  if_yes: z.string(),
  if_no: z.string(),
});
export type DecisionFlowStep = z.infer<typeof DecisionFlowStepSchema>;

export const TradeoffDimensionSchema = z.object({
  dimension: z.string(),
  effect: z.string(),
});
export type TradeoffDimension = z.infer<typeof TradeoffDimensionSchema>;

export const PatternSchema = BaseMetaSchema.extend({
  // Pattern-specific fields
  concept: z.string(), // The core engineering concept
  applicability: z.string(), // When this pattern applies
  anti_patterns: z.array(z.union([z.string(), AntiPatternSchema])).default([]), // Common mistakes to avoid
  implementation_notes: z.string().optional(), // Implementation guidance without library specifics
  examples: z.array(z.string()).default([]), // Language-agnostic examples
  variations: z.array(VariationSchema).default([]), // Named variations of this pattern
  
  // Decision support fields
  decision_summary: z.object({
    when_to_use: z.array(z.string()).default([]),
    dont_use: z.array(z.string()).default([]),
    tradeoff: z.string().optional(),
  }).optional(),
  
  pattern_snapshot: z.object({
    primary_goal: z.string().optional(),
    primary_constraint: z.string().optional(),
    effective_batch: z.string().optional(),
    typical_usage: z.string().optional(),
  }).optional(),
  
  tradeoffs: z.array(TradeoffDimensionSchema).default([]),
  
  decision_flow: z.array(DecisionFlowStepSchema).default([]),
  
  // Override category to enforce PatternCategorySchema
  category: PatternCategorySchema.optional(),
  
  // Cross-references (typed relationships)
  related_workflows: z.array(z.string()).default([]),
  related_models: z.array(z.string()).default([]),
  related_packages: z.array(z.string()).default([]),
  related_principles: z.array(z.string()).default([]),
  related_debug_guides: z.array(z.string()).default([]),
}).omit({ related_content: true });

export type Pattern = z.infer<typeof PatternSchema>;
