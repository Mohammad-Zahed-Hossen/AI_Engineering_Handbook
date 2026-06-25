import MobileSidebarTrigger from './MobileSidebarTrigger';
import SearchBox from '@/components/shared/SearchBox';
import { NavItem } from '@/lib/data';
import { SearchResult } from '@/lib/search';

interface TopBarProps {
  packages: NavItem[];
  mlModels: NavItem[];
  dlModels: NavItem[];
  llmModels: NavItem[];
  registryTasks: string[];
  workflows: NavItem[];
  cheatsheets: NavItem[];
  searchIndex: SearchResult[];
}

export default function TopBar({
  packages,
  mlModels,
  dlModels,
  llmModels,
  registryTasks,
  workflows,
  cheatsheets,
  searchIndex,
}: TopBarProps) {
  return (
    <header className="h-14 border-b border-border bg-card text-card-foreground px-4 flex items-center justify-between gap-4 select-none shrink-0">
      <div className="flex items-center gap-3 min-w-0">
        <div className="md:hidden flex items-center shrink-0">
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
        <span className="hidden sm:inline text-xs font-semibold text-foreground font-sans shrink-0">
          AI Engineering Handbook
        </span>
      </div>
      <div className="flex-1 flex justify-center max-w-lg">
        <SearchBox index={searchIndex} compact placeholder="Search handbook…" />
      </div>
      <div className="hidden sm:flex items-center shrink-0">
        <div className="text-[10px] text-muted-foreground font-mono">Static</div>
      </div>
    </header>
  );
}
