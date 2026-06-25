import { notFound } from 'next/navigation';
import { getAllModels } from '@/lib/data';
import { ModelCategory } from '@/types/model';
import { ModelListFilter } from '@/components/shared/FilterBar';
import { validateModelCategory } from '@/lib/route-params';

/**
 * Pre-generates categories for ML, DL, and LLM routes.
 * Invoked statically during next build.
 */
export async function generateStaticParams() {
  const categories: ModelCategory[] = ['ml', 'dl', 'llm'];
  return categories.map((category) => ({ category }));
}

interface PageProps {
  params: Promise<{ category: string }>;
}

export default async function ModelCategoryPage({ params }: PageProps) {
  const { category } = await params;
  
  // Validate path parameter category
  const validCategory = validateModelCategory(category);
  if (!validCategory) {
    notFound();
  }

  // Load models within this category from the local database
  const models = getAllModels(validCategory);
  
  const titles: Record<string, string> = {
    ml: 'Machine Learning Models (ML)',
    dl: 'Deep Learning Architectures (DL)',
    llm: 'Large Language Models (LLM)',
  };

  const descriptions: Record<string, string> = {
    ml: 'Tabular, statistics-driven algorithm references including classification, regression, and clustering baselines.',
    dl: 'Neural block building elements, attention layers, and sequence model primitives.',
    llm: 'Generative foundational text checkpoints, model sizing configurations, and system hyperparameter options.',
  };

  return (
    <div className="space-y-6">
      {/* Category Header Card */}
      <div className="bg-card text-card-foreground border border-border p-5 rounded-lg shadow-sm select-none">
        <h1 className="text-xl font-bold tracking-tight text-foreground font-sans">
          {titles[category]}
        </h1>
        <p className="text-xs text-muted-foreground mt-1 max-w-2xl leading-relaxed font-sans">
          {descriptions[category]}
        </p>
      </div>

      {/* Interactive List Container with problem_types client-side filter */}
      <ModelListFilter models={models} category={category} />
    </div>
  );
}
