import { ValidationRule, ValidationContext, ValidationIssue } from './base.js';

export class URLFormatRule implements ValidationRule {
  meta = {
    id: 'KQV017',
    category: 'completeness',
    severity: 'high' as const,
    autofix: false,
    docs: '/docs/kqv/rules/url-format.md'
  };

  name = 'URL Format & Integrity';
  description = 'Validates URL syntax, protocol scheme (https:// or http://), valid hostname structure, and detects duplicate URLs within source lists.';

  async validate(context: ValidationContext): Promise<ValidationIssue[]> {
    const issues: ValidationIssue[] = [];
    const { graph } = context;

    for (const node of graph.getAllNodes()) {
      const data = node.data as Record<string, unknown> | null;
      if (!data) continue;

      const urlList: Array<{ url: string; field: string; checkDuplicate?: boolean }> = [];

      // Extract sources (check duplicates within sources array)
      if (Array.isArray(data.sources)) {
        data.sources.forEach((src, idx) => {
          if (typeof src === 'string') {
            urlList.push({ url: src, field: `sources[${idx}]`, checkDuplicate: true });
          } else if (src && typeof src === 'object' && typeof (src as Record<string, string>).url === 'string') {
            urlList.push({ url: (src as Record<string, string>).url, field: `sources[${idx}].url`, checkDuplicate: true });
          }
        });
      }

      // Extract github_repo & official_docs
      if (typeof data.github_repo === 'string') {
        urlList.push({ url: data.github_repo, field: 'github_repo' });
      }

      if (typeof data.official_docs === 'string') {
        urlList.push({ url: data.official_docs, field: 'official_docs' });
      }

      // Extract docs_url in tasks/entries (validate syntax & scheme, ignore multi-task doc hub reuse)
      if (Array.isArray(data.tasks)) {
        data.tasks.forEach((t, idx) => {
          if (t && typeof t === 'object' && typeof (t as Record<string, string>).official_docs === 'string') {
            urlList.push({ url: (t as Record<string, string>).official_docs, field: `tasks[${idx}].official_docs` });
          }
        });
      }

      if (Array.isArray(data.entries)) {
        data.entries.forEach((e, idx) => {
          if (e && typeof e === 'object' && typeof (e as Record<string, string>).docs_url === 'string') {
            urlList.push({ url: (e as Record<string, string>).docs_url, field: `entries[${idx}].docs_url` });
          }
        });
      }

      const seenSourceUrls = new Set<string>();

      for (const { url, field, checkDuplicate } of urlList) {
        const trimmed = url.trim();
        if (!trimmed) {
          issues.push({
            code: 'KQV017',
            ruleId: 'empty-url',
            category: this.meta.category,
            severity: 'high',
            filePath: node.filePath,
            message: `Empty URL found on field '${field}'.`,
            suggestedFix: 'Provide a valid https:// URL or remove empty field.',
            priority: 8
          });
          continue;
        }

        // Validate URL syntax without network requests
        try {
          // Remove footnote reference tags if present (e.g., [^1])
          const cleanUrl = trimmed.replace(/\[\^\d+\]/g, '').trim();
          const parsed = new URL(cleanUrl);

          if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
            issues.push({
              code: 'KQV017',
              ruleId: 'invalid-url-scheme',
              category: this.meta.category,
              severity: 'high',
              filePath: node.filePath,
              message: `Invalid URL protocol scheme on '${field}': '${trimmed}'. Must use http:// or https://`,
              suggestedFix: 'Update URL protocol scheme to https://',
              priority: 8
            });
          }

          if (checkDuplicate) {
            if (seenSourceUrls.has(cleanUrl)) {
              issues.push({
                code: 'KQV017',
                ruleId: 'duplicate-url',
                category: this.meta.category,
                severity: 'low',
                filePath: node.filePath,
                message: `Duplicate URL found in sources array on field '${field}': '${cleanUrl}'.`,
                suggestedFix: 'Remove duplicate URL from sources list.',
                priority: 3
              });
            } else {
              seenSourceUrls.add(cleanUrl);
            }
          }
        } catch {
          issues.push({
            code: 'KQV017',
            ruleId: 'malformed-url',
            category: this.meta.category,
            severity: 'high',
            filePath: node.filePath,
            message: `Malformed URL structure on field '${field}': '${trimmed}'.`,
            suggestedFix: 'Fix URL syntax to form a valid Web URL.',
            priority: 8
          });
        }
      }
    }

    return issues;
  }
}
