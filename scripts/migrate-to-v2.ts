/**
 * Migration Script: Add AENS v2 BaseMetaSchema fields to existing JSON files
 * 
 * This script automatically adds the new required fields from BaseMetaSchema to existing
 * content files to align with the AENS Knowledge Layer Specification v1.0.
 * 
 * Run with: npx tsx scripts/migrate-to-v2.ts
 */

import fs from 'fs';
import path from 'path';

const dataDir = path.join(process.cwd(), 'data');

// Default values for new BaseMetaSchema fields
const DEFAULT_BASE_META = {
  title: '', // Will be set from 'name' field
  slug: '', // Will be set from 'id' field
  description: '', // Will be set from 'summary' field if available
  tags: [],
  aliases: [],
  keywords: [],
  search_tokens: [],
  domain: '',
  category: '',
  difficulty: 'intermediate' as const,
  engineering_area: '',
  estimated_reading_time: 60,
  prerequisites: [],
  recommended_next: [],
  related_content: [],
  last_verified: '',
  review_frequency: 'quarterly' as const,
  verified_against: '',
  compatible_versions: [],
  breaking_changes: [],
  canonical_status: 'canonical' as const,
  lifecycle: 'stable' as const,
  stability: 'semi_stable' as const,
  confidence: 'production_proven' as const,
  engineering_maturity: 'production_ready' as const,
};

function getJsonFiles(dir: string): string[] {
  let results: string[] = [];
  if (!fs.existsSync(dir)) return results;
  for (const file of fs.readdirSync(dir)) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      results = results.concat(getJsonFiles(filePath));
    } else if (file.endsWith('.json') && !file.startsWith('_')) {
      results.push(filePath);
    }
  }
  return results;
}

function detectContentType(filePath: string): string | null {
  const relativePath = path.relative(dataDir, filePath).replace(/\\/g, '/');
  if (relativePath.startsWith('packages/')) return 'package';
  if (relativePath.startsWith('models/')) return 'model';
  if (relativePath.startsWith('workflows/')) return 'workflow';
  if (relativePath.startsWith('cheatsheets/')) return 'cheatsheet';
  if (relativePath.startsWith('registry/')) return 'registry';
  return null;
}

interface MigrationData {
  id?: string;
  name?: string;
  title?: string;
  slug?: string;
  description?: string;
  summary?: string;
  updated_at?: string;
  last_verified?: string;
  domain?: string;
  category?: string;
  engineering_area?: string;
  stability?: string;
  [key: string]: unknown;
}

interface MigratedBase {
  title: string;
  slug: string;
  description: string;
  tags: string[];
  aliases: string[];
  keywords: string[];
  search_tokens: string[];
  domain: string;
  category: string;
  difficulty: "beginner" | "intermediate" | "advanced" | "expert";
  engineering_area: string;
  estimated_reading_time: number;
  prerequisites: string[];
  recommended_next: string[];
  related_content: unknown[];
  last_verified: string;
  review_frequency: "monthly" | "quarterly" | "semi_annually" | "annually";
  verified_against: string;
  compatible_versions: string[];
  breaking_changes: string[];
  canonical_status: "canonical" | "reference" | "generated";
  lifecycle: "draft" | "verified" | "stable" | "deprecated" | "archived";
  stability: "stable" | "semi_stable" | "volatile";
  confidence?: "verified" | "production_proven" | "community_accepted" | "experimental" | "research";
  engineering_maturity?: "research" | "experimental" | "emerging" | "production_ready" | "legacy";
  sources?: string[];
  github_repo?: string;
  
  id?: string;
  name?: string;
  summary?: string;
  updated_at?: string;
}

function migrateFile(filePath: string, contentType: string): void {
  let data: MigrationData;
  try {
    data = JSON.parse(fs.readFileSync(filePath, 'utf-8')) as MigrationData;
  } catch (e) {
    console.error(`❌ Failed to parse ${filePath}: ${(e as Error).message}`);
    return;
  }

  // Skip if already migrated (has 'title' field)
  if (data.title !== undefined) {
    console.log(`⊘ ${filePath} (already migrated)`);
    return;
  }

  // Add default values for missing fields
  const migrated: MigratedBase = { ...DEFAULT_BASE_META, ...data } as unknown as MigratedBase;

  // Set derived fields from existing data
  if (!migrated.title && migrated.name) {
    migrated.title = migrated.name;
  }
  if (!migrated.slug && migrated.id) {
    migrated.slug = migrated.id;
  }
  if (!migrated.description && migrated.summary) {
    migrated.description = migrated.summary.substring(0, 200) + (migrated.summary.length > 200 ? '...' : '');
  }
  if (!migrated.last_verified && migrated.updated_at) {
    migrated.last_verified = migrated.updated_at;
  }

  // Content-type specific defaults
  if (contentType === 'package') {
    migrated.domain = migrated.domain || 'data_processing';
    migrated.category = migrated.category || 'data';
    migrated.engineering_area = migrated.engineering_area || 'data_engineering';
    migrated.stability = migrated.stability || 'semi_stable';
  } else if (contentType === 'model') {
    migrated.domain = migrated.domain || 'ml';
    migrated.category = migrated.category || migrated.category || 'ml';
    migrated.engineering_area = migrated.engineering_area || 'machine_learning';
    migrated.stability = migrated.stability || 'stable';
  } else if (contentType === 'workflow') {
    migrated.domain = migrated.domain || 'engineering';
    migrated.category = migrated.category || migrated.category || 'ml_ops';
    migrated.engineering_area = migrated.engineering_area || 'mlops';
    migrated.stability = migrated.stability || 'stable';
  } else if (contentType === 'cheatsheet') {
    migrated.domain = migrated.domain || 'syntax';
    migrated.category = migrated.category || 'reference';
    migrated.engineering_area = migrated.engineering_area || 'development';
    migrated.stability = migrated.stability || 'semi_stable';
  }

  // Write migrated file
  fs.writeFileSync(filePath, JSON.stringify(migrated, null, 2));
  console.log(`✓ ${filePath}`);
}

function main() {
  console.log('🔄 Starting AENS v2 migration...\n');

  const files = getJsonFiles(dataDir);
  console.log(`📊 Found ${files.length} JSON files to migrate\n`);

  let migratedCount = 0;
  let skippedCount = 0;

  for (const file of files) {
    const contentType = detectContentType(file);
    if (!contentType) {
      console.log(`⊘ ${file} (unknown content type, skipping)`);
      skippedCount++;
      continue;
    }

    try {
      migrateFile(file, contentType);
      migratedCount++;
    } catch (e) {
      console.error(`❌ Failed to migrate ${file}: ${(e as Error).message}`);
    }
  }

  console.log(`\n📊 Migration Summary`);
  console.log(`   Files migrated: ${migratedCount}`);
  console.log(`   Files skipped: ${skippedCount}`);
  console.log(`\n✅ Migration complete!`);
  console.log(`\n⚠️  Next steps:`);
  console.log(`   1. Review migrated files and fill in appropriate values for new fields`);
  console.log(`   2. Run validation: npm run validate`);
  console.log(`   3. Rebuild nav index: npm run build:nav`);
}

main();
