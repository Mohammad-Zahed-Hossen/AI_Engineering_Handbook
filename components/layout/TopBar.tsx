import MobileSidebarTrigger from './MobileSidebarTrigger';
import SearchBox from '@/components/shared/SearchBox';
import { NavItem } from '@/lib/data';
import { SearchResult } from '@/lib/search';
import DarkModeToggle from './DarkModeToggle';

interface TopBarProps {
  packages: NavItem[];
  mlModels: NavItem[];
  dlModels: NavItem[];
  llmModels: NavItem[];
  registry: NavItem[];
  workflows: NavItem[];
  cheatsheets: NavItem[];
  patterns: NavItem[];
  debugGuides: NavItem[];
  decisionGuides: NavItem[];
  principles: NavItem[];
  searchIndex: SearchResult[];
}

export default function TopBar({
  packages,
  mlModels,
  dlModels,
  llmModels,
  registry,
  workflows,
  cheatsheets,
  patterns,
  debugGuides,
  decisionGuides,
  principles,
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
            registry={registry}
            workflows={workflows}
            cheatsheets={cheatsheets}
            patterns={patterns}
            debugGuides={debugGuides}
            decisionGuides={decisionGuides}
            principles={principles}
          />
        </div>
        <span className="hidden sm:inline text-xs font-semibold text-foreground font-sans shrink-0">
          AI Engineering Handbook
        </span>
      </div>
      <div className="flex-1 flex justify-center max-w-lg">
        <SearchBox index={searchIndex} compact placeholder="Search handbook…" />
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <DarkModeToggle />
        <div className="hidden sm:block text-[10px] text-muted-foreground font-mono">Static</div>
      </div>
    </header>
  );
}



