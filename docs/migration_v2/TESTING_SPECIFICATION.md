# Testing Specification
**Version:** 1.0
**Purpose:** Test architecture, fixtures, coverage requirements, validation strategy, and regression requirements
**Status:** Final specification before implementation
**Governed by:** IMPLEMENTATION_SPECIFICATION.md

---

# Specification Purpose

This document specifies the complete testing strategy for the AENS repository:

- Test architecture and structure
- Fixture requirements
- Coverage thresholds
- Validation testing strategy
- Regression testing requirements
- Test data management
- Mock specifications

**No AI agent should make testing decisions.** All testing approaches are specified here.

---

# Test Architecture

## Test Structure

```
tests/
├── unit/
│   ├── config/
│   │   └── loader.test.ts
│   ├── content/
│   │   ├── loaders.test.ts
│   │   ├── resolvers.test.ts
│   │   ├── registry.test.ts
│   │   └── cache.test.ts
│   ├── validation/
│   │   ├── layer1-schema.test.ts
│   │   ├── layer2-constraints.test.ts
│   │   ├── layer3-crossref.test.ts
│   │   └── layer4-semantic.test.ts
│   └── utils/
│       └── helpers.test.ts
├── integration/
│   ├── content-loading.test.ts
│   ├── validation-pipeline.test.ts
│   ├── search-indexing.test.ts
│   └── navigation-generation.test.ts
├── e2e/
│   ├── content-workflow.test.ts
│   └── ui-interaction.test.ts
├── fixtures/
│   ├── content/
│   │   ├── valid/
│   │   │   ├── package.json
│   │   │   ├── model.json
│   │   │   ├── workflow.json
│   │   │   ├── cheatsheet.json
│   │   │   └── registry.json
│   │   └── invalid/
│   │       ├── missing-required.json
│   │       ├── invalid-type.json
│   │       ├── size-budget-violation.json
│   │       ├── broken-reference.json
│   │       └── unregistered-tag.json
│   └── metadata/
│       ├── tags.json
│       ├── aliases.json
│       └── categories.json
└── mocks/
    ├── filesystem.ts
    ├── cache.ts
    └── config.ts
```

---

## Test Categories

### Unit Tests
**Purpose:** Test individual functions and modules in isolation

**Scope:**
- Single function
- Single class
- Single module

**Dependencies:** Mocked

**Execution Time:** < 1s per test

---

### Integration Tests
**Purpose:** Test interaction between multiple modules

**Scope:**
- Module-to-module interaction
- Data flow through pipeline
- End-to-end subsystem

**Dependencies:** Real (or high-fidelity mocks)

**Execution Time:** < 5s per test

---

### End-to-End Tests
**Purpose:** Test complete user workflows

**Scope:**
- Complete user journey
- UI interaction
- Full stack

**Dependencies:** Real

**Execution Time:** < 30s per test

---

# Coverage Requirements

## Coverage Thresholds

**Minimum Thresholds:**
- Statements: 80%
- Branches: 80%
- Functions: 80%
- Lines: 80%

**Target Thresholds:**
- Statements: 90%
- Branches: 90%
- Functions: 90%
- Lines: 90%

**Critical Path Thresholds:**
- Content loading: 100%
- Validation pipeline: 100%
- Search indexing: 100%
- Navigation generation: 100%

---

## Coverage Exclusions

**Excluded Files:**
- tests/ (test files)
- fixtures/ (test data)
- mocks/ (test mocks)
- .next/ (build output)
- coverage/ (coverage reports)
- legacy/ (archived code)

**Excluded Patterns:**
- `*.test.ts`
- `*.spec.ts`
- `*.mock.ts`
- `*.fixture.ts`

---

# Fixture Specifications

## Content Fixtures

### Valid Package Fixture
**File:** tests/fixtures/content/valid/package.json

**Purpose:** Valid package content for testing

**Structure:**
```json
{
  "schema_version": "2.0",
  "id": "package:test-package",
  "title": "Test Package",
  "slug": "test-package",
  "aliases": ["tp"],
  "description": "A test package for testing",
  "tags": ["test"],
  "status": "complete",
  "stability": "stable",
  "versioning": {
    "verified_against": "1.0.0",
    "last_verified_at": "2026-06-30T00:00:00Z"
  },
  "created_at": "2026-06-30T00:00:00Z",
  "updated_at": "2026-06-30T00:00:00Z",
  "sources": [
    {
      "url": "https://example.com",
      "title": "Example Source",
      "accessed_at": "2026-06-30T00:00:00Z"
    }
  ],
  "relationships": {
    "packages": [],
    "models": [],
    "workflows": [],
    "cheatsheets": [],
    "registry": []
  },
  "keywords": ["test", "package"],
  "content_role": "index",
  "common_tasks": [
    {
      "name": "Test Task",
      "description": "A test task",
      "code": "test()",
      "gotchas": ["Test gotcha"]
    }
  ],
  "production_considerations": "Test production considerations",
  "decision_notes": "Test decision notes"
}
```

---

### Valid Model Fixture
**File:** tests/fixtures/content/valid/model.json

**Purpose:** Valid model content for testing

**Structure:** Similar to package, with model-specific fields (architecture, evaluation, decision_guide)

---

### Valid Workflow Fixture
**File:** tests/fixtures/content/valid/workflow.json

**Purpose:** Valid workflow content for testing

**Required Fields:**
- mental_trigger (string)
- entry_points (array)
- prerequisites (object with confirmed_env)
- pipeline_failure_patterns (array)
- steps (array, max 8)
- production_notes (object)

---

### Valid Cheatsheet Fixture
**File:** tests/fixtures/content/valid/cheatsheet.json

**Purpose:** Valid cheatsheet content for testing

**Required Fields:**
- entries (array, max 30)

---

### Valid Registry Fixture
**File:** tests/fixtures/content/valid/registry.json

**Purpose:** Valid registry content for testing

**Required Fields:**
- asset_type (enum: model|dataset|service)
- deployment (object)
- hardware_requirements (object)

---

## Invalid Content Fixtures

### Missing Required Field
**File:** tests/fixtures/content/invalid/missing-required.json

**Purpose:** Test Layer 1 validation (missing required field)

**Structure:** Valid content minus one required field

**Expected Error:** Layer 1 validation error

---

### Invalid Type
**File:** tests/fixtures/content/invalid/invalid-type.json

**Purpose:** Test Layer 1 validation (wrong type)

**Structure:** Valid content with wrong type for a field

**Expected Error:** Layer 1 validation error

---

### Size Budget Violation
**File:** tests/fixtures/content/invalid/size-budget-violation.json

**Purpose:** Test Layer 2 validation (size budget exceeded)

**Structure:** Valid content with array exceeding maxItems

**Expected Error:** Layer 2 validation error

---

### Broken Reference
**File:** tests/fixtures/content/invalid/broken-reference.json

**Purpose:** Test Layer 3 validation (non-existent reference)

**Structure:** Valid content with relationship to non-existent ID

**Expected Error:** Layer 3 validation error

---

### Unregistered Tag
**File:** tests/fixtures/content/invalid/unregistered-tag.json

**Purpose:** Test Layer 4 validation (unregistered tag)

**Structure:** Valid content with tag not in metadata/tags.json

**Expected Error:** Layer 4 validation error

---

## Metadata Fixtures

### Tags Fixture
**File:** tests/fixtures/metadata/tags.json

**Purpose:** Test metadata validation

**Structure:**
```json
{
  "tags": [
    {
      "id": "test",
      "display_name": "Test",
      "category": "domain"
    }
  ]
}
```

---

### Aliases Fixture
**File:** tests/fixtures/metadata/aliases.json

**Purpose:** Test metadata validation

**Structure:**
```json
{
  "aliases": [
    {
      "alias": "tp",
      "canonical_id": "package:test-package",
      "type": "package"
    }
  ]
}
```

---

### Categories Fixture
**File:** tests/fixtures/metadata/categories.json

**Purpose:** Test metadata validation

**Structure:**
```json
{
  "categories": [
    {
      "id": "test",
      "display_name": "Test",
      "content_types": ["package"]
    }
  ]
}
```

---

# Mock Specifications

## Filesystem Mock

**File:** tests/mocks/filesystem.ts

**Purpose:** Mock filesystem operations for testing

**API:**
```typescript
export class MockFileSystem {
  private files: Map<string, string> = new Map();

  setFile(path: string, content: string): void;
  getFile(path: string): string | null;
  exists(path: string): boolean;
  readFile(path: string): Promise<string>;
  writeFile(path: string, content: string): Promise<void>;
  readdir(path: string): Promise<string[]>;
}
```

**Usage:**
- Replace node:fs/promises in tests
- Pre-populate with fixture data
- Verify read/write operations

---

## Cache Mock

**File:** tests/mocks/cache.ts

**Purpose:** Mock cache for testing

**API:**
```typescript
export class MockCache<T> {
  private store: Map<string, T> = new Map();

  get(key: string): T | undefined;
  set(key: string, value: T): void;
  invalidate(key: string): void;
  invalidateAll(): void;
  getStats(): CacheStats;
}
```

**Usage:**
- Replace Cache class in tests
- Verify cache hits/misses
- Verify invalidation

---

## Config Mock

**File:** tests/mocks/config.ts

**Purpose:** Mock config loader for testing

**API:**
```typescript
export function mockConfig(overrides?: Partial<AENSConfig>): AENSConfig;
export function mockConfigLoader(): {
  loadConfig: () => Promise<AENSConfig>;
};
```

**Usage:**
- Replace loadConfig in tests
- Provide custom config values
- Test with different configurations

---

# Validation Testing Strategy

## Layer 1 Testing

### Test Cases
1. **Valid content passes**
   - Input: Valid fixture
   - Expected: ValidationResult { valid: true, errors: [] }

2. **Missing required field fails**
   - Input: Fixture missing required field
   - Expected: ValidationResult { valid: false, errors: [error] }

3. **Invalid type fails**
   - Input: Fixture with wrong type
   - Expected: ValidationResult { valid: false, errors: [error] }

4. **Pattern violation fails**
   - Input: Fixture with invalid pattern
   - Expected: ValidationResult { valid: false, errors: [error] }

5. **All schemas compile**
   - Input: All schema files
   - Expected: All compile successfully

---

## Layer 2 Testing

### Test Cases
1. **Size budget respected**
   - Input: Content within budget
   - Expected: ValidationResult { valid: true, errors: [] }

2. **Size budget violated**
   - Input: Content exceeding budget
   - Expected: ValidationResult { valid: false, errors: [error] }

3. **String length respected**
   - Input: String within maxLength
   - Expected: ValidationResult { valid: true, errors: [] }

4. **String length violated**
   - Input: String exceeding maxLength
   - Expected: ValidationResult { valid: false, errors: [error] }

5. **Stability tier valid**
   - Input: Valid stability tier
   - Expected: ValidationResult { valid: true, errors: [] }

6. **Stability tier invalid**
   - Input: Invalid stability tier
   - Expected: ValidationResult { valid: false, errors: [error] }

---

## Layer 3 Testing

### Test Cases
1. **Valid reference resolves**
   - Input: Content with valid reference
   - Expected: ValidationResult { valid: true, errors: [] }

2. **Broken reference fails**
   - Input: Content with non-existent reference
   - Expected: ValidationResult { valid: false, errors: [error] }

3. **Self-reference fails**
   - Input: Content referencing itself
   - Expected: ValidationResult { valid: false, errors: [error] }

4. **Circular reference fails**
   - Input: Content in circular reference chain
   - Expected: ValidationResult { valid: false, errors: [error] }

5. **Bidirectional relationship valid**
   - Input: Mutually referencing content
   - Expected: ValidationResult { valid: true, errors: [] }

6. **Bidirectional relationship missing**
   - Input: One-way reference (if required)
   - Expected: ValidationResult { valid: false, errors: [error] }

---

## Layer 4 Testing

### Test Cases
1. **Registered tag passes**
   - Input: Content with registered tag
   - Expected: ValidationResult { valid: true, errors: [] }

2. **Unregistered tag fails**
   - Input: Content with unregistered tag
   - Expected: ValidationResult { valid: false, errors: [error] }

3. **Registered alias passes**
   - Input: Content with registered alias
   - Expected: ValidationResult { valid: true, errors: [] }

4. **Unregistered alias fails**
   - Input: Content with unregistered alias
   - Expected: ValidationResult { valid: false, errors: [error] }

5. **Status consistent**
   - Input: status="deprecated" with deprecated object
   - Expected: ValidationResult { valid: true, errors: [] }

6. **Status inconsistent**
   - Input: status="complete" with deprecated object
   - Expected: ValidationResult { valid: false, errors: [error] }

7. **Verification date within cadence**
   - Input: Recent verification date
   - Expected: ValidationResult { valid: true, errors: [] }

8. **Verification date expired**
   - Input: Old verification date
   - Expected: ValidationResult { valid: false, errors: [error] }

---

# Integration Testing Strategy

## Content Loading Pipeline

### Test Case: Load Single File
**Steps:**
1. Mock filesystem with valid fixture
2. Call loadContentFile()
3. Verify content loaded correctly
4. Verify validation passed

**Expected:** Content object returned, no errors

---

### Test Case: Load Directory
**Steps:**
1. Mock filesystem with multiple fixtures
2. Call loadContentDirectory()
3. Verify all files loaded
4. Verify order preserved

**Expected:** Array of content objects, all valid

---

### Test Case: Load All Content
**Steps:**
1. Mock filesystem with all content types
2. Call loadAllContent()
3. Verify all types loaded
4. Verify structure correct

**Expected:** Object mapping types to content arrays

---

## Validation Pipeline

### Test Case: Full Pipeline
**Steps:**
1. Load valid content
2. Run all 4 validation layers
3. Verify all pass
4. Return valid result

**Expected:** ValidationResult { valid: true, errors: [] }

---

### Test Case: Pipeline Failure at Layer 1
**Steps:**
1. Load invalid content (Layer 1 error)
2. Run validation pipeline
3. Verify stops at Layer 1
4. Return error

**Expected:** ValidationResult { valid: false, errors: [Layer 1 error] }

---

### Test Case: Pipeline Failure at Layer 4
**Steps:**
1. Load invalid content (Layer 4 error only)
2. Run validation pipeline
3. Verify passes Layers 1-3
4. Fails at Layer 4
5. Return error

**Expected:** ValidationResult { valid: false, errors: [Layer 4 error] }

---

## Search Indexing

### Test Case: Generate Index
**Steps:**
1. Mock filesystem with content
2. Call build-search-index
3. Verify index generated
4. Verify all fields extracted
5. Verify structure correct

**Expected:** Valid search-index.json

---

### Test Case: Index Completeness
**Steps:**
1. Mock filesystem with 50 content files
2. Generate index
3. Verify 50 entries
4. Verify no duplicates
5. Verify all IDs present

**Expected:** Index with all content, no duplicates

---

## Navigation Generation

### Test Case: Generate Navigation
**Steps:**
1. Mock filesystem with content
2. Call build-nav
3. Verify _nav.json files generated
4. Verify all directories have files
5. Verify structure correct

**Expected:** Valid _nav.json files for all directories

---

### Test Case: Category Assignment
**Steps:**
1. Mock filesystem with categorized content
2. Generate navigation
3. Verify categories assigned correctly
4. Verify matches metadata/categories.json

**Expected:** Categories match metadata

---

# Regression Testing Strategy

## Regression Test Requirements

### When to Add Regression Tests
1. **Bug Fix:** Add test for the bug before fixing
2. **Feature Addition:** Add test for new feature
3. **Refactoring:** Add test to prevent regression
4. **Edge Case:** Add test for discovered edge case

### Regression Test Naming
**Format:** `test_<description>_regression_<issue-number>`

**Example:** `test_missing_id_validation_regression_123`

---

## Known Regression Tests

### Regression: ID Format Validation
**Issue:** IDs with invalid format were accepted
**Test:** Verify ID format validation rejects invalid formats
**Fixture:** content/invalid/invalid-id-format.json

---

### Regression: Circular References
**Issue:** Circular references were not detected
**Test:** Verify circular reference detection works
**Fixture:** content/invalid/circular-reference.json

---

### Regression: Unregistered Tags
**Issue:** Unregistered tags were not caught
**Test:** Verify unregistered tag validation works
**Fixture:** content/invalid/unregistered-tag.json

---

# Test Data Management

## Fixture Versioning

**Version Control:**
- All fixtures in git
- Fixtures versioned with code
- Fixtures updated when schema changes

**Fixture Updates:**
1. Update fixture to match new schema
2. Update tests if needed
3. Commit with message: "Update fixtures for schema v2.1"

---

## Test Data Isolation

**Isolation Rules:**
- Each test uses fresh fixtures
- No shared state between tests
- Mocks reset before each test
- Cleanup after each test

**Implementation:**
```typescript
beforeEach(() => {
  mockFileSystem.reset();
  mockCache.invalidateAll();
});

afterEach(() => {
  mockFileSystem.reset();
  mockCache.invalidateAll();
});
```

---

# Test Execution

## Unit Test Execution

### Command
```bash
pnpm test
```

**Behavior:** Run all unit tests

**Timeout:** 10 seconds per test

**Parallel:** Yes (Vitest default)

---

### Command: Watch Mode
```bash
pnpm test:watch
```

**Behavior:** Run tests in watch mode

**Use Case:** Development

---

## Integration Test Execution

### Command
```bash
pnpm test:integration
```

**Behavior:** Run all integration tests

**Timeout:** 30 seconds per test

**Parallel:** No (sequential to avoid conflicts)

---

## E2E Test Execution

### Command
```bash
pnpm test:e2e
```

**Behavior:** Run all end-to-end tests

**Timeout:** 60 seconds per test

**Parallel:** No

---

## Coverage Execution

### Command
```bash
pnpm test:coverage
```

**Behavior:** Run tests with coverage

**Output:** coverage/ directory

**Thresholds:** Fail if below 80%

---

# Test Configuration

## Vitest Configuration

### File: vitest.config.ts
```typescript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'tests/',
        'fixtures/',
        'mocks/',
        '.next/',
        'coverage/',
        'legacy/',
      ],
    },
    timeout: 10000,
  },
});
```

---

### File: vitest.integration.config.ts
```typescript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['tests/integration/**/*.test.ts'],
    exclude: ['tests/unit/**'],
    timeout: 30000,
    pool: 'forks',
  },
});
```

---

# Test Utilities

## Test Helper Functions

### File: tests/utils/helpers.ts

### Function: loadFixture(path: string)
```typescript
export function loadFixture(path: string): any
```
**Purpose:** Load fixture file
**Returns:** Parsed JSON

---

### Function: createMockContent(type: string, overrides?: any)
```typescript
export function createMockContent(type: string, overrides?: any): any
```
**Purpose:** Create mock content object
**Returns:** Content object with optional overrides

---

### Function: assertValidationResult(result: ValidationResult, expectedValid: boolean)
```typescript
export function assertValidationResult(result: ValidationResult, expectedValid: boolean): void
```
**Purpose:** Assert validation result
**Throws:** AssertionError if mismatch

---

# Performance Testing

## Performance Test Cases

### Test: Load Performance
**Purpose:** Verify content loading meets performance targets
**Target:** loadAllContent() < 500ms
**Test:** Load 100 content files, measure time

---

### Test: Validation Performance
**Purpose:** Verify validation meets performance targets
**Target:** validateAllContent() < 10s
**Test:** Validate 100 content files, measure time

---

### Test: Search Index Performance
**Purpose:** Verify search indexing meets performance targets
**Target:** build-search < 5s
**Test:** Generate index from 100 content files, measure time

---

# Accessibility Testing

## Accessibility Test Cases

### Test: Keyboard Navigation
**Purpose:** Verify UI is keyboard navigable
**Tool:** Playwright a11y tests
**Test:** Navigate UI with keyboard only

---

### Test: Screen Reader
**Purpose:** Verify UI is screen reader compatible
**Tool:** axe-core
**Test:** Run axe-core on all pages

---

### Test: Color Contrast
**Purpose:** Verify color contrast meets WCAG AA
**Tool:** axe-core
**Test:** Check all text elements

---

# Test Reporting

## Test Report Format

### Unit Test Report
**Format:** Console output + JUnit XML
**Content:**
- Test name
- Status (pass/fail)
- Duration
- Error message (if failed)

---

### Coverage Report
**Format:** HTML + JSON + Console
**Content:**
- Overall coverage percentage
- Per-file coverage
- Uncovered lines
- Branch coverage

---

### Integration Test Report
**Format:** Console output
**Content:**
- Test name
- Status (pass/fail)
- Duration
- Steps executed
- Error message (if failed)

---

# Test Maintenance

## Test Maintenance Schedule

**Weekly:**
- Review flaky tests
- Update slow tests
- Review coverage reports

**Monthly:**
- Review test documentation
- Update fixtures if schema changed
- Review regression tests

**Quarterly:**
- Review test architecture
- Update test utilities
- Review performance tests

---

## Test Debt

**Definition:** Tests that are skipped, slow, or flaky

**Tracking:**
- Document in TEST_DEBT.md
- Include issue number
- Include plan to resolve

**Resolution:**
- Fix flaky tests within 1 week
- Fix slow tests within 1 month
- Resolve skipped tests before next release

---

# Final Notes

## Test Quality Standards

**Every test must:**
1. Be independent (no shared state)
2. Be fast (< 10s for unit, < 30s for integration)
3. Be descriptive (test name describes what is tested)
4. Be maintainable (clear, simple logic)
5. Cover happy path and error paths

**Test names must:**
- Follow pattern: `test_<what>_<when>_<expected>`
- Be descriptive
- Not include implementation details

**Example:** `test_loadContentFile_whenFileExists_returnsContent`

## Test Review Checklist

Before committing tests:
- [ ] Test name is descriptive
- [ ] Test is independent
- [ ] Test is fast
- [ ] Test covers happy path
- [ ] Test covers error paths
- [ ] Test has assertions
- [ ] Test has no hardcoded values (use fixtures)
- [ ] Test cleans up after itself

This specification is complete. No testing decisions should be required.
