# Foundation Implementation Blueprint
**Version:** 1.0
**Purpose:** Complete implementation map - every file, every directory, every dependency, every API
**Status:** Final blueprint before coding begins
**Governed by:** AENS_REBUILD_MASTER_PLAN.md, REPOSITORY_FOUNDATION_SPECIFICATION_v2.md, AI_EXECUTION_PROTOCOL.md

---

# Blueprint Purpose

This document is the **architectural drawing** for the AENS repository rebuild. It specifies:

- Every directory to create
- Every file to create
- The responsibility of each file
- Dependencies between files
- Public APIs
- Build order
- Validation checkpoints
- Acceptance criteria for each stage

**No AI agent should make implementation decisions.** All decisions are already specified here. AI agents are implementers, not architects.

---

# Implementation Order

The rebuild follows this deterministic order:

1. **Repository Skeleton** - Create directory structure
2. **Configuration** - Create aens.config.json and loader
3. **JSON Schema** - Create all schema files
4. **Metadata** - Create controlled vocabulary files
5. **Types** - Generate TypeScript types from schemas
6. **Validation** - Implement 4-layer validation pipeline
7. **Content Loader** - Implement content engine
8. **Search Engine** - Implement search indexing
9. **Navigation** - Implement navigation generation
10. **UI Foundation** - Update components to use new systems
11. **Pages** - Update app routes to use new systems
12. **Content Migration** - Migrate all content to new architecture
13. **Testing** - Comprehensive testing and validation
14. **Polish** - Performance optimization and cleanup

---

# Phase 1: Repository Skeleton

## Goal
Create the complete directory structure before any files are created.

## Directories to Create

```
ai-engineering-handbook/
├── content/
│   ├── packages/
│   ├── models/
│   │   ├── ml/
│   │   ├── dl/
│   │   └── llm/
│   ├── workflows/
│   ├── cheatsheets/
│   └── registry/
├── schema/
│   └── v2/
├── metadata/
├── types/
├── scripts/
├── lib/
│   ├── content/
│   ├── validation/
│   └── config/
├── docs/
│   ├── adr/
│   └── migration_v2/
└── legacy/
```

## Implementation Steps

### Step 1.1: Create Content Directories
- [ ] Create `content/` directory
- [ ] Create `content/packages/` directory
- [ ] Create `content/models/` directory
- [ ] Create `content/models/ml/` directory
- [ ] Create `content/models/dl/` directory
- [ ] Create `content/models/llm/` directory
- [ ] Create `content/workflows/` directory
- [ ] Create `content/cheatsheets/` directory
- [ ] Create `content/registry/` directory
- [ ] Add `.gitkeep` to each empty directory

**Acceptance Criteria:**
- All content directories exist
- Each directory has `.gitkeep`
- `ls content/` shows: packages, models, workflows, cheatsheets, registry
- `ls content/models/` shows: ml, dl, llm

---

### Step 1.2: Create Schema Directories
- [ ] Create `schema/` directory
- [ ] Create `schema/v2/` directory
- [ ] Add `.gitkeep` to `schema/v2/`

**Acceptance Criteria:**
- `schema/v2/` directory exists
- Directory has `.gitkeep`

---

### Step 1.3: Create Metadata Directory
- [ ] Create `metadata/` directory
- [ ] Add `.gitkeep` to `metadata/`

**Acceptance Criteria:**
- `metadata/` directory exists
- Directory has `.gitkeep`

---

### Step 1.4: Verify Types Directory
- [ ] Verify `types/` directory exists (already exists)
- [ ] Clear existing types (they will be regenerated)
- [ ] Add `.gitkeep` if empty

**Acceptance Criteria:**
- `types/` directory exists
- Directory is ready for new types

---

### Step 1.5: Verify Scripts Directory
- [ ] Verify `scripts/` directory exists (already exists)
- [ ] Clear old scripts (already moved to legacy)
- [ ] Add `.gitkeep` if empty

**Acceptance Criteria:**
- `scripts/` directory exists
- Directory is ready for new scripts

---

### Step 1.6: Create Lib Subdirectories
- [ ] Create `lib/content/` directory
- [ ] Create `lib/validation/` directory
- [ ] Verify `lib/config/` exists (already exists)
- [ ] Add `.gitkeep` to each new directory

**Acceptance Criteria:**
- `lib/content/` directory exists
- `lib/validation/` directory exists
- Each has `.gitkeep`

---

### Step 1.7: Create Legacy Directory
- [ ] Create `legacy/` directory
- [ ] Add `.gitkeep` to `legacy/`

**Acceptance Criteria:**
- `legacy/` directory exists
- Directory has `.gitkeep`

---

## Phase 1 Definition of Done
- [ ] All directories created
- [ ] All `.gitkeep` files in place
- [ ] Directory structure matches blueprint exactly
- [ ] No files created yet (only directories)

---

# Phase 2: Configuration

## Goal
Create central configuration system before any other implementation.

## Files to Create

### File 2.1: aens.config.json
**Location:** Repository root
**Purpose:** Central configuration authority
**Dependencies:** None
**Public API:** Read by lib/config/loader.ts

**Structure:**
```json
{
  "version": "2.0",
  "content_types": ["package", "model", "workflow", "cheatsheet", "registry"],
  "schema_version_mapping": {
    "2.0": "schema/v2"
  },
  "size_budgets": {
    "package_max_common_tasks": 15,
    "workflow_max_steps": 8,
    "cheatsheet_max_entries": 30,
    "max_relationships_per_type": 20,
    "max_total_relationships": 50
  },
  "stability_tiers": {
    "stable": {
      "review_cadence_days": 365,
      "verification_required": true
    },
    "semi_stable": {
      "review_cadence_days": 90,
      "verification_required": true
    },
    "volatile": {
      "review_cadence_days": 30,
      "verification_required": false
    }
  },
  "validation_rules": {
    "require_bidirectional_relationships": true,
    "allow_unregistered_tags": false,
    "allow_unregistered_aliases": false
  },
  "registry_asset_types": ["model", "dataset", "service"]
}
```

**Implementation Steps:**
- [ ] Create `aens.config.json` at repository root
- [ ] Add all required sections
- [ ] Validate JSON syntax

**Acceptance Criteria:**
- File exists at root
- JSON is valid
- All sections present
- Structure matches blueprint

---

### File 2.2: schema/config.schema.json
**Location:** schema/config.schema.json
**Purpose:** Schema for aens.config.json validation
**Dependencies:** None
**Public API:** Used by validation scripts

**Structure:**
```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://aens.dev/schema/config.schema.json",
  "title": "AENS Configuration",
  "type": "object",
  "required": ["version", "content_types", "schema_version_mapping", "size_budgets", "stability_tiers", "validation_rules", "registry_asset_types"],
  "properties": {
    "version": { "type": "string", "pattern": "^\\d+\\.\\d+$" },
    "content_types": { "type": "array", "items": { "type": "string" } },
    "schema_version_mapping": { "type": "object" },
    "size_budgets": { "type": "object" },
    "stability_tiers": { "type": "object" },
    "validation_rules": { "type": "object" },
    "registry_asset_types": { "type": "array", "items": { "type": "string" } }
  }
}
```

**Implementation Steps:**
- [ ] Create `schema/config.schema.json`
- [ ] Define schema for all config sections
- [ ] Validate schema is valid JSON Schema 2020-12

**Acceptance Criteria:**
- File exists
- Schema is valid JSON Schema 2020-12
- All config sections have schema definitions

---

### File 2.3: lib/config/loader.ts
**Location:** lib/config/loader.ts
**Purpose:** Load and validate aens.config.json
**Dependencies:** aens.config.json, schema/config.schema.json
**Public API:** `loadConfig(): Promise<AENSConfig>`

**TypeScript Interface:**
```typescript
export interface AENSConfig {
  version: string;
  content_types: string[];
  schema_version_mapping: Record<string, string>;
  size_budgets: {
    package_max_common_tasks: number;
    workflow_max_steps: number;
    cheatsheet_max_entries: number;
    max_relationships_per_type: number;
    max_total_relationships: number;
  };
  stability_tiers: {
    stable: { review_cadence_days: number; verification_required: boolean };
    semi_stable: { review_cadence_days: number; verification_required: boolean };
    volatile: { review_cadence_days: number; verification_required: boolean };
  };
  validation_rules: {
    require_bidirectional_relationships: boolean;
    allow_unregistered_tags: boolean;
    allow_unregistered_aliases: boolean;
  };
  registry_asset_types: string[];
}

export async function loadConfig(): Promise<AENSConfig>;
```

**Implementation Steps:**
- [ ] Create `lib/config/loader.ts`
- [ ] Define AENSConfig interface
- [ ] Implement loadConfig() function
- [ ] Add error handling for missing file
- [ ] Add error handling for invalid JSON
- [ ] Add validation against schema/config.schema.json
- [ ] Export function

**Acceptance Criteria:**
- File exists
- loadConfig() function works
- Returns AENSConfig object
- Throws clear error if file missing
- Throws clear error if JSON invalid
- Validates against schema

---

### File 2.4: types/config.ts
**Location:** types/config.ts
**Purpose:** TypeScript types for configuration
**Dependencies:** schema/config.schema.json
**Public API:** Exported types used throughout codebase

**Implementation Steps:**
- [ ] Create `types/config.ts`
- [ ] Generate types from schema/config.schema.json
- [ ] Review generated types
- [ ] Add JSDoc documentation
- [ ] Export types

**Acceptance Criteria:**
- File exists
- Types match schema
- JSDoc documentation present
- Types exported

---

## Phase 2 Definition of Done
- [ ] aens.config.json created and valid
- [ ] schema/config.schema.json created and valid
- [ ] lib/config/loader.ts implemented
- [ ] types/config.ts generated
- [ ] Config loads successfully
- [ ] Config validates against schema

---

# Phase 3: JSON Schema

## Goal
Create all JSON Schema files for content types.

## Files to Create

### File 3.1: schema/v2/base.schema.json
**Location:** schema/v2/base.schema.json
**Purpose:** Base schema for all content types
**Dependencies:** None
**Public API:** Extended by all content type schemas

**Required Fields:**
- schema_version (string)
- id (string, pattern: "^[a-z]+:[a-z0-9-]+$")
- title (string, maxLength: 100)
- slug (string, maxLength: 60)
- aliases (array, maxItems: 10)
- description (string, maxLength: 300)
- tags (array, maxItems: 8)
- status (enum: "draft" | "stub" | "complete" | "deprecated")
- deprecated (object, conditional on status)
- stability (enum: "stable" | "semi_stable" | "volatile")
- versioning (object)
- created_at (string, format: date-time)
- updated_at (string, format: date-time)
- sources (array)
- relationships (object)
- keywords (array)
- content_role (enum: "index" | "child")

**Schema Structure:**
```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://aens.dev/schema/v2/base.schema.json",
  "title": "BaseMeta",
  "type": "object",
  "required": ["schema_version", "id", "title", "slug", "description", "tags", "status", "stability", "versioning", "created_at", "updated_at", "content_role"],
  "properties": {
    "schema_version": {
      "type": "string",
      "const": "2.0"
    },
    "id": {
      "type": "string",
      "pattern": "^[a-z]+:[a-z0-9-]+$"
    },
    "title": {
      "type": "string",
      "maxLength": 100
    },
    "slug": {
      "type": "string",
      "maxLength": 60
    },
    "aliases": {
      "type": "array",
      "maxItems": 10,
      "items": {
        "type": "string"
      }
    },
    "description": {
      "type": "string",
      "maxLength": 300
    },
    "tags": {
      "type": "array",
      "maxItems": 8,
      "items": {
        "type": "string"
      }
    },
    "status": {
      "type": "string",
      "enum": ["draft", "stub", "complete", "deprecated"]
    },
    "deprecated": {
      "type": "object",
      "properties": {
        "replaced_by": {
          "type": "string"
        },
        "reason": {
          "type": "string"
        }
      }
    },
    "stability": {
      "type": "string",
      "enum": ["stable", "semi_stable", "volatile"]
    },
    "versioning": {
      "type": "object",
      "properties": {
        "current_version": {
          "type": "string"
        }
      }
    },
    "created_at": {
      "type": "string",
      "format": "date-time"
    },
    "updated_at": {
      "type": "string",
      "format": "date-time"
    },
    "sources": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "url": {
            "type": "string",
            "format": "uri"
          },
          "title": {
            "type": "string"
          }
        }
      }
    },
    "relationships": {
      "type": "object",
      "properties": {
        "packages": {
          "type": "array",
          "items": {
            "type": "string"
          }
        },
        "models": {
          "type": "array",
          "items": {
            "type": "string"
          }
        },
        "workflows": {
          "type": "array",
          "items": {
            "type": "string"
          }
        },
        "cheatsheets": {
          "type": "array",
          "items": {
            "type": "string"
          }
        }
      }
    },
    "keywords": {
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "content_role": {
      "type": "string",
      "enum": ["index", "child"]
    }
  }
}
```

**Implementation Steps:**
- [ ] Create `schema/v2/base.schema.json`
- [ ] Set $schema to JSON Schema 2020-12
- [ ] Set $id
- [ ] Define all BaseMeta fields
- [ ] Add constraints (maxLength, maxItems, pattern)
- [ ] Add field descriptions
- [ ] Add required fields array
- [ ] Validate schema is valid

**Acceptance Criteria:**
- File exists
- Schema is valid JSON Schema 2020-12
- All BaseMeta fields defined
- Constraints defined
- Required fields listed
- Descriptions present

---

### File 3.2: schema/v2/package.schema.json
**Location:** schema/v2/package.schema.json
**Purpose:** Schema for package content type
**Dependencies:** schema/v2/base.schema.json
**Public API:** Validates package content files

**Additional Required Fields:**
- common_tasks (array, maxItems: 15)
- production_considerations (string, maxLength: 300)
- decision_notes (string)

**Schema Structure:**
```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://aens.dev/schema/v2/package.schema.json",
  "title": "Package",
  "type": "object",
  "allOf": [
    {
      "$ref": "base.schema.json"
    },
    {
      "type": "object",
      "required": ["common_tasks", "production_considerations"],
      "properties": {
        "common_tasks": {
          "type": "array",
          "maxItems": 15,
          "items": {
            "type": "object",
            "required": ["task", "description"],
            "properties": {
              "task": {
                "type": "string"
              },
              "description": {
                "type": "string"
              }
            }
          }
        },
        "production_considerations": {
          "type": "string",
          "maxLength": 300
        },
        "decision_notes": {
          "type": "string"
        }
      }
    }
  ]
}
```

**Implementation Steps:**
- [ ] Create `schema/v2/package.schema.json`
- [ ] Extend base schema using $ref
- [ ] Define package-specific fields
- [ ] Add size budget constraints
- [ ] Add required fields
- [ ] Validate schema is valid

**Acceptance Criteria:**
- File exists
- Extends base schema
- Package-specific fields defined
- Size budgets enforced
- Required fields listed

---

### File 3.3: schema/v2/model.schema.json
**Location:** schema/v2/model.schema.json
**Purpose:** Schema for model content type
**Dependencies:** schema/v2/base.schema.json
**Public API:** Validates model content files

**Additional Required Fields:**
- architecture (object)
- evaluation (object)
- production_considerations (string, maxLength: 300)
- decision_guide (object)

**Schema Structure:**
```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://aens.dev/schema/v2/model.schema.json",
  "title": "Model",
  "type": "object",
  "allOf": [
    {
      "$ref": "base.schema.json"
    },
    {
      "type": "object",
      "required": ["architecture", "evaluation", "production_considerations"],
      "properties": {
        "architecture": {
          "type": "object",
          "required": ["type", "description"],
          "properties": {
            "type": {
              "type": "string"
            },
            "description": {
              "type": "string"
            }
          }
        },
        "evaluation": {
          "type": "object",
          "required": ["metrics"],
          "properties": {
            "metrics": {
              "type": "array",
              "items": {
                "type": "object"
              }
            }
          }
        },
        "production_considerations": {
          "type": "string",
          "maxLength": 300
        },
        "decision_guide": {
          "type": "object",
          "properties": {
            "when_to_use": {
              "type": "array",
              "items": {
                "type": "string"
              }
            }
          }
        }
      }
    }
  ]
}
```

**Implementation Steps:**
- [ ] Create `schema/v2/model.schema.json`
- [ ] Extend base schema using $ref
- [ ] Define model-specific fields
- [ ] Add required fields
- [ ] Validate schema is valid

**Acceptance Criteria:**
- File exists
- Extends base schema
- Model-specific fields defined
- Required fields listed

---

### File 3.4: schema/v2/workflow.schema.json
**Location:** schema/v2/workflow.schema.json
**Purpose:** Schema for workflow content type
**Dependencies:** schema/v2/base.schema.json
**Public API:** Validates workflow content files

**Additional Required Fields:**
- mental_trigger (string)
- entry_points (array)
- prerequisites (object with confirmed_env)
- pipeline_failure_patterns (array)
- steps (array, maxItems: 8)
- production_notes (object)

**Schema Structure:**
```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://aens.dev/schema/v2/workflow.schema.json",
  "title": "Workflow",
  "type": "object",
  "allOf": [
    {
      "$ref": "base.schema.json"
    },
    {
      "type": "object",
      "required": ["steps", "mental_trigger"],
      "properties": {
        "steps": {
          "type": "array",
          "maxItems": 8,
          "items": {
            "type": "object",
            "required": ["step", "description"]
          }
        },
        "mental_trigger": {
          "type": "string"
        },
        "entry_points": {
          "type": "array",
          "items": {
            "type": "string"
          }
        },
        "prerequisites": {
          "type": "object",
          "properties": {
            "confirmed_env": {
              "type": "object",
              "properties": {
                "os": {
                  "type": "array",
                  "items": {
                    "type": "string"
                  }
                }
              }
            }
          }
        },
        "pipeline_failure_patterns": {
          "type": "array",
          "items": {
            "type": "string"
          }
        },
        "production_notes": {
          "type": "object"
        }
      }
    }
  ]
}
```

**Implementation Steps:**
- [ ] Create `schema/v2/workflow.schema.json`
- [ ] Extend base schema using $ref
- [ ] Define workflow-specific fields
- [ ] Add mental_trigger (required)
- [ ] Add size budget for steps
- [ ] Add required fields
- [ ] Validate schema is valid

**Acceptance Criteria:**
- File exists
- Extends base schema
- Workflow-specific fields defined
- mental_trigger present
- Size budgets enforced
- Required fields listed

---

### File 3.5: schema/v2/cheatsheet.schema.json
**Location:** schema/v2/cheatsheet.schema.json
**Purpose:** Schema for cheatsheet content type
**Dependencies:** schema/v2/base.schema.json
**Public API:** Validates cheatsheet content files

**Additional Required Fields:**
- entries (array, maxItems: 30)

**Schema Structure:**
```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://aens.dev/schema/v2/cheatsheet.schema.json",
  "title": "Cheatsheet",
  "type": "object",
  "allOf": [
    {
      "$ref": "base.schema.json"
    },
    {
      "type": "object",
      "required": ["entries"],
      "properties": {
        "entries": {
          "type": "array",
          "maxItems": 30,
          "items": {
            "type": "object",
            "required": ["command", "description"],
            "properties": {
              "command": {
                "type": "string"
              },
              "description": {
                "type": "string"
              }
            }
          }
        }
      }
    }
  ]
}
```

**Implementation Steps:**
- [ ] Create `schema/v2/cheatsheet.schema.json`
- [ ] Extend base schema using $ref
- [ ] Define cheatsheet-specific fields
- [ ] Add size budget for entries
- [ ] Add required fields
- [ ] Validate schema is valid

**Acceptance Criteria:**
- File exists
- Extends base schema
- Cheatsheet-specific fields defined
- Size budgets enforced
- Required fields listed

---

### File 3.6: schema/v2/registry.schema.json
**Location:** schema/v2/registry.schema.json
**Purpose:** Schema for registry content type
**Dependencies:** schema/v2/base.schema.json
**Public API:** Validates registry content files

**Additional Required Fields:**
- asset_type (enum: "model" | "dataset" | "service")
- deployment (object)
- hardware_requirements (object)

**Schema Structure:**
```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://aens.dev/schema/v2/registry.schema.json",
  "title": "Registry",
  "type": "object",
  "allOf": [
    {
      "$ref": "base.schema.json"
    },
    {
      "type": "object",
      "required": ["asset_type", "deployment", "hardware_requirements"],
      "properties": {
        "asset_type": {
          "type": "string",
          "enum": ["model", "dataset", "service"]
        },
        "deployment": {
          "type": "object",
          "required": ["method"],
          "properties": {
            "method": {
              "type": "string"
            }
          }
        },
        "hardware_requirements": {
          "type": "object",
          "properties": {
            "cpu": {
              "type": "string"
            },
            "memory": {
              "type": "string"
            }
          }
        }
      }
    }
  ]
}
```

**Implementation Steps:**
- [ ] Create `schema/v2/registry.schema.json`
- [ ] Extend base schema using $ref
- [ ] Define registry-specific fields
- [ ] Add required fields
- [ ] Validate schema is valid

**Acceptance Criteria:**
- File exists
- Extends base schema
- Registry-specific fields defined
- Required fields listed

---

### File 3.7: schema/v2/metadata.schema.json
**Location:** schema/v2/metadata.schema.json
**Purpose:** Schema for metadata files
**Dependencies:** None
**Public API:** Validates tags.json, aliases.json, categories.json, registry.json

**Schema Structure:**
```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://aens.dev/schema/v2/metadata.schema.json",
  "title": "Metadata",
  "type": "object",
  "properties": {
    "tags": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["id", "display_name", "category"],
        "properties": {
          "id": {
            "type": "string"
          },
          "display_name": {
            "type": "string"
          },
          "category": {
            "type": "string"
          }
        }
      }
    },
    "aliases": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["alias", "canonical_id", "type"],
        "properties": {
          "alias": {
            "type": "string"
          },
          "canonical_id": {
            "type": "string"
          },
          "type": {
            "type": "string"
          }
        }
      }
    },
    "categories": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["id", "display_name", "content_types"],
        "properties": {
          "id": {
            "type": "string"
          },
          "display_name": {
            "type": "string"
          },
          "content_types": {
            "type": "array",
            "items": {
              "type": "string"
            }
          },
          "tag_rules": {
            "type": "object",
            "properties": {
              "required_tags": {
                "type": "array",
                "items": {
                  "type": "string"
                }
              },
              "priority": {
                "type": "array",
                "items": {
                  "type": "string"
                }
              }
            }
          }
        }
      }
    },
    "ids": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["id", "type", "status"],
        "properties": {
          "id": {
            "type": "string"
          },
          "type": {
            "type": "string"
          },
          "status": {
            "type": "string"
          }
        }
      }
    }
  }
}
```

**Implementation Steps:**
- [ ] Create `schema/v2/metadata.schema.json`
- [ ] Define schema for tags.json
- [ ] Define schema for aliases.json
- [ ] Define schema for categories.json
- [ ] Define schema for registry.json
- [ ] Add constraints
- [ ] Validate schema is valid

**Acceptance Criteria:**
- File exists
- All metadata file schemas defined
- Constraints defined
- Schema is valid

---

## Phase 3 Definition of Done
- [ ] All schema files created
- [ ] All schemas valid JSON Schema 2020-12
- [ ] All $ref references resolve
- [ ] No circular references
- [ ] Schemas compile with Ajv

---

# Phase 4: Metadata

## Goal
Create controlled vocabulary files.

## Files to Create

### File 4.1: metadata/tags.json
**Location:** metadata/tags.json
**Purpose:** Controlled vocabulary for tags
**Dependencies:** None
**Public API:** Read by validation layer 4

**Structure:**
```json
{
  "tags": [
    {
      "id": "machine-learning",
      "display_name": "Machine Learning",
      "category": "domain"
    }
  ]
}
```

**Implementation Steps:**
- [ ] Create metadata/tags.json
- [ ] Define structure
- [ ] Add initial tags from legacy content
- [ ] Extract tags from legacy/content/
- [ ] Deduplicate tags
- [ ] Add category field
- [ ] Validate against metadata schema

**Acceptance Criteria:**
- File exists
- Structure matches schema
- Tags extracted from legacy
- No duplicates
- Each tag has category
- Validates against schema

---

### File 4.2: metadata/aliases.json
**Location:** metadata/aliases.json
**Purpose:** Controlled vocabulary for aliases
**Dependencies:** None
**Public API:** Read by validation layer 4

**Structure:**
```json
{
  "aliases": [
    {
      "alias": "np",
      "canonical_id": "package:numpy",
      "type": "package"
    }
  ]
}
```

**Implementation Steps:**
- [ ] Create metadata/aliases.json
- [ ] Define structure
- [ ] Add initial aliases from legacy content
- [ ] Extract aliases from legacy/content/
- [ ] Deduplicate aliases
- [ ] Add canonical_id and type fields
- [ ] Validate against metadata schema

**Acceptance Criteria:**
- File exists
- Structure matches schema
- Aliases extracted from legacy
- No duplicates
- Each alias has canonical_id and type
- Validates against schema

---

### File 4.3: metadata/categories.json
**Location:** metadata/categories.json
**Purpose:** Category definitions
**Dependencies:** None
**Public API:** Read by navigation generator

**Structure:**
```json
{
  "categories": [
    {
      "id": "ml",
      "display_name": "Machine Learning",
      "content_types": ["model", "package"],
      "tag_rules": {
        "required_tags": ["ml", "machine-learning"],
        "priority": ["ml", "dl", "llm"]
      }
    }
  ]
}
```

**Implementation Steps:**
- [ ] Create metadata/categories.json
- [ ] Define structure
- [ ] Add categories from legacy navigation
- [ ] Extract categories from legacy/content/*/_nav.json
- [ ] Add display_name and content_types
- [ ] Add tag_rules for category assignment
- [ ] Validate against metadata schema

**Acceptance Criteria:**
- File exists
- Structure matches schema
- Categories extracted from legacy
- Each category has display_name and content_types
- tag_rules defined for category assignment
- Validates against schema

---

### File 4.4: metadata/registry.json
**Location:** metadata/registry.json
**Purpose:** ID registry
**Dependencies:** None
**Public API:** Read by validation layer 3

**Structure:**
```json
{
  "ids": [
    {
      "id": "package:numpy",
      "type": "package",
      "status": "active"
    },
    {
      "id": "model:ml:transformer",
      "type": "model",
      "status": "active"
    }
  ]
}
```

**Implementation Steps:**
- [ ] Create metadata/registry.json
- [ ] Define structure
- [ ] Add all IDs from legacy content
- [ ] Extract IDs from legacy/content/
- [ ] Add type and status fields
- [ ] For models, use full ID format with category
- [ ] Validate against metadata schema

**Acceptance Criteria:**
- File exists
- Structure matches schema
- IDs extracted from legacy
- Each ID has type and status
- Model IDs use category encoding
- Validates against schema

---

## Phase 4 Definition of Done
- [ ] All metadata files created
- [ ] All files validate against schema
- [ ] All data extracted from legacy
- [ ] No duplicates or collisions
- [ ] tag_rules defined in categories.json

---

# Phase 5: Types

## Goal
Generate TypeScript types from JSON Schema.

## Type Generation Method

Use `json-schema-to-typescript` package to generate TypeScript types from JSON Schema files.

**Installation:**
```bash
pnpm add -D json-schema-to-typescript
```

**Generation Command:**
```bash
npx json-schema-to-typescript schema/v2/base.schema.json --cwd schema/v2 --out types/base.ts
```

**Options:**
- `--cwd schema/v2`: Base directory for $ref resolution
- `--out types/base.ts`: Output file path
- Additional options: `--strictIndexSignatures false`, `--bannerComment ""`

**Script Specification:**
Create `scripts/generate-types.ts` to automate generation for all schema files:
```typescript
import { generateSchema } from 'json-schema-to-typescript';
import fs from 'fs/promises';
import path from 'path';

const schemas = [
  'base.schema.json',
  'package.schema.json',
  'model.schema.json',
  'workflow.schema.json',
  'cheatsheet.schema.json',
  'registry.schema.json',
  'metadata.schema.json'
];

for (const schema of schemas) {
  const schemaPath = path.join('schema/v2', schema);
  const outputPath = path.join('types', schema.replace('.schema.json', '.ts'));
  const schemaContent = await fs.readFile(schemaPath, 'utf-8');
  const schemaJson = JSON.parse(schemaContent);
  const ts = await generateSchema(schemaJson, schemaJson.title);
  await fs.writeFile(outputPath, ts);
}
```

**Package.json script:**
```json
"generate-types": "tsx scripts/generate-types.ts"
```

## Files to Create

### File 5.1: types/base.ts
**Location:** types/base.ts
**Purpose:** TypeScript types for BaseMeta
**Dependencies:** schema/v2/base.schema.json
**Public API:** Exported BaseMeta interface

**Implementation Steps:**
- [ ] Run type generator on schema/v2/base.schema.json
- [ ] Output to types/base.ts
- [ ] Review generated types
- [ ] Add JSDoc documentation
- [ ] Export BaseMeta interface

**Acceptance Criteria:**
- File exists
- Types generated from schema
- JSDoc documentation present
- BaseMeta exported

---

### File 5.2: types/package.ts
**Location:** types/package.ts
**Purpose:** TypeScript types for package content
**Dependencies:** schema/v2/package.schema.json
**Public API:** Exported Package interface

**Implementation Steps:**
- [ ] Run type generator on schema/v2/package.schema.json
- [ ] Output to types/package.ts
- [ ] Review generated types
- [ ] Add JSDoc documentation
- [ ] Export Package interface

**Acceptance Criteria:**
- File exists
- Types generated from schema
- JSDoc documentation present
- Package exported

---

### File 5.3: types/model.ts
**Location:** types/model.ts
**Purpose:** TypeScript types for model content
**Dependencies:** schema/v2/model.schema.json
**Public API:** Exported Model interface

**Implementation Steps:**
- [ ] Run type generator on schema/v2/model.schema.json
- [ ] Output to types/model.ts
- [ ] Review generated types
- [ ] Add JSDoc documentation
- [ ] Export Model interface

**Acceptance Criteria:**
- File exists
- Types generated from schema
- JSDoc documentation present
- Model exported

---

### File 5.4: types/workflow.ts
**Location:** types/workflow.ts
**Purpose:** TypeScript types for workflow content
**Dependencies:** schema/v2/workflow.schema.json
**Public API:** Exported Workflow interface

**Implementation Steps:**
- [ ] Run type generator on schema/v2/workflow.schema.json
- [ ] Output to types/workflow.ts
- [ ] Review generated types
- [ ] Add JSDoc documentation
- [ ] Export Workflow interface

**Acceptance Criteria:**
- File exists
- Types generated from schema
- JSDoc documentation present
- Workflow exported

---

### File 5.5: types/cheatsheet.ts
**Location:** types/cheatsheet.ts
**Purpose:** TypeScript types for cheatsheet content
**Dependencies:** schema/v2/cheatsheet.schema.json
**Public API:** Exported Cheatsheet interface

**Implementation Steps:**
- [ ] Run type generator on schema/v2/cheatsheet.schema.json
- [ ] Output to types/cheatsheet.ts
- [ ] Review generated types
- [ ] Add JSDoc documentation
- [ ] Export Cheatsheet interface

**Acceptance Criteria:**
- File exists
- Types generated from schema
- JSDoc documentation present
- Cheatsheet exported

---

### File 5.6: types/registry.ts
**Location:** types/registry.ts
**Purpose:** TypeScript types for registry content
**Dependencies:** schema/v2/registry.schema.json
**Public API:** Exported Registry interface

**Implementation Steps:**
- [ ] Run type generator on schema/v2/registry.schema.json
- [ ] Output to types/registry.ts
- [ ] Review generated types
- [ ] Add JSDoc documentation
- [ ] Export Registry interface

**Acceptance Criteria:**
- File exists
- Types generated from schema
- JSDoc documentation present
- Registry exported

---

### File 5.7: types/metadata.ts
**Location:** types/metadata.ts
**Purpose:** TypeScript types for metadata files
**Dependencies:** schema/v2/metadata.schema.json
**Public API:** Exported metadata interfaces

**Implementation Steps:**
- [ ] Run type generator on schema/v2/metadata.schema.json
- [ ] Output to types/metadata.ts
- [ ] Review generated types
- [ ] Add JSDoc documentation
- [ ] Export metadata interfaces

**Acceptance Criteria:**
- File exists
- Types generated from schema
- JSDoc documentation present
- Metadata interfaces exported

---

### File 5.8: types/index.ts
**Location:** types/index.ts
**Purpose:** Central export for all types
**Dependencies:** All type files
**Public API:** Re-exports all types

**Implementation Steps:**
- [ ] Create types/index.ts
- [ ] Export all types from base.ts
- [ ] Export all types from package.ts
- [ ] Export all types from model.ts
- [ ] Export all types from workflow.ts
- [ ] Export all types from cheatsheet.ts
- [ ] Export all types from registry.ts
- [ ] Export all types from metadata.ts
- [ ] Export all types from config.ts
- [ ] Verify no export conflicts

**Acceptance Criteria:**
- File exists
- All types exported
- No export conflicts
- TypeScript compiles

---

## Phase 5 Definition of Done
- [ ] All type files generated
- [ ] All types have JSDoc documentation
- [ ] types/index.ts exports all types
- [ ] TypeScript compiles without errors
- [ ] No manual type maintenance

---

# Phase 6: Validation

## Goal
Implement 4-layer validation pipeline.

## Files to Create

### File 6.1: lib/validation/layer1-schema.ts
**Location:** lib/validation/layer1-schema.ts
**Purpose:** Layer 1 - Structural validation using JSON Schema
**Dependencies:** schema/v2/*.json, ajv package
**Public API:** `validateSchema(content: any, schema: string): ValidationResult`

**TypeScript Interface:**
```typescript
export interface ValidationResult {
  valid: boolean;
  errors: Array<{
    path: string;
    message: string;
  }>;
}

export function validateSchema(content: any, schemaName: string): ValidationResult;
```

**Implementation Steps:**
- [ ] Install ajv package
- [ ] Create lib/validation/layer1-schema.ts
- [ ] Implement Ajv compilation
- [ ] Implement validateSchema function
- [ ] Add error reporting
- [ ] Support all schema files
- [ ] Test with valid content
- [ ] Test with invalid content

**Acceptance Criteria:**
- File exists
- Ajv compiles schemas
- validateSchema function works
- Error reporting is clear
- Valid content passes
- Invalid content fails with clear error

---

### File 6.2: lib/validation/layer2-constraints.ts
**Location:** lib/validation/layer2-constraints.ts
**Purpose:** Layer 2 - Constraint validation from config
**Dependencies:** lib/config/loader.ts, aens.config.json
**Public API:** `validateConstraints(content: any, contentType: string): ValidationResult`

**Implementation Steps:**
- [ ] Create lib/validation/layer2-constraints.ts
- [ ] Implement size budget checks
- [ ] Implement stability tier checks
- [ ] Implement schema version checks
- [ ] Implement content type checks
- [ ] Read constraints from config
- [ ] Add error reporting
- [ ] Test with content that violates constraints

**Acceptance Criteria:**
- File exists
- Size budgets enforced
- Stability tiers checked
- Schema versions validated
- Content types validated
- Config read correctly
- Violations reported clearly

---

### File 6.3: lib/validation/layer3-crossref.ts
**Location:** lib/validation/layer3-crossref.ts
**Purpose:** Layer 3 - Cross-reference validation
**Dependencies:** metadata/registry.json
**Public API:** `validateCrossReferences(content: any, allContent: any[]): ValidationResult`

**Implementation Steps:**
- [ ] Create lib/validation/layer3-crossref.ts
- [ ] Implement ID existence checks
- [ ] Implement ID format validation
- [ ] Implement bidirectional relationship checks
- [ ] Implement self-reference detection
- [ ] Implement circular reference detection
- [ ] Add error reporting
- [ ] Test with broken references

**Acceptance Criteria:**
- File exists
- Referenced IDs exist
- ID format validated
- Bidirectional relationships checked
- Self-references detected
- Circular references detected
- Broken references reported clearly

---

### File 6.4: lib/validation/layer4-semantic.ts
**Location:** lib/validation/layer4-semantic.ts
**Purpose:** Layer 4 - Semantic validation
**Dependencies:** metadata/tags.json, metadata/aliases.json, metadata/categories.json
**Public API:** `validateSemantic(content: any): ValidationResult`

**Implementation Steps:**
- [ ] Create lib/validation/layer4-semantic.ts
- [ ] Implement tag registration checks
- [ ] Implement alias registration checks
- [ ] Implement category validation
- [ ] Implement status consistency checks
- [ ] Implement verification date checks
- [ ] Implement deprecated object presence checks
- [ ] Add error reporting
- [ ] Test with unregistered tags/aliases

**Acceptance Criteria:**
- File exists
- Tags are registered
- Aliases are registered
- Categories are valid
- Status is consistent
- Verification dates within cadence
- Deprecated object presence correct
- Violations reported clearly

---

### File 6.5: scripts/validate.ts
**Location:** scripts/validate.ts
**Purpose:** CLI validation script
**Dependencies:** lib/validation/*.ts
**Public API:** CLI with flags

**CLI Flags:**
- `--file <path>` - Validate single file
- `--all` - Validate full repository
- `--layer <1-4>` - Selective validation

**Implementation Steps:**
- [ ] Create scripts/validate.js
- [ ] Implement CLI interface
- [ ] Add --file flag
- [ ] Add --all flag
- [ ] Add --layer flag
- [ ] Integrate all 4 layers
- [ ] Add summary reporting
- [ ] Add exit codes (0 = success, 1 = error)

**Acceptance Criteria:**
- Script exists
- CLI flags work
- Single file validation works
- Full repository validation works
- Selective layer validation works
- Summary is clear
- Exit codes correct

---

## Phase 6 Definition of Done
- [ ] All 4 validation layers implemented
- [ ] Validation script exists with CLI interface
- [ ] Each layer catches expected errors
- [ ] Valid content passes all layers
- [ ] Error messages are clear and actionable

---

# Phase 7: Content Loader

## Goal
Implement content loading, resolution, registry, and caching.

## Files to Create

### File 7.1: lib/content/loaders.ts
**Location:** lib/content/loaders.ts
**Purpose:** Content file loading
**Dependencies:** types/*.ts
**Public API:** `loadContentFile(path: string): Promise<Content>`

**Functions:**
- `loadContentFile(path: string): Promise<Content>`
- `loadContentDirectory(dir: string): Promise<Content[]>`
- `loadAllContent(): Promise<Record<string, Content[]>>`

**Implementation Steps:**
- [ ] Create lib/content/loaders.ts
- [ ] Implement loadContentFile
- [ ] Implement loadContentDirectory
- [ ] Implement loadAllContent
- [ ] Add error handling
- [ ] Add TypeScript types
- [ ] Test with sample content

**Acceptance Criteria:**
- File exists
- All functions work
- Errors handled gracefully
- TypeScript types defined
- Tests pass

---

### File 7.2: lib/content/resolvers.ts
**Location:** lib/content/resolvers.ts
**Purpose:** Content resolution by various criteria
**Dependencies:** lib/content/loaders.ts, metadata/registry.json
**Public API:** `resolveById(id: string): Promise<Content | null>`

**Functions:**
- `resolveById(id: string): Promise<Content | null>`
- `resolveBySlug(slug: string): Promise<Content | null>`
- `resolveByType(type: string): Promise<Content[]>`
- `resolveByTag(tag: string): Promise<Content[]>`
- `resolveByAlias(alias: string): Promise<Content | null>`

**Implementation Steps:**
- [ ] Create lib/content/resolvers.ts
- [ ] Implement all resolver functions
- [ ] Add caching layer
- [ ] Add error handling
- [ ] Test with sample content

**Acceptance Criteria:**
- File exists
- All resolvers work
- Caching works
- Errors handled gracefully
- Tests pass

---

### File 7.3: lib/content/registry.ts
**Location:** lib/content/registry.ts
**Purpose:** Content registration and collision detection
**Dependencies:** metadata/registry.json
**Public API:** `registerContent(content: Content): void`

**Functions:**
- `registerContent(content: Content): void`
- `unregisterContent(id: string): void`
- `getAllIds(): string[]`
- `checkCollision(id: string): boolean`

**Implementation Steps:**
- [ ] Create lib/content/registry.ts
- [ ] Implement all functions
- [ ] Integrate with metadata/registry.json
- [ ] Add error handling
- [ ] Test with sample content

**Acceptance Criteria:**
- File exists
- All functions work
- Integration with metadata works
- Errors handled gracefully
- Tests pass

---

### File 7.4: lib/content/cache.ts
**Location:** lib/content/cache.ts
**Purpose:** In-memory caching
**Dependencies:** None
**Public API:** Cache class with get/set/invalidate

**Implementation Steps:**
- [ ] Create lib/content/cache.ts
- [ ] Implement Cache class
- [ ] Implement get method
- [ ] Implement set method
- [ ] Implement invalidate method
- [ ] Implement cache warming
- [ ] Add cache statistics
- [ ] Test cache performance

**Acceptance Criteria:**
- File exists
- Cache class works
- All methods work
- Statistics available
- Performance improved

---

### File 7.5: lib/content/index.ts
**Location:** lib/content/index.ts
**Purpose:** Central export for content engine
**Dependencies:** All content files
**Public API:** Re-exports all content functions

**Implementation Steps:**
- [ ] Create lib/content/index.ts
- [ ] Export all loaders
- [ ] Export all resolvers
- [ ] Export registry functions
- [ ] Export Cache class
- [ ] Verify no export conflicts

**Acceptance Criteria:**
- File exists
- All functions exported
- No export conflicts
- TypeScript compiles

---

## Phase 7 Definition of Done
- [ ] All content engine files created
- [ ] All functions implemented
- [ ] Caching works
- [ ] Registry integration works
- [ ] TypeScript compiles
- [ ] Tests pass

---

# Phase 8: Search Engine

## Goal
Implement search indexing and search engine.

## Search Algorithm Specification

**Search Behavior:**
- Exact match on title (case-insensitive)
- Exact match on aliases (case-insensitive)
- Exact match on tags (case-insensitive)
- Substring match on keywords (case-insensitive)
- Substring match on description (case-insensitive)
- Return all matches (no ranking required)
- No fuzzy matching or scoring
- Simple array filter implementation

**Search Function API:**
```typescript
export interface SearchEntry {
  id: string;
  type: string;
  title: string;
  aliases: string[];
  tags: string[];
  description: string;
  keywords: string[];
  content_preview: string;
  category: string;
}

export function search(query: string, index: SearchEntry[]): SearchEntry[] {
  const lowerQuery = query.toLowerCase();
  return index.filter(entry => 
    entry.title.toLowerCase().includes(lowerQuery) ||
    entry.aliases.some(a => a.toLowerCase().includes(lowerQuery)) ||
    entry.tags.some(t => t.toLowerCase().includes(lowerQuery)) ||
    entry.keywords.some(k => k.toLowerCase().includes(lowerQuery)) ||
    entry.description.toLowerCase().includes(lowerQuery)
  );
}
```

**Implementation Notes:**
- No external search library required
- Simple array.filter() is sufficient
- Performance is acceptable for < 1000 entries
- Search is client-side (reads from search-index.json)

## Files to Create

### File 8.1: scripts/build-search-index.ts
**Location:** scripts/build-search-index.ts
**Purpose:** Generate search-index.json
**Dependencies:** lib/content/*.ts, content/
**Public API:** CLI script

**Output Structure:**
```json
{
  "version": "2.0",
  "generated_at": "ISO8601",
  "entries": [
    {
      "id": "type:slug",
      "type": "package",
      "title": "string",
      "aliases": ["string"],
      "tags": ["string"],
      "description": "string",
      "keywords": ["string"],
      "content_preview": "string",
      "category": "string"
    }
  ]
}
```

**Implementation Steps:**
- [ ] Create scripts/build-search-index.js
- [ ] Implement content scanning
- [ ] Implement field extraction
- [ ] Implement search entry creation
- [ ] Implement search-index.json generation
- [ ] Add version and timestamp
- [ ] Test with sample content

**Acceptance Criteria:**
- Script exists
- Content scanning works
- Field extraction works
- search-index.json generated
- Version and timestamp added
- Tests pass

---

### File 8.2: lib/search/index.ts
**Location:** lib/search/index.ts (update existing)
**Purpose:** Search engine that reads from search-index.json
**Dependencies:** search-index.json
**Public API:** Search functions

**Implementation Steps:**
- [ ] Update lib/search/index.ts
- [ ] Implement loading from search-index.json
- [ ] Remove dynamic generation
- [ ] Keep existing search logic
- [ ] Verify search works
- [ ] Verify search performance

**Acceptance Criteria:**
- File updated
- Loads from static index
- Dynamic generation removed
- Search works
- Performance acceptable

---

## Phase 8 Definition of Done
- [ ] Search index generator created
- [ ] search-index.json generated
- [ ] Search engine updated
- [ ] Search works correctly
- [ ] search-index.json committed to git

---

# Phase 9: Navigation

## Goal
Implement navigation generation.

## Files to Create

### File 9.1: scripts/build-nav.ts
**Location:** scripts/build-nav.ts
**Purpose:** Generate _nav.json files
**Dependencies:** lib/content/*.ts, content/, metadata/categories.json
**Public API:** CLI script

**Output Structure:**
```json
{
  "items": [
    {
      "id": "type:slug",
      "title": "string",
      "slug": "string",
      "category": "string"
    }
  ]
}
```

**Implementation Steps:**
- [ ] Create scripts/build-nav.js
- [ ] Implement content scanning
- [ ] Implement navigation item extraction
- [ ] Implement category assignment
- [ ] Implement _nav.json generation
- [ ] Add validation against metadata/categories.json
- [ ] Test with sample content

**Acceptance Criteria:**
- Script exists
- Content scanning works
- Navigation extraction works
- Category assignment works
- _nav.json generation works
- Validation against metadata works
- Tests pass

---

### File 9.2: Generate All Navigation Files
**Location:** content/*/_nav.json
**Purpose:** Navigation indexes for each content type
**Dependencies:** scripts/build-nav.ts
**Public API:** None (generated files)

**Implementation Steps:**
- [ ] Run navigation generator
- [ ] Generate content/packages/_nav.json
- [ ] Generate content/models/_nav.json
- [ ] Generate content/models/ml/_nav.json
- [ ] Generate content/models/dl/_nav.json
- [ ] Generate content/models/llm/_nav.json
- [ ] Generate content/workflows/_nav.json
- [ ] Generate content/cheatsheets/_nav.json
- [ ] Verify all files generated

**Acceptance Criteria:**
- All _nav.json files generated
- Files are valid JSON
- Files contain expected content
- Categories match metadata

---

## Phase 9 Definition of Done
- [ ] Navigation generator created
- [ ] All _nav.json files generated
- [ ] Navigation components updated
- [ ] Navigation works correctly

---

# Phase 10: UI Foundation

## Goal
Update UI components to use new systems.

## Component Update Requirements

### SearchBox Component Update

**Current Implementation:** SearchBox uses existing search implementation

**Required Changes:**
1. Import search function from `lib/search/index.ts`
2. Import search-index.json (read at build time or runtime)
3. Replace existing search logic with `search(query, searchIndex)` call
4. Maintain existing UI structure and styling
5. Display results using existing result component

**API Contract:**
```typescript
import { search } from '@/lib/search';
import searchIndex from '@/search-index.json';

// Search function signature
function search(query: string, index: SearchEntry[]): SearchEntry[]
```

**Acceptance Criteria:**
- Component uses new search function
- Search results display correctly
- UI styling unchanged
- Search performance acceptable

---

### Sidebar Component Update

**Current Implementation:** Sidebar reads from existing navigation structure

**Required Changes:**
1. Import navigation data from `content/packages/_nav.json`, `content/models/_nav.json`, etc.
2. Replace existing navigation data source with _nav.json files
3. Maintain existing UI structure and styling
4. Preserve expand/collapse behavior
5. Preserve active state highlighting

**API Contract:**
```typescript
import packagesNav from '@/content/packages/_nav.json';
import modelsNav from '@/content/models/_nav.json';
import workflowsNav from '@/content/workflows/_nav.json';
import cheatsheetsNav from '@/content/cheatsheets/_nav.json';

// Navigation structure (unchanged)
interface NavItem {
  id: string;
  title: string;
  category?: string;
  children?: NavItem[];
}
```

**Acceptance Criteria:**
- Component reads from _nav.json files
- Navigation displays correctly
- UI styling unchanged
- Expand/collapse works
- Active state works

## Files to Update

### File 10.1: components/shared/SearchBox.tsx
**Location:** components/shared/SearchBox.tsx (update existing)
**Purpose:** Update to use new search engine
**Dependencies:** lib/search/index.ts
**Public API:** Component props

**Implementation Steps:**
- [ ] Update SearchBox to use new search engine
- [ ] Update imports
- [ ] Verify search UI works
- [ ] Verify search results display

**Acceptance Criteria:**
- Component updated
- Uses new search engine
- Search UI works
- Results display correctly

---

### File 10.2: components/layout/Sidebar.tsx
**Location:** components/layout/Sidebar.tsx (update existing)
**Purpose:** Update to use new navigation
**Dependencies:** content/*/_nav.json
**Public API:** Component props

**Implementation Steps:**
- [ ] Update Sidebar to read new _nav.json
- [ ] Update navigation logic
- [ ] Verify navigation works
- [ ] Verify categories display

**Acceptance Criteria:**
- Component updated
- Reads new _nav.json
- Navigation works
- Categories display correctly

---

## Phase 10 Definition of Done
- [ ] UI components updated
- [ ] Components use new systems
- [ ] UI works correctly
- [ ] No visual changes

---

# Phase 11: Pages

## Goal
Update app routes to use new content engine.

## Page Update Requirements

**Current Implementation:** Pages use existing content loading mechanism

**Required Changes for All Pages:**
1. Import `resolveById` from `lib/content/resolvers.ts`
2. Replace existing data loading with `resolveById(id)` call
3. Handle null return (content not found) with 404
4. Maintain existing page structure and styling
5. Preserve existing component composition

**API Contract:**
```typescript
import { resolveById } from '@/lib/content/resolvers';

// Resolve function signature
function resolveById(id: string): Promise<Content | null>

// Usage pattern
const content = await resolveById(id);
if (!content) {
  notFound();
}
```

**Route-Specific ID Formats:**
- `app/packages/[id]/page.tsx`: Use `package:${id}` format
- `app/models/[category]/[id]/page.tsx`: Use `model:${category}:${id}` format
- `app/workflows/[id]/page.tsx`: Use `workflow:${id}` format
- `app/cheatsheets/[id]/page.tsx`: Use `cheatsheet:${id}` format
- `app/registry/[task]/page.tsx`: Use `registry:${task}` format

**Acceptance Criteria:**
- All pages use resolveById
- 404 handling works
- Page structure unchanged
- Page styling unchanged
- All routes work

## Files to Update

### File 11.1: app/packages/[id]/page.tsx
**Location:** app/packages/[id]/page.tsx (update existing)
**Purpose:** Update to use new content engine
**Dependencies:** lib/content/*.ts
**Public API:** Route component

**Implementation Steps:**
- [ ] Update imports to use new content engine
- [ ] Update data loading
- [ ] Verify route works
- [ ] Verify page renders

**Acceptance Criteria:**
- Route updated
- Uses new content engine
- Route works
- Page renders

---

### File 11.2: app/models/[category]/[id]/page.tsx
**Location:** app/models/[category]/[id]/page.tsx (update existing)
**Purpose:** Update to use new content engine
**Dependencies:** lib/content/*.ts
**Public API:** Route component

**Implementation Steps:**
- [ ] Update imports to use new content engine
- [ ] Update data loading
- [ ] Verify route works
- [ ] Verify page renders

**Acceptance Criteria:**
- Route updated
- Uses new content engine
- Route works
- Page renders

---

### File 11.3: app/workflows/[id]/page.tsx
**Location:** app/workflows/[id]/page.tsx (update existing)
**Purpose:** Update to use new content engine
**Dependencies:** lib/content/*.ts
**Public API:** Route component

**Implementation Steps:**
- [ ] Update imports to use new content engine
- [ ] Update data loading
- [ ] Verify route works
- [ ] Verify page renders

**Acceptance Criteria:**
- Route updated
- Uses new content engine
- Route works
- Page renders

---

### File 11.4: app/cheatsheets/[id]/page.tsx
**Location:** app/cheatsheets/[id]/page.tsx (update existing)
**Purpose:** Update to use new content engine
**Dependencies:** lib/content/*.ts
**Public API:** Route component

**Implementation Steps:**
- [ ] Update imports to use new content engine
- [ ] Update data loading
- [ ] Verify route works
- [ ] Verify page renders

**Acceptance Criteria:**
- Route updated
- Uses new content engine
- Route works
- Page renders

---

### File 11.5: app/registry/[task]/page.tsx
**Location:** app/registry/[task]/page.tsx (update existing)
**Purpose:** Update to use new content engine
**Dependencies:** lib/content/*.ts
**Public API:** Route component

**Implementation Steps:**
- [ ] Update imports to use new content engine
- [ ] Update data loading
- [ ] Verify route works
- [ ] Verify page renders

**Acceptance Criteria:**
- Route updated
- Uses new content engine
- Route works
- Page renders

---

## Phase 11 Definition of Done
- [ ] All app routes updated
- [ ] All routes use new content engine
- [ ] All routes work
- [ ] All pages render
- [ ] No visual changes

---

# Phase 12: Content Migration

## Goal
Migrate all content to new architecture.

## Implementation Steps

### Step 12.1: Migrate Packages
- [ ] Migrate packages from legacy/content/packages/ to content/packages/
- [ ] Update schema version to "2.0"
- [ ] Add missing BaseMeta fields
- [ ] Convert alternatives to relationships
- [ ] Add tags from metadata
- [ ] Add aliases from metadata
- [ ] Validate each package
- [ ] Fix validation errors

**Acceptance Criteria:**
- All packages migrated
- Schema version updated
- BaseMeta fields complete
- Relationships converted
- Tags registered
- Aliases registered
- All packages validate

---

### Step 12.2: Migrate Models
- [ ] Migrate models from legacy/content/models/ to content/models/
- [ ] Update schema version to "2.0"
- [ ] Add missing BaseMeta fields
- [ ] Convert alternatives to relationships
- [ ] Add tags from metadata
- [ ] Add aliases from metadata
- [ ] Validate each model
- [ ] Fix validation errors

**Acceptance Criteria:**
- All models migrated
- Schema version updated
- BaseMeta fields complete
- Relationships converted
- Tags registered
- Aliases registered
- All models validate

---

### Step 12.3: Migrate Workflows
- [ ] Migrate workflows from legacy/content/workflows/ to content/workflows/
- [ ] Update schema version to "2.0"
- [ ] Add missing BaseMeta fields
- [ ] Add mental_trigger field
- [ ] Add confirmed_env block
- [ ] Add pipeline_failure_patterns
- [ ] Convert alternatives to relationships
- [ ] Add tags from metadata
- [ ] Add aliases from metadata
- [ ] Validate each workflow
- [ ] Fix validation errors

**Acceptance Criteria:**
- All workflows migrated
- Schema version updated
- BaseMeta fields complete
- mental_trigger added
- confirmed_env added
- pipeline_failure_patterns added
- Relationships converted
- Tags registered
- Aliases registered
- All workflows validate

---

### Step 12.4: Migrate Cheatsheets
- [ ] Migrate cheatsheets from legacy/content/cheatsheets/ to content/cheatsheets/
- [ ] Update schema version to "2.0"
- [ ] Add missing BaseMeta fields
- [ ] Convert alternatives to relationships
- [ ] Add tags from metadata
- [ ] Add aliases from metadata
- [ ] Validate each cheatsheet
- [ ] Fix validation errors

**Acceptance Criteria:**
- All cheatsheets migrated
- Schema version updated
- BaseMeta fields complete
- Relationships converted
- Tags registered
- Aliases registered
- All cheatsheets validate

---

### Step 12.5: Migrate Registry
- [ ] Migrate registry from legacy/content/registry/ to content/registry/
- [ ] Update schema version to "2.0"
- [ ] Add missing BaseMeta fields
- [ ] Convert alternatives to relationships
- [ ] Add tags from metadata
- [ ] Add aliases from metadata
- [ ] Validate each registry entry
- [ ] Fix validation errors

**Acceptance Criteria:**
- All registry entries migrated
- Schema version updated
- BaseMeta fields complete
- Relationships converted
- Tags registered
- Aliases registered
- All registry entries validate

---

### Step 12.6: Regenerate Artifacts
- [ ] Run navigation generator
- [ ] Run search index generator
- [ ] Verify all artifacts updated

**Acceptance Criteria:**
- Navigation regenerated
- Search index regenerated
- All artifacts updated

---

## Phase 12 Definition of Done
- [ ] All content migrated
- [ ] All content validates
- [ ] All relationships converted
- [ ] All tags and aliases registered
- [ ] Artifacts regenerated
- [ ] Application builds
- [ ] Application runs

---

# Phase 13: Testing

## Goal
Comprehensive testing and validation.

## Implementation Steps

### Step 13.1: Validation Audit
- [ ] Run full repository validation
- [ ] Verify no validation errors
- [ ] Fix any errors
- [ ] Re-run until clean

**Acceptance Criteria:**
- Validation passes with zero errors
- All content validates

---

### Step 13.2: Search Audit
- [ ] Verify all content is searchable
- [ ] Test search by title
- [ ] Test search by alias
- [ ] Test search by tag
- [ ] Test search by keyword
- [ ] Fix any issues

**Acceptance Criteria:**
- All content searchable
- All search methods work
- No missing content

---

### Step 13.3: Link Audit
- [ ] Run link checker
- [ ] Verify all external links resolve
- [ ] Verify all internal references resolve
- [ ] Fix broken links

**Acceptance Criteria:**
- No broken external links
- No broken internal references

---

### Step 13.4: Relationship Audit
- [ ] Verify bidirectional relationships
- [ ] Verify no self-references
- [ ] Verify no circular references
- [ ] Verify all referenced IDs exist

**Acceptance Criteria:**
- All relationships bidirectional
- No self-references
- No circular references
- All referenced IDs exist

---

### Step 13.5: Performance Audit
- [ ] Measure search index generation time
- [ ] Measure navigation generation time
- [ ] Measure validation time
- [ ] Measure page load time
- [ ] Verify performance acceptable

**Acceptance Criteria:**
- Search index generation < 5 seconds
- Navigation generation < 2 seconds
- Validation < 10 seconds
- Page load < 2 seconds

---

### Step 13.6: UI/UX Consistency Audit
- [ ] Compare pre-rebuild screenshots
- [ ] Verify visual consistency
- [ ] Verify navigation behavior
- [ ] Verify search behavior
- [ ] Fix any inconsistencies

**Acceptance Criteria:**
- UI visually consistent
- Navigation behavior consistent
- Search behavior consistent

---

## Phase 13 Definition of Done
- [ ] All audits pass
- [ ] No validation errors
- [ ] No broken links
- [ ] No relationship errors
- [ ] Performance acceptable
- [ ] UI/UX consistent

---

# Phase 14: Polish

## Goal
Performance optimization and cleanup.

## Implementation Steps

### Step 14.1: Build Process Integration
- [ ] Add navigation generation to build script
- [ ] Add search index generation to build script
- [ ] Add validation to build script
- [ ] Add pre-commit hooks
- [ ] Verify build process works

**Acceptance Criteria:**
- Build process regenerates artifacts
- Pre-commit hooks configured
- Build succeeds

---

### Step 14.2: Legacy Cleanup
- [ ] Move old systems to legacy/
- [ ] Verify no production code depends on legacy/
- [ ] Document legacy systems
- [ ] Verify build succeeds

**Acceptance Criteria:**
- Old systems in legacy/
- No production dependencies on legacy/
- Legacy documented
- Build succeeds

---

### Step 14.3: Documentation Update
- [ ] Update README.md
- [ ] Update CONTRIBUTING.md
- [ ] Document new architecture
- [ ] Document build process
- [ ] Document validation process

**Acceptance Criteria:**
- README updated
- CONTRIBUTING updated
- Architecture documented
- Build process documented
- Validation documented

---

## Phase 14 Definition of Done
- [ ] Build process integrated
- [ ] Legacy cleaned up
- [ ] Documentation updated
- [ ] Repository ready for production

---

# Final Definition of Done

The rebuild is complete only if:

- [ ] All 14 phases complete
- [ ] All files created per blueprint
- [ ] All acceptance criteria met
- [ ] All audits pass
- [ ] No production code depends on legacy/
- [ ] UI/UX visually consistent
- [ ] Documentation updated
- [ ] Build process integrated

---

# Build Order Dependencies

```
Phase 1 (Skeleton)
    ↓
Phase 2 (Configuration)
    ↓
Phase 3 (Schema)
    ↓
Phase 4 (Metadata) ← depends on Phase 3
    ↓
Phase 5 (Types) ← depends on Phase 3
    ↓
Phase 6 (Validation) ← depends on Phase 2, 3, 4, 5
    ↓
Phase 7 (Content Loader) ← depends on Phase 5
    ↓
Phase 8 (Search) ← depends on Phase 7
    ↓
Phase 9 (Navigation) ← depends on Phase 4, 7
    ↓
Phase 10 (UI) ← depends on Phase 8, 9
    ↓
Phase 11 (Pages) ← depends on Phase 7, 10
    ↓
Phase 12 (Migration) ← depends on Phase 4, 5, 6, 7, 8, 9
    ↓
Phase 13 (Testing) ← depends on Phase 12
    ↓
Phase 14 (Polish) ← depends on Phase 13
```

---

# Validation Checkpoints

After each phase, run validation:

- **After Phase 2:** Config loads and validates
- **After Phase 3:** All schemas valid JSON Schema 2020-12
- **After Phase 4:** TypeScript compiles without errors
- **After Phase 5:** Validation pipeline works on test content
- **After Phase 6:** Metadata files validate against schema
- **After Phase 7:** Content engine loads sample content
- **After Phase 8:** Search index generates successfully
- **After Phase 9:** Navigation generates successfully
- **After Phase 10:** UI components render without errors
- **After Phase 11:** All routes render without errors
- **After Phase 12:** All migrated content validates
- **After Phase 13:** All audits pass
- **After Phase 14:** Build process works end-to-end

---

# No Implementation Decisions

This blueprint specifies every file, every directory, every dependency, every API.

**AI agents should not make implementation decisions.** They should only implement what is specified here.

If something is not specified in this blueprint:

1. Check governing documents (AENS_REBUILD_MASTER_PLAN.md, REPOSITORY_FOUNDATION_SPECIFICATION_v2.md, AI_EXECUTION_PROTOCOL.md)
2. If still not specified, ask user for clarification
3. Do not make assumptions
4. Do not invent architecture

---

# Blueprint Versioning

This blueprint follows semantic versioning:

**Major (X.0):** Phase structure changes
**Minor (0.X):** File additions or modifications
**Patch (0.0.X):** Clarifications, corrections

Current version: **1.0**

---

# Change Process

1. Propose change via ADR
2. Update this blueprint
3. Update governing documents if affected
4. Communicate changes to all AI agents

No blueprint changes without ADR. No blueprint changes without updating this document.
