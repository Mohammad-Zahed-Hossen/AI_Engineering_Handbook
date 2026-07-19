'use client';

import Link from 'next/link';
import { RelatedResource } from '@/types/registry';
import { RegistryBadge } from './RegistryBadge';
import { Wrench, Bug, BookOpen, GitCompare, Package, Cog, ChevronRight, ChevronDown } from 'lucide-react';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter, SheetClose } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';

interface EngineeringContinuationProps {
  resources: RelatedResource[];
}

const intentIcons: Record<string, React.ReactNode> = {
  deploy: <Wrench className="h-4 w-4" />,
  debug: <Bug className="h-4 w-4" />,
  learn: <BookOpen className="h-4 w-4" />,
  select: <GitCompare className="h-4 w-4" />,
  implement: <Package className="h-4 w-4" />,
  optimize: <Cog className="h-4 w-4" />,
};

const intentLabels: Record<string, string> = {
  deploy: 'Deploy',
  debug: 'Debug',
  learn: 'Learn',
  select: 'Compare',
  implement: 'Implement',
  optimize: 'Optimize',
};

const resourceTypePaths: Record<string, string> = {
  workflow: '/workflows',
  pattern: '/patterns',
  package: '/packages',
  decision_guide: '/decision-guides',
  debug_guide: '/debug-guides',
  principle: '/principles',
};

const resourceTypeLabels: Record<string, string> = {
  workflow: 'Workflow',
  pattern: 'Pattern',
  package: 'Package',
  decision_guide: 'Guide',
  debug_guide: 'Debug',
  principle: 'Principle',
};

// Mobile slide-up panel with pill trigger
function MobileView({
  isOpen,
  setIsOpen,
  isVisible,
  hasPulsed,
  grouped,
  expandedGroups,
  toggleGroup,
}: {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  isVisible: boolean;
  hasPulsed: boolean;
  grouped: Record<string, RelatedResource[]>;
  expandedGroups: Record<string, boolean>;
  toggleGroup: (intent: string) => void;
}) {
  return (
    <div className="md:hidden">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            size="lg"
            className={`fixed bottom-4 left-1/2 -translate-x-1/2 z-40 rounded-full px-4 py-2.5 text-sm font-medium shadow-lg bg-primary hover:bg-primary/90 transition-all duration-200 ease-out ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'} ${!hasPulsed ? 'animate-pulse' : ''}`}
          >
            Next Steps · {Object.values(grouped).flat().length}
          </Button>
        </SheetTrigger>
        <SheetContent 
          side="bottom" 
          className="h-[75dvh] rounded-t-xl flex flex-col bg-background shadow-[0_-4px_24px_rgba(0,0,0,0.08)]"
          style={{ 
            '--sheet-overlay-opacity': '0.4',
            '--sheet-transition-duration': '200ms',
            '--sheet-transition-timing': 'ease-out'
          } as React.CSSProperties}
        >
          {/* Grabber handle */}
          <div className="flex justify-center pt-3 pb-2">
            <div className="w-16 h-1.5 bg-muted rounded-full" />
          </div>
          
          <SheetHeader className="px-4 pb-4">
            <SheetTitle className="text-center">What to do next</SheetTitle>
          </SheetHeader>
          
          <div className="flex-1 overflow-y-auto min-h-0 px-4 pb-4 overscroll-behavior-y: contain">
            {Object.entries(grouped).map(([intent, items]) => (
              <div key={intent} className="mb-3 last:mb-0">
                <button
                  onClick={() => toggleGroup(intent)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-muted/50 transition-colors ${expandedGroups[intent] ? 'bg-muted/50 border-l-2 border-primary' : 'bg-muted/50'}`}
                >
                  <div className="flex items-center gap-2">
                    {intentIcons[intent]}
                    <span className="text-xs font-semibold text-foreground uppercase tracking-wider">
                      {intentLabels[intent] || intent}
                    </span>
                    <span className="text-xs text-muted-foreground">({items.length})</span>
                  </div>
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </button>
                
                {expandedGroups[intent] && (
                  <div className="mt-2 space-y-1">
                    {items.map((item, idx) => {
                      const href = `${resourceTypePaths[item.resource_type]}/${item.resource_slug}`;
                      return (
                        <Link
                          key={idx}
                          href={href}
                          onClick={() => setIsOpen(false)}
                          className="flex items-center gap-3 px-4 py-4 min-h-[56px] hover:bg-muted/50 transition-colors active:scale-[0.98] rounded-lg border border-border/50"
                        >
                          <RegistryBadge variant="outline" size="xs" className="font-mono shrink-0 whitespace-nowrap">
                            {resourceTypeLabels[item.resource_type] || item.resource_type}
                          </RegistryBadge>
                          <span className="text-sm text-foreground break-words flex-1">
                            {item.resource_slug}
                          </span>
                          <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <SheetFooter className="px-4 pb-4 pt-2 border-t border-border">
            <SheetClose asChild>
              <Button variant="outline" className="w-full">
                Done
              </Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}

// Desktop sidebar card
function DesktopView({
  grouped,
}: {
  grouped: Record<string, RelatedResource[]>;
}) {
  return (
    <div className="hidden md:block space-y-3">
      <h2 className="text-sm font-semibold text-foreground">What to do next</h2>
      
      <div className="bg-card border border-border rounded-xl p-4">
        <div className="grid gap-3">
          {Object.entries(grouped).map(([intent, items]) => (
            <div key={intent}>
              <div className="flex items-center gap-2 mb-2">
                {intentIcons[intent]}
                <span className="text-xs font-semibold text-foreground uppercase tracking-wider">
                  {intentLabels[intent] || intent}
                </span>
                <span className="text-xs text-muted-foreground">({items.length})</span>
              </div>
              
              <div className="flex flex-col gap-1.5">
                {items.map((item, idx) => {
                  const href = `${resourceTypePaths[item.resource_type]}/${item.resource_slug}`;
                  return (
                    <Link
                      key={idx}
                      href={href}
                      className="flex items-center gap-2 group hover:bg-muted/50 p-2 rounded-md transition-colors"
                    >
                      <RegistryBadge variant="outline" size="xs" className="font-mono shrink-0 whitespace-nowrap">
                        {resourceTypeLabels[item.resource_type] || item.resource_type}
                      </RegistryBadge>
                      <span className="text-sm text-foreground group-hover:underline flex-1 break-words">
                        {item.resource_slug}
                      </span>
                      {item.reason && (
                        <span className="text-xs text-muted-foreground truncate">
                          — {item.reason}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Engineering Continuation component for Registry pages.
 * Answers: What should I do next?
 * Mobile: Slide-up panel (Sheet) with grouped accordion actions.
 * Desktop: Clean sidebar card.
 */
export default function EngineeringContinuation({ resources }: EngineeringContinuationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});
  const [hasPulsed, setHasPulsed] = useState(false);

  // Group resources by intent (derive from relationship or use default)
  const grouped = useMemo(() => {
    if (!resources || resources.length === 0) return {};
    
    return resources.reduce<Record<string, RelatedResource[]>>((acc, resource) => {
      const intentMap: Record<string, string> = {
        recommended_for: 'deploy',
        required_for: 'implement',
        used_with: 'implement',
        see_also: 'learn',
      };
      
      const intent = intentMap[resource.relationship] || 'learn';
      if (!acc[intent]) acc[intent] = [];
      acc[intent].push(resource);
      return acc;
    }, {});
  }, [resources]);

  // Scroll-based visibility
  useEffect(() => {
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollDirection = currentScrollY > lastScrollY ? 'down' : 'up';
      const nearBottom = window.innerHeight + currentScrollY >= document.body.scrollHeight - 100;
      
      // Hide on scroll down, show on scroll up or near bottom
      if (scrollDirection === 'down' && !nearBottom) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      
      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Pulse animation on first view - set hasPulsed to true on mount
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHasPulsed(true);
  }, []);

  const toggleGroup = useCallback((intent: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [intent]: !prev[intent]
    }));
  }, []);

  // Expand all groups by default when sheet opens
  useEffect(() => {
    if (isOpen && Object.keys(expandedGroups).length === 0) {
      const allExpanded = Object.keys(grouped).reduce((acc, intent) => {
        acc[intent] = true;
        return acc;
      }, {} as Record<string, boolean>);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setExpandedGroups(allExpanded);
    }
  }, [isOpen, expandedGroups, grouped]);

  if (!resources || resources.length === 0) {
    return null;
  }

  return (
    <>
      <MobileView 
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        isVisible={isVisible}
        hasPulsed={hasPulsed}
        grouped={grouped}
        expandedGroups={expandedGroups}
        toggleGroup={toggleGroup}
      />
      <DesktopView grouped={grouped} />
    </>
  );
}