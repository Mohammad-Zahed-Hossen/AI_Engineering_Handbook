// components/shared/QuickSetupSection.tsx
import { CodeBlock } from '@/components/shared/CodeBlock';

interface QuickSetupSectionProps {
  install?: string;
  importAs?: string;
  importLanguage?: string;
}

export default function QuickSetupSection({ install, importAs, importLanguage = 'python' }: QuickSetupSectionProps) {
  if (!install && !importAs) return null;

  const showInstall = !!install;
  const showImport = !!importAs;

  return (
    <section id="setup" className="space-y-3 scroll-mt-24">
      <h2>Quick Setup</h2>
      <div className={showInstall && showImport ? "grid grid-cols-1 md:grid-cols-2 gap-4" : "space-y-4"}>
        {showInstall && (
          <div>
            <h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
              Install
            </h3>
            <CodeBlock code={install} language="bash" />
          </div>
        )}
        {showImport && (
          <div>
            <h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
              Import
            </h3>
            <CodeBlock code={importAs} language={importLanguage} />
          </div>
        )}
      </div>
    </section>
  );
}