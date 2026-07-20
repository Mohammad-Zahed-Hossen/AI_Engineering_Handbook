'use client';

import { useEffect, useState, useMemo } from 'react';
import { cn } from '@/lib/utils';

interface TaskNavigationItem {
  id: string;
  label: string;
}

interface PackageTaskNavigationProps {
  tasks: TaskNavigationItem[];
}

function slugify(value: string): string {
  return value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

export default function PackageTaskNavigation({ tasks }: PackageTaskNavigationProps) {
  const [activeId, setActiveId] = useState(tasks[0]?.id ?? '');

  // Track active task based on scroll position
  useEffect(() => {
    const mainElement = document.getElementById('main-scroll');
    if (!mainElement || tasks.length === 0) return;

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
        root: mainElement,
        rootMargin: '-88px 0px -65% 0px',
        threshold: [0, 1],
      }
    );

    const taskElements = tasks
      .map(task => document.getElementById(task.id))
      .filter((el): el is HTMLElement => Boolean(el));

    taskElements.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [tasks]);

  if (tasks.length === 0) return null;

  return (
    <>
      {/* Mobile: Horizontal scrollable chips */}
      <div className="md:hidden">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {tasks.map(task => (
            <a
              key={task.id}
              href={`#${task.id}`}
              className={cn(
                'whitespace-nowrap px-3 py-1.5 rounded-full text-[10px] font-medium transition-colors border touch-target',
                activeId === task.id
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-muted text-muted-foreground border-border hover:bg-muted/80'
              )}
            >
              {task.label}
            </a>
          ))}
        </div>
      </div>

      {/* Desktop: Sticky left sidebar */}
      <aside className="hidden md:block w-48 shrink-0">
        <div className="sticky top-6 rounded-lg border border-border bg-card p-3 select-none max-h-[calc(100vh-6rem)] overflow-y-auto">
          <h2 className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Tasks
          </h2>
          <nav aria-label="Task navigation">
            <ul className="space-y-1">
              {tasks.map(task => (
                <li key={task.id}>
                  <a
                    href={`#${task.id}`}
                    className={cn(
                      'block border-l px-2.5 py-1 text-[11px] leading-snug transition-colors',
                      activeId === task.id
                        ? 'border-primary text-foreground font-medium'
                        : 'border-border text-muted-foreground hover:border-muted-foreground/50 hover:text-foreground'
                    )}
                  >
                    {task.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </aside>
    </>
  );
}