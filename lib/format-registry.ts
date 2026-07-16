/**
 * Shared formatting utilities for registry components.
 * Consolidates duplicated logic for displaying model specs, hardware, and other values.
 */

/**
 * Formats a size in MB to a human-readable string (GB).
 * @param sizeMb - Size in megabytes
 * @returns Formatted string like "140.0 GB" or "—" if not provided
 */
export function formatSize(sizeMb?: number): string {
  return sizeMb ? `${(sizeMb / 1000).toFixed(1)} GB` : '—';
}

/**
 * Formats a parameter count to a human-readable string (B for billions).
 * @param params - Parameter count
 * @returns Formatted string like "70B" or "—" if not provided
 */
export function formatParameterCount(params?: number): string {
  return params ? `${(params / 1000).toFixed(0)}B` : '—';
}

/**
 * Formats a context window to a human-readable string (K for thousands).
 * @param context - Context window size
 * @returns Formatted string like "128K" or "—" if not provided
 */
export function formatContextWindow(context?: number): string {
  if (!context) return '—';
  return context >= 1000 ? `${(context / 1000).toFixed(0)}K` : `${context}`;
}

/**
 * Formats memory in MB to a human-readable string (GB if >= 1000MB).
 * @param memoryMb - Memory in megabytes
 * @returns Formatted string like "24GB" or "8192MB"
 */
export function formatMemory(memoryMb?: number): string {
  if (!memoryMb) return '—';
  return memoryMb >= 1000 ? `${(memoryMb / 1000).toFixed(0)}GB` : `${memoryMb}MB`;
}

/**
 * Formats a memory value for display with a label.
 * @param memoryMb - Memory in megabytes
 * @param label - Label to prepend (e.g., "Min", "Rec")
 * @returns Formatted string like "Min: 24GB" or "—"
 */
export function formatMemoryWithLabel(memoryMb?: number, label?: string): string {
  if (!memoryMb) return '—';
  const formatted = formatMemory(memoryMb);
  return label ? `${label}: ${formatted}` : formatted;
}

/**
 * Truncates an array to a maximum length and returns a suffix indicator.
 * @param items - Array of items
 * @param max - Maximum items to show
 * @returns Object with visible items and count of remaining items
 */
export function truncateList<T>(items: T[], max: number): { visible: T[]; remaining: number } {
  if (items.length <= max) return { visible: items, remaining: 0 };
  return { visible: items.slice(0, max), remaining: items.length - max };
}