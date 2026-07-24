import { getPackageNavItems, getModelNavItems, getWorkflowNavItems, getCheatsheetNavItems, getPatternNavItems, getDecisionGuideNavItems } from '@/lib/data';
import { rankItems, loadRecentSearches } from '@/lib/command-palette';
import SearchBoxWrapper from '@/components/shared/SearchBoxWrapper';

export default function CommandPalettePage() {
  const packages = getPackageNavItems();
  const models = getModelNavItems('ml');
  const workflows = getWorkflowNavItems();
  const cheatsheets = getCheatsheetNavItems();
  const patterns = getPatternNavItems();
  const decisionGuides = getDecisionGuideNavItems();

  const recent = loadRecentSearches();

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold text-foreground mb-2">Command Palette</h1>
      <p className="text-sm text-muted-foreground mb-6">
        Quick navigation across AENS. Use <kbd className="font-mono text-[10px] border border-border rounded px-1 py-0.5">Ctrl+K</kbd> or <kbd className="font-mono text-[10px] border border-border rounded px-1 py-0.5">/</kbd> to focus.
      </p>

      <div className="mb-8">
        <SearchBoxWrapper compact />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <section className="space-y-2">
          <h2 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Open Packages</h2>
          <ul className="space-y-1">
            {rankItems(packages.map(p => ({ id: p.id, label: p.name, description: p.version, href: `/packages/${p.id}`, type: 'package' }))).slice(0, 8).map(item => (
              <li key={item.id}>
                <a href={item.href} className="block rounded border border-border bg-muted/30 px-3 py-2 text-xs hover:bg-muted transition-colors">
                  <span className="font-medium">{item.label}</span>
                  <span className="text-[10px] text-muted-foreground ml-2">{item.description}</span>
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Open Cheatsheets</h2>
          <ul className="space-y-1">
            {rankItems(cheatsheets.map(c => ({ id: c.id, label: c.name, href: `/cheatsheets/${c.id}`, type: 'cheatsheet' }))).slice(0, 8).map(item => (
              <li key={item.id}>
                <a href={item.href} className="block rounded border border-border bg-muted/30 px-3 py-2 text-xs hover:bg-muted transition-colors">
                  <span className="font-medium">{item.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Open Models</h2>
          <ul className="space-y-1">
            {models.slice(0, 8).map(m => (
              <li key={m.id}>
                <a href={`/models/ml/${m.id}`} className="block rounded border border-border bg-muted/30 px-3 py-2 text-xs hover:bg-muted transition-colors">
                  <span className="font-medium">{m.name}</span>
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Open Workflows</h2>
          <ul className="space-y-1">
            {rankItems(workflows.map(w => ({ id: w.id, label: w.name, href: `/workflows/${w.id}`, type: 'workflow' }))).slice(0, 8).map(item => (
              <li key={item.id}>
                <a href={item.href} className="block rounded border border-border bg-muted/30 px-3 py-2 text-xs hover:bg-muted transition-colors">
                  <span className="font-medium">{item.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Open Patterns</h2>
          <ul className="space-y-1">
            {patterns.slice(0, 8).map(p => (
              <li key={p.id}>
                <a href={`/patterns/${p.id}`} className="block rounded border border-border bg-muted/30 px-3 py-2 text-xs hover:bg-muted transition-colors">
                  <span className="font-medium">{p.name}</span>
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Open Decision Guides</h2>
          <ul className="space-y-1">
            {decisionGuides.slice(0, 8).map(d => (
              <li key={d.id}>
                <a href={`/decision-guides/${d.id}`} className="block rounded border border-border bg-muted/30 px-3 py-2 text-xs hover:bg-muted transition-colors">
                  <span className="font-medium">{d.name}</span>
                </a>
              </li>
            ))}
          </ul>
        </section>

        {recent.length > 0 && (
          <section className="space-y-2 sm:col-span-2">
            <h2 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Recent Searches</h2>
            <ul className="space-y-1">
              {recent.map(term => (
                <li key={term}>
                  <a href={`/search?q=${encodeURIComponent(term)}`} className="block rounded border border-border bg-muted/30 px-3 py-2 text-xs hover:bg-muted transition-colors">
                    <span className="font-medium">{term}</span>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}