import { BaseMeta, ContentRef } from "./meta";
import { ModelCategory, ProblemType, SpeedRating, SizeRating, InterpretabilityRating } from "@/lib/schemas/model";

export type { ModelCategory, ProblemType, SpeedRating, SizeRating, InterpretabilityRating };

export interface HyperParameter {
  name: string;
  default: string | number | null;
  note: string;
}

export interface Model extends BaseMeta {
  id: string;
  name: string;
  category: ModelCategory;
  problem_types: ProblemType[];          // ADDED — required for filtering
  summary: string;
  use_when: string;
  avoid_when: string;
  pros: string[];
  cons: string[];
  key_hyperparams: HyperParameter[];
  training_speed: SpeedRating;           // enum, not free string
  inference_speed: SpeedRating;
  memory_usage: SizeRating;
  interpretability: InterpretabilityRating;
  quick_start: string;
  alternatives: ContentRef[];
}