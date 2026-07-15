'use client';

import { CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VerificationItem {
  check: string;
  description?: string;
}

interface VerificationChecklistProps {
  items: VerificationItem[];
  className?: string;
}

export default function VerificationChecklist({ items, className }: VerificationChecklistProps) {
  if (!items || items.length === 0) return null;

  return (
    <div className={cn('space-y-2', className)}>
      {items.map((item, idx) => (
        <div key={idx} className="flex items-start gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <span className="text-sm text-foreground">{item.check}</span>
            {item.description && (
              <span className="block text-xs text-muted-foreground mt-0.5">{item.description}</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}