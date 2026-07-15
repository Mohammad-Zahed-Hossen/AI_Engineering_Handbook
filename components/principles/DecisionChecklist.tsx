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
      "rounded-lg border-2 border-blue-500/30 bg-blue-500/10 overflow-hidden",
      className
    )}>
      <div className="px-4 py-2.5 border-b border-blue-500/30 bg-blue-500/20">
        <div className="flex items-center gap-2">
          <ClipboardList className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          <h3 className="text-xs font-semibold text-foreground">Decision Checklist</h3>
        </div>
      </div>
      <ul className="p-4 space-y-2">
        {questions.map((question, idx) => (
          <li key={idx} className="flex items-start gap-2">
            <span className="text-blue-500 mt-0.5 font-bold">☑</span>
            <span className="text-xs text-foreground">{question}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}