import { getAllModels, getModelCategories } from '@/lib/data';
import ModelHubExplorer from '@/components/shared/ModelHubExplorer';

export const metadata = {
  title: 'Models Library — AI Engineering Navigation System',
  description: 'Explore and compare machine learning, deep learning, and large language model architecture families.',
};

export default function ModelsPage() {
  const categoriesMeta = {
    ml: getModelCategories('ml'),
    dl: getModelCategories('dl'),
    llm: getModelCategories('llm'),
  };

  const allModels = [
    ...getAllModels('ml'),
    ...getAllModels('dl'),
    ...getAllModels('llm'),
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Models Library</h1>
        <p className="text-xs text-muted-foreground leading-relaxed max-w-2xl">
          A comprehensive catalog of machine learning algorithms, deep learning primitives, and LLM architecture families.
          Compare model trade-offs, inspect implementation snippets, and trace dependencies across the AI stack.
        </p>
      </div>

      <ModelHubExplorer initialModels={allModels} categoriesMeta={categoriesMeta} />
    </div>
  );
}
