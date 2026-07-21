import {
  Code,
  Cpu,
  Workflow,
  FileCode2,
  Puzzle,
  Bug,
  Route,
  Lightbulb,
  Database,
  Layers,
  type LucideIcon,
} from "lucide-react";

/**
 * Canonical content type identifiers used across the dashboard.
 */
export type ContentTypeId =
  | 'package'
  | 'model'
  | 'workflow'
  | 'cheatsheet'
  | 'pattern'
  | 'debug_guide'
  | 'decision_guide'
  | 'principle'
  | 'registry';

/**
 * All known content type IDs.
 */
export const ALL_CONTENT_TYPES: ContentTypeId[] = [
  'package',
  'model',
  'workflow',
  'cheatsheet',
  'pattern',
  'debug_guide',
  'decision_guide',
  'principle',
  'registry',
];

// ── Icon map ─────────────────────────────────────────────────

const ICON_MAP: Record<string, LucideIcon> = {
  package: Code,
  model: Cpu,
  workflow: Workflow,
  cheatsheet: FileCode2,
  pattern: Puzzle,
  debug_guide: Bug,
  decision_guide: Route,
  principle: Lightbulb,
  registry: Database,
};

/**
 * Returns the canonical Lucide icon for a content type.
 * Falls back to `Layers` for unknown types.
 */
export function getContentTypeIcon(type: string): LucideIcon {
  return ICON_MAP[type] ?? Layers;
}

// ── Label map ─────────────────────────────────────────────────

const LABEL_MAP: Record<string, string> = {
  package: 'Package',
  model: 'Model',
  workflow: 'Workflow',
  cheatsheet: 'Cheatsheet',
  pattern: 'Pattern',
  debug_guide: 'Debug Guide',
  decision_guide: 'Decision Guide',
  principle: 'Principle',
  registry: 'Registry',
};

/**
 * Returns the human-readable label for a content type.
 * Falls back to the raw type string for unknown types.
 */
export function getContentTypeLabel(type: string): string {
  return LABEL_MAP[type] ?? type;
}

// ── Emoji map ─────────────────────────────────────────────────

const EMOJI_MAP: Record<string, string> = {
  package: '📦',
  model: '🧠',
  workflow: '🔄',
  cheatsheet: '📝',
  pattern: '🧩',
  debug_guide: '🐛',
  decision_guide: '🔀',
  principle: '💡',
  registry: '🗄️',
};

/**
 * Returns an emoji representation for a content type.
 * Falls back to '📄' for unknown types.
 */
export function getContentTypeEmoji(type: string): string {
  return EMOJI_MAP[type] ?? '📄';
}

// ── Accent colour classes ─────────────────────────────────────

interface ContentTypeAccents {
  /** Gradient classes for the icon background (from-{color}-500/10 to-{color}-500/5) */
  gradient: string;
  /** Border colour on hover (hover:border-{color}-500/30) */
  hoverBorder: string;
  /** Tailwind text colour for dark mode (text-{color}-600 dark:text-{color}-400) */
  text: string;
  /** Tailwind background colour for badges (bg-{color}-500/10) */
  badgeBg: string;
  /** Tailwind border colour for badges (border-{color}-500/20) */
  badgeBorder: string;
}

const ACCENT_MAP: Record<string, ContentTypeAccents> = {
  package: {
    gradient: 'from-emerald-500/10 to-emerald-500/5',
    hoverBorder: 'hover:border-emerald-500/30',
    text: 'text-emerald-600 dark:text-emerald-400',
    badgeBg: 'bg-emerald-500/10',
    badgeBorder: 'border-emerald-500/20',
  },
  model: {
    gradient: 'from-violet-500/10 to-violet-500/5',
    hoverBorder: 'hover:border-violet-500/30',
    text: 'text-violet-600 dark:text-violet-400',
    badgeBg: 'bg-violet-500/10',
    badgeBorder: 'border-violet-500/20',
  },
  workflow: {
    gradient: 'from-blue-500/10 to-blue-500/5',
    hoverBorder: 'hover:border-blue-500/30',
    text: 'text-blue-600 dark:text-blue-400',
    badgeBg: 'bg-blue-500/10',
    badgeBorder: 'border-blue-500/20',
  },
  cheatsheet: {
    gradient: 'from-amber-500/10 to-amber-500/5',
    hoverBorder: 'hover:border-amber-500/30',
    text: 'text-amber-600 dark:text-amber-400',
    badgeBg: 'bg-amber-500/10',
    badgeBorder: 'border-amber-500/20',
  },
  pattern: {
    gradient: 'from-orange-500/10 to-orange-500/5',
    hoverBorder: 'hover:border-orange-500/30',
    text: 'text-orange-600 dark:text-orange-400',
    badgeBg: 'bg-orange-500/10',
    badgeBorder: 'border-orange-500/20',
  },
  debug_guide: {
    gradient: 'from-red-500/10 to-red-500/5',
    hoverBorder: 'hover:border-red-500/30',
    text: 'text-red-600 dark:text-red-400',
    badgeBg: 'bg-red-500/10',
    badgeBorder: 'border-red-500/20',
  },
  decision_guide: {
    gradient: 'from-cyan-500/10 to-cyan-500/5',
    hoverBorder: 'hover:border-cyan-500/30',
    text: 'text-cyan-600 dark:text-cyan-400',
    badgeBg: 'bg-cyan-500/10',
    badgeBorder: 'border-cyan-500/20',
  },
  principle: {
    gradient: 'from-purple-500/10 to-purple-500/5',
    hoverBorder: 'hover:border-purple-500/30',
    text: 'text-purple-600 dark:text-purple-400',
    badgeBg: 'bg-purple-500/10',
    badgeBorder: 'border-purple-500/20',
  },
  registry: {
    gradient: 'from-rose-500/10 to-rose-500/5',
    hoverBorder: 'hover:border-rose-500/30',
    text: 'text-rose-600 dark:text-rose-400',
    badgeBg: 'bg-rose-500/10',
    badgeBorder: 'border-rose-500/20',
  },
};

const DEFAULT_ACCENT: ContentTypeAccents = {
  gradient: 'from-muted-foreground/10 to-muted-foreground/5',
  hoverBorder: 'hover:border-foreground/20',
  text: 'text-foreground',
  badgeBg: 'bg-muted/30',
  badgeBorder: 'border-border',
};

/**
 * Returns the accent colour configuration for a given content type.
 * Falls back to muted defaults for unknown types.
 */
export function getContentTypeAccent(type: string): ContentTypeAccents {
  return ACCENT_MAP[type] ?? DEFAULT_ACCENT;
}

/**
 * Convenience: returns a combined bg-gradient + border + hover class string for cards.
 * For use in className attributes.
 */
export function getContentTypeCardClasses(type: string): string {
  const a = getContentTypeAccent(type);
  return `bg-gradient-to-br ${a.gradient} ${a.badgeBorder} ${a.hoverBorder}`;
}



