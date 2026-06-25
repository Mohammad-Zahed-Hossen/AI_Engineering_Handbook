'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { NavItem } from '@/lib/data';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';

interface MobileSidebarTriggerProps {
  packages: NavItem[];
  mlModels: NavItem[];
  dlModels: NavItem[];
  llmModels: NavItem[];
  registryTasks: string[];
  workflows: NavItem[];
  cheatsheets: readonly string[];
}

export default function MobileSidebarTrigger({
  packages,
  mlModels,
  dlModels,
  llmModels,
  registryTasks,
  workflows,
  cheatsheets,
}: MobileSidebarTriggerProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const linkClass = (href: string) => {
    const active = pathname === href;
    return cn(
      "block py-1.5 px-2.5 rounded text-[11px] font-mono leading-normal transition-none select-none",
      active
        ? "bg-primary text-primary-foreground font-semibold"
        : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
    );
  };

  const sectionHeadingClass = "px-2.5 mt-4 mb-1 text-[9px] uppercase font-bold text-foreground/50 tracking-wider select-none";

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center justify-center px-2 py-0.5 rounded border border-border bg-secondary text-foreground hover:bg-muted cursor-pointer text-[10px] font-semibold select-none h-auto"
          aria-label="Open navigation menu"
        >
          Menu
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[280px] p-0 bg-sidebar text-sidebar-foreground overflow-y-auto border-r border-sidebar-border">
        <SheetHeader className="sr-only">
          <SheetTitle>Navigation Menu</SheetTitle>
        </SheetHeader>
        
        {/* Brand */}
        <div className="p-4 border-b border-sidebar-border flex items-center justify-between">
          <Link 
            href="/" 
            className="font-bold tracking-tight text-xs text-foreground uppercase"
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

          {/* Python Packages */}
          <div className={sectionHeadingClass}>Packages</div>
          <ul className="space-y-0.5">
            {packages.map((pkg) => (
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
          </ul>

          {/* Models Library */}
          <div className={sectionHeadingClass}>Models Library</div>
          
          <div className="pl-2.5 mt-1.5 text-[9px] font-semibold text-muted-foreground uppercase">Machine Learning</div>
          <ul className="space-y-0.5 pl-2 border-l border-sidebar-border ml-2.5">
            {mlModels.map((m) => (
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
          </ul>

          <div className="pl-2.5 mt-2.5 text-[9px] font-semibold text-muted-foreground uppercase">Deep Learning</div>
          <ul className="space-y-0.5 pl-2 border-l border-sidebar-border ml-2.5">
            {dlModels.map((m) => (
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
          </ul>

          <div className="pl-2.5 mt-2.5 text-[9px] font-semibold text-muted-foreground uppercase">Large Language Models</div>
          <ul className="space-y-0.5 pl-2 border-l border-sidebar-border ml-2.5">
            {llmModels.map((m) => (
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
          </ul>

          {/* Model Registries */}
          <div className={sectionHeadingClass}>Registries</div>
          <ul className="space-y-0.5">
            {registryTasks.map((task) => (
              <li key={task}>
                <Link 
                  href={`/registry/${task}`} 
                  className={linkClass(`/registry/${task}`)}
                  onClick={() => setOpen(false)}
                >
                  {task}s
                </Link>
              </li>
            ))}
          </ul>

          {/* Workflows */}
          <div className={sectionHeadingClass}>Workflows</div>
          <ul className="space-y-0.5">
            {workflows.map((wf) => (
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
          </ul>

          {/* Cheatsheets */}
          <div className={sectionHeadingClass}>Cheatsheets</div>
          <ul className="space-y-0.5">
            {cheatsheets.map((csId) => (
              <li key={csId}>
                <Link 
                  href={`/cheatsheets/${csId}`} 
                  className={linkClass(`/cheatsheets/${csId}`)}
                  onClick={() => setOpen(false)}
                >
                  {csId}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
