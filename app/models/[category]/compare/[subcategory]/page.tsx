import { notFound } from 'next/navigation';
import { getCategoryComparison, getAllModels } from '@/lib/data';
import { ModelCategory } from '@/types/model';
import { validateModelCategory, validateModelSubcategory } from '@/lib/route-params';
import ContentPageLayout from '@/components/shared/ContentPageLayout';
import ModelCategoryComparison from '@/components/shared/ModelCategoryComparison';

export async function generateStaticParams() {
  const categories: ModelCategory[] = ['ml', 'dl', 'llm'];
  const params: { category: string; subcategory: string }[] = [];

  for (const category of categories) {
    const models = getAllModels(category);
    const subcategories = Array.from(new Set(models.map((m) => m.subcategory)));
    for (const subcategory of subcategories) {
      params.push({ category, subcategory });
    }
  }

  return params;
}

interface PageProps {
  params: Promise<{ category: string; subcategory: string }>;
}

export default async function CategoryComparePage({ params }: PageProps) {
  const { category, subcategory } = await params;

  const validCategory = validateModelCategory(category);
  const validSubcategory = validateModelSubcategory(subcategory);

  if (!validCategory || !validSubcategory) {
    notFound();
  }

  const { meta, models } = getCategoryComparison(validCategory, validSubcategory);

  if (!meta || !models || models.length === 0) {
    notFound();
  }

  const domainLabels: Record<ModelCategory, string> = {
    ml: 'Machine Learning',
    dl: 'Deep Learning',
    llm: 'Large Language Models',
  };

  // Table of contents for the comparison page
  const tocItems = [
    { id: 'comparison-matrix', label: 'Comparison Matrix' },
    { id: 'when-to-choose', label: 'When to Choose' },
    { id: 'computational-profile', label: 'Computational Profile' },
    { id: 'data-requirements', label: 'Data Requirements' },
    { id: 'model-comparisons', label: 'Model Comparisons' },
    { id: 'related-models', label: 'Related Models' },
  ];

  return (
    <ContentPageLayout
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Models', href: '/models' },
        { label: domainLabels[validCategory], href: `/models/${validCategory}` },
        { label: `${meta.label} Comparison` },
      ]}
      toc={tocItems}
    >
      <ModelCategoryComparison
        category={validCategory}
        meta={meta}
        models={models}
      />
    </ContentPageLayout>
  );
}