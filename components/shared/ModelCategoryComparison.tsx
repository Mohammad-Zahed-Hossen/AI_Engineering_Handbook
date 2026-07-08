'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Model, ModelCategory } from '@/types/model';
import { cn } from '@/lib/utils';
import { HelpCircle, ArrowRight } from 'lucide-react';

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
    <div className="space-y-8">
      {/* Category Header */}
      <div className="bg-card text-card-foreground border border-border p-5 rounded-lg select-none">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span className="text-[10px] uppercase font-semibold tracking-wider text-muted-foreground">
            {domainLabels[category]} &bull; Subcategory
          </span>
        </div>
        <h1 className="text-xl font-bold tracking-tight text-foreground font-sans">
          {meta.label} Comparison Matrix
        </h1>
        <p className="text-xs text-muted-foreground mt-1 max-w-2xl leading-relaxed font-sans">
          {meta.description}
        </p>
      </div>

      {/* Decision Flow Wizard */}
      {meta.decision_flow && meta.decision_flow.length > 0 && (
        <section className="bg-card border border-border rounded-lg p-5 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-border/60">
            <HelpCircle className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-semibold text-foreground">Interactive Decision Flow</h2>
          </div>

          <div className="space-y-4">
            {meta.decision_flow.map((step, idx) => {
              const selected = answers[idx];

              return (
                <div key={idx} className="space-y-3">
                  <p className="text-xs font-medium text-foreground">
                    Q: {step.question}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAnswer(idx, 'yes')}
                      className={cn(
                        "px-3 py-1 text-xs font-semibold rounded border cursor-pointer transition-colors",
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
                        "px-3 py-1 text-xs font-semibold rounded border cursor-pointer transition-colors",
                        selected === 'no'
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-secondary text-secondary-foreground border-border hover:bg-muted"
                      )}
                    >
                      No
                    </button>
                  </div>

                  {selected && (
                    <div className="p-3.5 bg-muted/20 border border-border rounded-md text-xs text-muted-foreground animate-fadeIn">
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
                className="text-[10px] font-semibold text-rose-500 hover:text-rose-600 transition-colors"
              >
                Reset Decision Tree
              </button>
            )}
          </div>
        </section>
      )}

      {/* Comparison Grid Table */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-foreground">Comparison Matrix</h2>

        <div className="bg-card text-card-foreground border border-border rounded-lg overflow-hidden transition-colors">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border text-left">
              <thead className="bg-muted/40 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider select-none">
                <tr>
                  <th className="px-4 py-3 w-1/6">Model</th>
                  <th className="px-4 py-3 w-2/6">Typical Use Case</th>
                  <th className="px-4 py-3 text-center">Difficulty</th>
                  <th className="px-4 py-3 text-center">Maturity</th>
                  <th className="px-4 py-3 w-2/6">Interpretability</th>
                  <th className="px-4 py-3 text-right pr-6">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-[11px]">
                {models.map((m) => (
                  <tr key={m.id} className="hover:bg-muted/10 font-sans">
                    <td className="px-4 py-3 align-middle font-semibold text-primary">
                      <Link href={`/models/${category}/${m.id}`} className="hover:underline">
                        {m.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3 align-middle text-muted-foreground leading-relaxed">
                      {m.decisionsummary.bestusecases[0] || m.description}
                    </td>
                    <td className="px-4 py-3 align-middle text-center capitalize font-mono">
                      <span className={cn(
                        m.difficulty === 'beginner' && 'text-emerald-500',
                        m.difficulty === 'intermediate' && 'text-amber-500',
                        m.difficulty === 'advanced' && 'text-rose-500',
                        m.difficulty === 'expert' && 'text-purple-500'
                      )}>
                        {m.difficulty}
                      </span>
                    </td>
                    <td className="px-4 py-3 align-middle text-center capitalize font-mono text-muted-foreground">
                      {m.engineeringmaturity}
                    </td>
                    <td className="px-4 py-3 align-middle text-muted-foreground leading-relaxed">
                      {m.decisionsummary.interpretability}
                    </td>
                    <td className="px-4 py-3 align-middle text-right pr-6">
                      <Link
                        href={`/models/${category}/${m.id}`}
                        className="text-xs text-foreground font-semibold hover:underline"
                      >
                        Explore &rarr;
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Decision Guide Helper Link */}
      {meta.linked_decision_guide && (
        <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg flex items-center justify-between text-xs">
          <div className="space-y-1">
            <h4 className="font-semibold text-foreground">Need architectural context?</h4>
            <p className="text-muted-foreground">
              Review our specialized decision guide regarding implementation trade-offs.
            </p>
          </div>
          <Link
            href={`/decision-guides/${meta.linked_decision_guide}`}
            className="px-3 py-1.5 bg-primary text-primary-foreground rounded hover:bg-primary/95 transition-colors font-medium flex items-center gap-1.5"
          >
            Read Decision Guide <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      )}
    </div>
  );
}
