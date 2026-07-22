'use client';

import { useState, useEffect } from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuickIdentificationItem {
  check: string;
  description?: string;
}

interface QuickIdentificationChecklistProps {
  items: QuickIdentificationItem[];
  guideId: string;
  className?: string;
}

export default function QuickIdentificationChecklist({ items, guideId, className }: QuickIdentificationChecklistProps) {
  const storageKey = `quick-identification-${guideId}`;
  const [checkedItems, setCheckedItems] = useState<Set<number>>(new Set());
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCheckedItems(new Set(JSON.parse(stored)));
    }
    setIsLoaded(true);
  }, [storageKey]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(storageKey, JSON.stringify(Array.from(checkedItems)));
    }
  }, [checkedItems, storageKey, isLoaded]);

  const toggleItem = (idx: number) => {
    const newChecked = new Set(checkedItems);
    if (newChecked.has(idx)) {
      newChecked.delete(idx);
    } else {
      newChecked.add(idx);
    }
    setCheckedItems(newChecked);
  };

  if (!items || items.length === 0) return null;

  return (
    <div className={cn('space-y-2', className)}>
      {items.map((item, idx) => (
        <button
          key={idx}
          onClick={() => toggleItem(idx)}
          className="flex items-start gap-2 w-full text-left hover:bg-muted/30 rounded p-1 -m-1 transition-colors"
        >
          <span className={cn(
            'shrink-0 w-4 h-4 flex items-center justify-center rounded border text-[10px] font-bold mt-0.5 transition-colors',
            checkedItems.has(idx)
              ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-600'
              : 'border-border bg-muted'
          )}>
            {checkedItems.has(idx) && <Check className="w-3 h-3" />}
          </span>
          <div className="flex-1">
            <span className={cn(
              'text-sm',
              checkedItems.has(idx) ? 'text-muted-foreground line-through' : 'text-foreground'
            )}>
              {item.check}
            </span>
            {item.description && (
              <span className="block text-xs text-muted-foreground mt-0.5">{item.description}</span>
            )}
          </div>
        </button>
      ))}
    </div>
  );
}