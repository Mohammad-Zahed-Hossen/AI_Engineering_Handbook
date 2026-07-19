'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Model, ModelCategory } from '@/types/model';
import { cn } from '@/lib/utils';
import { HelpCircle, ArrowRight, Check, X, Zap, Cpu, Gauge, Database, Scale, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DecisionStep {
  question: string;
  if_yes: string;
  if_no: string;
}

interface CategoryMeta {
  label: string;
  description: string;
  comparison_columns: string[];
  decision_flow?: DecisionStep[];
  linked_decision_guide?: string | null;
}

interface ModelCategoryComparisonProps {
  category: ModelCategory;
  meta: CategoryMeta;
  models: Model[];
}

// Quick Recommendation Badge types derived from model data
type QuickBadgeType = 'beginner' | 'production' | 'high-compute' | 'low-latency';

function getQuickBadges(model: Model): QuickBadgeType[] {
  const badges: QuickBadgeType[] = [];
  
  // Best for beginners
  if (model.difficulty === 'beginner') {
    badges.push('beginner');
  }
  
  // Production-ready
  if (model.engineeringmaturity === 'production') {
    badges.push('production');
  }
  
  // High compute - check complexity for O(n²), O(n³), or VRAM mentions
  const complexity = model.coreunderstanding.complexity.toLowerCase();
  if (complexity.includes('o(n²)') || complexity.includes('o(n³)') || complexity.includes('vram') || 
      complexity.includes('gpu') || complexity.includes('high memory')) {
    badges.push('high-compute');
  }
  
  // Low latency - check for O(p) or fast inference mentions
  const inference = model.decisionsummary.inferencecharacteristics.toLowerCase();
  const training = model.decisionsummary.trainingcharacteristics.toLowerCase();
  if (inference.includes('o(p)') || inference.includes('fast') || inference.includes('low latency') ||
      training.includes('fast') || model.coreunderstanding.complexity.toLowerCase().includes('o(d)')) {
    badges.push('low-latency');
  }
  
  return badges;
}

function QuickBadge({ type }: { type: QuickBadgeType }) {
  const badgeConfig = {
    beginner: { label: 'Beginner-friendly', icon: Check, className: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' },
    production: { label: 'Production-ready', icon: Check, className: 'bg-blue-500/10 text-blue-600 dark:text-blue-400' },
    'high-compute': { label: 'High compute', icon: Cpu, className: 'bg-amber-500/10 text-amber-600 dark:text-amber-400' },
    'low-latency': { label: 'Low latency', icon: Zap, className: 'bg-purple-500/10 text-purple-600 dark:text-purple-400' },
  };
  
  const config = badgeConfig[type];
  const Icon = config.icon;
  
  return (
    <span className={cn(
      "inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-medium",
      config.className
    )}>
      <Icon className="h-2.5 w-2.5" />
      {config.label}
    </span>
  );
}

// Truncate text to 2-3 lines with "More" expansion
function TruncatedText({ text, maxLines = 2 }: { text: string; maxLines?: number }) {
  const [expanded, setExpanded] = useState(false);
  
  if (!text) return null;
  
  return (
    <div>
      <p className={cn(
        "text-muted-foreground leading-relaxed",
        !expanded && `line-clamp-${maxLines}`
      )}>
        {text}
      </p>
      {text.length > 100 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-[10px] text-primary hover:text-primary/80 font-medium mt-1"
        >
          {expanded ? 'Show less' : 'More'}
        </button>
      )}
    </div>
  );
}

// Collapsible section component
function CollapsibleSection({ 
  id, 
  title, 
  icon: Icon,
  children,
  defaultOpen = false 
}: { 
  id: string;
  title: string; 
  icon: React.ElementType;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  
  return (
    <section id={id} className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-semibold text-foreground">{title}</h2>
        </div>
        <button
          onClick={() => setOpen(!open)}
          className="touch-target-inline flex items-center justify-center rounded hover:bg-muted transition-colors"
          aria-label={open ? `Collapse ${title}` : `Expand ${title}`}
        >
          {open ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
        </button>
      </div>
      
      {open && (
        <div className="space-y-3">
          {children}
        </div>
      )}
    </section>
  );
}

// Chip component for related models
function ModelChip({ 
  name, 
  href, 
}: { 
  name: string; 
  href: string | null;
}) {
  if (!href) {
    return (
      <span className="inline-flex items-center px-2 py-1 rounded text-[10px] sm:text-xs font-medium bg-muted text-muted-foreground">
        {name}
      </span>
    );
  }
  
  return (
    <Link
      href={href}
      className="inline-flex items-center px-2 py-1 rounded text-[10px] sm:text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
    >
      {name}
    </Link>
  );
}

// Model cell component for the comparison table
function ModelCell({ model, category }: { model: Model; category: ModelCategory }) {
  const quickBadges = getQuickBadges(model);
  
  return (
    <div className="flex flex-col gap-1.5">
      <Link href={`/models/${category}/${model.id}`} className="font-medium text-foreground hover:underline">
        {model.name}
      </Link>
      {quickBadges.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {quickBadges.map(badge => (
            <QuickBadge key={badge} type={badge} />
          ))}
        </div>
      )}
    </div>
  );
}

// Comparison cell component
function ComparisonCell({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-2.5 sm:p-3 text-[11px] sm:text-xs leading-tight">
      {children}
    </div>
  );
}

export default function ModelCategoryComparison({
  category,
  meta,
  models,
}: ModelCategoryComparisonProps) {
  const [answers, setAnswers] = useState<Record<number, 'yes' | 'no'>>({});

  const handleAnswer = (index: number, val: 'yes' | 'no') => {
    setAnswers({
      ...answers,
      [index]: val,
    });
  };

  const resetFlow = () => {
    setAnswers({});
  };

  const domainLabels: Record<ModelCategory, string> = {
    ml: 'Machine Learning',
    dl: 'Deep Learning',
    llm: 'Large Language Models',
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Category Header */}
      <div className="bg-card text-card-foreground border border-border mobile-card-padding rounded-lg select-none">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span className="text-[10px] uppercase font-semibold tracking-wider text-muted-foreground">
            {domainLabels[category]} &bull; Subcategory
          </span>
        </div>
        <h1 className="text-lg sm:text-xl font-bold tracking-tight text-foreground font-sans">
          {meta.label} Comparison Matrix
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-2xl leading-relaxed font-sans">
          {meta.description}
        </p>
      </div>

      {/* Decision Flow Wizard */}
      {meta.decision_flow && meta.decision_flow.length > 0 && (
        <section className="bg-card border border-border rounded-lg mobile-card-padding space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-border/60">
            <HelpCircle className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-semibold text-foreground">Interactive Decision Flow</h2>
          </div>

          <div className="space-y-4">
            {meta.decision_flow.map((step, idx) => {
              const selected = answers[idx];

              return (
                <div key={idx} className="space-y-3">
                  <p className="text-xs sm:text-sm font-medium text-foreground leading-relaxed">
                    Q: {step.question}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAnswer(idx, 'yes')}
                      className={cn(
                        "touch-target px-4 py-2.5 text-xs sm:text-sm font-semibold rounded border cursor-pointer transition-colors",
                        selected === 'yes'
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-secondary text-secondary-foreground border-border hover:bg-muted"
                      )}
                    >
                      Yes
                    </button>
                    <button
                      onClick={() => handleAnswer(idx, 'no')}
                      className={cn(
                        "touch-target px-4 py-2.5 text-xs sm:text-sm font-semibold rounded border cursor-pointer transition-colors",
                        selected === 'no'
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-secondary text-secondary-foreground border-border hover:bg-muted"
                      )}
                    >
                      No
                    </button>
                  </div>

                  {selected && (
                    <div className="p-3.5 bg-muted/20 border border-border rounded-md text-xs sm:text-sm text-muted-foreground animate-fadeIn leading-relaxed">
                      <span className="font-semibold text-foreground block mb-1">
                        Recommendation:
                      </span>
                      {selected === 'yes' ? step.if_yes : step.if_no}
                    </div>
                  )}
                </div>
              );
            })}
            {Object.keys(answers).length > 0 && (
              <button
                onClick={resetFlow}
                className="touch-target text-xs font-semibold text-rose-500 hover:text-rose-600 transition-colors py-2"
              >
                Reset Decision Tree
              </button>
            )}
          </div>
        </section>
      )}

      {/* Comparison Matrix - Models as Columns (Side-by-side) */}
      <section id="comparison-matrix" className="space-y-3">
        <h2 className="text-sm font-semibold text-foreground">Comparison Matrix</h2>

        <div className="bg-card text-card-foreground border border-border rounded-lg overflow-x-auto">
          <table className="min-w-full divide-y divide-border text-left">
            <thead className="bg-muted/40 text-[10px] sm:text-[11px] font-semibold text-muted-foreground uppercase tracking-wider select-none">
              <tr>
                <th className="sticky left-0 z-20 bg-muted/50 px-3 sm:px-4 py-3.5 sm:py-3 w-1/6 min-w-[120px] sm:min-w-[140px] border-r border-border/30">
                  Field
                </th>
                {models.map((m) => (
                  <th key={m.id} className="px-2 sm:px-3 py-3.5 sm:py-3 min-w-[120px] sm:min-w-[140px] border-l border-border/30">
                    <ModelCell model={m} category={category} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {/* Best For Row */}
              <tr className="hover:bg-muted/10">
                <td className="sticky left-0 z-10 bg-card/95 backdrop-blur-sm px-3 sm:px-4 py-3.5 sm:py-3 font-medium text-foreground border-r border-border/30">
                  Best For
                </td>
                {models.map((m) => (
                  <td key={m.id} className="border-l border-border/30">
                    <ComparisonCell>
                      <TruncatedText text={m.decisionsummary.bestusecases[0] || m.description} />
                    </ComparisonCell>
                  </td>
                ))}
              </tr>

              {/* Strengths Row */}
              <tr className="hover:bg-muted/10">
                <td className="sticky left-0 z-10 bg-card/95 backdrop-blur-sm px-3 sm:px-4 py-3.5 sm:py-3 font-medium text-foreground border-r border-border/30">
                  Strengths
                </td>
                {models.map((m) => (
                  <td key={m.id} className="border-l border-border/30">
                    <ComparisonCell>
                      <ul className="space-y-1">
                        {m.decisionsummary.strengths.slice(0, 2).map((s, i) => (
                          <li key={i} className="flex items-start gap-1">
                            <Check className="h-3 w-3 text-emerald-500 mt-0.5 shrink-0" />
                            <span className="text-muted-foreground leading-tight">{s}</span>
                          </li>
                        ))}
                      </ul>
                    </ComparisonCell>
                  </td>
                ))}
              </tr>

              {/* Limitations Row */}
              <tr className="hover:bg-muted/10">
                <td className="sticky left-0 z-10 bg-card/95 backdrop-blur-sm px-3 sm:px-4 py-3.5 sm:py-3 font-medium text-foreground border-r border-border/30">
                  Limitations
                </td>
                {models.map((m) => (
                  <td key={m.id} className="border-l border-border/30">
                    <ComparisonCell>
                      <ul className="space-y-1">
                        {m.decisionsummary.limitations.slice(0, 2).map((l, i) => (
                          <li key={i} className="flex items-start gap-1">
                            <X className="h-3 w-3 text-rose-500 mt-0.5 shrink-0" />
                            <span className="text-muted-foreground leading-tight">{l}</span>
                          </li>
                        ))}
                      </ul>
                    </ComparisonCell>
                  </td>
                ))}
              </tr>

              {/* Training Row */}
              <tr className="hover:bg-muted/10">
                <td className="sticky left-0 z-10 bg-card/95 backdrop-blur-sm px-3 sm:px-4 py-3.5 sm:py-3 font-medium text-foreground border-r border-border/30">
                  Training
                </td>
                {models.map((m) => (
                  <td key={m.id} className="border-l border-border/30">
                    <ComparisonCell>
                      <span className="text-muted-foreground font-mono text-[10px] sm:text-xs leading-relaxed">
                        {m.coreunderstanding.complexity}
                      </span>
                    </ComparisonCell>
                  </td>
                ))}
              </tr>

              {/* Data Type Row */}
              <tr className="hover:bg-muted/10">
                <td className="sticky left-0 z-10 bg-card/95 backdrop-blur-sm px-3 sm:px-4 py-3.5 sm:py-3 font-medium text-foreground border-r border-border/30">
                  Data Type
                </td>
                {models.map((m) => (
                  <td key={m.id} className="border-l border-border/30">
                    <ComparisonCell>
                      <TruncatedText text={m.engineeringconsiderations.datasetsuitability[0] || 'N/A'} />
                    </ComparisonCell>
                  </td>
                ))}
              </tr>

              {/* Scaling Row */}
              <tr className="hover:bg-muted/10">
                <td className="sticky left-0 z-10 bg-card/95 backdrop-blur-sm px-3 sm:px-4 py-3.5 sm:py-3 font-medium text-foreground border-r border-border/30">
                  Scaling
                </td>
                {models.map((m) => (
                  <td key={m.id} className="border-l border-border/30">
                    <ComparisonCell>
                      <span className={cn(
                        "inline-flex items-center justify-center px-2 py-1 rounded text-[10px] sm:text-xs font-medium",
                        m.engineeringconsiderations.featurescalingrequirement.toLowerCase().includes('not required') || 
                        m.engineeringconsiderations.featurescalingrequirement.toLowerCase().includes('unnecessary')
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                          : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                      )}>
                        {m.engineeringconsiderations.featurescalingrequirement.toLowerCase().includes('not required') || 
                         m.engineeringconsiderations.featurescalingrequirement.toLowerCase().includes('unnecessary')
                          ? 'Not required'
                          : 'Required'}
                      </span>
                    </ComparisonCell>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Phase 3: When to Choose / When to Avoid Section */}
      <CollapsibleSection 
        id="when-to-choose" 
        title="When to Choose" 
        icon={Check}
        defaultOpen={false}
      >
        <div className="grid gap-3 sm:gap-4">
          {models.map((m) => (
            <Card key={m.id} className="border border-border bg-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium">
                  <Link href={`/models/${category}/${m.id}`} className="text-foreground hover:text-primary">
                    {m.name}
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <h4 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                    Choose this when
                  </h4>
                  <ul className="space-y-1">
                    {m.decisionsummary.bestusecases.slice(0, 3).map((use, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <Check className="h-3 w-3 text-emerald-500 mt-0.5 shrink-0" />
                        <span className="text-[11px] sm:text-xs text-muted-foreground leading-tight">{use}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                    Avoid when
                  </h4>
                  <ul className="space-y-1">
                    {m.decisionsummary.avoidwhen.slice(0, 3).map((avoid, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <X className="h-3 w-3 text-rose-500 mt-0.5 shrink-0" />
                        <span className="text-[11px] sm:text-xs text-muted-foreground leading-tight">{avoid}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CollapsibleSection>

      {/* Phase 4: Computational Profile Section */}
      <CollapsibleSection 
        id="computational-profile" 
        title="Computational Profile" 
        icon={Cpu}
        defaultOpen={false}
      >
        <div className="grid gap-3 sm:gap-4">
          {models.map((m) => (
            <Card key={m.id} className="border border-border bg-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium">
                  <Link href={`/models/${category}/${m.id}`} className="text-foreground hover:text-primary">
                    {m.name}
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Time Complexity
                    </span>
                    <p className="text-[11px] sm:text-xs text-muted-foreground font-mono mt-1">
                      {m.coreunderstanding.complexity}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Memory Complexity
                    </span>
                    <p className="text-[11px] sm:text-xs text-muted-foreground font-mono mt-1">
                      {m.coreunderstanding.memorycomplexity}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Training Cost
                    </span>
                    <p className="text-[11px] sm:text-xs text-muted-foreground mt-1">
                      {m.engineeringconsiderations.computationalcost}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Memory Behavior
                    </span>
                    <p className="text-[11px] sm:text-xs text-muted-foreground mt-1">
                      {m.engineeringconsiderations.memorybehavior}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CollapsibleSection>

      {/* Phase 5: Data Requirements Section */}
      <CollapsibleSection 
        id="data-requirements" 
        title="Data Requirements" 
        icon={Database}
        defaultOpen={false}
      >
        <div className="grid gap-3 sm:gap-4">
          {models.map((m) => (
            <Card key={m.id} className="border border-border bg-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium">
                  <Link href={`/models/${category}/${m.id}`} className="text-foreground hover:text-primary">
                    {m.name}
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2">
                  <Scale className="h-3 w-3 text-muted-foreground" />
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Feature Scaling
                  </span>
                  <span className={cn(
                    "inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-medium",
                    m.engineeringconsiderations.featurescalingrequirement.toLowerCase().includes('not required') || 
                    m.engineeringconsiderations.featurescalingrequirement.toLowerCase().includes('unnecessary')
                      ? "bg-emerald-500/10 text-emerald-600"
                      : "bg-amber-500/10 text-amber-600"
                  )}>
                    {m.engineeringconsiderations.featurescalingrequirement.toLowerCase().includes('not required') || 
                     m.engineeringconsiderations.featurescalingrequirement.toLowerCase().includes('unnecessary')
                      ? 'Not required'
                      : 'Required'}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Feature Engineering
                  </span>
                  <p className="text-[11px] sm:text-xs text-muted-foreground mt-1">
                    {m.engineeringconsiderations.featureengineeringdependency}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Dataset Suitability
                  </span>
                  <ul className="mt-1 space-y-1">
                    {m.engineeringconsiderations.datasetsuitability.slice(0, 2).map((s, i) => (
                      <li key={i} className="text-[11px] sm:text-xs text-muted-foreground">
                        • {s}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CollapsibleSection>

      {/* Phase 6: Model Comparisons Section */}
      <CollapsibleSection 
        id="model-comparisons" 
        title="Model Comparisons" 
        icon={Gauge}
        defaultOpen={false}
      >
        <div className="grid gap-3 sm:gap-4">
          {models.map((m) => (
            m.comparisons && m.comparisons.length > 0 && (
              <Card key={m.id} className="border border-border bg-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs sm:text-sm font-medium">
                    <Link href={`/models/${category}/${m.id}`} className="text-foreground hover:text-primary">
                      {m.name}
                    </Link>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {m.comparisons.slice(0, 3).map((comp, i) => (
                    <div key={i} className="space-y-1.5">
                      <span className="text-[10px] font-semibold text-foreground">
                        vs {comp.model}
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] sm:text-xs">
                        <div>
                          <span className="text-emerald-600 font-medium">Choose this:</span>
                          <p className="text-muted-foreground mt-0.5">{comp.choose_this_when}</p>
                        </div>
                        <div>
                          <span className="text-rose-600 font-medium">Prefer other:</span>
                          <p className="text-muted-foreground mt-0.5">{comp.prefer_other_when}</p>
                        </div>
                      </div>
                      {comp.tradeoffs && (
                        <p className="text-[10px] sm:text-[11px] text-muted-foreground italic">
                          Trade-off: {comp.tradeoffs}
                        </p>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            )
          ))}
        </div>
      </CollapsibleSection>

      {/* Phase 7: Related Models & Alternatives Section */}
      <CollapsibleSection 
        id="related-models" 
        title="Related Models" 
        icon={Scale}
        defaultOpen={false}
      >
        <div className="grid gap-3 sm:gap-4">
          {models.map((m) => (
            <Card key={m.id} className="border border-border bg-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium">
                  <Link href={`/models/${category}/${m.id}`} className="text-foreground hover:text-primary">
                    {m.name}
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {m.relatedknowledge.relatedmodels && m.relatedknowledge.relatedmodels.length > 0 && (
                  <div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 block">
                      Related Models
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {m.relatedknowledge.relatedmodels.slice(0, 4).map((rm, i) => (
                        <ModelChip 
                          key={i} 
                          name={rm} 
                          href={`/models/${category}/${rm.toLowerCase().replace(/\s+/g, '-')}`}
                        />
                      ))}
                    </div>
                  </div>
                )}
                {m.relatedknowledge.alternative_models && m.relatedknowledge.alternative_models.length > 0 && (
                  <div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 block">
                      Alternative Models
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {m.relatedknowledge.alternative_models.slice(0, 4).map((am, i) => (
                        <ModelChip 
                          key={i} 
                          name={am} 
                          href={`/models/${category}/${am.toLowerCase().replace(/\s+/g, '-')}`}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </CollapsibleSection>

      {/* Decision Guide Helper Link */}
      {meta.linked_decision_guide && (
        <div className="p-4 sm:p-5 bg-primary/5 border border-primary/20 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs sm:text-sm">
          <div className="space-y-1">
            <h4 className="font-semibold text-foreground">Need architectural context?</h4>
            <p className="text-muted-foreground leading-relaxed">
              Review our specialized decision guide regarding implementation trade-offs.
            </p>
          </div>
          <Link
            href={`/decision-guides/${meta.linked_decision_guide}`}
            className="touch-target inline-flex items-center justify-center px-4 py-2.5 bg-primary text-primary-foreground rounded hover:bg-primary/95 transition-colors font-medium gap-1.5 w-full sm:w-auto"
          >
            Read Decision Guide <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
          </Link>
        </div>
      )}
    </div>
  );
}