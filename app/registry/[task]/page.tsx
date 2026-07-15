import { notFound } from 'next/navigation';
import { getRegistryTasks, getRegistryByTask } from '@/lib/data';
import { validateRegistryTask } from '@/lib/route-params';
import ContentPageLayout from '@/components/shared/ContentPageLayout';
import RegistryClientView from '@/components/registry/RegistryClientView';

/**
 * Pre-generates tasks for the model registry paths.
 * Invoked statically during next build.
 */
export async function generateStaticParams() {
  return getRegistryTasks().map((task) => ({ task }));
}

interface PageProps {
  params: Promise<{ task: string }>;
}

const TASK_LABELS: Record<string, string> = {
  embedding: 'Embedding Models',
  reranker: 'Reranker Models',
  vision: 'Vision Models',
  speech: 'Speech/ASR Models',
  llm: 'Large Language Models',
  multimodal: 'Multimodal Models',
  ocr: 'OCR Models',
};

export default async function RegistryTaskPage({ params }: PageProps) {
  const { task } = await params;

  const validTask = validateRegistryTask(task);
  if (!validTask) {
    notFound();
  }

  let models;
  try {
    models = getRegistryByTask(validTask);
  } catch (e) {
    if ((e as NodeJS.ErrnoException).code === 'ENOENT') {
      notFound();
    } else {
      throw e;
    }
  }

  const taskLabel = TASK_LABELS[validTask] || validTask;

  return (
    <ContentPageLayout
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Registry', href: '/registry' },
        { label: taskLabel },
      ]}
    >
      <RegistryClientView models={models} taskLabel={taskLabel} />
    </ContentPageLayout>
  );
}