'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight, BookOpen, Settings, Users, Link as LinkIcon, AlertCircle } from 'lucide-react';
import { Model } from '@/types/model';
import { cn } from '@/lib/utils';

interface ModelCollapsibleSectionsProps {
  model: Model;
}

interface CollapsibleSectionProps {
  id: string;
  label: string;
  icon: React.ReactNode;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

function CollapsibleSection({
  id,
  label,
  icon,
  open,
  onToggle,
  children,
}: CollapsibleSectionProps) {
  return (
    <section id={id} className="scroll-mt-24 border border-border rounded-lg bg-card overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 bg-muted/20 hover:bg-muted/40 transition-colors select-none text-left"
        aria-expanded={open}
      >
        <div className="flex items-center gap-2.5">
          <span className="text-primary">{icon}</span>
          <h2 className="text-sm font-bold text-foreground font-sans m-0">{label}</h2>
        </div>
        <div>
          {open ? (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          )}
        </div>
      </button>
      <div className={cn('p-5 border-t border-border bg-card', open ? 'block' : 'hidden')}>
        {children}
      </div>
    </section>
  );
}

export default function ModelCollapsibleSections({ model }: ModelCollapsibleSectionsProps) {
  const [coreOpen, setCoreOpen] = useState(true);
  const [engOpen, setEngOpen] = useState(true);
  const [hyperOpen, setHyperOpen] = useState(true);
  const [compareOpen, setCompareOpen] = useState(true);
  const [knowledgeOpen, setKnowledgeOpen] = useState(false);

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
      >
        <div className="space-y-4 text-xs font-sans">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center mb-2">
            {[
              ['Complexity', model.coreunderstanding.complexity],
              ['Memory Complexity', model.coreunderstanding.memorycomplexity],
              ['Robustness', model.coreunderstanding.robustness],
              ['Scalability', model.coreunderstanding.scalability],
            ].map(([label, value]) => (
              <div key={label} className="rounded border border-border bg-muted/30 p-2">
                <span className="text-[9px] uppercase text-muted-foreground block mb-0.5">{label}</span>
                <span className="text-xs font-semibold capitalize text-foreground">{value}</span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-center mb-4">
            {[
              ['Overfitting Tendency', model.coreunderstanding.overfittingtendency],
              ['Bias-Variance Profile', model.coreunderstanding.biasvariance],
            ].map(([label, value]) => (
              <div key={label} className="rounded border border-border bg-muted/30 p-2">
                <span className="text-[9px] uppercase text-muted-foreground block mb-0.5">{label}</span>
                <span className="text-xs font-semibold text-foreground">{value}</span>
              </div>
            ))}
          </div>

          <div className="space-y-3 leading-relaxed text-muted-foreground">
            <div>
              <h4 className="font-semibold text-foreground text-xs mb-1">Intuition</h4>
              <p>{model.coreunderstanding.intuition}</p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground text-xs mb-1">Learning Mechanism</h4>
              <p>{model.coreunderstanding.learningmechanism}</p>
            </div>
            {model.coreunderstanding.assumptions.length > 0 && (
              <div>
                <h4 className="font-semibold text-foreground text-xs mb-1">Assumptions Made</h4>
                <ul className="list-disc pl-4 space-y-1 mt-1 text-muted-foreground">
                  {model.coreunderstanding.assumptions.map((ass, idx) => (
                    <li key={idx}>{ass}</li>
                  ))}
                </ul>
              </div>
            )}
            <div>
              <h4 className="font-semibold text-foreground text-xs mb-1">Mathematical Details</h4>
              <p className="font-mono bg-muted/10 p-2 border border-border rounded text-[11px] leading-relaxed font-sans">
                {model.coreunderstanding.mathematicalintuition}
              </p>
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
      >
        <div className="space-y-4 text-xs font-sans leading-relaxed text-muted-foreground">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left Col */}
            <div className="space-y-3.5">
              <div>
                <h4 className="font-semibold text-foreground text-xs mb-1">Dataset Suitability</h4>
                <ul className="list-disc pl-4 space-y-1">
                  {model.engineeringconsiderations.datasetsuitability.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-foreground text-xs mb-1">Feature Engineering Dependency</h4>
                <p>{model.engineeringconsiderations.featureengineeringdependency}</p>
              </div>

              <div>
                <h4 className="font-semibold text-foreground text-xs mb-1">Feature Scaling Requirement</h4>
                <p>{model.engineeringconsiderations.featurescalingrequirement}</p>
              </div>

              <div>
                <h4 className="font-semibold text-foreground text-xs mb-1">Parallelization Details</h4>
                <p>{model.engineeringconsiderations.parallelization}</p>
              </div>
            </div>

            {/* Right Col */}
            <div className="space-y-3.5">
              <div>
                <h4 className="font-semibold text-foreground text-xs mb-1">Robustness Profile</h4>
                <ul className="list-disc pl-4 space-y-1">
                  {model.engineeringconsiderations.robustness.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-foreground text-xs mb-1">Sensitivity to Outliers</h4>
                <p>{model.engineeringconsiderations.sensitivitytooutliers}</p>
              </div>

              <div>
                <h4 className="font-semibold text-foreground text-xs mb-1">Class Imbalance Behavior</h4>
                <p>{model.engineeringconsiderations.classimbalancebehavior}</p>
              </div>

              <div>
                <h4 className="font-semibold text-foreground text-xs mb-1">Pipeline Position</h4>
                <p className="p-2 border border-primary/10 bg-primary/5 text-foreground rounded font-medium">
                  {model.engineeringconsiderations.pipelineposition}
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-border pt-3.5 grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              ['Computational Cost', model.engineeringconsiderations.computationalcost],
              ['Memory Behavior', model.engineeringconsiderations.memorybehavior],
              ['Inference Performance', model.engineeringconsiderations.inferencecharacteristics],
            ].map(([label, val]) => (
              <div key={label} className="p-2.5 rounded border border-border bg-muted/10">
                <span className="text-[10px] font-semibold text-foreground uppercase block mb-1">{label}</span>
                <p className="text-xs text-muted-foreground leading-relaxed">{val}</p>
              </div>
            ))}
          </div>

          {model.engineeringconsiderations.commonlimitations.length > 0 && (
            <div className="p-3 bg-rose-500/5 border border-rose-500/10 rounded-lg flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="font-semibold text-rose-700 dark:text-rose-400 text-xs m-0 font-sans">Common Limitations</h4>
                <ul className="list-disc pl-4 space-y-0.5 text-xs text-muted-foreground mt-1">
                  {model.engineeringconsiderations.commonlimitations.map((lim, idx) => (
                    <li key={idx}>{lim}</li>
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
      >
        <div className="space-y-5 text-xs font-sans">
          {model.hyperparameters.map((hp) => (
            <div key={hp.name} className="border border-border rounded-lg bg-card/45 p-4 space-y-3">
              <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-border pb-2">
                <h3 className="font-mono text-sm font-bold text-primary m-0">{hp.name}</h3>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground bg-muted px-2 py-0.5 rounded border border-border">
                  Priority: {hp.tuningpriority}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-muted-foreground">
                <div className="space-y-2">
                  <div>
                    <span className="text-[10px] font-semibold uppercase text-foreground block mb-0.5">Purpose & Description</span>
                    <p>{hp.purpose}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold uppercase text-foreground block mb-0.5">Tuning Tradeoffs</span>
                    <p>{hp.tradeoffs}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div>
                    <span className="text-[10px] font-semibold uppercase text-emerald-700 dark:text-emerald-400 block mb-0.5">Effect of Increasing</span>
                    <p>{hp.increaseeffect}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold uppercase text-rose-700 dark:text-rose-400 block mb-0.5">Effect of Decreasing</span>
                    <p>{hp.decreaseeffect}</p>
                  </div>
                </div>
              </div>

              {(hp.interactions.length > 0 || hp.commonmistakes.length > 0) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2.5 border-t border-border text-[11px] leading-relaxed">
                  {hp.interactions.length > 0 && (
                    <div className="space-y-1">
                      <span className="text-[9px] font-semibold uppercase text-foreground block">Key Interactions</span>
                      <ul className="list-disc pl-4 space-y-0.5 text-muted-foreground">
                        {hp.interactions.map((inter, idx) => (
                          <li key={idx}>{inter}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {hp.commonmistakes.length > 0 && (
                    <div className="space-y-1">
                      <span className="text-[9px] font-semibold uppercase text-rose-500 block">Common Pitfalls & Mistakes</span>
                      <ul className="list-disc pl-4 space-y-0.5 text-muted-foreground">
                        {hp.commonmistakes.map((mistake, idx) => (
                          <li key={idx}>{mistake}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
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
        >
          <div className="space-y-4 text-xs font-sans">
            {model.comparisons.map((comp) => (
              <div key={comp.model} className="border border-border rounded-lg bg-card/45 p-4 space-y-3 leading-relaxed">
                <h3 className="font-bold text-foreground text-sm m-0 border-b border-border pb-1.5 font-sans">
                  Comparison with {comp.model}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="p-2.5 rounded border border-border bg-emerald-500/5">
                    <span className="text-[9px] font-semibold text-emerald-700 dark:text-emerald-400 uppercase block mb-1">
                      Choose {model.name} When
                    </span>
                    <p className="text-muted-foreground">{comp.choose_this_when}</p>
                  </div>

                  <div className="p-2.5 rounded border border-border bg-amber-500/5">
                    <span className="text-[9px] font-semibold text-amber-700 dark:text-amber-400 uppercase block mb-1">
                      Prefer {comp.model} When
                    </span>
                    <p className="text-muted-foreground">{comp.prefer_other_when}</p>
                  </div>

                  <div className="p-2.5 rounded border border-border bg-muted/20">
                    <span className="text-[9px] font-semibold text-foreground uppercase block mb-1">
                      Key Tradeoffs
                    </span>
                    <p className="text-muted-foreground">{comp.tradeoffs}</p>
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
        label="Related Knowledge Links"
        icon={<LinkIcon className="w-4 h-4" />}
        open={knowledgeOpen}
        onToggle={() => setKnowledgeOpen(v => !v)}
      >
        <div className="space-y-4 text-xs font-sans">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {relatedKnowledgeSections.map(([label, items]) => {
              const arrayItems = items as readonly string[];
              if (!arrayItems || arrayItems.length === 0) return null;
              return (
                <div key={label} className="space-y-1.5">
                  <span className="text-[10px] font-semibold uppercase text-foreground">{label}</span>
                  <div className="flex flex-wrap gap-1.5">
                    {arrayItems.map(item => (
                      <span key={item} className="px-2 py-0.5 rounded border border-border bg-muted/40 text-[10px] font-mono text-muted-foreground">
                        {item}
                      </span>
                    ))}
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
