'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export interface VisualizationEquivalent {
  package: string;
  task: string;
  reason: string;
}

interface VisualizationEquivalentsProps {
  equivalents: VisualizationEquivalent[];
  currentPackageId: string;
}

const VIS_PACKAGES = [
  { id: 'matplotlib', name: 'Matplotlib' },
  { id: 'seaborn', name: 'Seaborn' },
  { id: 'plotly-express', name: 'Plotly Express' },
];

function slugify(value: string) {
  return value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

export default function VisualizationEquivalents({ equivalents, currentPackageId }: VisualizationEquivalentsProps) {
  const normalizedCurrentId = currentPackageId.toLowerCase().trim();

  // If there are no equivalents, or the current package is not one of the visualization libraries, hide
  if (!equivalents.length || !VIS_PACKAGES.some(p => p.id === normalizedCurrentId)) {
    return null;
  }

  // Filter out the current package and get the equivalents for the other libraries
  const itemsToRender = VIS_PACKAGES
    .filter(pkg => pkg.id !== normalizedCurrentId)
    .map(pkg => {
      const eq = equivalents.find(item => item.package.toLowerCase().trim() === pkg.id);
      if (eq) {
        return { pkg, eq };
      }
      return null;
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);

  if (itemsToRender.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5 select-none">
        <span className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-border bg-background text-[9px] font-mono">⇄</span>
        Visualization Equivalents
      </h4>
      <div className="flex flex-col sm:flex-row flex-wrap gap-2">
        {itemsToRender.map(({ pkg, eq }) => {
          const targetHref = `/packages/${pkg.id}#${slugify(eq.task)}`;
          return (
            <Link
              key={pkg.id}
              href={targetHref}
              aria-label={`View ${pkg.name} equivalent: ${eq.task}`}
              className="inline-flex items-center justify-between gap-x-2.5 px-3 py-2.5 rounded-lg text-xs font-semibold text-primary bg-primary/5 hover:bg-primary/10 border border-primary/10 hover:border-primary/20 transition-all cursor-pointer select-none group min-w-0 w-full sm:w-auto"
            >
              <div className="flex items-center gap-x-2.5 min-w-0 flex-1">
                <span className="font-mono text-[9px] border border-primary/20 rounded px-1.5 py-0.5 bg-primary/10 uppercase tracking-wider shrink-0">
                  {pkg.name}
                </span>
                <span className="font-bold text-foreground/90 truncate">
                  {eq.task}
                </span>
                {eq.reason && (
                  <span className="text-[11px] text-muted-foreground font-normal border-l border-primary/20 pl-2 truncate hidden md:inline">
                    {eq.reason}
                  </span>
                )}
              </div>
              <ArrowRight className="w-3.5 h-3.5 shrink-0 transition-transform group-hover:translate-x-0.5 ml-2" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}




