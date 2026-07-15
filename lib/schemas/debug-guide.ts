import { z } from 'zod';
import { BaseMetaSchema } from './base';

/**
 * Debug Guide Schema
 * 
 * Debug Guides capture troubleshooting knowledge in a structured, searchable format.
 * They are symptom-first, not technology-first.
 * 
 * Specification: AENS Knowledge Layer Specification v1.0, Section 15
 */

export const DebugCategorySchema = z.enum([
  'training',
  'gpu',
  'data',
  'llm',
  'python',
  'deployment',
  'performance',
  'memory',
]);
export type DebugCategory = z.infer<typeof DebugCategorySchema>;

// ── Overview Card ───────────────────────────────────────────────────────────

export const DebugOverviewSchema = z.object({
  severity: z.enum(['critical', 'high', 'medium', 'low']).optional(),
  frequency: z.enum(['common', 'occasional', 'rare']).optional(),
  typical_stage: z.enum(['development', 'testing', 'production', 'any']).optional(),
  estimated_fix_time: z.string().optional(),
  production_impact: z.enum(['severe', 'moderate', 'minimal', 'none']).optional(),
});
export type DebugOverview = z.infer<typeof DebugOverviewSchema>;

// ── Quick Identification ───────────────────────────────────────────────────

export const QuickIdentificationItemSchema = z.object({
  check: z.string(),
  description: z.string().optional(),
});
export type QuickIdentificationItem = z.infer<typeof QuickIdentificationItemSchema>;

// ── Symptoms ────────────────────────────────────────────────────────────────

export const DebugSymptomSchema = z.object({
  symptom: z.string(),
  description: z.string().optional(),
  error_message: z.string().optional(),
  where_appears: z.string().optional(),
  frequency: z.enum(['always', 'often', 'sometimes', 'rarely']).optional(),
});
export type DebugSymptom = z.infer<typeof DebugSymptomSchema>;

// ── Root Causes ────────────────────────────────────────────────────────────

export const DebugRootCauseSchema = z.object({
  cause: z.string(),
  probability: z.enum(['high', 'medium', 'low']).default('medium'),
  explanation: z.string().optional(),
  recognition_clues: z.array(z.string()).default([]),
  typical_environment: z.string().optional(),
});
export type DebugRootCause = z.infer<typeof DebugRootCauseSchema>;

// ── Investigation Checklist ───────────────────────────────────────────────

export const InvestigationChecklistItemSchema = z.object({
  check: z.string(),
  description: z.string().optional(),
});
export type InvestigationChecklistItem = z.infer<typeof InvestigationChecklistItemSchema>;

// ── Diagnostic Commands ───────────────────────────────────────────────────

export const DiagnosticCommandSchema = z.object({
  purpose: z.string(),
  command: z.string(),
  expected_output: z.string().optional(),
  interpretation: z.string().optional(),
});
export type DiagnosticCommand = z.infer<typeof DiagnosticCommandSchema>;

// ── Diagnostic Tests ──────────────────────────────────────────────────────

export const DiagnosticTestSchema = z.object({
  purpose: z.string(),
  test: z.string(),
  command: z.string().optional(),
  expected_result: z.string().optional(),
  interpretation: z.string().optional(),
  next_action: z.string().optional(),
});
export type DiagnosticTest = z.infer<typeof DiagnosticTestSchema>;

// ── Decision Tree (Recursive) ─────────────────────────────────────────────

// Use z.lazy for recursive types - define the type first, then the schema
// Terminal nodes have only 'result', intermediate nodes have 'question'
// solution_index links terminal nodes to corresponding solutions
export type DebugDecisionTree = {
  question?: string;
  yes?: DebugDecisionTree;
  no?: DebugDecisionTree;
  result?: string;
  solution_index?: number;
};

const createDebugDecisionTreeSchema = (): z.ZodType<DebugDecisionTree> =>
  z.lazy(() =>
    z.object({
      question: z.string().optional(),
      yes: createDebugDecisionTreeSchema().optional(),
      no: createDebugDecisionTreeSchema().optional(),
      result: z.string().optional(),
      solution_index: z.number().optional(),
    })
  );

export const DebugDecisionTreeSchema = createDebugDecisionTreeSchema();

// ── Solutions ───────────────────────────────────────────────────────────────

export const DebugSolutionSchema = z.object({
  solution: z.string(),
  steps: z.array(z.string()),
  quick_fix: z.string().optional(),
  permanent_fix: z.string().optional(),
  tradeoffs: z.array(z.string()).default([]),
  performance_impact: z.string().optional(),
  difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
  works_for: z.array(z.string()).default([]),
  verification: z.string().optional(),
});
export type DebugSolution = z.infer<typeof DebugSolutionSchema>;

// ── Verification Checklist ────────────────────────────────────────────────

export const VerificationChecklistItemSchema = z.object({
  check: z.string(),
  description: z.string().optional(),
});
export type VerificationChecklistItem = z.infer<typeof VerificationChecklistItemSchema>;

// ── Prevention ─────────────────────────────────────────────────────────────

export const PreventionCategorySchema = z.object({
  category: z.enum(['development', 'production', 'monitoring', 'coding_habits']),
  practices: z.array(z.string()),
});
export type PreventionCategory = z.infer<typeof PreventionCategorySchema>;

// ── Common Misconceptions ───────────────────────────────────────────────────

export const DebugMisconceptionSchema = z.object({
  misconception: z.string(),
  reality: z.string(),
});
export type DebugMisconception = z.infer<typeof DebugMisconceptionSchema>;

// ── False Positive Cases ──────────────────────────────────────────────────

export const FalsePositiveCaseSchema = z.object({
  case: z.string(),
  why_it_looks_similar: z.string().optional(),
  how_to_distinguish: z.string().optional(),
});
export type FalsePositiveCase = z.infer<typeof FalsePositiveCaseSchema>;

// ── Escalation Paths ───────────────────────────────────────────────────────

export const EscalationPathSchema = z.object({
  path: z.string(),
  when_to_use: z.string().optional(),
  tradeoffs: z.array(z.string()).default([]),
});
export type EscalationPath = z.infer<typeof EscalationPathSchema>;

// ── Main Debug Guide Schema ───────────────────────────────────────────────

export const DebugGuideSchema = BaseMetaSchema.extend({
  // Debug Guide-specific fields
  category: DebugCategorySchema,
  
  // Overview Card
  overview: DebugOverviewSchema.optional(),
  
  // Quick Identification
  quick_identification: z.array(QuickIdentificationItemSchema).default([]),
  
  // Symptoms
  symptoms: z.array(DebugSymptomSchema).min(1),
  
  // Root Causes
  root_causes: z.array(DebugRootCauseSchema).min(1),
  
  // Investigation Checklist
  investigation_checklist: z.array(InvestigationChecklistItemSchema).default([]),
  
  // Diagnostic Commands
  diagnostic_commands: z.array(DiagnosticCommandSchema).default([]),
  
  // Diagnostic Tests
  diagnostic_tests: z.array(DiagnosticTestSchema).default([]),
  
  // Decision Tree
  decision_tree: DebugDecisionTreeSchema.optional(),
  
  // Solutions
  solutions: z.array(DebugSolutionSchema).min(1),
  
  // Verification Checklist
  verification_checklist: z.array(VerificationChecklistItemSchema).default([]),
  
  // Prevention
  prevention: z.array(PreventionCategorySchema).min(1),
  
  // Common Misconceptions
  common_misconceptions: z.array(DebugMisconceptionSchema).default([]),
  
  // False Positive Cases
  false_positive_cases: z.array(FalsePositiveCaseSchema).default([]),
  
  // Escalation Paths
  escalation_paths: z.array(EscalationPathSchema).default([]),
  
  // Cross-references (typed relationships)
  related_packages: z.array(z.string()).default([]),
  related_workflows: z.array(z.string()).default([]),
  related_patterns: z.array(z.string()).default([]),
  related_models: z.array(z.string()).default([]),
  related_registry: z.array(z.string()).default([]),
}).omit({ related_content: true });

export type DebugGuide = z.infer<typeof DebugGuideSchema>;