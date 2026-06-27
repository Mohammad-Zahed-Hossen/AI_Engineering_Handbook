'use client';

import { useEffect, useState, useMemo } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';

import { cn } from '@/lib/utils';

interface StickyActionBarProps {
  tocItems?: Array<{ id: string; label: string }>;
}

export default function StickyActionBar({ tocItems }: StickyActionBarProps) {
  const [visible, setVisible] = useState(false);
  const [activeLabel, setActiveLabel] = useState('');
  const [canGoNext, setCanGoNext] = useState(false);
  const [canGoPrev, setCanGoPrev] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);

  const sectionIds = useMemo(() => tocItems?.map(t => t.id) || [], [tocItems]);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const updateState = () => {
      const scrollY = window.scrollY;
      const direction = scrollY > lastScrollY ? 'down' : 'up';

      // Check if we are close to the bottom of the page
      const threshold = 50;
      const isAtBottom = window.innerHeight + scrollY >= document.documentElement.scrollHeight - threshold;

      setVisible(scrollY > 200 && (direction === 'up' || isAtBottom));

      if (scrollY >= 0) {
        lastScrollY = scrollY;
      }

      if (sectionIds.length > 0) {
        // Find current active section
        let currentIndex = -1;
        for (let i = sectionIds.length - 1; i >= 0; i--) {
          const el = document.getElementById(sectionIds[i]);
          if (el && el.getBoundingClientRect().top <= 120) {
            currentIndex = i;
            break;
          }
        }

        if (currentIndex >= 0 && tocItems) {
          setActiveLabel(tocItems[currentIndex].label);
          setCanGoNext(currentIndex < sectionIds.length - 1);
          setCanGoPrev(currentIndex > 0);
        } else if (tocItems && tocItems.length > 0) {
          setActiveLabel(tocItems[0].label);
          setCanGoNext(sectionIds.length > 1);
          setCanGoPrev(false);
        }
      }
    };

    window.addEventListener('scroll', updateState, { passive: true });
    updateState();
    return () => window.removeEventListener('scroll', updateState);
  }, [sectionIds, tocItems]);

  const scrollToSection = (index: number) => {
    if (!tocItems || index < 0 || index >= tocItems.length) return;
    const el = document.getElementById(tocItems[index].id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const activeIndex = useMemo(() => {
    if (!tocItems) return -1;
    return tocItems.findIndex(t => t.label === activeLabel);
  }, [tocItems, activeLabel]);

  if (!tocItems || tocItems.length < 2) return null;

  return (
    <>
      <div
        className={cn(
          "fixed bottom-16 left-1/2 -translate-x-1/2 z-40 flex items-center gap-1",
          "rounded-full border border-border bg-card/90 backdrop-blur-sm shadow-sm",
          "px-1 py-1 transition-all duration-200 select-none",
          visible ? "translate-y-0 opacity-100" : "translate-y-16 opacity-0 pointer-events-none"
        )}
      >
        {/* Previous section */}
        <button
          onClick={() => scrollToSection(activeIndex - 1)}
          disabled={!canGoPrev}
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-full transition-colors",
            canGoPrev
              ? "text-foreground hover:bg-muted active:scale-95"
              : "text-muted-foreground/30 cursor-not-allowed"
          )}
          aria-label="Previous section"
        >
          <ChevronUp className="w-4 h-4" />
        </button>

        {/* Current section label */}
        <button
          onClick={() => setSheetOpen(true)}
          className="flex h-8 items-center px-2 text-[10px] font-medium text-foreground hover:bg-muted rounded-full transition-colors max-w-[140px] truncate"
          title="Jump to section"
          aria-label="Open section navigation"
        >
          <span className="truncate">§ {activeLabel}</span>
        </button>

        {/* Next section */}
        <button
          onClick={() => scrollToSection(activeIndex + 1)}
          disabled={!canGoNext}
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-full transition-colors",
            canGoNext
              ? "text-foreground hover:bg-muted active:scale-95"
              : "text-muted-foreground/30 cursor-not-allowed"
          )}
          aria-label="Next section"
        >
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="bottom" className="max-h-[60vh] overflow-y-auto p-0">
          <SheetHeader className="px-4 py-3 border-b border-border">
            <SheetTitle className="text-sm">On this page</SheetTitle>
          </SheetHeader>
          <nav aria-label="Section navigation">
            {tocItems?.map(item => (
              <button
                key={item.id}
                onClick={() => {
                  document.getElementById(item.id)?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                  });
                  setSheetOpen(false);
                }}
                className={cn(
                  'w-full text-left px-4 py-3 text-sm border-b border-border last:border-0',
                  activeLabel === item.label
                    ? 'text-foreground font-medium bg-muted/30'
                    : 'text-muted-foreground'
                )}
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                setSheetOpen(false);
              }}
              className="w-full text-left px-4 py-3 text-xs text-muted-foreground border-t border-border mt-1"
            >
              ↑ Back to top
            </button>
          </nav>
        </SheetContent>
      </Sheet>
    </>
  );
}
