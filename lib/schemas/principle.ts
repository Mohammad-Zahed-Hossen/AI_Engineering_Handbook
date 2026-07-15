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

// ── Engineering Consequence ────────────────────────────────────────────────
export const EngineeringConsequenceSchema = z.object({
  title: z.string(),
  explanation: z.string(),
});
export type EngineeringConsequence = z.infer<typeof EngineeringConsequenceSchema>;

// ── Common Violation ───────────────────────────────────────────────────────
export const CommonViolationSchema = z.object({
  violation: z.string(),
  symptoms: z.string(),
  why_it_happens: z.string(),
});
export type CommonViolation = z.infer<typeof CommonViolationSchema>;

// ── Appears In ─────────────────────────────────────────────────────────────
export const AppearsInSchema = z.object({
  domain: z.string(),
  examples: z.array(z.string()),
});
export type AppearsIn = z.infer<typeof AppearsInSchema>;

// ── Misconception ───────────────────────────────────────────────────────────
export const MisconceptionSchema = z.object({
  myth: z.string(),
  reality: z.string(),
});
export type Misconception = z.infer<typeof MisconceptionSchema>;

// ── Tradeoffs ───────────────────────────────────────────────────────────────
export const TradeoffSchema = z.object({
  benefits: z.array(z.string()).default([]),
  costs: z.array(z.string()).default([]),
});
export type Tradeoff = z.infer<typeof TradeoffSchema>;

export const PrincipleSchema = BaseMetaSchema.extend({
  // Principle-specific fields
  category: PrincipleCategorySchema,
  statement: z.string(), // The fundamental principle statement
  mathematical_formulation: z.string().optional(), // Mathematical representation if applicable
  intuition: z.string(), // Intuitive explanation
  
  // Legacy field (kept for backward compatibility)
  implications: z.array(z.string()).default([]), // Engineering implications (legacy)
  
  // New structured fields
  engineering_consequences: z.array(EngineeringConsequenceSchema).default([]), // Structured engineering consequences
  common_violations: z.array(CommonViolationSchema).default([]), // Common ways engineers violate this principle
  appears_in: z.array(AppearsInSchema).default([]), // Where this principle appears in systems
  mental_model: z.string().optional(), // Visual understanding (markdown, ASCII, Mermaid)
  decision_checklist: z.array(z.string()).default([]), // Yes/no questions for applying the principle
  misconceptions: z.array(MisconceptionSchema).default([]), // Common misunderstandings
  engineering_heuristic: z.string().optional(), // One memorable takeaway
  historical_origin: z.string().optional(), // Where the principle originated
  tradeoffs: TradeoffSchema.optional(), // What is gained vs sacrificed
  
  limitations: z.array(z.string()).default([]), // When this principle doesn't apply
  related_concepts: z.array(z.string()).default([]), // Related principles or concepts
  
  // Cross-references (typed relationships)
  referenced_by_patterns: z.array(z.string()).default([]),
  referenced_by_models: z.array(z.string()).default([]),
  referenced_by_workflows: z.array(z.string()).default([]),
}).omit({ related_content: true });

export type Principle = z.infer<typeof PrincipleSchema>;