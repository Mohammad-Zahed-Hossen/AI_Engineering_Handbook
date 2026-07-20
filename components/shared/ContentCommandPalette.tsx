'use client';

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Search, X, ChevronRight, Command } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ContentCommandPaletteProps<T> {
  items: T[];
  getLabel: (item: T) => string;
  getDescription?: (item: T) => string | undefined;
  searchText?: (item: T) => string;
  onSelect: (item: T) => void;
  placeholder?: string;
  emptyMessage?: string;
  keyboardShortcut?: string;
}

export default function ContentCommandPalette<T>({
  items,
  getLabel,
  getDescription,
  searchText,
  onSelect,
  placeholder = "Search...",
  emptyMessage = "No results found",
  keyboardShortcut = '/',
}: ContentCommandPaletteProps<T>) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check if we're in an input, textarea, or code element
      const activeElement = document.activeElement;
      const isInputFocused = activeElement?.tagName === 'INPUT' || 
                             activeElement?.tagName === 'TEXTAREA' ||
                             activeElement?.tagName === 'CODE' ||
                             activeElement?.hasAttribute('contenteditable');
      
      // Check if a modal/dialog is open
      const isModalOpen = document.querySelector('[role="dialog"][data-state="open"]') !== null;
      
      // Focus search on keyboard shortcut (when not in input/code/modal)
      if (e.key === keyboardShortcut && !isInputFocused && !isModalOpen) {
        e.preventDefault();
        inputRef.current?.focus();
      }
      
      // Clear on Escape when focused
      if (e.key === 'Escape' && isFocused && !isInputFocused) {
        e.preventDefault();
        setSearchQuery('');
        inputRef.current?.blur();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isFocused, keyboardShortcut]);

  // Search across items
  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return items;

    const query = searchQuery.toLowerCase();
    return items.filter(item => {
      const textToSearch = searchText ? searchText(item) : 
        [getLabel(item), getDescription?.(item)].filter(Boolean).join(' ');
      return textToSearch.toLowerCase().includes(query);
    });
  }, [items, searchQuery, getLabel, getDescription, searchText]);

  // Reset highlighted index when search changes
  useEffect(() => {
    setHighlightedIndex(0);
  }, [searchQuery]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!searchQuery) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex(prev => 
        prev < filteredItems.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex(prev => prev > 0 ? prev - 1 : 0);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredItems[highlightedIndex]) {
        onSelect(filteredItems[highlightedIndex]);
        setSearchQuery('');
        inputRef.current?.blur();
      }
    }
  }, [searchQuery, filteredItems, highlightedIndex, onSelect]);

  const handleItemSelect = (item: T) => {
    onSelect(item);
    setSearchQuery('');
    inputRef.current?.blur();
  };

  if (items.length === 0) return null;

  return (
    <div className="relative">
      {/* Search input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleKeyDown}
          className="w-full pl-10 pr-10 py-2.5 text-sm bg-card text-card-foreground border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring/40 focus:border-ring touch-target"
          aria-label="Search content"
          aria-autocomplete="list"
          aria-expanded={searchQuery.length > 0}
          role="combobox"
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
          <span>{keyboardShortcut}</span>
        </div>
      </div>

      {/* Search results dropdown */}
      {searchQuery && filteredItems.length > 0 && (
        <div 
          className="absolute top-full left-0 right-0 mt-1.5 max-h-80 overflow-y-auto bg-card border border-border rounded-lg shadow-lg z-50 p-1.5"
          role="listbox"
        >
          {filteredItems.map((item, index) => (
            <button
              key={`${getLabel(item)}-${index}`}
              onClick={() => handleItemSelect(item)}
              className={cn(
                "w-full text-left px-3 py-2.5 rounded hover:bg-muted transition-colors flex items-center justify-between group touch-target",
                index === highlightedIndex && "bg-muted"
              )}
              aria-selected={index === highlightedIndex}
              role="option"
            >
              <div>
                <div className="text-xs font-semibold text-foreground">{getLabel(item)}</div>
                {getDescription && (
                  <div className="text-[10px] text-muted-foreground mt-0.5 line-clamp-1">
                    {getDescription(item)}
                  </div>
                )}
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          ))}
        </div>
      )}

      {/* No results */}
      {searchQuery && filteredItems.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-1.5 bg-card border border-border rounded-lg shadow-lg z-50 p-3">
          <p className="text-xs text-muted-foreground text-center">{emptyMessage}</p>
        </div>
      )}
    </div>
  );
}