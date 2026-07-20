import test from 'node:test';
import assert from 'node:assert/strict';
import { parseStructuredWhat } from '@/lib/text/parseStructuredWhat';

test('parseStructuredWhat handles simple bullet format (build-rag-system style)', () => {
  const input = `Parse raw document bytes into normalized text fragments and extract structural metadata (title, authors, section headers, page/byte offsets, MIME, language) without changing tokenization or content order.

* Input Artifact: [raw_files: list of bytes + filename + mime]
* Output Artifact: [parsed_documents: list of {doc_id, text, structure_tree, orig_offset}]
* Required Metadata: [doc_id, filename, mime, extraction_timestamp, source_uri]
* Pipeline Contract: "Preserve exact source offsets and produce stable doc_id that survives retries and re-ingestion."
* Primary Consumer: Document Segmentation & Chunking`;

  const result = parseStructuredWhat(input);
  
  assert.ok(result, 'Should parse structured what');
  assert.equal(result?.description, 'Parse raw document bytes into normalized text fragments and extract structural metadata (title, authors, section headers, page/byte offsets, MIME, language) without changing tokenization or content order');
  assert.equal(result?.sections.length, 5);
  assert.equal(result?.sections[0].label, 'Input Artifact:');
  assert.equal(result?.sections[0].text, '[raw_files: list of bytes + filename + mime]');
});

test('parseStructuredWhat handles bold markdown labels (rag-evaluation-harness style)', () => {
  const input = `Build the frozen benchmark corpus, query set, and chunked document inventory that all later evaluations must share.

* **Input Interface Contract:**
  * Artifact: Raw source corpus.
  * Type: documents + metadata table.
  * Ownership: data curation team.

* **Output Interface Contract:**
  * Artifact: Frozen benchmark corpus.
  * Type: parquet/jsonl plus manifest.
  * Ownership: evaluation infrastructure team.

* **Required Metadata:**
  * Corpus source IDs.
  * Chunking strategy ID.
  * Chunk hash.

* **Pipeline Contract:**
  * The corpus must be deterministic for a given source snapshot and chunking policy.
  * Every chunk must be traceable back to a source document and offset range.

* **Primary Consumer:** reference generation, retrieval evaluation, benchmark audits.`;

  const result = parseStructuredWhat(input);
  
  assert.ok(result, 'Should parse structured what with bold labels');
  assert.equal(result?.description, 'Build the frozen benchmark corpus, query set, and chunked document inventory that all later evaluations must share');
  assert.equal(result?.sections.length, 5);
  assert.equal(result?.sections[0].label, 'Input Interface Contract:');
  // The text should include the nested bullet content
  assert.ok(result?.sections[0].text.includes('Artifact: Raw source corpus'));
});

test('parseStructuredWhat returns null for unstructured content', () => {
  const input = `This is just a plain description without any structured labels.
It has multiple lines but no bullet points or labels.`;

  const result = parseStructuredWhat(input);
  assert.equal(result, null, 'Should return null for unstructured content');
});

test('parseStructuredWhat handles Uses: and Production Metrics: labels', () => {
  const input = `Some description here.

* Input Artifact: [input]
* Uses: PyPDFLoader, BeautifulSoup
* Production Metrics: 99.9% uptime, <100ms latency`;

  const result = parseStructuredWhat(input);
  
  assert.ok(result, 'Should parse with Uses and Production Metrics');
  assert.equal(result?.sections.length, 3);
  assert.equal(result?.sections[1].label, 'Uses:');
  assert.equal(result?.sections[2].label, 'Production Metrics:');
});

test('parseStructuredWhat handles dash nested format (hyperparameter-optimization style)', () => {
  const input = `Define the optimization target, direction, budget, and versioned search space before any trial executes.

* Input Interface Contract:
  - Artifact: problem statement and benchmark metric policy.
  - Type: objective specification.
  - Ownership: ML engineering.
  - Persistence: versioned experiment registry.
  - Consumer: dataset preparation and search execution.

* Output Interface Contract:
  - Artifact: optimization contract.
  - Type: objective function spec plus search-space schema.
  - Ownership: experimentation platform.

* Required Metadata:
  - Optimization goal.
  - Metric direction.
  - Budget cap.

* Pipeline Contract:
  - Objective definition remains immutable for the study.
  - Search-space changes require a new study version.

* Uses:
  - Objective framing.
  - Search-space engineering.

* Production Metrics:
  - Primary Metric: objective specification completeness.
  - Expected Range: every study has one versioned objective contract.
  - Alert Threshold: any trial launched without a declared metric direction.`;

  const result = parseStructuredWhat(input);
  
  assert.ok(result, 'Should parse with dash nested format');
  assert.equal(result?.description, 'Define the optimization target, direction, budget, and versioned search space before any trial executes');
  assert.equal(result?.sections.length, 6);
  assert.equal(result?.sections[0].label, 'Input Interface Contract:');
  // The text should include the nested dash content
  assert.ok(result?.sections[0].text.includes('Artifact: problem statement and benchmark metric policy'));
  assert.equal(result?.sections[4].label, 'Uses:');
  assert.ok(result?.sections[4].text.includes('Objective framing'));
});

test('parseStructuredWhat handles real build-rag-system step 1 data', () => {
  // This is the actual data from build-rag-system.json step 1
  const input = `Parse raw document bytes into normalized text fragments and extract structural metadata (title, authors, section headers, page/byte offsets, MIME, language) without changing tokenization or content order.

* Input Artifact: [raw_files: list of bytes + filename + mime]
* Output Artifact: [parsed_documents: list of {doc_id, text, structure_tree, orig_offset}]
* Required Metadata: [doc_id, filename, mime, extraction_timestamp, source_uri]
* Pipeline Contract: "Preserve exact source offsets and produce stable doc_id that survives retries and re-ingestion."
* Primary Consumer: Document Segmentation & Chunking`;

  const result = parseStructuredWhat(input);
  
  assert.ok(result, 'Should parse real build-rag-system data');
  assert.equal(result?.description, 'Parse raw document bytes into normalized text fragments and extract structural metadata (title, authors, section headers, page/byte offsets, MIME, language) without changing tokenization or content order');
  assert.equal(result?.sections.length, 5);
  assert.equal(result?.sections[0].label, 'Input Artifact:');
  assert.equal(result?.sections[0].text, '[raw_files: list of bytes + filename + mime]');
  assert.equal(result?.sections[1].label, 'Output Artifact:');
  assert.equal(result?.sections[2].label, 'Required Metadata:');
  assert.equal(result?.sections[3].label, 'Pipeline Contract:');
  assert.equal(result?.sections[4].label, 'Primary Consumer:');
});

test('parseStructuredWhat handles real rag-evaluation-harness step 1 data', () => {
  // This is the actual data from rag-evaluation-harness.json step 1
  const input = `Build the frozen benchmark corpus, query set, and chunked document inventory that all later evaluations must share.

* **Input Interface Contract:**
  * Artifact: Raw source corpus.
  * Type: documents + metadata table.
  * Ownership: data curation team.
  * Persistence: source repository or object storage.
  * Consumer: dataset versioning step.

* **Output Interface Contract:**
  * Artifact: Frozen benchmark corpus.
  * Type: parquet/jsonl plus manifest.
  * Ownership: evaluation infrastructure team.
  * Persistence: Hugging Face Datasets repository.
  * Consumer: reference generation, retrieval evaluation, benchmark audits.

* **Required Metadata:**
  * Corpus source IDs.
  * Chunking strategy ID.
  * Chunk hash.
  * Document lineage.
  * Creation timestamp.

* **Pipeline Contract:**
  * The corpus must be deterministic for a given source snapshot and chunking policy.
  * Every chunk must be traceable back to a source document and offset range.
  * Any content rebuild must create a new dataset release rather than overwrite the prior one.

* **Primary Consumer:** reference generation, retrieval evaluation, benchmark audits.`;

  const result = parseStructuredWhat(input);
  
  assert.ok(result, 'Should parse real rag-evaluation-harness data');
  assert.equal(result?.description, 'Build the frozen benchmark corpus, query set, and chunked document inventory that all later evaluations must share');
  assert.equal(result?.sections.length, 5);
  assert.equal(result?.sections[0].label, 'Input Interface Contract:');
  // Verify nested content is captured
  assert.ok(result?.sections[0].text.includes('Artifact: Raw source corpus'));
  assert.ok(result?.sections[0].text.includes('Type: documents + metadata table'));
  assert.ok(result?.sections[0].text.includes('Ownership: data curation team'));
});
