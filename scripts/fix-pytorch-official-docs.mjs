#!/usr/bin/env node

/**
 * Fixes the PyTorch package source modules where the `official_docs` field
 * in individual task files contains trailing markdown artifacts.
 *
 * Root Cause: During content authoring, markdown content (horizontal rules,
 * footnote references, HTML spans) was accidentally appended to the URL value
 * of the `official_docs` field in the modular source files under
 * data/packages/pytorch/*.json.
 *
 * Build Impact: The merge pipeline (npm run merge) regenerates data/packages/pytorch.json
 * from these modular source files on every build. If the source files contain
 * corrupted URLs, the merged output will also be corrupted on every build.
 *
 * Fix: For any `official_docs` value containing newlines, extract only the
 * first line (the actual URL) and discard the rest.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pytorchDir = path.resolve(__dirname, '..', 'data', 'packages', 'pytorch');

function fixTaskFile(filePath) {
  const raw = fs.readFileSync(filePath, 'utf-8');
  const data = JSON.parse(raw);
  let modified = false;

  const tasks = Array.isArray(data.tasks) ? data.tasks : (data.task ? [data] : []);
  for (const task of tasks) {
    if (typeof task.official_docs === 'string' && task.official_docs.includes('\n')) {
      const firstLine = task.official_docs.split('\n')[0].trim();
      if (firstLine !== task.official_docs) {
        task.official_docs = firstLine;
        modified = true;
      }
    }
  }

  if (modified) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf-8');
    console.log(`Fixed: ${path.basename(filePath)}`);
  }
}

const files = fs.readdirSync(pytorchDir).filter(f => f.endsWith('.json'));
for (const file of files) {
  fixTaskFile(path.join(pytorchDir, file));
}

console.log('Done. All PyTorch module files cleaned.');