/**
 * Single source of truth for registry task ↔ filename mapping.
 * To add a new registry task: add ONE entry here. Nowhere else.
 */
export const REGISTRY_TASK_FILES = {
  embedding:  'embeddings.json',
  reranker:   'rerankers.json',
  vision:     'vision.json',
  speech:     'speech.json',
  llm:        'llms.json',
  multimodal: 'multimodal.json',
  ocr:        'ocr.json',
} as const;

export type RegistryTask = keyof typeof REGISTRY_TASK_FILES;

/** Derived reverse map — filename → task name. Never edit this manually. */
export const REGISTRY_FILE_TO_TASK = Object.fromEntries(
  Object.entries(REGISTRY_TASK_FILES).map(([task, file]) => [file, task])
) as Record<string, RegistryTask>;
