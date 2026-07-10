'use client';

import { useState } from 'react';
import { 
  ChevronDown, 
  ChevronRight, 
  BookOpen, 
  Settings, 
  Users, 
  Link as LinkIcon, 
  AlertCircle,
  Clock,
  Database,
  Activity,
  TrendingUp,
  ShieldAlert,
  Scale,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';
import { Model } from '@/types/model';
import { ModelCategory } from '@/types/model';
import { cn } from '@/lib/utils';
import { Prose, ProseInline } from './Prose';

interface ModelCollapsibleSectionsProps {
  model: Model;
  relatedKnowledgeLinks?: {
    relatedmodels: Array<{ name: string; slug: string | null }>;
    alternative_models: Array<{ name: string; slug: string | null }>;
  };
  category?: ModelCategory;
}

interface CollapsibleSectionProps {
  id: string;
  label: string;
  icon: React.ReactNode;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  teaser?: string;
}

function CollapsibleSection({
  id,
  label,
  icon,
  open,
  onToggle,
  children,
  teaser,
}: CollapsibleSectionProps) {
  const contentId = `${id}-content`;
  
  return (
    <section id={id} className="scroll-mt-24 border border-border rounded-lg bg-card overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 bg-muted/20 hover:bg-muted/40 transition-colors select-none text-left"
        aria-expanded={open}
        aria-controls={contentId}
      >
        <div className="flex items-center gap-2.5">
          <span className="text-primary">{icon}</span>
          <div className="flex flex-col">
            <h2 className="text-sm font-bold text-foreground font-sans m-0">{label}</h2>
            {teaser && (
              <span className="text-[10px] text-muted-foreground">
                <ProseInline content={teaser} />
              </span>
            )}
          </div>
        </div>
        <div>
          {open ? (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          )}
        </div>
      </button>
      <div id={contentId} className={cn('p-5 border-t border-border bg-card', open ? 'block' : 'hidden')}>
        {children}
      </div>
    </section>
  );
}

function getPriorityChipColor(priority: string) {
  const p = priority.toLowerCase();
  if (p === 'high') return 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20';
  if (p === 'medium') return 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20';
  return 'bg-muted text-muted-foreground border-border';
}

function HyperparameterPriorityBar({ hyperparameters }: { hyperparameters: Model['hyperparameters'] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {hyperparameters.map((hp) => (
        <span
          key={hp.name}
          className={`px-2 py-0.5 rounded border text-[10px] font-mono uppercase ${getPriorityChipColor(hp.tuningpriority)}`}
        >
          {hp.name}
        </span>
      ))}
    </div>
  );
}

const libraryParamsMap: Record<string, string> = {
  "number of trees": "n_estimators",
  "max depth": "max_depth",
  "max features": "max_features",
  "min samples leaf": "min_samples_leaf",
  "min samples split": "min_samples_split",
  "bootstrap": "bootstrap",
};

export default function ModelCollapsibleSections({ model, relatedKnowledgeLinks, category }: ModelCollapsibleSectionsProps) {
  const [coreOpen, setCoreOpen] = useState(false);
  const [engOpen, setEngOpen] = useState(false);
  const [hyperOpen, setHyperOpen] = useState(false);
  const [compareOpen, setCompareOpen] = useState(false);
  const [knowledgeOpen, setKnowledgeOpen] = useState(false);
  const [openHp, setOpenHp] = useState<Record<string, boolean>>({});

  // Compute teasers
  const specs = [
    { label: 'Time Complexity', value: model.coreunderstanding.complexity, icon: <Clock className="w-3.5 h-3.5 text-blue-500" /> },
    { label: 'Memory Complexity', value: model.coreunderstanding.memorycomplexity, icon: <Database className="w-3.5 h-3.5 text-purple-500" /> },
    { label: 'Robustness Profile', value: model.coreunderstanding.robustness, icon: <Activity className="w-3.5 h-3.5 text-emerald-500" /> },
    { label: 'Scalability Profile', value: model.coreunderstanding.scalability, icon: <TrendingUp className="w-3.5 h-3.5 text-cyan-500" /> },
    { label: 'Overfitting Tendency', value: model.coreunderstanding.overfittingtendency, icon: <ShieldAlert className="w-3.5 h-3.5 text-amber-500" /> },
    { label: 'Bias-Variance Profile', value: model.coreunderstanding.biasvariance, icon: <Scale className="w-3.5 h-3.5 text-indigo-500" /> },
  ];
  const coreTeaser = `${specs.length} specification${specs.length === 1 ? '' : 's'} · ${model.coreunderstanding.assumptions.length} assumption${model.coreunderstanding.assumptions.length === 1 ? '' : 's'} noted`;
  const engTeaser = `${model.engineeringconsiderations.commonlimitations.length} limitation${model.engineeringconsiderations.commonlimitations.length === 1 ? '' : 's'} noted`;
  const highPriorityCount = model.hyperparameters.filter(hp => hp.tuningpriority.toLowerCase() === 'high').length;
  const hyperTeaser = `${model.hyperparameters.length} parameter${model.hyperparameters.length === 1 ? '' : 's'} · ${highPriorityCount} high priority`;
  const compareTeaser = `${model.comparisons.length} alternative${model.comparisons.length === 1 ? '' : 's'} compared`;

  // Sort hyperparameters by priority
  const priorityRank = (p: string) => ({ high: 0, medium: 1, low: 2 }[p.toLowerCase().replace('.', '')] ?? 3);
  const sortedHyperparameters = [...model.hyperparameters].sort((a, b) => priorityRank(a.tuningpriority) - priorityRank(b.tuningpriority));

  const toggleAllHp = (expand: boolean) => {
    const nextState: Record<string, boolean> = {};
    sortedHyperparameters.forEach(hp => {
      nextState[hp.name] = expand;
    });
    setOpenHp(nextState);
  };

  const relatedKnowledgeSections = [
    ['Related Models', model.relatedknowledge.relatedmodels],
    ['Alternative Models', model.relatedknowledge.alternative_models],
    ['Related Principles', model.relatedknowledge.related_principles],
    ['Related Workflows', model.relatedknowledge.related_workflows],
    ['Related Patterns', model.relatedknowledge.related_patterns],
    ['Related Packages', model.relatedknowledge.related_packages],
    ['Related Guides', model.relatedknowledge.related_guides],
    ['Related Registry', model.relatedknowledge.related_registry],
  ] as const;

  return (
    <div className="space-y-4">
      {/* 1. Core Understanding */}
      <CollapsibleSection
        id="core-understanding"
        label="Core Understanding & Mathematical Intuition"
        icon={<BookOpen className="w-4 h-4" />}
        open={coreOpen}
        onToggle={() => setCoreOpen(v => !v)}
        teaser={coreTeaser}
      >
        <div className="space-y-5 text-xs font-sans">
          {/* Visual Specs Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {specs.map(({ label, value, icon }) => (
              <div key={label} className="rounded-lg border border-border/85 bg-muted/15 p-3 flex items-start gap-2.5">
                <span className="mt-0.5 shrink-0">{icon}</span>
                <div className="space-y-0.5 text-left">
                  <span className="text-[9px] uppercase tracking-wider text-muted-foreground block font-bold">{label}</span>
                  <ProseInline content={value} className="text-xs font-semibold text-foreground leading-snug" />
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-3.5 leading-relaxed text-muted-foreground pt-1">
            <div>
              <h4 className="font-semibold text-foreground text-xs mb-1">Intuition</h4>
              <Prose content={model.coreunderstanding.intuition} className="text-xs text-muted-foreground" />
            </div>
            <div>
              <h4 className="font-semibold text-foreground text-xs mb-1">Learning Mechanism</h4>
              <Prose content={model.coreunderstanding.learningmechanism} className="text-xs text-muted-foreground" />
            </div>
            {model.coreunderstanding.assumptions.length > 0 && (
              <div>
                <h4 className="font-semibold text-foreground text-xs mb-1">Assumptions Made</h4>
                <ul className="list-disc pl-4 space-y-1 mt-1 text-muted-foreground">
                  {model.coreunderstanding.assumptions.map((ass, idx) => (
                    <li key={idx}><ProseInline content={ass} /></li>
                  ))}
                </ul>
              </div>
            )}
            
            <div className="rounded-lg border border-border bg-muted/10 p-3.5 space-y-1">
              <h4 className="font-bold text-foreground text-xs m-0 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Mathematical Intuition & Formulation
              </h4>
              <Prose content={model.coreunderstanding.mathematicalintuition} className="font-mono text-[11px] leading-relaxed text-muted-foreground m-0 pt-1.5" />
            </div>
          </div>
        </div>
      </CollapsibleSection>

      {/* 2. Engineering Considerations */}
      <CollapsibleSection
        id="engineering-considerations"
        label="Engineering Considerations & Pipeline Position"
        icon={<Settings className="w-4 h-4" />}
        open={engOpen}
        onToggle={() => setEngOpen(v => !v)}
        teaser={engTeaser}
      >
        <div className="space-y-5 text-xs font-sans leading-relaxed text-muted-foreground">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Col 1: Data & Features */}
            <div className="space-y-4">
              <div className="rounded-xl border border-border/60 bg-muted/5 p-4 space-y-3 h-full">
                <h3 className="text-xs font-bold uppercase tracking-wider text-primary border-b border-border pb-1.5 m-0 font-sans">
                  Data & Preprocessing
                </h3>
                <div className="space-y-3 text-xs leading-relaxed text-muted-foreground">
                  <div>
                    <h4 className="font-semibold text-foreground mb-0.5">Dataset Suitability</h4>
                    <ul className="list-disc pl-4 space-y-1">
                      {model.engineeringconsiderations.datasetsuitability.map((item, idx) => (
                        <li key={idx}><ProseInline content={item} /></li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-0.5">Feature Scaling</h4>
                    <Prose content={model.engineeringconsiderations.featurescalingrequirement} className="text-xs text-muted-foreground" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-0.5">Feature Engineering</h4>
                    <Prose content={model.engineeringconsiderations.featureengineeringdependency} className="text-xs text-muted-foreground" />
                  </div>
                </div>
              </div>
            </div>

            {/* Col 2: Performance & Scale */}
            <div className="space-y-4">
              <div className="rounded-xl border border-border/60 bg-muted/5 p-4 space-y-3 h-full">
                <h3 className="text-xs font-bold uppercase tracking-wider text-primary border-b border-border pb-1.5 m-0 font-sans">
                  Runtime & Scalability
                </h3>
                <div className="space-y-3 text-xs leading-relaxed text-muted-foreground">
                  <div>
                    <h4 className="font-semibold text-foreground mb-0.5">Parallelization</h4>
                    <Prose content={model.engineeringconsiderations.parallelization} className="text-xs text-muted-foreground" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-0.5">Sensitivity to Outliers</h4>
                    <Prose content={model.engineeringconsiderations.sensitivitytooutliers} className="text-xs text-muted-foreground" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-0.5">Computational Complexity</h4>
                    <Prose content={model.engineeringconsiderations.computationalcost} className="text-xs text-muted-foreground" />
                  </div>
                </div>
              </div>
            </div>

            {/* Col 3: Pipeline & Robustness */}
            <div className="space-y-4">
              <div className="rounded-xl border border-border/60 bg-muted/5 p-4 space-y-3 h-full">
                <h3 className="text-xs font-bold uppercase tracking-wider text-primary border-b border-border pb-1.5 m-0 font-sans">
                  Pipeline Fit & Robustness
                </h3>
                <div className="space-y-3 text-xs leading-relaxed text-muted-foreground">
                  <div>
                    <h4 className="font-semibold text-foreground mb-0.5">Class Imbalance Behavior</h4>
                    <Prose content={model.engineeringconsiderations.classimbalancebehavior} className="text-xs text-muted-foreground" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-0.5">Robustness</h4>
                    <ul className="list-disc pl-4 space-y-1">
                      {model.engineeringconsiderations.robustness.map((item, idx) => (
                        <li key={idx}><ProseInline content={item} /></li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-0.5">Pipeline Position</h4>
                    <p className="p-2 border border-primary/10 bg-primary/5 text-foreground rounded font-medium text-[11px] leading-snug">
                      {model.engineeringconsiderations.pipelineposition}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-border pt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              ['Computational Cost Details', model.engineeringconsiderations.computationalcost],
              ['Memory Behavior Specs', model.engineeringconsiderations.memorybehavior],
              ['Inference Performance Traits', model.engineeringconsiderations.inferencecharacteristics],
            ].map(([label, val]) => (
              <div key={label} className="p-3 rounded-lg border border-border/80 bg-muted/10">
                <span className="text-[10px] font-bold text-foreground uppercase tracking-wider block mb-1">{label}</span>
                <Prose content={val} className="text-xs text-muted-foreground leading-relaxed m-0" />
              </div>
            ))}
          </div>

          {model.engineeringconsiderations.commonlimitations.length > 0 && (
            <div className="p-3.5 border border-rose-500/15 rounded-lg bg-rose-500/5 dark:bg-rose-950/10 flex items-start gap-2.5">
              <AlertCircle className="w-4.5 h-4.5 text-rose-500 shrink-0 mt-0.5" />
              <div className="space-y-1 font-sans">
                <h4 className="font-bold text-rose-700 dark:text-rose-400 text-xs m-0">Common Limitations & Engineering Gotchas</h4>
                <ul className="list-disc pl-4 space-y-1 text-xs text-muted-foreground mt-1.5">
                  {model.engineeringconsiderations.commonlimitations.map((lim, idx) => (
                    <li key={idx}><ProseInline content={lim} /></li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </CollapsibleSection>

      {/* 3. Hyperparameters */}
      <CollapsibleSection
        id="hyperparameters"
        label="Detailed Hyperparameter Guide"
        icon={<Settings className="w-4 h-4" />}
        open={hyperOpen}
        onToggle={() => setHyperOpen(v => !v)}
        teaser={hyperTeaser}
      >
        <div className="space-y-4 text-xs font-sans">
          {/* Priority chips and global toggles row */}
          <div className="flex items-center justify-between gap-3 mb-4 flex-wrap border-b border-border pb-3.5">
            <HyperparameterPriorityBar hyperparameters={sortedHyperparameters} />
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => toggleAllHp(true)}
                className="px-2.5 py-1 rounded border border-border bg-muted/40 hover:bg-muted text-[10px] font-sans font-bold text-muted-foreground transition-colors cursor-pointer select-none"
              >
                Expand All
              </button>
              <button
                onClick={() => toggleAllHp(false)}
                className="px-2.5 py-1 rounded border border-border bg-muted/40 hover:bg-muted text-[10px] font-sans font-bold text-muted-foreground transition-colors cursor-pointer select-none"
              >
                Collapse All
              </button>
            </div>
          </div>

          {sortedHyperparameters.map((hp) => {
            const isOpen = openHp[hp.name] || false;
            const mappedName = libraryParamsMap[hp.name.toLowerCase()];
            return (
              <div key={hp.name} className="border border-border rounded-lg bg-card/45 overflow-hidden">
                <button
                  onClick={() => setOpenHp(prev => ({ ...prev, [hp.name]: !prev[hp.name] }))}
                  className="w-full flex items-center justify-between gap-3 p-3 bg-muted/20 hover:bg-muted/40 transition-colors select-none text-left focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <h3 className="font-mono text-sm font-bold text-primary m-0 shrink-0 flex items-center gap-2">
                      {hp.name}
                      {mappedName && (
                        <span className="text-[10px] font-normal text-muted-foreground font-mono bg-muted/45 border border-border/80 px-1.5 py-0.5 rounded leading-none">
                          {mappedName}
                        </span>
                      )}
                    </h3>
                    <span className="hidden sm:block text-muted-foreground truncate min-w-0">{hp.purpose}</span>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground bg-muted px-2 py-0.5 rounded border border-border shrink-0 ml-auto">
                      Priority: {hp.tuningpriority}
                    </span>
                  </div>
                  <div>
                    {isOpen ? (
                      <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
                    )}
                  </div>
                </button>
                <div className={cn('p-4 border-t border-border bg-card', isOpen ? 'block' : 'hidden')}>
                  <div className="space-y-3.5">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-foreground block mb-0.5">Purpose & Description</span>
                      <Prose content={hp.purpose} className="text-muted-foreground" />
                    </div>

                    <div className="space-y-3">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-foreground block mb-1">
                          Tuning Tradeoffs
                        </span>
                        <Prose content={hp.tradeoffs} className="text-muted-foreground leading-relaxed" />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
                        {/* Effect of Increasing */}
                        <div className="rounded-lg border border-emerald-500/10 bg-emerald-500/5 dark:bg-emerald-950/5 p-3 space-y-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                            <span className="text-[10px] font-sans">▲</span> Effect of Increasing
                          </span>
                          <Prose content={hp.increaseeffect} className="text-muted-foreground leading-relaxed m-0" />
                        </div>

                        {/* Effect of Decreasing */}
                        <div className="rounded-lg border border-rose-500/10 bg-rose-500/5 dark:bg-rose-950/5 p-3 space-y-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 dark:text-rose-400 flex items-center gap-1">
                            <span className="text-[10px] font-sans">▼</span> Effect of Decreasing
                          </span>
                          <Prose content={hp.decreaseeffect} className="text-muted-foreground leading-relaxed m-0" />
                        </div>
                      </div>
                    </div>

                    {(hp.interactions.length > 0 || hp.commonmistakes.length > 0) && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 border-t border-border text-[11px] leading-relaxed">
                        {hp.interactions.length > 0 && (
                          <div className="space-y-1">
                            <span className="text-[9px] font-bold uppercase tracking-wider text-foreground block">Key Interactions</span>
                            <ul className="list-disc pl-4 space-y-0.5 text-muted-foreground">
                              {hp.interactions.map((inter, idx) => (
                                <li key={idx}><ProseInline content={inter} /></li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {hp.commonmistakes.length > 0 && (
                          <div className="space-y-1">
                            <span className="text-[9px] font-bold uppercase tracking-wider text-rose-500 block">Common Pitfalls & Mistakes</span>
                            <ul className="list-disc pl-4 space-y-0.5 text-muted-foreground">
                              {hp.commonmistakes.map((mistake, idx) => (
                                <li key={idx}><ProseInline content={mistake} /></li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CollapsibleSection>

      {/* 4. Alternatives & Comparisons */}
      {model.comparisons.length > 0 && (
        <CollapsibleSection
          id="comparisons"
          label="Model Comparison & Tradeoffs"
          icon={<Users className="w-4 h-4" />}
          open={compareOpen}
          onToggle={() => setCompareOpen(v => !v)}
          teaser={compareTeaser}
        >
          <div className="space-y-4 text-xs font-sans">
            {model.comparisons.map((comp) => (
              <div key={comp.model} className="border border-border/80 rounded-xl bg-muted/5 p-4 space-y-3 leading-relaxed shadow-sm">
                <h3 className="font-bold text-foreground text-xs m-0 border-b border-border pb-2 font-sans flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded bg-primary/10 text-primary text-[10px] font-bold">VS</span>
                  Comparison with {comp.model}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-sans">
                  <div className="p-3 rounded-lg border border-emerald-500/10 bg-emerald-500/5 dark:bg-emerald-950/5 space-y-1">
                    <span className="text-[9px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider block">
                      Choose {model.name} When
                    </span>
                    <Prose content={comp.choose_this_when} className="text-[11px] text-muted-foreground m-0" />
                  </div>

                  <div className="p-3 rounded-lg border border-amber-500/10 bg-amber-500/5 dark:bg-amber-950/5 space-y-1">
                    <span className="text-[9px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider block">
                      Prefer {comp.model} When
                    </span>
                    <Prose content={comp.prefer_other_when} className="text-[11px] text-muted-foreground m-0" />
                  </div>

                  <div className="p-3 rounded-lg border border-border bg-muted/20 space-y-1">
                    <span className="text-[9px] font-bold text-foreground uppercase tracking-wider block">
                      Key Tradeoffs
                    </span>
                    <Prose content={comp.tradeoffs} className="text-[11px] text-muted-foreground m-0" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CollapsibleSection>
      )}

      {/* 5. Knowledge Map */}
      <CollapsibleSection
        id="related-knowledge"
        label="Also Worth Knowing"
        icon={<LinkIcon className="w-4 h-4" />}
        open={knowledgeOpen}
        onToggle={() => setKnowledgeOpen(v => !v)}
      >
        <div className="space-y-4 text-xs font-sans">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {relatedKnowledgeSections.map(([label, items]) => {
              const arrayItems = items as readonly string[];
              if (!arrayItems || arrayItems.length === 0) return null;
              
              // Check if this section should use cross-linking
              const isModelSection = label === 'Related Models' || label === 'Alternative Models';
              const linkKey = label === 'Related Models' ? 'relatedmodels' : 'alternative_models';
              const resolvedLinks = isModelSection && relatedKnowledgeLinks && category 
                ? relatedKnowledgeLinks[linkKey as keyof typeof relatedKnowledgeLinks] 
                : null;
              
              return (
                <div key={label} className="space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-foreground">{label}</span>
                  <div className="flex flex-wrap gap-1.5">
                    {arrayItems.map((item, idx) => {
                      const resolvedSlug = resolvedLinks?.[idx]?.slug;
                      
                      if (isModelSection && resolvedSlug && category) {
                        return (
                          <Link
                            key={item}
                            href={`/models/${category}/${resolvedSlug}`}
                            className="px-2 py-0.5 rounded border border-border bg-muted/40 text-[10px] font-mono text-foreground hover:bg-muted hover:border-foreground/20 transition-colors"
                          >
                            {item}
                          </Link>
                        );
                      }
                      
                      return (
                        <span key={item} className="px-2 py-0.5 rounded border border-border bg-muted/40 text-[10px] font-mono text-muted-foreground">
                          {item}
                        </span>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CollapsibleSection>
    </div>
  );
}

