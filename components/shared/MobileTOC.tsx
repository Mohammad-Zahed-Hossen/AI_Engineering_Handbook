'use client';

import { useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';

interface TocItem {
  id: string;
  label: string;
}

interface MobileTOCProps {
  items: TocItem[];
}

export default function MobileTOC({ items }: MobileTOCProps) {
  const [activeId, setActiveId] = useState(items[0]?.id ?? '');
  const [open, setOpen] = useState(false);

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
        rootMargin: '-88px 0px -65% 0px',
        threshold: [0, 1],
      }
    );

    headings.forEach(heading => observer.observe(heading));
    return () => observer.disconnect();
  }, [items]);

  if (items.length < 2) return null;

  const activeLabel = items.find(item => item.id === activeId)?.label ?? items[0]?.label;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="xl:hidden sticky top-14 z-10 w-full h-9 px-4 flex items-center gap-2 bg-background/95 backdrop-blur-sm border-b border-border text-xs text-muted-foreground select-none"
      >
        <span className="text-[10px] font-semibold uppercase tracking-wider">§</span>
        <span className="flex-1 text-left truncate text-xs text-foreground">
          {activeLabel}
        </span>
        <ChevronDown className="w-3.5 h-3.5 shrink-0" />
      </button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="bottom" className="max-h-[60vh] overflow-y-auto p-0">
          <SheetHeader className="px-4 py-3 border-b border-border">
            <SheetTitle className="text-sm">On this page</SheetTitle>
          </SheetHeader>
          <nav aria-label="Mobile table of contents">
            {items.map(item => (
              <button
                key={item.id}
                onClick={() => {
                  window.history.pushState(null, '', `#${item.id}`);
                  window.dispatchEvent(new HashChangeEvent('hashchange'));
                  document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  setOpen(false);
                }}
                className={cn(
                  'w-full text-left px-4 py-3 text-sm border-b border-border last:border-0',
                  activeId === item.id
                    ? 'text-foreground font-medium bg-muted/30'
                    : 'text-muted-foreground'
                )}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
    </>
  );
}
