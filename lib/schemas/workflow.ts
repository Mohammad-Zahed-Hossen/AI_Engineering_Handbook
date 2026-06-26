import { z } from 'zod';
import { BaseMetaSchema } from './meta';

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
  }),
  failure_points: z.array(z.string()),
});

export const WorkflowSchema = BaseMetaSchema.extend({
  id: z.string(),
  name: z.string(),
  type: WorkflowTypeSchema,
  category: z.string(),
  overview: z.string(),
  starter_stack: z.array(z.string()),
  steps: z.array(WorkflowStepSchema),
  common_failure_points: z.array(z.string()),
  evaluation_checks: z.array(z.string()).optional(),
  next_links: z.array(z.string()).optional(),
});
