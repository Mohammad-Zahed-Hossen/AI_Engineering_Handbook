'use client';

import { useState } from 'react';
import { Link2, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SectionHeadingProps {
  id?: string;
  title: string;
  level?: 1 | 2 | 3 | 4;
  className?: string;
  children?: React.ReactNode;
  showAnchorLink?: boolean;
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

export default function SectionHeading({
  id,
  title,
  level = 2,
  className,
  children,
  showAnchorLink = true,
}: SectionHeadingProps) {
  const [copied, setCopied] = useState(false);
  const slugId = id || slugify(title);

  const handleCopyLink = (e: React.MouseEvent) => {
    e.preventDefault();
    if (typeof window === 'undefined') return;

    const fullUrl = `${window.location.origin}${window.location.pathname}#${slugId}`;
    navigator.clipboard.writeText(fullUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });

    // Update browser URL hash cleanly without forcing a page jump
    window.history.replaceState(null, '', `#${slugId}`);
  };

  const baseStyles = {
    1: 'text-2xl font-bold tracking-tight text-foreground',
    2: 'text-lg font-semibold tracking-tight text-foreground',
    3: 'text-base font-medium text-foreground',
    4: 'text-sm font-medium text-foreground',
  }[level];

  const content = (
    <>
      {children}
      <span>{title}</span>
      {showAnchorLink && (
        <button
          onClick={handleCopyLink}
          className="opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity p-1 text-muted-foreground hover:text-foreground touch-target-sm"
          title="Copy direct link to section"
          aria-label={`Copy link to section ${title}`}
        >
          {copied ? (
            <Check className="h-3.5 w-3.5 text-emerald-500" />
          ) : (
            <Link2 className="h-3.5 w-3.5" />
          )}
        </button>
      )}
    </>
  );

  const headingClasses = cn('group flex items-center gap-2 scroll-mt-24', baseStyles, className);

  switch (level) {
    case 1:
      return <h1 id={slugId} className={headingClasses}>{content}</h1>;
    case 3:
      return <h3 id={slugId} className={headingClasses}>{content}</h3>;
    case 4:
      return <h4 id={slugId} className={headingClasses}>{content}</h4>;
    case 2:
    default:
      return <h2 id={slugId} className={headingClasses}>{content}</h2>;
  }
}
