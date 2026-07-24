'use client';

import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

// Global memory cache to preserve expanded state across tab changes or filter updates
const expandedCache: Record<string, boolean> = {};

interface ExpandableTextProps {
  children: React.ReactNode;
  maxLines?: number;
  fade?: boolean;
  fadeClass?: string;
  cacheKey?: string;
  className?: string;
  moreText?: string;
  lessText?: string;
}

export default function ExpandableText({
  children,
  maxLines,
  fade = true,
  fadeClass = "from-card to-transparent",
  cacheKey,
  className,
  moreText = "... See more",
  lessText = "See less",
}: ExpandableTextProps) {
  const [isExpanded, setIsExpanded] = useState(() => {
    if (cacheKey) {
      return expandedCache[cacheKey] || false;
    }
    return false;
  });

  const [isTruncated, setIsTruncated] = useState(false);
  const [contentHeight, setContentHeight] = useState<number | null>(null);
  const [collapsedHeight, setCollapsedHeight] = useState<number | null>(null);

  // Controls when CSS line-clamp is applied.
  // To avoid sudden height jumps during transitions, we do not clamp while animating.
  const [shouldClamp, setShouldClamp] = useState(!isExpanded);

  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const nextState = !isExpanded;
    setIsExpanded(nextState);
    if (nextState) {
      setShouldClamp(false);
    }
    if (cacheKey) {
      expandedCache[cacheKey] = nextState;
    }
  };

  // Handle transition end to apply clamp when fully collapsed
  const handleTransitionEnd = (e: React.TransitionEvent) => {
    if (e.propertyName === 'max-height') {
      if (!isExpanded) {
        setShouldClamp(true);
      }
    }
  };

  useEffect(() => {
    const measure = () => {
      const container = containerRef.current;
      const content = contentRef.current;
      if (!container || !content) return;

      const fullHeight = content.scrollHeight;
      setContentHeight(fullHeight);

      // Determine if content exceeds line-clamp container height
      const clientH = container.clientHeight;
      if (clientH > 0) {
        setCollapsedHeight(clientH);
        setIsTruncated(fullHeight > clientH + 2);
      } else {
        const lines = maxLines || 4;
        const computedStyle = window.getComputedStyle(container);
        const lineHeight = parseFloat(computedStyle.lineHeight) || 18;
        const estimatedCollapsedHeight = lines * lineHeight;
        setIsTruncated(fullHeight > estimatedCollapsedHeight + 2);
      }
    };

    measure();

    const observer = new ResizeObserver(() => {
      measure();
    });

    if (contentRef.current) {
      observer.observe(contentRef.current);
    }
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [isExpanded, children, maxLines]);

  // Apply visual clamp styling when collapsed and not animating
  const lineClampStyle: React.CSSProperties = maxLines
    ? {
        display: '-webkit-box',
        WebkitBoxOrient: 'vertical',
        WebkitLineClamp: maxLines,
      }
    : {};

  const heightStyle: React.CSSProperties = {};
  if (isExpanded && contentHeight !== null) {
    heightStyle.maxHeight = `${contentHeight}px`;
  } else if (!isExpanded && !shouldClamp && collapsedHeight !== null) {
    // Only set numeric maxHeight during collapse transition animation
    heightStyle.maxHeight = `${collapsedHeight}px`;
  }

  // Get the base background color from the fadeClass to build the horizontal fade
  const horizontalFadeClass = fadeClass ? fadeClass.replace("bg-gradient-to-t", "").trim() : "from-card to-transparent";

  return (
    <div className={cn("relative min-w-0 w-full", className)}>
      <div
        ref={containerRef}
        style={{
          ...heightStyle,
          ...(shouldClamp ? lineClampStyle : {}),
        }}
        className={cn(
          "relative overflow-hidden transition-[max-height] duration-300 ease-in-out",
          !maxLines && shouldClamp && "line-clamp-3 md:line-clamp-5 lg:line-clamp-8"
        )}
        onTransitionEnd={handleTransitionEnd}
      >
        <div ref={contentRef} className="flow-root">
          {children}
          {/* Inline Collapse trigger appended naturally at the end of the text */}
          {isExpanded && isTruncated && (
            <button
              onClick={handleToggle}
              className="inline-flex items-center gap-0.5 text-xs font-semibold text-primary hover:text-primary/80 transition-colors ml-1.5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary rounded px-1 py-0.5 cursor-pointer select-none"
              aria-expanded={isExpanded}
            >
              {lessText}
            </button>
          )}
        </div>

        {/* Subtle vertical fade overlay at the very bottom (optional helper) */}
        {!isExpanded && isTruncated && fade && (
          <div
            className={cn(
              "absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t pointer-events-none transition-opacity duration-300 opacity-40",
              fadeClass
            )}
          />
        )}

        {/* Inline See More horizontal gradient overlay at bottom right */}
        {!isExpanded && isTruncated && (
          <div
            className={cn(
              "absolute bottom-0 right-0 flex items-center pl-10 pr-0.5 h-[1.4em] bg-gradient-to-l pointer-events-auto",
              horizontalFadeClass
            )}
          >
            <button
              onClick={handleToggle}
              className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors cursor-pointer select-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary rounded px-1 py-0.5"
              aria-expanded={isExpanded}
            >
              {moreText}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

