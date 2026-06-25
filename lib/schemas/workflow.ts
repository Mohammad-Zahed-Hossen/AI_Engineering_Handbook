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
});
