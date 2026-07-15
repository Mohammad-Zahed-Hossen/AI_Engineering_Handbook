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

// ── Decision Summary ───────────────────────────────────────────────────────

export const DecisionSummarySchema = z.object({
  default_recommendation: z.string().optional(),
  one_sentence_summary: z.string().optional(),
  choose_when: z.string().optional(),
  avoid_when: z.string().optional(),
  hybrid_recommendation: z.string().optional(),
});
export type DecisionSummary = z.infer<typeof DecisionSummarySchema>;

// ── Engineering Context ────────────────────────────────────────────────────

export const EngineeringContextSchema = z.object({
  assumptions: z.array(z.string()).default([]),
  scope: z.string().optional(),
  out_of_scope: z.array(z.string()).default([]),
});
export type EngineeringContext = z.infer<typeof EngineeringContextSchema>;

// ── Decision Matrix ───────────────────────────────────────────────────────

export const DecisionMatrixEntrySchema = z.object({
  criterion: z.string(),
  importance: z.enum(['low', 'medium', 'high', 'critical']),
  winner: z.string(),
  reason: z.string(),
});
export type DecisionMatrixEntry = z.infer<typeof DecisionMatrixEntrySchema>;

// ── Constraint Based Recommendations ───────────────────────────────────────

export const ConstraintRecommendationSchema = z.object({
  condition: z.string(),
  recommended_option: z.string(),
  reason: z.string(),
});
export type ConstraintRecommendation = z.infer<typeof ConstraintRecommendationSchema>;

// ── Option Deep Dive ──────────────────────────────────────────────────────

export const DecisionOptionSchema = z.object({
  name: z.string(),
  id: z.string(), // Reference to existing content (model, package, etc.)
  strengths: z.array(z.string()),
  weaknesses: z.array(z.string()),
  best_for: z.string(),
  avoid_when: z.string(),
  // Deep dive fields
  infrastructure_required: z.array(z.string()).default([]),
  operational_cost: z.string().optional(),
  maintenance_cost: z.string().optional(),
  scaling_complexity: z.enum(['low', 'medium', 'high']).optional(),
  failure_modes: z.array(z.string()).default([]),
  hidden_costs: z.array(z.string()).default([]),
});

// ── Tradeoff Analysis ─────────────────────────────────────────────────────

export const TradeoffEntrySchema = z.object({
  criterion: z.string(),
  ratings: z.record(z.string(), z.number().min(1).max(5)), // Generic ratings keyed by option name
});
export type TradeoffEntry = z.infer<typeof TradeoffEntrySchema>;

// ── Decision Tree ─────────────────────────────────────────────────────────

export const DecisionTreeEntrySchema = z.object({
  question: z.string(),
  yes_path: z.string().optional(),
  no_path: z.string().optional(),
  outcome: z.string().optional(),
});
export type DecisionTreeEntry = z.infer<typeof DecisionTreeEntrySchema>;

// ── Hybrid Strategy ───────────────────────────────────────────────────────

export const HybridStrategySchema = z.object({
  when_both_wins: z.string().optional(),
  architecture_overview: z.string().optional(),
  benefits: z.array(z.string()).default([]),
  costs: z.array(z.string()).default([]),
  tradeoffs: z.array(z.string()).default([]),
});
export type HybridStrategy = z.infer<typeof HybridStrategySchema>;

// ── Migration Path ───────────────────────────────────────────────────────

export const MigrationStepSchema = z.object({
  step: z.string(),
  description: z.string().optional(),
});
export type MigrationStep = z.infer<typeof MigrationStepSchema>;

// ── Production Examples ───────────────────────────────────────────────────

export const ProductionExampleSchema = z.object({
  system: z.string(),
  why: z.string(),
});
export type ProductionExample = z.infer<typeof ProductionExampleSchema>;

// ── Main Decision Guide Schema ─────────────────────────────────────────────

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

  // ── New Engineering Decision Framework Fields ─────────────────────────────
  
  // Decision Summary
  default_recommendation: z.string().optional(),
  one_sentence_summary: z.string().optional(),
  choose_when: z.string().optional(),
  avoid_when: z.string().optional(),
  hybrid_recommendation: z.string().optional(),

  // Engineering Context
  assumptions: z.array(z.string()).default([]),
  scope: z.string().optional(),
  out_of_scope: z.array(z.string()).default([]),

  // Decision Matrix
  decision_matrix: z.array(DecisionMatrixEntrySchema).optional(),

  // Constraint Based Recommendations
  constraint_recommendations: z.array(ConstraintRecommendationSchema).default([]),

  // Tradeoff Analysis
  tradeoff_analysis: z.array(TradeoffEntrySchema).optional(),

  // Common Engineering Mistakes
  common_mistakes: z.array(z.string()).default([]),

  // Decision Tree
  decision_tree: z.array(DecisionTreeEntrySchema).optional(),

  // Hybrid Strategy
  hybrid_strategy: HybridStrategySchema.optional(),

  // Migration Path
  migration_path: z.array(MigrationStepSchema).default([]),

  // Production Examples
  production_examples: z.array(ProductionExampleSchema).default([]),
}).omit({ related_content: true });

export type DecisionGuide = z.infer<typeof DecisionGuideSchema>;