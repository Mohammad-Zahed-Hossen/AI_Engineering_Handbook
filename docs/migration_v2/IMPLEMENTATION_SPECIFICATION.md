# Implementation Specification (LLD)
**Version:** 1.0
**Purpose:** Low-Level Design - every module, every function, every algorithm, every contract
**Status:** Final specification before implementation prompts
**Governed by:** FOUNDATION_IMPLEMENTATION_BLUEPRINT.md

---

# Specification Purpose

This document is the **Low-Level Design (LLD)** for the AENS repository rebuild. It specifies:

- Every module and its responsibilities
- Every exported function with full contracts
- Internal helper functions
- Error types and handling
- Algorithms and complexity
- Data flow
- Repository contracts (dependency rules)
- Performance expectations
- Caching policies

**No AI agent should make implementation decisions.** All low-level decisions are specified here.

---

# Repository Contracts

## Dependency Rules

### Allowed Dependencies

```
app/ (Next.js pages)
    ↓
components/ (UI)
    ↓
lib/content/ (Content Engine)
    ↓
lib/validation/ (Validation)
    ↓
lib/config/ (Config Loader)
    ↓
types/ (TypeScript types)
    ↓
schema/v2/ (JSON Schema)
```

### Forbidden Dependencies

- **UI components MUST NOT import:** lib/validation, schema/v2
- **Content Engine MUST NOT import:** app/, components/
- **Validation MUST NOT import:** app/, components/, lib/content/
- **Schema files MUST NOT import:** Anything (pure JSON Schema)
- **Types MUST NOT import:** Anything (pure TypeScript types)

### Module Isolation Rules

**Content Loader (lib/content/)**
- MUST NOT import UI components
- MUST NOT import validation logic (pure loader, no validation)
- MUST ONLY import: types, config, node:fs, node:path
- MUST be testable without Next.js runtime

**Validation (lib/validation/)**
- MUST NOT import content loader
- MUST NOT import UI components
- MUST ONLY import: types, config, schema, metadata
- MUST be pure functions (no side effects)

**Search Engine (lib/search/)**
- MUST NOT read filesystem directly
- MUST ONLY read search-index.json
- MUST be testable with mock index

**Navigation Generator (scripts/build-nav.ts)**
- MUST read from content/ directory
- MUST write to content/*/_nav.json
- MUST validate against metadata/categories.json
- MUST sort items deterministically (title ascending, then id ascending)

---

# Module Specifications

## Module: lib/config/loader.ts

### Responsibility
Load and validate aens.config.json from repository root.

### Public API

#### Function: loadConfig()
```typescript
export async function loadConfig(): Promise<AENSConfig>
```

**Input:** None

**Output:** `AENSConfig` object

**Throws:**
- `ConfigNotFoundError` - if aens.config.json does not exist
- `ConfigParseError` - if JSON is invalid
- `ConfigValidationError` - if config does not match schema

**Side Effects:** None (pure read)

**Performance:** O(1) - single file read, O(n) validation where n = config size

**Caching:** None (load on every call, caller should cache)

**Algorithm:**
1. Read aens.config.json from process.cwd()
2. Parse JSON
3. Validate against schema/config.schema.json using Ajv
4. Return validated config

**Dependencies:**
- node:fs/promises
- node:path
- ajv
- schema/config.schema.json
- types/config.ts

---

### Internal Helper: validateConfig(config: any): ValidationResult
```typescript
function validateConfig(config: any): ValidationResult
```

**Input:** Parsed config object

**Output:** ValidationResult { valid: boolean, errors: Error[] }

**Throws:** None

**Side Effects:** None

**Algorithm:**
1. Compile Ajv validator from schema/config.schema.json
2. Validate config against compiled validator
3. Return result

---

## Module: lib/content/loaders.ts

### Responsibility
Load content files from content/ directory.

### Public API

#### Function: loadContentFile(path: string): Promise<Content>
```typescript
export async function loadContentFile(path: string): Promise<Content>
```

**Input:** 
- `path`: Absolute path to content file

**Output:** Content object (union of Package | Model | Workflow | Cheatsheet | Registry)

**Throws:**
- `ContentNotFoundError` - if file does not exist
- `ContentParseError` - if JSON is invalid
- `ContentSchemaError` - if content does not match schema

**Side Effects:** None (pure read)

**Performance:** O(1) - single file read

**Caching:** None (caller should use cache.ts)

**Algorithm:**
1. Read file from path
2. Parse JSON
3. Determine content type from directory structure
4. Return typed content (pure loader, no validation)

**Dependencies:**
- node:fs/promises
- node:path
- types/*.ts

**Note:** Validation is performed by the validation pipeline, not the loader. See v2.1 Fix 2.

---

#### Function: loadContentDirectory(dir: string): Promise<Content[]>
```typescript
export async function loadContentDirectory(dir: string): Promise<Content[]>
```

**Input:**
- `dir`: Absolute path to content directory

**Output:** Array of Content objects

**Throws:**
- `DirectoryNotFoundError` - if directory does not exist
- Aggregates errors from individual file loads

**Side Effects:** None (pure read)

**Performance:** O(n) where n = number of files in directory

**Caching:** None (caller should use cache.ts)

**Algorithm:**
1. Read directory entries
2. Filter for .json files
3. Map each file to loadContentFile()
4. Await all loads in parallel
5. Return array

**Dependencies:**
- node:fs/promises
- node:path
- loadContentFile()

---

#### Function: loadAllContent(): Promise<Record<string, Content[]>>
```typescript
export async function loadAllContent(): Promise<Record<string, Content[]>>
```

**Input:** None

**Output:** Object mapping content type to array of content

**Throws:** Aggregates errors from directory loads

**Side Effects:** None (pure read)

**Performance:** O(n) where n = total content files

**Caching:** None (caller should use cache.ts)

**Algorithm:**
1. Define content directories: packages, models, workflows, cheatsheets, registry
2. For each directory, call loadContentDirectory()
3. Await all loads in parallel
4. Return mapped object

**Dependencies:**
- node:path
- loadContentDirectory()

---

### Internal Helper: determineContentType(path: string): ContentType
```typescript
function determineContentType(path: string): ContentType
```

**Input:** File path

**Output:** ContentType enum value

**Throws:** `UnknownContentTypeError` if path does not match known pattern

**Algorithm:**
1. Extract directory name from path
2. Match against known content type directories
3. Return corresponding ContentType

---

## Module: lib/content/resolvers.ts

### Responsibility
Resolve content by various criteria (ID, slug, type, tag, alias).

### Public API

#### Function: resolveById(id: string): Promise<Content | null>
```typescript
export async function resolveById(id: string): Promise<Content | null>
```

**Input:**
- `id`: Content ID in format "type:slug"

**Output:** Content object or null if not found

**Throws:** 
- `InvalidIdFormatError` - if ID does not match pattern

**Side Effects:** None

**Performance:** O(1) with cache, O(n) without cache

**Caching:** Uses cache.ts for lookup

**Algorithm:**
1. Parse ID to extract type and slug (and category for models)
2. Construct file path:
   - Models: `content/models/{category}/{slug}.json`
 Other types: `content/{type}s/{slug}.json`
3. Call loadContentFile()
4. Return content or null

**Dependencies:**
- lib/content/loaders.ts
- lib/content/cache.ts

**Note:** See ADR-004 for model ID format rationale

---

#### Function: resolveBySlug(slug: string): Promise<Content | null>
```typescript
export async function resolveBySlug(slug: string): Promise<Content | null>
```

**Input:**
- `slug`: Content slug

**Output:** Content object or null if not found

**Throws:** None

**Side Effects:** None

**Performance:** O(n) - must search all content types

**Caching:** Uses cache.ts for lookup

**Algorithm:**
1. For each content type, construct path: content/{type}/{slug}.json
2. Try loadContentFile() for each
3. Return first successful load or null

**Dependencies:**
- lib/content/loaders.ts
- lib/content/cache.ts

---

#### Function: resolveByType(type: string): Promise<Content[]>
```typescript
export async function resolveByType(type: string): Promise<Content[]>
```

**Input:**
- `type`: Content type (package, model, workflow, cheatsheet, registry)

**Output:** Array of content objects

**Throws:** 
- `InvalidContentTypeError` - if type is not valid

**Side Effects:** None

**Performance:** O(n) where n = files in type directory

**Caching:** Uses cache.ts for lookup

**Algorithm:**
1. Validate type against known content types
2. Call loadContentDirectory() for type
3. Return array

**Dependencies:**
- lib/content/loaders.ts
- lib/content/cache.ts

---

#### Function: resolveByTag(tag: string): Promise<Content[]>
```typescript
export async function resolveByTag(tag: string): Promise<Content[]>
```

**Input:**
- `tag`: Tag string

**Output:** Array of content objects with matching tag

**Throws:** None

**Side Effects:** None

**Performance:** O(n) where n = total content files

**Caching:** Uses cache.ts for lookup

**Algorithm:**
1. Load all content via loadAllContent()
2. Filter content where tags array includes tag
3. Return filtered array

**Dependencies:**
- lib/content/loaders.ts
- lib/content/cache.ts

---

#### Function: resolveByAlias(alias: string): Promise<Content | null>
```typescript
export async function resolveByAlias(alias: string): Promise<Content | null>
```

**Input:**
- `alias`: Alias string

**Output:** Content object or null if not found

**Throws:** None

**Side Effects:** None

**Performance:** O(1) with metadata lookup, O(n) without

**Caching:** Uses cache.ts for lookup

**Algorithm:**
1. Look up alias in metadata/aliases.json
2. If found, get canonical_id
3. Call resolveById(canonical_id)
4. Return result

**Dependencies:**
- metadata/aliases.json
- resolveById()
- lib/content/cache.ts

---

## Module: lib/content/registry.ts

### Responsibility
Content registration and collision detection.

### Public API

#### Function: registerContent(content: Content): void
```typescript
export function registerContent(content: Content): void
```

**Input:** Content object

**Output:** None

**Throws:**
- `DuplicateIdError` - if ID already registered

**Side Effects:** Updates in-memory registry

**Performance:** O(1) - hash map lookup

**Caching:** In-memory registry

**Algorithm:**
1. Check if content.id already in registry
2. If yes, throw DuplicateIdError
3. If no, add to registry

**Dependencies:**
- metadata/registry.json (initial load)

---

#### Function: unregisterContent(id: string): void
```typescript
export function unregisterContent(id: string): void
```

**Input:** Content ID

**Output:** None

**Throws:** None (no-op if not registered)

**Side Effects:** Updates in-memory registry

**Performance:** O(1) - hash map delete

**Algorithm:**
1. Delete id from registry
2. No-op if not present

**Dependencies:**
- None

---

#### Function: getAllIds(): string[]
```typescript
export function getAllIds(): string[]
```

**Input:** None

**Output:** Array of all registered IDs

**Throws:** None

**Side Effects:** None

**Performance:** O(n) where n = registered IDs

**Algorithm:**
1. Return Object.keys(registry)

**Dependencies:**
- None

---

#### Function: checkCollision(id: string): boolean
```typescript
export function checkCollision(id: string): boolean
```

**Input:** Content ID

**Output:** true if collision exists, false otherwise

**Throws:** None

**Side Effects:** None

**Performance:** O(1) - hash map lookup

**Algorithm:**
1. Return registry.has(id)

**Dependencies:**
- None

---

## Module: lib/content/cache.ts

### Responsibility
In-memory caching for content engine.

### Public API

#### Class: Cache<T>
```typescript
export class Cache<T>
```

**Generic Type:** T - type of cached value

**Constructor:**
```typescript
constructor(maxSize: number = 1000, ttl: number = 300000)
```
- `maxSize`: Maximum number of entries (default: 1000)
- `ttl`: Time-to-live in milliseconds (default: 5 minutes)

---

#### Method: get(key: string): T | undefined
```typescript
get(key: string): T | undefined
```

**Input:** Cache key

**Output:** Cached value or undefined if not found/expired

**Throws:** None

**Side Effects:** None

**Performance:** O(1) - hash map lookup

**Algorithm:**
1. Check if key exists in cache
2. If yes, check if expired
3. If expired, delete and return undefined
4. If not expired, update last accessed and return value

---

#### Method: set(key: string, value: T): void
```typescript
set(key: string, value: T): void
```

**Input:** 
- `key`: Cache key
- `value`: Value to cache

**Output:** None

**Throws:** None

**Side Effects:** May evict oldest entry if at capacity

**Performance:** O(1) - hash map insert

**Algorithm:**
1. If at maxSize, evict least recently used entry
2. Set key with value and timestamp
3. Update access order

---

#### Method: invalidate(key: string): void
```typescript
invalidate(key: string): void
```

**Input:** Cache key

**Output:** None

**Throws:** None

**Side Effects:** Removes entry from cache

**Performance:** O(1) - hash map delete

**Algorithm:**
1. Delete key from cache
2. No-op if not present

---

#### Method: invalidateAll(): void
```typescript
invalidateAll(): void
```

**Input:** None

**Output:** None

**Throws:** None

**Side Effects:** Clears entire cache

**Performance:** O(1) - reassign new map

**Algorithm:**
1. Replace cache map with empty Map

---

#### Method: getStats(): CacheStats
```typescript
getStats(): CacheStats
```

**Input:** None

**Output:** CacheStats { size: number, hits: number, misses: number }

**Throws:** None

**Side Effects:** None

**Performance:** O(1)

**Algorithm:**
1. Return current statistics

---

## Module: lib/validation/layer1-schema.ts

### Responsibility
Layer 1 validation - structural validation using JSON Schema.

### Public API

#### Function: validateSchema(content: any, schemaName: string): ValidationResult
```typescript
export function validateSchema(content: any, schemaName: string): ValidationResult
```

**Input:**
- `content`: Content object to validate
- `schemaName`: Name of schema to use (base, package, model, workflow, cheatsheet, registry)

**Output:** ValidationResult { valid: boolean, errors: ValidationError[] }

**Throws:** 
- `SchemaNotFoundError` - if schemaName is not valid

**Side Effects:** None (pure validation)

**Performance:** O(n) where n = content size (Ajv validation)

**Caching:** Compiles schemas once and caches compiled validators

**Algorithm:**
1. Get schema path from schemaName
2. Check if validator is cached
3. If not cached, compile Ajv validator and cache
4. Run validator on content
5. Return result

**Dependencies:**
- ajv
- schema/v2/*.json

---

### Internal Helper: getSchemaPath(schemaName: string): string
```typescript
function getSchemaPath(schemaName: string): string
```

**Input:** Schema name

**Output:** Absolute path to schema file

**Throws:** SchemaNotFoundError

**Algorithm:**
1. Map schemaName to file path
2. Return path

---

### Internal Helper: compileValidator(schemaPath: string): Ajv
```typescript
function compileValidator(schemaPath: string): Ajv
```

**Input:** Schema file path

**Output:** Compiled Ajv validator

**Throws:** SchemaCompilationError

**Algorithm:**
1. Read schema file
2. Parse JSON
3. Compile with Ajv
4. Return validator

---

## Module: lib/validation/layer2-constraints.ts

### Responsibility
Layer 2 validation - constraint validation from config.

### Public API

#### Function: validateConstraints(content: any, contentType: string): ValidationResult
```typescript
export function validateConstraints(content: any, contentType: string): ValidationResult
```

**Input:**
- `content`: Content object
- `contentType`: Content type (package, model, workflow, cheatsheet, registry)

**Output:** ValidationResult { valid: boolean, errors: ValidationError[] }

**Throws:** None

**Side Effects:** None (pure validation)

**Performance:** O(1) - fixed number of checks

**Algorithm:**
1. Load config via loadConfig()
2. Get size budgets for content type
3. Check array lengths against budgets
4. Check string lengths against budgets
5. Return result

**Dependencies:**
- lib/config/loader.ts
- types/config.ts

---

### Internal Helper: checkArrayLength(field: any, max: number, fieldName: string): ValidationError[]
```typescript
function checkArrayLength(field: any, max: number, fieldName: string): ValidationError[]
```

**Input:** Array field, max length, field name

**Output:** Array of validation errors (empty if valid)

**Algorithm:**
1. If field is not array, return error
2. If field.length > max, return error
3. Return empty array

---

### Internal Helper: checkStringLength(field: any, max: number, fieldName: string): ValidationError[]
```typescript
function checkStringLength(field: any, max: number, fieldName: string): ValidationError[]
```

**Input:** String field, max length, field name

**Output:** Array of validation errors (empty if valid)

**Algorithm:**
1. If field is not string, return error
2. If field.length > max, return error
3. Return empty array

---

## Module: lib/validation/layer3-crossref.ts

### Responsibility
Layer 3 validation - cross-reference validation.

### Public API

#### Function: validateCrossReferences(content: any, allContent: any[]): ValidationResult
```typescript
export function validateCrossReferences(content: any, allContent: any[]): ValidationResult
```

**Input:**
- `content`: Content object to validate
- `allContent`: Array of all content objects in repository

**Output:** ValidationResult { valid: boolean, errors: ValidationError[] }

**Throws:** None

**Side Effects:** None (pure validation)

**Performance:** O(n) where n = number of relationships

**Algorithm:**
1. Extract relationships from content
2. For each relationship ID:
   - Validate ID format
   - Check if ID exists in allContent
   - Check for self-reference
   - Check for circular reference
3. Check bidirectional relationships if required by config
4. Return result

**Dependencies:**
- lib/config/loader.ts
- metadata/registry.json

---

### Internal Helper: validateIdFormat(id: string): ValidationError[]
```typescript
function validateIdFormat(id: string): ValidationError[]
```

**Input:** Content ID

**Output:** Array of validation errors (empty if valid)

**Algorithm:**
1. Check if ID matches pattern "^[a-z]+:[a-z0-9-]+$"
2. If not, return error
3. Return empty array

---

### Internal Helper: checkIdExists(id: string, allContent: any[]): boolean
```typescript
function checkIdExists(id: string, allContent: any[]): boolean
```

**Input:** Content ID, all content array

**Output:** true if exists, false otherwise

**Algorithm:**
1. Create Set of all IDs from allContent
2. Return Set.has(id)

---

### Internal Helper: checkSelfReference(id: string, referencedIds: string[]): ValidationError[]
```typescript
function checkSelfReference(id: string, referencedIds: string[]): ValidationError[]
```

**Input:** Content ID, array of referenced IDs

**Output:** Array of validation errors (empty if valid)

**Algorithm:**
1. If referencedIds includes id, return error
2. Return empty array

---

### Internal Helper: checkCircularReference(id: string, referencedIds: string[], allContent: any[]): ValidationError[]
```typescript
function checkCircularReference(id: string, referencedIds: string[], allContent: any[]): ValidationError[]
```

**Input:** Content ID, referenced IDs, all content

**Output:** Array of validation errors (empty if valid)

**Algorithm:**
1. Build relationship graph starting from id
2. Detect cycles using DFS
3. If cycle found, return error
4. Return empty array

---

### Internal Helper: checkBidirectional(contentId: string, referencedId: string, allContent: any[]): ValidationError[]
```typescript
function checkBidirectional(contentId: string, referencedId: string, allContent: any[]): ValidationError[]
```

**Input:** Source ID, target ID, all content

**Output:** Array of validation errors (empty if valid)

**Algorithm:**
1. Find referencedId in allContent
2. Check if its relationships include contentId
3. If not and config requires bidirectional, return error
4. Return empty array

---

## Module: lib/validation/layer4-semantic.ts

### Responsibility
Layer 4 validation - semantic validation.

### Public API

#### Function: validateSemantic(content: any): ValidationResult
```typescript
export function validateSemantic(content: any): ValidationResult
```

**Input:** Content object

**Output:** ValidationResult { valid: boolean, errors: ValidationError[] }

**Throws:** None

**Side Effects:** None (pure validation)

**Performance:** O(n) where n = number of tags/aliases

**Algorithm:**
1. Load metadata files
2. Check all tags are registered
3. Check all aliases are registered
4. Check category is valid (if present)
5. Check status consistency (deprecated flag matches status)
6. Check verification date within stability tier cadence
7. Check deprecated object presence
8. Return result

**Dependencies:**
- metadata/tags.json
- metadata/aliases.json
- metadata/categories.json
- lib/config/loader.ts

---

### Internal Helper: checkTagsRegistered(tags: string[], metadataTags: any[]): ValidationError[]
```typescript
function checkTagsRegistered(tags: string[], metadataTags: any[]): ValidationError[]
```

**Input:** Content tags, metadata tags array

**Output:** Array of validation errors (empty if valid)

**Algorithm:**
1. Create Set of registered tag IDs
2. For each content tag, check if in Set
3. If not, add error
4. Return errors

---

### Internal Helper: checkAliasesRegistered(aliases: string[], metadataAliases: any[]): ValidationError[]
```typescript
function checkAliasesRegistered(aliases: string[], metadataAliases: any[]): ValidationError[]
```

**Input:** Content aliases, metadata aliases array

**Output:** Array of validation errors (empty if valid)

**Algorithm:**
1. Create Set of registered alias strings
2. For each content alias, check if in Set
3. If not, add error
4. Return errors

---

### Internal Helper: checkStatusConsistency(status: string, deprecated: any): ValidationError[]
```typescript
function checkStatusConsistency(status: string, deprecated: any): ValidationError[]
```

**Input:** Status field, deprecated object

**Output:** Array of validation errors (empty if valid)

**Algorithm:**
1. If status === "deprecated" and deprecated is missing, return error
2. If status !== "deprecated" and deprecated exists, return error
3. Return empty array

---

### Internal Helper: checkVerificationDate(verificationDate: string, stability: string, config: AENSConfig): ValidationError[]
```typescript
function checkVerificationDate(verificationDate: string, stability: string, config: AENSConfig): ValidationError[]
```

**Input:** Verification date, stability tier, config

**Output:** Array of validation errors (empty if valid)

**Algorithm:**
1. Get review cadence from config for stability tier
2. Calculate days since verification
3. If days > cadence, return error
4. Return empty array

---

## Module: scripts/validate.ts

### Responsibility
CLI validation script integrating all 4 layers.

### Public API (CLI)

#### Command: validate --file <path>
```bash
pnpm validate --file content/packages/numpy.json
```

**Behavior:**
- Load single file
- Run all 4 validation layers
- Print results
- Exit with code 0 (success) or 1 (failure)

---

#### Command: validate --all
```bash
pnpm validate --all
```

**Behavior:**
- Load all content files
- Run all 4 validation layers on each
- Print summary
- Exit with code 0 (success) or 1 (failure)

---

#### Command: validate --layer <1-4>
```bash
pnpm validate --layer 1
```

**Behavior:**
- Run only specified layer on all content
- Print results
- Exit with code 0 (success) or 1 (failure)

---

### Implementation

**Entry Point:** scripts/validate.ts (executed with tsx)

**Dependencies:**
- lib/validation/layer1-schema.ts
- lib/validation/layer2-constraints.ts
- lib/validation/layer3-crossref.ts
- lib/validation/layer4-semantic.ts
- lib/content/loaders.ts

**Algorithm:**
1. Parse CLI arguments
2. Load content based on arguments
3. Run validation layers based on arguments
4. Aggregate results
5. Print formatted output
6. Exit with appropriate code

**Output Format:**
```
✓ content/packages/numpy.json - Valid
✗ content/models/transformer.json - Invalid
  - Layer 1: Missing required field 'mental_trigger'
  - Layer 4: Unregistered tag 'deep-learning'

Summary: 2 files, 1 valid, 1 invalid, 2 errors
```

---

## Module: scripts/build-search-index.ts

### Responsibility
Generate search-index.json from content.

### Public API (CLI)

#### Command: build-search-index
```bash
pnpm build-search-index
```

**Behavior:**
- Load all content
- Extract searchable fields
- Generate search-index.json
- Write to repository root

---

### Implementation

**Entry Point:** scripts/build-search-index.ts (executed with tsx)

**Output File:** search-index.json

**Output Structure:**
```json
{
  "version": "2.0",
  "generated_at": "2026-06-30T00:00:00Z",
  "entries": [
    {
      "id": "package:numpy",
      "type": "package",
      "title": "NumPy",
      "aliases": ["np"],
      "tags": ["python", "numerical"],
      "description": "Numerical computing library",
      "keywords": ["array", "matrix"],
      "content_preview": "NumPy is the fundamental package...",
      "category": "ml"
    }
  ]
}
```

**Dependencies:**
- lib/content/loaders.ts
- metadata/categories.json

**Algorithm:**
1. Load all content via loadAllContent()
2. For each content item:
   - Extract id, type, title
   - Extract aliases, tags, description, keywords
   - Generate content_preview (first 200 chars)
   - Determine category from metadata/categories.json
   - Create search entry
3. Add metadata (version, generated_at)
4. Write search-index.json

**Field Extraction Rules:**
- `aliases`: From content.aliases array
- `tags`: From content.tags array
- `keywords`: From content.keywords array
- `content_preview`: First 200 characters of description or first text field
- `category`: Determined by content type and metadata/categories.json mapping

**Performance:** O(n) where n = total content files

---

## Module: scripts/build-nav.js

### Responsibility
Generate _nav.json files from content.

### Public API (CLI)

#### Command: build-nav
```bash
pnpm build-nav
```

**Behavior:**
- Load all content
- Generate navigation items
- Write _nav.json to each content directory
- Validate against metadata/categories.json

---

### Implementation

**Entry Point:** scripts/build-nav.js

**Output Files:**
- content/packages/_nav.json
- content/models/_nav.json
- content/models/ml/_nav.json
- content/models/dl/_nav.json
- content/models/llm/_nav.json
- content/workflows/_nav.json
- content/cheatsheets/_nav.json
- content/registry/_nav.json

**Output Structure:**
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

**Dependencies:**
- lib/content/loaders.ts
- metadata/categories.json

**Algorithm:**
1. Load all content via loadAllContent()
2. Group content by directory
3. For each directory:
   - Extract id, title, slug
   - Determine category from metadata/categories.json
   - Create navigation item
   - Write _nav.json
4. Validate categories against metadata/categories.json

**Category Assignment (v2.1):**
- All types: category assigned via tag-based inference from metadata/categories.json
- Algorithm: For each content item, find category whose `tag_rules.priority` array contains the most matching tags from item's `tags` array. If tie, use first matching category. If no match, assign "uncategorized" and emit validation warning.
- See ADR-002 for complete specification

**Deterministic Ordering (v2.1):**
- Navigation items MUST be sorted by `title` ascending, then by `id` ascending as tiebreaker
- This ensures platform-independent deterministic generation

**Performance:** O(n) where n = total content files

---

# Error Type Specifications

## Error Hierarchy

```
AENSError (base)
├── ConfigError
│   ├── ConfigNotFoundError
│   ├── ConfigParseError
│   └── ConfigValidationError
├── ContentError
│   ├── ContentNotFoundError
│   ├── ContentParseError
│   └── ContentSchemaError
├── ValidationError
│   ├── SchemaNotFoundError
│   ├── SchemaCompilationError
│   ├── ConstraintViolationError
│   ├── CrossReferenceError
│   └── SemanticValidationError
├── RegistryError
│   ├── DuplicateIdError
│   └── InvalidIdFormatError
└── MetadataError
    ├── TagNotRegisteredError
    └── AliasNotRegisteredError
```

## Error Contract

### All Errors Must Implement

```typescript
interface AENSError extends Error {
  code: string;           // Unique error code (e.g., "CONFIG_NOT_FOUND")
  context?: Record<string, any>;  // Additional context
  recoverable: boolean;   // Can the operation be retried?
  severity: 'fatal' | 'error' | 'warning' | 'ignore';
}
```

### Error Handling Rules

**Fatal Errors:**
- Stop execution immediately
- Log full error with context
- Exit with non-zero code
- Examples: ConfigNotFoundError, SchemaCompilationError

**Recoverable Errors:**
- Log error with context
- Continue with next item if processing batch
- Exit with non-zero code if any errors
- Examples: ContentParseError, ValidationError

**Warnings:**
- Log warning
- Continue execution
- Exit with zero code
- Examples: Unregistered tag (if config allows), Bidirectional relationship missing

**Ignore:**
- Log at debug level
- Continue execution
- Exit with zero code
- Examples: Deprecated content references

---

# Performance Specifications

## Performance Targets

| Operation | Target | Measurement |
|-----------|--------|-------------|
| loadConfig() | < 10ms | Single file read + validation |
| loadContentFile() | < 5ms | Single file read + parsing |
| loadAllContent() | < 500ms | All content files |
| validateSchema() | < 10ms | Single content validation |
| validateAllContent() | < 10s | All content, all layers |
| resolveById() | < 5ms | With cache |
| resolveById() | < 50ms | Without cache |
| build-search-index | < 5s | Full index generation |
| build-nav | < 2s | Full nav generation |

## Caching Policies

**Content Cache (lib/content/cache.ts):**
- Default TTL: 5 minutes
- Default maxSize: 1000 entries
- Eviction policy: LRU
- Invalidation: Manual or TTL

**Schema Validator Cache (lib/validation/layer1-schema.ts):**
- TTL: Infinite (schemas don't change at runtime)
- maxSize: 7 (one per schema)
- Eviction policy: None

**Config Cache (lib/config/loader.ts):**
- TTL: Infinite (config doesn't change at runtime)
- maxSize: 1
- Eviction policy: None

---

# Data Flow Specifications

## Content Loading Flow

```
User Request
    ↓
resolveById(id)
    ↓
cache.get(id)
    ↓
Cache Hit?
    ├─ Yes → Return cached content
    └─ No → loadContentFile(path)
            ↓
        Read file
            ↓
        Parse JSON
            ↓
        validateSchema()
            ↓
        cache.set(id, content)
            ↓
        Return content
```

## Validation Flow

```
Content File
    ↓
Layer 1: validateSchema()
    ├─ Fail → Return errors
    └─ Pass → Layer 2
            ↓
        Layer 2: validateConstraints()
            ├─ Fail → Return errors
            └─ Pass → Layer 3
                    ↓
                Layer 3: validateCrossReferences()
                    ├─ Fail → Return errors
                    └─ Pass → Layer 4
                            ↓
                        Layer 4: validateSemantic()
                            ├─ Fail → Return errors
                            └─ Pass → Valid
```

## Search Index Generation Flow

```
Start
    ↓
loadAllContent()
    ↓
For each content:
    ├─ Extract fields
    ├─ Generate preview
    ├─ Determine category
    └─ Add to entries
    ↓
Add metadata (version, timestamp)
    ↓
Write search-index.json
    ↓
Validate output
    ↓
Done
```

---

# Testing Specifications

## Required Test Coverage

**Unit Tests:**
- Every exported function: 100% coverage
- Every error path: 100% coverage
- Edge cases: 80% coverage

**Integration Tests:**
- Content loading pipeline: 100% coverage
- Validation pipeline: 100% coverage
- Search indexing: 100% coverage
- Navigation generation: 100% coverage

**Regression Tests:**
- Known bugs: Test cases added
- Fixed issues: Test cases added

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
│   └── validation/
│       ├── layer1-schema.test.ts
│       ├── layer2-constraints.test.ts
│       ├── layer3-crossref.test.ts
│       └── layer4-semantic.test.ts
├── integration/
│   ├── content-loading.test.ts
│   ├── validation-pipeline.test.ts
│   ├── search-indexing.test.ts
│   └── navigation-generation.test.ts
└── fixtures/
    ├── content/
    │   ├── valid-package.json
    │   ├── invalid-package.json
    │   └── ...
    └── metadata/
        ├── tags.json
        ├── aliases.json
        └── ...
```

## Test Data Requirements

**Fixtures:**
- Valid content for each type
- Invalid content for each validation layer
- Edge case content (empty arrays, max lengths, etc.)
- Metadata files for testing

**Mock Data:**
- Mock filesystem for loader tests
- Mock cache for resolver tests
- Mock config for validation tests

---

# Migration Specifications

## Field Mappings

### alternatives → relationships

**Old Structure:**
```json
{
  "alternatives": [
    { "id": "package:scipy", "type": "package" },
    { "id": "model:transformer", "type": "model" }
  ]
}
```

**New Structure:**
```json
{
  "relationships": {
    "packages": ["package:scipy"],
    "models": ["model:transformer"],
    "workflows": [],
    "cheatsheets": [],
    "registry": []
  }
}
```

**Transformation Algorithm:**
1. For each item in alternatives array:
   - Extract type and id
   - Map type to relationship array name (package → packages, etc.)
   - Add id to appropriate array
2. Remove alternatives field
3. Add relationships field

**Validation:**
- All IDs in relationships must exist
- Bidirectional relationships must be maintained

---

### Schema Version Addition

**Transformation:**
- Add `schema_version: "2.0"` to all content files
- Field is required in new schema

**Validation:**
- schema_version must be "2.0"
- schema_version must match config mapping

---

### BaseMeta Field Addition

**New Required Fields:**
- `schema_version`
- `id`
- `title`
- `slug`
- `aliases`
- `description`
- `tags`
- `status`
- `stability`
- `versioning`
- `relationships`
- `keywords`
- `content_role`

**Transformation Algorithm:**
1. For each content file:
   - Extract existing fields
   - Generate missing fields with defaults:
     - `schema_version`: "2.0"
     - `id`: Generate from type + slug
     - `title`: Use existing title or generate
     - `slug`: Use existing slug or generate from filename
     - `aliases`: Extract from legacy or empty array
     - `description`: Use existing or generate
     - `tags`: Extract from legacy or empty array
     - `status`: "complete" (default)
     - `stability`: "stable" (default)
     - `versioning`: { verified_against: "unknown", last_verified_at: now }
     - `relationships`: Transform from alternatives
     - `keywords`: Empty array
     - `content_role`: "index" (default)

**Validation:**
- All required fields present
- All fields match schema
- ID format valid

---

# Build Integration Specifications

## Pre-commit Hooks

### Hook: validate-content
**Trigger:** Pre-commit on content/ changes
**Command:** `pnpm validate --all`
**Behavior:** Block commit if validation fails

### Hook: build-artifacts
**Trigger:** Pre-commit on content/ changes
**Command:** `pnpm build-nav && pnpm build-search-index`
**Behavior:** Regenerate artifacts before commit

---

## Package.json Scripts

```json
{
  "scripts": {
    "validate": "tsx scripts/validate.ts",
    "validate:file": "tsx scripts/validate.ts --file",
    "validate:all": "tsx scripts/validate.ts --all",
    "build-nav": "tsx scripts/build-nav.ts",
    "build-search": "tsx scripts/build-search-index.ts",
    "build-artifacts": "pnpm build-nav && pnpm build-search",
    "type-check": "tsc --noEmit",
    "lint": "eslint . --ext .ts,.tsx",
    "build:prod": "pnpm type-check && pnpm lint && pnpm validate:all && pnpm build-artifacts && next build",
    "test": "vitest",
    "test:coverage": "vitest --coverage"
  }
}
```

**Note:** Scripts use `tsx` for TypeScript execution. See v2.1 Fix 1 and BUILD_PIPELINE_SPECIFICATION.md

---

# File Format Specifications

## Content File Format

**Encoding:** UTF-8
**Line Endings:** LF (Unix)
**Indentation:** 2 spaces
**Trailing Newline:** Required
**Trailing Whitespace:** Forbidden

## JSON Schema File Format

**Encoding:** UTF-8
**Line Endings:** LF
**Indentation:** 2 spaces
**Trailing Newline:** Required
**$schema:** Must be JSON Schema 2020-12
**$id:** Must be unique URL

## Metadata File Format

**Encoding:** UTF-8
**Line Endings:** LF
**Indentation:** 2 spaces
**Trailing Newline:** Required
**Sort Order:** Alphabetical by key

---

# Final Notes

## Implementation Priority

When implementing, follow this order within each module:

1. Type definitions
2. Error classes
3. Internal helpers
4. Public API
5. Tests

## Code Style

- Use TypeScript strict mode
- No `any` types (use `unknown` if truly unknown)
- All functions must have JSDoc
- All exports must be typed
- Use const by default, let only when necessary
- Prefer functional patterns over classes (except Cache)
- No side effects in pure functions

## Documentation Requirements

- Every exported function: JSDoc with @param, @returns, @throws
- Every module: Top-level JSDoc describing purpose
- Every complex algorithm: Inline comments explaining logic
- Every error: JSDoc with @throws documentation

This specification is complete. No implementation decisions should be required.
