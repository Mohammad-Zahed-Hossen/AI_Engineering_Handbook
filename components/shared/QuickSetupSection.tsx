// components/shared/QuickSetupSection.tsx
import { CodeBlock } from '@/components/shared/CodeBlock';

interface QuickSetupSectionProps {
  install: string;
  importAs: string;
}

export default function QuickSetupSection({ install, importAs }: QuickSetupSectionProps) {
  return (
    <section id="setup" className="space-y-3 scroll-mt-24">
      <h2>Quick Setup</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
            Install
          </h3>
          <CodeBlock code={install} language="bash" />
        </div>
        <div>
          <h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
            Import
          </h3>
          <CodeBlock code={importAs} language="python" />
        </div>
      </div>
    </section>
  );
}