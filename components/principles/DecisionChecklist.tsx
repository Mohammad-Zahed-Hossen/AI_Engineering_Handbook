'use client';

import { cn } from '@/lib/utils';
import { ClipboardList } from 'lucide-react';

interface DecisionChecklistProps {
  questions: string[];
  className?: string;
}

export default function DecisionChecklist({ 
  questions, 
  className 
}: DecisionChecklistProps) {
  return (
    <div className={cn(
      "rounded-lg border border-border bg-card p-4",
      className
    )}>
      <div className="flex items-center gap-2 mb-3">
        <ClipboardList className="w-4 h-4 text-blue-500" />
        <h3 className="text-xs font-semibold text-foreground">Decision Checklist</h3>
      </div>
      <ul className="space-y-2">
        {questions.map((question, idx) => (
          <li key={idx} className="flex items-start gap-2">
            <span className="text-blue-500 mt-0.5">☑</span>
            <span className="text-xs text-muted-foreground">{question}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}