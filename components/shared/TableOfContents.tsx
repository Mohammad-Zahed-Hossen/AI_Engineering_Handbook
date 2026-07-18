'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { List } from 'lucide-react';

interface TocItem {
  id: string;
  label: string;
}

export function useActiveSection(items: { id: string }[]) {
  const [activeId, setActiveId] = useState(items[0]?.id ?? '');

  useEffect(() => {
    const headings = items
      .map(item => document.getElementById(item.id))
      .filter((element): element is HTMLElement => Boolean(element));

    if (!headings.length) return;

    const observer = new IntersectionObserver(
      entries => {
        const visible = entries
          .filter(entry => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible[0]?.target.id) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        root: document.getElementById('main-scroll') || null,
        rootMargin: '-88px 0px -65% 0px',
        threshold: [0, 1],
      }
    );

    headings.forEach(heading => observer.observe(heading));
    return () => observer.disconnect();
  }, [items]);

  return activeId;
}

interface TableOfContentsProps {
  items: TocItem[];
  variant?: 'sidebar' | 'horizontal' | 'both';
  activeId?: string;
}

export default function TableOfContents({ items, variant = 'both', activeId }: TableOfContentsProps) {
  if (activeId !== undefined) {
    return <TableOfContentsPresentational items={items} variant={variant} activeId={activeId} />;
  }
  return <TableOfContentsSelfManaged items={items} variant={variant} />;
}

function TableOfContentsSelfManaged({ items, variant }: { items: TocItem[]; variant: 'sidebar' | 'horizontal' | 'both' }) {
  const activeId = useActiveSection(items);
  return <TableOfContentsPresentational items={items} variant={variant} activeId={activeId} />;
}

function TableOfContentsPresentational({ items, variant, activeId }: { items: TocItem[]; variant: 'sidebar' | 'horizontal' | 'both'; activeId: string }) {
  if (items.length < 2) return null;

  return (
    <>
      {/* Mobile: Floating button that opens a sheet */}
      {(variant === 'sidebar' || variant === 'both') && (
        <div className="lg:hidden fixed bottom-20 right-4 z-30">
          <Sheet>
            <SheetTrigger asChild>
              <button
                className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-colors touch-target"
                aria-label="Open table of contents"
              >
                <List className="h-5 w-5" />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px] p-0">
              <SheetHeader className="px-4 py-3 border-b border-border">
                <SheetTitle className="text-sm font-semibold">On this page</SheetTitle>
              </SheetHeader>
              <nav aria-label="Table of contents" className="p-2">
                <ul className="space-y-1">
                  {items.map(item => (
                    <li key={item.id}>
                      <a
                        href={`#${item.id}`}
                        className={cn(
                          'block px-3 py-2.5 rounded text-sm transition-colors touch-target',
                          activeId === item.id
                            ? 'bg-primary/10 text-foreground font-medium'
                            : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                        )}
                      >
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      )}

      {/* Desktop sidebar TOC */}
      {(variant === 'sidebar' || variant === 'both') && (
        <aside className="hidden lg:block w-48 shrink-0">
          <div className="sticky top-6 rounded-lg border border-border bg-card p-3 select-none">
            <h2 className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              On this page
            </h2>
            <nav aria-label="Table of contents">
              <ul className="space-y-1.5">
                {items.map(item => (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      className={cn(
                        'block border-l px-2 py-0.5 text-[11px] leading-snug transition-colors',
                        activeId === item.id
                          ? 'border-primary text-foreground font-medium'
                          : 'border-border text-muted-foreground hover:border-muted-foreground/50 hover:text-foreground'
                      )}
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </aside>
      )}

      {/* Tablet horizontal TOC */}
      {(variant === 'horizontal' || variant === 'both') && (
        <div className="hidden md:block lg:hidden w-full shrink-0">
          <div className="sticky top-4 rounded-lg border border-border bg-card p-2 select-none">
            <nav aria-label="Table of contents">
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                {items.map(item => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className={cn(
                      'whitespace-nowrap px-3 py-1 rounded-full text-[11px] font-medium transition-colors border',
                      activeId === item.id
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-muted text-muted-foreground border-border hover:bg-muted/80 hover:text-foreground'
                    )}
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}