'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, ChevronRight, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { NavItem } from '@/lib/data';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';

const MAX_VISIBLE_ITEMS = 12;

function applyItemLimit<T extends { id: string }>(
  items: T[],
  activeId: string | null,
  max: number
): { visible: T[]; truncated: boolean; total: number } {
  if (items.length <= max) {
    return { visible: items, truncated: false, total: items.length };
  }
  const activeIndex = items.findIndex(item => item.id === activeId);
  let visible = items.slice(0, max);
  if (activeIndex >= max) {
    visible = [...items.slice(0, max - 1), items[activeIndex]];
  }
  return { visible, truncated: true, total: items.length };
}

interface MobileSidebarTriggerProps {
  packages: NavItem[];
  mlModels: NavItem[];
  dlModels: NavItem[];
  llmModels: NavItem[];
  registry: NavItem[];
  workflows: NavItem[];
  cheatsheets: NavItem[];
  patterns: NavItem[];
  debugGuides: NavItem[];
  decisionGuides: NavItem[];
  principles: NavItem[];
}

export default function MobileSidebarTrigger({
  packages,
  mlModels,
  dlModels,
  llmModels,
  registry,
  workflows,
  cheatsheets,
  patterns,
  debugGuides,
  decisionGuides,
  principles,
}: MobileSidebarTriggerProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const getActiveId = (pathname: string): string | null => {
    const parts = pathname.split('/').filter(Boolean);
    if (pathname.startsWith('/packages/') && parts[1]) return parts[1];
    if (pathname.startsWith('/models/ml/') && parts[2]) return parts[2];
    if (pathname.startsWith('/models/dl/') && parts[2]) return parts[2];
    if (pathname.startsWith('/models/llm/') && parts[2]) return parts[2];
    if (pathname.startsWith('/registry/') && parts[1]) return parts[1];
    if (pathname.startsWith('/workflows/') && parts[1]) return parts[1];
    if (pathname.startsWith('/cheatsheets/') && parts[1]) return parts[1];
    if (pathname.startsWith('/patterns/') && parts[1]) return parts[1];
    if (pathname.startsWith('/debug-guides/') && parts[1]) return parts[1];
    if (pathname.startsWith('/decision-guides/') && parts[1]) return parts[1];
    if (pathname.startsWith('/principles/') && parts[1]) return parts[1];
    return null;
  };

  const getActiveSection = (pathname: string): string => {
    if (pathname.startsWith('/packages')) return 'packages';
    if (pathname.startsWith('/models/ml')) return 'ml';
    if (pathname.startsWith('/models/dl')) return 'dl';
    if (pathname.startsWith('/models/llm')) return 'llm';
    if (pathname.startsWith('/registry')) return 'registry';
    if (pathname.startsWith('/workflows')) return 'workflows';
    if (pathname.startsWith('/cheatsheets')) return 'cheatsheets';
    if (pathname.startsWith('/patterns')) return 'patterns';
    if (pathname.startsWith('/debug-guides')) return 'debug_guides';
    if (pathname.startsWith('/decision-guides')) return 'decision_guides';
    if (pathname.startsWith('/principles')) return 'principles';
    return '';
  };

  const [expandedOverride, setExpandedOverride] = useState<{ pathname: string; section: string } | null>(null);
  const expanded = expandedOverride?.pathname === pathname
    ? expandedOverride.section
    : getActiveSection(pathname);

  const toggleSection = (section: string) => {
    setExpandedOverride({
      pathname,
      section: expanded === section ? '' : section,
    });
  };

  const linkClass = (href: string) => {
    const active = pathname === href;
    return cn(
      "flex min-h-11 items-center px-2.5 py-2 rounded text-xs font-mono leading-normal transition-none select-none",
      active
        ? "bg-primary text-primary-foreground font-semibold"
        : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
    );
  };

  const sectionHeadingClass = "px-2.5 mt-3 mb-1 min-h-11 text-[10px] uppercase font-bold text-foreground/50 tracking-wider select-none flex items-center gap-1.5 cursor-pointer hover:text-foreground/70";

  const renderSectionHeader = (title: string, count: number, section: string, href: string) => (
    <div className={sectionHeadingClass}>
      {/* Chevron toggle — expands/collapses; does NOT navigate */}
      <span
        onClick={() => toggleSection(section)}
        className="flex h-11 w-8 items-center justify-center -ml-2 cursor-pointer"
        aria-label={`Toggle ${title}`}
      >
        {expanded === section ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
      </span>
      {/* Title — navigates to list page; does NOT toggle */}
      <Link
        href={href}
        className="flex min-h-11 flex-1 items-center hover:text-foreground/90 transition-none"
        onClick={e => e.stopPropagation()}
      >
        {title}
      </Link>
      <span className="ml-auto text-[8px] bg-muted px-1 rounded text-muted-foreground">{count}</span>
    </div>
  );

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          aria-label="Open navigation menu"
          className="flex items-center justify-center w-11 h-11 rounded-md text-foreground hover:bg-muted transition-colors touch-target"
        >
          <Menu className="w-5 h-5" />
        </button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[min(84vw,320px)] p-0 bg-sidebar text-sidebar-foreground overflow-y-auto border-r border-sidebar-border">
        <SheetHeader className="sr-only">
          <SheetTitle>Navigation Menu</SheetTitle>
        </SheetHeader>
        
        {/* Brand */}
        <div className="p-4 border-b border-sidebar-border flex items-center justify-between">
          <Link 
            href="/" 
            className="flex min-h-11 items-center font-bold tracking-tight text-xs text-foreground uppercase"
            onClick={() => setOpen(false)}
          >
            AI Engineering
          </Link>
        </div>

        {/* Navigation list */}
        <nav className="p-2 space-y-1">
          {/* Home Link */}
          <Link href="/" className={linkClass('/')} onClick={() => setOpen(false)}>
            Dashboard
          </Link>

          {/* Problem Index */}
          <Link href="/problem-index" className={linkClass('/problem-index')} onClick={() => setOpen(false)}>
            Problem Index
          </Link>

          {/* Python Packages */}
          {renderSectionHeader('Packages', packages.length, 'packages', '/packages')}
          {expanded === 'packages' && (
            <ul className="space-y-0.5">
              {(() => {
                const { visible, truncated, total } = applyItemLimit(packages, getActiveId(pathname), MAX_VISIBLE_ITEMS);
                return (
                  <>
                    {visible.map((pkg) => (
                      <li key={pkg.id}>
                        <Link
                          href={`/packages/${pkg.id}`}
                          className={linkClass(`/packages/${pkg.id}`)}
                          onClick={() => setOpen(false)}
                        >
                          {pkg.name} <span className="text-[9px] opacity-75">v{pkg.version}</span>
                        </Link>
                      </li>
                    ))}
                    {truncated && (
                      <li>
                        <Link
                          href="/packages"
                          className="flex min-h-11 items-center px-2.5 py-2 rounded text-[10px] font-mono text-muted-foreground/70 hover:text-foreground hover:bg-secondary/40 transition-none select-none"
                          onClick={() => setOpen(false)}
                        >
                          See all {total} →
                        </Link>
                      </li>
                    )}
                  </>
                );
              })()}
            </ul>
          )}

          {/* Models Library */}
          <Link href="/models" className={sectionHeadingClass}>
            Models Library
          </Link>

          <div className="pl-2.5 mt-1.5 text-[10px] font-semibold text-muted-foreground uppercase flex items-center gap-1.5">
            <span className="flex h-11 w-8 items-center justify-center -ml-2 cursor-pointer hover:text-foreground/70" onClick={() => toggleSection('ml')}>
              {expanded === 'ml' ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
            </span>
            <Link href="/models/ml" className="flex min-h-11 flex-1 items-center hover:text-foreground/90 transition-none" onClick={e => e.stopPropagation()}>
              Machine Learning
            </Link>
            <span className="ml-auto text-[8px] bg-muted px-1 rounded text-muted-foreground">{mlModels.length}</span>
          </div>
          {expanded === 'ml' && (
            <ul className="space-y-0.5 pl-2 border-l border-sidebar-border ml-2.5">
              {(() => {
                const { visible, truncated, total } = applyItemLimit(mlModels, getActiveId(pathname), MAX_VISIBLE_ITEMS);
                return (
                  <>
                    {visible.map((m) => (
                      <li key={m.id}>
                        <Link
                          href={`/models/ml/${m.id}`}
                          className={linkClass(`/models/ml/${m.id}`)}
                          onClick={() => setOpen(false)}
                        >
                          {m.name}
                        </Link>
                      </li>
                    ))}
                    {truncated && (
                      <li>
                        <Link
                          href="/models/ml"
                          className="flex min-h-11 items-center px-2.5 py-2 rounded text-[10px] font-mono text-muted-foreground/70 hover:text-foreground hover:bg-secondary/40 transition-none select-none"
                          onClick={() => setOpen(false)}
                        >
                          See all {total} →
                        </Link>
                      </li>
                    )}
                  </>
                );
              })()}
            </ul>
          )}

          <div className="pl-2.5 mt-2.5 text-[10px] font-semibold text-muted-foreground uppercase flex items-center gap-1.5">
            <span className="flex h-11 w-8 items-center justify-center -ml-2 cursor-pointer hover:text-foreground/70" onClick={() => toggleSection('dl')}>
              {expanded === 'dl' ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
            </span>
            <Link href="/models/dl" className="flex min-h-11 flex-1 items-center hover:text-foreground/90 transition-none" onClick={e => e.stopPropagation()}>
              Deep Learning
            </Link>
            <span className="ml-auto text-[8px] bg-muted px-1 rounded text-muted-foreground">{dlModels.length}</span>
          </div>
          {expanded === 'dl' && (
            <ul className="space-y-0.5 pl-2 border-l border-sidebar-border ml-2.5">
              {(() => {
                const { visible, truncated, total } = applyItemLimit(dlModels, getActiveId(pathname), MAX_VISIBLE_ITEMS);
                return (
                  <>
                    {visible.map((m) => (
                      <li key={m.id}>
                        <Link
                          href={`/models/dl/${m.id}`}
                          className={linkClass(`/models/dl/${m.id}`)}
                          onClick={() => setOpen(false)}
                        >
                          {m.name}
                        </Link>
                      </li>
                    ))}
                    {truncated && (
                      <li>
                        <Link
                          href="/models/dl"
                          className="flex min-h-11 items-center px-2.5 py-2 rounded text-[10px] font-mono text-muted-foreground/70 hover:text-foreground hover:bg-secondary/40 transition-none select-none"
                          onClick={() => setOpen(false)}
                        >
                          See all {total} →
                        </Link>
                      </li>
                    )}
                  </>
                );
              })()}
            </ul>
          )}

          <div className="pl-2.5 mt-2.5 text-[10px] font-semibold text-muted-foreground uppercase flex items-center gap-1.5">
            <span className="flex h-11 w-8 items-center justify-center -ml-2 cursor-pointer hover:text-foreground/70" onClick={() => toggleSection('llm')}>
              {expanded === 'llm' ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
            </span>
            <Link href="/models/llm" className="flex min-h-11 flex-1 items-center hover:text-foreground/90 transition-none" onClick={e => e.stopPropagation()}>
              Large Language Models
            </Link>
            <span className="ml-auto text-[8px] bg-muted px-1 rounded text-muted-foreground">{llmModels.length}</span>
          </div>
          {expanded === 'llm' && (
            <ul className="space-y-0.5 pl-2 border-l border-sidebar-border ml-2.5">
              {(() => {
                const { visible, truncated, total } = applyItemLimit(llmModels, getActiveId(pathname), MAX_VISIBLE_ITEMS);
                return (
                  <>
                    {visible.map((m) => (
                      <li key={m.id}>
                        <Link
                          href={`/models/llm/${m.id}`}
                          className={linkClass(`/models/llm/${m.id}`)}
                          onClick={() => setOpen(false)}
                        >
                          {m.name}
                        </Link>
                      </li>
                    ))}
                    {truncated && (
                      <li>
                        <Link
                          href="/models/llm"
                          className="flex min-h-11 items-center px-2.5 py-2 rounded text-[10px] font-mono text-muted-foreground/70 hover:text-foreground hover:bg-secondary/40 transition-none select-none"
                          onClick={() => setOpen(false)}
                        >
                          See all {total} →
                        </Link>
                      </li>
                    )}
                  </>
                );
              })()}
            </ul>
          )}

          {/* Model Registry */}
          {renderSectionHeader('Model Registry', registry.length, 'registry', '/registry')}
          {expanded === 'registry' && (
            <ul className="space-y-0.5">
              {(() => {
                const { visible, truncated, total } = applyItemLimit(registry, getActiveId(pathname), MAX_VISIBLE_ITEMS);
                return (
                  <>
                    {visible.map((r) => (
                      <li key={r.id}>
                        <Link
                          href={`/registry/families/${r.id}`}
                          className={linkClass(`/registry/families/${r.id}`)}
                          onClick={() => setOpen(false)}
                        >
                          {r.name}
                        </Link>
                      </li>
                    ))}
                    {truncated && (
                      <li>
                        <Link
                          href="/registry"
                          className="flex min-h-11 items-center px-2.5 py-2 rounded text-[10px] font-mono text-muted-foreground/70 hover:text-foreground hover:bg-secondary/40 transition-none select-none"
                          onClick={() => setOpen(false)}
                        >
                          See all {total} →
                        </Link>
                      </li>
                    )}
                  </>
                );
              })()}
            </ul>
          )}

          {/* Workflows */}
          {renderSectionHeader('Workflows', workflows.length, 'workflows', '/workflows')}
          {expanded === 'workflows' && (
            <ul className="space-y-0.5">
              {(() => {
                const { visible, truncated, total } = applyItemLimit(workflows, getActiveId(pathname), MAX_VISIBLE_ITEMS);
                return (
                  <>
                    {visible.map((wf) => (
                      <li key={wf.id}>
                        <Link
                          href={`/workflows/${wf.id}`}
                          className={linkClass(`/workflows/${wf.id}`)}
                          onClick={() => setOpen(false)}
                        >
                          {wf.name}
                        </Link>
                      </li>
                    ))}
                    {truncated && (
                      <li>
                        <Link
                          href="/workflows"
                          className="flex min-h-11 items-center px-2.5 py-2 rounded text-[10px] font-mono text-muted-foreground/70 hover:text-foreground hover:bg-secondary/40 transition-none select-none"
                          onClick={() => setOpen(false)}
                        >
                          See all {total} →
                        </Link>
                      </li>
                    )}
                  </>
                );
              })()}
            </ul>
          )}

          {/* Cheatsheets */}
          {renderSectionHeader('Cheatsheets', cheatsheets.length, 'cheatsheets', '/cheatsheets')}
          {expanded === 'cheatsheets' && (
            <ul className="space-y-0.5">
              {(() => {
                const { visible, truncated, total } = applyItemLimit(cheatsheets, getActiveId(pathname), MAX_VISIBLE_ITEMS);
                return (
                  <>
                    {visible.map((cs) => (
                      <li key={cs.id}>
                        <Link
                          href={`/cheatsheets/${cs.id}`}
                          className={linkClass(`/cheatsheets/${cs.id}`)}
                          onClick={() => setOpen(false)}
                        >
                          {cs.name}
                        </Link>
                      </li>
                    ))}
                    {truncated && (
                      <li>
                        <Link
                          href="/cheatsheets"
                          className="flex min-h-11 items-center px-2.5 py-2 rounded text-[10px] font-mono text-muted-foreground/70 hover:text-foreground hover:bg-secondary/40 transition-none select-none"
                          onClick={() => setOpen(false)}
                        >
                          See all {total} →
                        </Link>
                      </li>
                    )}
                  </>
                );
              })()}
            </ul>
          )}

          {/* Patterns */}
          {renderSectionHeader('Patterns', patterns.length, 'patterns', '/patterns')}
          {expanded === 'patterns' && (
            <ul className="space-y-0.5">
              {(() => {
                const { visible, truncated, total } = applyItemLimit(patterns, getActiveId(pathname), MAX_VISIBLE_ITEMS);
                return (
                  <>
                    {visible.map((p) => (
                      <li key={p.id}>
                        <Link
                          href={`/patterns/${p.id}`}
                          className={linkClass(`/patterns/${p.id}`)}
                          onClick={() => setOpen(false)}
                        >
                          {p.name}
                        </Link>
                      </li>
                    ))}
                    {truncated && (
                      <li>
                        <Link
                          href="/patterns"
                          className="flex min-h-11 items-center px-2.5 py-2 rounded text-[10px] font-mono text-muted-foreground/70 hover:text-foreground hover:bg-secondary/40 transition-none select-none"
                          onClick={() => setOpen(false)}
                        >
                          See all {total} →
                        </Link>
                      </li>
                    )}
                  </>
                );
              })()}
            </ul>
          )}

          {/* Debug Guides */}
          {renderSectionHeader('Debug Guides', debugGuides.length, 'debug_guides', '/debug-guides')}
          {expanded === 'debug_guides' && (
            <ul className="space-y-0.5">
              {(() => {
                const { visible, truncated, total } = applyItemLimit(debugGuides, getActiveId(pathname), MAX_VISIBLE_ITEMS);
                return (
                  <>
                    {visible.map((dg) => (
                      <li key={dg.id}>
                        <Link
                          href={`/debug-guides/${dg.id}`}
                          className={linkClass(`/debug-guides/${dg.id}`)}
                          onClick={() => setOpen(false)}
                        >
                          {dg.name}
                        </Link>
                      </li>
                    ))}
                    {truncated && (
                      <li>
                        <Link
                          href="/debug-guides"
                          className="flex min-h-11 items-center px-2.5 py-2 rounded text-[10px] font-mono text-muted-foreground/70 hover:text-foreground hover:bg-secondary/40 transition-none select-none"
                          onClick={() => setOpen(false)}
                        >
                          See all {total} →
                        </Link>
                      </li>
                    )}
                  </>
                );
              })()}
            </ul>
          )}

          {/* Decision Guides */}
          {renderSectionHeader('Decision Guides', decisionGuides.length, 'decision_guides', '/decision-guides')}
          {expanded === 'decision_guides' && (
            <ul className="space-y-0.5">
              {(() => {
                const { visible, truncated, total } = applyItemLimit(decisionGuides, getActiveId(pathname), MAX_VISIBLE_ITEMS);
                return (
                  <>
                    {visible.map((dg) => (
                      <li key={dg.id}>
                        <Link
                          href={`/decision-guides/${dg.id}`}
                          className={linkClass(`/decision-guides/${dg.id}`)}
                          onClick={() => setOpen(false)}
                        >
                          {dg.name}
                        </Link>
                      </li>
                    ))}
                    {truncated && (
                      <li>
                        <Link
                          href="/decision-guides"
                          className="flex min-h-11 items-center px-2.5 py-2 rounded text-[10px] font-mono text-muted-foreground/70 hover:text-foreground hover:bg-secondary/40 transition-none select-none"
                          onClick={() => setOpen(false)}
                        >
                          See all {total} →
                        </Link>
                      </li>
                    )}
                  </>
                );
              })()}
            </ul>
          )}

          {/* Principles */}
          {renderSectionHeader('Principles', principles.length, 'principles', '/principles')}
          {expanded === 'principles' && (
            <ul className="space-y-0.5">
              {(() => {
                const { visible, truncated, total } = applyItemLimit(principles, getActiveId(pathname), MAX_VISIBLE_ITEMS);
                return (
                  <>
                    {visible.map((p) => (
                      <li key={p.id}>
                        <Link
                          href={`/principles/${p.id}`}
                          className={linkClass(`/principles/${p.id}`)}
                          onClick={() => setOpen(false)}
                        >
                          {p.name}
                        </Link>
                      </li>
                    ))}
                    {truncated && (
                      <li>
                        <Link
                          href="/principles"
                          className="flex min-h-11 items-center px-2.5 py-2 rounded text-[10px] font-mono text-muted-foreground/70 hover:text-foreground hover:bg-secondary/40 transition-none select-none"
                          onClick={() => setOpen(false)}
                        >
                          See all {total} →
                        </Link>
                      </li>
                    )}
                  </>
                );
              })()}
            </ul>
          )}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
