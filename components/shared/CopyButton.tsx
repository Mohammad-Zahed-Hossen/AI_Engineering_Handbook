'use client';

import { useState, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface CopyButtonProps {
  text: string;
  className?: string;
}

export default function CopyButton({ text, className }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleClick = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // fallback
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [text]);

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={copied ? 'Copied' : 'Copy to clipboard'}
      className={cn(
        'inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-medium border transition-colors touch-target',
        copied
          ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
          : 'bg-muted text-muted-foreground border-border hover:bg-muted/80 hover:text-foreground',
        className
      )}
    >
      {copied ? 'Copied!' : 'Copy'}
    </button>
  );
}