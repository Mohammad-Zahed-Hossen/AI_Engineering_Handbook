import { z } from 'zod';
import { BaseMetaSchema, ContentRefSchema } from './base';

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

export const DebugSymptomSchema = z.object({
  symptom: z.string(),
  description: z.string().optional(),
});

export const DebugRootCauseSchema = z.object({
  cause: z.string(),
  probability: z.enum(['high', 'medium', 'low']).default('medium'),
  explanation: z.string().optional(),
});

export const DebugDiagnosisSchema = z.object({
  test: z.string(),
  expected_result: z.string(),
  how_to_perform: z.string(),
});

export const DebugSolutionSchema = z.object({
  solution: z.string(),
  steps: z.array(z.string()),
  verification: z.string().optional(),
});

export const DebugPreventionSchema = z.object({
  prevention: z.string(),
  practices: z.array(z.string()),
});

export const DebugGuideSchema = BaseMetaSchema.extend({
  // Debug Guide-specific fields
  category: DebugCategorySchema,
  symptoms: z.array(DebugSymptomSchema).min(1),
  root_causes: z.array(DebugRootCauseSchema).min(1),
  diagnosis: z.array(DebugDiagnosisSchema).min(1),
  solutions: z.array(DebugSolutionSchema).min(1),
  prevention: z.array(DebugPreventionSchema).min(1),
  
  // Cross-references (typed relationships)
  related_packages: z.array(ContentRefSchema).default([]),
  related_workflows: z.array(ContentRefSchema).default([]),
  related_patterns: z.array(ContentRefSchema).default([]),
  related_models: z.array(ContentRefSchema).default([]),
  related_registry: z.array(ContentRefSchema).default([]),
});

export type DebugGuide = z.infer<typeof DebugGuideSchema>;
