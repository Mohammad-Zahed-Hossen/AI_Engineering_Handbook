import Link from 'next/link';
import { getRegistryTasks, getRegistryByTask } from '@/lib/data';

const TASK_LABELS: Record<string, string> = {
  embedding: 'Embedding Models',
  reranker: 'Reranker Models',
  vision: 'Vision Models',
  speech: 'Speech / ASR Models',
  llm: 'Large Language Models',
  multimodal: 'Multimodal Models',
  ocr: 'OCR Models',
};

const TASK_DESCRIPTIONS: Record<string, string> = {
  embedding: 'Sentence and document embedding checkpoints.',
  reranker: 'Cross-encoder reranking models for retrieval pipelines.',
  vision: 'Image classification, detection, and segmentation models.',
  speech: 'Automatic speech recognition and TTS checkpoints.',
  llm: 'Large language model checkpoints and fine-tunes.',
  multimodal: 'Vision-language and cross-modal models.',
  ocr: 'Optical character recognition models.',
};

export default function RegistryPage() {
  const tasks = getRegistryTasks();

  if (tasks.length === 0) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold text-foreground">Registries</h1>
        <p className="text-sm text-muted-foreground">
          No registry entries have been added yet.
        </p>
        <Link href="/" className="text-xs text-foreground hover:underline">
          ← Back to home
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-foreground">Registries</h1>
      <div className="space-y-3">
        {tasks.map(task => {
          const models = getRegistryByTask(task);
          const label = TASK_LABELS[task] ?? task;
          const description = TASK_DESCRIPTIONS[task] ?? '';
          return (
            <Link
              key={task}
              href={`/registry/${task}`}
              className="block rounded-lg border border-border bg-card p-4 hover:border-foreground/20 hover:bg-muted/30 transition-colors"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h2 className="text-sm font-medium text-foreground">{label}</h2>
                  {description && (
                    <p className="mt-1 text-xs text-muted-foreground">{description}</p>
                  )}
                </div>
                <span className="shrink-0 text-[10px] font-mono text-muted-foreground">
                  {models.length} {models.length === 1 ? 'model' : 'models'}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
