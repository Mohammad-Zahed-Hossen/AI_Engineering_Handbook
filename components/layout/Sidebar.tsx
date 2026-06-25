'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { NavItem } from '@/lib/data';

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

  const [expanded, setExpanded] = useState<string>(getActiveSection(pathname));

  useEffect(() => {
    setExpanded(getActiveSection(pathname));
  }, [pathname]);

  const toggleSection = (section: string) => {
    setExpanded(expanded === section ? '' : section);
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

  const SectionHeader = ({ title, count, section }: { title: string; count: number; section: string }) => (
    <div className={sectionHeadingClass} onClick={() => toggleSection(section)}>
      {expanded === section ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
      <span>{title}</span>
      <span className="ml-auto text-[8px] bg-muted px-1 rounded text-muted-foreground">{count}</span>
    </div>
  );

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
        <SectionHeader title="Packages" count={packages.length} section="packages" />
        {expanded === 'packages' && (
          <ul className="space-y-0.5">
            {packages.map((pkg) => (
              <li key={pkg.id}>
                <Link href={`/packages/${pkg.id}`} className={linkClass(`/packages/${pkg.id}`)}>
                  {pkg.name} <span className="text-[9px] opacity-75">v{pkg.version}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}

        {/* Models Library */}
        <div className={sectionHeadingClass}>Models Library</div>

        <div className="pl-2.5 mt-1.5 text-[9px] font-semibold text-muted-foreground uppercase flex items-center gap-1.5 cursor-pointer hover:text-foreground/70" onClick={() => toggleSection('ml')}>
          {expanded === 'ml' ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
          <span>Machine Learning</span>
          <span className="ml-auto text-[8px] bg-muted px-1 rounded text-muted-foreground">{mlModels.length}</span>
        </div>
        {expanded === 'ml' && (
          <ul className="space-y-0.5 pl-2 border-l border-sidebar-border ml-2.5">
            {mlModels.map((m) => (
              <li key={m.id}>
                <Link href={`/models/ml/${m.id}`} className={linkClass(`/models/ml/${m.id}`)}>
                  {m.name}
                </Link>
              </li>
            ))}
          </ul>
        )}

        <div className="pl-2.5 mt-2.5 text-[9px] font-semibold text-muted-foreground uppercase flex items-center gap-1.5 cursor-pointer hover:text-foreground/70" onClick={() => toggleSection('dl')}>
          {expanded === 'dl' ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
          <span>Deep Learning</span>
          <span className="ml-auto text-[8px] bg-muted px-1 rounded text-muted-foreground">{dlModels.length}</span>
        </div>
        {expanded === 'dl' && (
          <ul className="space-y-0.5 pl-2 border-l border-sidebar-border ml-2.5">
            {dlModels.map((m) => (
              <li key={m.id}>
                <Link href={`/models/dl/${m.id}`} className={linkClass(`/models/dl/${m.id}`)}>
                  {m.name}
                </Link>
              </li>
            ))}
          </ul>
        )}

        <div className="pl-2.5 mt-2.5 text-[9px] font-semibold text-muted-foreground uppercase flex items-center gap-1.5 cursor-pointer hover:text-foreground/70" onClick={() => toggleSection('llm')}>
          {expanded === 'llm' ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
          <span>Large Language Models</span>
          <span className="ml-auto text-[8px] bg-muted px-1 rounded text-muted-foreground">{llmModels.length}</span>
        </div>
        {expanded === 'llm' && (
          <ul className="space-y-0.5 pl-2 border-l border-sidebar-border ml-2.5">
            {llmModels.map((m) => (
              <li key={m.id}>
                <Link href={`/models/llm/${m.id}`} className={linkClass(`/models/llm/${m.id}`)}>
                  {m.name}
                </Link>
              </li>
            ))}
          </ul>
        )}

        {/* Model Registries */}
        <SectionHeader title="Registries" count={registryTasks.length} section="registry" />
        {expanded === 'registry' && (
          <ul className="space-y-0.5">
            {registryTasks.map((task) => (
              <li key={task}>
                <Link href={`/registry/${task}`} className={linkClass(`/registry/${task}`)}>
                  {REGISTRY_TASK_LABELS[task] ?? task}
                </Link>
              </li>
            ))}
          </ul>
        )}

        {/* Workflows */}
        <SectionHeader title="Workflows" count={workflows.length} section="workflows" />
        {expanded === 'workflows' && (
          <ul className="space-y-0.5">
            {workflows.map((wf) => (
              <li key={wf.id}>
                <Link href={`/workflows/${wf.id}`} className={linkClass(`/workflows/${wf.id}`)}>
                  {wf.name}
                </Link>
              </li>
            ))}
          </ul>
        )}

        {/* Cheatsheets */}
        <SectionHeader title="Cheatsheets" count={cheatsheets.length} section="cheatsheets" />
        {expanded === 'cheatsheets' && (
          <ul className="space-y-0.5">
            {cheatsheets.map((cs) => (
              <li key={cs.id}>
                <Link href={`/cheatsheets/${cs.id}`} className={linkClass(`/cheatsheets/${cs.id}`)}>
                  {cs.name}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </nav>
    </aside>
  );
}
