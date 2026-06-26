import { z } from 'zod';
import { WorkflowSchema, WorkflowStepSchema, WorkflowTypeSchema } from '@/lib/schemas/workflow';

export type WorkflowType = z.infer<typeof WorkflowTypeSchema>;
export type WorkflowStep = z.infer<typeof WorkflowStepSchema>;
export type Workflow = z.infer<typeof WorkflowSchema>;
