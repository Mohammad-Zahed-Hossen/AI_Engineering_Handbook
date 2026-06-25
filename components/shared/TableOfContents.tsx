'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface TocItem {
  id: string;
  label: string;
}

interface TableOfContentsProps {
  items: TocItem[];
}

export default function TableOfContents({ items }: TableOfContentsProps) {
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
        rootMargin: '-88px 0px -65% 0px',
        threshold: [0, 1],
      }
    );

    headings.forEach(heading => observer.observe(heading));
    return () => observer.disconnect();
  }, [items]);

  if (items.length < 2) return null;

  return (
    <aside className="hidden xl:block w-48 shrink-0">
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
  );
}
