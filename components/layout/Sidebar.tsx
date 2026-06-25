'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { NavItem } from '@/lib/data';

interface SidebarProps {
  packages: NavItem[];
  mlModels: NavItem[];
  dlModels: NavItem[];
  llmModels: NavItem[];
  registryTasks: string[];
  workflows: NavItem[];
  cheatsheets: readonly string[];
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

  const linkClass = (href: string) => {
    const active = pathname === href;
    return cn(
      "block py-1 px-2.5 rounded text-[11px] font-mono leading-normal transition-none select-none",
      active
        ? "bg-primary text-primary-foreground font-semibold"
        : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
    );
  };

  const sectionHeadingClass = "px-2.5 mt-4 mb-1 text-[9px] uppercase font-bold text-foreground/50 tracking-wider select-none";

  return (
    <aside className="w-64 bg-sidebar text-sidebar-foreground border-r border-sidebar-border flex flex-col h-full overflow-y-auto select-none">
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
        <div className={sectionHeadingClass}>Packages</div>
        <ul className="space-y-0.5">
          {packages.map((pkg) => (
            <li key={pkg.id}>
              <Link href={`/packages/${pkg.id}`} className={linkClass(`/packages/${pkg.id}`)}>
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
              <Link href={`/models/ml/${m.id}`} className={linkClass(`/models/ml/${m.id}`)}>
                {m.name}
              </Link>
            </li>
          ))}
        </ul>

        <div className="pl-2.5 mt-2.5 text-[9px] font-semibold text-muted-foreground uppercase">Deep Learning</div>
        <ul className="space-y-0.5 pl-2 border-l border-sidebar-border ml-2.5">
          {dlModels.map((m) => (
            <li key={m.id}>
              <Link href={`/models/dl/${m.id}`} className={linkClass(`/models/dl/${m.id}`)}>
                {m.name}
              </Link>
            </li>
          ))}
        </ul>

        <div className="pl-2.5 mt-2.5 text-[9px] font-semibold text-muted-foreground uppercase">Large Language Models</div>
        <ul className="space-y-0.5 pl-2 border-l border-sidebar-border ml-2.5">
          {llmModels.map((m) => (
            <li key={m.id}>
              <Link href={`/models/llm/${m.id}`} className={linkClass(`/models/llm/${m.id}`)}>
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
              <Link href={`/registry/${task}`} className={linkClass(`/registry/${task}`)}>
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
              <Link href={`/workflows/${wf.id}`} className={linkClass(`/workflows/${wf.id}`)}>
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
              <Link href={`/cheatsheets/${csId}`} className={linkClass(`/cheatsheets/${csId}`)}>
                {csId}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
