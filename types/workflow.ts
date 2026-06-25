import { BaseMeta } from "./meta";
import { WorkflowType } from "@/lib/schemas/workflow";

export type { WorkflowType };

export interface WorkflowStep {
  step: number;
  name: string;
  what: string;
  tools: string[];
  decision: string;
}

export interface Workflow extends BaseMeta {
  id: string;
  name: string;
  type: WorkflowType;        // 'pipeline' = multi-step | 'snippet' = quick recipe
  category: string;
  overview: string;
  starter_stack: string[];
  steps: WorkflowStep[];
  common_failure_points: string[];
}