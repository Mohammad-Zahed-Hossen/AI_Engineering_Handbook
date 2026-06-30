# Build Pipeline Specification
**Version:** 1.0
**Purpose:** Exact build order, commands, CI checks, artifact generation, and release pipeline
**Status:** Final specification before implementation
**Governed by:** IMPLEMENTATION_SPECIFICATION.md

---

# Specification Purpose

This document specifies the complete build pipeline for the AENS repository:

- Exact build order
- All commands and their flags
- CI/CD checks
- Artifact generation
- Release pipeline
- Pre-commit hooks
- Pre-push hooks

**No AI agent should make build decisions.** All build processes are specified here.

---

# Build Pipeline Overview

```
Development Workflow
    ↓
Pre-commit Hooks
    ↓
Validation
    ↓
Artifact Generation
    ↓
Build
    ↓
Test
    ↓
Pre-push Hooks
    ↓
CI Pipeline
    ↓
Release
```

---

# Development Workflow

## Local Development Commands

### Start Development Server
```bash
pnpm dev
```

**Purpose:** Start Next.js development server
**Port:** 3000 (default)
**Behavior:** Hot reload enabled

---

### Type Checking
```bash
pnpm type-check
```

**Purpose:** Run TypeScript compiler without emitting files
**Command:** `tsc --noEmit`
**Exit Code:** 0 if no errors, 1 if errors

---

### Linting
```bash
pnpm lint
```

**Purpose:** Run ESLint on all TypeScript files
**Command:** `eslint . --ext .ts,.tsx`
**Exit Code:** 0 if no errors, 1 if errors

---

### Format Check
```bash
pnpm format:check
```

**Purpose:** Check if files match Prettier formatting
**Command:** `prettier --check .`
**Exit Code:** 0 if formatted, 1 if not

---

### Format Fix
```bash
pnpm format
```

**Purpose:** Format files with Prettier
**Command:** `prettier --write .`
**Exit Code:** Always 0

---

# Validation Pipeline

## Single File Validation

### Command
```bash
pnpm validate --file <path>
```

**Example:**
```bash
pnpm validate --file content/packages/numpy.json
```

**Purpose:** Validate single content file against all 4 layers

**Exit Code:** 0 if valid, 1 if invalid

**Output:**
```
✓ content/packages/numpy.json - Valid
```

---

## Full Repository Validation

### Command
```bash
pnpm validate:all
```

**Purpose:** Validate all content files against all 4 layers

**Exit Code:** 0 if all valid, 1 if any invalid

**Output:**
```
Validating 42 files...
✓ content/packages/numpy.json - Valid
✓ content/models/transformer.json - Valid
✗ content/workflows/rag-pipeline.json - Invalid
  - Layer 1: Missing required field 'mental_trigger'
  - Layer 4: Unregistered tag 'deep-learning'

Summary: 42 files, 41 valid, 1 invalid, 2 errors
```

---

## Layer-Specific Validation

### Command
```bash
pnpm validate --layer <1-4>
```

**Example:**
```bash
pnpm validate --layer 1
```

**Purpose:** Run only specified validation layer

**Exit Code:** 0 if passes, 1 if fails

**Use Case:** Debugging specific validation issues

---

# Artifact Generation Pipeline

## Navigation Generation

### Command
```bash
pnpm build-nav
```

**Purpose:** Generate _nav.json files for all content directories

**Input:** content/ directory
**Output:** 
- content/packages/_nav.json
- content/models/_nav.json
- content/models/ml/_nav.json
- content/models/dl/_nav.json
- content/models/llm/_nav.json
- content/workflows/_nav.json
- content/cheatsheets/_nav.json

**Exit Code:** 0 if success, 1 if failure

**Validation:**
- Validates categories against metadata/categories.json
- Validates JSON structure
- Validates all entries have required fields

**Output Format:**
```json
{
  "items": [
    {
      "id": "package:numpy",
      "title": "NumPy",
      "slug": "numpy",
      "category": "ml"
    }
  ]
}
```

---

## Search Index Generation

### Command
```bash
pnpm build-search
```

**Purpose:** Generate search-index.json from all content

**Input:** content/ directory
**Output:** search-index.json (repository root)

**Exit Code:** 0 if success, 1 if failure

**Validation:**
- Validates JSON structure
- Validates all entries have required fields
- Validates version field matches config

**Output Format:**
```json
{
  "version": "2.0",
  "generated_at": "2026-06-30T00:00:00Z",
  "entries": [...]
}
```

---

## Combined Artifact Generation

### Command
```bash
pnpm build-artifacts
```

**Purpose:** Generate all build artifacts

**Sequence:**
1. pnpm build-nav
2. pnpm build-search

**Exit Code:** 0 if all succeed, 1 if any fail

**Use Case:** Pre-commit hook, CI pipeline

---

# Build Pipeline

## Development Build

### Command
```bash
pnpm build
```

**Purpose:** Build Next.js application for development

**Sequence:**
1. Type check
2. Lint
3. Next.js build

**Exit Code:** 0 if success, 1 if failure

**Output:** .next/ directory

---

## Production Build

### Command
```bash
pnpm build:prod
```

**Purpose:** Build Next.js application for production

**Sequence:**
1. Type check
2. Lint
3. Validate all content
4. Generate artifacts
5. Next.js production build

**Exit Code:** 0 if success, 1 if failure

**Output:** .next/ directory (optimized)

---

# Test Pipeline

## Unit Tests

### Command
```bash
pnpm test
```

**Purpose:** Run unit tests with Vitest

**Command:** `vitest run`
**Exit Code:** 0 if all pass, 1 if any fail

**Coverage:** Report generated to coverage/

---

## Integration Tests

### Command
```bash
pnpm test:integration
```

**Purpose:** Run integration tests

**Command:** `vitest run --config vitest.integration.config.ts`
**Exit Code:** 0 if all pass, 1 if any fail

---

## Test with Coverage

### Command
```bash
pnpm test:coverage
```

**Purpose:** Run tests with coverage report

**Command:** `vitest run --coverage`
**Exit Code:** 0 if all pass, 1 if any fail

**Coverage Thresholds:**
- Statements: 80%
- Branches: 80%
- Functions: 80%
- Lines: 80%

**Output:** coverage/ directory

---

# Pre-commit Hooks

## Hook: validate-content

**Trigger:** Pre-commit on content/ changes
**File:** .husky/pre-commit
**Command:** `pnpm validate:all`
**Behavior:** Block commit if validation fails

**Implementation:**
```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

# Check if content files changed
if git diff --cached --name-only | grep -q "^content/"; then
  echo "Validating content..."
  pnpm validate:all
  if [ $? -ne 0 ]; then
    echo "❌ Content validation failed. Commit blocked."
    exit 1
  fi
  echo "✅ Content validation passed."
fi
```

---

## Hook: build-artifacts

**Trigger:** Pre-commit on content/ changes
**File:** .husky/pre-commit (same file, sequential)
**Command:** `pnpm build-artifacts`
**Behavior:** Regenerate artifacts and stage them

**Implementation:**
```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

# Check if content files changed
if git diff --cached --name-only | grep -q "^content/"; then
  echo "Regenerating build artifacts..."
  pnpm build-artifacts
  if [ $? -ne 0 ]; then
    echo "❌ Artifact generation failed. Commit blocked."
    exit 1
  fi
  echo "✅ Artifacts regenerated."
  
  # Stage generated artifacts
  git add search-index.json
  git add content/*/_nav.json
  git add content/*/*/_nav.json
fi
```

---

## Hook: lint-staged

**Trigger:** Pre-commit on all staged files
**File:** .husky/pre-commit (same file, sequential)
**Command:** `lint-staged`
**Behavior:** Lint and format staged files

**Implementation:**
```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

echo "Running lint-staged..."
pnpm lint-staged
if [ $? -ne 0 ]; then
  echo "❌ Lint-staged failed. Commit blocked."
  exit 1
fi
echo "✅ Lint-staged passed."
```

**lint-staged Configuration (package.json):**
```json
{
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{json,md}": [
      "prettier --write"
    ]
  }
}
```

---

# Pre-push Hooks

## Hook: test

**Trigger:** Pre-push
**File:** .husky/pre-push
**Command:** `pnpm test`
**Behavior:** Run tests before push

**Implementation:**
```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

echo "Running tests..."
pnpm test
if [ $? -ne 0 ]; then
  echo "❌ Tests failed. Push blocked."
  exit 1
fi
echo "✅ Tests passed."
```

---

## Hook: type-check

**Trigger:** Pre-push (same file, sequential)
**Command:** `pnpm type-check`
**Behavior:** Type check before push

**Implementation:**
```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

echo "Running type check..."
pnpm type-check
if [ $? -ne 0 ]; then
  echo "❌ Type check failed. Push blocked."
  exit 1
fi
echo "✅ Type check passed."
```

---

# CI Pipeline

## CI Workflow: main.yml

**File:** .github/workflows/main.yml
**Trigger:** Push to main, pull requests

### Jobs

#### Job: validate
**Purpose:** Validate content and generate artifacts

**Steps:**
1. Checkout code
2. Setup Node.js
3. Install dependencies
4. Validate all content
5. Generate artifacts
6. Upload artifacts

**Matrix:** None

**Timeout:** 5 minutes

---

#### Job: test
**Purpose:** Run tests

**Steps:**
1. Checkout code
2. Setup Node.js
3. Install dependencies
4. Run unit tests
5. Run integration tests
6. Upload coverage

**Matrix:** None

**Timeout:** 10 minutes

---

#### Job: build
**Purpose:** Build application

**Steps:**
1. Checkout code
2. Setup Node.js
3. Install dependencies
4. Type check
5. Lint
6. Build application
7. Upload build artifacts

**Matrix:** None

**Timeout:** 15 minutes

---

#### Job: deploy
**Purpose:** Deploy to production

**Steps:**
1. Checkout code
2. Setup Node.js
3. Install dependencies
4. Build production
5. Deploy to Vercel

**Conditions:** Only on push to main

**Timeout:** 10 minutes

---

## CI Workflow: pull-request.yml

**File:** .github/workflows/pull-request.yml
**Trigger:** Pull requests

### Jobs

#### Job: validate-pr
**Purpose:** Validate PR changes

**Steps:**
1. Checkout code
2. Setup Node.js
3. Install dependencies
4. Validate changed content files only
5. Generate artifacts
6. Comment validation results on PR

**Matrix:** None

**Timeout:** 5 minutes

---

# Release Pipeline

## Release Process

### Prerequisites
1. All tests pass
2. All validation passes
3. No lint errors
4. No type errors
5. Changelog updated

### Release Steps

#### Step 1: Version Bump
```bash
pnpm version <major|minor|patch>
```

**Behavior:** Updates package.json version, creates git tag

---

#### Step 2: Changelog
```bash
pnpm changelog
```

**Behavior:** Generates CHANGELOG.md from git commits

---

#### Step 3: Build
```bash
pnpm build:prod
```

**Behavior:** Production build with all validations

---

#### Step 4: Test
```bash
pnpm test:coverage
```

**Behavior:** Full test suite with coverage

---

#### Step 5: Release
```bash
git push --follow-tags
```

**Behavior:** Pushes commit and tags, triggers CI deploy

---

## Release Checklist

- [ ] Version bumped in package.json
- [ ] Changelog updated
- [ ] All tests pass
- [ ] All validation passes
- [ ] No lint errors
- [ ] No type errors
- [ ] Coverage threshold met
- [ ] Build succeeds
- [ ] Git tag created
- [ ] Pushed to main

---

# Package.json Scripts

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "build:prod": "pnpm type-check && pnpm lint && pnpm validate:all && pnpm build-artifacts && next build",
    "start": "next start",
    "type-check": "tsc --noEmit",
    "lint": "eslint . --ext .ts,.tsx",
    "lint:fix": "eslint . --ext .ts,.tsx --fix",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "validate": "tsx scripts/validate.ts",
    "validate:file": "tsx scripts/validate.ts --file",
    "validate:all": "tsx scripts/validate.ts --all",
    "validate:layer": "tsx scripts/validate.ts --layer",
    "build-nav": "tsx scripts/build-nav.ts",
    "build-search": "tsx scripts/build-search-index.ts",
    "build-artifacts": "pnpm build-nav && pnpm build-search",
    "test": "vitest run",
    "test:integration": "vitest run --config vitest.integration.config.ts",
    "test:coverage": "vitest run --coverage",
    "test:watch": "vitest",
    "prepare": "husky install",
    "pre-commit": "lint-staged",
    "version": "changeset version",
    "release": "changeset publish"
  }
}
```

---

# Artifact Management

## Generated Artifacts

### search-index.json
**Location:** Repository root
**Generated by:** pnpm build-search
**Committed:** Yes
**Gitignored:** When in development mode only

### _nav.json files
**Location:** content/*/_nav.json
**Generated by:** pnpm build-nav
**Committed:** Yes
**Gitignored:** Never

### .next/ directory
**Location:** Repository root
**Generated by:** pnpm build
**Committed:** No
**Gitignored:** Yes

### coverage/ directory
**Location:** Repository root
**Generated by:** pnpm test:coverage
**Committed:** No
**Gitignored:** Yes

---

## Artifact Validation

### search-index.json Validation
**Command:** `tsx scripts/validate-search-index.ts`
**Checks:**
- JSON syntax valid
- Version field matches config
- All entries have required fields
- No duplicate IDs
- Generated_at is recent (< 1 hour old)

### _nav.json Validation
**Command:** `tsx scripts/validate-nav.ts`
**Checks:**
- JSON syntax valid
- All items have required fields
- Categories match metadata/categories.json
- No duplicate IDs

---

# Environment Configuration

## Environment Variables

### Required Variables
```bash
NEXT_PUBLIC_SITE_URL=https://aens.dev
```

### Optional Variables
```bash
NODE_ENV=development|production
VERCEL_URL=
```

### .env.example
```bash
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NODE_ENV=development
```

---

# Dependency Management

## Production Dependencies

### Core
- next
- react
- react-dom

### Validation
- ajv

### Search
- fuse.js

### Utilities
- clsx
- tailwind-merge

---

## Development Dependencies

### TypeScript
- typescript
- @types/node
- @types/react
- @types/react-dom

### Linting
- eslint
- eslint-config-next
- prettier
- eslint-config-prettier

### Testing
- vitest
- @vitest/coverage-v8

### Git Hooks
- husky
- lint-staged

---

# Performance Monitoring

## Build Performance Targets

| Operation | Target | Alert Threshold |
|-----------|--------|----------------|
| pnpm validate:all | < 10s | > 15s |
| pnpm build-nav | < 2s | > 5s |
| pnpm build-search | < 5s | > 10s |
| pnpm build | < 30s | > 60s |
| pnpm test | < 15s | > 30s |

## Runtime Performance Targets

| Operation | Target | Alert Threshold |
|-----------|--------|----------------|
| Page load (FCP) | < 1s | > 2s |
| Page load (TTI) | < 2s | > 4s |
| Search query | < 100ms | > 200ms |
| Navigation load | < 50ms | > 100ms |

---

# Error Handling in Pipeline

## Pipeline Failure Behavior

### Validation Failure
**Action:** Block commit/push
**Notification:** Console error with details
**Recovery:** Fix validation errors and retry

### Build Failure
**Action:** Block deployment
**Notification:** CI failure notification
**Recovery:** Fix build errors and retry

### Test Failure
**Action:** Block commit/push
**Notification:** Test failure report
**Recovery:** Fix tests and retry

### Artifact Generation Failure
**Action:** Block commit/push
**Notification:** Console error with details
**Recovery:** Fix generation errors and retry

---

# Rollback Procedure

## Build Rollback

### Local Rollback
```bash
git reset --hard HEAD
pnpm install
```

### CI Rollback
1. Identify failed commit
2. Revert commit
3. Push revert
4. CI will deploy previous version

---

## Artifact Rollback

### search-index.json Rollback
```bash
git checkout HEAD~1 search-index.json
git commit -m "Rollback search-index.json"
```

### _nav.json Rollback
```bash
git checkout HEAD~1 content/*/_nav.json
git commit -m "Rollback navigation"
```

---

# Security Checks

## Dependency Scanning

### Command
```bash
pnpm audit
```

**Purpose:** Check for vulnerable dependencies

**Behavior:** 
- Fail on high severity vulnerabilities
- Warn on moderate severity vulnerabilities

**CI Integration:** Run in CI before deploy

---

## Secret Scanning

### Command
```bash
pnpm secrets-scan
```

**Purpose:** Check for committed secrets

**Behavior:** Fail if secrets found

**CI Integration:** Run in CI on every push

---

# Monitoring and Logging

## Build Logs

### Local Development
**Location:** Console output
**Level:** info
**Format:** Timestamp + message

### CI Logs
**Location:** GitHub Actions logs
**Level:** info
**Format:** GitHub Actions format

---

## Error Logs

### Validation Errors
**Location:** Console output
**Format:** File path + layer + error message

### Build Errors
**Location:** Console output
**Format:** File path + line number + error message

### Test Errors
**Location:** Console output + coverage/
**Format:** Test name + error message + stack trace

---

# Final Notes

## Pipeline Execution Order

**Before Commit:**
1. Type check
2. Lint
3. Format
4. Validate content
5. Generate artifacts
6. Stage artifacts

**Before Push:**
1. Tests
2. Type check

**CI on Push:**
1. Validate
2. Test
3. Build
4. Deploy (if main)

**CI on PR:**
1. Validate changed files
2. Generate artifacts
3. Comment results

## Pipeline Modification Rules

**No modifications to pipeline without:**
1. ADR documenting change
2. Update to this specification
3. Update to package.json scripts
4. Update to CI workflows
5. Testing of new pipeline

This specification is complete. No build decisions should be required.
