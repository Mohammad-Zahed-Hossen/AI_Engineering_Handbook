'use client';

import { useState } from 'react';
import { Model, ProblemType } from '@/types/model';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface FilterBarProps {
  label: string;
  options: string[];
  selectedOptions: string[];
  onToggle: (option: string) => void;
  onClear: () => void;
}

export default function FilterBar({
  label,
  options,
  selectedOptions,
  onToggle,
  onClear,
}: FilterBarProps) {
  return (
    <div className="bg-card text-card-foreground border border-border rounded-lg p-3 flex flex-wrap items-center gap-3 select-none text-xs">
      <span className="font-semibold text-muted-foreground font-sans">{label}:</span>
      <div className="flex flex-wrap gap-1.5 flex-1">
        {options.map((opt) => {
          const active = selectedOptions.includes(opt);
          return (
            <button
              key={opt}
              onClick={() => onToggle(opt)}
              className={cn(
                "px-2 py-0.5 rounded border text-[10px] font-medium cursor-pointer select-none",
                active
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-secondary text-secondary-foreground border-border hover:bg-muted"
              )}
            >
              {opt}
            </button>
          );
        })}
      </div>
      {selectedOptions.length > 0 && (
        <button
          onClick={onClear}
          className="text-[10px] text-rose-500 hover:text-rose-600 font-semibold cursor-pointer"
        >
          Clear Filters ({selectedOptions.length})
        </button>
      )}
    </div>
  );
}

// ── Model List Client Filter ────────────────────────────────
const problemTypesList: ProblemType[] = [
  'classification',
  'regression',
  'clustering',
  'generation',
  'embedding',
  'detection',
  'segmentation',
];

interface ModelListFilterProps {
  models: Model[];
  category: string;
}

export function ModelListFilter({ models, category }: ModelListFilterProps) {
  const [selectedProblems, setSelectedProblems] = useState<ProblemType[]>([]);

  const handleToggle = (opt: string) => {
    const pt = opt as ProblemType;
    if (selectedProblems.includes(pt)) {
      setSelectedProblems(selectedProblems.filter((p) => p !== pt));
    } else {
      setSelectedProblems([...selectedProblems, pt]);
    }
  };

  const handleClear = () => {
    setSelectedProblems([]);
  };

  const filteredModels = models.filter((model) => {
    if (selectedProblems.length === 0) return true;
    return model.problem_types.some((pt) => selectedProblems.includes(pt));
  });

  return (
    <div className="space-y-6">
      {/* Filter Bar */}
      <FilterBar
        label="Filter by Problem Type"
        options={problemTypesList}
        selectedOptions={selectedProblems}
        onToggle={handleToggle}
        onClear={handleClear}
      />

      {/* Models Grid Table */}
      <div className="bg-card text-card-foreground border border-border rounded-lg overflow-hidden transition-colors hover:border-foreground/15">
        {filteredModels.length === 0 ? (
          <div className="p-8 text-center text-xs text-muted-foreground select-none">
            No models match the selected filter criteria.
          </div>
        ) : (
          <table className="min-w-full divide-y divide-border text-left">
            <thead className="bg-muted/40 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider select-none">
              <tr>
                <th className="px-4 py-2.5 w-1/4">Model Name</th>
                <th className="px-4 py-2.5 w-2/5">Summary</th>
                <th className="px-4 py-2.5">Problem Types</th>
                <th className="px-4 py-2.5 text-center">Inference</th>
                <th className="px-4 py-2.5 text-center">Memory</th>
                <th className="px-4 py-2.5 text-right pr-6">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-[11px]">
              {filteredModels.map((m) => (
                <tr key={m.id} className="hover:bg-muted/10 font-sans">
                  <td className="px-4 py-3 align-middle">
                    <Link
                      href={`/models/${category}/${m.id}`}
                      className="font-semibold text-primary hover:underline text-xs"
                    >
                      {m.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 align-middle text-muted-foreground leading-relaxed">
                    {m.summary}
                  </td>
                  <td className="px-4 py-3 align-middle">
                    <div className="flex flex-wrap gap-1">
                      {m.problem_types.map((pt) => (
                        <span
                          key={pt}
                          className="px-1.5 py-0.5 rounded bg-secondary text-secondary-foreground border border-border text-[9px] font-mono capitalize"
                        >
                          {pt}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 align-middle text-center capitalize font-mono">
                    <span className={cn(
                      m.inference_speed === 'fast' && 'text-emerald-500',
                      m.inference_speed === 'medium' && 'text-amber-500',
                      m.inference_speed === 'slow' && 'text-rose-500'
                    )}>
                      {m.inference_speed}
                    </span>
                  </td>
                  <td className="px-4 py-3 align-middle text-center capitalize font-mono">
                    <span className={cn(
                      m.memory_usage === 'low' && 'text-emerald-500',
                      m.memory_usage === 'medium' && 'text-amber-500',
                      m.memory_usage === 'high' && 'text-rose-500'
                    )}>
                      {m.memory_usage}
                    </span>
                  </td>
                  <td className="px-4 py-3 align-middle text-right pr-6">
                    <Link
                      href={`/models/${category}/${m.id}`}
                      className="text-xs text-foreground font-semibold hover:underline"
                    >
                      Configure &rarr;
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
