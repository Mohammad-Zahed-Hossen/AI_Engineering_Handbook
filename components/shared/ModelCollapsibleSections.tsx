'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Model } from '@/types/model';
import { CodeBlock } from '@/components/shared/CodeBlock';
import { cn } from '@/lib/utils';

interface ModelCollapsibleSectionsProps {
  model: Model;
}

// Collapsible section wrapper component
interface CollapsibleSectionProps {
  id: string;
  label: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

function CollapsibleSection({
  id,
  label,
  open,
  onToggle,
  children,
}: CollapsibleSectionProps) {
  return (
    <section id={id} className="scroll-mt-24 space-y-2">
      {/* Header — clickable on mobile, static on desktop */}
      <div className="flex items-center justify-between">
        <h2>{label}</h2>
        {/* Toggle button — only visible on mobile */}
        <button
          onClick={onToggle}
          className="md:hidden flex items-center gap-1 text-[10px] text-muted-foreground 
                     hover:text-foreground transition-colors select-none"
          aria-expanded={open}
        >
          {open
            ? <><ChevronDown className="w-3.5 h-3.5" />Hide</>
            : <><ChevronRight className="w-3.5 h-3.5" />Show</>
          }
        </button>
      </div>
      {/* Content — always shown on md+, conditionally on mobile */}
      <div className={cn('md:block', open ? 'block' : 'hidden')}>
        {children}
      </div>
    </section>
  );
}

export default function ModelCollapsibleSections({ model }: ModelCollapsibleSectionsProps) {

  // On md+ screens always show expanded. On mobile, collapsed by default.
  // We achieve this with CSS: the toggle button is only visible on mobile (md:hidden).
  // On desktop the content is always shown via CSS regardless of state.
  // On mobile the content is shown/hidden based on the expanded state.

  const [perfOpen, setPerfOpen] = useState(false);
  const [hyperOpen, setHyperOpen] = useState(false);
  const [codeOpen, setCodeOpen] = useState(true);

  return (
    <>
      {/* Performance section */}
      <CollapsibleSection
        id="performance"
        label="Performance Overview"
        open={perfOpen}
        onToggle={() => setPerfOpen(v => !v)}
      >
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            {[
              ['Training', model.training_speed],
              ['Inference', model.inference_speed],
              ['Memory', model.memory_usage],
              ['Interpretability', model.interpretability],
            ].map(([label, value]) => (
              <div key={label} className="rounded border border-border bg-muted/30 p-2">
                <span className="text-[10px] uppercase text-muted-foreground block mb-1">
                  {label}
                </span>
                <span className="text-sm font-mono font-medium capitalize">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </CollapsibleSection>

      {/* Hyperparameters section */}
      {model.key_hyperparams.length > 0 && (
        <CollapsibleSection
          id="hyperparams"
          label="Key Hyperparameters"
          open={hyperOpen}
          onToggle={() => setHyperOpen(v => !v)}
        >
          <>
            {/* Mobile: card per hyperparam */}
            <div className="md:hidden space-y-2">
              {model.key_hyperparams.map(hp => (
                <div
                  key={hp.name}
                  className="rounded-lg border border-border bg-card p-3 space-y-1.5"
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="font-mono text-sm font-semibold text-primary">
                      {hp.name}
                    </span>
                    <span className="font-mono text-xs text-muted-foreground shrink-0">
                      default: {hp.default === null ? 'null' : String(hp.default)}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {hp.note}
                  </p>
                </div>
              ))}
            </div>

            {/* Desktop: original table */}
            <div className="hidden md:block rounded-lg border border-border overflow-x-auto bg-card">
              <table className="min-w-full divide-y divide-border text-left text-sm">
                <thead className="bg-muted/40 text-[10px] font-semibold text-muted-foreground uppercase">
                  <tr>
                    <th className="px-4 py-2">Name</th>
                    <th className="px-4 py-2">Default</th>
                    <th className="px-4 py-2">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {model.key_hyperparams.map(hp => (
                    <tr key={hp.name} className="hover:bg-muted/10">
                      <td className="px-4 py-2 font-mono text-primary">{hp.name}</td>
                      <td className="px-4 py-2 font-mono">
                        {hp.default === null ? 'null' : String(hp.default)}
                      </td>
                      <td className="px-4 py-2 text-muted-foreground">{hp.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        </CollapsibleSection>
      )}

      {/* Quick Start section */}
      <CollapsibleSection
        id="quick-start"
        label="Quick Start"
        open={codeOpen}
        onToggle={() => setCodeOpen(v => !v)}
      >
        <CodeBlock code={model.quick_start} language="python" />
      </CollapsibleSection>
    </>
  );
}
