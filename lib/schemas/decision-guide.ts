import { z } from 'zod';
import { BaseMetaSchema } from './base';

/**
 * Decision Guide Schema
 * 
 * Decision Guides capture engineering trade-offs and help engineers choose
 * between competing technologies. They are special pages, not a core content type.
 * 
 * Specification: AENS Knowledge Layer Specification v1.0, Section 17
 */

export const DecisionCategorySchema = z.enum([
  'models',
  'frameworks',
  'llm',
  'infrastructure',
  'data_processing',
  'deployment',
]);
export type DecisionCategory = z.infer<typeof DecisionCategorySchema>;

export const DecisionOptionSchema = z.object({
  name: z.string(),
  id: z.string(), // Reference to existing content (model, package, etc.)
  strengths: z.array(z.string()),
  weaknesses: z.array(z.string()),
  best_for: z.string(),
  avoid_when: z.string(),
});

export const DecisionCriteriaSchema = z.object({
  criterion: z.string(),
  weight: z.number().min(0).max(1).default(1), // For weighted decision matrices
  description: z.string().optional(),
});

export const DecisionGuideSchema = BaseMetaSchema.extend({
  // Decision Guide-specific fields
  category: DecisionCategorySchema,
  problem: z.string(), // The engineering decision problem
  evaluation_criteria: z.array(DecisionCriteriaSchema).min(1),
  options: z.array(DecisionOptionSchema).min(2), // At least 2 options to compare
  comparison_table: z.record(z.string(), z.string()).optional(), // Optional structured comparison
  recommendations: z.string(), // When to choose each option
  use_cases: z.array(z.string()).default([]),
  
  // Cross-references (typed relationships)
  related_workflows: z.array(z.string()).default([]),
  related_packages: z.array(z.string()).default([]),
  related_models: z.array(z.string()).default([]),
  related_model_subcategory: z.object({
    category: z.enum(['ml', 'dl', 'llm']),
    subcategory: z.string(),
  }).optional(),
}).omit({ related_content: true });

export type DecisionGuide = z.infer<typeof DecisionGuideSchema>;
