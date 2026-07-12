/**
 * Converts GFM footnote markers [^N] to markdown-style links [[N]](#footnote-N)
 * This is extracted as a shared helper to apply consistently across all narrative fields.
 */
export function linkFootnotes(text: string): string {
  return text.replace(/\[\^(\d+)\]/g, ' [[$1]](#footnote-$1)');
}
