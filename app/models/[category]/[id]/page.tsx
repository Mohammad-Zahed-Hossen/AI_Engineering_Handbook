import { notFound } from 'next/navigation';
import { getModelIds, getModel, getRelatedContent, resolveModelByName } from '@/lib/data';
import { ModelCategory } from '@/types/model';
import ContentPageLayout from '@/components/shared/ContentPageLayout';
import MetadataBadges from '@/components/shared/MetadataBadges';
import OfficialResources from '@/components/shared/OfficialResources';
import RelatedContent from '@/components/shared/RelatedContent';
import ModelCollapsibleSections from '@/components/shared/ModelCollapsibleSections';
import ModelDecisionStrip from '@/components/shared/ModelDecisionStrip';
import { validateModelCategory } from '@/lib/route-params';
import ReadingSessionTracker from '@/components/shared/ReadingSessionTracker';
import { CodeBlock } from '@/components/shared/CodeBlock';
import LearningResources from '@/components/shared/LearningResources';
import { Prose } from '@/components/shared/Prose';
import RecommendedNextSection from '@/components/shared/RecommendedNextSection';
import { Terminal, AlertCircle, Check, AlertTriangle, ArrowUpCircle, ArrowDownCircle, CheckCircle2 } from 'lucide-react';

export async function generateStaticParams() {
  const categories: ModelCategory[] = ['ml', 'dl', 'llm'];
  const params: { category: string; id: string }[] = [];

  for (const category of categories) {
    const ids = getModelIds(category);
    for (const id of ids) {
      params.push({ category, id });
    }
  }

  return params;
}

interface PageProps {
  params: Promise<{ category: string; id: string }>;
}

export default async function ModelDetailPage({ params }: PageProps) {
  const { category, id } = await params;
  const validCategory = validateModelCategory(category);
  if (!validCategory) notFound();

  let model;
  try {
    model = getModel(validCategory, id);
  } catch (e) {
    if ((e as NodeJS.ErrnoException).code === 'ENOENT') notFound();
    throw e;
  }

  const toc = [
    { id: 'summary', label: 'Summary' },
    { id: 'decision-guide', label: 'Decision Guide' },
    { id: 'pros-cons', label: 'Strengths & Limitations' },
    ...(model.quickstart ? [{ id: 'quickstart', label: 'Quick Start' }] : []),
    { id: 'core-understanding', label: 'Core Theory' },
    { id: 'engineering-considerations', label: 'Engineering' },
    { id: 'hyperparameters', label: 'Hyperparameters' },
    { id: 'comparisons', label: 'Tradeoffs' },
    ...(model.learning_resources && model.learning_resources.length > 0 ? [{ id: 'learning-resources', label: 'Learning Resources' }] : []),
  ];
  
  const relatedContent = getRelatedContent('model', model.id, validCategory);

  // Resolve Recommended Next items
  const recommendedNextItems = (model.recommendednext || []).map(name => ({
    name,
    slug: resolveModelByName(name, validCategory)
  }));

  // Resolve cross-links for "Also Worth Knowing" section
  const relatedKnowledgeLinks = {
    relatedmodels: model.relatedknowledge.relatedmodels.map(name => ({
      name,
      slug: resolveModelByName(name, validCategory)
    })),
    alternative_models: model.relatedknowledge.alternative_models.map(name => ({
      name,
      slug: resolveModelByName(name, validCategory)
    })),
  };

  return (
    <ContentPageLayout
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Models', href: `/models/${validCategory}` },
        { label: model.name },
      ]}
      toc={toc}
    >
      <ReadingSessionTracker href={`/models/${validCategory}/${model.id}`} name={model.name} type="model" category={validCategory} />
      
      <header id="summary" className="space-y-3 border-b border-border pb-4 scroll-mt-24">
        <h1>{model.name}</h1>
        <MetadataBadges
          type="model"
          updatedAt={model.updated_at}
          lastVerified={model.lastverified}
          problemTypes={model.problem_types}
        />
        <ModelDecisionStrip
          interpretability={model.decisionsummary.interpretability}
          stability={model.stability}
          confidence={model.confidence}
          engineeringMaturity={model.engineeringmaturity}
          difficulty={model.difficulty}
        />
        <div className="rounded-lg bg-muted/30 p-3.5 border border-border/80">
          <span className="text-[10px] font-bold uppercase text-muted-foreground block mb-1">Architecture Overview</span>
          <Prose content={model.description} className="text-xs text-foreground leading-relaxed font-sans" />
        </div>
        <Prose content={model.decisionsummary.summary} className="content-prose text-base md:text-lg font-medium text-foreground leading-relaxed" />
      </header>

      <section id="decision-guide" className="scroll-mt-24 space-y-6">
        <div className="border border-border rounded-xl bg-card overflow-hidden shadow-sm">
          {/* Section Header */}
          <div className="px-4 py-3 border-b border-border bg-muted/30">
            <h2 className="text-sm font-semibold text-foreground flex items-center gap-2 font-sans m-0">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              Decision Board & Tradeoffs
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border">
            {/* Left side: Fit & Deployment */}
            <div className="divide-y divide-border">
              {/* Best Use Cases */}
              <div className="p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
                    <Check className="w-3 h-3 font-bold" />
                  </span>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 font-sans m-0">
                    Use When (Best Fit)
                  </h3>
                </div>
                <ul className="space-y-2 pl-0.5">
                  {model.decisionsummary.bestusecases.map((use, idx) => (
                    <li key={idx} className="text-xs text-muted-foreground leading-relaxed flex items-start gap-2">
                      <span className="text-emerald-500 font-bold shrink-0 mt-0.5">•</span>
                      <span>{use}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Avoid When */}
              <div className="p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 shrink-0">
                    <AlertTriangle className="w-3 h-3 font-bold" />
                  </span>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 font-sans m-0">
                    Avoid When
                  </h3>
                </div>
                <ul className="space-y-2 pl-0.5">
                  {model.decisionsummary.avoidwhen.map((avoid, idx) => (
                    <li key={idx} className="text-xs text-muted-foreground leading-relaxed flex items-start gap-2">
                      <span className="text-amber-500 font-bold shrink-0 mt-0.5">•</span>
                      <span>{avoid}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right side: Strengths & Limitations */}
            <div className="divide-y divide-border scroll-mt-24" id="pros-cons">
              {/* Strengths */}
              <div className="p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400 shrink-0">
                    <ArrowUpCircle className="w-3.5 h-3.5 font-bold" />
                  </span>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400 font-sans m-0">
                    Strengths (Pros)
                  </h3>
                </div>
                <ul className="space-y-2 pl-0.5">
                  {model.decisionsummary.strengths.map((pro, idx) => (
                    <li key={idx} className="text-xs text-muted-foreground leading-relaxed flex items-start gap-2">
                      <span className="text-teal-500 font-bold shrink-0 mt-0.5">•</span>
                      <span>{pro}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Limitations */}
              <div className="p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 shrink-0">
                    <ArrowDownCircle className="w-3.5 h-3.5 font-bold" />
                  </span>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-rose-700 dark:text-rose-400 font-sans m-0">
                    Limitations (Cons)
                  </h3>
                </div>
                <ul className="space-y-2 pl-0.5">
                  {model.decisionsummary.limitations.map((con, idx) => (
                    <li key={idx} className="text-xs text-muted-foreground leading-relaxed flex items-start gap-2">
                      <span className="text-rose-500 font-bold shrink-0 mt-0.5">•</span>
                      <span>{con}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {model.quickstart && (
        <section id="quickstart" className="space-y-3.5 scroll-mt-24 border border-border rounded-xl bg-card/30 p-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
            <h2 className="text-sm font-bold text-foreground font-sans m-0 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-primary" />
              Quick Start
            </h2>
            <div className="flex items-center gap-2">
              <span className="bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded text-[10px] font-mono font-semibold uppercase">
                {model.quickstart.language}
              </span>
              <span className="bg-orange-500/10 text-orange-700 dark:text-orange-400 border border-orange-500/20 px-2 py-0.5 rounded text-[10px] font-mono font-semibold uppercase">
                {model.quickstart.implementation_package}
              </span>
            </div>
          </div>
          
          <Prose content={model.quickstart.explanation} className="text-xs text-muted-foreground font-sans leading-relaxed" />

          <CodeBlock code={model.quickstart.code} language={model.quickstart.language} />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-sans">
            <div className="rounded-lg bg-muted/20 border border-border/80 p-3">
              <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">Expected Inputs</span>
              <Prose content={model.quickstart.inputs} className="text-xs text-foreground leading-relaxed m-0" />
            </div>
            <div className="rounded-lg bg-muted/20 border border-border/80 p-3">
              <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">Expected Outputs</span>
              <Prose content={model.quickstart.outputs} className="text-xs text-foreground leading-relaxed m-0" />
            </div>
          </div>

          {model.quickstart.notes && (
            <div className="p-3 bg-amber-500/5 border border-amber-500/10 dark:bg-amber-950/15 dark:border-amber-500/15 rounded-lg flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-1 font-sans">
                <span className="text-[9px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 block">Implementation Notes</span>
                <Prose content={model.quickstart.notes} className="text-xs text-muted-foreground leading-relaxed m-0" />
              </div>
            </div>
          )}
        </section>
      )}

      <ModelCollapsibleSections model={model} relatedKnowledgeLinks={relatedKnowledgeLinks} category={validCategory} />

      <RecommendedNextSection items={recommendedNextItems} category={validCategory} />

      <RelatedContent items={relatedContent} />

      {model.learning_resources && model.learning_resources.length > 0 && (
        <LearningResources resources={model.learning_resources} />
      )}

      <OfficialResources
        sources={model.sources}
        githubRepo={model.githubrepo}
        hasLearningResources={!!(model.learning_resources && model.learning_resources.length > 0)}
      />
    </ContentPageLayout>
  );
}
