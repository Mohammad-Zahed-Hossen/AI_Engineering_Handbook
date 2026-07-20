'use client';

import { useEffect, useState } from 'react';
import { ChevronUp, Copy, Check, Package, List } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PackageStickyBarProps {
  packageName: string;
  version?: string;
  install?: string;
  importAs?: string;
  taskCount?: number;
}

export default function PackageStickyBar({ 
  packageName, 
  version, 
  install, 
  importAs,
  taskCount 
}: PackageStickyBarProps) {
  const [visible, setVisible] = useState(false);
  const [copiedInstall, setCopiedInstall] = useState(false);
  const [copiedImport, setCopiedImport] = useState(false);

  useEffect(() => {
    const mainElement = document.getElementById('main-scroll');
    if (!mainElement) return;

    const updateVisibility = () => {
      const scrollY = mainElement.scrollTop;
      setVisible(scrollY > 200);
    };

    mainElement.addEventListener('scroll', updateVisibility, { passive: true });
    updateVisibility();
    return () => mainElement.removeEventListener('scroll', updateVisibility);
  }, []);

  const handleCopyInstall = async () => {
    if (!install) return;
    try {
      await navigator.clipboard.writeText(install);
      setCopiedInstall(true);
      setTimeout(() => setCopiedInstall(false), 2000);
    } catch (err) {
      console.error('Failed to copy install command:', err);
    }
  };

  const handleCopyImport = async () => {
    if (!importAs) return;
    try {
      await navigator.clipboard.writeText(importAs);
      setCopiedImport(true);
      setTimeout(() => setCopiedImport(false), 2000);
    } catch (err) {
      console.error('Failed to copy import statement:', err);
    }
  };

  const handleBackToTop = () => {
    const mainElement = document.getElementById('main-scroll');
    if (mainElement) {
      mainElement.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleJumpToTasks = () => {
    const mainElement = document.getElementById('main-scroll');
    if (mainElement) {
      // Find the first task element
      const firstTask = document.querySelector('[id^="create-dataframe"], [id^="read-csv"], [id^="select"], [id^="group"], [id^="merge"]');
      if (firstTask) {
        firstTask.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  if (!packageName) return null;

  return (
    <div
      className={cn(
        "fixed left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 mobile-sticky-bar-bottom",
        "rounded-full border border-border bg-card/95 backdrop-blur-sm shadow-sm",
        "px-2.5 py-2 transition-all duration-200 select-none",
        visible ? "translate-y-0 opacity-100" : "translate-y-16 opacity-0 pointer-events-none"
      )}
    >
      {/* Package name and version */}
      <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-muted/50">
        <Package className="w-3.5 h-3.5 text-primary" />
        <span className="text-xs font-semibold text-foreground font-sans">
          {packageName}
        </span>
        {version && (
          <span className="text-[10px] font-mono text-muted-foreground bg-background/50 px-1.5 py-0.5 rounded">
            v{version}
          </span>
        )}
      </div>

      {/* Copy Install button */}
      {install && (
        <button
          onClick={handleCopyInstall}
          className={cn(
            "flex items-center gap-1 px-2.5 py-1.5 rounded-full text-[10px] font-mono font-medium",
            "border border-border transition-all duration-150 touch-target",
            copiedInstall
              ? "text-emerald-600 bg-emerald-500/10 border-emerald-500/20"
              : "text-muted-foreground hover:text-foreground hover:bg-muted"
          )}
          aria-label="Copy install command"
        >
          {copiedInstall ? (
            <>
              <Check className="w-3 h-3" />
              Copied
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              Install
            </>
          )}
        </button>
      )}

      {/* Copy Import button */}
      {importAs && (
        <button
          onClick={handleCopyImport}
          className={cn(
            "flex items-center gap-1 px-2.5 py-1.5 rounded-full text-[10px] font-mono font-medium",
            "border border-border transition-all duration-150 touch-target",
            copiedImport
              ? "text-emerald-600 bg-emerald-500/10 border-emerald-500/20"
              : "text-muted-foreground hover:text-foreground hover:bg-muted"
          )}
          aria-label="Copy import statement"
        >
          {copiedImport ? (
            <>
              <Check className="w-3 h-3" />
              Copied
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              Import
            </>
          )}
        </button>
      )}

      {/* Jump to Tasks button */}
      {taskCount && taskCount > 0 && (
        <button
          onClick={handleJumpToTasks}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-full text-[10px] font-mono font-medium border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-150 touch-target"
          aria-label="Jump to tasks"
        >
          <List className="w-3 h-3" />
          Tasks
        </button>
      )}

      {/* Back to Top button */}
      <button
        onClick={handleBackToTop}
        className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors touch-target"
        aria-label="Back to top"
      >
        <ChevronUp className="w-4 h-4" />
      </button>
    </div>
  );
}