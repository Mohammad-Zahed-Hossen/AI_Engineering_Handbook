/**
 * Generates lightweight _nav.json index files for each content directory.
 * Run with: npx tsx scripts/build-nav-index.ts
 * 
 * Each _nav.json contains only the fields needed for sidebar navigation:
 * id, name, and version (for packages only).
 * 
 * These files are committed to Git alongside content files.
 */
import fs from 'fs';
import path from 'path';

const dataDir = path.join(process.cwd(), 'data');

interface NavEntry {
  id: string;
  name: string;
  version?: string;
  updated_at?: string;
  type: 'package' | 'model' | 'workflow' | 'cheatsheet' | 'pattern' | 'debug_guide' | 'decision_guide' | 'principle';
  category?: string; // for models: 'ml' | 'dl' | 'llm'
}

function readJSON<T>(filePath: string): T {
  return JSON.parse(fs.readFileSync(filePath, 'utf-8')) as T;
}

function buildNavIndex(
  dirPath: string,
  type: NavEntry['type'],
  options: { versionField?: boolean; category?: string } = {}
): NavEntry[] {
  if (!fs.existsSync(dirPath)) return [];

  return fs.readdirSync(dirPath)
    .filter(f => f.endsWith('.json') && !f.startsWith('_'))
    .sort()
    .map(file => {
      const data = readJSON<Record<string, string>>(path.join(dirPath, file));
      const entry: NavEntry = {
        id: data.id,
        name: data.name,
        type,
        updated_at: data.updated_at ?? data.updatedat ?? '',
      };
      if (options.versionField && data.version) entry.version = data.version;
      if (options.category) entry.category = options.category;
      else if (data.category) entry.category = data.category;
      return entry;
    });
}

function writeNavIndex(dirPath: string, entries: NavEntry[]) {
  if (!fs.existsSync(dirPath)) {
    console.log(`  ⊘ ${dirPath.replace(process.cwd(), '.')} (directory does not exist, skipping)`);
    return;
  }
  const outPath = path.join(dirPath, '_nav.json');
  fs.writeFileSync(outPath, JSON.stringify(entries, null, 2));
  console.log(`  ✓ ${outPath.replace(process.cwd(), '.')} (${entries.length} entries)`);
}

console.log('Building nav indexes...');

// Packages
writeNavIndex(
  path.join(dataDir, 'packages'),
  buildNavIndex(path.join(dataDir, 'packages'), 'package', { versionField: true })
);

// Models
for (const cat of ['ml', 'dl', 'llm'] as const) {
  writeNavIndex(
    path.join(dataDir, 'models', cat),
    buildNavIndex(path.join(dataDir, 'models', cat), 'model', { category: cat })
  );
}

// Workflows
writeNavIndex(
  path.join(dataDir, 'workflows'),
  buildNavIndex(path.join(dataDir, 'workflows'), 'workflow')
);

// Cheatsheets
writeNavIndex(
  path.join(dataDir, 'cheatsheets'),
  buildNavIndex(path.join(dataDir, 'cheatsheets'), 'cheatsheet')
);

// Patterns
writeNavIndex(
  path.join(dataDir, 'patterns'),
  buildNavIndex(path.join(dataDir, 'patterns'), 'pattern')
);

// Debug Guides
writeNavIndex(
  path.join(dataDir, 'debug-guides'),
  buildNavIndex(path.join(dataDir, 'debug-guides'), 'debug_guide')
);

// Decision Guides
writeNavIndex(
  path.join(dataDir, 'decision-guides'),
  buildNavIndex(path.join(dataDir, 'decision-guides'), 'decision_guide')
);

// Principles
writeNavIndex(
  path.join(dataDir, 'principles'),
  buildNavIndex(path.join(dataDir, 'principles'), 'principle')
);

console.log('Done.');
