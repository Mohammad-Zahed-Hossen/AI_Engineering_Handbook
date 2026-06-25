import { BaseMeta, ContentRef } from "./meta";
import { RegistryTask, ModelStatus } from "@/lib/schemas/registry";

export type { RegistryTask, ModelStatus };

export interface RegistryModel extends BaseMeta {
  id: string;
  model_id: string;
  task: RegistryTask;
  language: string;
  dimension?: number;
  use_case: string;
  size_mb: number;
  status: ModelStatus;
  notes: string;
  quick_start: string;
  alternatives: ContentRef[];
  last_verified: string;
}
