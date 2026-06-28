'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { NavItem } from '@/lib/data';

const MAX_VISIBLE_ITEMS = 12;
const ALPHA_GROUP_THRESHOLD = 30;

function groupByFirstLetter<T extends { id: string; name: string }>(items: T[]): Map<string, T[]> {
  const groups = new Map<string, T[]>();
  for (const item of items) {
    const letter = item.name.charAt(0).toUpperCase();
    if (!groups.has(letter)) {
      groups.set(letter, []);
    }
    groups.get(letter)!.push(item);
  }
  return groups;
}

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
  // If active item exists but is outside the cap, replace the last visible
  // item with the active item so it is always shown.
  if (activeIndex >= max) {
    visible = [...items.slice(0, max - 1), items[activeIndex]];
  }
  return { visible, truncated: true, total: items.length };
}

const REGISTRY_TASK_LABELS: Record<string, string> = {
  embedding: 'Embeddings',
  reranker: 'Rerankers',
  vision: 'Vision',
  speech: 'Speech',
  llm: 'LLMs',
  multimodal: 'Multimodal',
  ocr: 'OCR',
};

interface SidebarProps {
  packages: NavItem[];
  mlModels: NavItem[];
  dlModels: NavItem[];
  llmModels: NavItem[];
  registryTasks: string[];
  workflows: NavItem[];
  cheatsheets: NavItem[];
}

export default function Sidebar({
  packages,
  mlModels,
  dlModels,
  llmModels,
  registryTasks,
  workflows,
  cheatsheets,
}: SidebarProps) {
  const pathname = usePathname();
  const sidebarRef = useRef<HTMLElement>(null);

  const getActiveId = (pathname: string): string | null => {
    const parts = pathname.split('/').filter(Boolean);
    if (pathname.startsWith('/packages/') && parts[1]) return parts[1];
    if (pathname.startsWith('/models/ml/') && parts[2]) return parts[2];
    if (pathname.startsWith('/models/dl/') && parts[2]) return parts[2];
    if (pathname.startsWith('/models/llm/') && parts[2]) return parts[2];
    if (pathname.startsWith('/registry/') && parts[1]) return parts[1];
    if (pathname.startsWith('/workflows/') && parts[1]) return parts[1];
    if (pathname.startsWith('/cheatsheets/') && parts[1]) return parts[1];
    return null;
  };

  function applyItemLimitForStrings(
    items: string[],
    activeId: string | null,
    max: number
  ): { visible: string[]; truncated: boolean; total: number } {
    if (items.length <= max) {
      return { visible: items, truncated: false, total: items.length };
    }
    const activeIndex = items.findIndex(item => item === activeId);
    let visible = items.slice(0, max);
    if (activeIndex >= max) {
      visible = [...items.slice(0, max - 1), items[activeIndex]];
    }
    return { visible, truncated: true, total: items.length };
  }

  useEffect(() => {
    if (!sidebarRef.current) return;
    // Small delay to allow the expand animation to render the active item
    const timer = setTimeout(() => {
      const active = sidebarRef.current?.querySelector('[class*="bg-primary"]');
      active?.scrollIntoView({ block: 'nearest', behavior: 'instant' });
    }, 50);
    return () => clearTimeout(timer);
  }, [pathname]);

  const getActiveSection = (pathname: string): string => {
    if (pathname.startsWith('/packages')) return 'packages';
    if (pathname.startsWith('/models/ml')) return 'ml';
    if (pathname.startsWith('/models/dl')) return 'dl';
    if (pathname.startsWith('/models/llm')) return 'llm';
    if (pathname.startsWith('/registry')) return 'registry';
    if (pathname.startsWith('/workflows')) return 'workflows';
    if (pathname.startsWith('/cheatsheets')) return 'cheatsheets';
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
      "block py-1 px-2.5 rounded text-[11px] font-mono leading-normal transition-none select-none",
      active
        ? "bg-primary text-primary-foreground font-semibold"
        : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
    );
  };

  const sectionHeadingClass = "px-2.5 mt-4 mb-1 text-[9px] uppercase font-bold text-foreground/50 tracking-wider select-none flex items-center gap-1.5 cursor-pointer hover:text-foreground/70";

  const renderGroupedItems = <T extends { id: string; name: string }>(
    items: T[],
    activeId: string | null,
    linkHref: (item: T) => string,
    linkClass: (href: string) => string
  ) => {
    const groups = groupByFirstLetter(items);
    const groupEntries = Array.from(groups.entries()).sort(([a], [b]) => a.localeCompare(b));

    return (
      <>
        {groupEntries.map(([letter, groupItems]) => (
          <div key={letter}>
            <div className="px-2.5 mt-2 mb-0.5 text-[8px] font-bold text-muted-foreground/50 uppercase">
              {letter}
            </div>
            {(() => {
              const { visible, truncated, total } = applyItemLimit(groupItems, activeId, MAX_VISIBLE_ITEMS);
              return (
                <>
                  {visible.map((item) => (
                    <li key={item.id}>
                      <Link href={linkHref(item)} className={linkClass(linkHref(item))}>
                        {item.name}
                      </Link>
                    </li>
                  ))}
                  {truncated && (
                    <li>
                      <span className="block py-1 px-2.5 rounded text-[10px] font-mono text-muted-foreground/50">
                        +{total - MAX_VISIBLE_ITEMS} more
                      </span>
                    </li>
                  )}
                </>
              );
            })()}
          </div>
        ))}
      </>
    );
  };

  const renderSectionHeader = (title: string, count: number, section: string, href: string) => (
    <div className={sectionHeadingClass}>
      {/* Chevron toggle — expands/collapses; does NOT navigate */}
      <span
        onClick={() => toggleSection(section)}
        className="flex items-center cursor-pointer"
        aria-label={`Toggle ${title}`}
      >
        {expanded === section ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
      </span>
      {/* Title — navigates to list page; does NOT toggle */}
      <Link
        href={href}
        className="flex-1 hover:text-foreground/90 transition-none"
        onClick={e => e.stopPropagation()}
      >
        {title}
      </Link>
      <span className="ml-auto text-[8px] bg-muted px-1 rounded text-muted-foreground">{count}</span>
    </div>
  );

  return (
    <aside ref={sidebarRef} className="w-64 bg-sidebar text-sidebar-foreground border-r border-sidebar-border flex flex-col h-full overflow-y-auto select-none">
      {/* Brand */}
      <div className="p-4 border-b border-sidebar-border flex items-center justify-between">
        <Link href="/" className="font-bold tracking-tight text-xs text-foreground uppercase">
          AI Engineering
        </Link>
      </div>

      {/* Navigation list */}
      <nav className="flex-1 p-2 space-y-1">
        {/* Home Link */}
        <Link href="/" className={linkClass('/')}>
          Dashboard
        </Link>

        {/* Python Packages */}
        {renderSectionHeader('Packages', packages.length, 'packages', '/packages')}
        {expanded === 'packages' && (
          <ul className="space-y-0.5">
            {packages.length >= ALPHA_GROUP_THRESHOLD ? (
              renderGroupedItems(packages, getActiveId(pathname), (pkg) => `/packages/${pkg.id}`, linkClass)
            ) : (
              (() => {
                const { visible, truncated, total } = applyItemLimit(packages, getActiveId(pathname), MAX_VISIBLE_ITEMS);
                return (
                  <>
                    {visible.map((pkg) => (
                      <li key={pkg.id}>
                        <Link href={`/packages/${pkg.id}`} className={linkClass(`/packages/${pkg.id}`)}>
                          {pkg.name} <span className="text-[9px] opacity-75">v{pkg.version}</span>
                        </Link>
                      </li>
                    ))}
                    {truncated && (
                      <li>
                        <Link
                          href="/packages"
                          className="block py-1 px-2.5 rounded text-[10px] font-mono text-muted-foreground/70 hover:text-foreground hover:bg-secondary/40 transition-none select-none"
                        >
                          See all {total} →
                        </Link>
                      </li>
                    )}
                  </>
                );
              })()
            )}
          </ul>
        )}

        {/* Models Library */}
        {(mlModels.length > 0 || dlModels.length > 0 || llmModels.length > 0) && (
          <>
            <Link href="/models" className={sectionHeadingClass}>
              Models Library
            </Link>

            {mlModels.length > 0 && (
              <>
                <div className="pl-2.5 mt-1.5 text-[9px] font-semibold text-muted-foreground uppercase flex items-center gap-1.5">
                  <span className="flex items-center cursor-pointer hover:text-foreground/70" onClick={() => toggleSection('ml')}>
                    {expanded === 'ml' ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                  </span>
                  <Link href="/models/ml" className="flex-1 hover:text-foreground/90 transition-none" onClick={e => e.stopPropagation()}>
                    Machine Learning
                  </Link>
                  <span className="ml-auto text-[8px] bg-muted px-1 rounded text-muted-foreground">{mlModels.length}</span>
                </div>
                {expanded === 'ml' && (
                  <ul className="space-y-0.5 pl-2 border-l border-sidebar-border ml-2.5">
                    {mlModels.length >= ALPHA_GROUP_THRESHOLD ? (
                      renderGroupedItems(mlModels, getActiveId(pathname), (m) => `/models/ml/${m.id}`, linkClass)
                    ) : (
                      (() => {
                        const { visible, truncated, total } = applyItemLimit(mlModels, getActiveId(pathname), MAX_VISIBLE_ITEMS);
                        return (
                          <>
                            {visible.map((m) => (
                              <li key={m.id}>
                                <Link href={`/models/ml/${m.id}`} className={linkClass(`/models/ml/${m.id}`)}>
                                  {m.name}
                                </Link>
                              </li>
                            ))}
                            {truncated && (
                              <li>
                                <Link
                                  href="/models/ml"
                                  className="block py-1 px-2.5 rounded text-[10px] font-mono text-muted-foreground/70 hover:text-foreground hover:bg-secondary/40 transition-none select-none"
                                >
                                  See all {total} →
                                </Link>
                              </li>
                            )}
                          </>
                        );
                      })()
                    )}
                  </ul>
                )}
              </>
            )}

            {dlModels.length > 0 && (
              <>
                <div className="pl-2.5 mt-2.5 text-[9px] font-semibold text-muted-foreground uppercase flex items-center gap-1.5">
                  <span className="flex items-center cursor-pointer hover:text-foreground/70" onClick={() => toggleSection('dl')}>
                    {expanded === 'dl' ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                  </span>
                  <Link href="/models/dl" className="flex-1 hover:text-foreground/90 transition-none" onClick={e => e.stopPropagation()}>
                    Deep Learning
                  </Link>
                  <span className="ml-auto text-[8px] bg-muted px-1 rounded text-muted-foreground">{dlModels.length}</span>
                </div>
                {expanded === 'dl' && (
                  <ul className="space-y-0.5 pl-2 border-l border-sidebar-border ml-2.5">
                    {dlModels.length >= ALPHA_GROUP_THRESHOLD ? (
                      renderGroupedItems(dlModels, getActiveId(pathname), (m) => `/models/dl/${m.id}`, linkClass)
                    ) : (
                      (() => {
                        const { visible, truncated, total } = applyItemLimit(dlModels, getActiveId(pathname), MAX_VISIBLE_ITEMS);
                        return (
                          <>
                            {visible.map((m) => (
                              <li key={m.id}>
                                <Link href={`/models/dl/${m.id}`} className={linkClass(`/models/dl/${m.id}`)}>
                                  {m.name}
                                </Link>
                              </li>
                            ))}
                            {truncated && (
                              <li>
                                <Link
                                  href="/models/dl"
                                  className="block py-1 px-2.5 rounded text-[10px] font-mono text-muted-foreground/70 hover:text-foreground hover:bg-secondary/40 transition-none select-none"
                                >
                                  See all {total} →
                                </Link>
                              </li>
                            )}
                          </>
                        );
                      })()
                    )}
                  </ul>
                )}
              </>
            )}

            {llmModels.length > 0 && (
              <>
                <div className="pl-2.5 mt-2.5 text-[9px] font-semibold text-muted-foreground uppercase flex items-center gap-1.5">
                  <span className="flex items-center cursor-pointer hover:text-foreground/70" onClick={() => toggleSection('llm')}>
                    {expanded === 'llm' ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                  </span>
                  <Link href="/models/llm" className="flex-1 hover:text-foreground/90 transition-none" onClick={e => e.stopPropagation()}>
                    Large Language Models
                  </Link>
                  <span className="ml-auto text-[8px] bg-muted px-1 rounded text-muted-foreground">{llmModels.length}</span>
                </div>
                {expanded === 'llm' && (
                  <ul className="space-y-0.5 pl-2 border-l border-sidebar-border ml-2.5">
                    {llmModels.length >= ALPHA_GROUP_THRESHOLD ? (
                      renderGroupedItems(llmModels, getActiveId(pathname), (m) => `/models/llm/${m.id}`, linkClass)
                    ) : (
                      (() => {
                        const { visible, truncated, total } = applyItemLimit(llmModels, getActiveId(pathname), MAX_VISIBLE_ITEMS);
                        return (
                          <>
                            {visible.map((m) => (
                              <li key={m.id}>
                                <Link href={`/models/llm/${m.id}`} className={linkClass(`/models/llm/${m.id}`)}>
                                  {m.name}
                                </Link>
                              </li>
                            ))}
                            {truncated && (
                              <li>
                                <Link
                                  href="/models/llm"
                                  className="block py-1 px-2.5 rounded text-[10px] font-mono text-muted-foreground/70 hover:text-foreground hover:bg-secondary/40 transition-none select-none"
                                >
                                  See all {total} →
                                </Link>
                              </li>
                            )}
                          </>
                        );
                      })()
                    )}
                  </ul>
                )}
              </>
            )}
          </>
        )}

        {/* Model Registries */}
        {renderSectionHeader('Registries', registryTasks.length, 'registry', '/registry')}
        {expanded === 'registry' && (
          <ul className="space-y-0.5">
            {(() => {
              const { visible, truncated, total } = applyItemLimitForStrings(registryTasks, getActiveId(pathname), MAX_VISIBLE_ITEMS);
              return (
                <>
                  {visible.map((task) => (
                    <li key={task}>
                      <Link href={`/registry/${task}`} className={linkClass(`/registry/${task}`)}>
                        {REGISTRY_TASK_LABELS[task] ?? task}
                      </Link>
                    </li>
                  ))}
                  {truncated && (
                    <li>
                      <Link
                        href="/registry"
                        className="block py-1 px-2.5 rounded text-[10px] font-mono text-muted-foreground/70 hover:text-foreground hover:bg-secondary/40 transition-none select-none"
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
            {workflows.length >= ALPHA_GROUP_THRESHOLD ? (
              renderGroupedItems(workflows, getActiveId(pathname), (wf) => `/workflows/${wf.id}`, linkClass)
            ) : (
              (() => {
                const { visible, truncated, total } = applyItemLimit(workflows, getActiveId(pathname), MAX_VISIBLE_ITEMS);
                return (
                  <>
                    {visible.map((wf) => (
                      <li key={wf.id}>
                        <Link href={`/workflows/${wf.id}`} className={linkClass(`/workflows/${wf.id}`)}>
                          {wf.name}
                        </Link>
                      </li>
                    ))}
                    {truncated && (
                      <li>
                        <Link
                          href="/workflows"
                          className="block py-1 px-2.5 rounded text-[10px] font-mono text-muted-foreground/70 hover:text-foreground hover:bg-secondary/40 transition-none select-none"
                        >
                          See all {total} →
                        </Link>
                      </li>
                    )}
                  </>
                );
              })()
            )}
          </ul>
        )}

        {/* Cheatsheets */}
        {renderSectionHeader('Cheatsheets', cheatsheets.length, 'cheatsheets', '/cheatsheets')}
        {expanded === 'cheatsheets' && (
          <ul className="space-y-0.5">
            {cheatsheets.length >= ALPHA_GROUP_THRESHOLD ? (
              renderGroupedItems(cheatsheets, getActiveId(pathname), (cs) => `/cheatsheets/${cs.id}`, linkClass)
            ) : (
              (() => {
                const { visible, truncated, total } = applyItemLimit(cheatsheets, getActiveId(pathname), MAX_VISIBLE_ITEMS);
                return (
                  <>
                    {visible.map((cs) => (
                      <li key={cs.id}>
                        <Link href={`/cheatsheets/${cs.id}`} className={linkClass(`/cheatsheets/${cs.id}`)}>
                          {cs.name}
                        </Link>
                      </li>
                    ))}
                    {truncated && (
                      <li>
                        <Link
                          href="/cheatsheets"
                          className="block py-1 px-2.5 rounded text-[10px] font-mono text-muted-foreground/70 hover:text-foreground hover:bg-secondary/40 transition-none select-none"
                        >
                          See all {total} →
                        </Link>
                      </li>
                    )}
                  </>
                );
              })()
            )}
          </ul>
        )}
      </nav>
    </aside>
  );
}
