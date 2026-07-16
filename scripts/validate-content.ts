import { loadConfig } from '../lib/config/loader.js';
import { buildValidationContext } from '../lib/validator/context.js';
import { RuleEngine } from '../lib/validator/engine.js';
import { generateReport, printConsoleReport, writeMarkdownReport } from '../lib/validator/report.js';

async function main() {
  try {
    // Parse arguments
    const categoryIdx = process.argv.indexOf('--category');
    let categoryFilter: string | undefined = undefined;
    if (categoryIdx !== -1 && process.argv[categoryIdx + 1]) {
      categoryFilter = process.argv[categoryIdx + 1];
    } else {
      // Support shorthand category options like pnpm validate:registry mapping to --category registry
      const categoryArg = process.argv.find(arg => arg.startsWith('--category='));
      if (categoryArg) {
        categoryFilter = categoryArg.split('=')[1];
      }
    }

    const quiet = process.argv.includes('--quiet') || process.argv.includes('-q');

    if (!quiet) {
      console.log('📊 Starting AENS Knowledge Quality Validator...');
    }

    // 1. Load AENS Config
    const config = await loadConfig();

    // 2. Build graph context
    const contextResult = await buildValidationContext();
    if (contextResult.errors.length > 0) {
      console.error('❌ Failed to construct knowledge graph due to file loading errors:');
      for (const err of contextResult.errors) {
        console.error(`  - ${err}`);
      }
      process.exit(1);
    }

    const context = {
      graph: contextResult.graph,
      config,
      registeredTags: contextResult.registeredTags,
      registeredAliases: contextResult.registeredAliases,
    };

    // 3. Instantiate Rule Engine and run checks
    const engine = new RuleEngine();
    const issues = await engine.run(context, categoryFilter);

    // 4. Generate report metrics
    const report = generateReport(issues, context.graph);

    // 5. Output formats
    if (!quiet) {
      printConsoleReport(report);
    }
    writeMarkdownReport(report);

    // 6. Enforce Build Failure Strategy
    // Fail the build only on deterministic Critical/High issues (errors)
    const failsCI = report.issues.some(issue => issue.severity === 'critical' || issue.severity === 'high');

    if (failsCI) {
      if (!quiet) {
        console.error(`\n❌ Validation failed: ${report.stats.errors} critical/high error(s) detected.`);
      }
      process.exit(1);
    }

    if (!quiet) {
      console.log('\n✅ Validation succeeded. All content files and references verified successfully.');
    }
    process.exit(0);

  } catch (error) {
    console.error('❌ Unhandled validator exception:', error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

main();
