'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { Search, X, ChevronRight, Command } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TaskForSearch {
  task: string;
  mental_trigger?: string;
  syntax: string;
  important_params?: string[];
  gotchas?: string[];
}

interface QuickCommandPaletteProps {
  tasks: TaskForSearch[];
  onTaskSelect?: (taskIndex: number) => void;
}

export default function QuickCommandPalette({ tasks, onTaskSelect }: QuickCommandPaletteProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Focus search on / key (when not already in an input)
      if (e.key === '/' && e.target !== inputRef.current) {
        const activeElement = document.activeElement;
        const isInputFocused = activeElement?.tagName === 'INPUT' || activeElement?.tagName === 'TEXTAREA';
        if (!isInputFocused) {
          e.preventDefault();
          inputRef.current?.focus();
        }
      }
      // Clear on Escape when focused
      if (e.key === 'Escape' && isFocused) {
        e.preventDefault();
        setSearchQuery('');
        inputRef.current?.blur();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isFocused]);

  // Search across multiple fields
  const filteredTasks = useMemo(() => {
    if (!searchQuery.trim()) return tasks;

    const query = searchQuery.toLowerCase();
    return tasks.filter(task => {
      return (
        task.task.toLowerCase().includes(query) ||
        (task.mental_trigger && task.mental_trigger.toLowerCase().includes(query)) ||
        task.syntax.toLowerCase().includes(query) ||
        (task.important_params && task.important_params.some(p => p.toLowerCase().includes(query))) ||
        (task.gotchas && task.gotchas.some(g => g.toLowerCase().includes(query)))
      );
    });
  }, [tasks, searchQuery]);

  const handleTaskClick = (index: number) => {
    onTaskSelect?.(index);
    setSearchQuery('');
    inputRef.current?.blur();
  };

  if (tasks.length === 0) return null;

  return (
    <div className="relative">
      {/* Search input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          placeholder="Search tasks, syntax, parameters..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="w-full pl-10 pr-10 py-2.5 text-sm bg-card text-card-foreground border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring/40 focus:border-ring touch-target"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors touch-target p-1"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
        {/* Keyboard hint */}
        <div className="absolute right-10 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-1 text-[10px] text-muted-foreground pointer-events-none">
          <Command className="h-3 w-3" />
          <span>/</span>
        </div>
      </div>

      {/* Search results dropdown */}
      {searchQuery && filteredTasks.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1.5 max-h-80 overflow-y-auto bg-card border border-border rounded-lg shadow-lg z-50 p-1.5">
          {filteredTasks.map((task, index) => {
            const originalIndex = tasks.findIndex(t => t.task === task.task);
            return (
              <button
                key={task.task}
                onClick={() => handleTaskClick(originalIndex)}
                className="w-full text-left px-3 py-2.5 rounded hover:bg-muted transition-colors flex items-center justify-between group touch-target"
              >
                <div>
                  <div className="text-xs font-semibold text-foreground">{task.task}</div>
                  {task.mental_trigger && (
                    <div className="text-[10px] text-muted-foreground mt-0.5 line-clamp-1">
                      {task.mental_trigger}
                    </div>
                  )}
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            );
          })}
        </div>
      )}

      {/* No results */}
      {searchQuery && filteredTasks.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-1.5 bg-card border border-border rounded-lg shadow-lg z-50 p-3">
          <p className="text-xs text-muted-foreground text-center">No tasks match "{searchQuery}"</p>
        </div>
      )}
    </div>
  );
}