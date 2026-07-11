import { z } from 'zod';
import { BaseMetaSchema, ContentRefSchema } from './base';

export const WorkflowTypeSchema = z.enum(['pipeline', 'snippet']);
export type WorkflowType = z.infer<typeof WorkflowTypeSchema>;

export const WorkflowStepSchema = z.object({
  step: z.number(),
  name: z.string(),
  what: z.string(),
  tools: z.array(z.string()),
  decision: z.string(),
  uses: z.object({
    packages: z.array(z.string()),
    models: z.array(z.string()),
    cheatsheets: z.array(z.string()),
    patterns: z.array(z.string()).default([]),
    debug_guides: z.array(z.string()).default([]),
  }),
  failure_points: z.array(z.string()),
});

export const WorkedExampleSchema = z.object({
  name: z.string(),
  description: z.string(),
  code: z.string().optional(),
  language: z.string().optional(),
  implementation_notes: z.string().optional(),
  related_step: z.number().optional(),
});

export const WorkflowSchema = BaseMetaSchema.extend({
  // Workflow-specific fields
  type: WorkflowTypeSchema,
  category: z.string(),
  overview: z.string(),
  starter_stack: z.array(z.string()),
  steps: z.array(WorkflowStepSchema),
  common_failure_points: z.array(z.string()),
  evaluation_checks: z.array(z.string()).optional(),
  next_links: z.array(z.string()).optional(),
  
  // Worked examples (embedded within workflows per spec)
  worked_examples: z.array(WorkedExampleSchema).default([]),
  
  // Production notes
  production_notes: z.string().optional(),
  scaling_notes: z.string().optional(),
  
  // Cost and Latency (structured metadata)
  cost_notes: z.string().optional(), // Infrastructure costs, resource requirements
  latency_notes: z.string().optional(), // End-to-end latency, throughput characteristics
  
  // Observability (structured metadata)
  observability_notes: z.string().optional(), // Metrics, logging, tracing conventions for this workflow
  
  // Cross-references (typed relationships)
  related_patterns: z.array(ContentRefSchema).default([]),
  related_models: z.array(ContentRefSchema).default([]),
  related_packages: z.array(ContentRefSchema).default([]),
  related_debug_guides: z.array(ContentRefSchema).default([]),
});
