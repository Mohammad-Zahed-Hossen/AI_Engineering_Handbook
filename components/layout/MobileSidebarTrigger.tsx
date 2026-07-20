'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, ChevronRight, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { NavItem } from '@/lib/data';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';

// Smart item limit: show all for ≤9 items, 5+ for 10+ items
const ITEM_LIMIT_THRESHOLD = 10;
const VISIBLE_ITEMS_LARGE = 5;

function applyItemLimit<T extends { id: string }>(
  items: T[],
  activeId: string | null,
  max: number
): { visible: T[]; truncated: boolean; total: number } {
  if (items.length < ITEM_LIMIT_THRESHOLD) {
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

// Reusable navigation item link component
function NavItemLink({ 
  href, 
  children, 
  pathname, 
  onClose,
  showVersion = false,
  version
}: { 
  href: string; 
  children: React.ReactNode; 
  pathname: string;
  onClose: () => void;
  showVersion?: boolean;
  version?: string;
}) {
  const active = pathname === href;
  return (
    <Link
      href={href}
      className={cn(
        "flex min-h-11 items-center px-2.5 py-2 rounded text-xs font-mono leading-normal transition-none select-none",
        active
          ? "bg-primary text-primary-foreground font-semibold"
          : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
      )}
      onClick={onClose}
    >
      {children}
      {showVersion && version && (
        <span className="ml-1 text-[9px] opacity-75">v{version}</span>
      )}
    </Link>
  );
}

// Reusable section card component
function SectionCard({
  title,
  count,
  section,
  href,
  children,
  expanded,
  onToggle,
  onClose,
  subItems,
}: {
  title: string;
  count: number;
  section: string;
  href: string;
  children: React.ReactNode;
  expanded: string;
  onToggle: (section: string) => void;
  onClose: () => void;
  subItems?: string;
}) {
  const isExpanded = expanded === section;
  
  return (
    <div className="border border-sidebar-border rounded-lg overflow-hidden bg-card/30">
      <div className="flex items-center px-3 py-2.5">
        {/* Chevron toggle - expands/collapses */}
        <button
          onClick={() => onToggle(section)}
          className="flex h-9 w-7 items-center justify-center -ml-1 cursor-pointer text-muted-foreground hover:text-foreground"
          aria-label={isExpanded ? `Collapse ${title}` : `Expand ${title}`}
          aria-expanded={isExpanded}
        >
          {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
        </button>
        
        {/* Title - navigates to overview page */}
        <Link
          href={href}
          className="flex-1 min-h-9 flex items-center font-medium text-sm text-foreground hover:text-foreground/90 transition-none"
          onClick={onClose}
        >
          {title}
        </Link>
        
        {/* Count badge */}
        <span className="ml-auto text-[10px] bg-muted px-1.5 py-0.5 rounded text-muted-foreground font-mono">
          {count}
        </span>
      </div>
      
      {/* Sub-items label (e.g., "ML • DL • LLM") */}
      {subItems && (
        <div className="px-10 pb-1.5">
          <span className="text-[10px] text-muted-foreground/60 font-mono">
            {subItems}
          </span>
        </div>
      )}
      
      {/* Expanded content */}
      {isExpanded && (
        <div className="border-t border-sidebar-border bg-background/50">
          <div className="p-1.5 space-y-0.5">
            {children}
          </div>
        </div>
      )}
    </div>
  );
}

// Reusable "Show all" link component
function ShowAllLink({ href, total, onClose }: { href: string; total: number; onClose: () => void }) {
  return (
    <Link
      href={href}
      className="flex min-h-10 items-center px-2.5 py-1.5 rounded text-[10px] font-mono text-muted-foreground/70 hover:text-foreground hover:bg-secondary/40 transition-none select-none"
      onClick={onClose}
    >
      Show all {total} →
    </Link>
  );
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
    if (pathname.startsWith('/models')) return 'models';
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

  const handleClose = () => setOpen(false);

  // Calculate total models for the Models card
  const totalModels = mlModels.length + dlModels.length + llmModels.length;

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
      <SheetContent 
        side="left" 
        className="w-[min(84vw,320px)] p-0 bg-sidebar text-sidebar-foreground overflow-y-auto border-r border-sidebar-border flex flex-col"
      >
        <SheetHeader className="sr-only">
          <SheetTitle>Navigation Menu</SheetTitle>
        </SheetHeader>
        
        {/* Header */}
        <div className="p-4 border-b border-sidebar-border">
          <Link 
            href="/" 
            className="flex min-h-11 items-center font-bold tracking-tight text-xs text-foreground uppercase"
            onClick={handleClose}
          >
            AI Engineering
          </Link>
        </div>

        {/* Navigation - organized by workflow */}
        <nav className="flex-1 p-3 space-y-4 safe-area-bottom">
          
          {/* Explore Section */}
          <div className="space-y-2">
            <h2 className="px-2 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
              Explore
            </h2>
            <div className="space-y-1">
              <NavItemLink href="/" pathname={pathname} onClose={handleClose}>
                Dashboard
              </NavItemLink>
              <NavItemLink href="/problem-index" pathname={pathname} onClose={handleClose}>
                Problem Index
              </NavItemLink>
            </div>
          </div>

          {/* Knowledge Section */}
          <div className="space-y-2">
            <h2 className="px-2 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
              Knowledge
            </h2>
            <div className="space-y-2">
              <SectionCard
                title="Models"
                count={totalModels}
                section="models"
                href="/models"
                expanded={expanded}
                onToggle={toggleSection}
                onClose={handleClose}
                subItems="ML • DL • LLM"
              >
                {/* ML Models */}
                {mlModels.length > 0 && (
                  <>
                    {(() => {
                      const { visible, truncated, total } = applyItemLimit(mlModels, getActiveId(pathname), VISIBLE_ITEMS_LARGE);
                      return (
                        <>
                          {visible.map((m) => (
                            <NavItemLink
                              key={m.id}
                              href={`/models/ml/${m.id}`}
                              pathname={pathname}
                              onClose={handleClose}
                            >
                              {m.name}
                            </NavItemLink>
                          ))}
                          {truncated && <ShowAllLink href="/models/ml" total={total} onClose={handleClose} />}
                        </>
                      );
                    })()}
                  </>
                )}
                
                {/* DL Models */}
                {dlModels.length > 0 && (
                  <>
                    {(() => {
                      const { visible, truncated, total } = applyItemLimit(dlModels, getActiveId(pathname), VISIBLE_ITEMS_LARGE);
                      return (
                        <>
                          {visible.map((m) => (
                            <NavItemLink
                              key={m.id}
                              href={`/models/dl/${m.id}`}
                              pathname={pathname}
                              onClose={handleClose}
                            >
                              {m.name}
                            </NavItemLink>
                          ))}
                          {truncated && <ShowAllLink href="/models/dl" total={total} onClose={handleClose} />}
                        </>
                      );
                    })()}
                  </>
                )}
                
                {/* LLM Models */}
                {llmModels.length > 0 && (
                  <>
                    {(() => {
                      const { visible, truncated, total } = applyItemLimit(llmModels, getActiveId(pathname), VISIBLE_ITEMS_LARGE);
                      return (
                        <>
                          {visible.map((m) => (
                            <NavItemLink
                              key={m.id}
                              href={`/models/llm/${m.id}`}
                              pathname={pathname}
                              onClose={handleClose}
                            >
                              {m.name}
                            </NavItemLink>
                          ))}
                          {truncated && <ShowAllLink href="/models/llm" total={total} onClose={handleClose} />}
                        </>
                      );
                    })()}
                  </>
                )}
              </SectionCard>

              <SectionCard
                title="Packages"
                count={packages.length}
                section="packages"
                href="/packages"
                expanded={expanded}
                onToggle={toggleSection}
                onClose={handleClose}
                subItems="Libraries"
              >
                {(() => {
                  const { visible, truncated, total } = applyItemLimit(packages, getActiveId(pathname), VISIBLE_ITEMS_LARGE);
                  return (
                    <>
                      {visible.map((pkg) => (
                        <NavItemLink
                          key={pkg.id}
                          href={`/packages/${pkg.id}`}
                          pathname={pathname}
                          onClose={handleClose}
                          showVersion
                          version={pkg.version}
                        >
                          {pkg.name}
                        </NavItemLink>
                      ))}
                      {truncated && <ShowAllLink href="/packages" total={total} onClose={handleClose} />}
                    </>
                  );
                })()}
              </SectionCard>

              <SectionCard
                title="Registry"
                count={registry.length}
                section="registry"
                href="/registry"
                expanded={expanded}
                onToggle={toggleSection}
                onClose={handleClose}
                subItems="Families"
              >
                {(() => {
                  const { visible, truncated, total } = applyItemLimit(registry, getActiveId(pathname), VISIBLE_ITEMS_LARGE);
                  return (
                    <>
                      {visible.map((r) => (
                        <NavItemLink
                          key={r.id}
                          href={`/registry/families/${r.id}`}
                          pathname={pathname}
                          onClose={handleClose}
                        >
                          {r.name}
                        </NavItemLink>
                      ))}
                      {truncated && <ShowAllLink href="/registry" total={total} onClose={handleClose} />}
                    </>
                  );
                })()}
              </SectionCard>
            </div>
          </div>

          {/* Build Section */}
          <div className="space-y-2">
            <h2 className="px-2 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
              Build
            </h2>
            <div className="space-y-2">
              <SectionCard
                title="Workflows"
                count={workflows.length}
                section="workflows"
                href="/workflows"
                expanded={expanded}
                onToggle={toggleSection}
                onClose={handleClose}
                subItems="Pipelines"
              >
                {(() => {
                  const { visible, truncated, total } = applyItemLimit(workflows, getActiveId(pathname), VISIBLE_ITEMS_LARGE);
                  return (
                    <>
                      {visible.map((wf) => (
                        <NavItemLink
                          key={wf.id}
                          href={`/workflows/${wf.id}`}
                          pathname={pathname}
                          onClose={handleClose}
                        >
                          {wf.name}
                        </NavItemLink>
                      ))}
                      {truncated && <ShowAllLink href="/workflows" total={total} onClose={handleClose} />}
                    </>
                  );
                })()}
              </SectionCard>

              <SectionCard
                title="Patterns"
                count={patterns.length}
                section="patterns"
                href="/patterns"
                expanded={expanded}
                onToggle={toggleSection}
                onClose={handleClose}
                subItems="Techniques"
              >
                {(() => {
                  const { visible, truncated, total } = applyItemLimit(patterns, getActiveId(pathname), VISIBLE_ITEMS_LARGE);
                  return (
                    <>
                      {visible.map((p) => (
                        <NavItemLink
                          key={p.id}
                          href={`/patterns/${p.id}`}
                          pathname={pathname}
                          onClose={handleClose}
                        >
                          {p.name}
                        </NavItemLink>
                      ))}
                      {truncated && <ShowAllLink href="/patterns" total={total} onClose={handleClose} />}
                    </>
                  );
                })()}
              </SectionCard>

              <SectionCard
                title="Debug Guides"
                count={debugGuides.length}
                section="debug_guides"
                href="/debug-guides"
                expanded={expanded}
                onToggle={toggleSection}
                onClose={handleClose}
                subItems="Solutions"
              >
                {(() => {
                  const { visible, truncated, total } = applyItemLimit(debugGuides, getActiveId(pathname), VISIBLE_ITEMS_LARGE);
                  return (
                    <>
                      {visible.map((dg) => (
                        <NavItemLink
                          key={dg.id}
                          href={`/debug-guides/${dg.id}`}
                          pathname={pathname}
                          onClose={handleClose}
                        >
                          {dg.name}
                        </NavItemLink>
                      ))}
                      {truncated && <ShowAllLink href="/debug-guides" total={total} onClose={handleClose} />}
                    </>
                  );
                })()}
              </SectionCard>
            </div>
          </div>

          {/* Reference Section */}
          <div className="space-y-2">
            <h2 className="px-2 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
              Reference
            </h2>
            <div className="space-y-2">
              <SectionCard
                title="Cheatsheets"
                count={cheatsheets.length}
                section="cheatsheets"
                href="/cheatsheets"
                expanded={expanded}
                onToggle={toggleSection}
                onClose={handleClose}
                subItems="Syntax"
              >
                {(() => {
                  const { visible, truncated, total } = applyItemLimit(cheatsheets, getActiveId(pathname), VISIBLE_ITEMS_LARGE);
                  return (
                    <>
                      {visible.map((cs) => (
                        <NavItemLink
                          key={cs.id}
                          href={`/cheatsheets/${cs.id}`}
                          pathname={pathname}
                          onClose={handleClose}
                        >
                          {cs.name}
                        </NavItemLink>
                      ))}
                      {truncated && <ShowAllLink href="/cheatsheets" total={total} onClose={handleClose} />}
                    </>
                  );
                })()}
              </SectionCard>

              <SectionCard
                title="Decision Guides"
                count={decisionGuides.length}
                section="decision_guides"
                href="/decision-guides"
                expanded={expanded}
                onToggle={toggleSection}
                onClose={handleClose}
                subItems="Comparisons"
              >
                {(() => {
                  const { visible, truncated, total } = applyItemLimit(decisionGuides, getActiveId(pathname), VISIBLE_ITEMS_LARGE);
                  return (
                    <>
                      {visible.map((dg) => (
                        <NavItemLink
                          key={dg.id}
                          href={`/decision-guides/${dg.id}`}
                          pathname={pathname}
                          onClose={handleClose}
                        >
                          {dg.name}
                        </NavItemLink>
                      ))}
                      {truncated && <ShowAllLink href="/decision-guides" total={total} onClose={handleClose} />}
                    </>
                  );
                })()}
              </SectionCard>

              <SectionCard
                title="Principles"
                count={principles.length}
                section="principles"
                href="/principles"
                expanded={expanded}
                onToggle={toggleSection}
                onClose={handleClose}
                subItems="Concepts"
              >
                {(() => {
                  const { visible, truncated, total } = applyItemLimit(principles, getActiveId(pathname), VISIBLE_ITEMS_LARGE);
                  return (
                    <>
                      {visible.map((p) => (
                        <NavItemLink
                          key={p.id}
                          href={`/principles/${p.id}`}
                          pathname={pathname}
                          onClose={handleClose}
                        >
                          {p.name}
                        </NavItemLink>
                      ))}
                      {truncated && <ShowAllLink href="/principles" total={total} onClose={handleClose} />}
                    </>
                  );
                })()}
              </SectionCard>
            </div>
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
}