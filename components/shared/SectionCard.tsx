import { ReactNode } from 'react';

interface SectionCardProps {
  title: string;
  subtitle?: string;
  badge?: ReactNode;
  children: ReactNode;
}

export default function SectionCard({ title, subtitle, badge, children }: SectionCardProps) {
  return (
    <div className="bg-card text-card-foreground border border-border rounded-lg overflow-hidden shadow-sm">
      {/* Card Header section */}
      <div className="px-4 py-3 border-b border-border bg-muted/20 flex items-center justify-between select-none">
        <div>
          <h3 className="text-xs font-semibold tracking-tight text-foreground font-sans uppercase">
            {title}
          </h3>
          {subtitle && (
            <p className="text-[10px] text-muted-foreground mt-0.5 font-sans leading-normal">
              {subtitle}
            </p>
          )}
        </div>
        {badge && <div className="text-xs shrink-0">{badge}</div>}
      </div>

      {/* Content wrapper */}
      <div className="p-4 text-xs space-y-3 leading-relaxed">
        {children}
      </div>
    </div>
  );
}
