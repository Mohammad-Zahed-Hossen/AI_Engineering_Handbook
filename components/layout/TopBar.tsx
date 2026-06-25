import MobileSidebarTrigger from './MobileSidebarTrigger';
import { NavItem } from '@/lib/data';

interface TopBarProps {
  packages: NavItem[];
  mlModels: NavItem[];
  dlModels: NavItem[];
  llmModels: NavItem[];
  registryTasks: string[];
  workflows: NavItem[];
  cheatsheets: readonly string[];
}

export default function TopBar({
  packages,
  mlModels,
  dlModels,
  llmModels,
  registryTasks,
  workflows,
  cheatsheets,
}: TopBarProps) {
  return (
    <header className="h-12 border-b border-border bg-card text-card-foreground px-4 flex items-center justify-between select-none">
      <div className="flex items-center gap-3">
        {/* Mobile sidebar trigger */}
        <div className="md:hidden flex items-center">
          <MobileSidebarTrigger
            packages={packages}
            mlModels={mlModels}
            dlModels={dlModels}
            llmModels={llmModels}
            registryTasks={registryTasks}
            workflows={workflows}
            cheatsheets={cheatsheets}
          />
        </div>
        <span className="text-xs font-semibold text-foreground font-sans">AI Engineering Knowledge Base</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="text-[9px] text-muted-foreground font-mono">v2.0.0</div>
      </div>
    </header>
  );
}
