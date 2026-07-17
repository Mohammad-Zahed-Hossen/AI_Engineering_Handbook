export type NavigatorProblemType = 'classification' | 'generation' | 'retrieval' | 'prediction' | 'ranking' | 'clustering' | 'planning' | 'reasoning' | 'forecasting';
export type InputModality = 'text' | 'image' | 'audio' | 'video' | 'tabular' | 'multimodal';
export type EngineeringComplexity = 'beginner' | 'intermediate' | 'advanced' | 'expert';
export type EngineeringCharacteristic = 'real_time' | 'batch' | 'streaming' | 'offline' | 'gpu_required' | 'large_dataset' | 'low_latency' | 'high_throughput' | 'resource_constrained';

export interface Problem {
  id: string;
  name: string;
  description: string;
  related_workflows: string[];
  related_decision_guides?: string[];
  
  // NEW: Discovery & Navigation fields
  problem_type: NavigatorProblemType[];
  input_modalities: InputModality[];
  engineering_complexity: EngineeringComplexity;
  engineering_characteristics?: EngineeringCharacteristic[];
  related_problems?: string[]; // IDs of related problems
  related_models?: string[]; // Model references
  related_patterns?: string[]; // Pattern references
  related_debug_guides?: string[]; // Debug guide references
  related_packages?: string[]; // Package references
  related_registry?: string[]; // Registry references
  aliases?: string[];
  keywords?: string[];
  search_tokens?: string[];
  tags?: string[];
  requires?: string[]; // Prerequisite knowledge IDs
}

export interface ProblemCategory {
  description: string;
  problems: Problem[];
}

export interface Taxonomy {
  [category: string]: ProblemCategory;
}
