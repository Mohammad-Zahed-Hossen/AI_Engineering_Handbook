import fs from 'node:fs';
import path from 'node:path';
import { ValidationIssue } from './rules/base';
import { KnowledgeGraph } from './context';

export interface QualityReport {
  overallScore: number;
  densityScore: number;
  navigationScore: number;
  ownershipScore: number; // Placeholder for ownership boundary
  searchScore: number;
  completenessScore: number;
  stats: {
    totalFiles: number;
    errors: number;
    warnings: number;
    brokenLinks: number;
    orphans: number;
    placeholders: number;
  };
  issues: ValidationIssue[];
}

export function generateReport(issues: ValidationIssue[], graph: KnowledgeGraph): QualityReport {
  const totalFiles = graph.nodes.size;
  
  // Count stats
  let errors = 0;
  let warnings = 0;
  let brokenLinks = 0;
  let orphans = 0;
  let placeholders = 0;
  let unregisteredTagsOrAliases = 0;

  for (const issue of issues) {
    if (issue.severity === 'critical' || issue.severity === 'high') {
      errors++;
    } else {
      warnings++;
    }

    if (issue.code === 'KQV004') brokenLinks++;
    if (issue.code === 'KQV006') orphans++;
    if (issue.code === 'KQV009') placeholders++;
    if (issue.code === 'KQV010' || issue.code === 'KQV011') unregisteredTagsOrAliases++;
  }

  // Scoring logic (from 0 to 100)
  // 1. Density Score: Penalized by empty placeholder issues
  const densityScore = Math.max(0, Math.round(100 - (placeholders / Math.max(1, totalFiles)) * 100));

  // 2. Navigation Score: Penalized by broken links, orphans, bidirectional violations
  const navIssues = issues.filter(i => ['KQV004', 'KQV005', 'KQV006'].includes(i.code)).length;
  const navigationScore = Math.max(0, Math.round(100 - (navIssues / Math.max(1, totalFiles)) * 100));

  // 3. Ownership boundary (unused/placeholder in Phase 2)
  const ownershipScore = 100;

  // 4. Search Score: Penalized by unregistered tags/aliases or missing tags
  const searchScore = Math.max(0, Math.round(100 - (unregisteredTagsOrAliases / Math.max(1, totalFiles)) * 100));

  // 5. Completeness Score: Registry violations & structural schema issues
  const completeIssues = issues.filter(i => ['KQV001', 'KQV012', 'KQV013'].includes(i.code)).length;
  const completenessScore = Math.max(0, Math.round(100 - (completeIssues / Math.max(1, totalFiles)) * 100));

  const overallScore = Math.round(
    (densityScore + navigationScore + ownershipScore + searchScore + completenessScore) / 5
  );

  return {
    overallScore,
    densityScore,
    navigationScore,
    ownershipScore,
    searchScore,
    completenessScore,
    stats: {
      totalFiles,
      errors,
      warnings,
      brokenLinks,
      orphans,
      placeholders,
    },
    issues: issues.sort((a, b) => b.priority - a.priority), // Sort by priority descending
  };
}

export function printConsoleReport(report: QualityReport): void {
  console.log('\n============================================================');
  console.log('             AENS KNOWLEDGE QUALITY REPORT');
  console.log('============================================================');
  console.log(`Overall Quality Score:   ${report.overallScore}%`);
  console.log('\nCategory Scores:');
  console.log(`  ├─ Knowledge Density:  ${report.densityScore}%`);
  console.log(`  ├─ Navigation:         ${report.navigationScore}%`);
  console.log(`  ├─ Ownership:          ${report.ownershipScore}%`);
  console.log(`  ├─ Search Discovery:   ${report.searchScore}%`);
  console.log(`  └─ Completeness:       ${report.completenessScore}%`);
  console.log('\nStatistics:');
  console.log(`  ├─ Total Files:        ${report.stats.totalFiles}`);
  console.log(`  ├─ Errors (Fails CI):  ${report.stats.errors}`);
  console.log(`  ├─ Warnings:           ${report.stats.warnings}`);
  console.log(`  ├─ Broken Links:       ${report.stats.brokenLinks}`);
  console.log(`  ├─ Orphans Found:      ${report.stats.orphans}`);
  console.log(`  └─ Placeholders Found: ${report.stats.placeholders}`);
  console.log('============================================================\n');

  if (report.issues.length === 0) {
    console.log('✅ No quality issues found in the AENS engineering knowledge graph!');
    return;
  }

  console.log('Detailed Issues List:\n');
  for (const issue of report.issues) {
    const icon = (issue.severity === 'critical' || issue.severity === 'high') ? '❌' : '⚠️';
    console.log(`${icon} [${issue.code}] [${issue.severity.toUpperCase()}] [${issue.category}] ${issue.filePath}`);
    console.log(`   Message:       ${issue.message}`);
    if (issue.suggestedFix) {
      console.log(`   Suggested Fix: ${issue.suggestedFix}`);
    }
    console.log(`   Priority:      ${issue.priority} | Related: ${issue.relatedPages?.join(', ') || 'None'}`);
    console.log('');
  }
}

export function writeMarkdownReport(report: QualityReport): void {
  const targetDir = path.join(process.cwd(), '.aens', 'reports');
  fs.mkdirSync(targetDir, { recursive: true });
  const targetFile = path.join(targetDir, 'quality-report.md');

  let md = `# AENS Knowledge Quality Report\n\n`;
  md += `## Quality Summary\n\n`;
  md += `* **Overall Score**: ${report.overallScore}%\n`;
  md += `* **Knowledge Density Score**: ${report.densityScore}%\n`;
  md += `* **Navigation Score**: ${report.navigationScore}%\n`;
  md += `* **Ownership Score**: ${report.ownershipScore}%\n`;
  md += `* **Search Discovery Score**: ${report.searchScore}%\n`;
  md += `* **Completeness Score**: ${report.completenessScore}%\n\n`;

  md += `### Statistics\n\n`;
  md += `* **Total Files**: ${report.stats.totalFiles}\n`;
  md += `* **Errors (Fail-the-Build)**: ${report.stats.errors}\n`;
  md += `* **Warnings**: ${report.stats.warnings}\n`;
  md += `* **Broken Reference Links**: ${report.stats.brokenLinks}\n`;
  md += `* **Orphaned Pages**: ${report.stats.orphans}\n`;
  md += `* **Empty/Placeholder Sections**: ${report.stats.placeholders}\n\n`;

  md += `## Detailed Issues\n\n`;

  if (report.issues.length === 0) {
    md += `✅ No issues found!\n`;
  } else {
    md += `| Code | Severity | Category | File Path | Message | Suggested Fix | Priority |\n`;
    md += `|---|---|---|---|---|---|---|\n`;
    for (const issue of report.issues) {
      const escapedMsg = issue.message.replace(/\|/g, '\\|');
      const escapedFix = (issue.suggestedFix || '').replace(/\|/g, '\\|');
      md += `| **${issue.code}** | ${issue.severity.toUpperCase()} | ${issue.category} | \`${issue.filePath}\` | ${escapedMsg} | ${escapedFix} | ${issue.priority} |\n`;
    }
  }

  fs.writeFileSync(targetFile, md, 'utf-8');
}
