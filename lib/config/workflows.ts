/**
 * Single source of truth for workflow categories.
 * Enforced at the validation layer.
 */
export const WORKFLOW_CATEGORIES = [
  'classical-ml',
  'deep-learning',
  'computer-vision',
  'nlp',
  'llm-engineering',
  'rag',
  'agentic-systems',
  'fine-tuning',
  'evaluation',
  'mlops',
  'data-engineering',
  'production-systems',
] as const;

export type WorkflowCategory = typeof WORKFLOW_CATEGORIES[number];
