import { z } from 'zod';
import { BaseMetaSchema } from './base';

/**
 * Principle Schema
 * 
 * Principles are the most stable knowledge type in AENS. They capture fundamental
 * truths that survive decades of technological change. Patterns tell "how", Principles tell "why".
 * 
 * DECISION RULE: Principle vs Pattern
 * If the concept is provable/derivable independent of any implementation, it's a Principle.
 * If the concept requires code or a library to demonstrate, it's a Pattern.
 * 
 * Examples: Gradient descent is a Principle (mathematically derivable).
 * Early stopping is a Pattern (requires implementation details).
 * 
 * Specification: AENS Knowledge Layer Specification v1.0, Section 8
 */

export const PrincipleCategorySchema = z.enum([
  'learning_theory',
  'optimization',
  'representation',
  'systems',
  'information_theory',
  'statistics',
  'probability',
]);
export type PrincipleCategory = z.infer<typeof PrincipleCategorySchema>;

export const PrincipleSchema = BaseMetaSchema.extend({
  // Principle-specific fields
  category: PrincipleCategorySchema,
  statement: z.string(), // The fundamental principle statement
  mathematical_formulation: z.string().optional(), // Mathematical representation if applicable
  intuition: z.string(), // Intuitive explanation
  implications: z.array(z.string()).default([]), // Engineering implications
  limitations: z.array(z.string()).default([]), // When this principle doesn't apply
  related_concepts: z.array(z.string()).default([]), // Related principles or concepts
  
  // Cross-references (typed relationships)
  referenced_by_patterns: z.array(z.string()).default([]),
  referenced_by_models: z.array(z.string()).default([]),
  referenced_by_workflows: z.array(z.string()).default([]),
});

export type Principle = z.infer<typeof PrincipleSchema>;
